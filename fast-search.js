/** @class Balls.FastSearch */
atom.declare('Balls.FastSearch', App.ElementsMouseSearch, {
	initialize: function (shift) {
		this.shift = shift;

        this.elements = [];
	},

    findByPoint: function (point) {
        point.move([-this.shift.x, -this.shift.y]);

		var e = this.elements, i = e.length, result = [];

		while (i--) if (e[i].isTriggerPoint( point )) {
			result.push(e[i]);
		}

		return result;
	}
});