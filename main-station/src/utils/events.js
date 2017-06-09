var Events = function() {
    this.handlers = {};
}

Events.prototype.on = function(eventType, handler) {
    var self = this;
    if (!(eventType in self.handlers)) {
        self.handlers[eventType] = [];
    }
    self.handlers[eventType].push(handler);
    return self;
}

Events.prototype.emit = function(eventType) {
    var self = this;
    var handlerArgs = Array.prototype.slice.call(arguments, 1);
    var handlers = self.handlers[eventType] || [];
    for (var i = 0; i < handlers.length; i++) {
        self.handlers[eventType][i].apply(self, handlerArgs);
    }
    return self;
}

module.exports = Events;
