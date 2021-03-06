/** @class Title */

atom.declare('Title', App.Element, {
    configure: function () {
        this.animate = new atom.Animatable(this).animate;

        this.size  = this.layer.settings.get('size');
        this.shape = new Rectangle(0, 0, this.size.x, this.size.y);

        this.padding = Math.round(this.shape.height / 3);

        this.font = Math.round(this.shape.height / 10);
    },

    show: function (text, show) {
        this.text     = text;
        this.opacity  = 0;
        this.fontSize = 0;

        var title = this;

        this.animate({
            time: 300,
            fn: 'back-out',
			props: {
				opacity:  1,
                fontSize: this.font
			},
			onTick: this.redraw,
			onComplete: function() {
                if (show) {
                    this.redraw();
                } else {
                    setTimeout(function () {
                        title.animate({
                            time: 200,
                            props: {
                                opacity:  0,
                                fontSize: 0
                            },
                            onTick: title.redraw,
                            onComplete: title.redraw
                        });
                    }, 1000);
                }
            }.bind(this)
		});
    },

    renderTo: function (ctx) {
        ctx.save();

        ctx.set({opacity: this.opacity});
        ctx.text({
            to   :    this.shape,
            text :    this.text,
            color:    'white',
            size:     this.fontSize,
            align:    'center',
            optimize: true,
            weight:   'bold',
            padding:  this.padding,
            shadow:   '4 4 10 red'
        });

        ctx.restore();
    }
});
