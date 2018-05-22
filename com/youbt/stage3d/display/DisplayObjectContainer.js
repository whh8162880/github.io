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
///<reference path="./DisplayObject.ts" />
var rf;
(function (rf) {
    var DisplayObjectContainer = /** @class */ (function (_super) {
        __extends(DisplayObjectContainer, _super);
        function DisplayObjectContainer() {
            var _this = _super.call(this) || this;
            _this.childrens = [];
            return _this;
        }
        DisplayObjectContainer.prototype.setChange = function (value, p, c) {
            if (p === void 0) { p = 0; }
            if (c === void 0) { c = false; }
            if (true == c) {
                this.states |= p;
                if (this.parent) {
                    this.parent.setChange(value, p, true);
                }
            }
            else {
                _super.prototype.setChange.call(this, value);
            }
        };
        Object.defineProperty(DisplayObjectContainer.prototype, "numChildren", {
            get: function () {
                return this.childrens.length;
            },
            enumerable: true,
            configurable: true
        });
        DisplayObjectContainer.prototype.addChild = function (child) {
            if (undefined == child || child == this)
                return;
            var childrens = this.childrens;
            var i = childrens.indexOf(child);
            if (i == -1) {
                if (child.parent)
                    child.remove();
                childrens.push(child);
                child.parent = this;
                child.setChange(35 /* base */);
                if (this.stage) {
                    if (!child.stage) {
                        child.stage = this.stage;
                        child.addToStage();
                    }
                }
            }
            else {
                childrens.splice(i, 1);
                childrens.push(child);
            }
            //需要更新Transform
        };
        DisplayObjectContainer.prototype.addChildAt = function (child, index) {
            if (undefined == child || child == this)
                return;
            if (child.parent)
                child.remove();
            if (index < 0) {
                index = 0;
            }
            else if (index > this.childrens.length) {
                index = this.childrens.length;
            }
            this.childrens.splice(index, 0, child);
            child.parent = this;
            //需要更新Transform
            child.setChange(35 /* base */);
            if (this.stage) {
                if (!child.stage) {
                    child.stage = this.stage;
                    child.addToStage();
                }
            }
        };
        DisplayObjectContainer.prototype.getChildIndex = function (child) {
            return this.childrens.indexOf(child);
        };
        DisplayObjectContainer.prototype.removeChild = function (child) {
            if (undefined == child) {
                return;
            }
            var i = this.childrens.indexOf(child);
            if (i == -1) {
                return;
            }
            this.childrens.splice(i, 1);
            child.stage = undefined;
            child.parent = undefined;
            this.setChange(12 /* batch */);
            child.removeFromStage();
        };
        DisplayObjectContainer.prototype.removeAllChild = function () {
            var childrens = this.childrens;
            var len = childrens.length;
            for (var i = 0; i < len; i++) {
                var child = childrens[i];
                child.stage = undefined;
                child.parent = undefined;
                child.removeFromStage();
            }
            if (len > 0) {
                this.setChange(12 /* batch */);
            }
            this.childrens.length = 0;
        };
        DisplayObjectContainer.prototype.removeFromStage = function () {
            var childrens = this.childrens;
            var len = childrens.length;
            for (var i = 0; i < len; i++) {
                var child = childrens[i];
                child.stage = undefined;
                child.removeFromStage();
            }
            _super.prototype.removeFromStage.call(this);
        };
        DisplayObjectContainer.prototype.addToStage = function () {
            var _a = this, childrens = _a.childrens, stage = _a.stage;
            var len = childrens.length;
            for (var i = 0; i < len; i++) {
                var child = childrens[i];
                child.stage = stage;
                child.addToStage();
            }
            _super.prototype.addToStage.call(this);
        };
        /**
         * 讲真  这块更新逻辑还没有到最优化的结果 判断不会写了
         */
        DisplayObjectContainer.prototype.updateTransform = function () {
            var states = this.states;
            if (states & 1 /* trasnform */) {
                //如果自己的transform发生了变化
                //  step1 : 更新自己的transform
                //  step2 : 全部子集都要更新sceneTransform;
                _super.prototype.updateTransform.call(this);
                this.updateSceneTransform();
            }
            if (states & 2 /* alpha */) {
                this.updateAlpha(this.parent.sceneAlpha);
            }
            if (states & 16 /* ct */) {
                for (var _i = 0, _a = this.childrens; _i < _a.length; _i++) {
                    var child = _a[_i];
                    if (child instanceof DisplayObjectContainer) {
                        if (child.states & 19 /* t_all */) {
                            child.updateTransform();
                        }
                    }
                    else {
                        if (child.states & 1 /* trasnform */) {
                            child.updateTransform();
                            child.updateSceneTransform(this.sceneTransform);
                        }
                        if (child.states & 2 /* alpha */) {
                            child.updateAlpha(this.sceneAlpha);
                        }
                    }
                }
                this.states &= ~16 /* ct */;
            }
        };
        DisplayObjectContainer.prototype.updateSceneTransform = function () {
            this.sceneTransform.set(this.transform);
            if (this.parent)
                this.sceneTransform.m3_append(this.parent.sceneTransform);
            for (var _i = 0, _a = this.childrens; _i < _a.length; _i++) {
                var child = _a[_i];
                if ((child.states & 1 /* trasnform */) != 0) {
                    //这里不更新其transform 是因为后续有人来让其更新
                    child.updateSceneTransform(this.sceneTransform);
                }
            }
        };
        DisplayObjectContainer.prototype.updateAlpha = function (sceneAlpha) {
            this.sceneAlpha = sceneAlpha * this._alpha;
            for (var _i = 0, _a = this.childrens; _i < _a.length; _i++) {
                var child = _a[_i];
                child.updateAlpha(this.sceneAlpha);
            }
            this.states &= ~2 /* alpha */;
        };
        DisplayObjectContainer.prototype.updateHitArea = function () {
            var hitArea = this.hitArea;
            if (hitArea) {
                hitArea.clean();
                for (var _i = 0, _a = this.childrens; _i < _a.length; _i++) {
                    var child = _a[_i];
                    var hit = child.hitArea;
                    if (undefined == hit)
                        continue;
                    if (child.states & 96 /* ac */) {
                        child.updateHitArea();
                    }
                    hitArea.combine(hit, child._x, child._y);
                }
            }
            this.states &= ~96 /* ac */;
        };
        return DisplayObjectContainer;
    }(rf.DisplayObject));
    rf.DisplayObjectContainer = DisplayObjectContainer;
})(rf || (rf = {}));
//# sourceMappingURL=DisplayObjectContainer.js.map