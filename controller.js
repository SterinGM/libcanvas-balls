atom.declare('Balls.Controller', {
    initialize: function(settings) {
        this.settings = new atom.Settings(settings);

        this.bindMethods(['isValidPoint']);

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

        app = new App({
            size: this.size()
        });

        this.createField(app);

        mouse = new Mouse(app.container.bounds);

        this.mouseHandler = new App.MouseHandler({mouse: mouse, app: app});

        this.layer = app.createLayer({name: 'balls', zIndex: 1});

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
            y, x, position,
            balls = {};

        this.balls = atom.array.fillMatrix(size.x, size.y, null);

        for (y = size.y - 1; y >= 0; y--) {
            for (x = 0; x < size.x; x++) {
                var position = new Point(x, y);

                this.balls[y][x] = this.createBall(this.layer, position);
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

    createBall: function(layer, position) {
        var size = this.settings.get('size');
        var colors = ['white', 'red', 'green', 'blue', 'yellow', 'orange', 'magenta'];

        var color = colors.popRandom();
        var pos = new Point(position.x, position.y - size.y - 1);

        var ball = new Balls.Ball(layer, {
            from:       pos,
            position:   position,
            shape:      this.tileShape(pos),
            image:      this.images.get(color),
            color:      color,
            controller: this
        });

        this.mouseHandler.subscribe(ball);

        ball.events.add('mousedown', function (e) {
            e.preventDefault();

            this.click(ball);
        }.bind(this));

        return ball;
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
    },

    dropBalls: function() {
    },

    click: function(ball) {
        this.count     = 0;
        this.hidden    = 0;
        this.selection = [];

        this.check(ball, ball.color);

        this.selection.forEach(function(arr) {
            arr.forEach(function(ball) {
                ball.hide(this.count);
            }.bind(this));
        }.bind(this));
    },

    check: function(ball, color) {
        if (typeof(this.selection[ball.position.x]) === 'undefined' || typeof(this.selection[ball.position.x][ball.position.y]) === 'undefined') {
            if (ball.color === color) {
                if (typeof(this.selection[ball.position.x]) === 'undefined') {
                    this.selection[ball.position.x] = [];
                }

                this.count++;

                this.selection[ball.position.x][ball.position.y] = ball;

                var neighbours = this.getNeighbours(ball.position);

                neighbours.forEach(function(point) {
                    if (this.balls[point.y][point.x]) {
                        this.check(this.balls[point.y][point.x], color);
                    }
                }.bind(this));
            }
        }
    },

    isValidPoint: function(point) {
        var size = this.settings.get('size');

        return point.x >= 0
            && point.y >= 0
            && point.x < size.x
            && point.y < size.y;
    },

    getNeighbours: function(point) {
        var neighbours = new Array(
            point.getNeighbour('t'),
            point.getNeighbour('r'),
            point.getNeighbour('b'),
            point.getNeighbour('l')
        );

        return neighbours.filter(this.isValidPoint);
    }
});