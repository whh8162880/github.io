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
///<reference path="../core/Config.ts"/>
///<reference path="three/Geometry.ts"/>
var rf;
(function (rf) {
    var Buffer3D = /** @class */ (function () {
        function Buffer3D() {
            this.preusetime = 0;
            this.readly = false;
        }
        Buffer3D.prototype.awaken = function () { };
        ;
        Buffer3D.prototype.sleep = function () { };
        ;
        Buffer3D.prototype.onRecycle = function () {
            this.readly = false;
            this.preusetime = 0;
        };
        return Buffer3D;
    }());
    rf.Buffer3D = Buffer3D;
    var Program3D = /** @class */ (function (_super) {
        __extends(Program3D, _super);
        function Program3D() {
            var _this = _super.call(this) || this;
            _this.uniforms = {};
            _this.attribs = {};
            return _this;
        }
        Program3D.prototype.awaken = function () {
            if (undefined != this.program) {
                return true;
            }
            if (!this.vertexCode || !this.fragmentCode) {
                rf.ThrowError("vertexCode or fragmentCode is empty");
                return false;
            }
            var g = rf.gl;
            //创建 vertexShader
            this.vShader = this.createShader(this.vertexCode, g.VERTEX_SHADER);
            this.fShader = this.createShader(this.fragmentCode, g.FRAGMENT_SHADER);
            this.program = g.createProgram();
            g.attachShader(this.program, this.vShader);
            g.attachShader(this.program, this.fShader);
            g.linkProgram(this.program);
            if (!g.getProgramParameter(this.program, rf.gl.LINK_STATUS)) {
                this.dispose();
                rf.ThrowError("create program error:" + g.getProgramInfoLog(this.program));
                return false;
            }
            //加入资源管理
            rf.context3D.bufferLink.add(this);
            return true;
        };
        Program3D.prototype.dispose = function () {
            var g = rf.gl;
            if (this.vShader) {
                g.detachShader(this.program, this.vShader);
                g.deleteShader(this.vShader);
                this.vShader = null;
            }
            if (this.fShader) {
                g.detachShader(this.program, this.fShader);
                g.deleteShader(this.fShader);
                this.fShader = null;
            }
            if (this.program) {
                g.deleteProgram(this.program);
                this.program = null;
            }
        };
        Program3D.prototype.recycle = function () {
            this.dispose();
            // this.vertexCode = undefined;
            // this.fragmentCode = undefined;
            this.preusetime = 0;
            this.readly = false;
            this.uniforms = {};
            this.attribs = {};
            // context3D.bufferLink.remove(this);
        };
        /*
         * load shader from html file by document.getElementById
         */
        Program3D.prototype.createShader = function (code, type) {
            var g = rf.gl;
            var shader = g.createShader(type);
            g.shaderSource(shader, code);
            g.compileShader(shader);
            // Check the result of compilation
            if (!g.getShaderParameter(shader, g.COMPILE_STATUS)) {
                var error = g.getShaderInfoLog(shader);
                g.deleteShader(shader);
                throw new Error(error);
            }
            return shader;
        };
        return Program3D;
    }(Buffer3D));
    rf.Program3D = Program3D;
    var VertexBuffer3D = /** @class */ (function (_super) {
        __extends(VertexBuffer3D, _super);
        function VertexBuffer3D() {
            var _this = _super.call(this) || this;
            // private varibles: { [key: string]: { size: number, offset: number } } = undefined;
            _this.numVertices = 0;
            _this.data32PerVertex = 0;
            _this.buffer = null;
            // regVariable(variable: string, offset: number, size: number): void {
            //     if (undefined == this.varibles) {
            //         this.varibles = {};
            //     }
            //     this.varibles[variable] = { size: size, offset: offset * 4 };
            // }
            _this.attribarray = {};
            return _this;
        }
        VertexBuffer3D.prototype.recycle = function () {
            if (this.buffer) {
                rf.gl.deleteBuffer(this.buffer);
                this.buffer = undefined;
            }
            this.readly = false;
            this.preusetime = 0;
            this.attribarray = {};
            // this.numVertices = 0;
            // this.data32PerVertex = 0;
            // this.data = null;
            // context3D.bufferLink.remove(this);
        };
        VertexBuffer3D.prototype.awaken = function () {
            if (!this.data || !this.data32PerVertex || !this.numVertices) {
                this.readly = false;
                rf.ThrowError("vertexBuffer3D unavailable");
                return false;
            }
            var g = rf.gl;
            if (undefined == this.buffer) {
                this.buffer = g.createBuffer();
            }
            g.bindBuffer(g.ARRAY_BUFFER, this.buffer);
            g.bufferData(g.ARRAY_BUFFER, this.data.vertex, g.STATIC_DRAW);
            g.bindBuffer(g.ARRAY_BUFFER, null);
            this.readly = true;
            //加入资源管理
            rf.context3D.bufferLink.add(this);
            return true;
        };
        VertexBuffer3D.prototype.uploadFromVector = function (data, startVertex, numVertices) {
            if (startVertex === void 0) { startVertex = 0; }
            if (numVertices === void 0) { numVertices = -1; }
            if (data instanceof rf.VertexInfo) {
                this.data = data;
                this.numVertices = data.numVertices;
                return;
            }
            if (0 > startVertex) {
                startVertex = 0;
            }
            var nd;
            var data32PerVertex = this.data32PerVertex;
            if (numVertices != -1) {
                this.numVertices = data.length / data32PerVertex;
                if (this.numVertices - startVertex < numVertices) {
                    rf.ThrowError("numVertices out of range");
                    return;
                }
                if (this.numVertices != numVertices && startVertex == 0) {
                    this.numVertices = numVertices;
                    nd = new Float32Array(data32PerVertex * numVertices);
                    nd.set(data.slice(startVertex * data32PerVertex, numVertices * data32PerVertex));
                    data = nd;
                }
            }
            if (0 < startVertex) {
                if (numVertices == -1) {
                    numVertices = data.length / data32PerVertex - startVertex;
                }
                nd = new Float32Array(data32PerVertex * numVertices);
                nd.set(data.slice(startVertex * data32PerVertex, numVertices * data32PerVertex));
                data = nd;
                this.numVertices = numVertices;
            }
            else {
                if (false == (data instanceof Float32Array)) {
                    data = new Float32Array(data);
                }
                this.numVertices = data.length / data32PerVertex;
            }
            this.data = new rf.VertexInfo(data, data32PerVertex);
        };
        VertexBuffer3D.prototype.uploadContext = function (program) {
            if (false == this.readly) {
                if (false == this.awaken()) {
                    throw new Error("create VertexBuffer error!");
                }
            }
            var loc = -1;
            var g = rf.gl;
            var attribs = program.attribs;
            var p = program.program;
            var attribarray = this.attribarray;
            g.bindBuffer(g.ARRAY_BUFFER, this.buffer);
            var variables = this.data.variables;
            for (var variable in variables) {
                if (true == (variable in attribs)) {
                    loc = attribs[variable];
                }
                else {
                    loc = g.getAttribLocation(p, variable);
                    attribs[variable] = loc;
                }
                if (loc < 0) {
                    continue;
                }
                var o = variables[variable];
                g.vertexAttribPointer(loc, o.size, g.FLOAT, false, this.data32PerVertex * 4, o.offset * 4);
                if (true != attribarray[loc]) {
                    g.enableVertexAttribArray(loc);
                    attribarray[loc] = true;
                }
            }
            this.preusetime = rf.engineNow;
        };
        return VertexBuffer3D;
    }(Buffer3D));
    rf.VertexBuffer3D = VertexBuffer3D;
    var IndexBuffer3D = /** @class */ (function (_super) {
        __extends(IndexBuffer3D, _super);
        function IndexBuffer3D() {
            var _this = _super.call(this) || this;
            _this.quadid = -1;
            return _this;
        }
        IndexBuffer3D.prototype.recycle = function () {
            if (this.buffer) {
                rf.gl.deleteBuffer(this.buffer);
                this.buffer = undefined;
            }
            this.readly = false;
            this.preusetime = 0;
            // this.numIndices = 0;
            // this.data = null;
            // context3D.bufferLink.remove(this);
        };
        IndexBuffer3D.prototype.awaken = function () {
            if (true == this.readly) {
                if (DEBUG) {
                    if (undefined == this.buffer) {
                        rf.ThrowError("indexBuffer readly is true but buffer is null");
                        return false;
                    }
                }
                return true;
            }
            if (!this.data) {
                this.readly = false;
                rf.ThrowError("indexData unavailable");
                return false;
            }
            var g = rf.gl;
            if (undefined == this.buffer) {
                this.buffer = g.createBuffer();
            }
            g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, this.buffer);
            g.bufferData(g.ELEMENT_ARRAY_BUFFER, this.data, g.STATIC_DRAW);
            g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, null);
            //加入资源管理
            this.readly = true;
            rf.context3D.bufferLink.add(this);
        };
        IndexBuffer3D.prototype.uploadFromVector = function (data, startOffset, count) {
            if (startOffset === void 0) { startOffset = 0; }
            if (count === void 0) { count = -1; }
            if (0 > startOffset) {
                startOffset = 0;
            }
            if (count != -1) {
                if (this.numIndices - startOffset < count) {
                    rf.ThrowError("VectorData out of range");
                    return;
                }
            }
            if (0 < startOffset) {
                if (-1 == count) {
                    count = data.length - startOffset;
                }
                var nd = new Uint16Array(count);
                nd.set(data.slice(startOffset, startOffset + count));
                data = nd;
            }
            else {
                if (false == (data instanceof Uint16Array)) {
                    data = new Uint16Array(data);
                }
            }
            this.numIndices = data.length;
            this.data = data;
        };
        return IndexBuffer3D;
    }(Buffer3D));
    rf.IndexBuffer3D = IndexBuffer3D;
    //TODO:cube texture
    var Texture = /** @class */ (function (_super) {
        __extends(Texture, _super);
        function Texture() {
            var _this = _super.call(this) || this;
            _this.width = 0;
            _this.height = 0;
            _this.status = 0 /* WAIT */;
            return _this;
        }
        Texture.prototype.awaken = function () {
            var tex = this.texture;
            var g = rf.gl;
            var data = this.pixels;
            if (data instanceof rf.BitmapData) {
                data = data.canvas;
            }
            if (undefined == tex) {
                this.texture = tex = g.createTexture();
            }
            g.bindTexture(g.TEXTURE_2D, tex);
            var textureData = this.data;
            // g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL,true);
            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, textureData.mag);
            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, textureData.mix);
            var pepeat = textureData.repeat;
            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, pepeat); //U方向上设置
            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, pepeat);
            // if(textureData.mipmap){
            //     g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
            //     g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR_MIPMAP_LINEAR);
            //     g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.REPEAT);   //U方向上设置
            //     g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.REPEAT);   //v方向上设置
            // }else{
            //     //设置纹理参数 https://blog.csdn.net/a23366192007/article/details/51264454
            // /**
            //  * void texParameteri(GLenum target, GLenum pname, GLint param) ;
            //     @pname:是纹理的参数：只能是下列四个
            //         GL_TEXTURE_MIN_FILTER：指定纹理图片缩小时用到的算法
            //         GL_TEXTURE_MAG_FILTER：指定纹理图片放大时用到的算法 
            //         GL_TEXTURE_WRAP_S ：纹理包装算法，在s(u)方向 
            //         GL_TEXTURE_WRAP_T ：纹理包装算法，在t(v)方向
            //     @param:是第二个参数的值（value）
            //         放大和缩小所用的算法只有两个 NEAREST和LINEAR,
            //         （即第三个参数param的值是webgl.NEAREST或webgl.LINEAR）分别是最近点采样和线性采样，
            //         前者效率高单效果不好，后者效率不高单效果比较好。
            //  */
            // /**
            //  *  Mag Modes
            //  *      gl.NEAREST
            //  *      gl.LINEAR
            //  */
            // g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.NEAREST);
            // /**  Min Modes
            // *      gl.NEAREST
            // *      gl.LINEAR
            //        gl.NEAREST_MIPMAP_NEAREST;      limit:power of two   
            //        gl.NEAREST_MIPMAP_LINEAR;       limit:power of two
            //        gl.LINEAR_MIPMAP_LINEAR         limit:power of two
            //        gl.LINEAR_MIPMAP_NEAREST        limit:power of two
            // * */
            // //如果我们的贴图长宽不满足2的幂条件。那么MIN_FILTER 和 MAG_FILTER, 只能是 NEAREST或者LINEAR
            // g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.NEAREST);
            // g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);   //U方向上设置
            // g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);   //v方向上设置
            // }
            //如果我们的贴图长宽不满足2的幂条件。那么wrap_s 和 wrap_t 必须是 clap_to_edge
            //Wrapping Modes 
            //g.REPEAT                  limit:power of two   
            //g.MIRRORED_REPEAT         limit:power of two   
            //g.CLAMP_TO_EDGE
            /**
                ====format=====
                g.ALPHA
                g.RGB
                g.RGBA
                g.LUMINANCE
                g.LUMINANCE_ALPHA
                g.DEPTH_COMPONENT
                g.DEPTH_STENCIL
             */
            /**
                ===type====
                g.UNSIGNED_BYTE
                g.BYTE
                g.SHORT
                g.INT
                g.FLOAT
                g.UNSIGNED_BYTE;
                g.UNSIGNED_INT
                g.UNSIGNED_SHORT
                g.UNSIGNED_SHORT_4_4_4_4;
                g.UNSIGNED_SHORT_5_5_5_1;
                g.UNSIGNED_SHORT_5_6_5;
                //halfFloat
                g.getExtension('OES_texture_half_float').HALF_FLOAT_OES
                g.getExtension('WEBGL_depth_texture').UNSIGNED_INT_24_8_WEBGL
             */
            if (data) {
                g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, data);
            }
            else {
                g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, this.width, this.height, 0, rf.gl.RGBA, rf.gl.UNSIGNED_BYTE, undefined);
            }
            //  createmipmap  limit:power of two
            if (textureData.mipmap) {
                g.generateMipmap(g.TEXTURE_2D);
            }
            g.bindTexture(g.TEXTURE_2D, null);
            this.readly = true;
            //加入资源管理
            rf.context3D.bufferLink.add(this);
            return true;
        };
        Texture.prototype.uploadContext = function (program, index, variable) {
            if (false == this.readly) {
                this.awaken();
            }
            var uniforms = program.uniforms;
            var g = rf.gl;
            var index_tex;
            g.activeTexture(rf.gl["TEXTURE" + index]);
            g.bindTexture(g.TEXTURE_2D, this.texture);
            if (true == uniforms.hasOwnProperty(variable)) {
                index_tex = uniforms[variable];
            }
            else {
                index_tex = g.getUniformLocation(program.program, variable);
                uniforms[variable] = index_tex;
            }
            // var index_tex = gl.getUniformLocation(program.program, variable);
            if (undefined != index_tex) {
                g.uniform1i(index_tex, index);
            }
            this.preusetime = rf.engineNow;
        };
        Texture.prototype.load = function (url) {
            if (undefined == url) {
                url = this.data.url;
            }
            if (0 /* WAIT */ == this.status) {
                this.status = 1 /* LOADING */;
                rf.loadRes(url, this.loadComplete, this, 3 /* image */);
            }
        };
        Texture.prototype.loadComplete = function (e) {
            if (e.type == 4 /* COMPLETE */) {
                this.status = 2 /* COMPLETE */;
                var res = e.data;
                var image = res.data;
                this.width = image.width;
                this.height = image.height;
                this.pixels = image;
            }
            else {
                this.status = 3 /* FAILED */;
            }
        };
        Texture.prototype.recycle = function () {
            if (this.texture) {
                rf.gl.deleteTexture(this.texture);
                this.texture = undefined;
            }
            this.readly = false;
            // if (this.pixels) {
            //     this.pixels = undefined;
            // }
            // this.width = 0;
            // this.height = 0;
        };
        return Texture;
    }(Buffer3D));
    rf.Texture = Texture;
    var RTTexture = /** @class */ (function (_super) {
        __extends(RTTexture, _super);
        function RTTexture() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.setting = {};
            return _this;
        }
        RTTexture.prototype.awaken = function () {
            var b = _super.prototype.awaken.call(this);
            var g = rf.gl;
            if (b) {
                var _a = this, frameBuffer = _a.frameBuffer, renderBuffer = _a.renderBuffer, texture = _a.texture, width = _a.width, height = _a.height;
                if (!frameBuffer) {
                    this.frameBuffer = frameBuffer = g.createFramebuffer();
                }
                g.bindFramebuffer(g.FRAMEBUFFER, frameBuffer);
                if (!renderBuffer) {
                    this.renderBuffer = renderBuffer = g.createRenderbuffer();
                }
                g.bindRenderbuffer(g.RENDERBUFFER, renderBuffer);
                g.renderbufferStorage(g.RENDERBUFFER, g.DEPTH_COMPONENT16, width, height);
                g.framebufferRenderbuffer(g.FRAMEBUFFER, g.DEPTH_ATTACHMENT, g.RENDERBUFFER, renderBuffer);
                g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, texture, 0);
                g.bindRenderbuffer(g.RENDERBUFFER, undefined);
                g.bindFramebuffer(g.FRAMEBUFFER, undefined);
            }
            return b;
        };
        RTTexture.prototype.recycle = function () {
            var g = rf.gl;
            var _a = this, frameBuffer = _a.frameBuffer, renderBuffer = _a.renderBuffer, texture = _a.texture;
            if (frameBuffer) {
                g.deleteFramebuffer(frameBuffer);
                this.frameBuffer = undefined;
            }
            if (renderBuffer) {
                g.deleteRenderbuffer(renderBuffer);
                this.renderBuffer = undefined;
            }
            if (texture) {
                g.deleteTexture(texture);
                this.texture = undefined;
            }
            this.readly = false;
        };
        return RTTexture;
    }(Texture));
    rf.RTTexture = RTTexture;
})(rf || (rf = {}));
//# sourceMappingURL=Buffer3D.js.map