/** @class Increment */

atom.declare('Increment', App.Element, {
    configure: function () {
        this.value = 0;
    },

	renderTo: function (ctx) {
		ctx.set({globalAlpha: 1}).text({
                to   :    this.shape,
                text :    this.value + '  ',
                color:    this.settings.get('color'),
                size:     22,
                align:    'right',
                optimize: true,
                weight:   'bold',
                padding:  0,
                shadow:   '1 1 1 black'
            });
	}
});