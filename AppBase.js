/// <reference path="./com/youbt/rfreference.ts" />
/// <reference path="./com/youbt/components/rfreference.ts" />
/// <reference path="./com/youbt/stage3d/Stage3D.ts" />
///<reference path="./com/youbt/stage3d/three/Mesh.ts" />
var rf;
(function (rf) {
    var AppBase = /** @class */ (function () {
        function AppBase() {
            this.gcDelay = 3000;
            this.createSource();
            rf.Engine.start();
            rf.ROOT = rf.singleton(rf.Stage3D);
        }
        AppBase.prototype.init = function (canvas) {
            if (undefined == canvas) {
                canvas = document.createElement("canvas");
                document.body.appendChild(canvas);
            }
            var b = rf.ROOT.requestContext3D(canvas);
            if (false == b) {
                console.log("GL create fail");
                return;
            }
            this.initContainer();
            rf.Engine.addResize(this);
            rf.Engine.addTick(this);
            rf.ROOT.addEventListener(rf.EngineEvent.FPS_CHANGE, this.gcChangeHandler, this);
            this.nextGCTime = rf.engineNow + this.gcDelay;
        };
        AppBase.prototype.createSource = function () {
            // panels= singleton(PanelSourceManage)
            var bmd = new rf.BitmapData(2048, 2048, true);
            var source = new rf.BitmapSource().create("component", bmd, true);
            var vo = source.setSourceVO("origin", 1, 1);
            bmd.fillRect(vo.x, vo.y, vo.w, vo.h, "rgba(255,255,255,255)");
            source.originU = vo.ul;
            source.originV = vo.vt;
            rf.componentSource = source;
            var getPixelRatio = function (context) {
                var backingStore = context.backingStorePixelRatio ||
                    context.webkitBackingStorePixelRatio ||
                    context.mozBackingStorePixelRatio ||
                    context.msBackingStorePixelRatio ||
                    context.oBackingStorePixelRatio ||
                    context.backingStorePixelRatio || 1;
                return (window.devicePixelRatio || 1) / backingStore;
            };
            rf.pixelRatio = getPixelRatio(bmd.context);
            // pixelRatio = 1;
        };
        AppBase.prototype.initContainer = function () {
            var g = rf.gl;
            var container = new rf.Scene(rf.vertex_mesh_variable);
            var material = new rf.Material();
            material.depthMask = true;
            material.passCompareMode = 515 /* LEQUAL */;
            material.srcFactor = 770 /* SRC_ALPHA */;
            material.dstFactor = 771 /* ONE_MINUS_SRC_ALPHA */;
            ;
            material.cull = 0 /* NONE */;
            ;
            container.material = material;
            container.camera = rf.ROOT.camera3D;
            rf.ROOT.addChild(container);
            rf.scene = container;
            var uiContainer = new rf.UIContainer(undefined, rf.vertex_ui_variable);
            uiContainer.renderer = new rf.BatchRenderer(uiContainer);
            material = new rf.Material();
            material.depthMask = false;
            material.passCompareMode = 519 /* ALWAYS */;
            material.srcFactor = 770 /* SRC_ALPHA */;
            material.dstFactor = 771 /* ONE_MINUS_SRC_ALPHA */;
            material.cull = 0 /* NONE */;
            uiContainer.material = material;
            rf.ROOT.addChild(uiContainer);
            rf.popContainer.mouseEnabled = false;
            rf.tipContainer.mouseEnabled = false;
            uiContainer.addChild(rf.popContainer);
            uiContainer.addChild(rf.tipContainer);
        };
        AppBase.prototype.update = function (now, interval) {
            //todo
            rf.ROOT.update(now, interval);
            rf.tweenUpdate();
        };
        AppBase.prototype.resize = function (width, height) {
            rf.context3D.configureBackBuffer(rf.stageWidth, rf.stageHeight, 0);
            rf.ROOT.resize(width, height);
        };
        AppBase.prototype.gcChangeHandler = function (event) {
            var _a = this, nextGCTime = _a.nextGCTime, gcDelay = _a.gcDelay;
            var now = rf.engineNow;
            if (now > nextGCTime) {
                rf.context3D.gc(now);
                rf.Res.instance.gc(now);
                this.nextGCTime += gcDelay;
            }
        };
        return AppBase;
    }());
    rf.AppBase = AppBase;
})(rf || (rf = {}));
//# sourceMappingURL=AppBase.js.map