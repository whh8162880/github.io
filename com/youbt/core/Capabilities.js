var rf;
(function (rf) {
    var C = /** @class */ (function () {
        function C() {
        }
        C.prototype.init = function () {
            this.platform = navigator.platform;
            this.userAgent = navigator.userAgent;
            var g = rf.gl;
            this.supportWebGL = undefined != g;
            if (!this.supportWebGL) {
                return;
            }
            this.glVersion = g.getParameter(g.VERSION);
            this.shadingLanguageVersion = g.getParameter(g.SHADING_LANGUAGE_VERSION);
            this.vendor = g.getParameter(g.VENDOR);
            this.renderer = g.getParameter(g.RENDERER);
            var dbgRenderInfo = g.getExtension("WEBGL_debug_renderer_info");
            if (dbgRenderInfo != undefined) {
                this.unMaskedVendor = g.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
                this.unMaskedRenderer = g.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
            }
            this.antialias = !!g.getContextAttributes().antialias;
            this.ANGLE = this.getAngle(g);
            this.maxVertexAttributes = g.getParameter(g.MAX_VERTEX_ATTRIBS);
            this.maxVertexTextureImageUnits = g.getParameter(g.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
            this.maxVertexUniformVectors = g.getParameter(g.MAX_VERTEX_UNIFORM_VECTORS);
            this.maxVaryingVectors = g.getParameter(g.MAX_VARYING_VECTORS);
            this.aliasedLineWidthRange = g.getParameter(g.ALIASED_LINE_WIDTH_RANGE);
            this.aliasedPointSizeRange = g.getParameter(g.ALIASED_POINT_SIZE_RANGE);
            this.maxFragmentUniformVectors = g.getParameter(g.MAX_FRAGMENT_UNIFORM_VECTORS);
            this.maxTextureImageUnits = g.getParameter(g.MAX_TEXTURE_IMAGE_UNITS);
            this.maxTextureSize = g.getParameter(g.MAX_TEXTURE_SIZE);
            this.maxCubeMapTextureSize = g.getParameter(g.MAX_CUBE_MAP_TEXTURE_SIZE);
            this.maxCombinedTextureImageUnits = g.getParameter(g.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
            this.maxAnisotropy = this.getMaxAnisotropy(g);
            this.maxColorBuffers = this.getMaxColorBuffers(g);
            this.redBits = g.getParameter(g.RED_BITS);
            this.greenBits = g.getParameter(g.GREEN_BITS);
            this.blueBits = g.getParameter(g.BLUE_BITS);
            this.alphaBits = g.getParameter(g.ALPHA_BITS);
            this.depthBits = g.getParameter(g.DEPTH_BITS);
            this.stencilBits = g.getParameter(g.STENCIL_BITS);
            this.maxRenderBufferSize = g.getParameter(g.MAX_RENDERBUFFER_SIZE);
            this.maxViewportDimensions = g.getParameter(g.MAX_VIEWPORT_DIMS);
            this.isMobile = this.IsPC() == false;
        };
        C.prototype.IsPC = function () {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        };
        C.prototype.describeRange = function (value) {
            return '[' + value[0] + ', ' + value[1] + ']';
        };
        C.prototype.getAngle = function (g) {
            var lineWidthRange = this.describeRange(g.getParameter(g.ALIASED_LINE_WIDTH_RANGE));
            // Heuristic: ANGLE is only on Windows, not in IE, and not in Edge, and does not implement line width greater than one.
            var angle = ((navigator.platform === 'Win32') || (navigator.platform === 'Win64')) &&
                (g.getParameter(g.RENDERER) !== 'Internet Explorer') &&
                (g.getParameter(g.RENDERER) !== 'Microsoft Edge') &&
                (lineWidthRange === this.describeRange([1, 1]));
            if (angle) {
                // Heuristic: D3D11 backend does not appear to reserve uniforms like the D3D9 backend, e.g.,
                // D3D11 may have 1024 uniforms per stage, but D3D9 has 254 and 221.
                //
                // We could also test for WEBGL_draw_buffers, but many systems do not have it yet
                // due to driver bugs, etc.
                if (rf.isPowerOfTwo(g.getParameter(g.MAX_VERTEX_UNIFORM_VECTORS)) && rf.isPowerOfTwo(g.getParameter(g.MAX_FRAGMENT_UNIFORM_VECTORS))) {
                    return 'Yes, D3D11';
                }
                else {
                    return 'Yes, D3D9';
                }
            }
            return 'No';
        };
        C.prototype.getMaxAnisotropy = function (g) {
            var e = g.getExtension('EXT_texture_filter_anisotropic')
                || g.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
                || g.getExtension('MOZ_EXT_texture_filter_anisotropic');
            if (e) {
                var max = g.getParameter(e.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                if (max === 0) {
                    max = 2;
                }
                return max;
            }
            return NaN;
        };
        C.prototype.getMaxColorBuffers = function (g) {
            var maxColorBuffers = 1;
            var ext = g.getExtension("WEBGL_draw_buffers");
            if (ext != null) {
                maxColorBuffers = g.getParameter(ext.MAX_DRAW_BUFFERS_WEBGL);
            }
            return maxColorBuffers;
        };
        return C;
    }());
    /**
     * 提供当前浏览器的功能描述
     */
    rf.Capabilities = new C();
})(rf || (rf = {}));
//# sourceMappingURL=Capabilities.js.map