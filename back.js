/** @class Back */

atom.declare('Back', App.Element, {
    configure: function () {
        this.animate = new atom.Animatable(this).animate;

        this.res   = this.layer.app.settings.get('resources');
        this.size  = this.layer.app.settings.get('size');
        this.shape = new Rectangle(0, 0, this.size.x, this.size.y);

        this.opacity = 0;
    },

    crop: function() {
        var width_factor  = this.size.x / this.image.width;
        var height_factor = this.size.y / this.image.height;

        var scale = width_factor < height_factor ? height_factor : width_factor;

        var new_width  = Math.ceil(this.image.width * scale);
        var new_height = Math.ceil(this.image.height * scale);

        var left = Math.round((new_width - this.size.x) / 2 / scale);
        var top  = Math.round((new_height - this.size.y) / 2 / scale);

        this.from = new Point(left, top);
        this.to   = new Point(this.image.width - left, this.image.height - top);
    },

    update: function (alpha) {
        if (alpha) {
            this.image = this.res.images.get(this.res.backs.clone().popRandom());

            this.crop();
        }

        var opacity = this.opacity;

        this.animate({
            props: {
                opacity: alpha ? alpha : 0
            },
            onTick: this.redraw,
            onComplete: function() {
                if (!alpha) {
                    this.update(1);
                }
            }.bind(this)
        });
    },

	renderTo: function (ctx) {
		ctx.set({opacity: this.opacity}).drawImage({
            image:    this.image,
            crop :    [this.from, this.to],
            draw :    this.shape,
            optimize: true
        }).set({opacity: 1});
	}
});