atom.declare('Tile', {
    tileShape: function(position) {
        return new Rectangle({
            from: this.translatePoint(position),
            size: this.settings.get('tile')
        });
    },

    translatePoint: function(position) {
        var tile = this.settings.get('tile');

        var x = position.x * (tile.width  + tile.margin) + tile.margin;
        var y = position.y * (tile.height + tile.margin) + tile.margin;

        return new Point(x, y);
    }
});