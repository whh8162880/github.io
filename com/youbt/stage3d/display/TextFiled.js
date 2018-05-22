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
///<reference path="./Sprite.ts" />
var rf;
(function (rf) {
    var TextEditor = /** @class */ (function (_super) {
        __extends(TextEditor, _super);
        function TextEditor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //将需要编辑的textfiled传递进来
        //根据样式生成对应的页面input
        //input编辑完成后失去焦点及更新原有的textfiled
        //
        //
        //根据文本是否是多行文本 单行使用input多行使用textarea
        //新建文本容器 文本容器使用rect进行裁剪
        //根据文本确定宽高 属性
        //
        TextEditor.prototype.init = function () {
            var self = this;
            var inputele;
            var div = document.createElement("div");
            div.setAttribute("id", "edittxt");
            div.style.opacity = "0";
            self._defaultValue(div);
            self._inputdiv = div;
            document.body.appendChild(div);
            //创建html textarea 将文本属性赋值
            inputele = document.createElement("input");
            self._defaultValue(inputele);
            self._defaultTxt(inputele);
            self._input = inputele;
            div.appendChild(inputele);
            inputele.type = "text";
            inputele = document.createElement("textarea");
            inputele.style["resize"] = "none";
            self._defaultValue(inputele);
            self._defaultTxt(inputele);
            self._area = inputele;
            div.appendChild(inputele);
        };
        TextEditor.prototype.setTextfiled = function (text) {
            var self = this;
            if (self._inputdiv == undefined) {
                this.init();
            }
            if (self._text != undefined) {
                this.blurHandler();
            }
            if (text == undefined) {
                return;
            }
            self._text = text;
            //根据传递进来的textfiled选择对应的输入
            var inpunt = text.multiline ? this._area : this._input;
            self._current = inpunt;
            this.updateinfo(); //更新文本的父对象宽高和坐标 文本信息
        };
        TextEditor.prototype.updateinfo = function () {
            var self = this;
            var _text = self._text;
            var _inputdiv = self._inputdiv;
            var _current = self._current;
            var lineheight = _text.lineheight;
            var tw = _text.w;
            var th = _text.h < lineheight ? lineheight : _text.h;
            _inputdiv.style.opacity = "1";
            _inputdiv.style.width = tw + "px";
            _inputdiv.style.height = th + "px";
            _inputdiv.style.left = _text.sceneTransform[12] + "px";
            _inputdiv.style.top = _text.sceneTransform[13] + "px";
            _inputdiv.style.clip = "rect(0px," + tw + "px," + th + "px, 0px)"; //rect(top,right,bottom,left)
            //需要设置字体 颜色 字体大小 默认值 
            //传递进来的textfiled需要不显示
            //需要正确计算出位置 需要赋值间距
            var format = _text.format;
            _current.style.width = tw + "px";
            _current.style.height = th + "px";
            _current.style.top = "0px";
            if (_text.maxChars != undefined) {
                _current.setAttribute("maxlength", _text.maxChars);
            }
            else {
                _current.removeAttribute("maxlength");
            }
            _current.style["text-align"] = format.align;
            _current.style.color = format.getColorStr(_text.color);
            _current.style.font = format.font;
            _current.style["letter-spacing"] = "1px";
            // _current.style.lineheight = "2em";//lineheight + "px";
            _current.value = _text.$text;
            if (_current.onblur == undefined) {
                _current.onblur = this.blurHandler.bind(this);
            }
            _current.selectionStart = _current.value.length;
            _current.selectionEnd = _current.value.length;
            setTimeout(function () {
                _current.focus();
            }, 20);
        };
        TextEditor.prototype._defaultValue = function (ele) {
            ele.style.position = "absolute";
            ele.style.left = "0px";
            ele.style.top = "-300px";
            ele.style.border = "none";
            ele.style.padding = "0";
            ele.style.width = "0px";
            ele.style.height = "0px";
        };
        TextEditor.prototype._defaultTxt = function (ele) {
            ele.setAttribute("tabindex", "-1"); //关闭tab切换
            ele.style.outline = "thin";
            ele.style.background = "none";
            ele.style.color = "#ffffff";
            ele.style.overflow = "hidden";
            ele.style.wordBreak = "break-all";
        };
        TextEditor.prototype.blurHandler = function () {
            var self = this;
            //抛出事件 更新文本
            this.dispatchEvent(new rf.EventX("onblur", self._current.value));
            self._inputdiv.style.opacity = "0";
            self._inputdiv.style.top = "-300px";
            self._inputdiv.style.width = "0px";
            self._inputdiv.style.height = "0px";
            self._current.style.width = "0px";
            self._current.style.height = "0px";
            self._current.onblur = null;
            self._current.maxlength = 0;
            self._current.value = "";
            self._current.style.top = "-300px";
            self._current = null;
            self._text = null;
        };
        return TextEditor;
    }(rf.MiniDispatcher));
    rf.TextEditor = TextEditor;
    var txtedit = new TextEditor();
    rf.emote_images = {};
    ;
    var TextFormat = /** @class */ (function () {
        function TextFormat() {
            this.family = "微软雅黑";
            this.oy = 0.25;
            this.size = 15;
            //"align":"left";
            this.align = "left";
            // "bold " : "normal "
            this.bold = "normal";
            // "italic " : "normal "
            this.italic = "normal";
        }
        TextFormat.prototype.init = function () {
            this.oy = 0.25 * (this.size + 1);
            this.font = this.bold + " " + this.italic + " " + this.size + "px " + this.family;
            return this;
        };
        TextFormat.prototype.test = function (context, text, out) {
            var _a = this, family = _a.family, size = _a.size, bold = _a.bold, italic = _a.italic;
            //设置字体
            context.font = this.font;
            out.x = context.measureText(text).width + 1;
            out.y = size + this.oy;
            if (this.stroke) {
                out.x += this.stroke.size * 2;
                out.y += this.stroke.size * 2;
            }
            if (this.shadow) {
                out.x += this.shadow.blur * 2 + Math.abs(this.shadow.offsetX || 0);
                out.y += this.shadow.blur * 2 + Math.abs(this.shadow.offsetY || 0);
            }
        };
        TextFormat.prototype.draw = function (context, text, s) {
            var x = s.x, y = s.y, w = s.w, h = s.h;
            var _a = this, oy = _a.oy, family = _a.family, size = _a.size, bold = _a.bold, italic = _a.italic, stroke = _a.stroke, shadow = _a.shadow, gradient = _a.gradient, align = _a.align;
            //设置字体
            context.font = this.font;
            //只有一个渐变色则文字颜色为渐变色
            if (gradient && gradient.length == 1) {
                context.fillStyle = this.getColorStr(gradient[0].color);
            }
            //有多个渐变色
            else if (gradient && gradient.length > 1) {
                var style = context.createLinearGradient(x, y - h, x, y + h);
                for (var _i = 0, gradient_1 = gradient; _i < gradient_1.length; _i++) {
                    var g = gradient_1[_i];
                    var v = g.percent || 0;
                    var c = this.getColorStr(g.color);
                    style.addColorStop(v, c);
                }
                context.fillStyle = style;
            }
            //如果只是文字 没渐变色 那文字颜色永远用白色;
            else {
                context.fillStyle = rf.c_white;
            }
            //阴影
            if (shadow) {
                context.shadowColor = this.getColorStr(shadow.color);
                context.shadowBlur = shadow.blur;
                context.shadowOffsetX = shadow.offsetX || 0;
                context.shadowOffsetY = shadow.offsetY || 0;
            }
            //描边
            if (stroke) {
                context.strokeStyle = this.getColorStr(stroke.color || 0);
                context.lineWidth = stroke.size * 2;
                context.strokeText(text, x, y + h, w);
            }
            context.fillText(text, x, y + h - oy, w);
        };
        TextFormat.prototype.getColorStr = function (color) {
            var s = color.toString(16);
            return "#000000".substr(0, 7 - s.length) + s;
        };
        TextFormat.prototype.clone = function (format) {
            if (undefined == format) {
                format = new TextFormat();
            }
            format.family = this.family;
            format.size = this.size;
            format.bold = this.bold;
            format.italic = this.italic;
            format.stroke = this.stroke;
            format.shadow = this.shadow;
            format.gradient = this.gradient;
            format.font = this.font;
            format.oy = this.oy;
            format.align = this.align;
            return format;
        };
        return TextFormat;
    }());
    rf.TextFormat = TextFormat;
    var defalue_format = new TextFormat().init();
    /**
     * 优化计划
     * 1. textformat.oy 这东西不应该存在 他的作用主要是用于修正微软雅黑取jqpy等下标超界值。 需要研究 如何取获得 渲染文字的定义。上标 下标等渲染值。
     * 2. set text: 现在只要set text就会触发计算 绘制 渲染操作 如果后期一帧内频繁修改text可能会卡。所以应该换成1帧最多渲染1次的策略。
     */
    var TextField = /** @class */ (function (_super) {
        __extends(TextField, _super);
        function TextField() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.html = false;
            _this.$text = "";
            _this.gap = 0;
            // wordWrap: boolean = false;
            _this.multiline = false;
            _this._edit = false;
            _this._type = "dynamic" /* DYNAMIC */;
            _this.lines = [];
            _this.textLines = [];
            return _this;
        }
        TextField.prototype.init = function (source, format) {
            if (undefined != source) {
                this.source = source;
            }
            if (undefined == format) {
                format = defalue_format.clone();
            }
            this.format = format;
        };
        Object.defineProperty(TextField.prototype, "text", {
            set: function (value) {
                if (this.$text == value) {
                    return;
                }
                this.$text = value;
                var element = this.element;
                if (undefined == element) {
                    this.element = element = new HtmlElement();
                }
                else {
                    element.clear();
                }
                var format = this.format;
                if (undefined == format) {
                    this.format = format = defalue_format.clone();
                }
                element.format = format;
                element.color = this.color;
                if (this.html) {
                    formatHtml(value, element, this.source);
                }
                else {
                    element.str = value;
                }
                var lines = this.tranfromHtmlElement2CharDefine(element, this.multiline ? this.w : Infinity);
                var len = lines.length;
                var oy = 0;
                var lineh;
                for (var i = 0; i < len; i++) {
                    var line = lines[i];
                    var textLine = this.textLines[i];
                    if (undefined == textLine) {
                        this.textLines[i] = textLine = rf.recyclable(TextLine);
                    }
                    textLine.y = oy;
                    textLine.source = this.source;
                    textLine.renderText(line);
                    textLine.updateHitArea(); //必须更新hitarea w h 会出现不正确现象
                    oy += line.h + 4;
                    this.addChild(textLine);
                    if (lineh == undefined) {
                        lineh = line.h;
                    }
                }
                this.lineheight = lineh;
                while (lines.length > len) {
                    var textLine = lines.pop();
                    textLine.recycle();
                }
                this.layout();
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.cleanAll = function () {
            _super.prototype.cleanAll.call(this);
        };
        TextField.prototype.layout = function () {
            var format = this.format;
            if (format.align == "left" /* LEFT */) {
                return;
            }
            this.updateHitArea();
            var childrens = this.childrens;
            //根据align属性进行重新布局
            var _w = this.w;
            if (_w == 0) {
                return;
            }
            var align_type = 0;
            if (format.align == "center" /* CENTER */) {
                align_type = 1;
            }
            else if (format.align == "right" /* RIGHT */) {
                align_type = 2;
            }
            var len = childrens.length;
            //fisrt 取出完整的width
            //second 根据align获取偏移offsetx
            for (var i = 0; i < len; i++) {
                var display = childrens[i];
                if (align_type == 1) {
                    display.x = _w - display.w >> 1;
                }
                else if (align_type == 2) {
                    display.x = _w - display.w;
                }
            }
            //             if(u){
            // //				-偏移量
            //                 var _offy:int = txtSet ? currentHtml.text2dDefine.offsety : 0;
            //                 graphics.clear();
            //                 _graphics.lineStyle(1,_textColor);
            //                 _graphics.moveTo(lx,height+reduceLineHeight - _offy);
            //                 _graphics.lineTo(lx + textWidth + reduceLineWidth,height+reduceLineHeight - _offy);
            //                 _graphics.endFill();
            //             }
            //             else
            //             {
            //                 graphics.clear();
            //             }
        };
        TextField.prototype.getCharSourceVO = function (char, format) {
            var source = this.source;
            var name = format.font + "_" + char;
            var vo = source.getSourceVO(name, 1);
            if (undefined == vo) {
                var p = rf.EMPTY_POINT2D;
                var bmd = source.bmd;
                var context = bmd.context;
                format.test(context, char, p);
                vo = source.setSourceVO(name, p.x, p.y, 1);
                if (undefined != vo) {
                    format.draw(context, char, vo);
                    var c = rf.context3D;
                    var textureData = source.textureData;
                    if (!textureData) {
                        source.textureData = textureData = c.getTextureData(source.name);
                    }
                    var texture = rf.context3D.textureObj[textureData.key];
                    if (undefined != texture) {
                        texture.readly = false;
                    }
                }
            }
            return vo;
        };
        TextField.prototype.tranfromHtmlElement2CharDefine = function (html, width) {
            if (width === void 0) { width = Infinity; }
            var char;
            var str;
            var i = 0;
            var oi = 0;
            var len;
            var ox = 0;
            var lineCount = 0;
            var lines = this.lines;
            var line = lines[lineCount];
            if (!line) {
                lines[lineCount] = line = rf.recyclable(Line);
            }
            var chars = line.chars;
            lineCount++;
            //			chars = [];
            //			lines = [chars]
            while (html) {
                if (!html.image && !html.str) {
                    html = html.next;
                    continue;
                }
                if (html.image) {
                    if (html.newline) {
                        //自动换行开始
                        while (chars.length > oi) {
                            char = chars.pop();
                            char.recycle();
                        }
                        line = lines[lineCount];
                        if (!line) {
                            lines[lineCount] = line = rf.recyclable(Line);
                        }
                        chars = line.chars;
                        ox = 0;
                        oi = 0;
                        lineCount++;
                        //自动换行结束
                    }
                    if (ox && ox + html.image.w > width) {
                        //自动换行开始
                        while (chars.length > oi) {
                            char = chars.pop();
                            char.recycle();
                        }
                        line = lines[lineCount];
                        if (!line) {
                            lines[lineCount] = line = rf.recyclable(Line);
                        }
                        chars = line.chars;
                        ox = 0;
                        oi = 0;
                        lineCount++;
                        //自动换行结束
                    }
                    char = chars[oi];
                    if (!char) {
                        chars[oi] = char = rf.recyclable(Char);
                    }
                    char.index = oi;
                    char.w = html.w;
                    char.h = html.h;
                    char.sx = ox;
                    char.ex = ox + char.w;
                    char.ox = ox + char.h * .5;
                    char.name = null;
                    char.display = html.image;
                    char.element = html;
                    line.w = ox + char.w;
                    if (line.h < char.h) {
                        line.h = char.h;
                    }
                    ox += (char.w + this.gap - 2);
                    oi++;
                }
                else {
                    if (html.newline) {
                        while (chars.length > oi) {
                            char = chars.pop();
                            char.recycle();
                        }
                        line = lines[lineCount];
                        if (!line) {
                            lines[lineCount] = line = rf.recyclable(Line);
                        }
                        chars = line.chars;
                        ox = 0;
                        oi = 0;
                        lineCount++;
                    }
                    str = html.str;
                    len = str.length;
                    for (i = 0; i < len; i++) {
                        var c = str.charAt(i);
                        var vo = this.getCharSourceVO(c, html.format);
                        if (!vo) {
                            continue;
                        }
                        //自动换行开始
                        if (ox + vo.w > width) {
                            while (chars.length > oi) {
                                char = chars.pop();
                                char.recycle();
                            }
                            line = lines[lineCount];
                            if (!line) {
                                lines[lineCount] = line = rf.recyclable(Line);
                            }
                            chars = line.chars;
                            ox = 0;
                            oi = 0;
                            lineCount++;
                        }
                        //自动换行结束
                        char = chars[oi];
                        if (!char) {
                            chars[oi] = char = rf.recyclable(Char);
                        }
                        char.index = oi;
                        char.w = vo.w;
                        char.h = vo.h;
                        char.sx = ox;
                        char.ex = ox + vo.w;
                        char.ox = ox + vo.w * .5;
                        char.name = c;
                        char.element = html;
                        char.display = vo;
                        line.w = ox + vo.w;
                        if (line.h < vo.h) {
                            line.h = vo.h;
                        }
                        ox += (vo.w + this.gap);
                        oi++;
                    }
                }
                html = html.next;
            }
            while (chars.length > oi) {
                char = chars.pop();
                char.recycle();
            }
            while (lines.length > lineCount) {
                line = lines.pop();
                for (var _i = 0, _a = line.chars; _i < _a.length; _i++) {
                    char = _a[_i];
                    char.recycle();
                }
                line.chars.length = 0;
            }
            return lines;
        };
        Object.defineProperty(TextField.prototype, "type", {
            get: function () {
                return this._type;
            },
            set: function (val) {
                this._type = val;
                if (val == "input" /* INPUT */) {
                    this.addEventListener(50 /* MouseDown */, this.mouseDownHandler, this);
                }
                else {
                    this.removeEventListener(50 /* MouseDown */, this.mouseDownHandler);
                }
            },
            enumerable: true,
            configurable: true
        });
        TextField.prototype.mouseDownHandler = function (event) {
            var editing = this._edit;
            if (editing) {
                return;
            }
            this._edit = editing = true;
            //启动文本编辑器
            txtedit.setTextfiled(this);
            txtedit.addEventListener("onblur", this.onblurHandler, this);
            this.visible = false;
        };
        TextField.prototype.onblurHandler = function (event) {
            this._edit = false;
            txtedit.removeEventListener("onblur", this.onblurHandler);
            var val = event.data;
            this.visible = true;
            this.text = val;
        };
        TextField.prototype.removeFromStage = function () {
            _super.prototype.removeFromStage.call(this);
            if (this._edit) {
                txtedit.setTextfiled(undefined);
            }
            // this.simpleDispatch(EventT.REMOVE_FROM_STAGE);
        };
        return TextField;
    }(rf.Sprite));
    rf.TextField = TextField;
    var ImageVO = /** @class */ (function () {
        function ImageVO() {
            this.x = 0;
            this.y = 0;
            this.w = 0;
            this.h = 0;
        }
        ImageVO.prototype.clone = function (vo) {
            if (undefined == vo) {
                vo = new ImageVO();
            }
            vo.name = this.name;
            vo.tag = this.tag;
            vo.w = this.w;
            vo.h = this.h;
            return vo;
        };
        ImageVO.prototype.dispose = function () {
            this.display = undefined;
        };
        return ImageVO;
    }());
    rf.ImageVO = ImageVO;
    var HtmlElement = /** @class */ (function () {
        function HtmlElement() {
            /**
             * 是否需要换行
             */
            this.newline = false;
            this.str = undefined;
            this.start = 0;
            //		id:String;
            this.color = 0;
        }
        // set color(value:number){
        //     this._color = value;
        //     this.r = ((value >> 16) & 0xFF) / 0xFF;
        //     this.g = ((value >> 8) & 0xFF) / 0xFF;
        //     this.b = (value & 0xFF) / 0xFF;
        // }
        HtmlElement.prototype.createAndCopyFormat = function (last, newline) {
            if (last === void 0) { last = null; }
            if (newline === void 0) { newline = false; }
            var ele = new HtmlElement();
            ele.format = this.format;
            ele.underline = this.underline;
            ele.color = this.color;
            ele.newline = newline;
            if (last) {
                last.next = ele;
                ele.pre = last;
            }
            return ele;
        };
        HtmlElement.prototype.clear = function () {
            var next;
            while (next) {
                if (next.image) {
                    var images_1 = rf.emote_images;
                    if (next.imageTag > -1) {
                        images_1[next.imageTag] = null;
                        next.imageTag = -1;
                    }
                    next.image.remove();
                    next.image = null;
                }
                next = next.next;
            }
            this.next = null;
            this.pre = null;
            this.str = undefined;
            this.color = 0;
            this.image = undefined;
            this.imageTag = undefined;
        };
        return HtmlElement;
    }());
    rf.HtmlElement = HtmlElement;
    // let regHTML: RegExp = /\<(?<HtmlTag>(font|u|a|image))([^\>]*?)\>(.*?)\<\/\k<HtmlTag>\>/m;
    // let regPro: RegExp = /(color|size|face|href|target|width|height)=(?<m>['|"])(.*?)\k<m>/;
    var regPro = /(color|size|face|href|target|width|height)=(['|"])(.*?)(['|"])/; //兼容手机机机机机机
    var regTag = /<(font|u|a|image|b)([^\>]*?)\>/;
    var _imgtag = /({tag (.*?) (.*?)})/g;
    var _emotiontag = /\#[0-9]/g;
    var newLineChar = "∏々";
    function getTagStr(value) {
        var o = regTag.exec(value);
        if (undefined == o) {
            return undefined;
        }
        var tag = o[1];
        var flag = 1;
        var findTag = "<" + tag;
        var findTagLen = findTag.length;
        var endTag = "</" + tag;
        var endTagLen = endTag.length;
        var sindex;
        var findindex;
        var endindex;
        var test;
        sindex = o[0].length + o.index;
        while (flag) {
            findindex = value.indexOf(findTag, sindex);
            endindex = value.indexOf(endTag, sindex);
            if (findindex != -1 && findindex < endindex) {
                flag++;
                sindex = findindex + findTagLen;
            }
            else {
                if (endindex == -1) {
                    console.log("htmltext format error at tag " + tag + "\nvalue:" + value);
                    return undefined;
                }
                flag--;
                sindex = endindex + endTagLen;
            }
            test = value.slice(sindex);
        }
        endindex = value.indexOf(">", sindex);
        if (endindex == -1) {
            console.log("htmltext format error at tag " + tag + "\nvalue:" + value);
            return undefined;
        }
        var result = value.slice(o.index, endindex + 1);
        o[3] = value.slice(o.index + o[0].length, sindex - endTagLen);
        o[0] = result;
        return o;
    }
    function doFormatHtml(value, source, parent, last) {
        if (parent === void 0) { parent = null; }
        if (last === void 0) { last = null; }
        var html;
        var o;
        var str;
        var len;
        var i;
        if (parent) {
            if (parent.str || parent.image) {
                last = html = parent.createAndCopyFormat(last);
            }
            else {
                html = parent;
            }
        }
        var nextnew;
        o = getTagStr(value); //取出html标签
        if (o) {
            var index = o.index;
            if (index != 0) {
                str = value.slice(0, index);
                while ((i = str.indexOf(newLineChar)) != -1) {
                    if (html.str || parent.image) {
                        last = html = parent.createAndCopyFormat(last, nextnew);
                    }
                    html.str = str.slice(0, i);
                    nextnew = true;
                    str = str.slice(i + newLineChar.length);
                }
                if (html.str || parent.image) {
                    last = html = parent.createAndCopyFormat(last, nextnew);
                    if (str) {
                        nextnew = false;
                    }
                }
                if (nextnew) {
                    last = html = parent.createAndCopyFormat(last, nextnew);
                    html.str = str;
                }
                else {
                    html.str = str; //如果是换行符nextnew属性不改变继续
                }
                if (str) {
                    nextnew = false;
                }
            }
            value = value.slice(o.index + o[0].length);
            if (o[1] == "image") {
                var image = rf.emote_images[o[3]];
                if (image) {
                    if (parent.str || parent.image) {
                        last = html = parent.createAndCopyFormat(last, html.newline);
                    }
                    html.imageTag = o[3];
                    html.image = image;
                    html.w = image.w;
                    html.h = image.h;
                    htmlProParser(o[1], o[2], html, html.image);
                }
            }
            else if (o[1] == "a") {
                if (parent.str || parent.image) {
                    last = html = parent.createAndCopyFormat(last, html.newline);
                }
                var text = rf.recyclable(TextALink);
                text.init(source, html.format);
                text.color = html.color;
                html.image = text;
                html.imageTag = -1;
                htmlProParser(o[1], o[2], html, text);
                text.text = o[3];
                html.w = text.w;
                html.h = text.h;
            }
            else if (o[1] == "b") {
                last = html = parent.createAndCopyFormat(last, html.newline);
                var format = parent.format;
                if (format.bold != "bold") {
                    format = format.clone();
                    format.bold = "bold";
                    format.init();
                }
                html.format = format;
                htmlProParser(o[1], o[2], html);
                last = doFormatHtml(o[3], source, html, last);
            }
            else {
                last = html = parent.createAndCopyFormat(last, nextnew);
                //复制属性
                htmlProParser(o[1], o[2], html);
                last = doFormatHtml(o[3], source, html, last);
            }
            if (value.length) {
                last = html = parent.createAndCopyFormat(last);
                last = doFormatHtml(value, source, html, last);
            }
        }
        else {
            str = value;
            nextnew = false;
            while ((i = str.indexOf(newLineChar)) != -1) {
                if (html.str || parent.image) {
                    last = html = parent.createAndCopyFormat(last, nextnew);
                }
                html.str = str.slice(0, i);
                nextnew = true;
                str = str.slice(i + newLineChar.length);
            }
            if (html.str || parent.image) {
                last = html = parent.createAndCopyFormat(last, html.newline);
            }
            html.str = str;
            if (nextnew) {
                html.newline = nextnew;
                nextnew = false;
            }
        }
        return last;
    }
    var emotion = {};
    var imageCreateFunctions = {};
    var imageTag = 0;
    var images = {};
    function checkImage() {
        for (var i = 0; i < imageTag; i++) {
            if (images[i] == null) {
                return i;
            }
        }
        return imageTag++;
    }
    function createImage(tag, value, source) {
        var func = imageCreateFunctions[tag];
        if (null == func) {
            return "";
        }
        var imagevo = func(value, source);
        var index = checkImage();
        images[index] = imagevo.display;
        imagevo.dispose();
        var str = "<image>{0}</image>".substitute(index);
        return str;
    }
    function imageStrFormat(value, source) {
        var _strs;
        var len;
        var index = 0;
        var arr;
        _strs = "";
        value = value.replace(/\'#/g, "'$");
        value = value.replace(/\"#/g, "\"$");
        len = value.length;
        index = _imgtag.lastIndex = 0;
        var temp1;
        var temp;
        while (index < len) {
            arr = _imgtag.exec(value);
            if (arr) {
                temp1 = arr[0]; //整个
                //普通字符串
                temp = value.substring(index, _imgtag.lastIndex - temp1.length);
                if (temp) {
                    _strs += temp;
                }
                index = _imgtag.lastIndex;
                //					tag = (imageTextField as GImageTextField).setImgImagevo(arr[2],arr[3]);
                _strs += createImage(arr[2], arr[3], source);
            }
            else {
                temp = value.substring(index);
                if (temp) {
                    _strs += temp;
                }
                break;
            }
        }
        value = _strs;
        var imageCheck = 0;
        var i;
        var imageVO;
        var tag;
        if (emotion) {
            do {
                i = value.indexOf("#", index);
                if (i == -1) {
                    break;
                }
                index = i + 1;
                imageCheck = 5;
                while (imageCheck > 2) {
                    tag = value.slice(i, i + imageCheck);
                    imageVO = emotion[tag];
                    if (!imageVO) {
                        imageCheck--;
                        continue;
                    }
                    //					
                    var s = _emotiontag.exec(tag);
                    if (s && s.length) {
                        break;
                    }
                    var image = createImage("em", tag, source);
                    value = value.replace(tag, image);
                    break;
                }
            } while (i != -1);
        }
        value = value.replace(/\'\$/g, "'#");
        value = value.replace(/\"\$/g, "\"#");
        value = value.replace(/\'\$/g, "'#");
        return value;
    }
    function formatHtml(value, html, source) {
        value = value.replace(/<br\/>/g, newLineChar);
        value = value.replace(/\n/g, newLineChar);
        value = value.replace(/\&lt;/g, "<");
        value = value.replace(/\&gt;/g, ">");
        value = value.replace(/\&apos;/g, "'");
        value = value.replace(/\&quot;/g, '"');
        value = value.replace(/\&amp;/g, "&");
        value = imageStrFormat(value, source);
        doFormatHtml(value, source, html, html);
        var next;
        while (html) {
            if (html.pre && !html.str && !html.newline && !html.image) {
                html.pre.next = html.next;
                if (html.next) {
                    html.next.pre = html.pre;
                }
                html = html.next;
            }
            else {
                html = html.next;
            }
        }
    }
    rf.formatHtml = formatHtml;
    function htmlProParser(pro, value, html, sp) {
        regPro.lastIndex = 0;
        value = value.replace(/\s/g, "");
        var o = regPro.exec(value);
        var cloneFormat;
        while (o) {
            var p = o[1];
            var v = o[3];
            p = p.trim();
            if (p == "color") {
                html.color = Number(v.replace("#", "0x"));
            }
            else if (p == "href") {
                if (v.indexOf("event:") == 0) {
                    v = v.replace("event:", "");
                }
            }
            else if (p == "size") {
                var size = Number(v);
                var format = html.format;
                if (format.size != size) {
                    format = format.clone();
                    format.size = size;
                    format.init();
                    html.format = format;
                }
            }
            if (undefined != sp) {
                if (sp.hasOwnProperty(p)) {
                    sp[p] = v;
                }
            }
            else {
                if (p != "color" && html.hasOwnProperty(p)) {
                    html[p] = v;
                }
            }
            value = value.replace(o[0], "");
            o = regPro.exec(value);
        }
    }
    var Char = /** @class */ (function () {
        function Char() {
            this.ox = 0;
            this.sx = 0;
            this.ex = 0;
        }
        Char.prototype.onRecycle = function () {
            this.element = undefined;
            this.display = undefined;
        };
        return Char;
    }());
    rf.Char = Char;
    var Line = /** @class */ (function () {
        function Line() {
            this.w = 0;
            this.h = 0;
            this.chars = [];
        }
        return Line;
    }());
    rf.Line = Line;
    var TextLine = /** @class */ (function (_super) {
        __extends(TextLine, _super);
        function TextLine() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TextLine.prototype.renderText = function (line) {
            this.removeAllChild();
            this.line = line;
            var h = line.h;
            var chars = line.chars;
            var len = chars.length;
            var g = this.graphics;
            g.clear();
            for (var i = 0; i < len; i++) {
                var char = chars[i];
                var ele = char.element;
                var display = char.display;
                if (display instanceof rf.Sprite) {
                    display.x = char.sx;
                    display.y = (h - display.h) >> 1;
                    this.addChild(display);
                }
                else {
                    g.drawBitmap(char.sx, h - display.h, display, ele.color);
                }
            }
            g.end();
        };
        return TextLine;
    }(rf.Sprite));
    rf.TextLine = TextLine;
    var TextALink = /** @class */ (function (_super) {
        __extends(TextALink, _super);
        function TextALink() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TextALink;
    }(TextField));
    rf.TextALink = TextALink;
})(rf || (rf = {}));
//# sourceMappingURL=TextFiled.js.map