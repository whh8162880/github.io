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
///<reference path="../com/youbt/mvc/MVC.ts" />
var rf;
(function (rf) {
    var PanelUtils = /** @class */ (function () {
        function PanelUtils() {
            rf.mainKey.regKeyDown(65 /* A */, this.onKeyDownHandle, this);
        }
        PanelUtils.prototype.onKeyDownHandle = function (e) {
            rf.facade.toggleMediator(CreateMeidator);
        };
        return PanelUtils;
    }());
    rf.PanelUtils = PanelUtils;
    var CreateMeidator = /** @class */ (function (_super) {
        __extends(CreateMeidator, _super);
        function CreateMeidator() {
            var _this = _super.call(this, CreateMeidator.NAME) || this;
            _this.setPanel(new CreatePanel());
            return _this;
        }
        CreateMeidator.prototype.mediatorReadyHandle = function () {
            _super.prototype.mediatorReadyHandle.call(this);
        };
        CreateMeidator.prototype.awaken = function () {
            console.log("CreateMeidator awaken");
        };
        CreateMeidator.NAME = "CreateMeidator";
        return CreateMeidator;
    }(rf.Mediator));
    rf.CreateMeidator = CreateMeidator;
    var CreatePanel = /** @class */ (function (_super) {
        __extends(CreatePanel, _super);
        function CreatePanel() {
            var _this = _super.call(this, "create", "ui.asyncpanel.create") || this;
            _this.btn_random = null;
            _this.btn_create = null;
            _this.dele_info = null;
            return _this;
        }
        CreatePanel.prototype.bindComponents = function () {
            this.centerFlag = true;
            this._resizeable = true;
            this.setSize(1400, 750);
            this.bg = new rf.IconView(this.source);
            this.addChildAt(this.bg, 0);
            this.bg.setUrl('assets/createbg.jpg');
            // this.btn_random = skin["btn_random"];
            this.btn_random.addClick(this.randomHandler);
            if (this.dele_info.btn_create != undefined) {
                this.dele_info.btn_create.addClick(this.createHandler);
            }
            else {
                alert("1112");
            }
        };
        CreatePanel.prototype.createHandler = function (e) {
            alert("dele_info 创建点击");
        };
        CreatePanel.prototype.randomHandler = function (e) {
            alert("随机按钮点击");
        };
        CreatePanel.prototype.awaken = function () {
            this.key = new rf.KeyManagerV2(this);
            this.key.regKeyDown(66 /* B */, this.onKeyHandle, this);
            this.key.awaken();
        };
        CreatePanel.prototype.onKeyHandle = function (e) {
            console.log("key_down_" + e.keyCode);
        };
        CreatePanel.prototype.sleep = function () {
            this.key.sleep();
            console.log("key_sleep");
        };
        return CreatePanel;
    }(rf.Panel));
    rf.CreatePanel = CreatePanel;
    var CreateModel = /** @class */ (function (_super) {
        __extends(CreateModel, _super);
        function CreateModel() {
            return _super.call(this, "CreateModel") || this;
        }
        return CreateModel;
    }(rf.BaseModel));
    rf.CreateModel = CreateModel;
})(rf || (rf = {}));
//# sourceMappingURL=PanelUtils.js.map