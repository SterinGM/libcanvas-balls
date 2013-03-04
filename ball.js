atom.declare('Balls.Ball', App.Element, {
    configure: function () {
        this.animate = new atom.Animatable(this).animate;

        this.animated = false;

        this.from     = this.settings.get('from');
        this.position = this.settings.get('position');

//		new App.Clickable( this, this.redraw ).start();
    },

    get controller () {
        return this.settings.get('controller');
    },

    get color () {
        return this.settings.get('color');
    },

    fall: function (fn, delta) {
        this.animated = true;

        var props = {}, current = this.shape.from;

        var destination = this.controller.translatePoint(this.position);

        if (!destination.x.equals(current.x, 1)) {
            props.x = destination.x;
        }

        if (!destination.y.equals(current.y, 1)) {
            props.y = destination.y;
        }

        this.animate({
            time : (delta ? delta : 10) * 100,
            fn   : fn ? fn : 'linear',
            props: props,
            onTick: function(animation) {
                this.redraw();

                if (this.position.y > 0) {
                    var deltaTime = animation.animatable.current.allTime - animation.animatable.current.timeLeft;

                    if (deltaTime >= 50 || animation.animatable.current.timeLeft === 0)
                    {
                        var ball = this.controller.balls[this.position.y - 1][this.position.x];

                        if (ball && !ball.animated && !this.from.equals(this.position, 1)) {

                            ball.fall(fn, delta);
                        }
                    }
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