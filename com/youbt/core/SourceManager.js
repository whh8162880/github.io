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
    var BitmapSourceVO = /** @class */ (function () {
        function BitmapSourceVO() {
            this.name = undefined;
            this.used = 0;
            this.time = 0;
            this.source = undefined;
            this.x = 0;
            this.y = 0;
            this.ix = 0;
            this.iy = 0;
            this.w = 0;
            this.h = 0;
            this.rw = 0;
            this.rh = 0;
            this.ul = 0;
            this.ur = 0;
            this.vt = 0;
            this.vb = 0;
            // dispose():void{
            //     this.x = this.y = this.w = this.h = this.ix = this.iy = this.rw = this.rh = 0;
            //     this.name = undefined;
            //     this.used = this.time = 0;
            // }
        }
        BitmapSourceVO.prototype.refreshUV = function (mw, mh) {
            var _a = this, x = _a.x, y = _a.y, w = _a.w, h = _a.h;
            this.ul = x / mw;
            this.ur = (x + w) / mw;
            this.vt = y / mh;
            this.vb = (y + h) / mh;
        };
        return BitmapSourceVO;
    }());
    rf.BitmapSourceVO = BitmapSourceVO;
    var BitmapSourceArea = /** @class */ (function () {
        function BitmapSourceArea() {
            this.name = 0;
            this.source = undefined;
            this.frames = {};
        }
        BitmapSourceArea.prototype.init = function () { };
        BitmapSourceArea.prototype.getArea = function (name, x, y, w, h) {
            var vo = new BitmapSourceVO();
            vo.name = name;
            vo.x = x;
            vo.y = y;
            vo.w = vo.rw = w;
            vo.h = vo.rh = h;
            vo.source = this.source;
            this.frames[name] = vo;
            return vo;
        };
        BitmapSourceArea.prototype.createFrameArea = function (name, frame) {
            var x = frame.x, y = frame.y, w = frame.w, h = frame.h, ix = frame.ix, iy = frame.iy;
            var vo = this.getArea(name, ix - x, iy - y, w, h);
            if (undefined != vo) {
                vo.ix = ix;
                vo.iy = iy;
            }
            return vo;
        };
        BitmapSourceArea.prototype.getEmptyArea = function (name, sw, sh) {
            return undefined;
        };
        BitmapSourceArea.prototype.getUnusedArea = function (name, sw, sh) {
            var frames = this.frames;
            var vo;
            for (var name_1 in frames) {
                vo = frames[name_1];
                if (undefined == vo)
                    continue;
                if (0 >= vo.used && sw < vo.rw && sh < vo.rh) {
                    frames[vo.name] = undefined;
                    vo.name = name_1;
                    vo.w = sw;
                    vo.h = sh;
                    frames[name_1] = vo;
                    break;
                }
            }
            return vo;
        };
        return BitmapSourceArea;
    }());
    rf.BitmapSourceArea = BitmapSourceArea;
    var MixBitmapSourceArea = /** @class */ (function (_super) {
        __extends(MixBitmapSourceArea, _super);
        function MixBitmapSourceArea() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MixBitmapSourceArea.prototype.init = function () {
            this.maxRect = new rf.MaxRectsBinPack(this.r - this.l, this.b - this.t);
        };
        MixBitmapSourceArea.prototype.getEmptyArea = function (name, sw, sh) {
            var rect = this.maxRect.insert(sw, sh);
            var vo;
            if (rect.w != 0) {
                vo = this.getArea(name, rect.x + this.l, rect.y + this.t, sw, sh);
            }
            else {
                vo = this.getUnusedArea(name, sw, sh);
            }
            return vo;
        };
        return MixBitmapSourceArea;
    }(BitmapSourceArea));
    rf.MixBitmapSourceArea = MixBitmapSourceArea;
    var BitmapSource = /** @class */ (function (_super) {
        __extends(BitmapSource, _super);
        function BitmapSource() {
            var _this = _super.call(this) || this;
            _this.name = undefined;
            _this.width = 0;
            _this.height = 0;
            _this.originU = 0;
            _this.originV = 0;
            _this.areas = undefined;
            return _this;
        }
        BitmapSource.prototype.create = function (name, bmd, pack) {
            if (pack === void 0) { pack = false; }
            this.name = name;
            this.areas = {};
            this.bmd = bmd;
            this.width = bmd.width;
            this.height = bmd.height;
            if (pack == false) {
                this.setArea(0, 0, 0, this.width, this.height);
            }
            else {
                this.areas[0] = this.setArea(1, 0, 0, this.width, this.height);
            }
            rf.bitmapSources[name] = this;
            return this;
        };
        BitmapSource.prototype.setArea = function (name, x, y, w, h) {
            var area = this.areas[name];
            if (undefined == area) {
                if (1 == name) {
                    var mix = new MixBitmapSourceArea();
                    mix.l = x;
                    mix.t = y;
                    mix.r = x + w;
                    mix.b = y + h;
                    area = mix;
                }
                else {
                    area = new BitmapSourceArea();
                }
            }
            else {
                rf.ThrowError("area exist");
                return area;
            }
            area.source = this;
            area.name = name;
            area.init();
            this.areas[name] = area;
            return area;
        };
        BitmapSource.prototype.setSourceVO = function (name, w, h, area) {
            if (area === void 0) { area = 1; }
            var barea = this.areas[area];
            if (undefined == barea) {
                return undefined;
            }
            var vo = barea.getEmptyArea(name, w, h);
            vo.refreshUV(this.width, this.height);
            return vo;
        };
        BitmapSource.prototype.getSourceVO = function (name, area) {
            if (area === void 0) { area = 0; }
            var barea = this.areas[area];
            if (undefined == barea) {
                return undefined;
            }
            return barea.frames[name];
        };
        BitmapSource.prototype.drawimg = function (img, x, y, w, h) {
            var _a = this, bmd = _a.bmd, name = _a.name, textureData = _a.textureData;
            if (w == undefined && h == undefined) {
                bmd.context.drawImage(img, x, y);
            }
            else {
                bmd.context.drawImage(img, x, y, w, h);
            }
            var texture = rf.context3D.textureObj[textureData.key];
            if (undefined != texture) {
                texture.readly = false;
            }
        };
        BitmapSource.DEFAULT = 0;
        BitmapSource.PACK = 1;
        return BitmapSource;
    }(rf.MiniDispatcher));
    rf.BitmapSource = BitmapSource;
    rf.bitmapSources = {};
})(rf || (rf = {}));
//# sourceMappingURL=SourceManager.js.map