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
/// <reference path="../com/youbt/stage3d/Stage3D.ts" />
var rf;
(function (rf) {
    var GUIProfile = /** @class */ (function (_super) {
        __extends(GUIProfile, _super);
        // span:HTMLElement;
        function GUIProfile() {
            var _this = _super.call(this) || this;
            _this.bindComponents();
            return _this;
        }
        GUIProfile.prototype.bindComponents = function () {
            this.timeTex = this.createText();
            this.fpsTxt = this.createText();
            this.bufferTex = this.createText();
            this.dcTxt = this.createText();
            rf.ROOT.addEventListener(rf.EngineEvent.FPS_CHANGE, this.fpsChangeHandler, this);
            // this.span = document.getElementById("fps");
        };
        GUIProfile.prototype.createText = function () {
            var text = new rf.TextField();
            text.init();
            text.y = this.h;
            this.h += text.format.size;
            this.addChild(text);
            return text;
        };
        GUIProfile.prototype.fpsChangeHandler = function (event) {
            var con = rf.context3D;
            this.timeTex.text = "time:" + rf.getFormatTime(rf.engineNow, "HH:mm:ss", false);
            this.fpsTxt.text = "F:" + rf.Engine.fps + " C:" + rf.Engine.code.toFixed(2);
            this.bufferTex.text = con.toString();
            this.dcTxt.text = "tri:" + con.triangles + " dc:" + con.dc;
            // this.span.innerHTML = `pixelRatio:${pixelRatio} fps:${Engine.fps} code:${Engine.code.toFixed(2)}`
        };
        return GUIProfile;
    }(rf.Sprite));
    rf.GUIProfile = GUIProfile;
})(rf || (rf = {}));
//# sourceMappingURL=GUIProfile.js.map