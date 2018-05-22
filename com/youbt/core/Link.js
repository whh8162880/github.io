/// <reference path="./ClassUtils.ts" />
var rf;
(function (rf) {
    var LinkVO = /** @class */ (function () {
        function LinkVO() {
            this.close = true;
            this.data = undefined;
            this.args = undefined;
            this.next = undefined;
            this.pre = undefined;
            this.weight = 0;
        }
        LinkVO.prototype.onRecycle = function () {
            this.data = undefined;
            this.args = undefined;
            this.next = undefined;
            this.pre = undefined;
            this.weight = 0;
            this.close = true;
        };
        LinkVO.prototype.onSpawn = function () {
            this.close = false;
        };
        return LinkVO;
    }());
    rf.LinkVO = LinkVO;
    var Link = /** @class */ (function () {
        function Link() {
            this.last = undefined;
            this.first = undefined;
            this.id = undefined;
            this.length = 0;
            this.warningMax = 200;
            this.checkSameData = true;
        }
        Link.prototype.getFrist = function () {
            if (undefined == this.first)
                return undefined;
            var vo = this.first;
            while (vo) {
                if (false == vo.close) {
                    return vo;
                }
                vo = vo.next;
            }
            return undefined;
        };
        Link.prototype.getLast = function () {
            if (undefined == this.last)
                return undefined;
            var vo = this.last;
            while (vo) {
                if (false == vo.close) {
                    return vo;
                }
                vo = vo.pre;
            }
            return undefined;
        };
        Link.prototype.getValueLink = function (value) {
            var vo = this.getFrist();
            if (undefined == vo)
                return undefined;
            while (vo) {
                if (false == vo.close) {
                    if (value == vo.data) {
                        return vo;
                    }
                }
                vo = vo.next;
            }
            return undefined;
        };
        Link.prototype.add = function (value, args) {
            if (!value)
                return undefined;
            var vo;
            if (this.checkSameData) {
                vo = this.getValueLink(value);
                if (vo && vo.close == false)
                    return vo;
            }
            vo = rf.recyclable(LinkVO);
            vo.data = value;
            vo.args = args;
            this.length++;
            if (undefined == this.first) {
                this.first = this.last = vo;
            }
            else {
                vo.pre = this.last;
                this.last.next = vo;
                this.last = vo;
            }
            return vo;
        };
        Link.prototype.addByWeight = function (value, weight, args) {
            if (!value)
                return undefined;
            var vo;
            if (this.checkSameData) {
                vo = this.getValueLink(value);
                if (vo && vo.close == false) {
                    if (weight == vo.weight) {
                        return vo;
                    }
                    vo.close = true;
                }
            }
            vo = rf.recyclable(LinkVO);
            vo.weight = weight;
            vo.data = value;
            vo.args = args;
            this.length++;
            if (undefined == this.first) {
                this.first = this.last = vo;
            }
            else {
                var tempvo = this.getFrist();
                if (undefined == tempvo) {
                    vo.pre = this.last;
                    this.last.next = vo;
                    this.last = vo;
                }
                else {
                    while (tempvo) {
                        if (false == tempvo.close) {
                            if (tempvo.weight < weight) {
                                vo.next = tempvo;
                                vo.pre = tempvo.pre;
                                if (undefined != tempvo.pre) {
                                    tempvo.pre.next = vo;
                                }
                                tempvo.pre = vo;
                                if (tempvo == this.first) {
                                    this.first = vo;
                                }
                                break;
                            }
                        }
                        tempvo = tempvo.next;
                    }
                    if (undefined == tempvo) {
                        vo.pre = this.last;
                        this.last.next = vo;
                        this.last = vo;
                    }
                }
            }
            return vo;
        };
        Link.prototype.remove = function (value) {
            var vo = this.getValueLink(value);
            if (!vo)
                return;
            this.removeLink(vo);
        };
        Link.prototype.removeLink = function (vo) {
            this.length--;
            vo.close = true;
            vo.data = null;
            rf.TimerUtil.add(this.clean, 1000);
        };
        Link.prototype.clean = function () {
            var vo = this.first;
            var next;
            this.length = 0;
            while (vo) {
                next = vo.next;
                if (true == vo.close) {
                    if (vo == this.first) {
                        this.first = vo.next;
                        if (undefined != this.first) {
                            this.first.pre = undefined;
                        }
                    }
                    else {
                        vo.pre.next = vo.next;
                    }
                    if (vo == this.last) {
                        this.last = vo.pre;
                        if (undefined != this.last) {
                            this.last.next = undefined;
                        }
                    }
                    else {
                        vo.next.pre = vo.pre;
                    }
                    vo.recycle();
                }
                else {
                    this.length++;
                }
                vo = next;
            }
        };
        Link.prototype.pop = function () {
            var vo = this.getLast();
            if (vo) {
                var data = vo.data;
                this.removeLink(vo);
                return data;
            }
            return undefined;
        };
        Link.prototype.shift = function () {
            var vo = this.getFrist();
            if (vo) {
                var data = vo.data;
                this.removeLink(vo);
                return data;
            }
            return undefined;
        };
        Link.prototype.exec = function (f) {
            if (undefined == f)
                return;
            var vo = this.getFrist();
            while (vo) {
                var next = vo.next;
                if (false == vo.close) {
                    f(vo.data);
                }
                vo = vo.next;
            }
        };
        Link.prototype.onRecycle = function () {
            var vo = this.first;
            var next;
            while (vo) {
                next = vo.next;
                vo.recycle();
                vo = next;
            }
            this.first = this.last = undefined;
            this.length = 0;
            this.checkSameData = true;
        };
        Link.prototype.toString = function () {
            var vo = this.getFrist();
            var s = "list:";
            while (vo) {
                var next = vo.next;
                if (false == vo.close) {
                    s += vo.data + ",";
                }
                vo = vo.next;
            }
            return s;
        };
        return Link;
    }());
    rf.Link = Link;
})(rf || (rf = {}));
//# sourceMappingURL=Link.js.map