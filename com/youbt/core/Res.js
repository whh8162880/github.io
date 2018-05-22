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
    /**
         * 同一时刻最大可以同时启动的下载线程数
         */
    rf.res_max_loader = 5;
    /**
     * 添加一个加载项
     * @param url 加载路径, 数组为添加多个
     * @param complete 加载完毕回调
     * @param thisObj 回调作用域
     * @param type 资源类型
     * @param priority 加载优先级
     * @param cache 是否缓存
     * @param noDispose 不自动释放
     * @param disposeTime 自动释放时间, 超过该时间自动释放资源
     */
    function loadRes(url, complete, thisObj, type, priority, cache, noDispose, disposeTime) {
        if (type === void 0) { type = 0 /* bin */; }
        if (priority === void 0) { priority = 0 /* low */; }
        if (cache === void 0) { cache = true; }
        if (noDispose === void 0) { noDispose = false; }
        if (disposeTime === void 0) { disposeTime = 30000; }
        return Res.instance.load(url, complete, thisObj, type, priority, cache, noDispose, disposeTime);
    }
    rf.loadRes = loadRes;
    function removeLoad(url, complete) {
    }
    rf.removeLoad = removeLoad;
    /**
     * 资源加载管理类
     */
    var Res = /** @class */ (function () {
        // private _loadingMap: { [k: string]: ResItem };
        function Res() {
            // maxLoader: number = 5;
            this.nowLoader = 0;
            this._analyzerMap = {};
            this._analyzerMap[1 /* text */] = ResTextLoader;
            this._analyzerMap[0 /* bin */] = ResBinLoader;
            this._analyzerMap[2 /* sound */] = ResSoundLoader;
            this._analyzerMap[3 /* image */] = ResImageLoader;
            this.resMap = {};
            this.link = new rf.Link();
            // this._loadMap = {};
            // this._resMap = {};
            // this._loadingMap = {};
            // 资源释放机制
            // setInterval(this.clearRes.bind(this), 10 * 1000);
        }
        Object.defineProperty(Res, "instance", {
            get: function () {
                return this._instance || (this._instance = new Res());
            },
            enumerable: true,
            configurable: true
        });
        Res.prototype.removeLoad = function (url, complete) {
            var resMap = this.resMap;
            var item = resMap[url];
            if (undefined == item) {
                return;
            }
            var completes = item.complete;
            if (undefined == completes) {
                return;
            }
            var len = completes.length;
            var i = -1;
            for (i = 0; i < len; i++) {
                var o = completes[i];
                if (o.complete == complete) {
                    break;
                }
            }
            if (-1 != i) {
                completes.splice(i, 1);
            }
        };
        /**
         * 添加一个加载项
         * @param url 加载路径
         * @param complete 加载完毕回调
         * @param thisObj 回调作用域
         * @param type 资源类型
         * @param priority 加载优先级
         * @param cache 是否缓存
         * @param noDispose 不自动释放
         * @param disposeTime 自动释放时间, 超过该时间自动释放资源
         */
        Res.prototype.load = function (url, complete, thisObj, type, priority, cache, noDispose, disposeTime) {
            if (type === void 0) { type = 0 /* bin */; }
            if (priority === void 0) { priority = 0 /* low */; }
            if (cache === void 0) { cache = true; }
            if (noDispose === void 0) { noDispose = false; }
            if (disposeTime === void 0) { disposeTime = 30000; }
            var resMap = this.resMap;
            var item = resMap[url];
            if (undefined == item) {
                //没创建
                var item_1 = rf.recyclable(ResItem);
                item_1.type = type;
                item_1.name = url;
                item_1.complete = [{ thisObj: thisObj, complete: complete }];
                item_1.states = 0 /* WAIT */;
                item_1.url = url;
                //添加进加载列表
                this.link.addByWeight(item_1, priority);
                //开始加载
                this.loadNext();
            }
            else if (undefined != item.complete) {
                //正在加载中
                item.complete.push({ thisObj: thisObj, complete: complete });
            }
            else if (undefined != item.data) {
                //加载完成了
                setTimeout(function () {
                    var event = rf.recyclable(rf.EventX);
                    event.type = 4 /* COMPLETE */;
                    event.data = item;
                    complete.call(thisObj, event);
                    event.recycle();
                }, 0);
            }
            else {
                //加载完成 但是404了
                setTimeout(function () {
                    var event = rf.recyclable(rf.EventX);
                    event.type = 3 /* FAILED */;
                    event.data = item;
                    complete.call(thisObj, event);
                    event.recycle();
                }, 0);
            }
            return item;
        };
        Res.prototype.loadNext = function () {
            var _a = this, nowLoader = _a.nowLoader, link = _a.link;
            var maxLoader = rf.res_max_loader;
            if (nowLoader >= maxLoader) {
                return;
            }
            while (nowLoader < maxLoader && link.length) {
                var item = link.shift();
                if (undefined == item) {
                    //全部没有了
                    break;
                }
                this.doLoad(item);
            }
        };
        Res.prototype.doLoad = function (item) {
            this.nowLoader++;
            item.states = 1 /* LOADING */;
            var loader = rf.recyclable(this._analyzerMap[item.type]);
            loader.loadFile(item, this.doLoadComplete, this);
        };
        Res.prototype.doLoadComplete = function (loader, event) {
            this.nowLoader--;
            loader.recycle();
            var item = event.data;
            item.preUseTime = rf.engineNow;
            item.states = event.data ? 2 /* COMPLETE */ : 3 /* FAILED */;
            item.complete.forEach(function (v, i) {
                if (v) {
                    v.complete.call(v.thisObj, event);
                }
            });
            item.complete = undefined;
            this.loadNext();
        };
        Res.prototype.gc = function (now) {
            var resMap = this.resMap;
            for (var url in resMap) {
                var item = resMap[url];
                if (!item.noDispose && undefined == item.complete) {
                    if (item.disposeTime < now - item.preUseTime) {
                        resMap[url] = undefined;
                    }
                }
            }
        };
        return Res;
    }());
    rf.Res = Res;
    /**
     * 资源数据
     */
    var ResItem = /** @class */ (function () {
        function ResItem() {
            this.states = 0;
        }
        ResItem.prototype.onRecycle = function () {
            this.name = this.complete = this.data = this.url = undefined;
            this.preUseTime = this.disposeTime = this.states = 0;
            this.noDispose = false;
        };
        return ResItem;
    }());
    rf.ResItem = ResItem;
    /**
     * 加载基类
     */
    var ResLoaderBase = /** @class */ (function () {
        function ResLoaderBase() {
        }
        ResLoaderBase.prototype.loadFile = function (resItem, compFunc, thisObject) {
            this._resItem = resItem;
            this._compFunc = compFunc;
            this._thisObject = thisObject;
        };
        return ResLoaderBase;
    }());
    rf.ResLoaderBase = ResLoaderBase;
    /**
     * 二进制加载
     */
    var ResBinLoader = /** @class */ (function (_super) {
        __extends(ResBinLoader, _super);
        function ResBinLoader() {
            var _this = _super.call(this) || this;
            var http = new rf.HttpRequest();
            _this._httpRequest = http;
            http.responseType = _this.getType();
            http.addEventListener(4 /* COMPLETE */, _this.onComplete, _this);
            http.addEventListener(16 /* IO_ERROR */, _this.onIOError, _this);
            return _this;
        }
        ResBinLoader.prototype.getType = function () {
            return 1 /* ARRAY_BUFFER */;
        };
        ResBinLoader.prototype.loadFile = function (resItem, compFunc, thisObject) {
            _super.prototype.loadFile.call(this, resItem, compFunc, thisObject);
            var http = this._httpRequest;
            http.abort();
            http.open(resItem.name, 0 /* GET */);
            http.send();
        };
        ResBinLoader.prototype.onComplete = function (event) {
            var _a = this, _resItem = _a._resItem, _compFunc = _a._compFunc, _thisObject = _a._thisObject, _httpRequest = _a._httpRequest;
            _resItem.data = _httpRequest.response;
            event.data = _resItem;
            this._resItem = this._compFunc = this._thisObject = undefined;
            if (undefined != _compFunc) {
                _compFunc.call(_thisObject, this, event);
            }
        };
        ResBinLoader.prototype.onIOError = function (event) {
            var _a = this, _resItem = _a._resItem, _compFunc = _a._compFunc, _thisObject = _a._thisObject, _httpRequest = _a._httpRequest;
            event.data = _resItem;
            this._resItem = this._compFunc = this._thisObject = undefined;
            if (_compFunc) {
                _compFunc.call(_thisObject, this, event);
            }
        };
        return ResBinLoader;
    }(ResLoaderBase));
    rf.ResBinLoader = ResBinLoader;
    /**
     * 文本加载
     */
    var ResTextLoader = /** @class */ (function (_super) {
        __extends(ResTextLoader, _super);
        function ResTextLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ResTextLoader.prototype.getType = function () {
            return 0 /* TEXT */;
        };
        ResTextLoader.prototype.onComplete = function (event) {
            var _a = this, _resItem = _a._resItem, _compFunc = _a._compFunc, _thisObject = _a._thisObject, _httpRequest = _a._httpRequest;
            _resItem.data = _httpRequest.response;
            event.data = _resItem;
            this._resItem = this._compFunc = this._thisObject = undefined;
            if (_compFunc) {
                _compFunc.call(_thisObject, this, event);
            }
        };
        return ResTextLoader;
    }(ResBinLoader));
    rf.ResTextLoader = ResTextLoader;
    /**
     * 音乐加载
     */
    var ResSoundLoader = /** @class */ (function (_super) {
        __extends(ResSoundLoader, _super);
        function ResSoundLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ResSoundLoader.prototype.onComplete = function (event) {
            var data = this._httpRequest.response;
            // TODO : 解码数据为 Sound 对象
            var sound;
            this._resItem.data = sound;
            event.data = this._resItem;
            var compFunc = this._compFunc;
            var thisObject = this._thisObject;
            this._resItem = this._compFunc = this._thisObject = undefined;
            if (compFunc) {
                compFunc.call(thisObject, this, event);
            }
        };
        return ResSoundLoader;
    }(ResBinLoader));
    rf.ResSoundLoader = ResSoundLoader;
    /**
     * 图片加载
     */
    var ResImageLoader = /** @class */ (function (_super) {
        __extends(ResImageLoader, _super);
        function ResImageLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ResImageLoader.prototype.loadFile = function (resItem, compFunc, thisObject) {
            var _this = this;
            var imageLoader = new rf.ImageLoader();
            imageLoader.addEventListener(4 /* COMPLETE */, function (e) {
                if (compFunc) {
                    resItem.data = imageLoader.data;
                    e.data = resItem;
                    compFunc.call(thisObject, _this, e);
                }
            }, this);
            imageLoader.addEventListener(16 /* IO_ERROR */, function (e) {
                if (compFunc) {
                    e.data = resItem;
                    compFunc.call(thisObject, _this, e);
                }
            }, this);
            imageLoader.load(resItem.name);
        };
        return ResImageLoader;
    }(ResLoaderBase));
    rf.ResImageLoader = ResImageLoader;
    var LoadTask = /** @class */ (function (_super) {
        __extends(LoadTask, _super);
        function LoadTask() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.queue = {};
            _this.total = 0;
            _this.progress = 0;
            return _this;
        }
        LoadTask.prototype.addBin = function (url) {
            var res = loadRes(url, this.complteHandler, this, 0 /* bin */);
            this.queue[url] = res;
            this.total++;
            return res;
        };
        LoadTask.prototype.addTxt = function (url) {
            var res = loadRes(url, this.complteHandler, this, 1 /* text */);
            this.queue[url] = res;
            this.total++;
            return res;
        };
        LoadTask.prototype.addImage = function (url) {
            var res = loadRes(url, this.complteHandler, this, 3 /* image */);
            this.queue[url] = res;
            this.total++;
            return res;
        };
        LoadTask.prototype.addTask = function (item) {
            this.queue[item.name] = item;
            this.total++;
            item.on(4 /* COMPLETE */, this.complteHandler, this);
        };
        LoadTask.prototype.complteHandler = function (event) {
            var item = event.data;
            if (item instanceof rf.MiniDispatcher) {
                item.off(4 /* COMPLETE */, this.complteHandler);
            }
            var queue = this.queue;
            var completeCount = 0;
            var totalCount = 0;
            for (var key in queue) {
                var item_2 = queue[key];
                if (item_2.states >= 2 /* COMPLETE */) {
                    completeCount++;
                }
                totalCount++;
            }
            this.progress = completeCount;
            this.total = totalCount;
            this.simpleDispatch(15 /* PROGRESS */, this);
            if (completeCount == totalCount) {
                this.simpleDispatch(4 /* COMPLETE */, this);
            }
        };
        LoadTask.prototype.onRecycle = function () {
            this.queue = {};
            this.progress = this.total = 0;
        };
        return LoadTask;
    }(rf.MiniDispatcher));
    rf.LoadTask = LoadTask;
})(rf || (rf = {}));
//# sourceMappingURL=Res.js.map