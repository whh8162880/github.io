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
/// <reference path="../stage3d/display/Component.ts" />
var rf;
(function (rf) {
    var List = /** @class */ (function (_super) {
        __extends(List, _super);
        function List(option, source) {
            var _this = _super.call(this, source) || this;
            _this.selectedIndex = -1;
            _this.option = option;
            return _this;
        }
        List.prototype.init = function (Clazz, itemWidth, itemheight, vertical, columnCount) {
            if (vertical === void 0) { vertical = true; }
            if (columnCount === void 0) { columnCount = -1; }
            this.option = { itemWidth: itemWidth, itemHeight: itemheight, vertical: vertical, columnCount: columnCount, clazz: Clazz };
            return this;
        };
        List.prototype.displayList = function (data) {
            this.selectedIndex = -1;
        };
        return List;
    }(rf.Component));
    rf.List = List;
})(rf || (rf = {}));
//# sourceMappingURL=List.js.map