/** @class Title */

atom.declare('Title', App.Element, {
    configure: function () {
        this.animate = new atom.Animatable(this).animate;

        this.padding = Math.round(this.shape.height / 3);

        this.size = Math.round(this.shape.height / 10);
    },

    show: function (text, show) {
        this.text     = text;
        this.opacity  = 0;
        this.fontSize = 0;

        var fontSize = this.fontSize;
        var opacity  = this.opacity;
        var title    = this;

        this.animate({
            time: 200,
            fn: 'back-out',
			props: {
				opacity:  1,
                fontSize: this.size
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
        ctx.set({opacity: this.opacity}).text({
            to   :    this.shape,
            text :    this.text,
            color:    'white',
            size:     this.fontSize,
            align:    'center',
            optimize: true,
            weight:   'bold',
            padding:  this.padding,
            shadow:   '4 4 10 red'
        }).set({opacity: 1});
    }
});
