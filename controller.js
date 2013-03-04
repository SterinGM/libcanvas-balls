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

        new Field(app, this.settings);

        mouse = new Mouse(app.container.bounds);

        this.mouseHandler = new App.MouseHandler({mouse: mouse, app: app});

        this.layer = app.createLayer({name: 'balls', zIndex: 1});

        this.generate();
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

                this.balls[y][x] = this.createBall(this.layer, position, size.y + 1);
            }
        }

        this.fallBalls();

        return this;
    },

    fallBalls: function() {
        var x;
        var size = this.settings.get('size');
        var y = size.y - 1;

        for (x = 0; x < size.x; x++) {
            if (this.balls[y][x] && !this.balls[y][x].animated) {
                this.balls[y][x].fall(null, null, null, size.y);
            }
        }
    },

    createBall: function(layer, position, delta) {
        var colors = ['white', 'red', 'green', 'blue', 'yellow', 'orange', 'magenta'];

        var color = colors.popRandom();
        var pos = new Point(position.x, position.y - delta);

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

    isFinish: function() {
        var x, y, ball;
        var size = this.settings.get('size');

        for (y = 0; y < size.y - 1; y++) {
            for (x = 0; x < size.x - 1; x++) {
                ball = this.balls[y][x];

                if (ball) {
                    if (this.balls[y + 1][x] && ball.color === this.balls[y + 1][x].color) {
                        return false;
                    }

                    if (this.balls[y][x + 1] && ball.color === this.balls[y][x + 1].color) {
                        return false;
                    }
                }
            }
        }

        return true;
    },

    gameOver: function() {
        alert('GAME OVER!!!');
    },

    dropBalls: function() {
        var size = this.settings.get('size');
        var y, empty, key, ball, delta;

        this.selection.forEach(function(arr, x) {
            key = 0;
            empty = [];

            for (y = size.y - 1; y >= 0; y--) {
                ball = this.balls[y][x];

                if (!ball) {
                    empty.push(y);
                } else {
                    if (empty.length) {
                        ball.animated = true;
                        ball.from     = ball.position;
                        ball.position = new Point(x, empty[key]);

                        delta = ball.position.y - ball.from.y;

                        ball.fall(ball.position, 'linear', delta * 100);

                        this.balls[y][x] = null;
                        this.balls[empty[key]][x] = ball;

                        empty.push(y);
                        key++;
                    }
                }
            }

            delta = empty.length - key;

            for (y = delta - 1; y >= 0; y--) {
                this.balls[y][x] = this.createBall(this.layer, new Point(x, y), delta + 1);

                this.balls[y][x].fall(null, null, null, delta + 1);
            }
        }.bind(this));

        if (this.isFinish()) {
            this.gameOver();
        }
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