atom.declare('Balls.Controller', {
    initialize: function(settings) {
        this.settings = new atom.Settings(settings);

        this.size   = this.getSize();
        this.width  = this.size.x + 200;
        this.height = this.size.y + 20;

        this.app = new App({
            size: new Size(this.width, this.height)
        });

        var layer = this.app.createLayer({name: 'loading', intersection: 'manual', zIndex: 100});

        var loading = new Loading(layer);

        this.colors = 'white silver gray black red maroon yellow olive lime green aqua teal blue navy fuchsia purple orange';
        this.backs  = 'sky colorful 1 2 3 4 5 a1 Green5 hd2';

        var preloader = atom.ImagePreloader.run({
            back_1:        'backgrounds/1.jpg',
            back_2:        'backgrounds/2.jpg',
            back_3:        'backgrounds/3.jpg',
            back_4:        'backgrounds/4.jpg',
            back_5:        'backgrounds/5.jpg',
            back_sky:      'backgrounds/sky.jpg',
            back_colorful: 'backgrounds/colorful.jpg',
            back_Green5:   'backgrounds/Green-Abstract-Wallpapers-5.jpg',
            back_hd2:      'backgrounds/hd-abstract-wallpapers-2.jpg',
            back_a1:       'backgrounds/a1.jpg',

            glow: 'glow.png',

            ball_white:  'balls.png [100:100]{0:0}',
            ball_silver: 'balls.png [100:100]{0:1}',
            ball_gray:   'balls.png [100:100]{0:2}',
            ball_black:  'balls.png [100:100]{0:3}',
            ball_red:    'balls.png [100:100]{0:4}',
            ball_maroon: 'balls.png [100:100]{0:5}',
            ball_yellow: 'balls.png [100:100]{0:6}',
            ball_olive:  'balls.png [100:100]{0:7}',
            ball_lime:   'balls.png [100:100]{0:8}',
            ball_green:  'balls.png [100:100]{0:9}',
            ball_aqua:   'balls.png [100:100]{0:10}',
            ball_teal:   'balls.png [100:100]{0:11}',
            ball_blue:   'balls.png [100:100]{0:12}',
            ball_navy:   'balls.png [100:100]{0:13}',
            ball_fuchsia:'balls.png [100:100]{0:14}',
            ball_purple: 'balls.png [100:100]{0:15}',
            ball_orange: 'balls.png [100:100]{0:16}'
        }, this.start.bind(this));

        preloader.events.add('progress', function () {
            loading.setValue(this.progress);
        });
    },

    start: function (images) {
        var layerMain, layerScore, layerGame, back, stats, title, field, game;

        this.app.settings.set('resources', {
            colors: this.colors.split(' '),
            backs:  this.backs.split(' '),
            images: images
        });

        layerMain = this.app.createLayer({intersection: 'manual', size: new Size(this.width, this.height), zIndex: 0, name: 'main'});

        back = new Back(layerMain);

        layerScore = this.app.createLayer({intersection: 'auto', size: new Size(170, 105), zIndex: 10, name: 'score'});
        layerScore.dom.addShift(new Point(this.width + 20, 10));

        stats = new Stats(layerScore);

        layerGame = this.app.createLayer({intersection: 'all', size: new Size(this.size.x, this.size.y + 10), zIndex: 20, name: 'game'});
        layerGame.dom.addShift(new Point((this.width - this.size.x) / 2, 0));

        field = new Field(layerGame, {
            size:   this.settings.get('size'),
            tile:   this.settings.get('tile'),
            from:   new Point(0, 10),
            zIndex: 0
        });

        title = new Title(layerGame, {
            zIndex: 20
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

    getSize: function() {
        var tile = this.settings.get('tile');
        var size = this.settings.get('size');

        return new Size(
            size.x * (tile.width  + tile.margin) + tile.margin,
            size.y * (tile.height + tile.margin) + tile.margin
        );
    }
});