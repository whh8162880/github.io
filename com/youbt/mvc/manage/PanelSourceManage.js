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
///<reference path="../PanelSource.ts" />
var rf;
(function (rf) {
    var PanelSourceManage = /** @class */ (function () {
        function PanelSourceManage() {
            /**
             * 存储对象
             */
            this._localmap = {};
            this.all_res = {};
        }
        PanelSourceManage.prototype.load = function (url, uri) {
            var res = this.getres(url, uri);
            if (res.status == 0 /* WAIT */) {
                res.load(url);
            }
            return res;
        };
        PanelSourceManage.prototype.getres = function (url, uri) {
            var all_res = this.all_res;
            var res = all_res[uri];
            if (res == undefined) {
                var index = url.lastIndexOf(".");
                if (index == -1) {
                    return undefined;
                }
                res = new AsyncResource();
                all_res[uri] = res;
            }
            return res;
        };
        /**
         * 删除资源
         * @param name
         * @param vo
         *
         */
        PanelSourceManage.prototype.removeDefinition = function (name) {
            var _localmap = this._localmap;
            if (_localmap[name]) {
                _localmap[name] = null;
                delete _localmap[name];
            }
        };
        /**
         * 保存资源
         * @param resoucename
         * @param content
         *
         */
        PanelSourceManage.prototype.set = function (name, vo) {
            var _localmap = this._localmap;
            if (_localmap[name]) {
                throw new Error("重复" + name);
            }
            _localmap[name] = vo;
        };
        /**
         * 从指定的应用程序域获取一个公共定义。
         * @param resoucename
         * @param content
         *
         */
        PanelSourceManage.prototype.getDefinition = function (name) {
            var _localmap = this._localmap;
            return _localmap[name];
        };
        return PanelSourceManage;
    }());
    rf.PanelSourceManage = PanelSourceManage;
    rf.sourceManger = rf.singleton(PanelSourceManage);
    var AsyncResource = /** @class */ (function (_super) {
        __extends(AsyncResource, _super);
        function AsyncResource() {
            var _this = _super.call(this) || this;
            _this.status = 0;
            return _this;
        }
        AsyncResource.prototype.load = function (url) {
            this.status = 1 /* LOADING */;
            rf.loadRes(url, this.p3dloadComplete, this, 1 /* text */);
        };
        AsyncResource.prototype.p3dloadComplete = function (e) {
            if (e.type != 4 /* COMPLETE */) {
                this.status = 3 /* FAILED */;
                return;
            }
            var res = e.data;
            var o = JSON.parse(res.data);
            this.resourceComplete(o);
        };
        AsyncResource.prototype.resourceComplete = function (o) {
            //生成对应的模块 一次只有一个对象    
            //创建bitmapsource
            this.d_setting = o;
            //加载对应的图片资源
            var url = "../assets/" + o['image'] + '.png';
            rf.loadRes(url, this.onImageComplete, this, 3 /* image */);
        };
        AsyncResource.prototype.onImageComplete = function (e) {
            if (e.type != 4 /* COMPLETE */) {
                this.status = 3 /* FAILED */;
                return;
            }
            this.status = 2 /* COMPLETE */;
            var d_setting = this.d_setting;
            var res = e.data;
            var image = res.data;
            var bw = (d_setting['txtwidth'] >= image.width) ? d_setting['txtwidth'] : image.width;
            var bh = d_setting['txtheight'] + image.height;
            var bmd = new rf.BitmapData(bw, bh, true);
            bmd.draw(image);
            this.source = new rf.PanelSource();
            this.source.create(d_setting['image'], bmd, true);
            var vo = this.source.setSourceVO("panelimg", image.width, image.height, 1);
            // this.source.bmd.context.drawImage(image,vo.x,vo.y);
            var objkeys = Object.keys(d_setting['frames']);
            var areavo = this.source.areas[1];
            var bitvo;
            var frameObj;
            for (var _i = 0, objkeys_1 = objkeys; _i < objkeys_1.length; _i++) {
                var key = objkeys_1[_i];
                frameObj = d_setting['frames'][key];
                bitvo = areavo.createFrameArea(key, { x: frameObj['ox'], y: frameObj['oy'], w: frameObj['width'], h: frameObj['height'], ix: frameObj['ix'], iy: frameObj['iy'] });
                bitvo.refreshUV(this.source.width, this.source.height);
            }
            this.source.isReady = true;
            this.setting = d_setting["symbols"];
            objkeys = Object.keys(this.setting);
            for (var _a = 0, objkeys_2 = objkeys; _a < objkeys_2.length; _a++) {
                var key = objkeys_2[_a];
                rf.sourceManger.set(key, this.setting[key]);
            }
            this.simpleDispatch(4 /* COMPLETE */);
        };
        return AsyncResource;
    }(rf.MiniDispatcher));
    rf.AsyncResource = AsyncResource;
})(rf || (rf = {}));
//# sourceMappingURL=PanelSourceManage.js.map