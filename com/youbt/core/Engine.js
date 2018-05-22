/// <reference path="./ClassUtils.ts" />
/// <reference path="./Link.ts" />
/// <reference path="./MiniDispatcher.ts" />
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
    var EngineEvent = /** @class */ (function () {
        function EngineEvent() {
        }
        EngineEvent.VISIBILITY_CHANGE = 'visibility_change';
        EngineEvent.FPS_CHANGE = 'FPS_CHANGE';
        return EngineEvent;
    }());
    rf.EngineEvent = EngineEvent;
    function newTimeMixer(now, speed) {
        if (now === void 0) { now = 0; }
        if (speed === void 0) { speed = 1; }
        return { now: now, speed: speed };
    }
    rf.newTimeMixer = newTimeMixer;
    function tm_add(t, interval) {
        t.interval = interval * t.speed;
        t.now += t.interval;
        return t.now;
    }
    rf.tm_add = tm_add;
    rf.nativeMouseX = 0;
    rf.nativeMouseY = 0;
    rf.nextUpdateTime = 0;
    rf.frameInterval = 0;
    //当前程序运行了多长时间
    rf.engineNow = 0;
    rf.serverTime = 0;
    var _sharedDate = new Date();
    var _utcOffset = -_sharedDate.getTimezoneOffset() * 60000 /* ONE_MINUTE */;
    function getUTCTime(time) {
        return time + _utcOffset;
    }
    rf.getUTCTime = getUTCTime;
    function getFormatTime(time, format, isRaw) {
        if (isRaw === void 0) { isRaw = true; }
        if (isRaw) {
            time = this.getUTCTime(time);
        }
        _sharedDate.setTime(time);
        return _sharedDate.format(format);
    }
    rf.getFormatTime = getFormatTime;
    rf.getT = window.performance ? performance.now.bind(performance) : Date.now;
    rf.defaultTimeMixer = newTimeMixer(0.0, 1.0);
    // export let engie_animation_request:Function = undefined;
    var Engine = /** @class */ (function () {
        function Engine() {
        }
        Engine.start = function () {
            Engine.startTime = rf.getT();
            rf.engineNow = 0;
            Engine.frameRate = Engine._frameRate;
            rf.nextUpdateTime = Engine.startTime + rf.frameInterval;
            Engine._nextProfileTime = Engine.startTime + 1000;
            //动画ENTER_FRAME;
            var animationRequest = window['requestAnimationFrame'] ||
                window['webkitRequestAnimationFrame'] ||
                window['mozRequestAnimationFrame'] ||
                window['oRequestAnimationFrame'] ||
                window['msRequestAnimationFrame'];
            function onAnimationChange() {
                animationRequest(onAnimationChange);
                var time = rf.getT();
                if (time < rf.nextUpdateTime) {
                    return;
                }
                var now = time - Engine.startTime;
                var interval = (Engine.interval = now - rf.engineNow);
                rf.defaultTimeMixer.now = now;
                rf.defaultTimeMixer.interval = interval;
                rf.nextUpdateTime += rf.frameInterval;
                rf.engineNow = now;
                Engine.update(now, interval);
                Engine.profile();
            }
            animationRequest(onAnimationChange);
            //resize
            window.onresize = function () {
                rf.isWindowResized = true;
            };
            rf.stageWidth = window.innerWidth * rf.pixelRatio;
            rf.stageHeight = window.innerHeight * rf.pixelRatio;
            //窗口最大化最小化监听
            var hidden, state, visibilityChange;
            if (typeof document['hidden'] !== 'undefined') {
                hidden = 'hidden';
                visibilityChange = 'visibilitychange';
                state = 'visibilityState';
            }
            else if (typeof document['mozHidden'] !== 'undefined') {
                hidden = 'mozHidden';
                visibilityChange = 'mozvisibilitychange';
                state = 'mozVisibilityState';
            }
            else if (typeof document['msHidden'] !== 'undefined') {
                hidden = 'msHidden';
                visibilityChange = 'msvisibilitychange';
                state = 'msVisibilityState';
            }
            else if (typeof document['webkitHidden'] !== 'undefined') {
                hidden = 'webkitHidden';
                visibilityChange = 'webkitvisibilitychange';
                state = 'webkitVisibilityState';
            }
            document.addEventListener(visibilityChange, function () {
                var stateDesc = document[state];
                var hidden = stateDesc.toLocaleLowerCase().indexOf('hidden') != -1;
                Engine.hidden = hidden;
                if (hidden) {
                    Engine.hiddenTime = Date.now();
                }
                else {
                    if (0 != Engine.hiddenTime) {
                        var delayTime = Date.now() - Engine.hiddenTime;
                        Engine.startTime += delayTime;
                        Engine._nextProfileTime += delayTime;
                        rf.nextUpdateTime += delayTime;
                        Engine.hiddenTime = 0;
                    }
                }
                rf.ROOT.simpleDispatch(EngineEvent.VISIBILITY_CHANGE, hidden);
            }, false);
        };
        Engine.addResize = function (value) {
            Engine.resizeLink.add(value);
            value.resize(rf.stageWidth, rf.stageHeight);
        };
        Engine.removeResize = function (value) {
            Engine.resizeLink.remove(value);
        };
        Engine.resize = function (width, height) {
            //todo other
            var vo = Engine.resizeLink.getFrist();
            while (vo) {
                var next = vo.next;
                if (false == vo.close) {
                    var value = vo.data;
                    value.resize(width, height);
                }
                vo = next;
            }
            rf.ROOT.simpleDispatch(2 /* RESIZE */);
        };
        Engine.addTick = function (tick) {
            Engine.ticklink.add(tick);
        };
        Engine.removeTick = function (tick) {
            Engine.ticklink.remove(tick);
        };
        Engine.update = function (now, interval) {
            if (rf.isWindowResized) {
                rf.isWindowResized = false;
                rf.stageWidth = window.innerWidth * rf.pixelRatio;
                rf.stageHeight = window.innerHeight * rf.pixelRatio;
                Engine.resize(rf.stageWidth, rf.stageHeight);
            }
            var vo = Engine.ticklink.getFrist();
            while (vo) {
                var next = vo.next;
                if (false == vo.close) {
                    var tick = vo.data;
                    tick.update(now, interval);
                }
                vo = next;
            }
            rf.ROOT.simpleDispatch(1 /* ENTER_FRAME */);
        };
        Object.defineProperty(Engine, "frameRate", {
            get: function () {
                return Engine._frameRate;
            },
            set: function (value) {
                Engine._frameRate = value;
                rf.frameInterval = 1000 / value;
            },
            enumerable: true,
            configurable: true
        });
        Engine.profile = function () {
            var now = rf.getT();
            Engine._fpsCount++;
            Engine._codeTime += now - Engine.startTime - rf.engineNow;
            if (now > Engine._nextProfileTime) {
                Engine._nextProfileTime += 1000;
                Engine.fps = Engine._fpsCount;
                Engine.code = Engine._codeTime;
                Engine._fpsCount = 0;
                Engine._codeTime = 0;
                rf.ROOT.simpleDispatch(EngineEvent.FPS_CHANGE);
            }
        };
        //当前程序开始时间
        Engine.startTime = 0;
        //上一帧到本帧间隔时间
        Engine.interval = 0;
        //窗口是否最小化
        Engine.hidden = false;
        //窗口最小化开始时间
        Engine.hiddenTime = 0;
        //一秒内刷新次数
        Engine.fps = 0;
        //一秒内执行代码使用时间
        Engine.code = 0;
        Engine.ticklink = new rf.Link();
        Engine.resizeLink = new rf.Link();
        Engine._frameRate = 60;
        Engine._nextProfileTime = 0;
        Engine._fpsCount = 0;
        Engine._codeTime = 0;
        return Engine;
    }());
    rf.Engine = Engine;
    function getTimer() {
        return Date.now() - Engine.startTime;
    }
    rf.getTimer = getTimer;
    var TimerEventX = /** @class */ (function (_super) {
        __extends(TimerEventX, _super);
        function TimerEventX() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TimerEventX.TIMER = 'timer';
        TimerEventX.TIMER_COMPLETE = 'timerComplete';
        return TimerEventX;
    }(rf.EventX));
    rf.TimerEventX = TimerEventX;
    var Timer = /** @class */ (function (_super) {
        __extends(Timer, _super);
        function Timer(delay, repeatCount) {
            if (repeatCount === void 0) { repeatCount = 0; }
            var _this = _super.call(this) || this;
            _this._delay = 0;
            _this.currnetTime = 0;
            _this.repeatCount = 0;
            _this.running = false;
            _this.delay = delay;
            _this.repeatCount = repeatCount;
            return _this;
        }
        Object.defineProperty(Timer.prototype, "delay", {
            get: function () {
                return this._delay;
            },
            set: function (value) {
                if (value < 1) {
                    value = 1;
                }
                if (this._delay == value) {
                    return;
                }
                this._delay = value;
            },
            enumerable: true,
            configurable: true
        });
        Timer.prototype.start = function () {
            this.currnetTime = 0;
            Engine.addTick(this);
        };
        Timer.prototype.stop = function () {
            Engine.removeTick(this);
            this.currnetTime = 0;
            this._delay = 0;
            this.repeatCount = 0;
        };
        Timer.prototype.update = function (now, interval) {
            this.currnetTime += interval;
            if (this.currnetTime >= this._delay) {
                this.simpleDispatch(TimerEventX.TIMER);
                this.currnetTime = this.currnetTime % this._delay;
            }
            if (this.repeatCount > 0) {
                this.repeatCount--;
                if (this.repeatCount <= 0) {
                    this.simpleDispatch(TimerEventX.TIMER_COMPLETE);
                    this.stop();
                }
            }
        };
        return Timer;
    }(rf.MiniDispatcher));
    rf.Timer = Timer;
    var GTimer = /** @class */ (function () {
        function GTimer(delay) {
            this.link = new rf.Link();
            this.timer = new Timer(delay);
            this.timer.addEventListener(TimerEventX.TIMER, this.timerHandler, this);
        }
        GTimer.prototype.timerHandler = function (event) {
            var vo = this.link.getFrist();
            while (vo) {
                var next = vo.next;
                if (false == vo.close) {
                    var func = vo.data;
                    if (undefined != vo.args) {
                        func(vo.args);
                    }
                    else {
                        func();
                    }
                }
                vo = next;
            }
        };
        GTimer.prototype.add = function (func, args) {
            var vo = this.link.add(func, args);
            this.timer.start();
            return vo;
        };
        GTimer.prototype.remove = function (func) {
            this.link.remove(func);
            if (!this.link.length) {
                this.timer.stop();
            }
        };
        return GTimer;
    }());
    rf.GTimer = GTimer;
    var GTimerCallLater = /** @class */ (function (_super) {
        __extends(GTimerCallLater, _super);
        function GTimerCallLater() {
            return _super.call(this, 10) || this;
            //this.link.checkSameData = false;
        }
        GTimerCallLater.prototype.later = function (f, time, args) {
            if (undefined == f) {
                return;
            }
            _super.prototype.add.call(this, f, args).weight = rf.engineNow + time;
        };
        GTimerCallLater.prototype.add = function (func, args) {
            return undefined;
        };
        GTimerCallLater.prototype.timerHandler = function (event) {
            var now = rf.engineNow;
            var vo = this.link.getFrist();
            while (vo) {
                var next = vo.next;
                if (false == vo.close) {
                    if (now > vo.weight) {
                        var func = vo.data;
                        func.apply(this, vo.args);
                        vo.close = true;
                    }
                }
                vo = next;
            }
        };
        return GTimerCallLater;
    }(GTimer));
    var TimerUtil = /** @class */ (function () {
        function TimerUtil() {
        }
        TimerUtil.getTimer = function (time) {
            var gtimer = TimerUtil.timeobj[time];
            if (undefined == gtimer) {
                TimerUtil.timeobj[time] = gtimer = new GTimer(time);
            }
            return gtimer;
        };
        TimerUtil.add = function (f, time) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            TimerUtil.later.later(f, time, args);
        };
        TimerUtil.remove = function (f) {
            TimerUtil.later.remove(f);
        };
        TimerUtil.timeobj = {};
        TimerUtil.time250 = TimerUtil.getTimer(250);
        TimerUtil.time500 = TimerUtil.getTimer(500);
        TimerUtil.time1000 = TimerUtil.getTimer(1000);
        TimerUtil.time3000 = TimerUtil.getTimer(3000);
        TimerUtil.time4000 = TimerUtil.getTimer(4000);
        TimerUtil.time5000 = TimerUtil.getTimer(5000);
        TimerUtil.later = new GTimerCallLater();
        return TimerUtil;
    }());
    rf.TimerUtil = TimerUtil;
})(rf || (rf = {}));
//# sourceMappingURL=Engine.js.map