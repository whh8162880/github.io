/// <reference path="./Extend.ts" />
var rf;
(function (rf) {
    rf.stageWidth = 0;
    rf.stageHeight = 0;
    rf.isWindowResized = false;
    rf.max_vc = 100;
    rf.c_white = "rgba(255,255,255,255)";
    rf.pixelRatio = 2;
    function isPowerOfTwo(n) {
        return (n !== 0) && ((n & (n - 1)) === 0);
    }
    rf.isPowerOfTwo = isPowerOfTwo;
})(rf || (rf = {}));
//# sourceMappingURL=Config.js.map