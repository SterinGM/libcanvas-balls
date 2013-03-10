atom.declare('Balls.Controller', {
    initialize: function(settings) {
        this.settings = new atom.Settings(settings);

        this.colors = [
            'white',
            'silver',
            'gray',
            'black',
            'red',
            'maroon',
            'yellow',
            'olive',
            'lime',
            'green',
            'aqua',
            'teal',
            'blue',
            'navy',
            'fuchsia',
            'purple',
            'orange'
        ];

        this.backs = [
            'back1', 'back2'
        ];

        atom.ImagePreloader.run({
            back1:   'sky.jpg',
            back2:   'colorful.jpg',

            glow:   'glow.png',

            white:  'balls.png [100:100]{0:0}',
            silver: 'balls.png [100:100]{0:1}',
            gray:   'balls.png [100:100]{0:2}',
            black:  'balls.png [100:100]{0:3}',
            red:    'balls.png [100:100]{0:4}',
            maroon: 'balls.png [100:100]{0:5}',
            yellow: 'balls.png [100:100]{0:6}',
            olive:  'balls.png [100:100]{0:7}',
            lime:   'balls.png [100:100]{0:8}',
            green:  'balls.png [100:100]{0:9}',
            aqua:   'balls.png [100:100]{0:10}',
            teal:   'balls.png [100:100]{0:11}',
            blue:   'balls.png [100:100]{0:12}',
            navy:   'balls.png [100:100]{0:13}',
            fuchsia:'balls.png [100:100]{0:14}',
            purple: 'balls.png [100:100]{0:15}',
            orange: 'balls.png [100:100]{0:16}'
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
            image:  this.images.get(this.backs.popRandom()),
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