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
///<reference path="../../rfreference.ts" />
var rf;
(function (rf) {
    var HitArea = /** @class */ (function () {
        function HitArea() {
            this.left = 0;
            this.right = 0;
            this.top = 0;
            this.bottom = 0;
            this.front = 0;
            this.back = 0;
        }
        HitArea.prototype.clean = function () {
            this.left = this.right = this.top = this.bottom = this.front = this.back = 0;
        };
        HitArea.prototype.combine = function (hitArea, x, y) {
            var b = false;
            if (hitArea == undefined) {
                return b;
            }
            if (this.left > hitArea.left + x) {
                this.left = hitArea.left + x;
                b = true;
            }
            if (this.right < hitArea.right + x) {
                this.right = hitArea.right + x;
                b = true;
            }
            if (this.top > hitArea.top + y) {
                this.top = hitArea.top + y;
                b = true;
            }
            if (this.bottom < hitArea.bottom + y) {
                this.bottom = hitArea.bottom + y;
                b = true;
            }
            if (this.front > hitArea.front) {
                this.front = hitArea.front;
                b = true;
            }
            if (this.back < hitArea.back) {
                this.back = hitArea.back;
                b = true;
            }
            return b;
        };
        HitArea.prototype.updateArea = function (x, y, z) {
            var b = false;
            if (this.left > x) {
                this.left = x;
                b = true;
            }
            else if (this.right < x) {
                this.right = x;
                b = true;
            }
            if (this.top > y) {
                this.top = y;
                b = true;
            }
            else if (this.bottom < y) {
                this.bottom = y;
                b = true;
            }
            if (this.front > z) {
                this.front = z;
                b = true;
            }
            else if (this.back < z) {
                this.back = z;
                b = true;
            }
            return b;
        };
        HitArea.prototype.checkIn = function (x, y, scale) {
            if (scale === void 0) { scale = 1; }
            if (this.allWays) {
                return true;
            }
            if (x > this.left * scale && x < this.right * scale && y > this.top * scale && y < this.bottom * scale) {
                return true;
            }
            return false;
        };
        HitArea.prototype.toString = function () {
            return "HitArea left:" + this.left + " right:" + this.right + " top:" + this.top + " bottom:" + this.bottom + " front:" + this.front + " back:" + this.back;
        };
        return HitArea;
    }());
    rf.HitArea = HitArea;
    var DisplayObject = /** @class */ (function (_super) {
        __extends(DisplayObject, _super);
        function DisplayObject() {
            var _this = _super.call(this) || this;
            _this.mouseEnabled = false;
            _this.mouseChildren = true;
            _this.mousedown = false;
            _this.mouseroll = false;
            _this.up = rf.newVector3D(0, 1, 0);
            _this._x = 0;
            _this._y = 0;
            _this._z = 0;
            _this.w = 0;
            _this.h = 0;
            _this._rotationX = 0;
            _this._rotationY = 0;
            _this._rotationZ = 0;
            _this._scaleX = 1;
            _this._scaleY = 1;
            _this._scaleZ = 1;
            _this._alpha = 1;
            _this.sceneAlpha = 1;
            _this._visible = true;
            _this.states = 0;
            _this.pivotZero = false;
            _this.locksize = false;
            _this.invalidateFuncs = [];
            _this.pos = rf.newVector3D();
            _this.rot = rf.newVector3D();
            _this.sca = rf.newVector3D(1, 1, 1);
            _this.transform = rf.newMatrix3D();
            _this.sceneTransform = rf.newMatrix3D();
            return _this;
        }
        /**
         * 逻辑规则
         * 改变对象 transform  alpha   vertexData  vcData  hitArea
         * 1.transform alpha 改变需要递归计算 并且上层是需要下层有改变的 引申出 ct 对象 childTranformORAlphaChange
         * 2.vertexData vcData 是要让batcher知道数据改变了 本层不需要做任何处理
         * 3.hitArea 改变 需要递归计算，引申出 ca对象 childHitAreaChange
         */
        DisplayObject.prototype.setChange = function (value, p, c) {
            if (p === void 0) { p = 0; }
            if (c === void 0) { c = false; }
            //batcher相关的都和我无关
            this.states |= (value & ~12 /* batch */); //本层不需要batcher对象识别
            if (undefined != this.parent) {
                if (value & 3 /* ta */) {
                    value |= 16 /* ct */; //如果本层transform or alpha 改变了 那就得通知上层
                }
                if (value & 32 /* area */) {
                    value |= 64 /* ca */; //如果本层hitArea改变了 那就得通知上层
                }
                this.parent.setChange(/*给batcher用的*/ value & 12 /* batch */, /*给顶层通知说下层有情况用的*/ value & 80 /* c_all */, true);
            }
        };
        Object.defineProperty(DisplayObject.prototype, "visible", {
            get: function () { return this._visible; },
            set: function (value) {
                if (this._visible != value) {
                    this._visible = value;
                    this.setChange(4 /* vertex */);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "alpha", {
            get: function () {
                return this._alpha;
            },
            set: function (value) {
                if (this._alpha == value) {
                    return;
                }
                var vertex = 0;
                if (this._alpha <= 0 || value == 0) {
                    vertex |= 4 /* vertex */;
                }
                this._alpha = value;
                this.setChange(vertex | 2 /* alpha */ | 8 /* vcdata */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "scaleX", {
            get: function () { return this._scaleX; },
            set: function (value) {
                if (this._scaleX == value)
                    return;
                this._scaleX = value;
                this.sca.x = value;
                this.setChange(1 /* trasnform */ | 8 /* vcdata */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "scaleY", {
            get: function () { return this._scaleY; },
            set: function (value) { this._scaleY = value; this.sca.y = value; this.setChange(1 /* trasnform */); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "scaleZ", {
            get: function () { return this._scaleZ; },
            set: function (value) { this._scaleZ = value; this.sca.z = value; this.setChange(1 /* trasnform */); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "rotationX", {
            get: function () { return this._rotationX * rf.RADIANS_TO_DEGREES; },
            set: function (value) {
                value %= 360;
                value *= rf.DEGREES_TO_RADIANS;
                if (value == this._rotationX)
                    return;
                this._rotationX = value;
                this.rot.x = value;
                this.setChange(1 /* trasnform */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "rotationY", {
            get: function () { return this._rotationY * rf.RADIANS_TO_DEGREES; },
            set: function (value) {
                value %= 360;
                value *= rf.DEGREES_TO_RADIANS;
                if (value == this._rotationY)
                    return;
                this._rotationY = value;
                this.rot.y = value;
                this.setChange(1 /* trasnform */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "rotationZ", {
            get: function () { return this._rotationZ * rf.RADIANS_TO_DEGREES; },
            set: function (value) {
                value %= 360;
                value *= rf.DEGREES_TO_RADIANS;
                if (value == this._rotationZ)
                    return;
                this._rotationZ = value;
                this.rot.z = value;
                this.setChange(1 /* trasnform */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "x", {
            get: function () { return this._x; },
            set: function (value) {
                if (value == this._x)
                    return;
                this._x = value;
                this.pos.x = value;
                this.setChange(1 /* trasnform */ | 8 /* vcdata */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "y", {
            get: function () { return this._y; },
            set: function (value) {
                if (value == this._y)
                    return;
                this._y = value;
                this.pos.y = value;
                this.setChange(1 /* trasnform */ | 8 /* vcdata */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "z", {
            get: function () { return this._z; },
            set: function (value) {
                if (value == this._z)
                    return;
                this._z = value;
                this.pos.z = value;
                this.setChange(1 /* trasnform */);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.setPos = function (x, y, z, update) {
            if (z === void 0) { z = 0; }
            if (update === void 0) { update = true; }
            this.pos.x = this._x = x;
            this.pos.y = this._y = y;
            this.pos.z = this._z = z;
            if (update) {
                this.setChange(1 /* trasnform */ | 8 /* vcdata */);
            }
        };
        Object.defineProperty(DisplayObject.prototype, "eulers", {
            set: function (value) {
                this._rotationX = value.x * rf.DEGREES_TO_RADIANS;
                this._rotationY = value.y * rf.DEGREES_TO_RADIANS;
                this._rotationZ = value.z * rf.DEGREES_TO_RADIANS;
                this.setChange(1 /* trasnform */);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 当前方向Z轴移动
         * @param distance
         *
         */
        DisplayObject.prototype.forwardPos = function (distance, target) {
            var pos = this.pos;
            this.transform.m3_copyColumnTo(2, rf.tempAxeX);
            rf.tempAxeX.v3_normalize();
            if (undefined != target) {
                pos.x = -rf.tempAxeX.x * distance + target.x;
                pos.y = -rf.tempAxeX.y * distance + target.y;
                pos.z = -rf.tempAxeX.z * distance + target.z;
            }
            else {
                pos.x += rf.tempAxeX.x * distance;
                pos.y += rf.tempAxeX.y * distance;
                pos.z += rf.tempAxeX.z * distance;
            }
            this._x = pos.x;
            this._y = pos.y;
            this._z = pos.z;
            this.setChange(1 /* trasnform */ | 8 /* vcdata */);
        };
        /**
         * 当前方向Y轴移动
         * @param distance
         *
         */
        DisplayObject.prototype.upPos = function (distance) {
            this.transform.m3_copyColumnTo(1, rf.tempAxeX);
            rf.tempAxeX.v3_normalize();
            this.pos.x += rf.tempAxeX.x * distance;
            this.pos.y += rf.tempAxeX.y * distance;
            this.pos.z += rf.tempAxeX.z * distance;
            this._x = this.pos.x;
            this._y = this.pos.y;
            this._z = this.pos.z;
            this.setChange(1 /* trasnform */ | 8 /* vcdata */);
        };
        /**
         * 当前方向X轴移动
         * @param distance
         *
         */
        DisplayObject.prototype.rightPos = function (distance) {
            this.transform.m3_copyColumnTo(0, rf.tempAxeX);
            rf.tempAxeX.v3_normalize();
            this.pos.x += rf.tempAxeX.x * distance;
            this.pos.y += rf.tempAxeX.y * distance;
            this.pos.z += rf.tempAxeX.z * distance;
            this._x = this.pos.x;
            this._y = this.pos.y;
            this._z = this.pos.z;
            this.setChange(1 /* trasnform */ | 8 /* vcdata */);
        };
        /**
         *
         * @param rx
         * @param ry
         * @param rz
         *
         */
        DisplayObject.prototype.setRot = function (rx, ry, rz, update) {
            if (update === void 0) { update = true; }
            this.rot.x = this._rotationX = rx * rf.DEGREES_TO_RADIANS;
            this.rot.y = this._rotationY = ry * rf.DEGREES_TO_RADIANS;
            this.rot.z = this._rotationZ = rz * rf.DEGREES_TO_RADIANS;
            if (update) {
                this.setChange(1 /* trasnform */);
            }
        };
        /**
         *
         * @param rx
         * @param ry
         * @param rz
         *
         */
        DisplayObject.prototype.setRotRadians = function (rx, ry, rz, update) {
            if (update === void 0) { update = true; }
            this.rot.x = this._rotationX = rx;
            this.rot.y = this._rotationY = ry;
            this.rot.z = this._rotationZ = rz;
            if (update) {
                this.setChange(1 /* trasnform */);
            }
        };
        Object.defineProperty(DisplayObject.prototype, "scale", {
            get: function () {
                if (this._scaleX == this._scaleY && this._scaleX == this._scaleZ) {
                    return this._scaleX;
                }
                return 1;
            },
            set: function (value) {
                this.setSca(value, value, value);
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.setSca = function (sx, sy, sz, update) {
            if (update === void 0) { update = true; }
            this.sca.x = this._scaleX = sx;
            this.sca.y = this._scaleY = sy;
            this.sca.z = this._scaleZ = sz;
            if (update) {
                this.setChange(1 /* trasnform */ | 8 /* vcdata */);
            }
        };
        DisplayObject.prototype.setPivotPonumber = function (x, y, z) {
            if (undefined == this.pivotPonumber) {
                this.pivotPonumber = rf.newVector3D();
            }
            ;
            this.pivotPonumber.x = x;
            this.pivotPonumber.y = y;
            this.pivotPonumber.z = z;
            this.pivotZero = (x != 0 || y != 0 || z != 0);
        };
        DisplayObject.prototype.setTransform = function (matrix) {
            var _a = this, transform = _a.transform, pos = _a.pos, rot = _a.rot, sca = _a.sca;
            transform.set(matrix);
            transform.m3_decompose(pos, rot, sca);
            this._x = pos.x;
            this._y = pos.y;
            this._z = pos.z;
            this._rotationX = rot.x;
            this._rotationY = rot.y;
            this._rotationZ = rot.z;
            this._scaleX = sca.x;
            this._scaleY = sca.y;
            this._scaleZ = sca.z;
            this.setChange(1 /* trasnform */ | 8 /* vcdata */);
        };
        /**
         *
         */
        DisplayObject.prototype.updateTransform = function () {
            var transform = this.transform;
            if (this.pivotZero) {
                var pivotPonumber = this.pivotPonumber;
                transform.m3_identity();
                transform.m3_translation(-pivotPonumber.x, -pivotPonumber.y, -pivotPonumber.z);
                transform.m3_scale(this._scaleX, this._scaleY, this._scaleZ);
                transform.m3_translation(this._x, this._y, this._z);
                transform.m3_translation(pivotPonumber.x, pivotPonumber.y, pivotPonumber.z);
            }
            else {
                transform.m3_recompose(this.pos, this.rot, this.sca);
            }
            this.states &= ~1 /* trasnform */;
        };
        /**
         *
         *
         */
        DisplayObject.prototype.updateSceneTransform = function (sceneTransform) {
            this.sceneTransform.set(this.transform);
            this.sceneTransform.m3_append(sceneTransform);
        };
        DisplayObject.prototype.updateAlpha = function (sceneAlpha) {
            this.sceneAlpha = this.sceneAlpha * this._alpha;
            this.states &= ~2 /* alpha */;
        };
        DisplayObject.prototype.remove = function () {
            if (this.parent) {
                this.parent.removeChild(this);
            }
        };
        DisplayObject.prototype.addToStage = function () { };
        ;
        DisplayObject.prototype.removeFromStage = function () { };
        ;
        DisplayObject.prototype.setSize = function (width, height) {
            this.locksize = true;
            this.w = width;
            this.h = height;
            this.invalidate();
        };
        DisplayObject.prototype.invalidate = function (func) {
            if (func === void 0) { func = null; }
            rf.ROOT.addEventListener(1 /* ENTER_FRAME */, this.onInvalidate, this);
            if (null == func) {
                func = this.doResize;
            }
            if (this.invalidateFuncs.indexOf(func) == -1) {
                this.invalidateFuncs.push(func);
            }
        };
        DisplayObject.prototype.invalidateRemove = function (func) {
            if (func === void 0) { func = null; }
            if (null == func) {
                func = this.doResize;
            }
            var i = this.invalidateFuncs.indexOf(func);
            if (i != -1) {
                this.invalidateFuncs.splice(i, 1);
                if (!this.invalidateFuncs.length) {
                    rf.ROOT.removeEventListener(1 /* ENTER_FRAME */, this.onInvalidate);
                }
            }
        };
        DisplayObject.prototype.onInvalidate = function (event) {
            event.currentTarget.off(1 /* ENTER_FRAME */, this.onInvalidate);
            var arr = this.invalidateFuncs.concat();
            this.invalidateFuncs.length = 0;
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var func = arr_1[_i];
                func();
            }
        };
        DisplayObject.prototype.doResize = function () { };
        //==============================================================
        DisplayObject.prototype.dispatchEvent = function (event) {
            var bool = false;
            if (undefined != this.mEventListeners && event.type in this.mEventListeners) {
                bool = _super.prototype.dispatchEvent.call(this, event);
            }
            if (false == event.stopImmediatePropagation && event.bubbles) {
                if (this.parent) {
                    this.parent.dispatchEvent(event);
                }
            }
            return bool;
        };
        DisplayObject.prototype.updateHitArea = function () {
            this.states &= ~96 /* ac */;
        };
        DisplayObject.prototype.getObjectByPoint = function (dx, dy, scale) {
            var area = this.hitArea;
            if (undefined == area) {
                return undefined;
            }
            if (area.checkIn(dx, dy, this._scaleX * scale) == true) {
                return this;
            }
            return undefined;
        };
        Object.defineProperty(DisplayObject.prototype, "mouseX", {
            get: function () {
                return rf.nativeMouseX - this.sceneTransform[12];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "mouseY", {
            get: function () {
                return rf.nativeMouseY - this.sceneTransform[13];
            },
            enumerable: true,
            configurable: true
        });
        DisplayObject.prototype.render = function (camera, now, interval, target) {
        };
        DisplayObject.prototype.lookat = function (target, upAxis) {
            if (upAxis === void 0) { upAxis = null; }
            var xAxis = rf.tempAxeX;
            var yAxis = rf.tempAxeY;
            var zAxis = rf.tempAxeZ;
            var _a = this, transform = _a.transform, _scaleX = _a._scaleX, _scaleY = _a._scaleY, _scaleZ = _a._scaleZ, _x = _a._x, _y = _a._y, _z = _a._z, rot = _a.rot;
            if (undefined == upAxis) {
                upAxis = rf.Y_AXIS;
            }
            upAxis = transform.m3_transformVector(upAxis, rf.TEMP_VECTOR3D);
            zAxis.x = target.x - _x;
            zAxis.y = target.y - _y;
            zAxis.z = target.z - _z;
            zAxis.v3_normalize();
            xAxis.x = upAxis.y * zAxis.z - upAxis.z * zAxis.y;
            xAxis.y = upAxis.z * zAxis.x - upAxis.x * zAxis.z;
            xAxis.z = upAxis.x * zAxis.y - upAxis.y * zAxis.x;
            xAxis.v3_normalize();
            if (xAxis.v3_length < .05) {
                xAxis.x = upAxis.y;
                xAxis.y = upAxis.x;
                xAxis.z = 0;
                xAxis.v3_normalize();
            }
            yAxis.x = zAxis.y * xAxis.z - zAxis.z * xAxis.y;
            yAxis.y = zAxis.z * xAxis.x - zAxis.x * xAxis.z;
            yAxis.z = zAxis.x * xAxis.y - zAxis.y * xAxis.x;
            var raw = transform;
            raw[0] = _scaleX * xAxis.x;
            raw[1] = _scaleX * xAxis.y;
            raw[2] = _scaleX * xAxis.z;
            raw[3] = 0;
            raw[4] = _scaleY * yAxis.x;
            raw[5] = _scaleY * yAxis.y;
            raw[6] = _scaleY * yAxis.z;
            raw[7] = 0;
            raw[8] = _scaleZ * zAxis.x;
            raw[9] = _scaleZ * zAxis.y;
            raw[10] = _scaleZ * zAxis.z;
            raw[11] = 0;
            raw[12] = _x;
            raw[13] = _y;
            raw[14] = _z;
            raw[15] = 1;
            // if (zAxis.z < 0) {
            // 	this.rotationY = (180 - this.rotationY);
            // 	this.rotationX -= 180;
            // 	this.rotationZ -= 180;
            // }
            transform.m3_decompose(undefined, rot, undefined);
            // let v = transform.decompose();
            // xAxis = v[1];
            this._rotationX = rot.x;
            this._rotationY = rot.y;
            this._rotationZ = rot.z;
            this.setChange(1 /* trasnform */);
        };
        return DisplayObject;
    }(rf.MiniDispatcher));
    rf.DisplayObject = DisplayObject;
})(rf || (rf = {}));
//# sourceMappingURL=DisplayObject.js.map