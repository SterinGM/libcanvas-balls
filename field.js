atom.declare('Balls.Field', App.Element, {
    renderSprite: function(odd) {
        var
            buffer = LibCanvas.buffer(this.shape.size, true);

        var alpha = odd ? 0.6 : 0.4;

        buffer.ctx
            .set({ globalAlpha: alpha })
            .fillAll('grey');

        return buffer;
    },

    renderTo: function (ctx) {
        ctx.drawImage({
            image:    this.renderSprite(this.settings.get('odd')),
            draw :    this.shape,
            optimize: true
        });
    }
});