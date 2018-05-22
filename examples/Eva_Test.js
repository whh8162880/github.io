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
    var Eva_Text = /** @class */ (function () {
        function Eva_Text() {
            // window.onkeyup = this.onKeyDownHandle;
            rf.mainKey.regKeyDown(65 /* A */, this.onKeyDownHandle, this);
        }
        Eva_Text.prototype.onKeyDownHandle = function (e) {
            var m = rf.singleton(TestMediator);
            rf.facade.toggleMediator(m);
        };
        return Eva_Text;
    }());
    rf.Eva_Text = Eva_Text;
    var TestMediator = /** @class */ (function (_super) {
        __extends(TestMediator, _super);
        function TestMediator() {
            var _this = _super.call(this, "TestMediator") || this;
            _this.setPanel(new TestPanel());
            return _this;
        }
        TestMediator.prototype.mediatorReadyHandle = function () {
            _super.prototype.mediatorReadyHandle.call(this);
        };
        TestMediator.prototype.awaken = function () {
            console.log("mediator awaken");
        };
        return TestMediator;
    }(rf.Mediator));
    rf.TestMediator = TestMediator;
    var TestPanel = /** @class */ (function (_super) {
        __extends(TestPanel, _super);
        function TestPanel() {
            return _super.call(this, "create", "ui.asyncpanel.create") || this;
        }
        TestPanel.prototype.awaken = function () {
            this.key = new rf.KeyManagerV2(this.skin);
            this.key.regKeyDown(66 /* B */, this.onKeyHandle, this);
            this.key.awaken();
        };
        TestPanel.prototype.onKeyHandle = function (e) {
            console.log("key_down_" + e.keyCode);
        };
        TestPanel.prototype.sleep = function () {
            this.key.sleep();
            console.log("key_sleep");
        };
        return TestPanel;
    }(rf.TPanel));
    rf.TestPanel = TestPanel;
    var TestModel = /** @class */ (function (_super) {
        __extends(TestModel, _super);
        function TestModel() {
            return _super.call(this, "Test") || this;
        }
        return TestModel;
    }(rf.BaseMode));
    rf.TestModel = TestModel;
})(rf || (rf = {}));
//# sourceMappingURL=Eva_Test.js.map