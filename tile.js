atom.declare('Tile', App.Element, {
    configure: function() {
        this.opacity = this.settings.get('odd') ? 0.6 : 0.5;
    },

    renderTo: function (ctx) {
        ctx.save();

        ctx.set({opacity: this.opacity});
        ctx.fill(this.shape, 'black');

        ctx.restore();
    }
});