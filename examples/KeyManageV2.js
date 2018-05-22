var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var rf;
(function (rf) {
    var KeyManagerV2 = /** @class */ (function (_super) {
        __extends(KeyManagerV2, _super);
        function KeyManagerV2(target) {
            var _this = _super.call(this) || this;
            _this.keylist = [];
            _this.keylimit = [];
            /**
             *用于独占按键响应，如果为true，则即使该管理器没有响应 按键回调，也不会在mainKey管理器中响应
             */
            _this.isClosed = false;
            /**
             * 执行快捷键
             * @param e
             * @param keyvalue
             */
            _this.keyDict = {};
            _this.keyObj = {};
            if (target) {
                target.addEventListener(50 /* MouseDown */, _this.mouseDownHandler, _this);
            }
            _this.keyDict = {};
            return _this;
        }
        KeyManagerV2.prototype.mouseDownHandler = function (e) {
            KeyManagerV2.currentKey = this;
        };
        KeyManagerV2.resetDefaultMainKey = function (value) {
            KeyManagerV2._defaultMainKey = value == null ? rf.mainKey : value;
            this.setFocus(KeyManagerV2._defaultMainKey);
        };
        KeyManagerV2.setFocus = function (focus) {
            if (KeyManagerV2.currentKey && KeyManagerV2.currentKey.isClosed) {
                return;
            }
            if (!focus) {
                focus = KeyManagerV2._defaultMainKey;
            }
            KeyManagerV2.currentKey = focus;
        };
        KeyManagerV2.prototype.awaken = function () {
            KeyManagerV2.currentKey = this;
        };
        KeyManagerV2.prototype.sleep = function () {
            KeyManagerV2.setFocus(KeyManagerV2._defaultMainKey);
        };
        KeyManagerV2.prototype.init = function () {
            var $this = this;
            function m(e) {
                $this.onKeyHandle(e);
            }
            ;
            var canvas = rf.ROOT.canvas;
            window.onkeydown = m;
            window.onkeyup = m;
            this.keylimit = [16 /* SHIFT */, 17 /* CONTROL */, 18 /* ALTERNATE */];
            this.keylist = [];
        };
        KeyManagerV2.prototype.onKeyHandle = function (e) {
            e.stopImmediatePropagation();
            var keyList = this.keylist;
            var i;
            var code = e.keyCode;
            if (!this.check()) {
                i = keyList.indexOf(code);
                if (i != -1) {
                    keyList.splice(i, 1);
                }
                return;
            }
            if (this.keylimit.indexOf(code) != -1)
                return;
            if (e.type == "keydown") {
                if (keyList.indexOf(code) != -1) {
                    return;
                }
                keyList.push(code);
            }
            else {
                i = keyList.indexOf(code);
                if (i != -1) {
                    keyList.splice(i, 1);
                }
            }
            var type = (e.type == "keydown") ? 0 : 1;
            var shiftKey, ctrlKey, altKey;
            shiftKey = e.shiftKey ? 1 : 0;
            ctrlKey = e.ctrlKey ? 1 : 0;
            altKey = e.altKey ? 1 : 0;
            var keyvalue = type << 12 | shiftKey << 11 | ctrlKey << 10 | altKey << 9 | e.keyCode;
            if ((!KeyManagerV2.currentKey || !KeyManagerV2.currentKey.doKey(e, keyvalue)) && rf.mainKey) {
                rf.mainKey.doKey(e, keyvalue);
            }
        };
        KeyManagerV2.prototype.doKey = function (e, keyvalue) {
            var f = this.keyDict[keyvalue];
            this.currentKeyCode = keyvalue & 0xFF;
            if (f != null) {
                if (f.length == 1) {
                    f.call(this.keyObj[keyvalue], e);
                }
                else {
                    f.call(this.keyObj[keyvalue]);
                }
                return true;
            }
            return this.isClosed;
        };
        KeyManagerV2.prototype.check = function () {
            if (!KeyManagerV2.enabled) {
                return false;
            }
            //check input
            return true;
        };
        KeyManagerV2.prototype.regKeyDown = function (key, func, thisobj, shift, ctrl, alt) {
            if (shift === void 0) { shift = false; }
            if (ctrl === void 0) { ctrl = false; }
            if (alt === void 0) { alt = false; }
            var shiftKey, ctrlKey, altKey;
            shiftKey = shift ? 1 : 0;
            ctrlKey = ctrl ? 1 : 0;
            altKey = alt ? 1 : 0;
            this.keyDict[shiftKey << 11 | ctrlKey << 10 | altKey << 9 | key] = func;
            this.keyObj[shiftKey << 11 | ctrlKey << 10 | altKey << 9 | key] = thisobj;
        };
        KeyManagerV2.prototype.removeKeyDown = function (key, func, shift, ctrl, alt) {
            if (shift === void 0) { shift = false; }
            if (ctrl === void 0) { ctrl = false; }
            if (alt === void 0) { alt = false; }
            var shiftKey, ctrlKey, altKey;
            shiftKey = shift ? 1 : 0;
            ctrlKey = ctrl ? 1 : 0;
            altKey = alt ? 1 : 0;
            var d = shiftKey << 11 | ctrlKey << 10 | altKey << 9 | key;
            if (this.keyDict[d] == func) {
                this.keyDict[d] = null;
                delete this.keyDict[d];
                this.keyObj[d] = null;
                delete this.keyObj[d];
            }
        };
        KeyManagerV2.enabled = true;
        return KeyManagerV2;
    }(rf.MiniDispatcher));
    rf.KeyManagerV2 = KeyManagerV2;
    rf.mainKey = new KeyManagerV2();
})(rf || (rf = {}));
//# sourceMappingURL=KeyManageV2.js.map