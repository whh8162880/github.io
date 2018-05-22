var rf;
(function (rf) {
    var TrackballControls = /** @class */ (function () {
        function TrackballControls(object) {
            this.mouseSitivity = 0.3;
            this.object = object;
            this.target = rf.newVector3D();
            this.distance = this.object.pos.v3_sub(this.target).v3_length;
            rf.scene.on(50 /* MouseDown */, this.mouseDownHandler, this);
            rf.scene.on(59 /* MouseWheel */, this.mouseWheelHandler, this);
            rf.scene.on(51 /* MouseRightDown */, this.mouseRightDownHandler, this);
            this.updateSun();
        }
        TrackballControls.prototype.updateSun = function () {
            // const{object,target}=this;
            // let sun = scene.sun;
            // sun.x = object._x - target.x;
            // sun.y = object._y - target.y;
            // sun.z = object._z - target.z;
        };
        Object.defineProperty(TrackballControls.prototype, "tdistance", {
            get: function () {
                return this.distance;
            },
            set: function (value) {
                // console.log(value);
                this.distance = value;
                this.object.forwardPos(value, this.target);
            },
            enumerable: true,
            configurable: true
        });
        TrackballControls.prototype.mouseWheelHandler = function (event) {
            // const{distance} = this;
            var distance = this.object.pos.v3_sub(this.target).v3_length;
            this.distance = distance;
            var wheel = event.data.wheel;
            var step = 1;
            if (wheel < 0 && distance < 500) {
                step = distance / 500;
            }
            wheel = wheel * step;
            var tweener = this.tweener;
            if (tweener) {
                rf.tweenStop(tweener);
            }
            this.tweener = rf.tweenTo({ tdistance: distance + wheel * 2 }, Math.abs(wheel) * 2, rf.defaultTimeMixer, this);
            // this.object.z += e.deltaY > 0 ? 1: -1
            // this.distance = this.object.pos.subtract(this.target).length;
        };
        TrackballControls.prototype.mouseDownHandler = function (event) {
            rf.ROOT.on(60 /* MouseMove */, this.mouseMoveHandler, this);
            rf.ROOT.on(53 /* MouseUp */, this.mouseUpHandler, this);
            this.distance = this.object.pos.v3_sub(this.target).v3_length;
        };
        TrackballControls.prototype.mouseUpHandler = function (e) {
            rf.ROOT.off(60 /* MouseMove */, this.mouseMoveHandler);
            rf.ROOT.off(53 /* MouseUp */, this.mouseUpHandler);
        };
        TrackballControls.prototype.mouseMoveHandler = function (e) {
            var _a = this, object = _a.object, target = _a.target, mouseSitivity = _a.mouseSitivity, distance = _a.distance;
            var _b = e.data, ox = _b.ox, oy = _b.oy;
            // let dx:number = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            // let dy:number = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
            // dx *= pixelRatio;
            // dy *= pixelRatio;
            var speed = (distance > 1000) ? mouseSitivity : mouseSitivity * distance / 1000;
            speed = Math.max(speed, 0.1);
            var rx = oy * speed + object.rotationX;
            var ry = -ox * speed + object.rotationY;
            if (target) {
                var transform = rf.TEMP_MATRIX;
                transform.m3_identity();
                transform.m3_translation(0, 0, -distance);
                transform.m3_rotation(rx * rf.DEGREES_TO_RADIANS, rf.X_AXIS);
                transform.m3_rotation(ry * rf.DEGREES_TO_RADIANS, rf.Y_AXIS);
                transform.m3_translation(target.x, target.y, target.z);
                object.setPos(transform[12], transform[13], transform[14]);
            }
            object.rotationX = rx;
            object.rotationY = ry;
            this.updateSun();
        };
        TrackballControls.prototype.mouseRightDownHandler = function (event) {
            rf.ROOT.on(60 /* MouseMove */, this.mouseRightMoveHandler, this);
            rf.ROOT.on(54 /* MouseRightUp */, this.mouseRightUpHandler, this);
        };
        TrackballControls.prototype.mouseRightMoveHandler = function (event) {
            var _a = event.data, ox = _a.ox, oy = _a.oy;
            var _b = this, object = _b.object, target = _b.target;
            oy *= (this.distance / object.originFar);
            target.y += oy;
            object.setPos(object._x, object._y += oy, object._z);
            this.updateSun();
        };
        TrackballControls.prototype.mouseRightUpHandler = function (event) {
            rf.ROOT.off(60 /* MouseMove */, this.mouseRightMoveHandler);
            rf.ROOT.off(54 /* MouseRightUp */, this.mouseRightUpHandler);
        };
        return TrackballControls;
    }());
    rf.TrackballControls = TrackballControls;
})(rf || (rf = {}));
//# sourceMappingURL=CameraControls.js.map