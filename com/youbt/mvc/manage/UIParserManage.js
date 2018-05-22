var rf;
(function (rf) {
    var UIParserManage = /** @class */ (function () {
        function UIParserManage() {
            //初始保存创建方法
            var funcs = {};
            funcs["btn"] = this.parserBtn;
            funcs["txt"] = this.parserTxt;
            funcs["ck"] = this.parserCk;
            funcs["rb"] = this.parserRb;
            this._funcs = funcs;
            funcs = null;
        }
        UIParserManage.prototype.parser = function (m, setting) {
            var keys = Object.keys(m);
            //根据setting 生成对应的组件 赋值给skin mediator
            var skin = m.skin;
            var source = skin.source;
            if (setting == undefined) {
                return;
            }
            var elements = setting.displayFrames[setting.displayClip];
            if (undefined == elements) {
                return;
            }
            var childsp;
            var _funcs = this._funcs;
            var names;
            for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                var ele = elements_1[_i];
                if (ele.name != undefined) {
                    names = ele.name.split("_");
                    if (names && names.length > 0) {
                        //这是有可能有组件的 找不到就直接默认形式
                        var typename = names[0];
                        var func = _funcs[typename];
                        if (func != undefined) {
                            childsp = func(ele, source);
                            skin.addChild(childsp);
                        }
                        else {
                            childsp = this.parserNormal(ele, source);
                            skin.addChild(childsp);
                        }
                        if (m.hasOwnProperty(ele.name)) {
                            m[ele.name] = childsp;
                        }
                    }
                }
                else {
                    childsp = this.parserNormal(ele, source);
                    skin.addChild(childsp);
                }
            }
        };
        UIParserManage.prototype.parserBtn = function (ele, source) {
            var btn = new rf.Button(source);
            btn.setSymbol(ele);
            return btn;
        };
        UIParserManage.prototype.parserTxt = function (ele, source) {
            var textElement = ele;
            var txtfield = rf.recyclable(rf.TextField);
            var e_format = textElement.format;
            var format = rf.recyclable(rf.TextFormat).init();
            format.size = e_format["size"] == undefined ? 12 : e_format["size"];
            format.align = e_format["alignment"] == undefined ? "left" : e_format["alignment"];
            txtfield.init(source, format);
            txtfield.color = textElement.color;
            txtfield.multiline = textElement.multiline;
            if (textElement.input) {
                txtfield.type = "input" /* INPUT */;
                txtfield.mouseEnabled = true;
            }
            else {
                txtfield.type = "dynamic" /* DYNAMIC */;
            }
            txtfield.setSize(textElement.width, textElement.height);
            txtfield.text = textElement.text;
            txtfield.x = ele.x;
            txtfield.y = ele.y;
            if (ele.name) {
                txtfield.name = ele.name;
            }
            return txtfield;
        };
        UIParserManage.prototype.parserCk = function (ele, source) {
            var btn = new rf.CheckBox(source);
            btn.setSymbol(ele);
            return btn;
        };
        UIParserManage.prototype.parserRb = function (ele, source) {
            return undefined;
        };
        UIParserManage.prototype.parserNormal = function (ele, source) {
            var sp;
            if (ele.rect) { //目前还没写9宫
                //sp = new ScaleRectSprite3D(source);
            }
            else {
                sp = new rf.Component(source);
            }
            sp.mouseEnabled = true;
            sp.x = ele.x;
            sp.y = ele.y;
            sp.setSymbol(ele);
            sp.name = ele.name;
            sp.setSize(Math.round(sp.w * ele.scaleX), Math.round(sp.h * ele.scaleY));
            return sp;
        };
        return UIParserManage;
    }());
    rf.UIParserManage = UIParserManage;
    rf.uiparser = rf.singleton(UIParserManage);
})(rf || (rf = {}));
//# sourceMappingURL=UIParserManage.js.map