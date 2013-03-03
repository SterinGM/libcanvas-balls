atom.declare('Balls.Ball', App.Element, {
    configure: function () {
        this.animate = new atom.Animatable(this).animate;

        this.stable  = false;

//		new App.Clickable( this, this.redraw ).start();
    },

    get controller () {
        return this.settings.get('controller');
    },

    get position () {
        return this.settings.get('position');
    },

    get from () {
        return this.settings.get('from');
    },

    get color () {
        return this.settings.get('color');
    },

    fall: function (point) {
        var props = {}, current = this.shape.from;

        var next = new Point(this.position.x, point ? this.position.y : this.from.y + 1);

        var destination = this.controller.translatePoint(next);

        if (!destination.x.equals(current.x, 1)) {
            props.x = destination.x;
        }

        if (!destination.y.equals(current.y, 1)) {
            props.y = destination.y;
        }

        this.animate({
            time : point ? 1000 : 50,
            fn   : point ? 'cubic-in' : 'linear',
            props: props,
            onTick: this.redraw,
            onComplete: function () {
                this.redraw();

                this.stable = true;

                if (next.y !== this.position.y) {
                    this.fall(next);

                    if (this.position.y > 0)
                    {
                        var ball = this.controller.balls[this.position.y - 1][this.position.x];

                        if (ball && !ball.stable) {
                            ball.fall();
                        }
                    }
                } else {
//                    this.controller.sounds.play('fall');
                }
            }.bind(this)
        });

        return this;
    },

    get x () { return this.shape.from.x },
    get y () { return this.shape.from.y },

    set x (value) {
        return this.shape.move(new Point( value - this.x, 0 ));
    },
    set y (value) {
        return this.shape.move(new Point( 0, value - this.y ));
    },

    renderTo: function (ctx) {
        var image = this.settings.values.image;

        ctx.drawImage({
            image:    image,
            draw :    this.shape,
            optimize: true
        });
    },

    hide: function(count) {
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
    }
});