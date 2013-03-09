atom.declare('Tile', App.Element, {
    configure: function() {
        this.opacity = this.settings.get('odd') ? 0.6 : 0.5;
    },

    renderTo: function (ctx) {
        ctx.set({opacity: this.opacity}).fill(this.shape, 'black');
    }
});