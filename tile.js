atom.declare('Tile', App.Element, {
    configure: function() {
        this.opacity = this.settings.get('odd') ? 0.5 : 0.6;
    },

    renderTo: function (ctx) {
        ctx.set({opacity: this.opacity}).fill(this.shape, 'grey');
    }
});