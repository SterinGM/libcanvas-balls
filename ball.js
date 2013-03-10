atom.declare('Balls.Ball', App.Element, {
    configure: function() {
        this.animate = new atom.Animatable(this).animate;

        this.animated = false;

        this.res = this.layer.app.settings.get('resources');

        this.color    = this.settings.get('color');
        this.from     = this.settings.get('from');
        this.position = this.settings.get('position');

        this.info  = new Balls.Info(this.layer,  {ball: this, zIndex: this.zIndex + 1});
        this.score = new Balls.Score(this.layer, {ball: this, zIndex: this.zIndex + 1});
    },

    get game () {
        return this.settings.get('game');
    },

    fallNext: function() {
        var y, ball;

        for (y = this.position.y - 1; y >= 0; y--) {
            ball = this.game.balls[y][this.position.x];

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

        var props       = {};
        var current     = this.shape.from;
        var destination = this.game.translatePoint(this.position);

        if (destination.equals(current, 1)) {
            return;
        }

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

                if (deltaTime >= 20 || animation.animatable.current.timeLeft === 0)
                {
                    this.fallNext();
                }
            }.bind(this),
            onComplete: function () {
                this.redraw();

                this.from = this.position;

                this.animated = false;

                if (typeof(this.game.balls[this.position.y + 1]) !== 'undefined') {
                    var ball = this.game.balls[this.position.y + 1][this.position.x];

                    ball.fall();
                }
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
        return this.shape.move(new Point( value - this.x, 0 ));
    },
    set y(value) {
        return this.shape.move(new Point( 0, value - this.y ));
    },

    renderTo: function(ctx) {
        if (this.hover && !this.animated)
        {
            ctx.drawImage({
                image:    this.res.images.get('glow'),
                draw :    this.shape,
                optimize: true
            });
        }

        ctx.set({opacity: 1}).drawImage({
            image:    this.res.images.get(this.color),
            draw :    this.shape,
            scale:    [0.85, 0.85],
            optimize: true
        });
    },

    hide: function(count) {
        if (this.animated || count <= 1) {
            return;
        }

        this.animated = true;

        var scale = Math.ceil(this.shape.width / 2);

        this.animate({
            time: 300,
            fn : 'back-in',
            onTick: this.redraw,
            props: {
                'shape.from.x' : this.shape.from.x + scale,
                'shape.from.y' : this.shape.from.y + scale,
                'shape.to.x'   : this.shape.to.x - scale,
                'shape.to.y'   : this.shape.to.y - scale
            },
            onComplete: function () {
                this.animated = false;

                this.game.balls[this.position.y][this.position.x] = null;
                this.game.hidden++;

                if (this.game.hidden === count) {
                    this.game.dropBalls(this.position);
                }
            }.bind(this)
        });
    }
});