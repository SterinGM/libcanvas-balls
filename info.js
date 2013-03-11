/** @class Balls.Info */

atom.declare('Balls.Info', App.Element, {

    settings: { hidden: true },

    configure: function () {
        this.bindMethods(['show', 'hide']);

        this.width  = 70;
        this.height = 25;
        this.text   = '';
        this.size   = this.layer.settings.get('size');
        this.shape  = new RoundedRectangle(0, 0, this.width, this.height).setRadius(5);
    },

    get ball() {
        return this.settings.get('ball');
    },

    updateShape: function (from) {
        var x = (from.x + this.width  + 20) > this.size.x ? (-this.width  - 10) : 10;
        var y = (from.y + this.height + 20) > this.size.y ? (-this.height - 10) : 10;

        this.shape.moveTo(from).move([x, y]);
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
        ctx.set({opacity: 0.8})
            .fill(this.shape, this.ball.color)
            .stroke(this.shape)
            .text({
                to   :    this.shape,
                text :    this.text,
                color:    'black',
                align:    'center',
                optimize: true,
                weight:   'bold',
                padding:  0,
                shadow:   '0 0 3 white'
            }).set({opacity: 1});
    }
});