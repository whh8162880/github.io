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
    function skill_MeshCreate(line, event) {
        var mesh = line.runtime[event.key];
    }
    rf.skill_MeshCreate = skill_MeshCreate;
    var Skill = /** @class */ (function (_super) {
        __extends(Skill, _super);
        function Skill() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Skill.prototype.load = function (url) {
            if (url.lastIndexOf(".sk" /* SKILL */) == -1) {
                url += ".sk" /* SKILL */;
            }
            if (url.indexOf("://") == -1) {
                url = rf.skill_Perfix + url;
            }
            rf.loadRes(url, this.loadCompelte, this, 0 /* bin */);
        };
        Skill.prototype.loadCompelte = function (e) {
            var item = e.data;
            var byte = item.data;
            this.play(rf.amf_readObject(byte));
        };
        Skill.prototype.play = function (data) {
        };
        Skill.prototype.update = function (now, interval) {
        };
        return Skill;
    }(rf.SceneObject));
    rf.Skill = Skill;
})(rf || (rf = {}));
//# sourceMappingURL=Skill.js.map