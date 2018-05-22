///<reference path="./Stage3D.ts" />
var rf;
(function (rf) {
    var Mouse = /** @class */ (function () {
        function Mouse() {
            this.mouseElement = {};
            this.touchElement = {};
            this.eventData = {};
            this.touchCenterY = 0;
            this.touchLen = 0;
        }
        Mouse.prototype.init = function (mobile) {
            var _a = this, touchElement = _a.touchElement, mouseElement = _a.mouseElement;
            mouseElement[0] = { target: undefined, time: 0, down: 50 /* MouseDown */, up: 53 /* MouseUp */, click: 56 /* CLICK */ };
            mouseElement[1] = { target: undefined, time: 0, down: 52 /* MouseMiddleDown */, up: 55 /* MouseMiddleUp */, click: 58 /* middleClick */ };
            mouseElement[2] = { target: undefined, time: 0, down: 51 /* MouseRightDown */, up: 54 /* MouseRightUp */, click: 57 /* RightClick */ };
            //10个指头应该够了吧
            // touchElement[0] = {target:undefined,time:0,data:new MouseEventData(0)};
            // touchElement[1] = {target:undefined,time:0,data:new MouseEventData(1)};
            // touchElement[2] = {target:undefined,time:0,data:new MouseEventData(2)};
            // touchElement[3] = {target:undefined,time:0,data:new MouseEventData(3)};
            // touchElement[4] = {target:undefined,time:0,data:new MouseEventData(4)};
            // touchElement[5] = {target:undefined,time:0,data:new MouseEventData(5)};
            // touchElement[6] = {target:undefined,time:0,data:new MouseEventData(6)};
            // touchElement[7] = {target:undefined,time:0,data:new MouseEventData(7)};
            // touchElement[8] = {target:undefined,time:0,data:new MouseEventData(8)};
            // touchElement[9] = {target:undefined,time:0,data:new MouseEventData(9)};
            var _this = this;
            function m(e) {
                _this.mouseHanlder(e);
                e.preventDefault();
            }
            ;
            var canvas = rf.ROOT.canvas;
            if (false == mobile) {
                canvas.onmousedown = m;
                canvas.onmouseup = m;
                canvas.onmousewheel = m;
                canvas.onmousemove = this.mouseMoveHandler;
                canvas.oncontextmenu = function (event) {
                    event.preventDefault();
                };
            }
            else {
                canvas.ontouchstart = this.touchHandler;
                canvas.ontouchmove = this.touchMoveHandler;
                canvas.ontouchend = this.touchHandler;
                canvas.ontouchcancel = this.touchHandler;
            }
        };
        Mouse.prototype.mouseHanlder = function (e) {
            var mouse = rf.MouseInstance;
            var mouseX = e.clientX * rf.pixelRatio;
            var mouseY = e.clientY * rf.pixelRatio;
            rf.nativeMouseX = mouseX;
            rf.nativeMouseY = mouseY;
            var d;
            var now = rf.engineNow;
            var numType = 0;
            var element;
            if (mouse.preMouseTime != now) {
                mouse.preMouseTime = now;
                d = rf.ROOT.getObjectByPoint(mouseX, mouseY, 1);
            }
            else {
                d = mouse.preTarget;
            }
            if (undefined != d) {
                var data = this.eventData;
                data.id = e.button;
                data.x = mouseX;
                data.y = mouseY;
                data.ctrl = e.ctrlKey;
                data.alt = e.altKey;
                data.shift = e.shiftKey;
                var type = e.type;
                if (type == "mousedown") {
                    //判断左右按键
                    element = mouse.mouseElement[data.id];
                    data.mouseDownX = mouseX;
                    data.mouseDownY = mouseY;
                    element.target = d;
                    element.time = now;
                    d.simpleDispatch(element.down, data, true);
                }
                else if (type == "mouseup") {
                    element = mouse.mouseElement[data.id];
                    d.simpleDispatch(element.up, event, true);
                    if (element.target == d && now - element.time < 500) {
                        d.simpleDispatch(element.click, data, true);
                    }
                    element.target = null;
                    element.time = 0;
                }
                else if (type == "mousewheel") {
                    data.wheel = e.deltaY;
                    d.simpleDispatch(59 /* MouseWheel */, data, true);
                }
            }
        };
        Mouse.prototype.mouseMoveHandler = function (e) {
            var mouse = rf.MouseInstance;
            var now = rf.engineNow;
            if (mouse.preMoveTime == now) {
                return;
            }
            mouse.preMoveTime = now;
            var mouseX = e.clientX * rf.pixelRatio;
            var mouseY = e.clientY * rf.pixelRatio;
            rf.nativeMouseX = mouseX;
            rf.nativeMouseY = mouseY;
            var d = rf.ROOT.getObjectByPoint(mouseX, mouseY, 1);
            if (undefined != d) {
                var data = mouse.eventData;
                data.id = e.button;
                data.x = mouseX;
                data.y = mouseY;
                data.ctrl = e.ctrlKey;
                data.alt = e.altKey;
                data.shift = e.shiftKey;
                data.ox = (e.movementX || e.mozMovementX || e.webkitMovementX || 0) * rf.pixelRatio;
                data.oy = (e.movementY || e.mozMovementY || e.webkitMovementY || 0) * rf.pixelRatio;
                d.simpleDispatch(60 /* MouseMove */, data, true);
                var preRolled = mouse.preRolled;
                if (preRolled != d) {
                    if (undefined != preRolled) {
                        preRolled.mouseroll = false;
                        preRolled.simpleDispatch(62 /* ROLL_OUT */, data, true);
                    }
                    if (d) {
                        d.mouseroll = true;
                        d.simpleDispatch(61 /* ROLL_OVER */, data, true);
                    }
                    mouse.preRolled = d;
                }
            }
        };
        Mouse.prototype.touchHandler = function (e) {
            var mouse = rf.MouseInstance;
            var elements = mouse.touchElement, touchLen = mouse.touchLen, centerY = mouse.touchCenterY;
            var touch = e.changedTouches[0];
            var touches = e.touches;
            var element;
            var data;
            var now = rf.engineNow;
            var d;
            var mouseX = touch.clientX * rf.pixelRatio;
            var mouseY = touch.clientY * rf.pixelRatio;
            rf.nativeMouseX = mouseX;
            rf.nativeMouseY = mouseY;
            element = elements[touch.identifier];
            if (undefined == element) {
                elements[touch.identifier] = element = { target: undefined, time: 0, data: { id: touch.identifier } };
            }
            data = element.data;
            data.ox = mouseX - data.x;
            data.oy = mouseY - data.y;
            data.x = mouseX;
            data.y = mouseY;
            if (touches.length == 2) {
                var _a = touches[0], x0 = _a.clientX, y0 = _a.clientY;
                var _b = touches[1], x1 = _b.clientX, y1 = _b.clientY;
                var x = (x0 + x1) / 2;
                var y = (y0 + y1) / 2;
                var ox = x1 - x0;
                var oy = y1 - y0;
                var len = Math.sqrt(ox * ox + oy * oy);
                mouse.touchCenterY = y;
                mouse.touchLen = len;
            }
            if (mouse.preMouseTime != now) {
                mouse.preMouseTime = now;
                d = rf.ROOT.getObjectByPoint(mouseX, mouseY, 1);
            }
            else {
                d = mouse.preTarget;
            }
            if (undefined != d) {
                if (e.type == "touchstart") {
                    // if(true == d.mousedown){
                    //     return;
                    // }
                    element.target = d;
                    element.time = now;
                    // d.mousedown = true;
                    d.simpleDispatch(50 /* MouseDown */, data, true);
                }
                else {
                    // if(false == d.mousedown){
                    //     return;
                    // }
                    // d.mousedown = false;
                    d.simpleDispatch(53 /* MouseUp */, data, true);
                    if (element.target == d && now - element.time < 500) {
                        d.simpleDispatch(56 /* CLICK */, data, true);
                    }
                }
            }
        };
        Mouse.prototype.touchMoveHandler = function (e) {
            var mouse = rf.MouseInstance;
            var now = rf.engineNow;
            if (mouse.preMoveTime == now) {
                return;
            }
            mouse.preMoveTime = now;
            var elements = mouse.touchElement, centerY = mouse.touchCenterY, touchLen = mouse.touchLen, preTarget = mouse.preTarget;
            var touches = e.touches, changedTouches = e.changedTouches;
            var element;
            var data;
            var len = touches.length;
            if (len == 1) {
                var touch = changedTouches[0];
                var mouseX = touch.clientX * rf.pixelRatio;
                var mouseY = touch.clientY * rf.pixelRatio;
                rf.nativeMouseX = mouseX;
                rf.nativeMouseY = mouseY;
                var d = rf.ROOT.getObjectByPoint(mouseX, mouseY, 1);
                if (undefined != d) {
                    element = elements[touch.identifier];
                    data = element.data;
                    data.ox = mouseX - data.x;
                    data.oy = mouseY - data.y;
                    data.x = mouseX;
                    data.y = mouseY;
                    d.simpleDispatch(60 /* MouseMove */, data, true);
                }
                return;
            }
            else if (len == 2) {
                if (undefined == preTarget) {
                    preTarget = rf.ROOT;
                }
                var _a = touches[0], x0 = _a.clientX, y0 = _a.clientY;
                var _b = touches[1], x1 = _b.clientX, y1 = _b.clientY;
                var x = (x0 + x1) / 2;
                var y = (y0 + y1) / 2;
                var ox = x1 - x0;
                var oy = y1 - y0;
                len = Math.sqrt(ox * ox + oy * oy);
                var dlen = (touchLen - len) / rf.pixelRatio;
                oy = (y - centerY) / rf.pixelRatio;
                if (Math.abs(dlen) > 1.0) {
                    //scale
                    var data_1 = this.eventData;
                    data_1.x = x;
                    data_1.y = y;
                    data_1.wheel = dlen > 0 ? 120 : -120;
                    preTarget.simpleDispatch(59 /* MouseWheel */, data_1, true);
                    // console.log( "scale" , dlen.toFixed(2));
                }
                else if (Math.abs(oy) > 1.0) {
                    var data_2 = this.eventData;
                    data_2.x = x;
                    data_2.y = y;
                    data_2.wheel = oy > 0 ? 120 : -120;
                    preTarget.simpleDispatch(59 /* MouseWheel */, data_2, true);
                    // console.log( "scale" , dlen.toFixed(2));
                }
                mouse.touchCenterY = y;
                mouse.touchLen = len;
            }
        };
        return Mouse;
    }());
    rf.Mouse = Mouse;
    rf.MouseInstance = new Mouse();
})(rf || (rf = {}));
//# sourceMappingURL=Mouse.js.map