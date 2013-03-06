/** @class Balls.Info */

atom.declare('Balls.Info', App.Element, {

    settings: { hidden: true },

    configure: function () {
        this.bindMethods(['show', 'hide']);

        this.text  = '';
        this.shape = new Rectangle(0, 0, 70, 25);
    },

    updateShape: function (from) {
        this.shape.moveTo(from).move([10, 10]);
    },

    show: function () {
        this.settings.set({ hidden: false });
        this.redraw();
    },

    hide: function () {
        this.settings.set({ hidden: true });
        this.redraw();
    },

    renderTo: function (ctx) {
        ctx.fill(this.shape, 'white')
        .strokeRect(this.shape)
        .text({
            to   :    this.shape,
            text :    this.text,
            color:    'black',
            align:    'center',
            optimize: true,
            weight:   'bold',
            padding:  0
        });
    }
});