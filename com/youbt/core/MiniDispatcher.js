///<reference path="../core/ClassUtils.ts" />
var rf;
(function (rf) {
    var EventX = /** @class */ (function () {
        function EventX(type, data, bubbles) {
            this.type = undefined;
            this.type = type;
            this.data = data;
            this.bubbles = bubbles;
        }
        EventX.prototype.onRecycle = function () {
            this.data = undefined;
            this.type = undefined;
            this.target = undefined;
            this.currentTarget = undefined;
            this.bubbles = false;
            this.stopPropagation = false;
            this.stopImmediatePropagation = false;
        };
        return EventX;
    }());
    rf.EventX = EventX;
    /**
     *
     * @author crl
     *
     */
    var MiniDispatcher = /** @class */ (function () {
        /** Creates an EventDispatcher. */
        function MiniDispatcher(target) {
            if (target === void 0) { target = null; }
            this.addEventListener = this.on;
            this.removeEventListener = this.off;
            this.hasEventListener = this.has;
            if (target == null) {
                target = this;
            }
            this.mTarget = target;
        }
        /** Registers an event listener at a certain object. */
        MiniDispatcher.prototype.on = function (type, listener, thisObject, priority) {
            if (priority === void 0) { priority = 0; }
            if (undefined == this.mEventListeners) {
                this.mEventListeners = {};
            }
            var signal = this.mEventListeners[type];
            if (signal == null) {
                signal = this.mEventListeners[type] = rf.recyclable(rf.Link);
            }
            signal.addByWeight(listener, priority, thisObject);
        };
        /** Removes an event listener from the object. */
        MiniDispatcher.prototype.off = function (type, listener) {
            if (undefined != this.mEventListeners) {
                var signal = this.mEventListeners[type];
                if (undefined == signal)
                    return;
                signal.remove(listener);
                if (0 >= signal.length) {
                    signal.recycle();
                    this.mEventListeners[type] = undefined;
                }
            }
        };
        /** Removes all event listeners with a certain type, or all of them if type is null.
         *  Be careful when removing all event listeners: you never know who else was listening. */
        MiniDispatcher.prototype.removeEventListeners = function (type) {
            if (type === void 0) { type = undefined; }
            var signal;
            if (type && this.mEventListeners) {
                signal = this.mEventListeners[type];
                if (undefined != signal) {
                    signal.recycle();
                    this.mEventListeners[type] = undefined;
                }
                delete this.mEventListeners[type];
            }
            else if (this.mEventListeners) {
                for (type in this.mEventListeners) {
                    signal = this.mEventListeners[type];
                    if (undefined != signal) {
                        signal.recycle();
                        this.mEventListeners[type] = undefined;
                    }
                }
                this.mEventListeners = undefined;
            }
        };
        /** Dispatches an event to all objects that have registered listeners for its type.
         *  If an event with enabled 'bubble' property is dispatched to a display object, it will
         *  travel up along the line of parents, until it either hits the root object or someone
         *  stops its propagation manually. */
        MiniDispatcher.prototype.dispatchEvent = function (event) {
            if (undefined == this.mEventListeners || undefined == this.mEventListeners[event.type]) {
                return false;
            }
            event.currentTarget = this.mTarget;
            var signal = this.mEventListeners[event.type];
            var vo = signal.getFrist();
            while (vo) {
                if (event.stopPropagation || event.stopImmediatePropagation) {
                    break;
                }
                if (false == vo.close) {
                    var f = vo.data;
                    if (undefined != f) {
                        f.call(vo.args, event);
                        // f(vo.args,event);
                    }
                }
                vo = vo.next;
            }
            return false == event.stopPropagation;
        };
        MiniDispatcher.prototype.simpleDispatch = function (type, data, bubbles) {
            if (data === void 0) { data = undefined; }
            if (bubbles === void 0) { bubbles = false; }
            if (!bubbles && (undefined == this.mEventListeners || undefined == this.mEventListeners[type])) {
                return false;
            }
            var event = rf.recyclable(EventX);
            event.type = type;
            event.data = data;
            event.bubbles = bubbles;
            event.target = this.mTarget;
            var bool = this.dispatchEvent(event);
            event.recycle();
            return bool;
        };
        /** Returns if there are listeners registered for a certain event type. */
        MiniDispatcher.prototype.has = function (type) {
            if (undefined == this.mEventListeners) {
                return false;
            }
            var signal = this.mEventListeners[type];
            if (undefined == signal || 0 >= signal.length) {
                return false;
            }
            return true;
        };
        MiniDispatcher.prototype.onRecycle = function () {
            this.removeEventListeners();
        };
        return MiniDispatcher;
    }());
    rf.MiniDispatcher = MiniDispatcher;
})(rf || (rf = {}));
//# sourceMappingURL=MiniDispatcher.js.map