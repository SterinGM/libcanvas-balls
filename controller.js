atom.declare('Balls.Controller', {
    initialize: function(settings) {
        this.settings = new atom.Settings(settings);

        this.colors = [
            'red',
            'green',
            'blue',
            'yellow'
        ];

        atom.ImagePreloader.run({
            back1:   'sky.jpg',
            back2:   'colorful.jpg',

            red:    'balls.png [15:165:120:120]',
            yellow: 'balls.png [15:315:120:120]',
            blue:   'balls.png [15:615:120:120]',
            green:  'balls.png [15:915:120:120]',

            red_hover:    'balls.png [170:170:110:110]',
            yellow_hover: 'balls.png [170:320:110:110]',
            blue_hover:   'balls.png [170:620:110:110]',
            green_hover:  'balls.png [170:920:110:110]'
        }, this.start.bind(this));
    },

    start: function (images) {
        var app, layer;

        this.images = images;

        var size   = this.size();
        var width  = size.x + 200;
        var height = size.y + 20;

        app = new App({
            size:   new Size(width, height),
            simple: true,
            resources: {
                colors: this.colors,
                images: this.images
            }
        });

        this.layer = app.createLayer({intersection: 'all'});

        this.back = new Back(this.layer, {
            image:  this.images.get('back2'),
            zIndex: 10
        });

        this.stats = new Stats(this.layer, {
            from:   new Point(size.x + 20, 10),
            to:     new Point(size.x + 200 - 10, 115),
            zIndex: 20
        });

        this.field = new Field(this.layer, {
            size:   this.settings.get('size'),
            tile:   this.settings.get('tile'),
            shape:  new Rectangle(10, 10, size.x, size.y),
            zIndex: 30
        });

        this.game = new Game(this.layer, {
            size:   this.settings.get('size'),
            tile:   this.settings.get('tile'),
            shape:  this.field.shape,
            stats:  this.stats,
            zIndex: 40
        });
    },

    size: function() {
        var tile = this.settings.get('tile');
        var size = this.settings.get('size');

        return new Size(
            size.x * (tile.width  + tile.margin) + tile.margin,
            size.y * (tile.height + tile.margin) + tile.margin
        );
    }
});