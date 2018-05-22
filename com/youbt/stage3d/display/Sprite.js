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
///<reference path="./DisplayObjectContainer.ts" />
///<reference path="../camera/Camera.ts" />
///<reference path="./Filter.ts" />
var rf;
(function (rf) {
    var RenderBase = /** @class */ (function (_super) {
        __extends(RenderBase, _super);
        function RenderBase(variables) {
            var _this = _super.call(this) || this;
            _this.nativeRender = false;
            _this.tm = rf.defaultTimeMixer;
            _this.variables = variables;
            return _this;
        }
        // triangleFaceToCull: string = Context3DTriangleFace.NONE;
        // sourceFactor: number;
        // destinationFactor: number;
        // depthMask: boolean = false;
        // passCompareMode: number;
        RenderBase.prototype.render = function (camera, now, interval) {
            var i = 0;
            var childrens = this.childrens;
            var len = childrens.length;
            for (i = 0; i < len; i++) {
                var child = childrens[i];
                child.render(camera, now, interval);
            }
        };
        RenderBase.prototype.addToStage = function () {
            _super.prototype.addToStage.call(this);
            this.setChange(4 /* vertex */);
        };
        return RenderBase;
    }(rf.DisplayObjectContainer));
    rf.RenderBase = RenderBase;
    var Sprite = /** @class */ (function (_super) {
        __extends(Sprite, _super);
        function Sprite(source, variables) {
            var _this = _super.call(this) || this;
            _this.$graphics = undefined;
            _this.$batchGeometry = undefined;
            _this.$vcIndex = -1;
            _this.$vcox = 0;
            _this.$vcoy = 0;
            _this.$vcos = 1;
            _this.hitArea = new rf.HitArea();
            _this.source = source ? source : rf.componentSource;
            _this.variables = variables ? variables : rf.vertex_ui_variable;
            _this.mouseChildren = true;
            _this.mouseEnabled = true;
            return _this;
        }
        Object.defineProperty(Sprite.prototype, "graphics", {
            get: function () {
                if (undefined == this.$graphics) {
                    this.$graphics = new Graphics(this, rf.vertex_ui_variable);
                }
                return this.$graphics;
            },
            enumerable: true,
            configurable: true
        });
        Sprite.prototype.setChange = function (value, p, c) {
            if (p === void 0) { p = 0; }
            if (c === void 0) { c = false; }
            if (undefined != this.renderer) {
                this.states |= (value | p);
            }
            else {
                _super.prototype.setChange.call(this, value, p, c);
            }
        };
        Sprite.prototype.render = function (camera, now, interval) {
            if (undefined != this.renderer) {
                if (this.states & 19 /* t_all */) { //如果本层或者下层有transform alpha 改编 那就进入updateTransform吧
                    this.updateTransform();
                }
                this.renderer.render(camera, now, interval);
            }
        };
        Sprite.prototype.addToStage = function () {
            if (this.$graphics && this.$graphics.numVertices) {
                this.setChange(4 /* vertex */);
            }
            if (this.renderer) {
                if (this.parent) {
                    this.parent.setChange(4 /* vertex */);
                }
            }
            _super.prototype.addToStage.call(this);
        };
        Sprite.prototype.cleanAll = function () {
            if (this.childrens.length) {
                this.removeAllChild();
            }
            var g = this.$graphics;
            if (g && g.numVertices > 0) {
                g.clear();
                g.end();
            }
        };
        Sprite.prototype.setSize = function (width, height) {
            _super.prototype.setSize.call(this, width, height);
            var hitArea = this.hitArea;
            var _a = this, w = _a.w, h = _a.h;
            hitArea.clean();
            hitArea.updateArea(w, h, 0);
        };
        Sprite.prototype.updateHitArea = function () {
            var locksize = this.locksize;
            if (locksize) {
                return;
            }
            var hitArea = this.hitArea;
            hitArea.clean();
            for (var _i = 0, _a = this.childrens; _i < _a.length; _i++) {
                var child = _a[_i];
                if (child.states & 96 /* ac */) {
                    child.updateHitArea();
                }
                hitArea.combine(child.hitArea, child._x, child._y);
            }
            if (this.$graphics) {
                hitArea.combine(this.$graphics.hitArea, 0, 0);
            }
            // if(hitArea.allWays){
            //     this.w = stageWidth;
            //     this.h = stageHeight;
            // }else{
            this.w = hitArea.right - hitArea.left;
            this.h = hitArea.bottom - hitArea.top;
            // }
            this.states &= ~96 /* ac */;
        };
        Sprite.prototype.getObjectByPoint = function (dx, dy, scale) {
            var _a = this, mouseEnabled = _a.mouseEnabled, mouseChildren = _a.mouseChildren;
            if (mouseEnabled == false && mouseChildren == false) {
                return undefined;
            }
            var _b = this, states = _b.states, scrollRect = _b.scrollRect, hitArea = _b.hitArea;
            if (this.states & 96 /* ac */) {
                this.updateHitArea();
            }
            dx -= this._x;
            dy -= this._y;
            scale *= this._scaleX;
            var b = true;
            if (scrollRect) {
                var w = scrollRect.w, h = scrollRect.h;
                b = rf.size_checkIn(0, w, 0, h, dx, dy, scale);
            }
            if (b && hitArea.checkIn(dx, dy, scale)) {
                if (this.mouseChildren) {
                    var children = this.childrens;
                    var len = children.length;
                    for (var i = len - 1; i >= 0; i--) {
                        var child = children[i];
                        var d = child.getObjectByPoint(dx, dy, scale);
                        if (undefined != d) {
                            return d;
                        }
                    }
                }
                if (mouseEnabled) {
                    if (hitArea.allWays) {
                        return this;
                    }
                    if (hitArea.checkIn(dx, dy, scale) == true) {
                        return this;
                    }
                    // let g = this.$graphics;
                    // if(undefined != g){
                    //     if( g.hitArea.checkIn(dx,dy,scale) == true ){
                    //         return this;
                    //     }
                    // }
                }
            }
            return undefined;
        };
        return Sprite;
    }(RenderBase));
    rf.Sprite = Sprite;
    var Image = /** @class */ (function (_super) {
        __extends(Image, _super);
        function Image(source) {
            return _super.call(this, source) || this;
        }
        Image.prototype.load = function (url) {
            if (this._url == url) {
                return;
            }
            //clear
            if (url) {
                this._url = url;
                rf.loadRes(url, this.onImageComplete, this, 3 /* image */);
            }
        };
        Image.prototype.onImageComplete = function (e) {
            if (e.type != 4 /* COMPLETE */) {
                return;
            }
            var res = e.data;
            var image = res.data;
            var source = this.source;
            var vo = source.setSourceVO(this._url, image.width, image.height, 1);
            source.drawimg(image, vo.x, vo.y);
            var g = this.graphics;
            g.clear();
            g.drawBitmap(0, 0, vo);
            g.end();
        };
        return Image;
    }(Sprite));
    rf.Image = Image;
    var IconView = /** @class */ (function (_super) {
        __extends(IconView, _super);
        function IconView(source) {
            var _this = _super.call(this, source) || this;
            _this.isReady = false;
            return _this;
        }
        IconView.prototype.setUrl = function (url) {
            if (url == null) {
                var g = this.graphics;
                g.clear();
                g.end();
                return;
            }
            this.isReady = false;
            this.load(url);
        };
        IconView.prototype.resetSize = function (_width, _height) {
            this.drawW = _width;
            this.drawH = _height;
            if (this.isReady && this.img) {
                this._draw(this.img);
            }
        };
        IconView.prototype.onImageComplete = function (e) {
            if (e.type != 4 /* COMPLETE */) {
                this.drawFault();
                return;
            }
            var res = e.data;
            this.img = res.data;
            this._draw(this.img);
            this.simpleDispatch(4 /* COMPLETE */);
            this.isReady = true;
        };
        IconView.prototype._draw = function (img) {
            if (!this._url) {
                return;
            }
            // var matrix = new Matrix();
            // matrix.identity();
            var dw = this.drawW;
            var dh = this.drawH;
            // if(dw && dh)
            // {
            //    if(dw != img.width || dh != img.height)
            //    {
            //     //    matrix.scale(dw / img.width,dh / img.height);
            //    }
            // }else{
            //     dw = img.width;
            //     dh = img.height;
            // }
            if (!dw || !dh) {
                dw = img.width;
                dh = img.height;
            }
            var source = this.source;
            var vo = source.setSourceVO(this._url, img.width, img.height, 1);
            // source.bmd.context.drawImage(img,vo.x,vo.y);
            source.drawimg(img, vo.x, vo.y, dw, dh);
            var g = this.graphics;
            g.clear();
            g.drawBitmap(0, 0, vo);
            // g.drawBitmap(0,0,vo,0xFFFFFF,matrix.rawData);
            g.end();
        };
        IconView.prototype.drawFault = function () {
            var g = this.graphics;
            g.clear();
            g.end();
            this.img = null;
            this.simpleDispatch(14 /* ERROR */);
        };
        return IconView;
    }(Image));
    rf.IconView = IconView;
    var Graphics = /** @class */ (function () {
        function Graphics(target, variables) {
            this.numVertices = 0;
            this.$batchOffset = 0;
            this.preNumVertices = 0;
            this.target = target;
            // this.byte = new Float32Byte(new Float32Array(0));
            this.numVertices = 0;
            this.hitArea = new rf.HitArea();
        }
        Graphics.prototype.clear = function () {
            this.preNumVertices = this.numVertices;
            this.numVertices = 0;
            this.byte = undefined;
            this.hitArea.clean();
        };
        Graphics.prototype.end = function () {
            var target = this.target;
            var change = 0;
            if (this.numVertices > 0) {
                var float = rf.createGeometry(rf.empty_float32_object, target.variables, this.numVertices);
                this.byte = float;
                if (target.$batchGeometry && this.preNumVertices == this.numVertices) {
                    target.$batchGeometry.update(this.$batchOffset, float);
                }
                else {
                    change |= 4 /* vertex */;
                }
                if (target.hitArea.combine(this.hitArea, 0, 0)) {
                    change |= 32 /* area */;
                }
            }
            else {
                change |= (4 /* vertex */ | 32 /* area */);
            }
            if (change > 0) {
                target.setChange(change);
            }
        };
        Graphics.prototype.addPoint = function (pos, noraml, uv, color) {
            var variables = this.target.variables;
            var numVertices = this.numVertices;
            function set(variable, array, data) {
                if (undefined == data || undefined == variable) {
                    return;
                }
                var size = variable.size;
                var offset = numVertices * size;
                if (data.length == size) {
                    array.set(data, offset);
                }
                else {
                    array.set(data.slice(0, size), offset);
                }
                // for(let i = 0;i<size;i++){
                //     array[offset + i] = data[i];
                // }
            }
            set(variables["pos" /* pos */], rf.empty_float32_pos, pos);
            set(variables["normal" /* normal */], rf.empty_float32_normal, noraml);
            set(variables["uv" /* uv */], rf.empty_float32_uv, uv);
            set(variables["color" /* color */], rf.empty_float32_color, color);
            this.hitArea.updateArea(pos[0], pos[1], pos[2]);
            this.numVertices++;
        };
        Graphics.prototype.drawRect = function (x, y, width, height, color, alpha, matrix, z) {
            if (alpha === void 0) { alpha = 1; }
            if (matrix === void 0) { matrix = undefined; }
            if (z === void 0) { z = 0; }
            var _a = this.target.source, originU = _a.originU, originV = _a.originV;
            var rgba = [
                ((color & 0x00ff0000) >>> 16) / 0xFF,
                ((color & 0x0000ff00) >>> 8) / 0xFF,
                (color & 0x000000ff) / 0xFF,
                alpha
            ];
            var uv = [originU, originV, this.target.$vcIndex];
            var noraml = [0, 0, 1];
            var r = x + width;
            var b = y + height;
            var f = rf.m2dTransform;
            var p = [0, 0, 0];
            var points = [x, y, r, y, r, b, x, b];
            for (var i = 0; i < 8; i += 2) {
                p[0] = points[i];
                p[1] = points[i + 1];
                p[2] = z;
                if (undefined != matrix) {
                    f(matrix, p, p);
                }
                this.addPoint(p, noraml, uv, rgba);
            }
            // let position = this.byte.array.length;
            // let d = this.variables["data32PerVertex"].size;
            // let v = this.variables;
            // let f = m2dTransform;
            // let p = EMPTY_POINT2D;
            // let byte = this.byte;
            // const {originU,originV} = this.target.source;
            // this.byte.length = position + d * 4;
            // let pos = v[VA.pos];
            // let uv = v[VA.uv];
            // let vacolor = v[VA.color];
            // let normal = v[VA.normal];
            // let points = [x,y,r,y,r,b,x,b];
            // for(let i=0;i<8;i+=2){
            //     let dp = position + (i / 2) * d;
            //     p.x = points[i];
            //     p.y = points[i+1];
            //     if(undefined != matrix){
            //         f(matrix,p,p);
            //     }
            //     this.hitArea.updateArea(p.x,p.y,z);
            //     byte.wPoint3(dp+pos.offset,p.x,p.y,z)
            //     if(undefined != normal){
            //         byte.wPoint3(dp+normal.offset,0,0,1)
            //     }
            //     if(undefined != uv){
            //         byte.wPoint3(dp+uv.offset,originU,originV,0)
            //     }
            //     if(undefined != vacolor){
            //         byte.wPoint4(dp+vacolor.offset,red,green,blue,alpha)
            //     }
            //     this.numVertices += 1;
            // }
        };
        Graphics.prototype.drawBitmap = function (x, y, vo, color, matrix, alpha, z) {
            if (color === void 0) { color = 0xFFFFFF; }
            if (matrix === void 0) { matrix = undefined; }
            if (alpha === void 0) { alpha = 1; }
            if (z === void 0) { z = 0; }
            var w = vo.w, h = vo.h, ul = vo.ul, ur = vo.ur, vt = vo.vt, vb = vo.vb;
            var r = x + w;
            var b = y + h;
            var rgba = [
                ((color & 0x00ff0000) >>> 16) / 0xFF,
                ((color & 0x0000ff00) >>> 8) / 0xFF,
                (color & 0x000000ff) / 0xFF,
                alpha
            ];
            var noraml = [0, 0, 1];
            var index = this.target.$vcIndex;
            var f = rf.m2dTransform;
            var p = [0, 0, 0];
            var points = [x, y, ul, vt, r, y, ur, vt, r, b, ur, vb, x, b, ul, vb];
            for (var i = 0; i < 16; i += 4) {
                p[0] = points[i];
                p[1] = points[i + 1];
                p[2] = z;
                if (undefined != matrix) {
                    f(matrix, p, p);
                }
                this.addPoint(p, noraml, [points[i + 2], points[i + 3], index], rgba);
            }
            // let v = this.target.variables;
            // let f = m2dTransform;
            // let d = v["data32PerVertex"].size;
            // let position = this.byte.array.length;
            // this.byte.length = position + d*4;
            // let p = EMPTY_POINT2D;
            // let byte = this.byte;
            // let pos = v[VA.pos];
            // let uv = v[VA.uv];
            // let vacolor = v[VA.color];
            // let normal = v[VA.normal];
            // let red = ((color & 0x00ff0000) >>> 16) / 0xFF;
            // let green = ((color & 0x0000ff00) >>> 8) / 0xFF;
            // let blue = (color & 0x000000ff) / 0xFF;
            // let points = [x,y,ul,vt,r,y,ur,vt,r,b,ur,vb,x,b,ul,vb];
            // for(let i=0;i<16;i+=4){
            //     let dp = position + (i / 4) * d;
            //     p.x = points[i];
            //     p.y = points[i+1];
            //     if(undefined != matrix){
            //         f(matrix,p,p);
            //     }
            //     this.hitArea.updateArea(p.x,p.y,z);
            //     byte.wPoint3(dp+pos.offset,p.x,p.y,z)
            //     if(undefined != normal){
            //         byte.wPoint3(dp+normal.offset,0,0,1)
            //     }
            //     if(undefined != uv){
            //         byte.wPoint3(dp+uv.offset,points[i+2],points[i+3],0)
            //     }
            //     if(undefined != vacolor){
            //         byte.wPoint4(dp+vacolor.offset,red,green,blue,alpha)
            //     }
            //     this.numVertices += 1;
            // }
        };
        Graphics.prototype.drawCube = function (x, y, z, width, height, deep, color, alpha) {
            if (alpha === void 0) { alpha = 1; }
            var _a = this.target.source, originU = _a.originU, originV = _a.originV;
            var rgba = [
                ((color & 0x00ff0000) >>> 16) / 0xFF,
                ((color & 0x0000ff00) >>> 8) / 0xFF,
                (color & 0x000000ff) / 0xFF,
                alpha
            ];
            var uv = [originU, originV, this.target.$vcIndex];
            var noraml = [0, 0, 1];
            var x2 = x + width;
            var y2 = y + height;
            var z2 = z + deep;
            //前
            this.addPoint([x, y, z], noraml, uv, rgba);
            this.addPoint([x2, y, z], noraml, uv, rgba);
            this.addPoint([x2, y2, z], noraml, uv, rgba);
            this.addPoint([x, y2, z], noraml, uv, rgba);
            // beginFill(0x00FF00)
            //上
            this.addPoint([x, y, z], noraml, uv, rgba);
            this.addPoint([x, y, z2], noraml, uv, rgba);
            this.addPoint([x2, y, z2], noraml, uv, rgba);
            this.addPoint([x2, y, z], noraml, uv, rgba);
            // addPoint(x,		y,		z,		0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x,		y,		z2,	0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x2,	y,		z2,		0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x2,	y,		z,		0,0,	_fr,_fg,_fb,_fa);
            //左
            //			beginFill(0x0000FF)
            // addPoint(x,		y,		z,		0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x,		y2,	z,		0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x,		y2,	z2,		0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x,		y,		z2,	0,0,	_fr,_fg,_fb,_fa);
            //右
            //			beginFill(0xFFFF00)
            // addPoint(x2,	y,		z,		0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x2,	y,		z2,	0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x2,	y2,	z2,		0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x2,	y2,	z,		0,0,	_fr,_fg,_fb,_fa);
            //后
            //			beginFill(0x00FFFF);
            // addPoint(x,		y,		z2,	0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x,		y2,	z2,	0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x2,	y2,	z2,	0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x2,	y,		z2,	0,0,	_fr,_fg,_fb,_fa);
            //下
            //			beginFill(0xFF00FF)
            // addPoint(x,		y2,	z,		0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x,		y2,	z2,	0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x2,	y2,	z2,		0,0,	_fr,_fg,_fb,_fa);
            // addPoint(x2,	y2,	z,		0,0,	_fr,_fg,_fb,_fa);
        };
        return Graphics;
    }());
    rf.Graphics = Graphics;
    /**
     *  自动模型合并 渲染器
     *  原理:
     *      1.Sprite graphics 可以生成 【矢量图 + 贴图】的【四边形】 模型数据 vertexData  : 点定义为 vertex_ui_variable
     *      2.带有Batch渲染器的Sprite对象 自动收集children中所有graphics 模型信息 并生成合并的VertexData。VertexData会被封装进【BatchGeometry】进行渲染
     *        模型合并触发条件
     *          【1.children graphics 信息改变】
     *          【2.children visible = false|true】
     *          【3.children alpha = 0|>0】
     *      3.考虑到Sprite对象的children对象 可能也会自带渲染器 所以会生成很多的模型信息【BatchGeometry】  所以batch的rendersLink会表现为 【BatchGeometry】-> I3DRender ->【BatchGeometry】这样的渲染顺序
     *      4.被合并的children对象的x,y,scale,alpha等信息会被batch收集成一个Float32Array数据 每4位(vec4)为一个控制单元【x,y,scale,alpha】 用于shader计算
     *        所以children对象 x,y,scale,alpha 改变时 会重新收集数据【现在是只要chindren改变就全部无脑收集=。=】
     *      5.考虑到用户电脑 Max Vertex Uniform Vectors 数据不同【http://webglreport.com/】 所以要注意shader对象中ui[${max_vc}]
     *      6.dc()方法渲染 shader计算详看代码。
     */
    var BatchRenderer = /** @class */ (function () {
        function BatchRenderer(target) {
            this.geo = undefined;
            this.target = target;
            this.renders = new rf.Link();
        }
        BatchRenderer.prototype.render = function (camera, now, interval) {
            var target = this.target;
            var c = rf.context3D;
            var _a = this.target, source = _a.source, sceneTransform = _a.sceneTransform, states = _a.states, _x = _a._x, _y = _a._y, _scaleX = _a._scaleX;
            if (undefined == source) {
                return;
            }
            var textureData = source.textureData;
            if (!textureData) {
                source.textureData = textureData = c.getTextureData(source.name);
            }
            var t = rf.context3D.textureObj[textureData.key];
            if (undefined == t) {
                t = rf.context3D.createTexture(textureData, source.bmd);
            }
            this.t = t;
            if (states & 4 /* vertex */) {
                this.cleanBatch();
                //step1 收集所有可合并对象
                this.getBatchTargets(target, -_x, -_y, 1 / _scaleX);
                //step2 合并模型 和 vc信息
                this.toBatch();
                this.geo = undefined;
                target.states &= ~12 /* batch */;
            }
            else if (states & 8 /* vcdata */) {
                //坐标发生了变化 需要更新vcdata 逻辑想不清楚  那就全部vc刷一遍吧
                this.updateVCData(target, -_x, -_y, 1 / _scaleX);
                target.states &= ~8 /* vcdata */;
            }
            if (undefined == this.program) {
                this.createProgram();
            }
            var vo = this.renders.getFrist();
            while (vo) {
                if (vo.close == false) {
                    var render = vo.data;
                    if (render instanceof BatchGeometry) {
                        this.dc(camera, render);
                    }
                    else {
                        render.render(camera, now, interval);
                    }
                }
                vo = vo.next;
            }
        };
        BatchRenderer.prototype.dc = function (camera, geo) {
            // context3D.setBlendFactors()
            var c = rf.context3D;
            var v = geo.$vertexBuffer;
            if (undefined == v) {
                geo.$vertexBuffer = v = c.createVertexBuffer(geo.vertex, geo.vertex.data32PerVertex);
            }
            var g = rf.gl;
            var _a = this.target, scrollRect = _a.scrollRect, sceneTransform = _a.sceneTransform;
            var worldTransform = rf.TEMP_MATRIX;
            if (scrollRect) {
                var x = scrollRect.x, y = scrollRect.y, w = scrollRect.w, h = scrollRect.h;
                c.setScissor(sceneTransform[12], sceneTransform[13], w, h);
                worldTransform.m3_translation(x, y, 0, true, sceneTransform);
                worldTransform.m3_append(camera.worldTranform);
            }
            else {
                worldTransform.m3_append(camera.worldTranform, false, sceneTransform);
            }
            var i = c.getIndexByQuad(geo.quadcount);
            var p = this.program;
            c.setProgram(p);
            c.setProgramConstantsFromMatrix("mvp" /* mvp */, worldTransform);
            c.setProgramConstantsFromVector("ui" /* ui */, geo.vcData, 4);
            this.t.uploadContext(p, 0, "diff" /* diff */);
            v.uploadContext(p);
            c.drawTriangles(i, geo.quadcount * 2);
        };
        BatchRenderer.prototype.createProgram = function () {
            var chunk = rf.singleton(rf.Shader);
            var keys = {};
            keys[chunk.att_uv_ui.key] = chunk.att_uv_ui;
            keys[chunk.uni_v_mvp.key] = chunk.uni_v_mvp;
            var vcode = chunk.createVertex(undefined, keys);
            // let vcode = `
            //     attribute vec3 pos;
            //     attribute vec3 uv;
            //     attribute vec4 color;
            //     uniform mat4 mvp;
            //     uniform vec4 ui[${max_vc}];
            //     varying vec2 vUV;
            //     varying vec4 vColor;
            //     void main(void){
            //         vec4 p = vec4(pos,1.0);
            //         vec4 t = ui[int(uv.z)];
            //         p.xy = p.xy + t.xy;
            //         p.xy = p.xy * t.zz;
            //         gl_Position = mvp * p;
            //         vUV.xy = uv.xy;
            //         p = color;
            //         p.w = color.w * t.w;
            //         vColor = p;
            //     }
            // `
            keys = {};
            keys[chunk.uni_f_diff.key] = chunk.uni_f_diff;
            keys[chunk.att_uv_ui.key] = chunk.att_uv_ui;
            var fcode = chunk.createFragment(undefined, keys);
            // let fcode = `
            //     precision mediump float;
            //     uniform sampler2D diff;
            //     varying vec4 vColor;
            //     varying vec2 vUV;
            //     void main(void){
            //         vec4 color = texture2D(diff, vUV);
            //         gl_FragColor = vColor*color;
            //     }
            // `
            // let vcode = `
            //     attribute vec3 pos;
            //     uniform mat4 mvp;
            //     void main(void){
            //         vec4 p = vec4(pos,1.0);
            //         gl_Position = mvp * p;
            //     }
            // `
            // let fcode = `
            //     precision mediump float;
            //     void main(void){
            //         gl_FragColor = vec4(1,0,0,1);
            //     }
            // `
            this.program = rf.context3D.createProgram(vcode, fcode);
        };
        BatchRenderer.prototype.cleanBatch = function () {
            var vo = this.renders.getFrist();
            while (vo) {
                if (vo.close == false) {
                    var render = vo.data;
                    if (render instanceof BatchGeometry) {
                        render.recycle();
                    }
                    vo.close = true;
                }
                vo = vo.next;
            }
            this.renders.clean();
        };
        BatchRenderer.prototype.getBatchTargets = function (render, ox, oy, os) {
            var target;
            if (render instanceof Sprite) {
                target = render;
            }
            else {
                this.renders.add(render);
                this.geo = undefined;
                return;
            }
            if (false == target._visible || 0.0 >= target.sceneAlpha) {
                target.$vcIndex = -1;
                target.$batchGeometry = null;
                return;
            }
            var g = target.$graphics;
            ox = target._x + ox;
            oy = target._y + oy;
            os = target._scaleX * os;
            if (target == this.target || (null == target.renderer && false == target.nativeRender)) {
                if (undefined == g || 0 >= g.numVertices) {
                    target.$vcIndex = -1;
                    target.$batchGeometry = null;
                }
                else {
                    if (undefined == this.geo) {
                        this.geo = rf.recyclable(BatchGeometry);
                        this.renders.add(this.geo);
                    }
                    var i = this.geo.add(target, g);
                    target.$vcox = ox;
                    target.$vcoy = oy;
                    target.$vcos = os;
                    if (i >= rf.max_vc) {
                        this.geo = undefined;
                    }
                }
            }
            else {
                this.renders.add(target);
                this.geo = undefined;
                return;
            }
            for (var _i = 0, _a = target.childrens; _i < _a.length; _i++) {
                var child = _a[_i];
                if (child instanceof Sprite) {
                    this.getBatchTargets(child, ox, oy, os);
                }
                else if (child instanceof RenderBase) {
                    this.renders.add(child);
                    this.geo = undefined;
                }
            }
        };
        BatchRenderer.prototype.updateVCData = function (render, ox, oy, os) {
            var target;
            if (render instanceof Sprite) {
                target = render;
            }
            else {
                return;
            }
            if (false == target._visible || 0.0 >= target.sceneAlpha) {
                target.$vcIndex = -1;
                target.$batchGeometry = null;
                return;
            }
            var g = target.$graphics;
            ox = target._x + ox;
            oy = target._y + oy;
            os = target._scaleX * os;
            if (target == this.target || (null == target.renderer && false == target.nativeRender)) {
                if (undefined != target.$batchGeometry) {
                    target.$vcox = ox;
                    target.$vcoy = oy;
                    target.$vcos = os;
                    target.$batchGeometry.vcData.wPoint4(rf.sp.$vcIndex * 4, rf.sp.$vcox, rf.sp.$vcoy, rf.sp.$vcos, rf.sp.sceneAlpha);
                }
            }
            else {
                return;
            }
            for (var _i = 0, _a = target.childrens; _i < _a.length; _i++) {
                var child = _a[_i];
                if (child instanceof Sprite) {
                    this.updateVCData(child, ox, oy, os);
                }
            }
        };
        BatchRenderer.prototype.toBatch = function () {
            var vo = this.renders.getFrist();
            var target = this.target;
            while (vo) {
                if (vo.close == false) {
                    var render = vo.data;
                    if (render instanceof BatchGeometry) {
                        render.build(target);
                    }
                }
                vo = vo.next;
            }
        };
        return BatchRenderer;
    }());
    rf.BatchRenderer = BatchRenderer;
    var BatchGeometry = /** @class */ (function () {
        function BatchGeometry() {
            this.vci = 0;
            this.verlen = 0;
        }
        ;
        BatchGeometry.prototype.add = function (target, g) {
            if (undefined == this.link) {
                this.link = new rf.Link();
            }
            target.$vcIndex = this.vci++;
            target.$batchGeometry = this;
            g.$batchOffset = this.verlen;
            this.verlen += g.byte.length;
            this.link.add(target);
            return this.vci;
        };
        BatchGeometry.prototype.build = function (target) {
            var variables = target.variables;
            this.vertex = new rf.VertexInfo(this.verlen, variables["data32PerVertex"].size);
            this.vertex.variables = variables;
            this.quadcount = this.vertex.numVertices / 4;
            this.vcData = new Float32Array(this.quadcount * 4);
            var byte = this.vertex.vertex;
            var vo = this.link.getFrist();
            while (vo) {
                if (vo.close == false) {
                    var sp_1 = vo.data;
                    var g = sp_1.$graphics;
                    if (sp_1.$vcIndex > 0) {
                        g.byte.update(this.vertex.data32PerVertex, rf.vertex_ui_variable["uv"].offset + 2, sp_1.$vcIndex);
                    }
                    byte.set(g.byte, g.$batchOffset);
                    this.vcData.wPoint4(sp_1.$vcIndex * 4, sp_1.$vcox, sp_1.$vcoy, sp_1.$vcos, sp_1.sceneAlpha);
                }
                vo = vo.next;
            }
        };
        BatchGeometry.prototype.update = function (position, byte) {
            if (undefined != this.vertex) {
                this.vertex.vertex.set(byte, position);
            }
            if (undefined != this.$vertexBuffer) {
                this.$vertexBuffer.readly = false;
            }
        };
        BatchGeometry.prototype.updateVC = function (sp) {
            this.vcData.wPoint4(sp.$vcIndex * 4, sp.$vcox, sp.$vcoy, sp.$vcos, sp.sceneAlpha);
        };
        //x,y,z,u,v,vci,r,g,b,a;
        BatchGeometry.prototype.onRecycle = function () {
            this.vertex = undefined;
            this.verlen = 0;
            this.vci = 0;
            this.$vertexBuffer = null;
            this.vcData = null;
            var vo = this.link.getFrist();
            while (vo) {
                if (vo.close == false) {
                    var sp_2 = vo.data;
                    if (sp_2.$batchGeometry == this) {
                        sp_2.$batchGeometry = null;
                        sp_2.$vcIndex = -1;
                        sp_2.$vcos = 1;
                        sp_2.$vcox = 0;
                        sp_2.$vcoy = 0;
                    }
                }
                vo = vo.next;
            }
            this.link.onRecycle();
        };
        return BatchGeometry;
    }());
    rf.BatchGeometry = BatchGeometry;
})(rf || (rf = {}));
//# sourceMappingURL=Sprite.js.map