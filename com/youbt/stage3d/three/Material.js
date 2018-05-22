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
    var Material = /** @class */ (function () {
        function Material() {
            this.depthMask = false;
        }
        Material.prototype.createProgram = function (mesh) {
            return this.program;
        };
        Material.prototype.setData = function (data) {
            if (!data) {
                this.cull = 0 /* NONE */;
                this.depthMask = true;
                this.passCompareMode = 515 /* LEQUAL */;
                this.srcFactor = 770 /* SRC_ALPHA */;
                this.dstFactor = 771 /* ONE_MINUS_SRC_ALPHA */;
                this.alphaTest = -1;
            }
            else {
                var cull = data.cull, depthMask = data.depthMask, passCompareMode = data.passCompareMode, srcFactor = data.srcFactor, dstFactor = data.dstFactor, alphaTest = data.alphaTest, diffTex = data.diffTex;
                this.cull = (undefined != cull) ? cull : 1029 /* BACK */;
                this.depthMask = undefined != depthMask ? depthMask : true;
                this.passCompareMode = passCompareMode ? passCompareMode : 515 /* LEQUAL */;
                this.srcFactor = srcFactor ? srcFactor : 770 /* SRC_ALPHA */;
                this.dstFactor = dstFactor ? dstFactor : 771 /* ONE_MINUS_SRC_ALPHA */;
                this.alphaTest = Number(alphaTest);
                if (diffTex) {
                    this.diffTex = diffTex;
                }
                else {
                    this.diff = rf.newColor(0xFFFFFF);
                }
            }
        };
        Material.prototype.uploadContextSetting = function () {
            var setting = rf.context3D.setting;
            var _a = this, cull = _a.cull, srcFactor = _a.srcFactor, dstFactor = _a.dstFactor, depthMask = _a.depthMask, passCompareMode = _a.passCompareMode;
            setting.cull = cull;
            setting.depth = depthMask;
            setting.depthMode = passCompareMode;
            setting.src = srcFactor;
            setting.dst = dstFactor;
        };
        Material.prototype.uploadContext = function (camera, mesh, now, interval) {
            var c = rf.context3D;
            var program = this.program;
            if (!program) {
                this.program = program = this.createProgram(mesh);
            }
            c.setProgram(program);
            this.uploadContextSetting();
            return true;
        };
        Material.prototype.checkTexs = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var c = rf.context3D;
            var b = true;
            args.forEach(function (data) {
                if (undefined != data) {
                    var tex = void 0;
                    if (data.key) {
                        tex = c.textureObj[data.key];
                    }
                    if (undefined == tex) {
                        tex = c.createTexture(data, undefined);
                        b = false;
                    }
                    var readly = tex.readly, status_1 = tex.status;
                    if (false == readly) {
                        if (2 /* COMPLETE */ != status_1) {
                            if (0 /* WAIT */ == status_1) {
                                tex.load(_this.getTextUrl(data));
                            }
                            b = false;
                        }
                    }
                }
            });
            return b;
        };
        Material.prototype.getTextUrl = function (data) {
            return data.url;
        };
        return Material;
    }());
    rf.Material = Material;
    var ShadowMaterial = /** @class */ (function (_super) {
        __extends(ShadowMaterial, _super);
        function ShadowMaterial() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ShadowMaterial.prototype.createProgram = function (mesh) {
            var c = rf.context3D;
            var key = "ShadowMaterial";
            var p = c.programs[key];
            if (undefined != p) {
                return p;
            }
            var skAnim = mesh.skAnim;
            var v_def = "";
            if (undefined != skAnim) {
                key += "-skeleton";
                v_def += "#define USE_SKINNING\n           #define MAX_BONES 50\n";
            }
            var vertexCode = "\n                precision mediump float;\n\n                " + v_def + "\n\n\n\n                attribute vec3 " + "pos" /* pos */ + ";\n                uniform mat4 " + "mvp" /* mvp */ + ";\n                varying vec4 vPos;\n\n\n#ifdef USE_SKINNING\n                attribute vec4 " + "index" /* index */ + ";\n                attribute vec4 " + "weight" /* weight */ + ";\n                uniform mat4 " + "bones" /* vc_bones */ + "[ MAX_BONES ];\n                mat4 getBoneMatrix( const in float i ) {\n                    mat4 bone = " + "bones" /* vc_bones */ + "[ int(i) ];\n                    return bone;\n                }\n#endif\n                void main(void){\n                    vec4 t_pos = vec4(" + "pos" /* pos */ + ",1.0);\n                    #ifdef USE_SKINNING\n                        mat4 boneMatX = getBoneMatrix( " + "index" /* index */ + ".x );\n                        mat4 boneMatY = getBoneMatrix( " + "index" /* index */ + ".y );\n                        mat4 boneMatZ = getBoneMatrix( " + "index" /* index */ + ".z );\n                        mat4 boneMatW = getBoneMatrix( " + "index" /* index */ + ".w );\n                    // #endif\n                    // #ifdef USE_SKINNING\n                        mat4 skinMatrix = mat4( 0.0 );\n                        skinMatrix += " + "weight" /* weight */ + ".x * boneMatX;\n                        skinMatrix += " + "weight" /* weight */ + ".y * boneMatY;\n                        skinMatrix += " + "weight" /* weight */ + ".z * boneMatZ;\n                        skinMatrix += " + "weight" /* weight */ + ".w * boneMatW;\n                        t_pos = skinMatrix * t_pos;\n                    #endif\n\n                    gl_Position = vPos = " + "mvp" /* mvp */ + " * t_pos;\n                }\n            ";
            var fragmentCode = "\n                precision mediump float;\n\n\n                // const float PackUpscale = 256. / 255.;\n                // const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );\n                // const float ShiftRight8 = 1. / 256.;\n                // vec4 packDepthToRGBA( const in float v ) {\n                //     vec4 r = vec4( fract( v * PackFactors ), v );\n                //     r.yzw -= r.xyz * ShiftRight8;\n                //     return r * PackUpscale;\n                // }\n\n\n                vec4 packDepthToRGBA(float depth){\n                    float r = depth;\n                    float g = fract(r * 255.0);\n                    float b = fract(g * 255.0);\n                    float a = fract(b * 255.0);\n                    float coef = 1.0 / 255.0;\n                    r -= g * coef;\n                    g -= b * coef;\n                    b -= a * coef;\n                    return vec4(r, g, b, a);\n                }\n\n                varying vec4 vPos;\n                void main(void){\n                    // gl_FragColor = packDepthToRGBA(gl_FragCoord.z);\n                    gl_FragColor = vec4(gl_FragCoord.zzz,1.0);\n                    // gl_FragColor = vec4(vPos.zzz/vPos.w,1.0);\n                    // gl_FragColor = packDepthToRGBA(vPos.z/vPos.w);\n                }\n                \n            ";
            p = c.createProgram(vertexCode, fragmentCode, key);
            return p;
        };
        return ShadowMaterial;
    }(Material));
    rf.ShadowMaterial = ShadowMaterial;
    var PhongMaterial = /** @class */ (function (_super) {
        __extends(PhongMaterial, _super);
        function PhongMaterial() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PhongMaterial.prototype.uploadContext = function (camera, mesh, now, interval) {
            var scene = mesh.scene;
            var c = rf.context3D;
            var _a = this, diff = _a.diff, diffTex = _a.diffTex, emissiveTex = _a.emissiveTex, specularTex = _a.specularTex;
            var skAnim = mesh.skAnim;
            if (!diff && !diffTex) {
                return false;
            }
            var b = this.checkTexs(diffTex, emissiveTex, specularTex);
            if (false == b) {
                return false;
            }
            _super.prototype.uploadContext.call(this, camera, mesh, now, interval);
            var _b = this, program = _b.program, emissive = _b.emissive, specular = _b.specular;
            var sun = scene.sun;
            c.setProgramConstantsFromVector("lightDirection" /* lightDirection */, [sun._x, sun._y, sun._z], 3);
            var t;
            var textureID = 0;
            if (undefined != diffTex) {
                t = c.textureObj[diffTex.key];
                t.uploadContext(program, textureID++, "diff" /* diff */);
            }
            else if (undefined != diff) {
                c.setProgramConstantsFromVector("vc_diff" /* vc_diff */, [diff.r, diff.g, diff.b, diff.a], 4);
            }
            if (mesh.shadowTarget) {
                rf.ROOT.shadow.rtt.uploadContext(program, textureID++, "shadow" /* SHADOW */);
            }
            // c.setProgramConstantsFromVector(VC.lightDirection,[100,100,100],3);
            // c.setProgramConstantsFromVector(VC.vc_diff,[Math.random(),Math.random(),Math.random(),1.0],4);
            if (undefined != emissive) {
                c.setProgramConstantsFromVector("vc_emissive" /* vc_emissive */, [emissive.r, emissive.g, emissive.b, 0.0], 4);
            }
            return true;
        };
        PhongMaterial.prototype.createProgram = function (mesh) {
            var _a = this, diffTex = _a.diffTex, emissiveTex = _a.emissiveTex, specularTex = _a.specularTex, diff = _a.diff;
            var skAnim = mesh.skAnim, shadowTarget = mesh.shadowTarget;
            var c = rf.context3D;
            var f_def = "";
            var v_def = "";
            var key = "PhongMaterial";
            if (undefined != diffTex) {
                key += "-diff";
                f_def += "#define DIFF\n";
            }
            else if (undefined != diff) {
                f_def += "#define VC_DIFF\n";
            }
            if (undefined != emissiveTex) {
                key += "-emissive";
            }
            if (undefined != specularTex) {
                key += "-specular";
            }
            if (shadowTarget) {
                key += "-shadow";
                f_def += "#define SHADOW";
                v_def += "#define SHADOW";
            }
            if (undefined != skAnim) {
                key += "-skeleton";
                v_def += "#define USE_SKINNING\n           #define MAX_BONES 50\n";
            }
            var p = c.programs[key];
            if (undefined != p) {
                return p;
            }
            var vertexCode = "\n                precision mediump float;\n                " + v_def + "\n                attribute vec3 " + "pos" /* pos */ + ";\n                attribute vec3 " + "normal" /* normal */ + ";\n                attribute vec2 " + "uv" /* uv */ + ";\n                #ifdef USE_SKINNING\n                    attribute vec4 " + "index" /* index */ + ";\n                    attribute vec4 " + "weight" /* weight */ + ";\n                #endif\n                uniform mat4 " + "mvp" /* mvp */ + ";\n                uniform mat4 " + "invm" /* invm */ + ";\n                uniform vec3 " + "lightDirection" /* lightDirection */ + ";\n                uniform mat4 " + "sunmvp" /* sunmvp */ + ";\n\n                varying vec4 vDiffuse;\n                varying vec2 vUV;\n                varying vec4 vShadowUV;\n#ifdef USE_SKINNING\n                uniform mat4 " + "bones" /* vc_bones */ + "[ MAX_BONES ];\n                mat4 getBoneMatrix( const in float i ) {\n                    mat4 bone = " + "bones" /* vc_bones */ + "[ int(i) ];\n                    return bone;\n                }\n#endif\n                void main() {\n                    vec4 t_pos = vec4(" + "pos" /* pos */ + ", 1.0);\n                    vec3 t_normal = " + "normal" /* normal */ + ";\n\n                    #ifdef USE_SKINNING\n                        mat4 boneMatX = getBoneMatrix( " + "index" /* index */ + ".x );\n                        mat4 boneMatY = getBoneMatrix( " + "index" /* index */ + ".y );\n                        mat4 boneMatZ = getBoneMatrix( " + "index" /* index */ + ".z );\n                        mat4 boneMatW = getBoneMatrix( " + "index" /* index */ + ".w );\n                    // #endif\n                    // #ifdef USE_SKINNING\n                        mat4 skinMatrix = mat4( 0.0 );\n                        skinMatrix += " + "weight" /* weight */ + ".x * boneMatX;\n                        skinMatrix += " + "weight" /* weight */ + ".y * boneMatY;\n                        skinMatrix += " + "weight" /* weight */ + ".z * boneMatZ;\n                        skinMatrix += " + "weight" /* weight */ + ".w * boneMatW;\n                        t_normal = vec4( skinMatrix * vec4( t_normal, 0.0 ) ).xyz;\n                        t_pos = skinMatrix * t_pos;\n                    #endif\n\n                    vec3  invLight = normalize(" + "invm" /* invm */ + " * vec4(" + "lightDirection" /* lightDirection */ + ", 0.0)).xyz;\n                    float diffuse  = clamp(dot(t_normal.xyz, invLight), 0.1, 1.0);\n                    vDiffuse = vec4(vec3(diffuse), 1.0);\n                    vUV = " + "uv" /* uv */ + ";\n                    gl_Position = " + "mvp" /* mvp */ + " * t_pos;\n#ifdef SHADOW\n                    t_pos = " + "sunmvp" /* sunmvp */ + " * t_pos;\n                    // t_pos.xyz /= t_pos.w;\n                    // t_pos.xy = t_pos.xy * 0.5 + 0.5;\n                    vShadowUV = t_pos;\n#endif\n                }\n            ";
            var fragmentCode = "\n                precision mediump float;    \n\n                " + f_def + "\n\n                uniform sampler2D " + "diff" /* diff */ + ";\n                uniform sampler2D " + "shadow" /* SHADOW */ + ";\n\n                uniform vec4 " + "vc_diff" /* vc_diff */ + ";\n                uniform vec4 " + "vc_emissive" /* vc_emissive */ + ";\n\n                varying vec4 vDiffuse;\n                varying vec2 vUV;\n\n                varying vec4 vShadowUV;\n\n                // const float UnpackDownscale = 255.0 / 256.0;\n                // const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );\n                // const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1.0);\n                // float unpackRGBAToDepth( const in vec4 v ) {\n                //     return dot( v, UnpackFactors );\n                // }\n\n                float unpackRGBAToDepth(vec4 RGBA){\n                    const float rMask = 1.0;\n                    const float gMask = 1.0 / 255.0;\n                    const float bMask = 1.0 / (255.0 * 255.0);\n                    const float aMask = 1.0 / (255.0 * 255.0 * 255.0);\n                    float depth = dot(RGBA, vec4(rMask, gMask, bMask, aMask));\n                    return depth;\n                }\n                \n                void main(void){\n\n                    vec2 tUV = vUV;\n                    vec4 diffuse = vDiffuse;\n\n                    #ifdef DIFF\n                        vec4 c = texture2D(" + "diff" /* diff */ + ", tUV);\n                    #else\n                        #ifdef VC_DIFF\n                            vec4 c = " + "vc_diff" /* vc_diff */ + ";\n                        #else\n                            vec4 c = vec4(1.0,1.0,1.0,1.0) ;\n                        #endif\n                    #endif\n\n                    #ifdef SHADOW\n                        vec3 projCoords = vShadowUV.xyz / vShadowUV.w;\n                        projCoords.xyz = projCoords.xyz * 0.5 + 0.5;\n                        vec4 s = texture2D(" + "shadow" /* SHADOW */ + ", projCoords.xy);\n\n                        if(projCoords.z > s.z - 0.001){\n                            diffuse.xyz *= 0.8;\n                        }\n                       \n                        // diffuse.xyz *= s.z;\n                        // c.xyz = vec3(restDepth(s));\n                        // c.xyz = vec3((s.z-.55) * 5.);\n                        // c = s.z;\n\n                        // if(s.x >= projCoords.z-0.01){\n                        //     diffuse.xyz *= 0.8;\n                        // }\n\n                        // c = vec4(vec3(projCoords.z),1.);\n                        // vec4 s = texture2D(" + "shadow" /* SHADOW */ + ", tUV);\n                        // if(unpackRGBAToDepth(s) > projCoords.z){\n                        //     c = vec4(1.0);\n                        // }else{\n                        //     c = vec4(0.0);\n                        // }\n                        // c = vec4(unpackRGBAToDepth(s) > projCoords.z ? 1. : 0.);\n                        // c = s;\n                        // c = vec4(projCoords.xy,0.0,1.0);\n                        // c = vec4(vShadowUV.www,1.0);\n                        // c = vec4(projCoords.zzz,1.);\n                        // c = vec4(gl_FragCoord.z/gl_FragCoord.w);\n                        \n                    #endif\n\n                    diffuse.xyz += 0.5;\n                    c *= diffuse;\n\n                    if(c.w < 0.1){\n                        discard;\n                    }\n                    gl_FragColor = c;\n                    // gl_FragColor = vec4(1.0,1.0,1.0,1.0);\n                    // gl_FragColor = vec4(vUV,0.0,1.0);\n                }\n            ";
            p = c.createProgram(vertexCode, fragmentCode, key);
            return p;
        };
        return PhongMaterial;
    }(Material));
    rf.PhongMaterial = PhongMaterial;
})(rf || (rf = {}));
//# sourceMappingURL=Material.js.map