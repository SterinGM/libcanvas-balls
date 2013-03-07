/** @class Stats */

atom.declare('Stats', App.Element, {
    configure: function () {
        var from = this.settings.get('from');
        var to   = this.settings.get('to');

        this.shape = new Rectangle(from, to);

        this.score = new Rectangle(from, new Point(to.x, from.y + 35));
        this.click = new Rectangle(new Point(from.x, from.y + 35), new Point(to.x, from.y + 70));
        this.max   = new Rectangle(new Point(from.x, from.y + 70), new Point(to.x, from.y + 105));

        this.scoreValue = new Increment(this.layer, {shape: this.score, zIndex: 4, color: 'green'});
        this.clickValue = new Increment(this.layer, {shape: this.click, zIndex: 4, color: 'yellow'});
        this.maxValue   = new Increment(this.layer, {shape: this.max,   zIndex: 4, color: 'red'});
    },

	renderTo: function (ctx) {
		ctx.set({globalAlpha: 0.5}).fill(this.shape, 'grey').set({globalAlpha: 1})
            .text({
                to   :    this.score,
                text :    ' Score: ',
                color:    'white',
                size:     22,
                align:    'left',
                optimize: true,
                weight:   'bold',
                padding:  0,
                shadow:   '1 1 1 black'
            })
            .text({
                to   :    this.click,
                text :    ' Click: ',
                color:    'white',
                size:     22,
                align:    'left',
                optimize: true,
                weight:   'bold',
                padding:  0,
                shadow:   '1 1 1 black'
            })
            .text({
                to   :    this.max,
                text :    ' Max: ',
                color:    'white',
                size:     22,
                align:    'left',
                optimize: true,
                weight:   'bold',
                padding:  0,
                shadow:   '1 1 1 black'
            });
	}
});