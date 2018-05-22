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
    var PerspectiveMatrix3D = /** @class */ (function (_super) {
        __extends(PerspectiveMatrix3D, _super);
        function PerspectiveMatrix3D() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PerspectiveMatrix3D.prototype.lookAtLH = function (eye, at, up) {
            //http://msdn.microsoft.com/en-us/library/windows/desktop/bb281710(v=vs.85).aspx
            //zaxis = normal(at - eye)
            var sqrt = Math.sqrt;
            var eyex = eye.x, eyey = eye.y, eyez = eye.z;
            var upx = up.x, upy = up.y, upz = up.z;
            var zX = at.x - eyex;
            var zY = at.y - eyey;
            var zZ = at.z - eyez;
            var len = 1 / sqrt(zX * zX + zY * zY + zZ * zZ);
            zX *= len;
            zY *= len;
            zZ *= len;
            //xaxis = normal(cross(up,zaxis))
            var xX = upy * zZ - upz * zY;
            var xY = upz * zX - upx * zZ;
            var xZ = upx * zY - upy * zX;
            len = 1 / sqrt(xX * xX + xY * xY + xZ * xZ);
            xX *= len;
            xY *= len;
            xZ *= len;
            //yaxis = cross(zaxis,xaxis)
            var yX = zY * xZ - zZ * xY;
            var yY = zZ * xX - zX * xZ;
            var yZ = zX * xY - zY * xX;
            this.set([
                xX, xY, xZ, -(xX * eyex + xY * eyey + xZ * eyez),
                yX, yY, yZ, -(yX * eyex + yY * eyey + yZ * eyez),
                zX, zY, zZ, -(zX * eyex + zY * eyey + zZ * eyez),
                0.0, 0.0, 0.0, 1.0
            ]);
        };
        PerspectiveMatrix3D.prototype.lookAtRH = function (eye, at, up) {
            //http://msdn.microsoft.com/en-us/library/windows/desktop/bb281711(v=vs.85).aspx
            //http://blog.csdn.net/popy007/article/details/5120158
            var sqrt = Math.sqrt;
            var eyex = eye.x, eyey = eye.y, eyez = eye.z;
            var upx = up.x, upy = up.y, upz = up.z;
            //zaxis = normal(eye - at)
            var zX = eyex - at.x;
            var zY = eyey - at.y;
            var zZ = eyez - at.z;
            var len = 1 / sqrt(zX * zX + zY * zY + zZ * zZ);
            zX *= len;
            zY *= len;
            zZ *= len;
            // xaxis = normal(cross(up,zaxis))
            var xX = upy * zZ - upz * zY;
            var xY = upz * zX - upx * zZ;
            var xZ = upx * zY - upy * zX;
            len = 1 / sqrt(xX * xX + xY * xY + xZ * xZ);
            xX *= len;
            xY *= len;
            xZ *= len;
            //yaxis = cross(zaxis,xaxis)
            var yX = zY * xZ - zZ * xY;
            var yY = zZ * xX - zX * xZ;
            var yZ = zX * xY - zY * xX;
            this.set([
                xX, xY, xZ, -(xX * eyex + xY * eyey + xZ * eyez),
                yX, yY, yZ, -(yX * eyex + yY * eyey + yZ * eyez),
                zX, zY, zZ, -(zX * eyex + zY * eyey + zZ * eyez),
                0.0, 0.0, 0.0, 1.0
            ]);
        };
        PerspectiveMatrix3D.prototype.perspectiveOffCenterLH = function (left, right, bottom, top, zNear, zFar) {
            this.set([
                2.0 * zNear / (right - left), 0.0, (left + right) / (left - right), 0.0,
                0.0, 2.0 * zNear / (top - bottom), (bottom + top) / (bottom - top), 0.0,
                0.0, 0.0, (zFar + zNear) / (zFar - zNear), 2.0 * zFar * zNear / (zNear - zFar),
                0.0, 0.0, 1.0, 0.0
            ]);
        };
        PerspectiveMatrix3D.prototype.perspectiveLH = function (width, height, zNear, zFar) {
            this.set([
                2.0 * zNear / width, 0.0, 0.0, 0.0,
                0.0, 2.0 * zNear / height, 0.0, 0.0,
                0.0, 0.0, (zFar + zNear) / (zFar - zNear), 2.0 * zFar * zNear / (zNear - zFar),
                0.0, 0.0, 1.0, 0.0
            ]);
        };
        PerspectiveMatrix3D.prototype.perspectiveFieldOfViewLH = function (fieldOfViewY, aspectRatio, zNear, zFar) {
            var yScale = 1.0 / Math.tan(fieldOfViewY / 2.0);
            var xScale = yScale / aspectRatio;
            this.set([
                xScale, 0.0, 0.0, 0.0,
                0.0, yScale, 0.0, 0.0,
                0.0, 0.0, (zFar + zNear) / (zFar - zNear), 1.0,
                0.0, 0.0, 2.0 * zFar * zNear / (zNear - zFar), 0.0
            ]);
        };
        PerspectiveMatrix3D.prototype.orthoOffCenterLH = function (left, right, bottom, top, zNear, zFar) {
            this.set([
                2.0 / (right - left), 0.0, 0.0, (left + right) / (left - right),
                0.0, 2.0 / (top - bottom), 0.0, (bottom + top) / (bottom - top),
                0.0, 0.0, 2 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
                0.0, 0.0, 0.0, 1.0
            ]);
        };
        PerspectiveMatrix3D.prototype.orthoLH = function (width, height, zNear, zFar) {
            this.set([
                2.0 / width, 0.0, 0.0, 0.0,
                0.0, 2.0 / height, 0.0, 0.0,
                0.0, 0.0, 2 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
                0.0, 0.0, 0.0, 1.0
            ]);
        };
        //pass test
        PerspectiveMatrix3D.prototype.perspectiveOffCenterRH = function (left, right, bottom, top, zNear, zFar) {
            this.set([
                2.0 * zNear / (right - left), 0.0, (right + left) / (right - left), 0.0,
                0.0, 2.0 * zNear / (top - bottom), (top + bottom) / (top - bottom), 0.0,
                0.0, 0.0, (zNear + zFar) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
                0.0, 0.0, -1.0, 0.0
            ]);
        };
        //pass test
        PerspectiveMatrix3D.prototype.perspectiveRH = function (width, height, zNear, zFar) {
            this.set([
                2.0 * zNear / width, 0.0, 0.0, 0.0,
                0.0, 2.0 * zNear / height, 0.0, 0.0,
                0.0, 0.0, (zNear + zFar) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
                0.0, 0.0, -1.0, 0.0
            ]);
        };
        //pass test
        PerspectiveMatrix3D.prototype.perspectiveFieldOfViewRH = function (fieldOfViewY, aspectRatio, zNear, zFar) {
            var yScale = 1.0 / Math.tan(fieldOfViewY / 2.0);
            var xScale = yScale / aspectRatio;
            this.set([
                xScale, 0.0, 0.0, 0.0,
                0.0, yScale, 0.0, 0.0,
                0.0, 0.0, (zFar + zNear) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar),
                0.0, 0.0, -1.0, 0.0
            ]);
        };
        PerspectiveMatrix3D.prototype.orthoOffCenterRH = function (left, right, bottom, top, zNear, zFar) {
            this.set([
                2.0 / (right - left), 0.0, 0.0, (left + right) / (left - right),
                0.0, 2.0 / (top - bottom), 0.0, (bottom + top) / (bottom - top),
                0.0, 0.0, -2.0 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
                0.0, 0.0, 0.0, 1.0
            ]);
        };
        PerspectiveMatrix3D.prototype.orthoRH = function (width, height, zNear, zFar) {
            this.set([
                2.0 / width, 0.0, 0.0, 0.0,
                0.0, 2.0 / height, 0.0, 0.0,
                0.0, 0.0, -2.0 / (zFar - zNear), (zNear + zFar) / (zNear - zFar),
                0.0, 0.0, 0.0, 1.0
            ]);
        };
        return PerspectiveMatrix3D;
    }(Float32Array));
    rf.PerspectiveMatrix3D = PerspectiveMatrix3D;
})(rf || (rf = {}));
//# sourceMappingURL=PerspectiveMatrix3D.js.map