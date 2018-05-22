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
///<reference path="./Mesh.ts" />
var rf;
(function (rf) {
    var ParticleGeometry = /** @class */ (function (_super) {
        __extends(ParticleGeometry, _super);
        function ParticleGeometry() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ParticleGeometry.prototype.setRuntime = function (runtime) {
            this.initData(runtime);
            this.runtimeData = runtime;
        };
        ParticleGeometry.prototype.uploadContext = function (camera, mesh, program, now, interval) {
            // super.uploadContext(camera, mesh, program, now, interval);
            var c = rf.context3D;
            var sceneTransform = mesh.sceneTransform;
            var vertexBuffer = this.runtimeData.vertexBuffer;
            var _a = mesh.data, setting = _a.setting, nodes = _a.nodes;
            //设置模型顶点数据 (pos uv)
            this.vertex.uploadContext(program);
            //设置模型particle点数据(pos rot sca time velocity accelerition billboard ...)
            vertexBuffer.uploadContext(program);
            var worldTranform = rf.TEMP_MATRIX;
            var rot = rf.TEMP_VECTOR3D;
            //设置矩阵信息
            worldTranform.m3_append(camera.worldTranform, false, sceneTransform);
            c.setProgramConstantsFromMatrix("mvp" /* mvp */, worldTranform);
            //BILLBOARD
            if (nodes["p_billboard" /* BILLBOARD */]) {
                worldTranform.m3_append(camera.sceneTransform, false, sceneTransform);
                if (nodes["p_rotation2head" /* ROTATION_HEAD */]) {
                    c.setProgramConstantsFromMatrix("mv" /* mv */, worldTranform);
                }
                worldTranform.m3_decompose(undefined, rot, undefined, 1 /* AXIS_ANGLE */);
                worldTranform.m3_rotation(-rot.w, rot, false, rf_m3_identity);
                c.setProgramConstantsFromMatrix("invm" /* invm */, worldTranform);
            }
            var node = nodes["p_segment_color" /* SEGMENT_COLOR */];
            if (node) {
                var segmentData = node.data;
                if (segmentData instanceof ArrayBuffer) {
                    node.data = segmentData = new Float32Array(segmentData);
                }
                c.setProgramConstantsFromVector("p_segment_color" /* SEGMENT_COLOR */, segmentData, 4);
            }
            node = nodes["p_sprite_sheet_anim" /* SPRITE_SHEET */];
            if (node) {
                var data = node.data;
                if (data instanceof ArrayBuffer) {
                    node.data = data = new Float32Array(data);
                }
                c.setProgramConstantsFromVector("p_sprite_sheet_anim" /* SPRITE_SHEET */, data, 4);
            }
            //TIME
            c.setProgramConstantsFromVector("now" /* NOW */, rf.engineNow / 1000 * setting.speed, 1, false);
            return worldTranform;
        };
        return ParticleGeometry;
    }(rf.GeometryBase));
    rf.ParticleGeometry = ParticleGeometry;
    var Particle = /** @class */ (function (_super) {
        __extends(Particle, _super);
        function Particle() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Particle.prototype.load = function (url) {
            if (url.lastIndexOf(".pa" /* PARTICLE */) == -1) {
                url += ".pa" /* PARTICLE */;
            }
            if (url.indexOf("://") == -1) {
                url = rf.particle_Perfix + url;
            }
            rf.loadRes(url, this.loadCompelte, this, 0 /* bin */);
        };
        Particle.prototype.loadCompelte = function (e) {
            var item = e.data;
            var byte = item.data;
            var o = rf.amf_readObject(byte);
            this.play(o);
        };
        Particle.prototype.play = function (data) {
            this.data = data;
            var settingData = data.setting, meshData = data.mesh, materialData = data.material, runtimeData = data.runtime;
            var _a = this, geometry = _a.geometry, material = _a.material;
            if (!geometry) {
                this.geometry = geometry = new ParticleGeometry();
            }
            geometry.setData(meshData);
            geometry.setRuntime(runtimeData);
            if (!material) {
                this.material = material = new ParticleMaterial();
            }
            material.setData(materialData);
        };
        return Particle;
    }(rf.Mesh));
    rf.Particle = Particle;
    var ParticleMaterial = /** @class */ (function (_super) {
        __extends(ParticleMaterial, _super);
        function ParticleMaterial() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ParticleMaterial.prototype.getTextUrl = function (data) {
            return rf.particle_Texture_Perfix + data.url;
        };
        ParticleMaterial.prototype.uploadContext = function (camera, mesh, now, interval) {
            var c = rf.context3D;
            var _a = this, program = _a.program, diffTex = _a.diffTex;
            if (!diffTex) {
                return false;
            }
            var b = this.checkTexs(diffTex);
            if (false == b) {
                return false;
            }
            if (!program) {
                this.program = program = this.createProgram(mesh);
            }
            c.setProgram(program);
            this.uploadContextSetting();
            var t;
            if (undefined != diffTex) {
                t = c.textureObj[diffTex.key];
                t.uploadContext(program, 0, "diff" /* diff */);
            }
            return true;
        };
        ParticleMaterial.prototype.createProgram = function (mesh) {
            var nodes = mesh.data.nodes;
            var node = nodes["p_time" /* TIME */];
            var vertexDefine = "";
            var vertexFunctions = this.timeNode(node);
            var fragmentDefine = "";
            var fragmentFunctions = "";
            //速度
            node = nodes["p_velocity" /* VELOCITY */];
            if (node) {
                vertexDefine += "#define VELOCITY\n";
            }
            //加速度
            node = nodes["p_accelerition" /* ACCELERITION */];
            if (node) {
                vertexDefine += "#define ACCELERITION\n";
            }
            //初始化旋转
            node = nodes["p_init_rotation" /* ROTATION */];
            if (node) {
                vertexDefine += "#define ROTATION\n";
            }
            //旋转速度
            node = nodes["p_vrotation" /* VROTATION */];
            if (node) {
                vertexDefine += "#define VROTATION\n";
            }
            //旋转到方向
            node = nodes["p_rotation2head" /* ROTATION_HEAD */];
            if (node) {
                vertexDefine += "#define ROTATION_HEAD\n";
            }
            //缩放
            node = nodes["p_scale" /* SCALE */];
            if (node) {
                vertexFunctions += this.scaleNode(node);
                vertexDefine += "#define SCALE\n";
            }
            //公告板(始终面朝摄像机)
            node = nodes["p_billboard" /* BILLBOARD */];
            if (node) {
                vertexDefine += "#define BILLBOARD\n";
            }
            node = nodes["p_position" /* POSITION */];
            if (node) {
                vertexDefine += "#define POSITION\n";
            }
            node = nodes["p_segment_color" /* SEGMENT_COLOR */];
            if (node) {
                vertexFunctions += this.segmentColorNode(node);
                vertexDefine += "#define SegmentColor\n";
                fragmentDefine += "#define SegmentColor\n";
            }
            node = nodes["p_sprite_sheet_anim" /* SPRITE_SHEET */];
            if (node) {
                fragmentFunctions += this.spriteSheetNode(node);
                fragmentDefine += "#define SPRITE_SHEET\n";
            }
            var vertexCode = "\n                " + vertexDefine + "\n\n                precision mediump float;\n\n                attribute vec3 " + "pos" /* pos */ + ";\n                attribute vec2 " + "uv" /* uv */ + ";\n                attribute vec4 " + "p_time" /* TIME */ + ";\n                attribute vec3 " + "p_velocity" /* VELOCITY */ + ";\n                attribute vec3 " + "p_accelerition" /* ACCELERITION */ + ";\n                attribute vec4 " + "p_init_rotation" /* ROTATION */ + ";\n                attribute vec4 " + "p_vrotation" /* VROTATION */ + ";\n                attribute vec4 " + "p_scale" /* SCALE */ + ";\n                attribute vec3 " + "p_position" /* POSITION */ + ";\n\n                uniform mat4 " + "mvp" /* mvp */ + ";\n                uniform mat4 " + "invm" /* invm */ + ";\n                uniform mat4 " + "mv" /* mv */ + ";\n\n                uniform float " + "now" /* NOW */ + ";\n                \n\n                varying vec2 vUV;\n                varying vec2 vTime;\n                varying vec4 vSegMul;\n                varying vec4 vSegAdd;\n\n                " + vertexFunctions + "\n\n                void quaXpos(in vec4 qua,inout vec3 pos){\n                    vec4 temp = vec4(cross(qua.xyz,pos.xyz) + (qua.w * pos.xyz) , -dot(qua.xyz,pos.xyz));\n                    pos = cross(temp.xyz,-qua.xyz) + (qua.w * temp.xyz) - (temp.w * qua.xyz);\n                }\n\n                void main(void) {\n                    vec3 b_pos = " + "pos" /* pos */ + ";\n                    vec3 p_pos = vec3(0.0);\n                    vec3 b_veo = vec3(0.0);\n                    vec4 temp = vec4(0.0);\n                    \n                    //\u5148\u5904\u7406\u65F6\u95F4  vec2 timeNode(float now,in vec3 pos,in vec4 time)\n                    vec2 time = timeNode(" + "now" /* NOW */ + ",b_pos," + "p_time" /* TIME */ + ");\n\n#ifdef VELOCITY\n                    //\u5904\u7406\u901F\u5EA6\n                    b_veo += " + "p_velocity" /* VELOCITY */ + ";\n                    p_pos += (time.xxx * b_veo);\n#endif\n                    \n                   \n#ifdef ACCELERITION \n                    //\u52A0\u901F\u5EA6\n                    temp = " + "p_accelerition" /* ACCELERITION */ + " * time.x; //at;\n                    b_veo += temp;                              //vt = v0+a*t;\n                    p_pos += temp * time.x * 0.5;               //s = v0*t + a*t*t*0.5;\n#endif\n\n#ifdef ROTATION     \n                    //\u521D\u59CB\u5316\u65CB\u8F6C\u89D2\u5EA6\n                    quaXpos(" + "p_init_rotation" /* ROTATION */ + ",b_pos);\n#endif\n\n#ifdef VROTATION    \n                        //\u65CB\u8F6C\u52A8\u753B\n                    temp = " + "p_vrotation" /* VROTATION */ + ";\n                    temp.w *= time.x;\n                    temp.xyz *= sin(temp.w);\n                    temp.w = cos(temp.w);\n                    quaXpos(temp,b_pos);\n#endif\n\n#ifdef ROTATION_HEAD    \n                    // b_veo = vec3(-1.0,0.0,0.0);\n                    //if b_veo.yz is (0,0) ,change it to (0.00001,0);\n                    b_veo.y += step(b_veo.y+b_veo.z,0.0) * 0.00001;\n    #ifdef BILLBOARD\n                    temp = " + "mv" /* mv */ + " * vec4(b_veo,0.0);\n                    temp.xyz = normalize(vec3(temp.xy,0.0));\n                    b_pos =  b_pos * mat3(\n                        temp.x,-temp.y,0.0,\n                        temp.y,temp.x,0.0,\n                        0.0,0.0,1.0);\n    #else\n                    b_veo = normalize(b_veo);\n                    vec3 xAxis = vec3(1.0,0.0,0.0);\n                    temp.w = dot(b_veo,xAxis);\n                    temp.xyz = normalize(cross(xAxis,b_veo));\n\n                    //\u4E24\u500D\u89D2\u516C\u5F0F\u83B7\u5F97 cos sin\n                    //cos2a = cosa^2 - sina^2 = 2cosa^2 - 1 = 1 - 2sina^2;\n                    //cosa = sqt((1 + cos2a)/2);\n                    //sina = sqt((1 - cos2a)/2);\n\n                    temp.xyz *= sqrt( (1.0-temp.w) * 0.5);\n                    temp.w = sqrt((1.0 + temp.w) * 0.5);\n                    quaXpos(temp,b_pos);\n                   \n    #endif\n#endif\n\n#ifdef SCALE\n                    //\u7F29\u653E\n                    scaleNode(" + "p_scale" /* SCALE */ + ",time,b_pos);\n#endif\n\n#ifdef BILLBOARD\n                     b_pos = (vec4(b_pos,0.0) * " + "invm" /* invm */ + ").xyz;\n#endif\n\n#ifdef POSITION\n                     b_pos += " + "p_position" /* POSITION */ + ";\n#endif\n\n\n#ifdef SegmentColor\n                    segmentColorNode(time);\n#endif\n\n                    vUV = " + "uv" /* uv */ + ";\n                    vTime = time;\n                    gl_Position = " + "mvp" /* mvp */ + " * vec4(b_pos + p_pos,1.0);\n                }\n";
            var fragmentCode = "\n                precision mediump float;\n\n                " + fragmentDefine + "\n\n                " + fragmentFunctions + "\n\n                uniform sampler2D " + "diff" /* diff */ + ";\n\n                varying vec2 vUV;\n                varying vec2 vTime;\n                varying vec4 vSegMul;\n                varying vec4 vSegAdd;\n\n                void main(void){\n                    vec2 tUV = vUV;\n#ifdef SPRITE_SHEET\n                    segmentColorNode(vTime,tUV);\n#endif\n                    vec4 c = texture2D(" + "diff" /* diff */ + ", tUV);\n                    // c = vec4(vTime.y);\n                    // c.w = 1.0;\n#ifdef SegmentColor\n                    c *= vSegMul;\n                    c += vSegAdd;\n#endif\n                    gl_FragColor = c;\n                    // gl_FragColor = vec4(1.0);\n                }\n\n            ";
            var c = rf.context3D;
            var p = c.createProgram(vertexCode, fragmentCode);
            return p;
        };
        //======================================================================
        //Nodes
        //======================================================================
        //==========================TimeNode====================================
        ParticleMaterial.prototype.timeNode = function (info) {
            var vcode = "\n                vec2 timeNode(float now,in vec3 pos,in vec4 time){\n                    //time: x:startTime, y:durtion,z:delay+durtion,w:1/durtion;\n                    //o: time, time * 1/durtion;\n\n                    now = now - time.x;\n                    pos *= step(0.0,now);\n                    \n                    vec2 o = vec2(0.0,0.0);\n            ";
            if (info.usesDuration) {
                if (info.usesLooping) {
                    if (info.usesDelay) {
                        vcode += "\n                    o.x = fract(now / time.z) * time.z\n                    pos *= step(o.x,time.y);\n                        ";
                    }
                    else {
                        vcode += "\n                    o.x = fract(now * time.w) * time.y;      \n                        ";
                    }
                }
                else {
                    vcode += "\n                    o.x = now * time.w;\n                    pos *= step(now,time.y);  \n                    ";
                }
            }
            else {
                vcode += "\n                    o.x = now;\n                ";
            }
            vcode += "\n                    o.y = o.x * time.w;\n                    return o;\n                }\n            ";
            return vcode;
        };
        //==========================VELOCITY_Node====================================
        ParticleMaterial.prototype.scaleNode = function (info) {
            var vcode = "\n                void scaleNode(in vec4 scale,in vec2 time,inout vec3 pos){\n                    float temp = 0.0;";
            if (info.usesCycle) {
                if (info.usesPhase) {
                    vcode += "\n                    temp += sin(scale.z * time.y + scale.w);";
                }
                else {
                    vcode += "\n                    temp = sin(scale.z * time.y);";
                }
            }
            else {
                vcode += "\n                    temp = time.y;";
            }
            vcode += "\n                    temp = (temp * scale.y) + scale.x;\n            ";
            switch (info.scaleType) {
                case 0:
                    vcode += "\n                    pos.xyz *= temp;";
                    break;
                case 1:
                    vcode += "\n                    pos.x *= temp;";
                    break;
                case 2:
                    vcode += "\n                    pos.y *= temp;";
                    break;
                case 3:
                    vcode += "\n                    pos.z *= temp;";
                    break;
            }
            vcode += "\n                }\n            ";
            return vcode;
        };
        ParticleMaterial.prototype.segmentColorNode = function (info) {
            var data = info.data, usesMul = info.usesMul, usesAdd = info.usesAdd, add = info.add, mul = info.mul, len = info.len;
            if (data instanceof ArrayBuffer) {
                info.data = data = new Float32Array(info.data);
            }
            var vcode = "\n                uniform vec4 " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + data.length / 4 + "];\n                void segmentColorNode(in vec2 time){\n                    vec4 life = " + "p_segment_color" /* SEGMENT_COLOR */ + "[0];\n                    vec4 temp = vec4(0.0);";
            if (usesMul) {
                vcode += "\n                    vec4 mul = " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + mul + "];";
            }
            else {
                vcode += "\n                    vec4 mul = vec4(1.0);";
            }
            if (usesAdd) {
                vcode += "\n                    vec4 add = " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + add + "];";
            }
            else {
                vcode += "\n                    vec4 add = vec4(0.0);";
            }
            if (len > 0) {
                vcode += "\n                    temp.x = min(life.x , time.y);";
                if (usesMul) {
                    vcode += "\n                    mul += temp.x * " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + (mul + 2) + "];";
                }
                if (usesAdd) {
                    vcode += "\n                    add += temp.x * " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + (add + 2) + "];";
                }
            }
            if (len > 1) {
                vcode += "\n                    temp.x = min(life.y , max(0.0 , time.y - life.x));";
                if (usesMul) {
                    vcode += "\n                    mul += temp.x * " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + (mul + 3) + "];";
                }
                if (usesAdd) {
                    vcode += "\n                    add += temp.x * " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + (add + 3) + "];";
                }
            }
            if (len > 2) {
                vcode += "\n                    temp.x = min(life.z , max(0.0 , temp.x - life.y));";
                if (usesMul) {
                    vcode += "\n                    mul += temp.x * " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + (mul + 4) + "];";
                }
                if (usesAdd) {
                    vcode += "\n                    add += temp.x * " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + (add + 4) + "];";
                }
            }
            if (len > 3) {
                vcode += "\n                    temp.x = min(life.w , max(0.0 , temp.x - life.z));";
                if (usesMul) {
                    vcode += "\n                    mul += temp.x * " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + (mul + 5) + "];";
                }
                if (usesAdd) {
                    vcode += "\n                    add += temp.x * " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + (add + 5) + "];";
                }
            }
            if (len == 0) {
                vcode += "\n                    temp.y = time.y;";
            }
            else {
                switch (len) {
                    case 1:
                        vcode += "\n                    temp.y = max(0.0,time.y - life.x);";
                        break;
                    case 2:
                        vcode += "\n                    temp.y = max(0.0,time.y - life.y);";
                        break;
                    case 3:
                        vcode += "\n                    temp.y = max(0.0,time.y - life.z);";
                        break;
                    case 4:
                        vcode += "\n                    temp.y = max(0.0,time.y - life.w);";
                        break;
                }
            }
            if (usesMul) {
                vcode += "\n                    mul += temp.y * " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + (mul + 1) + "];";
            }
            if (usesAdd) {
                vcode += "\n                    add += temp.y * " + "p_segment_color" /* SEGMENT_COLOR */ + "[" + (add + 1) + "];";
            }
            vcode += "\n                    vSegMul = mul;\n                    vSegAdd = add;";
            vcode += "\n                }";
            return vcode;
        };
        ParticleMaterial.prototype.spriteSheetNode = function (info) {
            var rows = info.rows, usesCycle = info.usesCycle, usesPhase = info.usesPhase;
            var code = "\n                uniform vec4 " + "p_sprite_sheet_anim" /* SPRITE_SHEET */ + "[2];\n                void segmentColorNode(in vec2 time,inout vec2 uv){\n                    vec4 data = " + "p_sprite_sheet_anim" /* SPRITE_SHEET */ + "[0];\n                    vec4 info = " + "p_sprite_sheet_anim" /* SPRITE_SHEET */ + "[1];\n                    vec2 temp = vec2(0.0);\n                    uv.x *= data.y;";
            if (rows > 1) {
                code += "\n                    uv.y *= data.z;";
            }
            if (usesCycle) {
                if (usesPhase) {
                    code += "\n                    temp.x = time.x + info.z;\n                    ";
                }
                else {
                    code += "\n                    temp.x = time.x;\n                    ";
                }
                code += "\n                    temp.y = fract(temp.x / info.y) * info.y * info.x;";
            }
            else {
                code += "\n                    temp.y = time.y * data.x;";
            }
            if (rows > 1) {
                code += "\n                    uv.y += (temp.y - fract(temp.y)) * data.z;";
            }
            code += "\n                    temp.x = temp.y / data.y;\n                    temp.x = (temp.x - fract(temp.x)) * data.y;";
            if (rows > 1) {
                code += "\n                    uv.x += fract(temp.x);";
            }
            else {
                code += "\n                    uv.x += temp.x;";
            }
            code += "\n                }";
            return code;
        };
        return ParticleMaterial;
    }(rf.Material));
    rf.ParticleMaterial = ParticleMaterial;
})(rf || (rf = {}));
//# sourceMappingURL=Particle.js.map