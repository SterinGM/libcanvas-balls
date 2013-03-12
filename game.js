atom.declare('Game', App.Element, {
    configure: function() {
        this.bindMethods(['isValidPoint']);

        this.res = this.layer.app.settings.get('resources');

        this.stats = this.settings.get('stats');
        this.back  = this.settings.get('back');
        this.title = this.settings.get('title');

        this.level  = 0;
        this.score  = 1000;
        this.next   = 1000;

        this.colors = [];
        this.select = [];
        this.balls  = [];

        this.start     = true;
        this.fallBalls = 0;

        this.mouseHandler = new App.MouseHandler({
            mouse:  new Mouse(this.layer.app.container.bounds),
            app:    this.layer.app,
            search: new Balls.FastSearch(this.layer.dom.shift)
        });

        this.updateLevel();
        this.generate();
    },

    subscribe: function() {
        this.balls.forEach(function(arr) {
            arr.forEach(function(ball) {
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
            }.bind(this));
        }.bind(this));
    },

    updateLevel: function() {
        this.mouseHandler.unsubscribeAll();

        var count = this.level ? 1 : 3;

        if (this.level) {
            this.back.update();
        }

        this.next += this.level * this.score;

        this.level++;

        this.start = true;

        this.stats.levelValue.current = this.level;
        this.stats.levelValue.redraw();

        for (var i = 1; i <= count; i++) {
            this.colors.push(this.res.colors.popRandom());
        }
    },

    generate: function() {
        var y, x, position, first, ball;
        var size = this.settings.get('size');

        this.balls = atom.array.fillMatrix(size.x, size.y, null);

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

    completeFall: function() {
        if (this.start) {
            this.title.show('Level ' + this.level);

            this.start = false;

            this.subscribe();
        }

        this.calculation();

        if (this.isFinish()) {
            this.gameOver();
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
            game:       this,
            zIndex:     this.zIndex + 5
        });

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
        var from = position.x * (tile.width + tile.margin) + tile.margin;
        var to   = position.y * (tile.height + tile.margin) + tile.margin;

        return new Point(from, to).move(this.shape.from);
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
    },

    getSelect: function(ball) {
        if (typeof(this.select[ball.position.y]) !== 'undefined') {
            if (typeof(this.select[ball.position.y][ball.position.x]) !== 'undefined') {
                return this.select[ball.position.y][ball.position.x];
            }
        };

        return new Array();
    },

    info: function(ball) {
        var selection = this.getSelect(ball);

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
        var selection = this.getSelect(ball);

        if (!hover) {
            ball.info.hide();
        }

        if (selection && selection.count > 1) {
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

        var selection = this.getSelect(cball);

        if (!selection.balls || selection.count <= 1) {
            return;
        }

        var last = null;

        selection.balls.forEach(function(arr) {
            arr.forEach(function(ball) {
                last = ball;

                this.animated = this.animated || ball.animated;
            }.bind(this));
        }.bind(this));

        if (!this.animated) {
            cball.info.hide();

            this.select[cball.position.y][cball.position.x].clicked = true;

            selection.balls.forEach(function(arr) {
                arr.forEach(function(ball) {
                    ball.hide(last);
                }.bind(this));
            }.bind(this));

            if (selection.count > 1) {
                var points = this.getScore(selection.count);

                cball.score.text = '+' + points;
                cball.score.updateShape(cball.shape.center);
                cball.score.fade();

                this.stats.scoreValue.value += points;
                this.stats.scoreValue.increment();

                this.stats.clickValue.current++;
                this.stats.clickValue.redraw();

                if (this.stats.scoreValue.value > this.next) {
                    this.updateLevel();
                }
            }
        }
    },

    getScore: function(count) {
        var factor = this.level * 2;

        return Math.round(factor * Math.pow(count, 1.5));
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
        this.mouseHandler.unsubscribeAll();

        var maximum = atom.cookie.get('sgm.balls.max');

        maximum = maximum ? parseInt(maximum, 10) : 0;

        if (maximum < this.stats.scoreValue.value) {
            atom.cookie.set('sgm.balls.max', this.stats.scoreValue.value);
        }

        this.title.show('Game over!!!', true);
    },

    dropBalls: function(cball) {
        var size = this.settings.get('size');
        var y, empty, key, ball, delta, first;
        var selection = this.getSelect(cball);

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

                        this.balls[y][x]   = null;
                        this.balls[key][x] = ball;

                        key--;
                    }
                }
            }

            arr.forEach(function(ball) {
                for (var j = size.y - 1; j >= 0; j--) {
                    if (!this.balls[j][x]) {
                        ball.shape.from = this.translatePoint(new Point(x, j - delta - 1));
                        ball.shape.to   = this.translatePoint(new Point(x + 1, j - delta));

                        ball.hover    = false;
                        ball.position = new Point(x, j);
                        ball.from     = new Point(x, j - delta - 1);
                        ball.color    = this.colors.clone().popRandom();

                        this.balls[j][x] = ball;

                        if (first === null) {
                            first = ball;
                        }

                        this.balls[j][x] = ball;

                        break;
                    }
                }
            }.bind(this));

            if (first) {
                first.fall();
            }
        }.bind(this));
    }
});