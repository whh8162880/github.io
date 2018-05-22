///<reference path="./ThrowError.ts" />
/**
 * 对数字进行补0操作
 * @param value 要补0的数值
 * @param length 要补的总长度
 * @return 补0之后的字符串
 */
function zeroize(value, length) {
    if (length === void 0) { length = 2; }
    var str = "" + value;
    var zeros = "";
    for (var i = 0, len = length - str.length; i < len; i++) {
        zeros += "0";
    }
    return zeros + str;
}
/**
 * 获取完整的 PropertyDescriptor
 *
 * @param {Partial<PropertyDescriptor>} descriptor
 * @param {boolean} [enumerable=false]
 * @param {boolean} [writable]
 * @param {boolean} [configurable=true]
 * @returns
 */
function getDescriptor(descriptor, enumerable, writable, configurable) {
    if (enumerable === void 0) { enumerable = false; }
    if (writable === void 0) { writable = true; }
    if (configurable === void 0) { configurable = true; }
    if (!descriptor.set && !descriptor.get) {
        descriptor.writable = writable;
    }
    descriptor.configurable = configurable;
    descriptor.enumerable = enumerable;
    return descriptor;
}
function makeDefDescriptors(descriptors, enumerable, writable, configurable) {
    if (enumerable === void 0) { enumerable = false; }
    if (writable === void 0) { writable = true; }
    if (configurable === void 0) { configurable = true; }
    for (var key in descriptors) {
        var desc = descriptors[key];
        var enumer = desc.enumerable == undefined ? enumerable : desc.enumerable;
        var write = desc.writable == undefined ? writable : desc.writable;
        var config = desc.configurable == undefined ? configurable : desc.configurable;
        descriptors[key] = getDescriptor(desc, enumer, write, config);
    }
    return descriptors;
}
Object.defineProperties(Object.prototype, makeDefDescriptors({
    clone: {
        value: function () {
            var o = {};
            for (var n in this) {
                o[n] = this[n];
            }
            return o;
        }
    },
    getPropertyDescriptor: {
        value: function (property) {
            var data = Object.getOwnPropertyDescriptor(this, property);
            if (data) {
                return data;
            }
            var prototype = Object.getPrototypeOf(this);
            if (prototype) {
                return prototype.getPropertyDescriptor(property);
            }
        }
    },
    copyto: {
        value: function (to) {
            for (var p in this) {
                var data = to.getPropertyDescriptor(p);
                if (!data || (data.set || data.writable)) { // 可进行赋值，防止将属性中的方法给重写
                    to[p] = this[p];
                }
            }
        }
    },
    equals: {
        value: function (checker) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (!args.length) {
                args = Object.getOwnPropertyNames(checker);
            }
            for (var i = 0; i < args.length; i++) {
                var key = args[i];
                if (this[key] != checker[key]) {
                    return false;
                }
            }
            return true;
        }
    },
    copyWith: {
        value: function (to) {
            var proNames = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                proNames[_i - 1] = arguments[_i];
            }
            for (var _a = 0, proNames_1 = proNames; _a < proNames_1.length; _a++) {
                var p = proNames_1[_a];
                if (p in this) {
                    to[p] = this[p];
                }
            }
        }
    },
    getSpecObject: {
        value: function () {
            var proNames = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                proNames[_i] = arguments[_i];
            }
            var obj = {};
            for (var _a = 0, proNames_2 = proNames; _a < proNames_2.length; _a++) {
                var p = proNames_2[_a];
                if (p in this) {
                    if (this[p] != null) {
                        obj[p] = this[p];
                    }
                }
            }
            return obj;
        }
    }
}));
Object.defineProperties(Float32Array.prototype, makeDefDescriptors({
    x: {
        get: function () {
            return this[0];
        },
        set: function (value) {
            this[0] = value;
        }
    },
    y: {
        get: function () {
            return this[1];
        },
        set: function (value) {
            this[1] = value;
        }
    },
    z: {
        get: function () {
            return this[2];
        },
        set: function (value) {
            this[2] = value;
        }
    },
    w: {
        get: function () {
            return this[3];
        },
        set: function (value) {
            this[3] = value;
        }
    },
    update: {
        value: function (data32PerVertex, offset, v) {
            var len = this.length;
            for (var i = 0; i < len; i += data32PerVertex) {
                this[i + offset] = v;
            }
        }
    },
    wPoint1: {
        value: function (position, x, y, z, w) {
            this[position] = x;
        }
    },
    wPoint2: {
        value: function (position, x, y, z, w) {
            this[position] = x;
            this[position + 1] = y;
        }
    },
    wPoint3: {
        value: function (position, x, y, z, w) {
            this[position] = x;
            this[position + 1] = y;
            this[position + 2] = z;
        }
    },
    wPoint4: {
        value: function (position, x, y, z, w) {
            this[position] = x;
            this[position + 1] = y;
            this[position + 2] = z;
            this[position + 3] = w;
        }
    },
    clone: {
        value: function () {
            return new Float32Array(this);
        }
    }
}));
Object.defineProperties(Function.prototype, makeDefDescriptors({
    isSubClass: {
        value: function (testBase) {
            if (typeof testBase !== "function") {
                return false;
            }
            var base = this.prototype;
            var flag = false;
            while (base !== null && base !== Object) {
                if (base === testBase) {
                    flag = true;
                    break;
                }
                base = base.prototype;
            }
            return true;
        }
    }
}));
Math.DEG_TO_RAD = Math.PI / 180;
Math.RAD_TO_DEG = 180 / Math.PI;
Math.PI2 = 2 * Math.PI;
Math.PI_1_2 = Math.PI * .5;
Math.clamp = function (value, min, max) {
    if (value < min) {
        value = min;
    }
    if (value > max) {
        value = max;
    }
    return value;
};
Math.random2 = function (min, max) {
    return min + Math.random() * (max - min);
};
Math.random3 = function (center, delta) {
    return center - delta + Math.random() * 2 * delta;
};
if (!Number.isSafeInteger) { //防止低版本浏览器没有此方法
    Number.isSafeInteger = function (value) { return value < 9007199254740991 /*Number.MAX_SAFE_INTEGER*/ && value >= -9007199254740991; }; /*Number.MIN_SAFE_INTEGER*/
}
Object.defineProperties(Number.prototype, makeDefDescriptors({
    zeroize: getDescriptor({
        value: function (length) { return zeroize(this, length); }
    }),
    between: getDescriptor({
        value: function (min, max) { return min <= this && max >= this; }
    })
}));
Object.defineProperties(String.prototype, makeDefDescriptors({
    zeroize: {
        value: function (length) { return zeroize(this, length); },
    },
    trim: {
        value: function () {
            return this.replace(/(^[\s\t\f\r\n\u3000\ue79c ]*)|([\s\t\f\r\n\u3000\ue79c ]*$)/g, "");
        }
    },
    substitute: {
        value: function () {
            var len = arguments.length;
            if (len > 0) {
                var obj_1;
                if (len == 1) {
                    obj_1 = arguments[0];
                    if (typeof obj_1 !== "object") {
                        obj_1 = arguments;
                    }
                }
                else {
                    obj_1 = arguments;
                }
                if ((obj_1 instanceof Object) && !(obj_1 instanceof RegExp)) {
                    return this.replace(/\{(?:%([^{}]+)%)?([^{}]+)\}/g, function (match, handler, key) {
                        //检查key中，是否为%开头，如果是，则尝试按方法处理                        
                        var value = obj_1[key];
                        if (handler) { //如果有处理器，拆分处理器
                            var func = String.subHandler[handler];
                            if (func) {
                                value = func(value);
                            }
                        }
                        return (value !== undefined) ? '' + value : match;
                    });
                }
            }
            return this.toString(); //防止生成String对象，ios反射String对象会当成一个NSDictionary处理
        }
    },
    hash: {
        value: function () {
            var len = this.length;
            var hash = 5381;
            for (var i = 0; i < len; i++) {
                hash += (hash << 5) + this.charCodeAt(i);
            }
            return hash & 0xffffffff;
        }
    },
    trueLength: {
        value: function () {
            var arr = this.match(/[\u2E80-\u9FBF]/ig);
            return this.length + (arr ? arr.length : 0);
        }
    }
}));
String.zeroize = zeroize;
String.subHandler = {};
String.regSubHandler = function (key, handler) {
    if (DEBUG) {
        if (handler.length != 1) {
            rf.ThrowError("String.regSubHandler\u6CE8\u518C\u7684\u51FD\u6570\uFF0C\u53C2\u6570\u6570\u91CF\u5FC5\u987B\u4E3A\u4E00\u4E2A\uFF0C\u5806\u6808\uFF1A\n" + new Error().stack + "\n\u51FD\u6570\u5185\u5BB9\uFF1A" + handler.toString());
        }
        if (key in this.subHandler) {
            rf.ThrowError("String.regSubHandler\u6CE8\u518C\u7684\u51FD\u6570\uFF0C\u6CE8\u518C\u4E86\u91CD\u590D\u7684key[" + key + "]\uFF0C\u5806\u6808\uFF1A\n" + new Error().stack);
        }
    }
    this.subHandler[key] = handler;
};
Object.defineProperties(Date.prototype, makeDefDescriptors({
    format: {
        value: function (mask, local) {
            var d = this;
            return mask.replace(/"[^"]*"|'[^']*'|(?:d{1,2}|m{1,2}|yy(?:yy)?|([hHMs])\1?)/g, function ($0) {
                switch ($0) {
                    case "d": return gd();
                    case "dd": return zeroize(gd());
                    case "M": return gM() + 1;
                    case "MM": return zeroize(gM() + 1);
                    case "yy": return (gy() + "").substr(2);
                    case "yyyy": return gy();
                    case "h": return gH() % 12 || 12;
                    case "hh": return zeroize(gH() % 12 || 12);
                    case "H": return gH();
                    case "HH": return zeroize(gH());
                    case "m": return gm();
                    case "mm": return zeroize(gm());
                    case "s": return gs();
                    case "ss": return zeroize(gs());
                    default: return $0.substr(1, $0.length - 2);
                }
            });
            function gd() { return local ? d.getDate() : d.getUTCDate(); }
            function gM() { return local ? d.getMonth() : d.getUTCMonth(); }
            function gy() { return local ? d.getFullYear() : d.getUTCFullYear(); }
            function gH() { return local ? d.getHours() : d.getUTCHours(); }
            function gm() { return local ? d.getMinutes() : d.getUTCMinutes(); }
            function gs() { return local ? d.getSeconds() : d.getUTCSeconds(); }
        }
    }
}));
Array.binaryInsert = function (partArr, item, filter) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
    }
    //根据物品战力进行插入
    var right = partArr.length - 1;
    var left = 0;
    while (left <= right) {
        var middle = (left + right) >> 1;
        var test = partArr[middle];
        if (filter.apply(void 0, [test].concat(args))) {
            right = middle - 1;
        }
        else {
            left = middle + 1;
        }
    }
    partArr.splice(left, 0, item);
};
/**
 * 用于对Array排序时，处理undefined
 */
Array.SORT_DEFAULT = {
    number: 0,
    string: "",
    boolean: false
};
Object.freeze(Array.SORT_DEFAULT);
Object.defineProperties(Array.prototype, makeDefDescriptors({
    cloneTo: {
        value: function (b) {
            b.length = this.length;
            var len = this.length;
            b.length = len;
            for (var i = 0; i < len; i++) {
                b[i] = this[i];
            }
        }
    },
    appendTo: {
        value: function (b) {
            var len = this.length;
            for (var i = 0; i < len; i++) {
                b.push(this[i]);
            }
        }
    },
    pushOnce: {
        value: function (t) {
            var idx = this.indexOf(t);
            if (!~idx) {
                idx = this.length;
                this[idx] = t;
            }
            return idx;
        }
    },
    remove: {
        value: function (t) {
            var idx = this.indexOf(t);
            if (~idx) {
                this.splice(idx, 1);
                return true;
            }
            return false;
        },
        writable: true
    },
    doSort: {
        value: function () {
            var key, descend;
            var len = arguments.length;
            if (DEBUG && len > 2) {
                rf.ThrowError("doSort\u53C2\u6570\u4E0D\u80FD\u8D85\u8FC72");
            }
            for (var i = 0; i < len; i++) {
                var arg = arguments[i];
                var t = typeof arg;
                if (t === "string") {
                    key = arg;
                }
                else {
                    descend = !!arg;
                }
            }
            if (key) {
                return this.sort(function (a, b) { return descend ? b[key] - a[key] : a[key] - b[key]; });
            }
            else {
                return this.sort(function (a, b) { return descend ? b - a : a - b; });
            }
        }
    },
    multiSort: {
        value: function (kArr, dArr) {
            var isArr = Array.isArray(dArr);
            return this.sort(function (a, b) {
                var def = Array.SORT_DEFAULT;
                for (var idx = 0, len = kArr.length; idx < len; idx++) {
                    var key = kArr[idx];
                    var mode = isArr ? !!dArr[idx] : !!dArr;
                    var av = a[key];
                    var bv = b[key];
                    var typea = typeof av;
                    var typeb = typeof bv;
                    if (typea == "object" || typeb == "object") {
                        if (DEBUG) {
                            rf.ThrowError("multiSort \u6BD4\u8F83\u7684\u7C7B\u578B\u4E0D\u5E94\u4E3Aobject," + typea + "    " + typeb);
                        }
                        return 0;
                    }
                    else if (typea != typeb) {
                        if (typea == "undefined") {
                            bv = def[typeb];
                        }
                        else if (typeb == "undefined") {
                            av = def[typea];
                        }
                        else {
                            if (DEBUG) {
                                rf.ThrowError("multiSort \u6BD4\u8F83\u7684\u7C7B\u578B\u4E0D\u4E00\u81F4," + typea + "    " + typeb);
                            }
                            return 0;
                        }
                    }
                    if (av < bv) {
                        return mode ? 1 : -1;
                    }
                    else if (av > bv) {
                        return mode ? -1 : 1;
                    }
                    else {
                        continue;
                    }
                }
                return 0;
            });
        }
    }
}));
var rf;
(function (rf) {
    function getQualifiedClassName(value) {
        var type = typeof value;
        if (!value || (type != "object" && !value.prototype)) {
            return type;
        }
        var prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        if (prototype.hasOwnProperty("__class__")) {
            return prototype["__class__"];
        }
        var constructorString = prototype.constructor.toString().trim();
        var index = constructorString.indexOf("(");
        var className = constructorString.substring(9, index);
        Object.defineProperty(prototype, "__class__", {
            value: className,
            enumerable: false,
            writable: true
        });
        return className;
    }
    rf.getQualifiedClassName = getQualifiedClassName;
    function getQualifiedSuperclassName(value) {
        if (!value || (typeof value != "object" && !value.prototype)) {
            return null;
        }
        var prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        var superProto = Object.getPrototypeOf(prototype);
        if (!superProto) {
            return null;
        }
        var superClass = getQualifiedClassName(superProto.constructor);
        if (!superClass) {
            return null;
        }
        return superClass;
    }
    rf.getQualifiedSuperclassName = getQualifiedSuperclassName;
    function is(instance, ref) {
        if (!instance || typeof instance != "object") {
            return false;
        }
        var prototype = Object.getPrototypeOf(instance);
        var types = prototype ? prototype.__types__ : null;
        if (!types) {
            return false;
        }
        return (types.indexOf(getQualifiedClassName(ref)) !== -1);
    }
    rf.is = is;
    function toString(instance, defaultValue) {
        if (defaultValue === void 0) { defaultValue = ""; }
        if (!instance) {
            return defaultValue;
        }
    }
    rf.toString = toString;
})(rf || (rf = {}));
//# sourceMappingURL=Extend.js.map