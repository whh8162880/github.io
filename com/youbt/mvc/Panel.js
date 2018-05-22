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
//之后移植到Sprite里面
var rf;
(function (rf) {
    var DataBase = /** @class */ (function () {
        function DataBase() {
        }
        DataBase.prototype.DataBase3D = function () {
        };
        Object.defineProperty(DataBase.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
                this.doData();
            },
            enumerable: true,
            configurable: true
        });
        DataBase.prototype.doData = function () {
        };
        DataBase.prototype.dispose = function () {
        };
        DataBase.prototype.clear = function () {
        };
        return DataBase;
    }());
    rf.DataBase = DataBase;
    var SkinBase = /** @class */ (function (_super) {
        __extends(SkinBase, _super);
        function SkinBase(skin) {
            if (skin === void 0) { skin = null; }
            var _this = _super.call(this) || this;
            _this._enabled = true;
            if (skin) {
                _this.skin = skin;
                skin.mouseEnabled = true;
            }
            return _this;
        }
        Object.defineProperty(SkinBase.prototype, "skin", {
            get: function () { return this._skin; },
            set: function (value) {
                if (this._skin) {
                    // this._skin.skinBase = null;
                }
                this._skin = value;
                if (this._skin) {
                    // this._skin.skinBase = this;
                }
                this.bindComponents();
            },
            enumerable: true,
            configurable: true
        });
        SkinBase.prototype.bindComponents = function () { };
        SkinBase.prototype.refreshData = function () { this.doData(); };
        Object.defineProperty(SkinBase.prototype, "selected", {
            get: function () { return this._selected; },
            set: function (value) { this._selected = value; this.doSelected(); },
            enumerable: true,
            configurable: true
        });
        SkinBase.prototype.doSelected = function () { };
        Object.defineProperty(SkinBase.prototype, "enabled", {
            get: function () { return this._enabled; },
            set: function (value) { if (this._enabled == value) {
                return;
            } this._enabled = value; this.doEnabled(); },
            enumerable: true,
            configurable: true
        });
        SkinBase.prototype.doEnabled = function () { this._skin.mouseEnabled = false; this._skin.mouseChildren = false; };
        // get scenePos():Vector3D{return this._skin.scenePos};
        SkinBase.prototype.awaken = function () { };
        SkinBase.prototype.sleep = function () { };
        SkinBase.prototype.addEventListener = function (type, listener, thisobj, priority) {
            if (priority === void 0) { priority = 0; }
            this._skin.addEventListener(type, listener, thisobj, priority);
        };
        SkinBase.prototype.dispatchEvent = function (event) {
            return this._skin.dispatchEvent(event);
        };
        SkinBase.prototype.hasEventListener = function (type) {
            return this._skin.hasEventListener(type);
        };
        SkinBase.prototype.removeEventListener = function (type, listener) {
            this._skin.removeEventListener(type, listener);
        };
        SkinBase.prototype.simpleDispatch = function (type, data, bubbles) {
            if (data === void 0) { data = null; }
            if (bubbles === void 0) { bubbles = false; }
            return this._skin.simpleDispatch(type, data, bubbles);
        };
        Object.defineProperty(SkinBase.prototype, "visible", {
            get: function () {
                var _skin = this._skin;
                if (_skin) {
                    return _skin.visible;
                }
                return true;
            },
            set: function (value) {
                var _skin = this._skin;
                if (_skin) {
                    _skin.visible = value;
                    this.doVisible();
                }
            },
            enumerable: true,
            configurable: true
        });
        SkinBase.prototype.doVisible = function () {
        };
        Object.defineProperty(SkinBase.prototype, "alpha", {
            get: function () { return this._skin.alpha; },
            set: function (val) { this._skin.alpha = val; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkinBase.prototype, "scale", {
            get: function () { return this._skin.scaleX; },
            set: function (val) { this._skin.scaleX = val; this._skin.scaleY = val; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkinBase.prototype, "x", {
            get: function () { return this._skin.x; },
            set: function (value) { this._skin.x = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkinBase.prototype, "y", {
            get: function () { return this._skin.y; },
            set: function (value) { this._skin.y = value; },
            enumerable: true,
            configurable: true
        });
        SkinBase.prototype.addChild = function (child) {
            this._skin.addChild(child);
        };
        SkinBase.prototype.addChildAt = function (child, index) {
            this._skin.addChildAt(child, index);
        };
        SkinBase.prototype.invalidate = function (func) {
            if (func === void 0) { func = null; }
            // nativeStage.addEventListener(Event.ENTER_FRAME, onInvalidate);
            // if(null == func){
            // 	func = draw;
            // }
            // if(!invalidateFuncs)
            // {
            // 	invalidateFuncs = [];
            // }
            // if(invalidateFuncs.indexOf(func) == -1){
            // 	invalidateFuncs.push(func);
            // }
        };
        SkinBase.prototype.invalidateRemove = function (func) {
            if (func === void 0) { func = null; }
            // if(null == func){
            // 	func = draw;
            // }
            // var i:int = invalidateFuncs.indexOf(func);
            // if(i != -1){
            // 	invalidateFuncs.splice(i,1);
            // 	if(!invalidateFuncs.length){
            // 		nativeStage.removeEventListener(Event.ENTER_FRAME, onInvalidate);
            // 	}
            // }
        };
        SkinBase.prototype.onInvalidate = function (event) {
            // IEventDispatcher(event.currentTarget).removeEventListener(Event.ENTER_FRAME, onInvalidate);
            // var arr:Array = invalidateFuncs.concat();
            // invalidateFuncs.length = 0;
            // for each(var func:Function in arr){
            // 	func();
            // }
        };
        SkinBase.prototype.remove = function (event) {
            if (event === void 0) { event = null; }
            if (this._skin && this._skin.parent) {
                this._skin.parent.removeChild(this._skin);
            }
        };
        return SkinBase;
    }(DataBase));
    rf.SkinBase = SkinBase;
    var PanelBase = /** @class */ (function (_super) {
        __extends(PanelBase, _super);
        function PanelBase() {
            var _this = _super.call(this, new rf.Component()) || this;
            _this.isShow = false;
            return _this;
        }
        PanelBase.prototype.show = function (container, isModal) {
            if (container === void 0) { container = null; }
            if (isModal === void 0) { isModal = false; }
            if (this.isShow) {
                this.bringTop();
                return;
            }
            if (!container) {
                container = rf.popContainer;
            }
            container.addChild(this._skin);
            this.isShow = true;
            this.awaken();
            this.effectTween(1);
            this.addEventListener(50 /* MouseDown */, this.panelClickHandler, this);
            if (this.hasEventListener("PanelEvent_SHOW" /* SHOW */)) {
                this.simpleDispatch("PanelEvent_SHOW" /* SHOW */);
            }
        };
        PanelBase.prototype.effectTween = function (type) {
            this.getTweener(type);
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
                this._skin.remove();
            }
        };
        PanelBase.prototype.getTweener = function (type) {
            // if(this._skin.alpha == 1)
            // {
            // 	this._skin.alpha = 0;
            // }
        };
        PanelBase.prototype.effectEndByBitmapCache = function (type) {
            if (type == 0) {
                this._skin.remove();
            }
            else {
                // this._skin.alpha = 1;
            }
        };
        PanelBase.prototype.hide = function (e) {
            if (e === void 0) { e = undefined; }
            if (!this.isShow) {
                return;
            }
            this.isShow = false;
            this.sleep();
            this.effectTween(0);
            // this.hideState();
            this.removeEventListener(50 /* MouseDown */, this.panelClickHandler);
            if (this.hasEventListener("PanelEvent_HIDE" /* HIDE */)) {
                this.simpleDispatch("PanelEvent_HIDE" /* HIDE */);
            }
            console.log("Mediatro sleep");
        };
        PanelBase.prototype.bringTop = function () {
            var skin = this._skin;
            if (skin.parent == null)
                return;
            skin.parent.addChild(skin);
        };
        PanelBase.prototype.panelClickHandler = function (e) {
            this.bringTop();
        };
        return PanelBase;
    }(SkinBase));
    rf.PanelBase = PanelBase;
    var TPanel = /** @class */ (function (_super) {
        __extends(TPanel, _super);
        function TPanel(uri, cls) {
            var _this = _super.call(this) || this;
            _this.isReadyShow = false;
            _this.loaded = false;
            _this.uri = uri;
            _this.clsName = cls;
            _this._resizeable = true;
            return _this;
        }
        TPanel.prototype.getURL = function () {
            var url = "";
            if (!url) {
                url = "../assets/" + this.uri + ".p3d";
            }
            return url;
        };
        TPanel.prototype.show = function (container, isModal) {
            if (container === void 0) { container = null; }
            if (isModal === void 0) { isModal = false; }
            if (this.loaded == false) {
                this.isReadyShow = true;
                this.container = container;
                this.isModel = isModal;
                this.load();
                return;
            }
            _super.prototype.show.call(this, container, isModal);
        };
        TPanel.prototype.load = function () {
            if (this.source == undefined || this.source.status == 0) {
                var url = this.getURL();
                var source = manage.load(url, this.uri);
                source.addEventListener(4 /* COMPLETE */, this.asyncsourceComplete, this);
                this.source = source;
                // this.showload();
            }
            else {
                this.asyncsourceComplete(undefined);
            }
        };
        TPanel.prototype.asyncsourceComplete = function (e) {
            var source = this.source;
            var cs = source.setting[this.clsName];
            if (cs) {
                var skin = this.skin;
                skin.source = source.source;
                skin.setSymbol(cs);
                skin.renderer = new rf.BatchRenderer(skin);
            }
            this.loaded = true;
            this.simpleDispatch(4 /* COMPLETE */);
            if (this.isReadyShow) {
                this.show(this.container, this.isModel);
            }
        };
        TPanel.prototype.hide = function (e) {
            if (e === void 0) { e = undefined; }
            _super.prototype.hide.call(this, e);
            this.isReadyShow = false;
        };
        return TPanel;
    }(PanelBase));
    rf.TPanel = TPanel;
    var manage = rf.singleton(rf.PanelSourceManage);
})(rf || (rf = {}));
//# sourceMappingURL=Panel.js.map