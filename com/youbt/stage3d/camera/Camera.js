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
///<reference path="../display/DisplayObject.ts" />
var rf;
(function (rf) {
    var Camera = /** @class */ (function (_super) {
        __extends(Camera, _super);
        function Camera(far) {
            if (far === void 0) { far = 10000; }
            var _this = _super.call(this) || this;
            _this.far = far;
            _this.originFar = far / Math.PI2;
            _this.len = rf.newMatrix3D();
            _this.worldTranform = rf.newMatrix3D();
            return _this;
        }
        Camera.prototype.updateSceneTransform = function (sceneTransform) {
            if (this.states | 1 /* trasnform */) {
                this.updateTransform();
                this.sceneTransform.m3_invert(this.transform);
                this.worldTranform.m3_append(this.len, false, this.sceneTransform);
                // this.states &= ~DChange.trasnform;
            }
            this.states = 0;
        };
        return Camera;
    }(rf.DisplayObject));
    rf.Camera = Camera;
    function CameraUIResize(width, height, len, far, originFar, camera) {
        if (camera) {
            camera.w = width;
            camera.h = height;
            camera.states |= 1 /* trasnform */;
        }
        len[0] = 2 / width;
        len[1] = 0;
        len[2] = 0;
        len[3] = 0;
        len[4] = 0;
        len[5] = -2 / height;
        len[6] = 0;
        len[7] = 0;
        len[8] = 0;
        len[9] = 0;
        len[10] = 1 / far;
        len[11] = 0;
        len[12] = -1;
        len[13] = 1;
        len[14] = 0;
        len[15] = 1;
    }
    rf.CameraUIResize = CameraUIResize;
    function CameraOrthResize(width, height, len, far, originFar, camera) {
        if (camera) {
            camera.w = width;
            camera.h = height;
            camera.states |= 1 /* trasnform */;
        }
        len[0] = 2 / width;
        len[1] = 0;
        len[2] = 0;
        len[3] = 0;
        len[4] = 0;
        len[5] = 2 / height;
        len[6] = 0;
        len[7] = 0;
        len[8] = 0;
        len[9] = 0;
        len[10] = 1 / far;
        len[11] = 0;
        len[12] = 0;
        len[13] = 0;
        len[14] = -1 / far * Math.PI * 100;
        // len[14] = -1/far;
        len[15] = 1;
    }
    rf.CameraOrthResize = CameraOrthResize;
    //  Perspective Projection Matrix
    function Camera3DResize(width, height, len, far, originFar, camera) {
        if (camera) {
            camera.w = width;
            camera.h = height;
            camera.states |= 1 /* trasnform */;
        }
        // let zNear = 0.1;
        // let zFar = far;
        // let len = new PerspectiveMatrix3D();
        // len.perspectiveFieldOfViewLH(45,width/height,0.1,10000);
        // len.perspectiveFieldOfViewRH(45,width/height,0.1,10000);
        // this.len = len;
        // len.transpose();
        // xScale, 0.0, 0.0, 0.0,
        // 0.0, yScale, 0.0, 0.0,
        // 0.0, 0.0, (zFar + zNear) / (zFar - zNear), 1.0,
        // 0.0, 0.0, 2.0 * zFar * zNear / (zNear - zFar), 0.0
        // (zFar + zNear) / (zFar - zNear)
        // 2.0 * zFar * zNear / (zNear - zFar)
        // this.len = len;
        // let yScale: number = 1.0 / Math.tan(45 / 2.0);
        // let xScale: number = yScale / width * height;
        // rawData[0] = xScale;        rawData[1] = 0;                   rawData[2] = 0;                                       rawData[3] = 0;
        // rawData[4] = 0;             rawData[5] = yScale;              rawData[6] = 0;                                       rawData[7] = 0;
        // rawData[8] = 0;             rawData[9] = 0;                   rawData[10] = (zFar + zNear) / (zFar - zNear);        rawData[11] = 1.0;
        // rawData[12] = 0;            rawData[13] = 0;                  rawData[14] = 2.0 * zFar * zNear / (zNear - zFar);    rawData[15] = 0;
        len[0] = 2 / width;
        len[1] = 0;
        len[2] = 0;
        len[3] = 0;
        len[4] = 0;
        len[5] = 2 / height;
        len[6] = 0;
        len[7] = 0;
        len[8] = 0;
        len[9] = 0;
        len[10] = 1 / far;
        len[11] = 1 / originFar;
        len[12] = 0;
        len[13] = 0;
        len[14] = -1 / far * Math.PI * 100;
        len[15] = 0;
    }
    rf.Camera3DResize = Camera3DResize;
})(rf || (rf = {}));
//# sourceMappingURL=Camera.js.map