/** @class Stats */

atom.declare('Stats', App.Element, {
    configure: function () {
        this.score = 0;
        this.shape = new Rectangle(this.settings.get('from'), this.settings.get('to'));
    },

	renderTo: function (ctx) {
		ctx.set({globalAlpha: 0.5})
            .fill(this.shape, 'grey')
            .text({
                to   :    this.shape,
                text :    'Score: ' + this.score,
                color:    'black',
                size:     22,
                align:    'center',
                optimize: true,
                weight:   'bold',
                padding:  0,
                shadow:   '1 1 1 white'
            });
	}
});