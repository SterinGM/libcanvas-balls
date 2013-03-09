/** @class Back */

atom.declare('Back', App.Element, {
    configure: function () {
        this.image = this.settings.get('image');
        this.size  = this.layer.app.settings.get('size');
        this.shape = new Rectangle(0, 0, this.size.x, this.size.y);

        this.crop();
        this.redraw();
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

	renderTo: function (ctx) {
		ctx.drawImage({
            image:    this.image,
            crop :    [this.from, this.to],
            draw :    this.shape,
            optimize: true
        });
	}
});