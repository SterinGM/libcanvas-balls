atom.declare('Balls.Controller', {
    initialize: function(settings) {
        this.settings = new atom.Settings(settings);

        atom.ImagePreloader.run({
            white:   'balls.png [15:15:120:120]',
            red:     'balls.png [15:165:120:120]',
            yellow:  'balls.png [15:315:120:120]',
            orange:  'balls.png [15:473:120:120]',
            blue:    'balls.png [15:615:120:120]',
            magenta: 'balls.png [15:765:120:120]',
            green:   'balls.png [15:915:120:120]'
        }, this.start.bind(this));
    },

    start: function (images) {
        var app, layer, mouse;

        this.images = images;

//        this.sounds = new Balls.Sounds('/mp3/');

        app = new App({
            size: this.size()
        });

        this.createField(app);

        this.layer = app.createLayer({intersection: 'manual', name: 'balls', zIndex: 1});

        this.generate();
    },

    createField: function(app) {
        var layerFiels = app.createLayer({name: 'field', zIndex: 0});

        var size = this.settings.get('size');

        var
            y, x, position, odd;

        for (y = 0; y < size.y; y++) {
            odd = y % 2 ;

            for (x = 0; x < size.x; x++) {
                position = new Point(x, y);

                odd = !odd;

                new Balls.Field(layerFiels, {
                    position: position,
                    shape:    this.tileShape(position),
                    odd:      odd
                });
            }
        }
    },

    size: function() {
        var tile = this.settings.get('tile');
        var size = this.settings.get('size');

        return new Size(
            size.x * (tile.width  + tile.margin) + tile.margin,
            size.y * (tile.height + tile.margin) + tile.margin
        );
    },

    generate: function() {
        var size = this.settings.get('size');

        var
            i, y, x, position,
            balls = {};

        this.balls = atom.array.fillMatrix(size.x, size.y, 0);

        for (y = size.y - 1; y >= 0; y--) {
            for (x = 0; x < size.x; x++) {
                var position = new Point(x, y);

                this.balls[y][x] = this.createTile(this.layer, position);
            }
        }

        this.fallBalls();

        return this;
    },

    fallBalls: function() {
        var size = this.settings.get('size');

        for (x = 0; x < size.x; x++) {
            for (y = size.y - 1; y >= 0; y--) {
                if (this.balls[y][x] && !this.balls[y][x].stable) {
                    this.balls[y][x].fall();

                    break;
                }
            }
        }
    },

    createTile: function(layer, position) {
        var size = this.settings.get('size');
        var colors = ['white', 'red', 'green', 'blue', 'yellow', 'orange', 'magenta'];

        var pos = new Point(position.x, position.y - size.y - 1);

        var tile = new Balls.Ball(layer, {
            from:       pos,
            position:   position,
            shape:      this.tileShape(pos),
            image:      this.images.get(colors.popRandom()),
            controller: this
        });

//		this.mouseHandler.subscribe(tile);
//
//		tile.events.add( 'mousedown', function (e) {
//			e.preventDefault();
//			this.move( tile );
//		}.bind(this));

        return tile;
    },

    tileShape: function(position) {
        return new Rectangle({
            from: this.translatePoint(position),
            size: this.settings.get('tile')
        });
    },

    translatePoint: function(position) {
        var tile = this.settings.get('tile');

        return new Point(position.x * (tile.width + tile.margin) + tile.margin, position.y * (tile.height + tile.margin) + tile.margin);
    }
});