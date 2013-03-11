atom.declare('Field', App.Element, {
    configure: function() {
        this.size  = this.layer.settings.get('size');
        this.shape = new Rectangle(this.settings.get('from'), new Point(this.size.x, this.size.y));

        var size = this.settings.get('size');

        var y, x, position, odd;

        for (y = 0; y < size.y; y++) {
            odd = y % 2 ;

            for (x = 0; x < size.x; x++) {
                position = new Point(x, y);

                odd = !odd;

                new Tile(this.layer, {
                    position: position,
                    shape:    this.tileShape(position),
                    zIndex:   this.zIndex + 5,
                    odd:      odd
                });
            }
        }

        this.redraw();
    },

    tileShape: function(position) {
        return new Rectangle({
            from: this.translatePoint(position).move(this.shape.from),
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