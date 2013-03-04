atom.declare('Field', Tile, {
	initialize: function(app, settings) {
		this.settings = new atom.Settings(settings);

        this.create(app);
	},

    create: function(app) {
		var layer = app.createLayer({name: 'field', zIndex: 0});

        var size = this.settings.get('size');

        var y, x, position, odd;

        for (y = 0; y < size.y; y++) {
            odd = y % 2 ;

            for (x = 0; x < size.x; x++) {
                position = new Point(x, y);

                odd = !odd;

                new Field.Tile(layer, {
                    position: position,
                    shape:    this.tileShape(position),
                    odd:      odd
                });
            }
        }
    }
});