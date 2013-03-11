atom.declare('Balls.Controller', {
    initialize: function(settings) {
        this.settings = new atom.Settings(settings);

        this.colors = 'white silver gray black red maroon yellow olive lime green aqua teal blue navy fuchsia purple orange';
        this.backs  = 'back_sky back_colorful back_1 back_2 back_3 back_4 back_5 a1 Green5 hd2';

        atom.ImagePreloader.run({
            back_1:        'backgrounds/1.jpg',
            back_2:        'backgrounds/2.jpg',
            back_3:        'backgrounds/3.jpg',
            back_4:        'backgrounds/4.jpg',
            back_5:        'backgrounds/5.jpg',
            back_sky:      'backgrounds/sky.jpg',
            back_colorful: 'backgrounds/colorful.jpg',
            Green5:        'backgrounds/Green-Abstract-Wallpapers-5.jpg',
            hd2:           'backgrounds/hd-abstract-wallpapers-2.jpg',
            a1:            'backgrounds/a1.jpg',

            glow: 'glow.png',

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
        var app, layerMain, layerScore, layerPopup, layerGame, back, stats, title, field, game;

        var size   = this.size();
        var width  = size.x + 200;
        var height = size.y + 20;

        app = new App({
            size: new Size(width, height),
            resources: {
                colors: this.colors.split(' '),
                backs:  this.backs.split(' '),
                images: images
            }
        });

        layerMain = app.createLayer({intersection: 'auto', size: new Size(width, height), zIndex: 0, name: 'main'});

        back = new Back(layerMain);

        layerScore = app.createLayer({intersection: 'auto', size: new Size(170, 105), zIndex: 10, name: 'score'});
        layerScore.dom.addShift(new Point(size.x + 20, 10));

        stats = new Stats(layerScore);

        layerPopup = app.createLayer({intersection: 'manual', size: new Size(size.x, height), zIndex: 30, name: 'popup'});
        layerPopup.dom.addShift(new Point(10, 0));

        title = new Title(layerPopup);

        layerGame = app.createLayer({intersection: 'all', size: new Size(size.x, size.y + 10), zIndex: 20, name: 'game'});
        layerGame.dom.addShift(new Point(10, 0));

        field = new Field(layerGame, {
            size:   this.settings.get('size'),
            tile:   this.settings.get('tile'),
            from:   new Point(0, 10),
            zIndex: 0
        });

        game = new Game(layerGame, {
            size:   this.settings.get('size'),
            tile:   this.settings.get('tile'),
            shape:  field.shape,
            stats:  stats,
            back:   back,
            title:  title,
            zIndex: 10
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