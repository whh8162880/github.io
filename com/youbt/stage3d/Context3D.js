///<reference path="./Buffer3D.ts"/>
var rf;
(function (rf) {
    var Context3D = /** @class */ (function () {
        function Context3D() {
            this.textureObj = {};
            this.programs = {};
            this.cProgram = undefined;
            this.bufferLink = new rf.Link();
            this.setting = this.createEmptyContext3DSetting();
            this.render_setting = {};
            // this.change = 0;
            // ROOT.on(EngineEvent.FPS_CHANGE,this.gc,this)
        }
        Context3D.prototype.createEmptyContext3DSetting = function () {
            var setting = {};
            setting.cull = 0 /* NONE */;
            setting.depth = true;
            setting.depthMode = 515 /* LEQUAL */;
            setting.src = 770 /* SRC_ALPHA */;
            setting.dst = 771 /* ONE_MINUS_SRC_ALPHA */;
            return setting;
        };
        Context3D.prototype.configureBackBuffer = function (width, height, antiAlias, enableDepthAndStencil) {
            if (antiAlias === void 0) { antiAlias = 0; }
            if (enableDepthAndStencil === void 0) { enableDepthAndStencil = true; }
            var g = rf.gl;
            this.backBufferWidth = width;
            this.backBufferHeight = height;
            g.viewport(0, 0, width, height);
            g.canvas.width = width;
            g.canvas.height = height;
            //TODO: antiAlias , Stencil
            if (enableDepthAndStencil) {
                this._clearBit = g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT | g.STENCIL_BUFFER_BIT;
                g.enable(g.DEPTH_TEST);
                g.enable(g.STENCIL_TEST);
            }
            else {
                this._clearBit = g.COLOR_BUFFER_BIT;
                g.disable(g.DEPTH_TEST);
                g.disable(g.STENCIL_TEST);
            }
            g.frontFace(g.CW);
            g.enable(g.BLEND);
        };
        Context3D.prototype.setScissor = function (x, y, w, h) {
            var g = rf.gl;
            g.enable(g.SCISSOR_TEST);
            y = this.backBufferHeight - y - h;
            g.scissor(x, y, w, h);
            this.scissoring = true;
        };
        Context3D.prototype.clear = function (red, green, blue, alpha, depth, stencil, mask) {
            if (red === void 0) { red = 0.0; }
            if (green === void 0) { green = 0.0; }
            if (blue === void 0) { blue = 0.0; }
            if (alpha === void 0) { alpha = 1.0; }
            if (depth === void 0) { depth = 1.0; }
            if (stencil === void 0) { stencil = 0; }
            if (mask === void 0) { mask = 0xffffffff; }
            var g = rf.gl;
            g.clearColor(red, green, blue, alpha);
            g.clearDepth(depth); // TODO:dont need to call this every time
            g.clearStencil(stencil); //stencil buffer
            g.clear(this._clearBit);
        };
        Context3D.prototype.updateSetting = function (render_setting) {
            var g = rf.gl;
            var _a = this.setting, cull = _a.cull, depth = _a.depth, depthMode = _a.depthMode, src = _a.src, dst = _a.dst;
            if (cull != render_setting.cull) {
                if (cull == 0) {
                    g.disable(g.CULL_FACE);
                }
                else {
                    g.enable(g.CULL_FACE);
                    g.cullFace(cull);
                }
                render_setting.cull = cull;
            }
            if (depth != render_setting.depth || depthMode != render_setting.depthMode) {
                render_setting.depth = depth;
                render_setting.depthMode = depthMode;
                if (depth == false) {
                    g.disable(g.DEPTH_TEST);
                }
                else {
                    g.enable(g.DEPTH_TEST);
                    g.depthMask(depth);
                    g.depthFunc(depthMode);
                }
            }
            if (src != render_setting.src && dst != render_setting.dst) {
                render_setting.src = src;
                render_setting.dst = dst;
                g.blendFunc(src, dst);
            }
            // let{change}=this;
            // if(change & Context3DConst.CULL){
            // 	let{cull}=this;
            // 	if(cull == 0){
            // 		g.disable(g.CULL_FACE);
            // 	}else{
            // 		g.enable(g.CULL_FACE);
            // 		g.cullFace(cull);
            // 	}
            // 	change &= ~Context3DConst.CULL;
            // }
            // if(change & Context3DConst.DEEP){
            // 	let{depthMask,passCompareMode}=this;
            // 	if(depthMask == false){
            // 		g.disable(g.DEPTH_TEST);
            // 	}else{
            // 		g.enable(g.DEPTH_TEST);
            // 		g.depthMask(depthMask);
            // 		g.depthFunc(passCompareMode);
            // 	}
            // 	change &= ~Context3DConst.DEEP;
            // }
            // if(change & Context3DConst.FACTOR){
            // 	let{sourceFactor,destinationFactor} = this;
            // 	g.blendFunc(sourceFactor, destinationFactor);
            // 	change &= ~Context3DConst.FACTOR;
            // }
        };
        // cull:number;
        // public setCulling(cull: number): void {
        // 	if(this.cull == cull){
        // 		return;
        // 	}
        // 	this.cull = cull;
        // 	this.change |= Context3DConst.CULL;
        // }
        /**
         *
         * @param depthMask
         * @param passCompareMode
         *
         *
         * @constant Context3DCompareMode.LESS=GL.LESS
         * @constant Context3DCompareMode.NEVER=GL.NEVER
         * @constant Context3DCompareMode.EQUAL=GL.EQUAL
         * @constant Context3DCompareMode.GREATER=GL.GREATER
         * @constant Context3DCompareMode.NOT_EQUAL=GL.NOTEQUAL
         * @constant Context3DCompareMode.ALWAYS=GL.ALWAYS
         * @constant Context3DCompareMode.LESS_EQUAL=GL.LEQUAL
         * @constant Context3DCompareMode.GREATER_EQUAL=L.GEQUAL
         */
        // depthMask:boolean;
        // passCompareMode:number;
        // public setDepthTest(depthMask: boolean, passCompareMode: number): void {
        // 	if(this.depthMask == depthMask && this.passCompareMode == passCompareMode){
        // 		return;
        // 	}
        // 	this.depthMask = depthMask;
        // 	this.passCompareMode = passCompareMode;
        // 	this.change |= Context3DConst.DEEP;
        // }
        /**
            Context3DBlendFactor.ONE = GL.ONE;
            Context3DBlendFactor.ZERO = GL.ZERO;
            Context3DBlendFactor.SOURCE_COLOR = GL.SRC_COLOR;
            Context3DBlendFactor.DESTINATION_COLOR = GL.DST_COLOR;
            Context3DBlendFactor.SOURCE_ALPHA = GL.SRC_ALPHA;
            Context3DBlendFactor.DESTINATION_ALPHA = GL.DST_ALPHA;
            Context3DBlendFactor.ONE_MINUS_SOURCE_COLOR = GL.ONE_MINUS_SRC_COLOR;
            Context3DBlendFactor.ONE_MINUS_DESTINATION_COLOR = GL.ONE_MINUS_DST_COLOR;
            Context3DBlendFactor.ONE_MINUS_SOURCE_ALPHA = GL.ONE_MINUS_SRC_ALPHA;
            Context3DBlendFactor.ONE_MINUS_DESTINATION_ALPHA = GL.ONE_MINUS_DST_ALPHA;
         */
        // sourceFactor:number;
        // destinationFactor:number;
        // public setBlendFactors(sourceFactor: number, destinationFactor: number): void {
        // 	if(this.sourceFactor == sourceFactor && this.destinationFactor == destinationFactor){
        // 		return;
        // 	}
        // 	this.sourceFactor = sourceFactor;
        // 	this.destinationFactor = destinationFactor;
        // 	this.change |= Context3DConst.FACTOR;
        // }
        Context3D.prototype.createVertexBuffer = function (data, data32PerVertex, startVertex, numVertices) {
            if (data32PerVertex === void 0) { data32PerVertex = -1; }
            if (startVertex === void 0) { startVertex = 0; }
            if (numVertices === void 0) { numVertices = -1; }
            var buffer = rf.recyclable(rf.VertexBuffer3D);
            if (data instanceof rf.VertexInfo) {
                buffer.data32PerVertex = data.data32PerVertex;
            }
            else {
                if (data32PerVertex == -1) {
                    rf.ThrowError("mast set data32PerVertex");
                    return null;
                }
                buffer.data32PerVertex = data32PerVertex;
            }
            buffer.uploadFromVector(data, startVertex, numVertices);
            return buffer;
        };
        Context3D.prototype.getIndexByQuad = function (quadCount) {
            var count = 1000;
            if (quadCount > count) {
                rf.ThrowError("你要这么多四边形干嘛？");
                return null;
            }
            // if (undefined == this.indexs) {
            // 	this.indexs = {};
            // }
            // let buffer = this.indexs[quadCount];
            // let length = quadCount * 6;
            // if (undefined == buffer) {
            // let array = new Uint16Array(length)
            if (undefined == this.indexByte) {
                var byte = new Uint16Array(count * 6);
                count *= 4;
                var j = 0;
                for (var i = 0; i < count; i += 4) {
                    byte[j++] = i;
                    byte[j++] = i + 1;
                    byte[j++] = i + 3;
                    byte[j++] = i + 1;
                    byte[j++] = i + 2;
                    byte[j++] = i + 3;
                }
                this.indexByte = this.createIndexBuffer(byte);
            }
            return this.indexByte;
            // array.set(this.indexByte.slice(0, length));
            // this.indexs[quadCount] = buffer = this.createIndexBuffer(array);
            // }
            // return buffer;
        };
        Context3D.prototype.createIndexBuffer = function (data) {
            var buffer = rf.recyclable(rf.IndexBuffer3D);
            if (data instanceof ArrayBuffer) {
                buffer.uploadFromVector(new Uint16Array(data));
            }
            else {
                buffer.uploadFromVector(data);
            }
            return buffer;
        };
        Context3D.prototype.getTextureData = function (url, mipmap, mag, mix, repeat, y) {
            var data = {};
            data.url = url;
            data.mipmap = undefined != mipmap ? mipmap : false;
            data.mag = undefined != mag ? mag : 9728 /* NEAREST */;
            data.mix = undefined != mix ? mix : 9728 /* NEAREST */;
            data.repeat = undefined != repeat ? repeat : 33071 /* CLAMP_TO_EDGE */;
            return data;
        };
        Context3D.prototype.createTexture = function (key, pixels) {
            var texture = rf.recyclable(rf.Texture);
            texture.key = key.key ? key.key : (key.key = key.url + "_" + key.mipmap + "_" + key.mag + "_" + key.mix + "_" + key.repeat);
            texture.data = key;
            texture.pixels = pixels;
            if (pixels) {
                texture.width = pixels.width;
                texture.height = pixels.height;
            }
            this.textureObj[key.key] = texture;
            return texture;
        };
        Context3D.prototype.createEmptyTexture = function (key, width, height) {
            var texture = rf.recyclable(rf.Texture);
            texture.key = key.key ? key.key : (key.key = key.url + "_" + key.mipmap + "_" + key.mag + "_" + key.mix + "_" + key.repeat);
            texture.data = key;
            texture.width = width;
            texture.height = height;
            this.textureObj[key.key] = texture;
            return texture;
        };
        Context3D.prototype.createRttTexture = function (key, width, height) {
            var texture = new rf.RTTexture();
            texture.key = key.key ? key.key : (key.key = key.url + "_" + key.mipmap + "_" + key.mag + "_" + key.mix + "_" + key.repeat);
            texture.data = key;
            texture.width = width;
            texture.height = height;
            this.textureObj[key.key] = texture;
            return texture;
        };
        Context3D.prototype.setRenderToTexture = function (texture, enableDepthAndStencil, antiAlias, surfaceSelector, colorOutputIndex) {
            if (enableDepthAndStencil === void 0) { enableDepthAndStencil = true; }
            if (antiAlias === void 0) { antiAlias = 0; }
            if (surfaceSelector === void 0) { surfaceSelector = 0; }
            if (colorOutputIndex === void 0) { colorOutputIndex = 0; }
            var g = rf.gl;
            if (!texture.readly) {
                if (false == texture.awaken()) {
                    return;
                }
            }
            var frameBuffer = texture.frameBuffer, renderBuffer = texture.renderBuffer, textureObj = texture.texture, width = texture.width, height = texture.height, cleanColor = texture.cleanColor;
            g.viewport(0, 0, width, height);
            g.bindFramebuffer(g.FRAMEBUFFER, frameBuffer);
            if (enableDepthAndStencil) {
                texture.cleanBit = g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT | g.STENCIL_BUFFER_BIT;
            }
            else {
                texture.cleanBit = g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT | g.STENCIL_BUFFER_BIT;
            }
            if (cleanColor) {
                g.clearColor(cleanColor.r, cleanColor.g, cleanColor.b, cleanColor.a);
            }
            else {
                g.clearColor(0, 0, 0, 1);
            }
            g.clear(texture.cleanBit);
        };
        Context3D.prototype.setRenderToBackBuffer = function () {
            var g = rf.gl;
            var _a = this, backBufferWidth = _a.backBufferWidth, backBufferHeight = _a.backBufferHeight, render_setting = _a.render_setting;
            g.bindFramebuffer(g.FRAMEBUFFER, null);
            g.viewport(0, 0, backBufferWidth, backBufferHeight);
            render_setting.cull = 0;
            render_setting.depth = false;
            render_setting.depthMode = 0;
            render_setting.src = 0;
            render_setting.dst = 0;
        };
        Context3D.prototype.createProgram = function (vertexCode, fragmentCode, key) {
            var program;
            if (undefined != key) {
                program = this.programs[key];
                if (undefined == program) {
                    this.programs[key] = program = rf.recyclable(rf.Program3D);
                }
            }
            else {
                program = rf.recyclable(rf.Program3D);
            }
            program.vertexCode = vertexCode;
            program.fragmentCode = fragmentCode;
            return program;
        };
        /**
         *
         * @param variable
         * @param data
         * @param format FLOAT_1 2 3 4
         */
        Context3D.prototype.setProgramConstantsFromVector = function (variable, data, format, array) {
            if (array === void 0) { array = true; }
            var p = this.cProgram;
            var uniforms = p.uniforms;
            var g = rf.gl;
            var index;
            if (true == (variable in uniforms)) {
                index = uniforms[variable];
            }
            else {
                index = g.getUniformLocation(p.program, variable);
                uniforms[variable] = index;
            }
            if (undefined != index) {
                if (array) {
                    rf.gl['uniform' + format + 'fv'](index, data);
                }
                else {
                    rf.gl['uniform' + format + 'f'](index, data);
                }
            }
        };
        /**
        *  @variable must predefined in glsl
        */
        Context3D.prototype.setProgramConstantsFromMatrix = function (variable, rawData) {
            var p = this.cProgram;
            var uniforms = p.uniforms;
            var g = rf.gl;
            var index;
            if (true == (variable in uniforms)) {
                index = uniforms[variable];
            }
            else {
                index = g.getUniformLocation(p.program, variable);
                uniforms[variable] = index;
            }
            if (undefined != index) {
                g.uniformMatrix4fv(index, false, rawData);
            }
        };
        Context3D.prototype.setProgram = function (program) {
            if (program == undefined)
                return;
            program.preusetime = rf.engineNow;
            if (false == program.readly) {
                if (false == program.awaken()) {
                    rf.ThrowError("program create error!");
                    return;
                }
            }
            else {
                if (program == this.cProgram)
                    return;
            }
            this.cProgram = program;
            rf.gl.useProgram(program.program);
        };
        Context3D.prototype.drawTriangles = function (indexBuffer, numTriangles, setting) {
            var g = rf.gl;
            this.updateSetting(setting || this.render_setting);
            if (undefined != indexBuffer) {
                if (false == indexBuffer.readly) {
                    if (false == indexBuffer.awaken()) {
                        throw new Error("create indexBuffer error!");
                    }
                }
                indexBuffer.preusetime = rf.engineNow;
                // g.drawArrays(g.TRIANGLES,0,numTriangles)
                g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
                g.drawElements(g.TRIANGLES, numTriangles * 3, g.UNSIGNED_SHORT, 0);
            }
            else {
                g.drawArrays(g.TRIANGLES, 0, numTriangles * 3);
            }
            this.triangles += numTriangles;
            this.dc++;
            if (this.scissoring) {
                g.disable(g.SCISSOR_TEST);
                this.scissoring = false;
            }
        };
        /*
         *  [Webgl only]
         *   For instance indices = [1,3,0,4,1,2]; will draw 3 lines :
         *   from vertex number 1 to vertex number 3, from vertex number 0 to vertex number 4, from vertex number 1 to vertex number 2
         */
        // public drawLines(indexBuffer: IndexBuffer3D, numTriangles:number, firstIndex: number = 0, numLines: number = -1): void {
        // 	if(this.change){
        // 		this.updateSetting();
        // 	}
        // 	if(undefined != indexBuffer){
        // 		if (false == indexBuffer.readly) {
        // 			if (false == indexBuffer.awaken()) {
        // 				throw new Error("create indexBuffer error!");
        // 			}
        // 		}
        // 		indexBuffer.preusetime = engineNow;
        // 		let g = gl;
        // 		g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
        // 		g.drawElements(g.LINES, numTriangles < 0 ? indexBuffer.numIndices : numTriangles * 3, g.UNSIGNED_SHORT, firstIndex * 2);
        // 	}
        // 	this.triangles += numTriangles;
        // 	this.dc ++;
        // }
        // /*
        //  * [Webgl only]
        //  *  For instance indices = [1,2,3] ; will only render vertices number 1, number 2, and number 3 
        //  */
        // public drawPoints(indexBuffer: IndexBuffer3D, firstIndex: number = 0, numPoints: number = -1): void {
        // 	if (false == indexBuffer.readly) {
        // 		if (false == indexBuffer.awaken()) {
        // 			throw new Error("create indexBuffer error!");
        // 		}
        // 	}
        // 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
        // 	gl.drawElements(gl.POINTS, numPoints < 0 ? indexBuffer.numIndices : numPoints, gl.UNSIGNED_SHORT, firstIndex * 2);
        // }
        // /**
        //  * [Webgl only]
        //  * draws a closed loop connecting the vertices defined in the indexBuffer to the next one
        //  */
        // public drawLineLoop(indexBuffer: IndexBuffer3D, firstIndex: number = 0, numPoints: number = -1): void {
        // 	if (false == indexBuffer.readly) {
        // 		if (false == indexBuffer.awaken()) {
        // 			throw new Error("create indexBuffer error!");
        // 		}
        // 	}
        // 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
        // 	gl.drawElements(gl.LINE_LOOP, numPoints < 0 ? indexBuffer.numIndices : numPoints, gl.UNSIGNED_SHORT, firstIndex * 2);
        // }
        // /**
        //  * [Webgl only]
        //  * It is similar to drawLineLoop(). The difference here is that WebGL does not connect the last vertex to the first one (not a closed loop).
        //  */
        // public drawLineStrip(indexBuffer: IndexBuffer3D, firstIndex: number = 0, numPoints: number = -1): void {
        // 	if (false == indexBuffer.readly) {
        // 		if (false == indexBuffer.awaken()) {
        // 			throw new Error("create indexBuffer error!");
        // 		}
        // 	}
        // 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
        // 	gl.drawElements(
        // 		gl.LINE_STRIP,
        // 		numPoints < 0 ? indexBuffer.numIndices : numPoints,
        // 		gl.UNSIGNED_SHORT,
        // 		firstIndex * 2
        // 	);
        // }
        // /**
        // * [Webgl only]
        // *  indices = [0, 1, 2, 3, 4];, then we will generate the triangles:(0, 1, 2), (1, 2, 3), and(2, 3, 4).
        // */
        // public drawTriangleStrip(indexBuffer: IndexBuffer3D): void {
        // 	if (false == indexBuffer.readly) {
        // 		if (false == indexBuffer.awaken()) {
        // 			throw new Error("create indexBuffer error!");
        // 		}
        // 	}
        // 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
        // 	gl.drawElements(gl.TRIANGLE_STRIP, indexBuffer.numIndices, gl.UNSIGNED_SHORT, 0);
        // }
        // /**
        //  * [Webgl only]
        //  * creates triangles in a similar way to drawTriangleStrip(). 
        //  * However, the first vertex defined in the indexBuffer is taken as the origin of the fan(the only shared vertex among consecutive triangles).
        //  * In our example, indices = [0, 1, 2, 3, 4]; will create the triangles: (0, 1, 2) and(0, 3, 4).
        //  */
        // public drawTriangleFan(indexBuffer: IndexBuffer3D): void {
        // 	if (false == indexBuffer.readly) {
        // 		if (false == indexBuffer.awaken()) {
        // 			throw new Error("create indexBuffer error!");
        // 		}
        // 	}
        // 	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.buffer);
        // 	gl.drawElements(gl.TRIANGLE_FAN, indexBuffer.numIndices, gl.UNSIGNED_SHORT, 0);
        // }
        /**
        *   In webgl we dont need to call present , browser will do this for us.
        */
        // public present(): void { }
        // private enableTex(keyInCache): void {
        // 	var tex: Texture = this._texCache[keyInCache];
        // 	gl.activeTexture(gl['TEXTURE' + tex.textureUnit]);
        // 	gl.TEXTURE31\
        // 	var l: WebGLUniformLocation = gl.getUniformLocation(this._linkedProgram.program, keyInCache);
        // 	gl.uniform1i(l, tex.textureUnit); // TODO:multiple textures
        // }
        Context3D.prototype.gc = function (now) {
            var link = this.bufferLink;
            var vo = link.getFrist();
            var hasChange = false;
            while (vo) {
                if (false == vo.close) {
                    var buffer = vo.data;
                    if (now - buffer.preusetime > 3000) {
                        buffer.recycle();
                        vo.close = true;
                        hasChange = true;
                    }
                }
                vo = vo.next;
            }
            if (hasChange)
                link.clean();
        };
        Context3D.prototype.toString = function () {
            var link = this.bufferLink;
            var vo = link.getFrist();
            var v = 0, t = 0, p = 0, i = 0;
            while (vo) {
                if (false == vo.close) {
                    var buffer = vo.data;
                    if (buffer instanceof rf.VertexBuffer3D) {
                        v++;
                    }
                    else if (buffer instanceof rf.IndexBuffer3D) {
                        i++;
                    }
                    else if (buffer instanceof rf.Texture) {
                        t++;
                    }
                    else if (buffer instanceof rf.Program3D) {
                        p++;
                    }
                }
                vo = vo.next;
            }
            return "p:" + p + " i:" + i + " v:" + v + " t:" + t;
        };
        return Context3D;
    }());
    rf.Context3D = Context3D;
    /**
     * todo
     */
    function webGLSimpleReport() {
        //http://webglreport.com/
        // Vertex Shader
        // Max Vertex Attributes:
        // Max Vertex Uniform Vectors:
        // Max Vertex Texture Image Units:
        // Max Varying Vectors:
        rf.gl.getParameter(rf.gl.MAX_VERTEX_ATTRIBS);
        rf.gl.getParameter(rf.gl.MAX_VERTEX_UNIFORM_VECTORS);
        rf.gl.getParameter(rf.gl.MAX_FRAGMENT_UNIFORM_VECTORS);
        rf.gl.getParameter(rf.gl.MAX_VARYING_VECTORS);
        rf.gl.getParameter(rf.gl.MAX_TEXTURE_IMAGE_UNITS);
        // Fragment Shader
        // Max Fragment Uniform Vectors:
        // Max Texture Image Units:
        // float/int precision:highp/highp
        return {};
    }
    rf.webGLSimpleReport = webGLSimpleReport;
})(rf || (rf = {}));
//# sourceMappingURL=Context3D.js.map