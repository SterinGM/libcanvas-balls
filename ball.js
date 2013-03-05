atom.declare('Balls.Ball', App.Element, {
    configure: function() {
        this.animate = new atom.Animatable(this).animate;

        this.scale    = Math.ceil(this.shape.width / 15);
        this.animated = false;

        this.from     = this.settings.get('from');
        this.position = this.settings.get('position');
    },

    get controller () {
        return this.settings.get('controller');
    },

    get color () {
        return this.settings.get('color');
    },

    fallNext: function() {
        var y, ball;

        for (y = this.position.y - 1; y >= 0; y--) {
            ball = this.controller.balls[y][this.position.x];

            if (ball) {
                if (!ball.animated && !this.from.equals(this.position, 1)) {
                    ball.fall();
                }

                break;
            }
        }
    },

    fall: function() {
        if (this.animated) {
            return;
        }

        var props = {}, current = this.shape.from;

        var destination = this.controller.translatePoint(this.position);

        var acceleration = 25;
        var length       = destination.y - current.y;
        var time         = Math.sqrt(2 * length / acceleration);

        if (!destination.x.equals(current.x, 1)) {
            props.x = destination.x;
        }

        if (!destination.y.equals(current.y, 1)) {
            props.y = destination.y;
        }

        this.animated = true;

        this.animate({
            time : Math.round(time * 100),
            fn   : function(p) {
                return Math.pow(p, 2);
            },
            props: props,
            onTick: function(animation) {
                this.redraw();

                var deltaTime = animation.animatable.current.allTime - animation.animatable.current.timeLeft;

                if (deltaTime >= 50 || animation.animatable.current.timeLeft === 0)
                {
                    this.fallNext();
                }
            }.bind(this),
            onComplete: function () {
                this.redraw();

                this.from = this.position;

                this.animated = false;
            }.bind(this)
        });

        return this;
    },

    get x() {
        return this.shape.from.x;
    },

    get y() {
        return this.shape.from.y;
    },

    set x(value) {
        return this.shape.move(new Point(value - this.x, 0));
    },
    set y(value) {
        return this.shape.move(new Point(0, value - this.y));
    },

    renderTo: function(ctx) {
        var image = this.settings.values.image;

        ctx.drawImage({
            image:    image,
            draw :    this.shape,
            optimize: true
        });
    },

    hide: function(count) {
        if (this.animated) {
            return;
        }

        this.animated = true;

        var scale = Math.ceil(this.shape.width / 15);

        this.animate({
            time: 50,
            fn : 'sine-out',
            onTick: this.redraw,
            props: {
                'shape.from.x' : this.shape.from.x - scale,
                'shape.from.y' : this.shape.from.y - scale,
                'shape.to.x'   : this.shape.to.x + scale,
                'shape.to.y'   : this.shape.to.y + scale
            },
            onComplete: function () {
                if (count > 1) {
                    scale = Math.ceil(this.shape.width / 2);
                }

                this.animate({
                    fn: 'sine-in',
                    time  : count > 1 ? 200 : 50,
                    onTick: this.redraw,
                    props: {
                        'shape.from.x' : this.shape.from.x + scale,
                        'shape.from.y' : this.shape.from.y + scale,
                        'shape.to.x'   : this.shape.to.x - scale,
                        'shape.to.y'   : this.shape.to.y - scale
                    },
                    onComplete: function () {
                        this.animated = false;

                        if (count > 1) {
                            this.controller.balls[this.position.y][this.position.x] = null;
                            this.controller.hidden++;

                            if (this.controller.hidden === count) {
                                this.controller.dropBalls();

                                this.destroy();
                            }
                        }
                    }.bind(this)
                });
            }.bind(this)
        });
    },

    glow: function(out) {
        this.animated = true;

        var factor = out ? -1 : 1;

        this.animate({
            time: 50,
            fn : 'sine-out',
            onTick: this.redraw,
            props: {
                'shape.from.x' : this.shape.from.x - this.scale * factor,
                'shape.from.y' : this.shape.from.y - this.scale * factor,
                'shape.to.x'   : this.shape.to.x   + this.scale * factor,
                'shape.to.y'   : this.shape.to.y   + this.scale * factor
            },
            onComplete: function() {
                this.animated = false;
            }.bind(this)
        });
    }
});