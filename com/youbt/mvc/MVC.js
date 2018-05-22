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
///<reference path="../stage3d/display/Component.ts" />
///<reference path="./manage/PanelSourceManage.ts" />
var rf;
(function (rf) {
    //var facade
    //facade 注册记录保存所有Model class 等信息
    var Facade = /** @class */ (function (_super) {
        __extends(Facade, _super);
        function Facade() {
            var _this = _super.call(this) || this;
            _this.SINGLETON_MSG = "Facade Singleton already constructed!";
            // mediatorMap:{[key:string]:Mediator}= {};
            _this.modelMap = {};
            _this.mediatorTypes = {};
            return _this;
        }
        Facade.prototype.toggleMediator = function (m, type) {
            if (type === void 0) { type = -1; }
            var mediator = rf.singleton(m);
            var panel = mediator._panel;
            if (mediator.isReady == false && type == 0) {
                if (mediator.hasEventListener(21 /* COMPLETE_LOADED */)) {
                    mediator.removeEventListener(21 /* COMPLETE_LOADED */, this.mediatorCompleteHandler);
                }
                return mediator;
            }
            if (mediator.isReady == false && mediator.startSync()) {
                this.mediatorTypes[mediator.name] = type;
                mediator.addEventListener(21 /* COMPLETE_LOADED */, this.mediatorCompleteHandler, this);
                return mediator;
            }
            this.togglepanel(mediator._panel);
            return mediator;
        };
        Facade.prototype.registerEvent = function (events, thisobj) {
            for (var key in events) {
                var fun = events[key];
                this.on(key, fun, thisobj);
            }
        };
        Facade.prototype.removeEvent = function (event) {
            for (var key in event) {
                var fun = event[key];
                this.off(key, fun);
            }
        };
        Facade.prototype.togglepanel = function (panel, type) {
            if (type === void 0) { type = -1; }
            switch (type) {
                case 1:
                    if (panel.isShow == false) {
                        panel.show();
                    }
                    else {
                        panel.bringTop();
                    }
                    break;
                case 0:
                    if (panel.isShow)
                        panel.hide();
                    break;
                case -1:
                    panel.isShow ? panel.hide() : panel.show();
                    break;
            }
        };
        Facade.prototype.mediatorCompleteHandler = function (event) {
            var mediator = event.data;
            mediator.removeEventListener(21 /* COMPLETE_LOADED */, this.mediatorCompleteHandler);
            var type = this.mediatorTypes[mediator.name];
            delete this.mediatorTypes[mediator.name];
            this.togglepanel(mediator._panel, type);
        };
        return Facade;
    }(rf.MiniDispatcher));
    rf.Facade = Facade;
    rf.facade = rf.singleton(Facade);
    var Mediator = /** @class */ (function (_super) {
        __extends(Mediator, _super);
        function Mediator(NAME) {
            var _this = _super.call(this) || this;
            _this.isReady = false;
            _this.name = NAME;
            _this.mEventListeners = {};
            _this.eventInterests = {};
            return _this;
        }
        Mediator.prototype.setPanel = function (panel) {
            if (this._panel) {
                rf.ThrowError("has panel");
            }
            this._panel = panel;
            if ("$panel" in this) {
                this["$panel"] = panel;
            }
        };
        Mediator.prototype.startSync = function () {
            var panel = this._panel;
            if (panel.loaded == false) {
                panel.load();
                panel.addEventListener(4 /* COMPLETE */, this.preViewCompleteHandler, this);
            }
            else {
                this.preViewCompleteHandler(undefined);
            }
            return true;
        };
        Mediator.prototype.preViewCompleteHandler = function (e) {
            if (e) {
                var skin = e.currentTarget;
                skin.removeEventListener(4 /* COMPLETE */, this.preViewCompleteHandler);
                this.setBindView(true);
            }
            //checkModeldata
            // TimerUtil.add(this. ,100);
            this.mediatorReadyHandle();
            this.simpleDispatch(21 /* COMPLETE_LOADED */, this);
        };
        Mediator.prototype.awakenAndSleepHandle = function (e) {
            var type = e.type;
            switch (type) {
                case 19 /* ADD_TO_STAGE */:
                    rf.facade.registerEvent(this.eventInterests, this);
                    if (this.isReady) {
                        this.awaken();
                    }
                    break;
                case 20 /* REMOVE_FROM_STAGE */:
                    rf.facade.removeEvent(this.eventInterests);
                    this.sleep();
                    break;
            }
        };
        Mediator.prototype.setBindView = function (isBind) {
            if (isBind) {
                this._panel.addEventListener(19 /* ADD_TO_STAGE */, this.awakenAndSleepHandle, this);
                this._panel.addEventListener(20 /* REMOVE_FROM_STAGE */, this.awakenAndSleepHandle, this);
            }
            else {
                this._panel.removeEventListener(19 /* ADD_TO_STAGE */, this.awakenAndSleepHandle);
                this._panel.removeEventListener(20 /* REMOVE_FROM_STAGE */, this.awakenAndSleepHandle);
            }
        };
        Mediator.prototype.mediatorReadyHandle = function () {
            this.isReady = true;
            if (this._panel.isShow) {
                rf.facade.registerEvent(this.eventInterests, this);
                this.awaken();
            }
        };
        Mediator.prototype.sleep = function () {
        };
        Mediator.prototype.awaken = function () {
        };
        Mediator.prototype.onRemove = function () {
        };
        return Mediator;
    }(rf.MiniDispatcher));
    rf.Mediator = Mediator;
    var BaseModel = /** @class */ (function (_super) {
        __extends(BaseModel, _super);
        function BaseModel(modelName) {
            var _this = _super.call(this) || this;
            _this.modelName = modelName;
            //注册
            rf.facade.modelMap[modelName] = _this;
            return _this;
        }
        BaseModel.prototype.refreshRuntimeData = function (type, data) {
        };
        BaseModel.prototype.initRuntime = function () {
        };
        BaseModel.prototype.onRegister = function () {
        };
        BaseModel.prototype.onRemove = function () {
        };
        return BaseModel;
    }(rf.MiniDispatcher));
    rf.BaseModel = BaseModel;
    var Panel = /** @class */ (function (_super) {
        __extends(Panel, _super);
        function Panel(uri, cls) {
            var _this = _super.call(this) || this;
            _this.isShow = false;
            _this.isReadyShow = false;
            _this.loaded = false;
            _this.centerFlag = false;
            _this._resizeable = false;
            _this.uri = uri;
            _this.clsName = cls;
            return _this;
        }
        Panel.prototype.getURL = function () {
            var url = "";
            if (!url) {
                url = "../assets/" + this.uri + ".p3d";
            }
            return url;
        };
        Panel.prototype.show = function (container, isModal) {
            if (container === void 0) { container = null; }
            if (isModal === void 0) { isModal = false; }
            var _a = this, loaded = _a.loaded, _resizeable = _a._resizeable, centerFlag = _a.centerFlag, isShow = _a.isShow;
            if (loaded == false) {
                this.isReadyShow = true;
                this.container = container;
                this.isModel = isModal;
                this.load();
                return;
            }
            if (isShow) {
                this.bringTop();
                return;
            }
            if (!container) {
                container = rf.popContainer;
            }
            container.addChild(this);
            if (_resizeable || isModal) {
                rf.Engine.addResize(this);
                // this.resize(stageWidth, stageHeight);
            }
            else if (centerFlag) {
                this.centerLayout();
            }
            this.isShow = true;
            this.awaken();
            this.effectTween(1);
            this.addEventListener(50 /* MouseDown */, this.panelClickHandler, this);
            // if(this.hasEventListener(PanelEvent.SHOW))
            // {
            // 	this.simpleDispatch(PanelEvent.SHOW);
            // }
        };
        Panel.prototype.load = function () {
            if (this.loaded) {
                this.asyncsourceComplete(undefined);
            }
            else {
                var url = this.getURL();
                this.loadSource = rf.sourceManger.load(url, this.uri);
                this.loadSource.addEventListener(4 /* COMPLETE */, this.asyncsourceComplete, this);
            }
        };
        Panel.prototype.asyncsourceComplete = function (e) {
            var loadSource = this.loadSource;
            var cs = loadSource.setting[this.clsName];
            if (cs) {
                this.source = loadSource.source;
                this.setSymbol(cs);
                this.renderer = new rf.BatchRenderer(this);
            }
            this.loaded = true;
            this.simpleDispatch(4 /* COMPLETE */);
            if (this.isReadyShow) {
                this.show(this.container, this.isModel);
            }
        };
        Panel.prototype.hide = function (e) {
            if (e === void 0) { e = undefined; }
            this.isReadyShow = false;
            if (!this.isShow) {
                return;
            }
            this.isShow = false;
            // this.sleep();
            this.effectTween(0);
            // this.hideState();
            this.removeEventListener(50 /* MouseDown */, this.panelClickHandler);
            if (this.hasEventListener("PanelEvent_HIDE" /* HIDE */)) {
                this.simpleDispatch("PanelEvent_HIDE" /* HIDE */);
            }
        };
        Panel.prototype.bringTop = function () {
            var parent = this.parent;
            if (parent == null)
                return;
            parent.addChild(this);
        };
        Panel.prototype.panelClickHandler = function (e) {
            this.bringTop();
        };
        Panel.prototype.effectTween = function (type) {
            // this.getTweener(type);
            // if(type){
            // 	_tween = tween.get(this._skin);
            // 	_tween.to({alpha:1},200);
            // }else{
            // 	_tween = tween.get(this._skin);
            // 	_tween.to({alpha:1},200);
            // }
            // _tween.call(this.effectEndByBitmapCache,this,type);
            // this.effectEndByBitmapCache(type);
            if (type == 0) {
                if (this._resizeable || this.isModel) {
                    rf.Engine.removeResize(this);
                }
                this.remove();
            }
        };
        Panel.prototype.resize = function (width, height) {
            var centerFlag = this.centerFlag;
            if (centerFlag) {
                this.centerLayout();
            }
        };
        Panel.prototype.centerLayout = function () {
            this.x = rf.stageWidth - this.w >> 1;
            this.y = rf.stageHeight - this.h >> 1;
            if (this.y < 0) {
                this.y = 0;
            }
        };
        return Panel;
    }(rf.Component));
    rf.Panel = Panel;
    var TEventInteresterDele = /** @class */ (function (_super) {
        __extends(TEventInteresterDele, _super);
        function TEventInteresterDele(source) {
            var _this = _super.call(this, source) || this;
            _this._eventInterests = {};
            //这个地方加添加和移除监听
            //添加到时候将所有事件注册 移除时将所有事件移除
            _this.setBindView(true);
            return _this;
        }
        TEventInteresterDele.prototype.bindEventInterests = function () {
        };
        TEventInteresterDele.prototype.setBindView = function (isBind) {
            if (isBind) {
                this.addEventListener(19 /* ADD_TO_STAGE */, this.awakenAndSleepHandle, this);
                this.addEventListener(20 /* REMOVE_FROM_STAGE */, this.awakenAndSleepHandle, this);
            }
            else {
                this.removeEventListener(19 /* ADD_TO_STAGE */, this.awakenAndSleepHandle);
                this.removeEventListener(20 /* REMOVE_FROM_STAGE */, this.awakenAndSleepHandle);
            }
        };
        TEventInteresterDele.prototype.awakenAndSleepHandle = function (e) {
            var type = e.type;
            switch (type) {
                case 19 /* ADD_TO_STAGE */:
                    rf.facade.registerEvent(this._eventInterests, this);
                    this.awaken();
                    break;
                case 20 /* REMOVE_FROM_STAGE */:
                    rf.facade.removeEvent(this._eventInterests);
                    this.sleep();
                    break;
            }
        };
        return TEventInteresterDele;
    }(rf.Component));
    rf.TEventInteresterDele = TEventInteresterDele;
})(rf || (rf = {}));
//# sourceMappingURL=MVC.js.map