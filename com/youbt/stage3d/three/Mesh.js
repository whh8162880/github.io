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
///<reference path="../Stage3D.ts" />
var rf;
(function (rf) {
    rf.skeletonMeshObj = {};
    var Mesh = /** @class */ (function (_super) {
        __extends(Mesh, _super);
        function Mesh(variables) {
            var _this = _super.call(this, variables ? variables : rf.vertex_mesh_variable) || this;
            _this.invSceneTransform = rf.newMatrix3D();
            _this.nativeRender = true;
            return _this;
        }
        Mesh.prototype.updateSceneTransform = function () {
            _super.prototype.updateSceneTransform.call(this);
            var _a = this, invSceneTransform = _a.invSceneTransform, sceneTransform = _a.sceneTransform;
            invSceneTransform.m3_invert(sceneTransform);
        };
        Mesh.prototype.renderShadow = function (sun, p, c, worldTranform, now, interval) {
            var _a = this, geometry = _a.geometry, sceneTransform = _a.sceneTransform, skAnim = _a.skAnim;
            geometry.vertex.uploadContext(p);
            worldTranform.m3_append(sun.worldTranform, false, sceneTransform);
            c.setProgramConstantsFromMatrix("mvp" /* mvp */, worldTranform);
            if (undefined != skAnim) {
                skAnim.uploadContext(sun, this, p, now, interval);
            }
        };
        Mesh.prototype.render = function (camera, now, interval) {
            var _a = this, geometry = _a.geometry, material = _a.material, skAnim = _a.skAnim;
            if (undefined != geometry && undefined != material) {
                var b = material.uploadContext(camera, this, now, interval);
                if (true == b) {
                    var program = material.program;
                    if (undefined != skAnim) {
                        skAnim.uploadContext(camera, this, program, now, interval);
                    }
                    geometry.uploadContext(camera, this, program, now, interval);
                    var _b = this, shadowTarget = _b.shadowTarget, shadowMatrix = _b.shadowMatrix;
                    var c = rf.context3D;
                    if (shadowTarget) {
                        c.setProgramConstantsFromMatrix("sunmvp" /* sunmvp */, shadowMatrix);
                    }
                    c.drawTriangles(geometry.index, geometry.numTriangles);
                }
            }
            _super.prototype.render.call(this, camera, now, interval);
        };
        Mesh.prototype.onRecycle = function () {
            var skAnim = this.skAnim;
            if (skAnim) {
                this.skAnim = null;
            }
            _super.prototype.onRecycle.call(this);
        };
        return Mesh;
    }(rf.SceneObject));
    rf.Mesh = Mesh;
    var KFMMesh = /** @class */ (function (_super) {
        __extends(KFMMesh, _super);
        function KFMMesh(material, variables) {
            var _this = _super.call(this, variables) || this;
            _this.material = material;
            _this.defaultAnim = "stand";
            return _this;
            // this.shadowable = true;
        }
        KFMMesh.prototype.load = function (url) {
            this.id = url;
            var kfm = rf.skeletonMeshObj[url];
            if (!kfm) {
                url += "mesh.km";
                rf.loadRes(url, this.loadCompelte, this, 0 /* bin */);
            }
        };
        KFMMesh.prototype.loadCompelte = function (e) {
            if (e.type == 4 /* COMPLETE */) {
                var _a = e.data, url = _a.url, byte = _a.data;
                var id = this.id;
                if (url.indexOf(id) != -1) {
                    var o = rf.amf_readObject(byte);
                    if (o.skeleton) {
                        o.skeleton = new Skeleton(o.skeleton);
                    }
                    rf.skeletonMeshObj[id] = o;
                    this.setKFM(o);
                    return;
                }
            }
        };
        KFMMesh.prototype.setKFM = function (kfm) {
            var mesh = kfm.mesh, skeleton = kfm.skeleton, materialData = kfm.material, anims = kfm.anims;
            var _a = this, material = _a.material, geometry = _a.geometry, defaultAnim = _a.defaultAnim;
            var c = rf.context3D;
            this.kfm = kfm;
            if (!geometry) {
                this.geometry = geometry = new rf.GeometryBase(this.variables);
            }
            geometry.setData(mesh);
            if (!material) {
                this.material = material = new rf.PhongMaterial();
            }
            material.setData(materialData);
            material.diffTex.url = this.id + material.diffTex.url;
            if (skeleton) {
                //===========================
                //  Animation
                //===========================
                this.skAnim = skeleton.createAnimation();
                skeleton.addEventListener(4 /* COMPLETE */, this.animationLoadCompleteHandler, this);
                this.playAnim(defaultAnim);
            }
            // let action = "Take 001";
            // let action = "stand";
            // let animationData = kfm.anims[action];
            // skeleton.initAnimationData(animationData);
            // this.skAnim.play(animationData, engineNow);
        };
        KFMMesh.prototype.playAnim = function (name, refresh) {
            if (refresh === void 0) { refresh = false; }
            var _a = this, skAnim = _a.skAnim, tm = _a.tm;
            if (!skAnim) {
                return;
            }
            if (name.lastIndexOf(".kf" /* KF */) == -1) {
                name += ".kf" /* KF */;
            }
            if (this.currentAnim == name && !refresh) {
                return;
            }
            this.currentAnim = name;
            var skeleton = skAnim.skeleton;
            var anim = skeleton.animations[name];
            if (!anim) {
                //没有加载动作
                rf.loadRes(this.id + name, skeleton.loadAnimationComplete, skeleton, 0 /* bin */);
            }
            else {
                this.skAnim.play(anim, tm.now);
            }
        };
        KFMMesh.prototype.animationLoadCompleteHandler = function (e) {
            var anim = e.data;
            if (anim.name == this.currentAnim) {
                this.playAnim(this.currentAnim, true);
            }
        };
        KFMMesh.prototype.onRecycle = function () {
            var skAnim = this.skAnim;
            if (skAnim) {
                skAnim.skeleton.removeEventListener(4 /* COMPLETE */, this.animationLoadCompleteHandler);
            }
            this.defaultAnim = undefined;
            this.currentAnim = undefined;
            this.id = undefined;
            this.kfm = undefined;
            _super.prototype.onRecycle.call(this);
        };
        return KFMMesh;
    }(Mesh));
    rf.KFMMesh = KFMMesh;
    var Skeleton = /** @class */ (function (_super) {
        __extends(Skeleton, _super);
        function Skeleton(config) {
            var _this = _super.call(this) || this;
            _this.animations = {};
            var _a = _this, boneCount = _a.boneCount, defaultMatrices = _a.defaultMatrices;
            _this.boneCount = boneCount = config.boneCount;
            var buffer = new ArrayBuffer(16 * 4 * boneCount);
            _this.defaultMatrices = defaultMatrices = new Float32Array(buffer);
            function init(bone) {
                var inv = bone.inv, matrix = bone.matrix, parent = bone.parent, children = bone.children, name = bone.name, index = bone.index;
                if (undefined != inv) {
                    bone.inv = inv = new Float32Array(inv);
                }
                bone.matrix = matrix = new Float32Array(matrix);
                var sceneTransform = new Float32Array(matrix);
                if (parent) {
                    sceneTransform.m3_append(parent.sceneTransform);
                    // matrix3d_multiply(sceneTransform, parent.sceneTransform, sceneTransform);
                }
                if (index > -1) {
                    var matrice = new Float32Array(buffer, index * 16 * 4, 16);
                    matrice.m3_append(sceneTransform, false, inv);
                    // matrix3d_multiply(inv,sceneTransform,matrice);
                }
                bone.sceneTransform = sceneTransform;
                children.forEach(function (b) {
                    init(b);
                });
            }
            init(config.root);
            _this.rootBone = config.root;
            _this.vertex = rf.context3D.createVertexBuffer(new rf.VertexInfo(new Float32Array(config.vertex), config.data32PerVertex, rf.vertex_skeleton_variable));
            return _this;
        }
        Skeleton.prototype.initAnimationData = function (anim) {
            anim.skeleton = this;
            anim.matrices = [];
            var frames = anim.frames;
            for (var key in frames) {
                frames[key] = new Float32Array(frames[key]);
            }
            this.animations[anim.name] = anim;
        };
        Skeleton.prototype.createAnimation = function () {
            var anim = rf.recyclable(SkeletonAnimation);
            anim.skeleton = this;
            return anim;
        };
        Skeleton.prototype.getMatricesData = function (anim, frame) {
            var result = anim.matrices[frame];
            if (undefined != result) {
                return result;
            }
            var _a = this, boneCount = _a.boneCount, rootBone = _a.rootBone;
            var frames = anim.frames;
            var map = {};
            var buffer = new ArrayBuffer(16 * 4 * boneCount);
            result = new Float32Array(buffer);
            anim.matrices[frame] = result;
            function update(bone) {
                var inv = bone.inv, matrix = bone.matrix, sceneTransform = bone.sceneTransform, parent = bone.parent, children = bone.children, name = bone.name, index = bone.index;
                var frameData = frames[bone.name];
                if (frameData) {
                    matrix.set(frameData.slice(frame * 16, (frame + 1) * 16));
                }
                if (parent) {
                    sceneTransform.m3_append(parent.sceneTransform, false, matrix);
                    // matrix3d_multiply(matrix, parent.sceneTransform, sceneTransform);
                    // multiplyMatrices(parent.sceneTransform,matrix,sceneTransform);
                }
                else {
                    sceneTransform.set(matrix);
                }
                if (index > -1) {
                    var matrice = new Float32Array(buffer, index * 16 * 4, 16);
                    // matrix3d_multiply(inv, sceneTransform, matrice);
                    matrice.m3_append(sceneTransform, false, inv);
                    // multiplyMatrices(sceneTransform,inv,matrice);
                }
                map[bone.name] = bone;
                children.forEach(function (element) {
                    update(element);
                });
            }
            update(rootBone);
            return result;
        };
        Skeleton.prototype.loadAnimationComplete = function (e) {
            if (e.type == 4 /* COMPLETE */) {
                var item = e.data;
                var byte = item.data;
                var o = rf.amf_readObject(byte);
                this.initAnimationData(o);
                this.simpleDispatch(e.type, o);
            }
        };
        return Skeleton;
    }(rf.MiniDispatcher));
    rf.Skeleton = Skeleton;
    var SkeletonAnimation = /** @class */ (function () {
        function SkeletonAnimation() {
            this.pose = {};
            this.currentFrame = 0;
        }
        SkeletonAnimation.prototype.play = function (animationData, now) {
            this.animationData = animationData;
            this.nextTime = now + animationData.eDuration * 1000;
        };
        SkeletonAnimation.prototype.uploadContext = function (camera, mesh, program, now, interval) {
            var _a = this, animationData = _a.animationData, skeleton = _a.skeleton, starttime = _a.starttime, currentFrame = _a.currentFrame, nextTime = _a.nextTime;
            var tm = mesh.tm;
            skeleton.vertex.uploadContext(program);
            var matrixes;
            if (undefined == animationData) {
                matrixes = skeleton.defaultMatrices;
            }
            else {
                if (currentFrame >= animationData.totalFrame) {
                    currentFrame = 0;
                }
                if (tm.now > nextTime) {
                    this.nextTime = nextTime + animationData.eDuration * 1000;
                    this.currentFrame = currentFrame + 1;
                }
                matrixes = skeleton.getMatricesData(animationData, currentFrame);
            }
            rf.context3D.setProgramConstantsFromMatrix("bones" /* vc_bones */, matrixes);
        };
        return SkeletonAnimation;
    }());
    rf.SkeletonAnimation = SkeletonAnimation;
})(rf || (rf = {}));
//# sourceMappingURL=Mesh.js.map