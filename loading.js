/** @class Loading */

atom.declare('Loading', App.Element, {
    configure: function () {
        this.animatable = new atom.Animatable(this);
        this.animate    = this.animatable.animate;

        this.value   = 0;
        this.opacity = 1;
        this.size    = this.layer.app.container.currentSize;
        this.shape   = new Rectangle(0, 0, this.size.x, this.size.y);

        this.redraw();
    },

    setValue: function (value) {
        this.animatable.stop();

        this.animate({
            props: {
                value: (value ? value : 0) * 100
            },
            onTick: this.redraw,
            onComplete: function() {
                this.redraw();

                if (this.value === 100) {
                    this.animate({
                        time: 1000,
                        props: {
                            opacity: 0
                        },
                        onTick: this.redraw,
                        onComplete: this.redraw
                    });
                }
            }.bind(this)
        });
    },

	renderTo: function (ctx) {
        ctx.save();

		ctx.set({opacity: this.opacity});
        ctx.fill(this.shape, 'black');
        ctx.text({
            to   :    this.shape,
            text :    'Loading: ' + Math.round(this.value) + '%',
            color:    'white',
            align:    'center',
            optimize: true,
            padding:  this.size.y / 2.5
        });

        ctx.restore();
	}
});