atom.declare('Balls.Controller', {
    initialize: function(settings) {
        this.settings = new atom.Settings(settings);

        this.bindMethods(['isValidPoint']);

        this.colors = [
            'red',
            'green',
            'blue',
            'yellow'
        ];

        atom.ImagePreloader.run({
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
        var app, layer, mouse;

        this.images = images;

        var size = this.size();

        app = new App({
            size: size
        });

        new Field(app, this.settings);

        app.container.size = new Size(size.x + 200, size.y);

        mouse = new Mouse(app.container.bounds);

        this.mouseHandler = new App.MouseHandler({mouse: mouse, app: app});

        this.layer = app.createLayer({intersection: 'all', name: 'balls', zIndex: 1});

        this.stats = new Stats(this.layer, {
            from: new Point(size.x + 20, 20),
            to:   new Point(size.x + 200 - 20, 120)
        });

        this.generate();

        this.calculation();
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
        var y, x, position, first, ball;
        var size = this.settings.get('size');

        this.balls  = atom.array.fillMatrix(size.x, size.y, null);

        for (x = 0; x < size.x; x++) {
            first = null;

            for (y = size.y - 1; y >= 0; y--) {
                var position = new Point(x, y);

                ball = this.createBall(this.layer, position, size.y);

                if (first === null) {
                    first = ball;
                }

                this.balls[y][x] = ball;
            }

            if (first) {
                first.fall();
            }
        }
    },

    createBall: function(layer, position, delta) {
        var color = this.colors.clone().popRandom();
        var pos   = new Point(position.x, position.y - delta);

        var ball = new Balls.Ball(layer, {
            from:       pos,
            position:   position,
            shape:      this.tileShape(pos),
            color:      color,
            controller: this
        });

        this.mouseHandler.subscribe(ball);

        ball.events.add('mousedown', function (e) {
            e.preventDefault();

            this.click(ball);
        }.bind(this));

        ball.events.add('mousemove', function (e) {
            e.preventDefault();

            this.info(ball);
        }.bind(this));

        ball.events.add('mouseover', function (e) {
            e.preventDefault();

            this.glow(ball, true);
        }.bind(this));

        ball.events.add('mouseout', function (e) {
            e.preventDefault();

            this.glow(ball);
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

    calculation: function() {
        var x, y, ball;
        var size = this.settings.get('size');
        this.select = atom.array.fillMatrix(size.x, size.y, null);

        for (y = 0; y < size.y; y++) {
            for (x = 0; x < size.x; x++) {
                if (this.select[y][x]) {
                    continue;
                }

                ball = this.balls[y][x];

                if (ball) {
                    this.count     = 0;
                    this.selection = [];

                    this.check(ball, ball.color);

                    this.selection.forEach(function(arr, x) {
                        arr.forEach(function(ball, y) {
                            this.select[y][x] = {
                                count: this.count,
                                balls: this.selection
                            };
                        }.bind(this));
                    }.bind(this));
                }
            }
        }
    },

    isFinish: function() {
        var x, y, selection;
        var size = this.settings.get('size');

        for (y = 0; y < size.y; y++) {
            for (x = 0; x < size.x; x++) {
                selection = this.select[y][x];

                if (selection && selection.count > 1) {
                    return false;
                }
            }
        }

        return true;
    },

    gameOver: function() {
        alert('GAME OVER!!!');
    },

    dropBalls: function(position) {
        var size = this.settings.get('size');
        var y, empty, key, ball, delta, first;
        var selection = this.select[position.y][position.x];

        selection.balls.forEach(function(arr, x) {
            key   = 0;
            empty = [];
            delta = 0;
            first = null;

            for (y = size.y - 1; y >= 0; y--) {
                ball = this.balls[y][x];

                if (!ball) {
                    delta++;

                    if (!key) {
                        key = y;
                    }
                } else {
                    if (key) {
                        ball.position = new Point(x, key);

                        if (first === null) {
                            first = ball;
                        }

                        this.balls[y][x] = null;
                        this.balls[key][x] = ball;

                        key--;
                    }
                }
            }

            y = delta;

            arr.forEach(function(ball) {
                y--;

                ball.shape.from = this.translatePoint(new Point(x, y - delta));
                ball.shape.to   = this.translatePoint(new Point(x + 1, y -delta + 1));

                ball.hover    = false;
                ball.position = new Point(x, y);
                ball.from     = new Point(x, y - delta);
                ball.color    = this.colors.clone().popRandom();

                this.balls[y][x] = ball;

                if (first === null) {
                    first = ball;
                }

                this.balls[y][x] = ball;
            }.bind(this));

            if (first) {
                first.fall();
            }
        }.bind(this));

        this.calculation();

        if (this.isFinish()) {
            this.gameOver();
        }
    },

    info: function(ball) {
        var selection = this.select[ball.position.y][ball.position.x];

        if (selection && selection.count > 1 && !selection.clicked) {
            var points = this.getScore(selection.count);

            ball.info.text = points + ' (' + selection.count + ')';
            ball.info.updateShape(this.mouseHandler.mouse.point);
            ball.info.show();
        } else {
            ball.info.hide();
        }
    },

    glow: function(ball, hover) {
        var selection = this.select[ball.position.y][ball.position.x];

        if (!hover) {
            ball.info.hide();
        }

        if (selection) {
            selection.balls.forEach(function(arr) {
                arr.forEach(function(ball) {
                    ball.hover = hover;
                    ball.redraw();
                }.bind(this));
            }.bind(this));
        }
    },

    click: function(cball) {
        this.animated = false;
        this.hidden   = 0;

        var selection = this.select[cball.position.y][cball.position.x];

        selection.balls.forEach(function(arr) {
            arr.forEach(function(ball) {
                this.animated = this.animated || ball.animated;
            }.bind(this));
        }.bind(this));

        if (this.animated) {
            cball.hide(0);
        } else {
            cball.info.hide();

            this.select[cball.position.y][cball.position.x].clicked = true;

            selection.balls.forEach(function(arr) {
                arr.forEach(function(ball) {
                    ball.hide(selection.count);
                }.bind(this));
            }.bind(this));

            if (selection.count > 1) {
                var points = this.getScore(selection.count);

                cball.score.text = '+' + points;
                cball.score.updateShape(cball.shape.center);
                cball.score.fade();

                this.stats.score += points;
                this.stats.redraw();
            }
        }
    },

    getScore: function(count) {
        return Math.round(4 * Math.pow(count, 1.5));
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