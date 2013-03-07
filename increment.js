/** @class Increment */

atom.declare('Increment', App.Element, {
    configure: function () {
        this.animatable = new atom.Animatable(this);
        this.animate    = this.animatable.animate;

        this.value   = 0;
        this.current = 0;
    },

    increment: function () {
        this.animatable.stop();

        var current = this.current;
        var delta   = this.value - this.current;

        this.animate({
            time: (delta > 20 ? 20 : delta) * 50,
			props: {
                current: this.value
            },
			onTick: this.redraw,
			onComplete: this.redraw
		});
    },

	renderTo: function (ctx) {
		ctx.set({globalAlpha: 1}).text({
                to   :    this.shape,
                text :    Math.ceil(this.current) + '  ',
                color:    this.settings.get('color'),
                size:     22,
                align:    'right',
                optimize: true,
                weight:   'bold',
                padding:  0,
                shadow:   '1 1 1 black'
            });
	}
});