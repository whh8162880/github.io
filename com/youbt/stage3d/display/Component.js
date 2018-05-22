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
///<reference path="../../mvc/manage/PanelSourceManage.ts" />
///<reference path="./Sprite.ts" />
var rf;
(function (rf) {
    var Component = /** @class */ (function (_super) {
        __extends(Component, _super);
        function Component(source) {
            var _this = _super.call(this, source) || this;
            _this._enabled = true;
            return _this;
        }
        Component.prototype.setSymbol = function (symbol, matrix) {
            this.symbol = symbol;
            if (!symbol) {
                var graphics = this.graphics;
                graphics.clear();
                graphics.end();
                return;
            }
            this.x = symbol.x;
            this.y = symbol.y;
            this.gotoAndStop(symbol.displayClip, true);
            this.updateHitArea();
            this.bindComponents();
        };
        Component.prototype.gotoAndStop = function (clip, refresh) {
            if (refresh === void 0) { refresh = false; }
            var _a = this, symbol = _a.symbol, graphics = _a.graphics;
            if (symbol == undefined) {
                // this.gotoAndStop(clip,refresh);
                return;
            }
            if (this.currentClip == clip && !refresh) {
                return;
            }
            graphics.clear();
            this.currentClip = clip;
            var elements = symbol.displayFrames[clip];
            if (undefined == elements) {
                graphics.end();
                return;
            }
            var sp;
            var tempMatrix = rf.newMatrix();
            var names;
            for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                var ele = elements_1[_i];
                if (rf.ComponentClass.hasOwnProperty(ele.type.toString())) {
                    //文本这样处理是不行的
                    sp = this[ele.name];
                    if (!sp) {
                        sp = rf.recyclable(rf.ComponentClass[ele.type]);
                        sp.source = this.source;
                        if (ele.type == 1 /* Label */) { //文本处理
                            var textElement = ele;
                            var textfield = rf.recyclable(rf.TextField);
                            var e_format = textElement.format;
                            var format = rf.recyclable(rf.TextFormat).init();
                            format.size = e_format["size"] == undefined ? 12 : e_format["size"];
                            format.align = e_format["alignment"] == undefined ? "left" : e_format["alignment"];
                            textfield.init(this.source, format);
                            textfield.color = textElement.color;
                            textfield.multiline = textElement.multiline;
                            if (textElement.input) {
                                textfield.type = "input" /* INPUT */;
                                textfield.mouseEnabled = true;
                            }
                            else {
                                textfield.type = "dynamic" /* DYNAMIC */;
                            }
                            textfield.setSize(textElement.width, textElement.height);
                            textfield.text = textElement.text;
                            sp["text"] = textfield;
                            sp.addChild(textfield);
                            sp.x = ele.x;
                            sp.y = ele.y;
                            sp.setSize(textfield.w, textfield.h);
                            this.addChild(sp);
                        }
                        else {
                            sp.setSymbol(ele);
                        }
                        sp.x = ele.x;
                        sp.y = ele.y;
                        sp.setSize(Math.round(sp.w * ele.scaleX), Math.round(sp.h * ele.scaleY));
                        this.addChild(sp);
                        this[ele.name] = sp;
                    }
                }
                else {
                    this.renderFrameElement(ele);
                }
            }
            graphics.end();
        };
        Component.prototype.addToStage = function () {
            _super.prototype.addToStage.call(this);
            this.simpleDispatch(19 /* ADD_TO_STAGE */);
        };
        Component.prototype.removeFromStage = function () {
            _super.prototype.removeFromStage.call(this);
            this.simpleDispatch(20 /* REMOVE_FROM_STAGE */);
        };
        // var scaleGeomrtry:ScaleNGeomrtry;
        Component.prototype.renderFrameElement = function (element, clean) {
            if (clean === void 0) { clean = false; }
            var vo = this.source.getSourceVO(element.libraryItemName, 1);
            if (vo == undefined) {
                return;
            }
            var graphics = this.graphics;
            if (clean) {
                graphics.clear();
            }
            if (element.rect) {
                // scaleGeomrtry = _graphics.scale9(vo,element.rect,scaleGeomrtry);
                // if(_width == 0){
                // 	_width = vo.w;
                // }
                // if(_height == 0){
                // 	_height = vo.h;
                // }
                // scaleGeomrtry.set9Size(_width,_height);
            }
            else {
                graphics.drawBitmap(0, 0, vo); //,element.matrix2d
            }
            if (clean) {
                graphics.end();
            }
        };
        Object.defineProperty(Component.prototype, "selected", {
            get: function () { return this._selected; },
            set: function (value) { this._selected = value; this.doSelected(); },
            enumerable: true,
            configurable: true
        });
        Component.prototype.doSelected = function () { };
        Object.defineProperty(Component.prototype, "enabled", {
            get: function () { return this._enabled; },
            set: function (value) { if (this._enabled == value) {
                return;
            } this._enabled = value; this.doEnabled(); },
            enumerable: true,
            configurable: true
        });
        Component.prototype.doEnabled = function () { };
        Object.defineProperty(Component.prototype, "data", {
            get: function () { return this._data; },
            set: function (value) { this._data = value; this.doData(); },
            enumerable: true,
            configurable: true
        });
        Component.prototype.doData = function () { };
        Component.prototype.refreshData = function () { this.doData(); };
        Component.prototype.bindComponents = function () { };
        Component.prototype.awaken = function () { };
        Component.prototype.sleep = function () { };
        return Component;
    }(rf.Sprite));
    rf.Component = Component;
    var Label = /** @class */ (function (_super) {
        __extends(Label, _super);
        function Label() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Label.prototype, "label", {
            get: function () { var _a = this, _editable = _a._editable, text = _a.text, _label = _a._label; if (_editable) {
                return text.text;
            } return _label; },
            set: function (value) { this._label = value + ""; this.doLabel(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Label.prototype, "editable", {
            get: function () { return this._editable; },
            set: function (value) { this._editable = value; this.doEditable(); },
            enumerable: true,
            configurable: true
        });
        Label.prototype.doEditable = function () { };
        ;
        Label.prototype.bindComponents = function () {
        };
        Label.prototype.doLabel = function () {
            var _a = this, text = _a.text, _label = _a._label, _editable = _a._editable;
            if (text) {
                text.text = _label;
                // if(!_editable){
                // 	textField.w = textField.textWidth+5;
                // 	textField.h = textField.textHeight+5;
                // }
                this.textResize();
            }
        };
        Label.prototype.textResize = function () { };
        return Label;
    }(Component));
    rf.Label = Label;
    var Button = /** @class */ (function (_super) {
        __extends(Button, _super);
        function Button() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.mouseDown = false;
            return _this;
        }
        Button.prototype.bindComponents = function () {
            // if(this["label"] != undefined)
            // {
            // 	this.text = this["label"];
            // 	this.text.html = true;
            // }
            this.mouseChildren = false;
            this.doEnabled();
        };
        Button.prototype.doEnabled = function () {
            this.mouseEnabled = this._enabled;
            this.setEnable(this._enabled);
        };
        Button.prototype.setEnable = function (show) {
            // _enableFlag = show;
            if (show) {
                this.on(50 /* MouseDown */, this.mouseDownHandler, this);
                this.on(61 /* ROLL_OVER */, this.rollHandler, this);
                this.on(62 /* ROLL_OUT */, this.rollHandler, this);
                this.mouseEnabled = true;
            }
            else {
                this.off(50 /* MouseDown */, this.mouseDownHandler);
                this.off(61 /* ROLL_OVER */, this.rollHandler);
                this.off(62 /* ROLL_OUT */, this.rollHandler);
                this.mouseEnabled = false;
            }
        };
        Button.prototype.mouseDownHandler = function (event) {
            this.on(53 /* MouseUp */, this.mouseUpHandler, this);
            this.mouseDown = true;
            this.clipRefresh();
        };
        Button.prototype.mouseUpHandler = function (event) {
            this.mouseDown = false;
            this.off(53 /* MouseUp */, this.mouseUpHandler);
            this.clipRefresh();
        };
        Button.prototype.rollHandler = function (event) {
            this.clipRefresh();
        };
        Button.prototype.clipRefresh = function () {
            var mouseDown = this.mouseDown;
            this.gotoAndStop(mouseDown ? 2 : (this.mouseroll ? 1 : 0));
        };
        Button.prototype.addClick = function (listener, thisObj) {
            this.on(56 /* CLICK */, listener, thisObj);
        };
        return Button;
    }(Label));
    rf.Button = Button;
    var CheckBox = /** @class */ (function (_super) {
        __extends(CheckBox, _super);
        function CheckBox() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CheckBox.prototype.doEnabled = function () {
            _super.prototype.doEnabled.call(this);
            var _enabled = this._enabled;
            if (_enabled) {
                this.on(56 /* CLICK */, this.clickHandler, this);
            }
            else {
                this.off(56 /* CLICK */, this.clickHandler);
            }
        };
        CheckBox.prototype.clickHandler = function (event) {
            this.selected = !this._selected;
        };
        CheckBox.prototype.doSelected = function () {
            this.simpleDispatch(11 /* SELECT */);
            this.clipRefresh();
        };
        return CheckBox;
    }(Button));
    rf.CheckBox = CheckBox;
    var RadioButton = /** @class */ (function (_super) {
        __extends(RadioButton, _super);
        function RadioButton(source, group) {
            var _this = _super.call(this, source) || this;
            if (group != undefined) {
                _this.group = group;
            }
            return _this;
        }
        RadioButton.prototype.doSelected = function () {
            this.simpleDispatch(11 /* SELECT */, this);
            this.clipRefresh();
            if (!this._selected) {
                this.on(56 /* CLICK */, this.clickHandler, this);
            }
            else {
                this.off(56 /* CLICK */, this.clickHandler);
            }
        };
        Object.defineProperty(RadioButton.prototype, "group", {
            get: function () {
                return this._group;
            },
            set: function (name) {
                var _group = this._group;
                var radioButtonGroup;
                if (_group) {
                    radioButtonGroup = RadioButtonGroup.getGroup(_group);
                    if (radioButtonGroup) {
                        radioButtonGroup.removeRadioButton(this);
                    }
                }
                this._group = name;
                if (this._group) {
                    radioButtonGroup = RadioButtonGroup.getGroup(_group, true);
                    radioButtonGroup.addRadioButton(this);
                }
            },
            enumerable: true,
            configurable: true
        });
        return RadioButton;
    }(CheckBox));
    rf.RadioButton = RadioButton;
    var RadioButtonGroup = /** @class */ (function (_super) {
        __extends(RadioButtonGroup, _super);
        function RadioButtonGroup(name) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.list = [];
            RadioButtonGroup.groupDict[name] = _this;
            return _this;
        }
        RadioButtonGroup.getGroup = function (name, autoCreate) {
            if (autoCreate === void 0) { autoCreate = false; }
            var group = this.groupDict[name];
            if (!group) {
                if (autoCreate) {
                    group = new RadioButtonGroup(name);
                }
            }
            return group;
        };
        Object.defineProperty(RadioButtonGroup.prototype, "selectRadioButton", {
            get: function () {
                return this._selectRadioButton;
            },
            set: function (radioButton) {
                this._selectRadioButton = radioButton;
                if (this._selectRadioButton) {
                    this._selectRadioButton.selected = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RadioButtonGroup.prototype, "selectIndex", {
            get: function () {
                return this._selectIndex;
            },
            set: function (value) {
                this._selectIndex = value;
                var item = this.list[value];
                if (item) {
                    item.selected = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         *
         * @param radioButton
         *
         */
        RadioButtonGroup.prototype.addRadioButton = function (radioButton) {
            if (this.list.indexOf(radioButton) == -1) {
                if (this._selectRadioButton != undefined) {
                    this._selectRadioButton = radioButton;
                    radioButton.selected = true;
                }
                else {
                    radioButton.addEventListener(11 /* SELECT */, this.radioButtonSelectHandler, radioButton);
                }
                this.list.push(radioButton);
            }
        };
        /**
         *
         * @param radioButton
         *
         */
        RadioButtonGroup.prototype.removeRadioButton = function (radioButton) {
            var i = this.list.indexOf(radioButton);
            if (i == -1) {
                return;
            }
            radioButton.removeEventListener(11 /* SELECT */, this.radioButtonSelectHandler);
            this.list.splice(i, 1);
        };
        RadioButtonGroup.prototype.radioButtonSelectHandler = function (event) {
            var target = event.data;
            if (target && target.selected) {
                if (this._selectRadioButton) {
                    this._selectRadioButton.selected = false;
                    this._selectRadioButton.addEventListener(11 /* SELECT */, this.radioButtonSelectHandler, this._selectRadioButton);
                }
                this._selectRadioButton = target;
                this._selectRadioButton.removeEventListener(11 /* SELECT */, this.radioButtonSelectHandler);
                this.dispatchEvent(new rf.EventX(6 /* CHANGE */));
            }
        };
        RadioButtonGroup.groupDict = {};
        return RadioButtonGroup;
    }(rf.MiniDispatcher));
    rf.RadioButtonGroup = RadioButtonGroup;
    var TabItem = /** @class */ (function (_super) {
        __extends(TabItem, _super);
        function TabItem() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.index = 0;
            _this.target = null;
            return _this;
        }
        TabItem.prototype.doSelected = function () {
            this.clipRefresh();
            var text = this.text;
            var colors = TabItem.colors;
            var _a = this, _selected = _a._selected, _label = _a._label;
            if (colors != undefined && text != undefined) {
                text.html = true;
                // text.text = HtmlUtil.renderColor(_label , _selected ? colors["normal"] : colors["select"]);
            }
        };
        TabItem.colors = null;
        return TabItem;
    }(Button));
    rf.TabItem = TabItem;
    rf.ComponentClass = {
        0: Component,
        1: Label,
        2: Button,
        3: CheckBox,
        4: RadioButton,
        5: TabItem,
        7: Component
    };
})(rf || (rf = {}));
//# sourceMappingURL=Component.js.map