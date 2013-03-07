/** @class Balls.Score */

atom.declare('Balls.Score', App.Element, {

    settings: { hidden: true },

    configure: function () {
        this.animate = new atom.Animatable(this).animate;

        this.bindMethods(['show', 'hide']);

        this.width  = 50;
        this.height = 25;
        this.text   = '';
        this.color  = 'black';
        this.size   = this.layer.app.settings.get('size');
        this.shape  = new Rectangle(0, 0, this.width, this.height);
    },

    get ball() {
        return this.settings.get('ball');
    },

    updateShape: function (from) {
        this.shape.moveTo(from).move([-25, -10]);
    },

    show: function () {
        this.settings.set({ hidden: false });
        this.redraw();
    },

    hide: function () {
        this.settings.set({ hidden: true });
        this.redraw();
    },

    fade: function () {
        this.color = this.ball.color;

        this.show();

        this.animate({
			props: {
				'shape.from.y': this.shape.from.y - 50
			},
			onTick: this.redraw,
			onComplete: this.hide
		});
    },

    renderTo: function (ctx) {
        ctx.text({
            to   :    this.shape,
            text :    this.text,
            color:    this.color,
            size:     22,
            align:    'center',
            optimize: true,
            weight:   'bold',
            padding:  0,
            shadow: '1 1 1 black'
        });
    }
});
