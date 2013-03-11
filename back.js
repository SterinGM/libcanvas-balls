/** @class Back */

atom.declare('Back', App.Element, {
    configure: function () {
        this.animate = new atom.Animatable(this).animate;

        this.res   = this.layer.app.settings.get('resources');
        this.size  = this.layer.settings.get('size');
        this.shape = new Rectangle(0, 0, this.size.x, this.size.y);

        this.opacity   = 1;
        this.image     = null;
        this.old       = null;
        this.imageCrop = null;
        this.oldCrop   = null;

        this.getImage();
        this.redraw();
    },

    getImage: function() {
        this.image = this.res.images.get(this.res.backs.clone().popRandom());

        var width_factor  = this.size.x / this.image.width;
        var height_factor = this.size.y / this.image.height;

        var scale = width_factor < height_factor ? height_factor : width_factor;

        var new_width  = Math.ceil(this.image.width * scale);
        var new_height = Math.ceil(this.image.height * scale);

        var left = Math.round((new_width - this.size.x) / 2 / scale);
        var top  = Math.round((new_height - this.size.y) / 2 / scale);

        this.imageCrop = [new Point(left, top), new Point(this.image.width - left, this.image.height - top)];
    },

    update: function () {
        this.old     = this.image;
        this.oldCrop = this.imageCrop;

        this.getImage();

        this.opacity = 0;

        var opacity = this.opacity;

        this.animate({
            time: 1000,
            props: {
                opacity: 1
            },
            onTick: this.redraw,
            onComplete: this.redraw
        });
    },

	renderTo: function (ctx) {
        if (this.old) {
            ctx.set({opacity: 1}).drawImage({
                image:    this.old,
                crop :    this.oldCrop,
                draw :    this.shape,
                optimize: true
            });
        }

		ctx.set({opacity: this.opacity}).drawImage({
            image:    this.image,
            crop :    this.imageCrop,
            draw :    this.shape,
            optimize: true
        }).set({opacity: 1});
	}
});