/** @class Stats */

atom.declare('Stats', App.Element, {
    configure: function () {
        var from = this.settings.get('from');
        var to   = this.settings.get('to');

        this.shape = new Rectangle(from, to);

        this.score = new Rectangle(new Point(from.x + 10, from.y),      new Point(to.x - 10, from.y + 35));
        this.click = new Rectangle(new Point(from.x + 10, from.y + 35), new Point(to.x - 10, from.y + 70));
        this.max   = new Rectangle(new Point(from.x + 10, from.y + 70), new Point(to.x - 10, from.y + 105));

        this.scoreValue = new Increment(this.layer, {shape: this.score, zIndex: this.zIndex + 1, color: 'green'});
        this.clickValue = new Increment(this.layer, {shape: this.click, zIndex: this.zIndex + 1, color: 'yellow'});
        this.maxValue   = new Increment(this.layer, {shape: this.max,   zIndex: this.zIndex + 1, color: 'red'});

        this.maximum = atom.cookie.get('sgm.balls.max');
        this.maximum = this.maximum ? parseInt(this.maximum, 10) : 0;

        this.maxValue.current = this.maximum;
        this.maxValue.redraw();
    },

    renderTo: function (ctx) {
        ctx
            .set({opacity: 0.5})
//            .stroke(this.shape, 'black')
            .fill(this.shape, 'grey')
            .set({opacity: 1})
            .text({
                to   :    this.score,
                text :    'Score:',
                color:    'white',
                size:     22,
                optimize: true,
                shadow:   '1 1 3 black'
            })
            .text({
                to   :    this.click,
                text :    'Click:',
                color:    'white',
                size:     22,
                optimize: true,
                shadow:   '1 1 3 black'
            })
            .text({
                to   :    this.max,
                text :    'Max:',
                color:    'white',
                size:     22,
                optimize: true,
                shadow:   '1 1 3 black'
            });
    }
});