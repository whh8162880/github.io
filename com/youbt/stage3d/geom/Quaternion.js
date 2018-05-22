///<reference path="Matrix3D.ts"/>
var rf;
(function (rf) {
    var Quaternion = /** @class */ (function () {
        function Quaternion(x, y, z, w) {
            if (w === void 0) { w = 1; }
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w;
        }
        Quaternion.lerp = function (qa, qb, percent) {
            var qax = qa.x, qay = qa.y, qaz = qa.z, qaw = qa.w;
            var qbx = qb.x, qby = qb.y, qbz = qb.z, qbw = qb.w;
            // shortest direction
            if (qax * qbx + qay * qby + qaz * qbz + qaw * qbw < 0) {
                return new Quaternion(qax + percent * (-qbx - qax), qay + percent * (-qby - qay), qaz + percent * (-qbz - qaz), qaw + percent * (-qbw - qaw));
            }
            return new Quaternion(qax + percent * (qbx - qax), qay + percent * (qby - qay), qaz + percent * (qbz - qaz), qaw + percent * (qbw - qaw));
        };
        Quaternion.prototype.fromMatrix3D = function (m) {
            var _a = m, m11 = _a[0], m12 = _a[1], m13 = _a[2], m21 = _a[4], m22 = _a[5], m23 = _a[6], m31 = _a[8], m32 = _a[9], m33 = _a[10];
            var tr = m11 + m22 + m33;
            var tmp;
            if (tr > 0) {
                tmp = 1 / (2 * Math.sqrt(tr + 1));
                this.x = (m23 - m32) * tmp;
                this.y = (m31 - m13) * tmp;
                this.z = (m12 - m21) * tmp;
                this.w = 0.25 / tmp;
            }
            else {
                if ((m11 > m22) && (m11 > m33)) {
                    tmp = 1 / (2 * Math.sqrt(1 + m11 - m22 + m33));
                    this.x = (m21 + m12) * tmp;
                    this.y = (m13 + m31) * tmp;
                    this.z = (m32 - m23) * tmp;
                    this.w = 0.25 / tmp;
                }
                else if ((m22 > m11) && (m22 > m33)) {
                    tmp = 1 / (Math.sqrt(1 + m22 - m11 - m33));
                    this.x = 0.25 / tmp;
                    this.y = (m32 + m23) * tmp;
                    this.z = (m13 - m31) * tmp;
                    this.w = (m21 + m12) * tmp;
                }
                else if ((m33 > m11) && (m33 > m22)) {
                    tmp = 1 / (Math.sqrt(1 + m33 - m11 - m22));
                    this.x = (m32 + m23) * tmp;
                    this.y = 0.25 / tmp;
                    this.z = (m21 - m12) * tmp;
                    this.w = (m13 + m31) * tmp;
                }
            }
            return this;
        };
        Quaternion.prototype.toMatrix3D = function (target) {
            var _a = this, x = _a.x, y = _a.y, z = _a.z, w = _a.w;
            var x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2;
            if (!target) {
                target = rf.newMatrix3D();
            }
            var rawData = target;
            rawData[0] = 1 - (yy + zz);
            rawData[1] = xy + wz;
            rawData[2] = xz - wy;
            rawData[3] = 0;
            rawData[4] = xy - wz;
            rawData[5] = 1 - (xx + zz);
            rawData[6] = yz + wx;
            rawData[7] = 0;
            rawData[8] = xz + wy;
            rawData[9] = yz - wx;
            rawData[10] = 1 - (xx + yy);
            rawData[11] = 0;
            rawData[12] = 0;
            rawData[13] = 0;
            rawData[14] = 0;
            rawData[15] = 1;
            return target;
        };
        /**
         * @param axis   must be a normalized vector
         * @param angleInRadians
         */
        Quaternion.prototype.fromAxisAngle = function (axis, angleInRadians) {
            var angle = angleInRadians * 0.5;
            var sin_a = Math.sin(angle);
            var cos_a = Math.cos(angle);
            this.x = axis.x * sin_a;
            this.y = axis.y * sin_a;
            this.z = axis.z * sin_a;
            this.w = cos_a;
        };
        Quaternion.prototype.conjugate = function () {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
        };
        Quaternion.prototype.toString = function () {
            return "[Quaternion] (x:" + this.x + " ,y:" + this.y + ", z:" + this.z + ", w:" + this.w + ")";
        };
        return Quaternion;
    }());
    rf.Quaternion = Quaternion;
})(rf || (rf = {}));
//# sourceMappingURL=Quaternion.js.map