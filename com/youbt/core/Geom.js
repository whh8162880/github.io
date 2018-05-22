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
///<reference path="../stage3d/geom/Matrix3D.ts" />
var rf;
(function (rf) {
    function size_checkIn(l, r, t, b, dx, dy, scale) {
        return dx > l * scale && dx < r * scale && dy > t * scale && dy < b * scale;
    }
    rf.size_checkIn = size_checkIn;
    rf.rgb_color_temp = { r: 1, g: 1, b: 1, a: 1 };
    function hexToCSS(d, a) {
        if (a === void 0) { a = 1; }
        var r = ((d & 0x00ff0000) >>> 16) & 0xFF;
        var g = ((d & 0x0000ff00) >>> 8) & 0xFF;
        var b = d & 0x000000ff;
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'; //"rgba(0, 0, 200, 0.5)";
    }
    rf.hexToCSS = hexToCSS;
    function toRGB(color, out) {
        if (undefined == out) {
            out = rf.rgb_color_temp;
        }
        out.hex = color;
        out.a = 1.0;
        out.r = ((color & 0x00ff0000) >>> 16) / 0xFF;
        out.g = ((color & 0x0000ff00) >>> 8) / 0xFF;
        out.b = (color & 0x000000ff) / 0xFF;
        return out;
    }
    rf.toRGB = toRGB;
    function toCSS(color) {
        return "rgba(" + color.r * 0xFF + "," + color.g * 0xFF + "," + color.b * 0xFF + "," + color.a * 0xFF + ")";
    }
    rf.toCSS = toCSS;
    function newColor(hex) {
        return toRGB(hex, {});
    }
    rf.newColor = newColor;
    /**
     * 有 `x` `y` 两个属性
     *
     * @export
     * @interface Point
     */
    var Point = /** @class */ (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Object.defineProperty(Point.prototype, "length", {
            get: function () {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            },
            enumerable: true,
            configurable: true
        });
        return Point;
    }());
    rf.Point = Point;
    /**
     * 矩形
     * 有`x`,`y`,`width`,`height` 4个属性
     *
     * @export
     * @interface Rect
     * @extends {Point}
     * @extends {Size}
     */
    var Rect = /** @class */ (function (_super) {
        __extends(Rect, _super);
        function Rect(x, y, w, h) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            var _this = _super.call(this, x, y) || this;
            _this.w = 0;
            _this.h = 0;
            _this.w = w;
            _this.h = h;
            return _this;
        }
        Rect.prototype.clone = function () {
            return new Rect(this.x, this.y, this.w, this.h);
        };
        return Rect;
    }(Point));
    rf.Rect = Rect;
    rf.RADIANS_TO_DEGREES = 180 / Math.PI;
    rf.DEGREES_TO_RADIANS = Math.PI / 180;
    rf.tempAxeX = rf.newVector3D();
    rf.tempAxeY = rf.newVector3D();
    rf.tempAxeZ = rf.newVector3D();
    rf.X_AXIS = rf.newVector3D(1, 0, 0);
    rf.Y_AXIS = rf.newVector3D(0, 1, 0);
    rf.Z_AXIS = rf.newVector3D(0, 0, 1);
    rf.PI2 = Math.PI * 2;
    rf.RAW_DATA_CONTAINER = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
    rf.TEMP_MATRIX = rf.newMatrix3D();
    // export let CALCULATION_MATRIX_2D:Matrix = new Matrix();
    rf.TEMP_VECTOR3D = rf.newVector3D();
    rf.TEMP_DECOMPOSE = [rf.newVector3D(), rf.newVector3D(), rf.newVector3D()];
    rf.Location = {
        /**
         * 根据两个经纬度获取距离(单位：米)
         *
         * @param {Location} l1
         * @param {Location} l2
         * @returns 距离(单位：米)
         */
        getDist: function (l1, l2) {
            var dtr = rf.DEGREES_TO_RADIANS;
            var radlat1 = l1.latitude * dtr;
            var radlat2 = l2.latitude * dtr;
            var a = radlat1 - radlat2;
            var b = (l1.longitude - l2.longitude) * dtr;
            return Math.asin(Math.sqrt(Math.pow(Math.sin(a * .5), 2) + Math.cos(radlat1) * Math.cos(radlat2) * (Math.pow(Math.sin(b * .5), 2)))) * 12756274;
        }
    };
    rf.EMPTY_POINT2D = new Point();
    rf.EMPTY_POINT2D_2 = new Point();
    rf.EMPTY_POINT2D_3 = new Point();
    // export function m2dTransform(matrix:ArrayLike<number>,p:Point2D,out:Point2D):void{
    //     const{
    //         m11,m12,m13,
    //         m21,m22,m23,
    //         m31,m32,m33
    //     } = matrix as any;
    //     const{
    //         x,y
    //     } = p;
    //     let dx = x * m11 + y * m21 + m31;
    //     let dy = x * m12 + y * m22 + m32;
    //     out.x = dx;
    //     out.y = dy;
    // }
    function m2dTransform(matrix, p, out) {
        var _a = matrix, m11 = _a[0], m12 = _a[1], m13 = _a[2], m21 = _a[3], m22 = _a[4], m23 = _a[5], m31 = _a[6], m32 = _a[7], m33 = _a[8];
        var x = p[0];
        var y = p[1];
        var dx = x * m11 + y * m21 + m31;
        var dy = x * m12 + y * m22 + m32;
        out[0] = dx;
        out[1] = dy;
    }
    rf.m2dTransform = m2dTransform;
    // export class Float32Byte {
    //     public array: Float32Array;
    //     constructor(array?: Float32Array) {
    //         if(undefined == array){
    //             array = new Float32Array(0);
    //         }
    //         this.array = array;
    //     }
    //     get length(): number {
    //         return this.array.length;
    //     }
    //     set length(value: number) {
    //         if (this.array.length == value) {
    //             return;
    //         }
    //         let nd = new Float32Array(value);
    //         let len = value < this.array.length ? value : this.array.length;
    //         if(len != 0){
    //             // nd.set(this.array.slice(0, len), 0);
    //             nd.set(this.array);
    //         }
    //         this.array = nd;
    //     }
    //     append(byte: Float32Byte, offset: number = 0, len: number = -1): void {
    //         var position: number = 0;
    //         if (0 > offset) {
    //             offset = 0;
    //         }
    //         if (-1 == len) {
    //             len = byte.length - offset;
    //         } else {
    //             if (len > byte.length - offset) {
    //                 len = byte.length - offset;
    //             }
    //         }
    //         position = this.array.length;
    //         length = this.array.length + byte.length;
    //         if (len == byte.length) {
    //             this.array.set(byte.array, position);
    //         } else {
    //             this.array.set(byte.array.slice(offset, len), position);
    //         }
    //     }
    //     set(position:number, byte: Float32Byte, offset: number = 0, len: number = -1):void{
    //         if (0 > offset) {
    //             offset = 0;
    //         }
    //         if (-1 == len) {
    //             len = byte.length - offset;
    //         } else {
    //             if (len > byte.length - offset) {
    //                 len = byte.length - offset;
    //             }
    //         }
    //         if (len == byte.length) {
    //             this.array.set(byte.array, position);
    //         } else {
    //             this.array.set(byte.array.slice(offset, len), position);
    //         }
    //     }
    //     wPoint1(position: number, x: number, y?: number, z?: number, w?: number): void {
    //         this.array[position] = x;
    //     }
    //     wPoint2(position: number, x: number, y: number, z?: number, w?: number): void {
    //         this.array[position] = x;
    //         this.array[position + 1] = y;
    //     }
    //     wPoint3(position: number, x: number, y: number, z: number, w?: number): void {
    //         this.array[position] = x;
    //         this.array[position + 1] = y;
    //         this.array[position + 2] = z;
    //     }
    //     wPoint4(position: number, x: number, y: number, z: number, w: number): void {
    //         this.array[position] = x;
    //         this.array[position + 1] = y;
    //         this.array[position + 2] = z;
    //         this.array[position + 3] = w;
    //     }
    //     wUIPoint(position: number, x: number, y: number, z: number, u: number, v: number, index: number, r: number, g: number, b: number, a: number): void {
    //         this.array[position] = x;
    //         this.array[position + 1] = y;
    //         this.array[position + 2] = z;
    //         this.array[position + 3] = u;
    //         this.array[position + 4] = v;
    //         this.array[position + 5] = index;
    //         this.array[position + 6] = r;
    //         this.array[position + 7] = g;
    //         this.array[position + 8] = b;
    //         this.array[position + 9] = a;
    //     }
    // }
})(rf || (rf = {}));
//# sourceMappingURL=Geom.js.map