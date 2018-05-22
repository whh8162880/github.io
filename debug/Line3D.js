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
    rf.line_variable = {
        "posX": { size: 3, offset: 0 },
        "posY": { size: 3, offset: 3 },
        "len": { size: 1, offset: 6 },
        "color": { size: 4, offset: 7 },
        "data32PerVertex": { size: 11, offset: 0 }
    };
    var Line3DPoint = /** @class */ (function () {
        function Line3DPoint() {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.r = 1;
            this.g = 1;
            this.b = 1;
            this.a = 1;
            this.t = 1;
        }
        Line3DPoint.prototype.clear = function () {
            this.x = this.y = this.z = 0;
            this.r = this.g = this.b = this.a = this.t = 1;
        };
        Line3DPoint.prototype.clone = function () {
            var vo = new Line3DPoint();
            vo.x = this.x;
            vo.y = this.y;
            vo.z = this.z;
            vo.r = this.r;
            vo.g = this.g;
            vo.b = this.b;
            vo.a = this.a;
            vo.t = this.t;
            return vo;
        };
        return Line3DPoint;
    }());
    rf.Line3DPoint = Line3DPoint;
    /**
     * 直线 不管放大 缩小 都不变
     */
    var Line3D = /** @class */ (function (_super) {
        __extends(Line3D, _super);
        function Line3D() {
            var _this = _super.call(this, rf.line_variable) || this;
            _this.points = [];
            _this.data32PerVertex = rf.line_variable["data32PerVertex"].size;
            _this.nativeRender = true;
            _this.worldTransform = rf.newMatrix3D();
            return _this;
        }
        Line3D.prototype.clear = function () {
            var tempVertex = this.tempVertex;
            if (undefined == tempVertex) {
                this.tempVertex = tempVertex = rf.recyclable(rf.Temp_Float32Byte);
            }
            tempVertex.data32PerVertex = this.data32PerVertex;
            tempVertex.numVertices = 0;
            var origin = this.origin;
            if (undefined == origin) {
                this.origin = origin = rf.recyclable(Line3DPoint);
            }
            this.points.length = 0;
            this.vertexBuffer = null;
        };
        Line3D.prototype.moveTo = function (x, y, z, thickness, color, alpha) {
            if (thickness === void 0) { thickness = 1; }
            if (color === void 0) { color = 0xFFFFFF; }
            if (alpha === void 0) { alpha = 1; }
            var _a = this, origin = _a.origin, points = _a.points;
            if (points.length) {
                this.build();
            }
            origin.x = x;
            origin.y = y;
            origin.z = z;
            origin.t = thickness;
            rf.toRGB(color, origin);
            origin.a = alpha;
            points.push(origin.clone());
        };
        Line3D.prototype.lineTo = function (x, y, z, thickness, color, alpha) {
            if (thickness === void 0) { thickness = 1; }
            if (color === void 0) { color = 0xFFFFFF; }
            if (alpha === void 0) { alpha = 1; }
            var _a = this, vo = _a.origin, points = _a.points;
            vo.x = x;
            vo.y = y;
            vo.z = z;
            vo.a = alpha;
            vo.t = thickness;
            rf.toRGB(color, vo);
            points.push(vo.clone());
        };
        Line3D.prototype.build = function () {
            var _a = this, points = _a.points, tempVertex = _a.tempVertex;
            var j = 0;
            var m = points.length - 1;
            for (j = 0; j < m; j++) {
                var p1 = points[j];
                var p2 = points[j + 1];
                tempVertex.set([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, -p1.t * 0.5, p1.r, p1.g, p1.b, p1.a]);
                tempVertex.set([p2.x, p2.y, p2.z, p1.x, p1.y, p1.z, p2.t * 0.5, p2.r, p2.g, p2.b, p2.a]);
                tempVertex.set([p2.x, p2.y, p2.z, p1.x, p1.y, p1.z, -p2.t * 0.5, p2.r, p2.g, p2.b, p2.a]);
                tempVertex.set([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p1.t * 0.5, p1.r, p1.g, p1.b, p1.a]);
                tempVertex.numVertices += 4;
            }
            points.length = 0;
        };
        Line3D.prototype.end = function () {
            var _a = this, origin = _a.origin, data32PerVertex = _a.data32PerVertex, points = _a.points, tempVertex = _a.tempVertex, variables = _a.variables;
            if (points.length) {
                this.build();
            }
            var arr = tempVertex.toArray();
            var info = new rf.VertexInfo(arr, data32PerVertex, variables);
            var v = this.vertexBuffer = rf.context3D.createVertexBuffer(info);
            this.triangles = v.numVertices / 2;
            this.quad = this.triangles / 2;
            tempVertex.recycle();
            origin.recycle();
            this.tempVertex = this.origin = undefined;
        };
        Line3D.prototype.updateTransform = function () {
            _super.prototype.updateTransform.call(this);
        };
        Line3D.prototype.render = function (camera, now, interval) {
            var c = rf.context3D;
            // c.setDepthTest(true,gl.LEQUAL);
            var _a = this, v = _a.vertexBuffer, m = _a.worldTransform, quad = _a.quad, triangles = _a.triangles;
            if (undefined == v) {
                return;
            }
            var p = this.program;
            if (undefined == p) {
                p = c.programs["Line3D"];
                if (undefined == p) {
                    p = this.createProgram();
                }
                this.program = p;
            }
            rf.scene.material.uploadContextSetting();
            c.setProgram(p);
            m.set(this.sceneTransform);
            m.m3_append(camera.sceneTransform);
            c.setProgramConstantsFromMatrix("mv" /* mv */, m);
            c.setProgramConstantsFromMatrix("p" /* p */, camera.len);
            v.uploadContext(p);
            var i = c.getIndexByQuad(quad);
            c.drawTriangles(i, triangles);
        };
        Line3D.prototype.createProgram = function () {
            var vertexCode = "\n                attribute vec3 posX;\n                attribute vec3 posY;\n                attribute float len;\n                attribute vec4 color;\n\n                uniform mat4 mv;\n                uniform mat4 p;\n                varying vec4 vColor;\n\n                void main(void){\n                    vec4 pos = mv * vec4(posX,1.0); \n                    vec4 t = pos - mv * vec4(posY,1.0);\n                    vec3 v = cross(t.xyz,vec3(0,0,1));\n                    v = normalize(v);\n                    float t2 = pos.z * p[2].w;\n                    if(t2 <= 0.0){\n                       v.xyz *= len;\n                    }else{\n                        v.xyz *= len * t2;\n                    }\n                    pos.xy += v.xy;\n                    pos = p * pos;\n                    gl_Position = pos;\n                    vColor = color;\n                    // t2 = pos.z;\n                    // pos = vec4(t2,t2,t2,1.0);\n                    // vColor.xyzw = pos;\n                }\n            ";
            var fragmentCode = " \n                precision mediump float;\n                varying vec4 vColor;\n                void main(void){\n                    gl_FragColor = vColor;\n                }\n            ";
            return rf.context3D.createProgram(vertexCode, fragmentCode, "Line3D");
        };
        return Line3D;
    }(rf.RenderBase));
    rf.Line3D = Line3D;
    var Trident = /** @class */ (function (_super) {
        __extends(Trident, _super);
        function Trident(len, think) {
            if (len === void 0) { len = 200; }
            if (think === void 0) { think = 2; }
            var _this = _super.call(this) || this;
            var line;
            if (len * 0.1 > 60) {
                line = len - 60;
            }
            else {
                line = len * 0.9;
            }
            _this.clear();
            var color = 0xFF0000;
            _this.moveTo(0, 0, 0, think, color);
            _this.lineTo(line, 0, 0, think, color);
            _this.moveTo(line, 0, 0, think * 5, color);
            _this.lineTo(len, 0, 0, 0, color);
            color = 0x00FF00;
            _this.moveTo(0, 0, 0, think, color);
            _this.lineTo(0, line, 0, think, color);
            _this.moveTo(0, line, 0, think * 5, color);
            _this.lineTo(0, len, 0, 0, color);
            color = 0x0000FF;
            _this.moveTo(0, 0, 0, think, color);
            _this.lineTo(0, 0, line, think, color);
            _this.moveTo(0, 0, line, think * 5, color);
            _this.lineTo(0, 0, len, 0, color);
            _this.end();
            return _this;
        }
        return Trident;
    }(Line3D));
    rf.Trident = Trident;
})(rf || (rf = {}));
//# sourceMappingURL=Line3D.js.map