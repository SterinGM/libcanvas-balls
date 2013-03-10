/** @class Stats */

atom.declare('Stats', App.Element, {
    configure: function () {
        var from = this.settings.get('from');
        var to   = this.settings.get('to');

        this.shape = new Rectangle(from, to);

        this.score = new Rectangle(new Point(from.x + 10, from.y),      new Point(to.x - 10, from.y + 35));
        this.click = new Rectangle(new Point(from.x + 10, from.y + 35), new Point(to.x - 10, from.y + 70));
        this.level = new Rectangle(new Point(from.x + 10, from.y + 70), new Point(to.x - 10, from.y + 105));

        this.scoreValue = new Increment(this.layer, {shape: this.score, zIndex: this.zIndex + 1, color: 'green'});
        this.clickValue = new Increment(this.layer, {shape: this.click, zIndex: this.zIndex + 1, color: 'yellow'});
        this.levelValue = new Increment(this.layer, {shape: this.level, zIndex: this.zIndex + 1, color: 'red'});
    },

    renderTo: function (ctx) {
        ctx
            .set({opacity: 0.5})
            .fill(this.shape, 'black')
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
                to   :    this.level,
                text :    'Level:',
                color:    'white',
                size:     22,
                optimize: true,
                shadow:   '1 1 3 black'
            });
    }
});