var rf;
(function (rf) {
    var Shader = /** @class */ (function () {
        function Shader() {
            this.att_uv_ui = {
                key: "a1",
                vdef: "\n                attribute vec4 " + "color" /* color */ + ";\n                attribute vec3 " + "uv" /* uv */ + ";\n                uniform vec4 ui[" + rf.max_vc + "];\n            ",
                vary: "\n                varying vec2 vUV;  \n                varying vec4 vColor;\n            ",
                vcode: "\n                vec4 tv = ui[int(" + "uv" /* uv */ + ".z)];\n                p.xy = p.xy + tv.xy;\n                p.xy = p.xy * tv.zz;\n\n                vec4 tc = " + "color" /* color */ + ";\n                tc.w = tc.w * tv.w;\n                vColor = tc;\n                vUV.xy = " + "uv" /* uv */ + ".xy;\n            ",
                fcode: "\n                color = vColor*color;\n            "
            };
            this.att_uv = {
                key: "a2",
                vdef: "\n                attribute vec2 " + "uv" /* uv */ + "\n            ",
                vary: "\n                varying vec2 vUV;  \n            ",
                vcode: "\n                vUV.xy = " + "uv" /* uv */ + ".xy;\n            ",
                fcode: "\n                vec2 tUV = vUV;\n            "
            };
            this.att_color = {
                key: "a3",
                vdef: "\n                attribute vec4 " + "color" /* color */ + ";\n            ",
                vary: "\n                varying vec4 vColor;\n            ",
                vcode: "\n                vColor = " + "color" /* color */ + ";\n            ",
                fcode: "\n                color = vColor;\n            "
            };
            this.att_normal = {
                key: "a4",
                vdef: "\n                attribute vec3 " + "normal" /* normal */ + ";\n            ",
                vcode: "\n                _normal = " + "normal" /* normal */ + ";\n            "
            };
            // uni_v_m = {
            //     key:"u1",
            //     vdef:`
            //         uniform mat4 m;
            //     `
            // }
            // uni_v_v = {
            //     key:"u2",
            //     vdef:`
            //         uniform mat4 v;
            //     `
            // }
            this.uni_v_p = {
                key: "u3",
                vdef: "\n                uniform mat4 " + "p" /* p */ + ";\n            "
            };
            this.uni_v_mv = {
                key: "u4",
                vdef: "\n                uniform mat4 " + "mv" /* mv */ + ";\n            "
            };
            this.uni_v_mvp = {
                key: "u5",
                vdef: "\n                uniform mat4 " + "mvp" /* mvp */ + ";\n            ",
                vcode: "\n                p = mvp * p;\n            "
            };
            this.uni_f_diff = {
                key: "u5",
                fdef: "\n                uniform sampler2D " + "diff" /* diff */ + ";\n            ",
                fcode: "\n                vec4 color = texture2D(" + "diff" /* diff */ + ", tUV);\n            "
            };
            this.uni_v_inv_m = {
                key: "u6",
                vdef: "\n                uniform mat4 " + "invm" /* invm */ + ";\n            "
            };
            this.uni_v_dir = {
                key: "u7",
                vdef: "\n                uniform vec3 lightDirection;\n            "
            };
            this.uni_v_light = {};
        }
        Shader.prototype.createVertex = function (define, modules) {
            var code = "";
            var chunk;
            for (var str in define) {
                code += "#define " + str + "\n";
            }
            code += "attribute vec3 " + "pos" /* pos */ + ";\n";
            for (var str in modules) {
                chunk = modules[str];
                if (undefined != chunk.vdef) {
                    code += chunk.vdef;
                }
                if (undefined != chunk.vary) {
                    code += chunk.vary;
                }
            }
            code += "\n            void main(void){\n                vec4 p = vec4(" + "pos" /* pos */ + ",1.0);\n            ";
            chunk = modules[this.att_uv_ui.key];
            if (undefined != chunk) {
                code += chunk.vcode + "\n";
            }
            chunk = modules[this.uni_v_mvp.key];
            if (undefined != chunk) {
                code += chunk.vcode + "\n";
            }
            code += "\n                gl_Position = p;\n            }\n            ";
            return code;
        };
        Shader.prototype.createFragment = function (define, modules) {
            var code = "";
            var chunk;
            for (var str in define) {
                code += "#define " + str + "\n";
            }
            code += "precision mediump float;\n";
            for (var str in modules) {
                chunk = modules[str];
                if (undefined != chunk.fdef) {
                    code += chunk.fdef + "\n";
                }
                if (undefined != chunk.vary) {
                    code += chunk.vary + "\n";
                }
            }
            code += "\n            void main(void){\n            ";
            chunk = modules[this.att_uv.key];
            if (undefined != chunk) {
                code += chunk.fcode + "\n";
            }
            chunk = modules[this.att_uv_ui.key];
            if (undefined != chunk) {
                code += "vec2 tUV = vUV;\n";
            }
            chunk = modules[this.uni_f_diff.key];
            if (undefined != chunk) {
                code += chunk.fcode + "\n";
            }
            chunk = modules[this.att_uv_ui.key];
            if (undefined != chunk) {
                code += chunk.fcode + "\n";
            }
            code += "\n                gl_FragColor = color;\n\n            }\n            ";
            return code;
        };
        return Shader;
    }());
    rf.Shader = Shader;
})(rf || (rf = {}));
//# sourceMappingURL=Shader.js.map