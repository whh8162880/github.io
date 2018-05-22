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
    rf.vertex_ui_variable = {
        //x,y,z,u,v,index,r,g,b,a
        "pos": { size: 3, offset: 0 },
        "uv": { size: 3, offset: 3 },
        "color": { size: 4, offset: 6 },
        "data32PerVertex": { size: 10, offset: 0 }
    };
    /**
     * 可合并的UI对象完整体
     */
    rf.vertex_ui_full_variable = {
        //x,y,z,u,v,index,r,g,b,a
        "pos": { size: 3, offset: 0 },
        "normal": { size: 3, offset: 3 },
        "uv": { size: 3, offset: 6 },
        "color": { size: 4, offset: 9 },
        "data32PerVertex": { size: 13, offset: 0 }
    };
    rf.vertex_mesh_variable = {
        "pos": { size: 3, offset: 0 },
        "normal": { size: 3, offset: 3 },
        "uv": { size: 2, offset: 6 },
        "data32PerVertex": { size: 8, offset: 0 }
    };
    rf.vertex_mesh_full_variable = {
        "pos": { size: 3, offset: 0 },
        "normal": { size: 3, offset: 3 },
        "uv": { size: 2, offset: 6 },
        "color": { size: 4, offset: 8 },
        "data32PerVertex": { size: 12, offset: 0 }
    };
    rf.vertex_skeleton_variable = {
        "index": { size: 4, offset: 0 },
        "weight": { size: 4, offset: 4 },
        "data32PerVertex": { size: 8, offset: 0 }
    };
    rf.EMPTY_MAX_NUMVERTICES = Math.pow(2, 13);
    rf.empty_float32_pos = new Float32Array(3 * rf.EMPTY_MAX_NUMVERTICES);
    rf.empty_float32_normal = new Float32Array(3 * rf.EMPTY_MAX_NUMVERTICES);
    rf.empty_float32_tangent = new Float32Array(3 * rf.EMPTY_MAX_NUMVERTICES);
    rf.empty_float32_uv = new Float32Array(2 * rf.EMPTY_MAX_NUMVERTICES);
    rf.empty_float32_color = new Float32Array(4 * rf.EMPTY_MAX_NUMVERTICES);
    //2000面应该很多了吧
    rf.empty_uint16_indexs = new Uint16Array(3 * rf.EMPTY_MAX_NUMVERTICES);
    rf.empty_float32_object = {
        "pos": rf.empty_float32_pos,
        "normal": rf.empty_float32_normal,
        "uv": rf.empty_float32_uv,
        "color": rf.empty_float32_color
    };
    /**
     * pos:Float32Array
     * noraml:Float32Array
     * uv:Float32Array
     * color:Float32Array
     */
    function createGeometry(data, variables, numVertices, result) {
        var data32PerVertex = variables["data32PerVertex"].size;
        if (undefined == result) {
            result = new Float32Array(data32PerVertex * numVertices);
        }
        var offset = 0;
        var offsetIndex = 0;
        var offsetData = 0;
        var key = "";
        var index = 0;
        for (var i = 0; i < numVertices; i++) {
            offset = data32PerVertex * i;
            for (key in data) {
                var variable = variables[key];
                if (undefined == variable) {
                    continue;
                }
                var array = data[key];
                offsetData = i * variable.size;
                offsetIndex = offset + variable.offset;
                for (index = 0; index < variable.size; index++) {
                    result[offsetIndex + index] = array[offsetData + index];
                }
            }
        }
        return result;
    }
    rf.createGeometry = createGeometry;
    var VertexInfo = /** @class */ (function () {
        function VertexInfo(value, data32PerVertex, variables) {
            this.numVertices = 0;
            this.data32PerVertex = 0;
            if (value instanceof Float32Array) {
                this.vertex = value;
            }
            else {
                this.vertex = new Float32Array(value);
            }
            this.data32PerVertex = data32PerVertex;
            this.numVertices = this.vertex.length / data32PerVertex;
            this.variables = variables;
        }
        VertexInfo.prototype.regVariable = function (variable, offset, size) {
            if (undefined == this.variables) {
                this.variables = {};
            }
            this.variables[variable] = { size: size, offset: offset };
        };
        return VertexInfo;
    }());
    rf.VertexInfo = VertexInfo;
    var Temp_Float32Byte = /** @class */ (function () {
        function Temp_Float32Byte() {
            this.data32PerVertex = 1;
            this.numVertices = 0;
            this.position = 0;
            this.data = new Float32Array(2048); //先无脑申请个8KB内存
        }
        Temp_Float32Byte.prototype.onSpawn = function () {
            this.data32PerVertex = 1;
            this.numVertices = 0;
            this.position = 0;
        };
        Temp_Float32Byte.prototype.set = function (array, offset) {
            if (undefined == offset) {
                offset = this.position;
            }
            this.data.set(array, offset);
            this.position = offset + array.length;
        };
        Temp_Float32Byte.prototype.toArray = function () {
            var len = this.data32PerVertex * this.numVertices;
            var arr = new Float32Array(len);
            arr.set(this.data.slice(0, len));
            return arr;
        };
        return Temp_Float32Byte;
    }());
    rf.Temp_Float32Byte = Temp_Float32Byte;
    function geometry_plane(width, height, position, variables, matrix3D) {
        var width_half = width * 0.5;
        var height_half = height * 0.5;
        var points = [
            width_half, height_half, 0, 0, 0,
            -width_half, height_half, 0, 1, 0,
            -width_half, -height_half, 0, 1, 1,
            width_half, -height_half, 0, 0, 1
        ];
        var v = rf.TEMP_VECTOR3D;
        var variable = variables["pos" /* pos */];
        var pos = variable ? variable.size * 4 : -1;
        variable = variables["normal" /* normal */];
        var normal = variable ? variable.size * 4 : -1;
        variable = variables["uv" /* uv */];
        var uv = variable ? variable.size * 4 : -1;
        for (var i = 0; i < 4; i++) {
            var p = i * 5;
            if (-1 != pos) {
                v.x = points[p];
                v.y = points[p + 1];
                v.z = points[p + 2];
                if (undefined != matrix3D) {
                    matrix3D.m3_transformVector(v, v);
                }
                rf.empty_float32_pos.wPoint3(position * pos + (i * 3), v.x, v.y, v.z);
            }
            if (-1 != normal) {
                v.x = 0;
                v.y = 0;
                v.z = 1;
                if (undefined != matrix3D) {
                    matrix3D.m3_transformRotation(v, v);
                }
                rf.empty_float32_normal.wPoint3(position * normal + (i * 3), v.x, v.y, v.z);
            }
            if (-1 != uv) {
                rf.empty_float32_uv.wPoint2(position * uv + (i * 2), points[p + 3], points[p + 4]);
            }
        }
    }
    rf.geometry_plane = geometry_plane;
    var GeometryBase = /** @class */ (function () {
        function GeometryBase(variables) {
            this.data32PerVertex = 0;
            this.numVertices = 0;
            this.numTriangles = 0;
            if (undefined == variables) {
                variables = rf.vertex_mesh_variable;
            }
            this.variables = variables;
            this.data32PerVertex = variables["data32PerVertex"].size;
        }
        GeometryBase.prototype.initData = function (data) {
            var c = rf.context3D;
            var variables = data.variables, data32PerVertex = data.data32PerVertex, vertex = data.vertex, index = data.index, vertexBuffer = data.vertexBuffer, indexBuffer = data.indexBuffer;
            if (!vertexBuffer) {
                var info = new VertexInfo(vertex, data32PerVertex, variables);
                data.vertexBuffer = vertexBuffer = c.createVertexBuffer(info);
            }
            if (!indexBuffer) {
                if (index) {
                    data.indexBuffer = indexBuffer = c.createIndexBuffer(index);
                }
            }
        };
        GeometryBase.prototype.setData = function (data) {
            this.data = data;
            var meshVar = data.variables, numVertices = data.numVertices, numTriangles = data.numTriangles, data32PerVertex = data.data32PerVertex;
            var variables = this.variables;
            var c = rf.context3D;
            if (!meshVar) {
                data.variables = variables;
                data.data32PerVertex = data32PerVertex;
            }
            else {
                variables = data.variables;
            }
            this.numVertices = numVertices;
            this.numTriangles = numTriangles;
            this.data32PerVertex = data32PerVertex;
            this.initData(data);
            var vertexBuffer = data.vertexBuffer, indexBuffer = data.indexBuffer;
            this.vertex = vertexBuffer;
            this.index = indexBuffer;
            // if (index) {
            //     geometry.index = c.createIndexBuffer(new Uint16Array(index));
            // }else{
            //     geometry.numTriangles *= 3;
            // }
        };
        Object.defineProperty(GeometryBase.prototype, "pos", {
            get: function () {
                var _a = this.vertex.data, numVertices = _a.numVertices, vertex = _a.vertex, data32PerVertex = _a.data32PerVertex;
                var pos = [];
                for (var i = 0; i < numVertices; i++) {
                    var p = i * data32PerVertex;
                    pos.push([vertex[p], vertex[p + 1], vertex[p + 2]]);
                }
                return pos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeometryBase.prototype, "uv", {
            get: function () {
                var _a = this.vertex.data, numVertices = _a.numVertices, vertex = _a.vertex, data32PerVertex = _a.data32PerVertex, variables = _a.variables;
                var uv = variables["uv"];
                var uvs = [];
                for (var i = 0; i < numVertices; i++) {
                    var p = i * data32PerVertex + uv.offset;
                    uvs.push([vertex[p], vertex[p + 1]]);
                }
                return uvs;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeometryBase.prototype, "triangles", {
            get: function () {
                var numTriangles = this.numTriangles;
                var data = this.index.data;
                var triangles = [];
                for (var i = 0; i < numTriangles; i++) {
                    var p = i * 3;
                    triangles.push([data[p], data[p + 1], data[p + 2]]);
                }
                return triangles;
            },
            enumerable: true,
            configurable: true
        });
        GeometryBase.prototype.uploadContext = function (camera, mesh, program, now, interval) {
            var c = rf.context3D;
            this.vertex.uploadContext(program);
            var sceneTransform = mesh.sceneTransform, invSceneTransform = mesh.invSceneTransform;
            var worldTranform = rf.TEMP_MATRIX;
            worldTranform.m3_append(camera.worldTranform, false, sceneTransform);
            c.setProgramConstantsFromMatrix("mvp" /* mvp */, worldTranform);
            c.setProgramConstantsFromMatrix("invm" /* invm */, invSceneTransform);
            return worldTranform;
        };
        return GeometryBase;
    }());
    rf.GeometryBase = GeometryBase;
    var SkeletonGeometry = /** @class */ (function (_super) {
        __extends(SkeletonGeometry, _super);
        function SkeletonGeometry() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SkeletonGeometry;
    }(GeometryBase));
    rf.SkeletonGeometry = SkeletonGeometry;
    var PlaneGeometry = /** @class */ (function (_super) {
        __extends(PlaneGeometry, _super);
        function PlaneGeometry() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PlaneGeometry.prototype.create = function (width, height) {
            if (width === void 0) { width = 1; }
            if (height === void 0) { height = 1; }
            var numVertices = 0;
            var quad = 0;
            var variables = this.variables;
            var matrix3D = rf.newMatrix3D();
            geometry_plane(width, height, 0, variables);
            numVertices += 4;
            quad++;
            matrix3D.m3_rotation(180 * rf.DEGREES_TO_RADIANS, rf.Y_AXIS);
            geometry_plane(width, height, 1, variables, matrix3D);
            numVertices += 4;
            quad++;
            var c = rf.context3D;
            var arr = createGeometry(rf.empty_float32_object, variables, numVertices);
            this.vertex = c.createVertexBuffer(new VertexInfo(arr, this.data32PerVertex, variables));
            this.index = c.getIndexByQuad(quad);
            this.numVertices = numVertices;
            this.numTriangles = quad * 2;
            return this;
        };
        return PlaneGeometry;
    }(GeometryBase));
    rf.PlaneGeometry = PlaneGeometry;
    var BoxGeometry = /** @class */ (function (_super) {
        __extends(BoxGeometry, _super);
        function BoxGeometry() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BoxGeometry.prototype.create = function (width, height, depth) {
            var matrix3D = rf.newMatrix3D();
            var numVertices = 0;
            var quad = 0;
            var variables = this.variables;
            matrix3D.m3_translation(0, 0, depth * 0.5);
            geometry_plane(width, height, quad, variables, matrix3D);
            numVertices += 4;
            quad++;
            matrix3D.m3_identity();
            matrix3D.m3_rotation(180 * rf.DEGREES_TO_RADIANS, rf.Y_AXIS);
            matrix3D.m3_translation(0, 0, -depth * 0.5);
            geometry_plane(width, height, quad, variables, matrix3D);
            numVertices += 4;
            quad++;
            matrix3D.m3_identity();
            matrix3D.m3_rotation(-90 * rf.DEGREES_TO_RADIANS, rf.Y_AXIS);
            matrix3D.m3_translation(width * 0.5, 0, 0);
            geometry_plane(depth, height, quad, variables, matrix3D);
            numVertices += 4;
            quad++;
            matrix3D.m3_identity();
            matrix3D.m3_rotation(90 * rf.DEGREES_TO_RADIANS, rf.Y_AXIS);
            matrix3D.m3_translation(-width * 0.5, 0, 0);
            geometry_plane(depth, height, quad, variables, matrix3D);
            numVertices += 4;
            quad++;
            matrix3D.m3_identity();
            matrix3D.m3_rotation(90 * rf.DEGREES_TO_RADIANS, rf.X_AXIS);
            matrix3D.m3_translation(0, height * 0.5, 0);
            geometry_plane(width, depth, quad, variables, matrix3D);
            numVertices += 4;
            quad++;
            matrix3D.m3_identity();
            matrix3D.m3_rotation(-90 * rf.DEGREES_TO_RADIANS, rf.X_AXIS);
            matrix3D.m3_translation(0, -height * 0.5, 0);
            geometry_plane(width, depth, quad, variables, matrix3D);
            numVertices += 4;
            quad++;
            var c = rf.context3D;
            var arr = createGeometry(rf.empty_float32_object, variables, numVertices);
            this.vertex = c.createVertexBuffer(new VertexInfo(arr, this.data32PerVertex, variables));
            this.index = c.getIndexByQuad(quad);
            this.numVertices = numVertices;
            this.numTriangles = quad * 2;
            return this;
        };
        return BoxGeometry;
    }(GeometryBase));
    rf.BoxGeometry = BoxGeometry;
    function hsva(h, s, v, a) {
        if (s > 1 || v > 1 || a > 1) {
            return;
        }
        var th = h % 360;
        var i = Math.floor(th / 60);
        var f = th / 60 - i;
        var m = v * (1 - s);
        var n = v * (1 - s * f);
        var k = v * (1 - s * (1 - f));
        var color = [];
        var r = [v, n, m, m, k, v];
        var g = [k, v, v, n, m, m];
        var b = [m, m, k, v, v, n];
        color.push(r[i], g[i], b[i], a);
        return color;
    }
    rf.hsva = hsva;
    var SphereGeometry = /** @class */ (function (_super) {
        __extends(SphereGeometry, _super);
        function SphereGeometry() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SphereGeometry.prototype.create = function (row, column, rad, color) {
            var numVertices = 0;
            for (var i = 0; i <= row; i++) {
                var r = Math.PI / row * i;
                var ry = Math.cos(r);
                var rr = Math.sin(r);
                for (var ii = 0; ii <= column; ii++) {
                    var tr = Math.PI * 2 / column * ii;
                    var tx = rr * rad * Math.cos(tr);
                    var ty = ry * rad;
                    var tz = rr * rad * Math.sin(tr);
                    var rx = rr * Math.cos(tr);
                    var rz = rr * Math.sin(tr);
                    var tc = color;
                    if (undefined == tc) {
                        tc = hsva(360 / row * i, 1, 1, 1);
                    }
                    rf.empty_float32_pos.wPoint3(numVertices * 3, tx, ty, tz);
                    rf.empty_float32_normal.wPoint3(numVertices * 3, rx, ry, rz);
                    rf.empty_float32_uv.wPoint2(numVertices * 2, 1 - 1 / column * ii, 1 / row * i);
                    rf.empty_float32_color.wPoint4(numVertices * 4, tc[0], tc[1], tc[2], tc[3]);
                    numVertices++;
                }
            }
            var position = 0;
            for (var i = 0; i < row; i++) {
                for (var ii = 0; ii < column; ii++) {
                    var r = (column + 1) * i + ii;
                    rf.empty_uint16_indexs.set([r, r + 1, r + column + 2, r, r + column + 2, r + column + 1], position);
                    position += 6;
                }
            }
            var variables = this.variables;
            var c = rf.context3D;
            var arr = createGeometry(rf.empty_float32_object, variables, numVertices);
            this.vertex = c.createVertexBuffer(new VertexInfo(arr, this.data32PerVertex, variables));
            this.index = c.createIndexBuffer(rf.empty_uint16_indexs.slice(0, position));
            this.numVertices = numVertices;
            this.numTriangles = position / 3;
            return this;
        };
        return SphereGeometry;
    }(GeometryBase));
    rf.SphereGeometry = SphereGeometry;
    var TorusGeomerty = /** @class */ (function (_super) {
        __extends(TorusGeomerty, _super);
        function TorusGeomerty() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TorusGeomerty.prototype.create = function (row, column, irad, orad) {
            var numVertices = 0;
            for (var i = 0; i <= row; i++) {
                var r = Math.PI * 2 / row * i;
                var rr = Math.cos(r);
                var ry = Math.sin(r);
                for (var ii = 0; ii <= column; ii++) {
                    var tr = Math.PI * 2 / column * ii;
                    var tx = (rr * irad + orad) * Math.cos(tr);
                    var ty = ry * irad;
                    var tz = (rr * irad + orad) * Math.sin(tr);
                    var rx = rr * Math.cos(tr);
                    var rz = rr * Math.sin(tr);
                    // if(color){
                    //     var tc = color;
                    // }else{
                    //     tc = hsva(360 / column * ii, 1, 1, 1);
                    // }
                    var rs = 1 / column * ii;
                    var rt = 1 / row * i + 0.5;
                    if (rt > 1.0) {
                        rt -= 1.0;
                    }
                    rt = 1.0 - rt;
                    rf.empty_float32_pos.wPoint3(numVertices * 3, tx, ty, tz);
                    rf.empty_float32_normal.wPoint3(numVertices * 3, rx, ry, rz);
                    rf.empty_float32_uv.wPoint2(numVertices * 2, rs, rt);
                    // empty_float32_color.wPoint4(numVertices * 4 , tc[0], tc[1], tc[2], tc[3]);
                    numVertices++;
                }
            }
            var position = 0;
            for (i = 0; i < row; i++) {
                for (ii = 0; ii < column; ii++) {
                    r = (column + 1) * i + ii;
                    rf.empty_uint16_indexs.set([r, r + column + 1, r + 1, r + column + 1, r + column + 2, r + 1], position);
                    position += 6;
                }
            }
            var variables = this.variables;
            var c = rf.context3D;
            var arr = createGeometry(rf.empty_float32_object, variables, numVertices);
            this.vertex = c.createVertexBuffer(new VertexInfo(arr, this.data32PerVertex, variables));
            this.index = c.createIndexBuffer(rf.empty_uint16_indexs.slice(0, position));
            this.numVertices = numVertices;
            this.numTriangles = position / 3;
            return this;
        };
        return TorusGeomerty;
    }(GeometryBase));
    rf.TorusGeomerty = TorusGeomerty;
})(rf || (rf = {}));
//# sourceMappingURL=Geometry.js.map