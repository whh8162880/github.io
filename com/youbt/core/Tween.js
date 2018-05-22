var rf;
(function (rf) {
    //===========================================================================================
    // Tweener
    //===========================================================================================
    function defaultEasingFunction(t, b, c, d) {
        return c * t / d + b;
    }
    rf.defaultEasingFunction = defaultEasingFunction;
    rf.tweenLink = new rf.Link();
    function createTweener(eo, duration, tm, target, ease, so) {
        var tweener = { data: [], caster: target, tm: tm, st: tm.now, ease: ease ? ease : defaultEasingFunction, duration: duration };
        var data = tweener.data;
        var l = 0, e = 0, d = 0, s = 0;
        for (var k in eo) {
            if (target) {
                s = target[k];
                if (undefined != s) {
                    s = (so && undefined != so[k]) ? so[k] : s;
                }
                else {
                    s = 0;
                }
            }
            else {
                s = (so && undefined != so[k]) ? so[k] : 0;
            }
            e = eo[k];
            data[l++] = { k: k, s: s, e: e, d: e - s, n: 0 };
        }
        tweener.l = l;
        return tweener;
    }
    rf.createTweener = createTweener;
    function tweenTo(eo, duration, tm, target, ease, so) {
        var tweener = createTweener(eo, duration, tm, target, ease, so);
        if (tweener.l > 0) {
            rf.tweenLink.add(tweener);
        }
        return tweener;
    }
    rf.tweenTo = tweenTo;
    function tweenUpdate() {
        for (var vo = rf.tweenLink.getFrist(); vo; vo = vo.next) {
            if (vo.close == false) {
                var tweener = vo.data;
                var caster = tweener.caster, l = tweener.l, data = tweener.data, ease = tweener.ease, tm = tweener.tm, st = tweener.st, duration = tweener.duration, update = tweener.update, thisObj = tweener.thisObj;
                var now = tm.now - st;
                if (now >= duration) {
                    tweenEnd(tweener);
                }
                else {
                    for (var i = 0; i < l; i++) {
                        var item = data[i];
                        var k = item.k, s = item.s, d = item.d; //data[i];
                        item.n = ease(now, s, d, duration);
                        if (caster) {
                            caster[k] = item.n;
                        }
                    }
                    if (undefined != update) {
                        update.call(thisObj, tweener);
                    }
                }
            }
        }
    }
    rf.tweenUpdate = tweenUpdate;
    function tweenEnd(tweener) {
        if (tweener.completed)
            return;
        var _a = tweener, caster = _a.caster, l = _a.l, data = _a.data, complete = _a.complete, thisObj = _a.thisObj;
        for (var i = 0; i < l; i++) {
            var item = data[i];
            var k = item.k, e = item.e;
            item.n = e;
            if (caster) {
                caster[k] = e;
            }
        }
        if (undefined != complete) {
            complete.call(thisObj, tweener);
        }
        rf.tweenLink.remove(tweener);
        tweener.completed = true;
    }
    rf.tweenEnd = tweenEnd;
    function tweenStop(tweener) {
        if (tweener.completed)
            return;
        rf.tweenLink.remove(tweener);
        tweener.completed = true;
    }
    rf.tweenStop = tweenStop;
})(rf || (rf = {}));
//# sourceMappingURL=Tween.js.map