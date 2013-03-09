/** @class Increment */

atom.declare('Increment', App.Element, {
    configure: function () {
        this.animatable = new atom.Animatable(this);
        this.animate    = this.animatable.animate;

        this.value   = 0;
        this.current = 0;
    },

    increment: function () {
        this.animatable.stop();

        var current = this.current;

        this.animate({
            time: 1000,
            props: {
                current: this.value
            },
            onTick: this.redraw,
            onComplete: this.redraw
        });
    },

    renderTo: function (ctx) {
        ctx.text({
            to   :    this.shape,
            text :    Math.round(this.current),
            color:    this.settings.get('color'),
            size:     22,
            align:    'right',
            optimize: true,
            weight:   'bold',
            shadow:   '1 1 3 black'
        });
    }
});