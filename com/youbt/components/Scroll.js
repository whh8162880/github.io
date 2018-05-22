/// <reference path="../stage3d/display/Component.ts" />
var rf;
(function (rf) {
    var Scroll = /** @class */ (function () {
        function Scroll(target, w, h) {
            this.vStep = 1;
            this.hStep = 1;
            this.areacheck = true;
            this._enabled = true;
            this.target = target;
            target.scrollRect = { x: 0, y: 0, w: w, h: h };
            this.doEnabled();
        }
        Object.defineProperty(Scroll.prototype, "enabled", {
            get: function () { return this._enabled; },
            set: function (value) { if (this._enabled == value) {
                return;
            } this._enabled = value; this.doEnabled(); },
            enumerable: true,
            configurable: true
        });
        Scroll.prototype.doEnabled = function () {
            var _a = this, _enabled = _a._enabled, target = _a.target;
            if (_enabled) {
                target.on(50 /* MouseDown */, this.mouseDownHandler, this);
            }
        };
        Scroll.prototype.mouseDownHandler = function (event) {
            rf.ROOT.on(60 /* MouseMove */, this.mouseMoveHandler, this);
            rf.ROOT.on(53 /* MouseUp */, this.mouseUpHandler, this);
            var tweener = this.tweener;
            if (tweener) {
                rf.tweenEnd(tweener);
                this.tweener = undefined;
            }
        };
        Scroll.prototype.mouseUpHandler = function (event) {
            rf.ROOT.off(60 /* MouseMove */, this.mouseMoveHandler);
            rf.ROOT.off(53 /* MouseUp */, this.mouseUpHandler);
            var _a = this, vStep = _a.vStep, hStep = _a.hStep, target = _a.target, areacheck = _a.areacheck;
            var scrollRect = target.scrollRect, width = target.w, height = target.h;
            var x = scrollRect.x, y = scrollRect.y, w = scrollRect.w, h = scrollRect.h;
            var o;
            if (hStep > 1) {
                var dx = x % hStep;
                if (Math.abs(dx) > hStep * .5) {
                    dx = Math.floor(x / hStep) * hStep;
                }
                else {
                    dx = Math.ceil(x / hStep) * hStep;
                }
                x = dx;
                if (!o) {
                    o = { x: dx };
                }
                else {
                    o.x = dx;
                }
            }
            if (vStep > 1) {
                var dy = y % vStep;
                if (Math.abs(dy) > vStep * .5) {
                    dy = Math.floor(y / vStep) * vStep;
                }
                else {
                    dy = Math.ceil(y / vStep) * vStep;
                }
                y = dy;
                if (!o) {
                    o = { y: dy };
                }
                else {
                    o.y = dy;
                }
            }
            if (areacheck) {
                if (hStep > 0) {
                    if (x + width < w) {
                        if (!o) {
                            o = { x: w - width };
                        }
                        else {
                            o.x = w - width;
                        }
                    }
                    else if (x > 0) {
                        if (!o) {
                            o = { x: 0 };
                        }
                        else {
                            o.x = 0;
                        }
                    }
                }
                if (vStep > 0) {
                    if (y + height < h) {
                        if (!o) {
                            o = { y: h - height };
                        }
                        else {
                            o.y = h - height;
                        }
                    }
                    else if (y > 0) {
                        if (!o) {
                            o = { y: 0 };
                        }
                        else {
                            o.y = 0;
                        }
                    }
                }
            }
            if (o) {
                this.tweener = rf.tweenTo(o, 200, rf.defaultTimeMixer, scrollRect);
            }
        };
        Scroll.prototype.mouseMoveHandler = function (event) {
            var data = event.data;
            var scrollRect = this.target.scrollRect;
            var _a = this, vStep = _a.vStep, hStep = _a.hStep;
            if (hStep > 0) {
                scrollRect.x += data.ox;
            }
            if (vStep > 0) {
                scrollRect.y += data.oy;
            }
        };
        return Scroll;
    }());
    rf.Scroll = Scroll;
})(rf || (rf = {}));
//# sourceMappingURL=Scroll.js.map