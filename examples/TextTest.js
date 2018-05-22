var rf;
(function (rf) {
    var TextTest = /** @class */ (function () {
        function TextTest() {
            var c = document.createElement("canvas");
            // c.style.cssText = "width:100px;height:100px";
            c.width = 200;
            c.height = 200;
            var ctx = c.getContext("2d");
            ctx.fillRect(0, 0, c.width, c.height);
            // ctx.putImageData()
            // ctx.drawImage()
            var getPixelRatio = function (context) {
                var backingStore = context.backingStorePixelRatio ||
                    context.webkitBackingStorePixelRatio ||
                    context.mozBackingStorePixelRatio ||
                    context.msBackingStorePixelRatio ||
                    context.oBackingStorePixelRatio ||
                    context.backingStorePixelRatio || 1;
                return (window.devicePixelRatio || 1) / backingStore;
            };
            var ratio = getPixelRatio(ctx);
            // ctx.scale(ratio,ratio);
            // alert(ctx.fillText);
            // 注意，这里的 width 和 height 变成了 width * ratio 和 height * ratio
            // ctx.drawImage(document.querySelector('img'), 0, 0, 300 * ratio, 90 * ratio);
            // ctx.font = "12px Microsoft YaHei";
            // ctx.fillText("你好啊"+ratio,0,24);
            // ctx.strokeText("你好啊",0,50);
            document.body.appendChild(c);
            ctx.font = '40pt Calibri';
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'green';
            ctx.strokeText('汪鸿海!', 20, 100);
            ctx.fillStyle = 'red';
            ctx.fillText('汪鸿海!', 20, 100);
            ctx.measureText("汪").width;
            // var d:TextMetrics=ctx.measureText("你");
            // alert(d.width)
        }
        return TextTest;
    }());
    rf.TextTest = TextTest;
})(rf || (rf = {}));
//# sourceMappingURL=TextTest.js.map