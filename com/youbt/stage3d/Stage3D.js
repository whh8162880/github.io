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
///<reference path="./display/Sprite.ts" />
///<reference path="./Context3D.ts" />
///<reference path="./three/Light.ts" />
var rf;
(function (rf) {
    var SceneObject = /** @class */ (function (_super) {
        __extends(SceneObject, _super);
        function SceneObject() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SceneObject.prototype.addChild = function (child) {
            _super.prototype.addChild.call(this, child);
            if (child instanceof SceneObject) {
                child.scene = this.scene;
                rf.scene.childChange = true;
            }
        };
        Object.defineProperty(SceneObject.prototype, "available", {
            get: function () {
                return undefined != this.geometry;
            },
            enumerable: true,
            configurable: true
        });
        SceneObject.prototype.addChildAt = function (child, index) {
            _super.prototype.addChildAt.call(this, child, index);
            if (child instanceof SceneObject) {
                child.scene = this.scene;
                rf.scene.childChange = true;
            }
        };
        SceneObject.prototype.removeChild = function (child) {
            if (undefined == child) {
                return;
            }
            _super.prototype.removeChild.call(this, child);
            if (child instanceof SceneObject) {
                child.scene = undefined;
                rf.scene.childChange = true;
            }
        };
        SceneObject.prototype.removeAllChild = function () {
            var childrens = this.childrens;
            var len = childrens.length;
            for (var i = 0; i < len; i++) {
                var child = childrens[i];
                child.stage = undefined;
                child.parent = undefined;
                if (child instanceof SceneObject) {
                    child.scene = undefined;
                }
                child.removeFromStage();
            }
            this.childrens.length = 0;
        };
        SceneObject.prototype.removeFromStage = function () {
            var childrens = this.childrens;
            var len = childrens.length;
            for (var i = 0; i < len; i++) {
                var child = childrens[i];
                child.stage = undefined;
                if (child instanceof SceneObject) {
                    child.scene = undefined;
                }
                child.removeFromStage();
            }
        };
        SceneObject.prototype.addToStage = function () {
            var _a = this, childrens = _a.childrens, scene = _a.scene, stage = _a.stage;
            var len = childrens.length;
            for (var i = 0; i < len; i++) {
                var child = childrens[i];
                child.stage = stage;
                if (child instanceof SceneObject) {
                    child.scene = scene;
                }
                child.addToStage();
            }
        };
        SceneObject.prototype.renderShadow = function (sun, p, c, worldTranform, now, interval) {
            var _a = this, geometry = _a.geometry, sceneTransform = _a.sceneTransform;
            geometry.vertex.uploadContext(p);
            worldTranform.m3_append(sun.worldTranform, false, sceneTransform);
            c.setProgramConstantsFromMatrix("mvp" /* mvp */, worldTranform);
        };
        return SceneObject;
    }(rf.RenderBase));
    rf.SceneObject = SceneObject;
    var Scene = /** @class */ (function (_super) {
        __extends(Scene, _super);
        function Scene(variables) {
            var _this = _super.call(this, variables) || this;
            _this.scene = _this;
            _this.hitArea = new rf.HitArea();
            _this.hitArea.allWays = true;
            return _this;
        }
        Scene.prototype.render = function (camera, now, interval) {
            var _camera = this.camera;
            // const { depthMask, passCompareMode, srcFactor, dstFactor, cull } = this.material;
            var c = rf.context3D;
            var g = rf.gl;
            if (undefined == _camera) {
                _camera = camera;
            }
            if (_camera.states) {
                _camera.updateSceneTransform();
            }
            this.material.uploadContextSetting();
            // let{setting}=c;
            // setting.cull = cull;
            // setting.depth = depthMask;
            // setting.depthMode = passCompareMode;
            // setting.src = srcFactor;
            // setting.dst = dstFactor;
            _super.prototype.render.call(this, _camera, now, interval);
        };
        return Scene;
    }(SceneObject));
    rf.Scene = Scene;
    var AllActiveSprite = /** @class */ (function (_super) {
        __extends(AllActiveSprite, _super);
        function AllActiveSprite(source, variables) {
            var _this = _super.call(this, source, variables) || this;
            _this.hitArea.allWays = true;
            _this.mouseEnabled = false;
            return _this;
        }
        return AllActiveSprite;
    }(rf.Sprite));
    rf.AllActiveSprite = AllActiveSprite;
    rf.popContainer = new AllActiveSprite();
    rf.tipContainer = new AllActiveSprite();
    var Stage3D = /** @class */ (function (_super) {
        __extends(Stage3D, _super);
        function Stage3D() {
            var _this = _super.call(this) || this;
            _this.camera2D = new rf.Camera();
            _this.camera3D = new rf.Camera();
            _this.cameraUI = new rf.Camera();
            _this.renderer = new rf.BatchRenderer(_this);
            _this.shadow = new ShadowEffect(1024, 1024);
            _this.renderLink = new rf.Link();
            _this.camera = _this.cameraUI;
            _this.stage = _this;
            _this.debugImage = new DebugImage();
            return _this;
        }
        Stage3D.prototype.requestContext3D = function (canvas) {
            this.canvas = canvas;
            for (var _i = 0, _a = Stage3D.names; _i < _a.length; _i++) {
                var name = _a[_i];
                try {
                    rf.gl = this.canvas.getContext(name);
                }
                catch (e) {
                }
                if (rf.gl) {
                    break;
                }
            }
            if (undefined == rf.gl) {
                rf.context3D = null;
                this.simpleDispatch(14 /* ERROR */, "webgl is not available");
                return false;
            }
            rf.context3D = rf.singleton(rf.Context3D);
            rf.Capabilities.init();
            rf.MouseInstance.init(rf.Capabilities.isMobile);
            rf.mainKey.init();
            rf.KeyManagerV2.resetDefaultMainKey();
            canvas.addEventListener('webglcontextlost', this.webglContextLostHandler);
            canvas.addEventListener("webglcontextrestored", this.webglContextRestoredHandler);
            this.simpleDispatch(5 /* CONTEXT3D_CREATE */, rf.gl);
            return true;
        };
        Stage3D.prototype.webglContextLostHandler = function (e) {
            alert("Lost:" + e);
        };
        Stage3D.prototype.webglContextRestoredHandler = function (e) {
            alert("RestoredHandler:" + e);
        };
        //在这里驱动渲染
        Stage3D.prototype.update = function (now, interval) {
            if (this.states & 16 /* ct */) {
                this.updateTransform();
            }
            var renderLink = this.renderLink;
            if (rf.scene.childChange) {
                renderLink.clean();
                this.filterRenderList(rf.scene, renderLink);
            }
            var c = rf.context3D;
            c.dc = 0;
            c.triangles = 0;
            c.clear(0, 0, 0, 1);
            this.shadow.render(renderLink, rf.scene.sun, now, interval);
            this.render(this.camera, now, interval);
            // this.shadow.render(renderLink,scene.sun,now,interval);
            // let m = TEMP_MATRIX;
            // m.m3_identity();
            // this.debugImage.render(this.shadow.rtt,m);
        };
        Stage3D.prototype.resize = function (width, height) {
            var _a = this, camera2D = _a.camera2D, camera3D = _a.camera3D, cameraUI = _a.cameraUI;
            rf.CameraUIResize(width, height, cameraUI.len, cameraUI.far, cameraUI.originFar, cameraUI);
            rf.CameraOrthResize(width, height, camera2D.len, camera2D.far, camera2D.originFar, camera2D);
            rf.Camera3DResize(width, height, camera3D.len, camera3D.far, camera3D.originFar, camera3D);
        };
        Stage3D.prototype.filterRenderList = function (d, link) {
            var childrens = d.childrens;
            var len = childrens.length;
            for (var i = 0; i < len; i++) {
                var m = childrens[i];
                if (m.available) {
                    link.add(m);
                }
            }
        };
        Stage3D.names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        return Stage3D;
    }(AllActiveSprite));
    rf.Stage3D = Stage3D;
    var ShadowEffect = /** @class */ (function () {
        function ShadowEffect(w, h) {
            this.w = w;
            this.h = h;
            this.m = new rf.ShadowMaterial();
            this.m.setData(undefined);
            this.len = rf.newMatrix3D();
            this.debugImage = new DebugImage();
            rf.Camera3DResize(w, h, this.len, 10000, 10000 / Math.PI2);
            // CameraOrthResize(w,h,this.len,10000,10000/Math.PI2);
        }
        ShadowEffect.prototype.render = function (link, sun, now, interval) {
            var _a = this, m = _a.m, rtt = _a.rtt, len = _a.len, w = _a.w, h = _a.h;
            if (sun.states || sun.len != len) {
                sun.len = len;
                sun.updateSceneTransform();
            }
            var c = rf.context3D;
            if (!rtt) {
                this.rtt = rtt = c.createRttTexture(c.getTextureData("ShadowMaterial"), w, h);
                rtt.cleanColor = rf.newColor(0xFFFFFF);
                rtt.cleanColor.a = 1.0;
            }
            // c.configureBackBuffer(w,h,0);
            var g = rf.gl;
            c.setRenderToTexture(rtt, false);
            // c.setDepthTest(false,g.ALWAYS);
            // g.frontFace(g.CW);
            var passCompareMode = m.passCompareMode, cull = m.cull, program = m.program;
            // c.setDepthTest(false,passCompareMode);
            // c.setCulling(cull);
            // c.setProgram(program);
            var worldTranform = rf.TEMP_MATRIX;
            for (var vo = link.getFrist(); vo; vo = vo.next) {
                if (vo.close == false) {
                    var obj = vo.data;
                    var shadowable = obj.shadowable, shadowTarget = obj.shadowTarget, geometry = obj.geometry, shadowMatrix = obj.shadowMatrix, sceneTransform = obj.sceneTransform;
                    if (shadowable) {
                        m.uploadContext(sun, obj, now, interval);
                        var p = m.program;
                        obj.renderShadow(sun, p, c, worldTranform, now, interval);
                        c.drawTriangles(geometry.index, geometry.numTriangles, rtt.setting);
                    }
                    if (shadowTarget) {
                        if (!shadowMatrix) {
                            obj.shadowMatrix = shadowMatrix = rf.newMatrix3D();
                        }
                        shadowMatrix.m3_append(sun.worldTranform, false, sceneTransform);
                    }
                }
            }
            // let matrix = TEMP_MATRIX;
            // matrix.m3_scale(w / stageWidth,h / stageHeight,1);
            // matrix.m3_identity();
            // this.debugImage.render(undefined,matrix);
            c.setRenderToBackBuffer();
            // g.frontFace(g.CCW);
            // c.configureBackBuffer(stageWidth,stageHeight,0);
        };
        return ShadowEffect;
    }());
    rf.ShadowEffect = ShadowEffect;
    var PassContainer = /** @class */ (function (_super) {
        __extends(PassContainer, _super);
        function PassContainer(variables) {
            var _this = _super.call(this, variables) || this;
            _this.hitArea = new rf.HitArea();
            _this.hitArea.allWays = true;
            return _this;
        }
        PassContainer.prototype.render = function (camera, now, interval) {
            var _camera = this.camera;
            // const { depthMask, passCompareMode, srcFactor, dstFactor, cull } = this.material;
            var c = rf.context3D;
            var g = rf.gl;
            if (undefined == _camera) {
                _camera = camera;
            }
            if (_camera.states) {
                _camera.updateSceneTransform();
            }
            this.material.uploadContextSetting();
            // let{setting}=c;
            // setting.cull = cull;
            // setting.depth = depthMask;
            // setting.depthMode = passCompareMode;
            // setting.src = srcFactor;
            // setting.dst = dstFactor;
            _super.prototype.render.call(this, _camera, now, interval);
        };
        return PassContainer;
    }(rf.RenderBase));
    rf.PassContainer = PassContainer;
    var UIContainer = /** @class */ (function (_super) {
        __extends(UIContainer, _super);
        function UIContainer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UIContainer.prototype.render = function (camera, now, interval) {
            var cameraUI = rf.ROOT.cameraUI;
            var c = rf.context3D;
            var g = rf.gl;
            if (cameraUI.states) {
                cameraUI.updateSceneTransform();
            }
            this.material.uploadContextSetting();
            _super.prototype.render.call(this, cameraUI, now, interval);
        };
        return UIContainer;
    }(AllActiveSprite));
    rf.UIContainer = UIContainer;
    var DebugImage = /** @class */ (function () {
        function DebugImage() {
        }
        DebugImage.prototype.render = function (t, m) {
            var _a = this, et = _a.et, p = _a.p, v = _a.v;
            var c = rf.context3D;
            if (undefined == t) {
                if (!et) {
                    this.et = et = c.createTexture(c.getTextureData("../assets/tex/a.png", false, rf.gl.NEAREST, rf.gl.NEAREST, rf.gl.REPEAT));
                }
                var readly = et.readly, status_1 = et.status;
                if (false == readly) {
                    if (2 /* COMPLETE */ != status_1) {
                        if (0 /* WAIT */ == status_1) {
                            et.load(et.data.url);
                        }
                    }
                    else {
                        readly = true;
                    }
                }
                if (!readly) {
                    return;
                }
                t = et;
            }
            if (!p) {
                var vertexCode = "\n                    precision mediump float;\n                    attribute vec3 " + "pos" /* pos */ + ";\n                    attribute vec2 " + "uv" /* uv */ + ";\n\n                    uniform mat4 " + "mvp" /* mvp */ + ";\n\n                    varying vec2 vUV;\n\n                    void main(void){\n                        gl_Position = " + "mvp" /* mvp */ + " * vec4(" + "pos" /* pos */ + ",1.0);\n                        vUV = " + "uv" /* uv */ + ";\n                    }\n                ";
                var fragmentCode = void 0;
                if (et) {
                    fragmentCode = "\n                    precision mediump float;\n                    varying vec2 vUV;\n                    uniform sampler2D " + "diff" /* diff */ + ";\n\n                    void main(void){\n                        // gl_FragColor = texture2D(" + "diff" /* diff */ + ", vUV);\n                        vec4 c = texture2D(" + "diff" /* diff */ + ", vUV);\n                        // vec4 c = vec4(vUV,0.0,1.0);\n                        gl_FragColor = c;\n// \n                        // gl_FragColor = vec4(1.0);\n                    }\n                    ";
                }
                else {
                    fragmentCode = "\n                    precision mediump float;\n                    varying vec2 vUV;\n                    uniform sampler2D " + "diff" /* diff */ + ";\n\n                    void main(void){\n                        gl_FragColor = texture2D(" + "diff" /* diff */ + ", vUV);\n                        // gl_FragColor = vec4(vUV,0.0,1.0);\n                    }\n                ";
                }
                this.p = p = c.createProgram(vertexCode, fragmentCode);
            }
            if (!v) {
                var variables = rf.vertex_mesh_variable;
                var data32PerVertex = variables.data32PerVertex.size;
                var info = new rf.VertexInfo(new Float32Array([
                    -1, 1, 0, 0, 0, 1, 0, 0,
                    1, 1, 0, 0, 0, 1, 1, 0,
                    1, -1, 0, 0, 0, 1, 1, 1,
                    -1, -1, 0, 0, 0, 1, 0, 1
                ]), data32PerVertex, variables);
                this.v = v = c.createVertexBuffer(info);
            }
            var g = rf.gl;
            c.setProgram(p);
            // c.setCulling(g.NONE);
            // c.setBlendFactors(g.SRC_ALPHA,g.ONE_MINUS_DST_ALPHA);
            // c.setDepthTest(true,g.LEQUAL);
            c.setProgramConstantsFromMatrix("mvp" /* mvp */, m);
            v.uploadContext(p);
            t.uploadContext(p, 0, "diff" /* diff */);
            c.drawTriangles(c.getIndexByQuad(1), 2);
        };
        return DebugImage;
    }());
    rf.DebugImage = DebugImage;
})(rf || (rf = {}));
//# sourceMappingURL=Stage3D.js.map