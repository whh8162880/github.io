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
///<reference path="../Stage3D.ts" />
var rf;
(function (rf) {
    var Light = /** @class */ (function (_super) {
        __extends(Light, _super);
        function Light() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.color = 0xFFFFFF;
            _this.intensity = 1.0;
            _this.lookVector = rf.newVector3D(0, 0, 0);
            return _this;
        }
        Light.prototype.updateSceneTransform = function (sceneTransform) {
            if (this.states | 1 /* trasnform */) {
                var _a = this, transform = _a.transform, lookVector = _a.lookVector, sceneTransform_1 = _a.sceneTransform, len = _a.len;
                this.lookat(lookVector);
                this.updateTransform();
                this.sceneTransform.m3_invert(transform);
                this.worldTranform.m3_append(len, false, sceneTransform_1);
                // this.states &= ~DChange.trasnform;
            }
            this.states = 0;
        };
        return Light;
    }(rf.Camera));
    rf.Light = Light;
    var DirectionalLight = /** @class */ (function (_super) {
        __extends(DirectionalLight, _super);
        function DirectionalLight() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return DirectionalLight;
    }(Light));
    rf.DirectionalLight = DirectionalLight;
})(rf || (rf = {}));
//# sourceMappingURL=Light.js.map