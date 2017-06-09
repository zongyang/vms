var store = require('store-js');
var Events = require('../../utils/events');
var sealingStroe = {};



sealingStroe.addChangeEvent = function(storeKey, event) {
    this.createEvent(storeKey);
    this.events[storeKey].on('change', event);
}

sealingStroe.createEvent = function(storeKey) {
    if (!this.events)
        this.events = {}
    if (!this.events[storeKey])
        this.events[storeKey] = new Events()
}

// emitEvent设置是否触发事件标记（默认为true）
sealingStroe.set = function(storeKey, val, emitEvent) {
    emitEvent = (emitEvent == undefined) ? true : emitEvent;

    this.createEvent(storeKey);
    store.set(storeKey, val);

    if (emitEvent)
        this.events[storeKey].emit('change', val)
}



sealingStroe.get = function(storeKey) {
    return store.get(storeKey);
}
module.exports = sealingStroe;
