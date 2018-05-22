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
    var Byte = /** @class */ (function () {
        function Byte(buf) {
            this.setArrayBuffer(buf);
        }
        Byte.prototype.setArrayBuffer = function (buf) {
            if (undefined == buf) {
                this.length = this.position = 0;
            }
            else {
                this.buf = new DataView(buf);
                this.length = buf.byteLength;
                this.position = 0;
            }
        };
        Byte.prototype.outOfRange = function () {
        };
        Byte.prototype.readByte = function () {
            var position = this.position;
            if (position > this.length) {
                this.outOfRange();
                return;
            }
            ;
            var b = this.buf.getUint8(position);
            this.position++;
            return b;
        };
        Byte.prototype.readInt = function () {
            var position = this.position;
            if (position + 4 > this.length) {
                this.outOfRange();
                return;
            }
            var b = this.buf.getInt32(position);
            this.position = position + 4;
            return b;
        };
        Byte.prototype.readUInt = function () {
            var position = this.position;
            if (position + 4 > this.length) {
                this.outOfRange();
                return;
            }
            var b = this.buf.getUint32(position);
            this.position = position + 4;
            return b;
        };
        Byte.prototype.readDouble = function () {
            var position = this.position;
            if (position + 8 > this.length) {
                this.outOfRange();
                return;
            }
            var b = this.buf.getFloat64(position);
            this.position = position + 8;
            return b;
        };
        Byte.prototype.readFloat = function () {
            var position = this.position;
            if (position + 4 > this.length) {
                this.outOfRange();
                return;
            }
            var b = this.buf.getFloat32(position);
            this.position = position + 4;
            return b;
        };
        Byte.prototype.readMultiByte = function (length, charSet) {
            if (charSet === void 0) { charSet = "utf-8"; }
            var _a = this, position = _a.position, buf = _a.buf;
            if (position + length > this.length) {
                this.outOfRange();
                return;
            }
            var str = "";
            for (var i = 0; i < length; i++) {
                str += String.fromCharCode(buf.getUint8(position + i));
            }
            // try{
            // 	var u8 = new Uint8Array(length);
            // 	u8.set(new Uint8Array(buf.buffer.slice(position, position + length)));
            // 	var decoder = new TextDecoder(charSet);
            // 	var str = decoder.decode(u8);
            // }catch (err){
            // 	//str = String.fromCharCode.apply(null, u8);
            // 	str = "";
            // 	for (var i:number = 0; i < length;i++ ){
            // 		str += String.fromCharCode(buf.getUint8(position + i));
            // 	}
            // }
            this.position += length;
            return str;
        };
        Byte.prototype.readByteArray = function (length) {
            var position = this.position;
            var buf = this.buf.buffer.slice(position, position + length);
            this.position += length;
            return buf;
        };
        return Byte;
    }());
    rf.Byte = Byte;
    var ClassDefine = /** @class */ (function () {
        function ClassDefine(className, members) {
        }
        return ClassDefine;
    }());
    rf.ClassDefine = ClassDefine;
    var AMF3 = /** @class */ (function (_super) {
        __extends(AMF3, _super);
        function AMF3(buf) {
            var _this = _super.call(this, buf) || this;
            _this.flags = 0;
            _this.stringsTable = [];
            _this.objectsTable = [];
            _this.traitsTable = [];
            _this.clsNameMap = {};
            _this.MASK = 1 << 28;
            return _this;
        }
        AMF3.prototype.read29 = function (unsign) {
            var v = 0, a = 0;
            // v = this.readByte() & 0xff
            // if (v >= 0x80)
            // {
            // 	a = this.readByte();
            // 	v += (a<<7) - 0x80;
            // 	if (a >= 0x80)
            // 	{
            // 		a = this.readByte();
            // 		v += (a<<14) - 0x4000;
            // 		if (a >= 0x80)
            // 		{
            // 			a = this.readByte();
            // 			v += (a << 21) - 0x200000;
            // 		}
            // 	}
            // }
            v = this.readByte();
            if (v >= 0x80) { //U29 1bytes 0x00-0x7f
                a = this.readByte();
                v = (v & 0x7f) << 7;
                if (a < 0x80) { //U29 2bytes 0x80-0xFF 0x00-0x7f
                    v = v | a;
                }
                else {
                    v = (v | a & 0x7f) << 7;
                    a = this.readByte();
                    if (a < 0x80) { //U29 3bytes 0x80-0xFF 0x80-0xFF 0x00-0x7f
                        v = v | a;
                    }
                    else { //u29 4bytes 0x80-0xFF 0x80-0xFF 0x80-0xFF 0x00-0xFF
                        v = (v | a & 0x7f) << 8;
                        a = this.readByte();
                        v = v | a;
                    }
                }
                v = -(v & 0x10000000) | v;
            }
            // if(unsign){
            // 	return v;
            // }
            // if (v & 1)
            // 	return -1 - (v>>1);
            // else
            // 	return v>>1;
            return v;
            // v = this.readByte() & 0xff;
            // if (v < 128){
            // 	return v;
            // }
            // let tmp;
            // v = (v & 0x7f) << 7;
            // tmp = this.readByte()&0xff;
            // if (tmp < 128){
            // 	v = v | tmp;
            // }else{
            // 	v = (v | tmp & 0x7f) << 7;
            // 	tmp = this.readByte()&0xff;
            // 	if (tmp < 128){
            // 		v = v | tmp;
            // 	}else{
            // 		v = (v | tmp & 0x7f) << 8;
            // 		tmp = this.readByte()&0xff;
            // 		v = v | tmp;
            // 	}
            // }
            // return -(v & this.MASK) | v;
        };
        AMF3.prototype.readInt = function () {
            return this.read29(false);
        };
        AMF3.prototype.readString = function () {
            var handle = this.read29(true);
            var inline = (handle & 1) != 0;
            handle = handle >> 1;
            if (inline) {
                if (0 == handle) {
                    return "";
                }
                var str = this.readMultiByte(handle);
                this.stringsTable.push(str);
                return str;
            }
            return this.stringsTable[handle];
        };
        AMF3.prototype.readDate = function (u29D) {
            return new Date(this.readDouble());
        };
        AMF3.prototype.readObjectVector = function (length) {
            var fixed = this.read29(true);
            var list = [];
            this.objectsTable.push(list);
            var index = -1;
            while (++index < length) {
                list[index] = this.readObject();
            }
            return list;
        };
        AMF3.prototype.readArray = function (length) {
            var objectsTable = this.objectsTable;
            var instance = [];
            objectsTable.push(instance);
            var key;
            while (key = this.readString()) {
                instance[key] = this.readObject();
            }
            var index = -1;
            while (++index < length) {
                instance[index] = this.readObject();
            }
            return instance;
        };
        AMF3.prototype.readDictionary = function (length) {
            var weakKeys = this.readByte() != 0;
            var dic = {};
            this.objectsTable.push(dic);
            var key;
            var value;
            for (var i = 0; i < length; i++) {
                key = this.readObject();
                value = this.readObject();
                dic[key] = value;
            }
            return dic;
        };
        AMF3.prototype.readObject = function () {
            var value;
            var marker = this.readByte();
            switch (marker) {
                case 4 /* INT */:
                    value = this.read29(false);
                    if (value >= 0x10000000) {
                        value = value - 0xFFFFFFFF - 1;
                    }
                    break;
                case 5 /* DOUBLE */:
                    value = this.readDouble();
                    break;
                case 2 /* FALSE */:
                case 3 /* TRUE */:
                    value = (marker == 3 /* TRUE */);
                    break;
                case 1 /* NULL */:
                    value = null;
                    break;
                case 0 /* UNDEFINED */:
                    value = undefined;
                    break;
                case 6 /* STRING */:
                    value = this.readString();
                    break;
                case 9 /* ARRAY */:
                case 10 /* OBJECT */:
                case 8 /* DATE */:
                case 11 /* XML */:
                case 7 /* XMLDOC */:
                case 12 /* BYTEARRAY */:
                case 16 /* OBJECTVECTOR */:
                case 13 /* INTVECTOR */:
                case 14 /* UINTVECTOR */:
                case 15 /* DOUBLEVECTOR */:
                case 17 /* DICTIONARY */:
                    value = this.readReferencableObject(marker);
                    break;
                default:
                    throw Error("not implement:" + marker);
            }
            return value;
        };
        AMF3.prototype.readByteArray = function (length) {
            var objectsTable = this.objectsTable;
            var buf = _super.prototype.readByteArray.call(this, length);
            objectsTable.push(buf);
            return buf;
        };
        AMF3.prototype._readObject = function (handle) {
            var _a = this, traitsTable = _a.traitsTable, objectsTable = _a.objectsTable;
            var traits;
            var classDef;
            var className;
            var len;
            var i;
            var inlineClassDef = ((handle & 1) != 0);
            handle = handle >> 1;
            if (inlineClassDef) {
                className = this.readString();
                var isIExternalizable = (handle & 1) != 0;
                handle = handle >> 1;
                var isDynamic = (handle & 1) != 0;
                len = handle >> 1;
                traits = [];
                for (i = 0; i < len; i++) {
                    traits[i] = this.readString();
                }
                classDef = new ClassDefine(className, traits);
                classDef.isExternalizable = isIExternalizable;
                classDef.isDynamic = isDynamic;
                traitsTable.push(classDef);
            }
            else {
                classDef = traitsTable[handle];
                if (!classDef) {
                    throw new Error("no trait found with refId: " + handle);
                }
                traits = classDef.members;
                className = classDef.className;
            }
            var instance;
            instance = {};
            objectsTable.push(instance);
            for (var key in traits) {
                key = traits[key];
                instance[key] = this.readObject();
            }
            if (classDef.isDynamic) {
                var key = void 0;
                while (key = this.readString()) {
                    instance[key] = this.readObject();
                }
            }
            return instance;
        };
        AMF3.prototype.readReferencableObject = function (marker) {
            var objectsTable = this.objectsTable;
            var object;
            var handle = this.read29(true);
            var isIn = (handle & 1) == 0;
            handle = handle >> 1;
            if (isIn) {
                object = objectsTable[handle];
                return object;
            }
            else {
                switch (marker) {
                    case 9 /* ARRAY */:
                        object = this.readArray(handle);
                        break;
                    case 10 /* OBJECT */:
                        object = this._readObject(handle);
                        break;
                    case 8 /* DATE */:
                        object = this.readDate(handle);
                        break;
                    case 11 /* XML */:
                        object = this.readMultiByte(handle);
                        break;
                    case 7 /* XMLDOC */:
                        object = this.readMultiByte(handle);
                        break;
                    case 12 /* BYTEARRAY */:
                        object = this.readByteArray(handle);
                        break;
                    case 16 /* OBJECTVECTOR */:
                    case 14 /* UINTVECTOR */:
                    case 13 /* INTVECTOR */:
                    case 15 /* DOUBLEVECTOR */:
                        object = this.readObjectVector(handle);
                        break;
                    case 17 /* DICTIONARY */:
                        object = this.readDictionary(handle);
                        break;
                    default:
                        throw Error("not implement:" + handle);
                }
            }
            return object;
        };
        return AMF3;
    }(Byte));
    rf.AMF3 = AMF3;
    var AMF3Encode = /** @class */ (function (_super) {
        __extends(AMF3Encode, _super);
        function AMF3Encode(buf) {
            var _this = _super.call(this, buf || new ArrayBuffer(10240 * 1024)) || this;
            _this.stringsTable = [];
            _this.objectsTable = [];
            _this.traitsTable = [];
            _this.unit8 = new Uint8Array(_this.buf.buffer);
            return _this;
        }
        AMF3Encode.prototype.writeByte = function (value) {
            this.buf.setUint8(this.position, value);
            this.position++;
        };
        AMF3Encode.prototype.writeFloat = function (value) {
            this.buf.setFloat32(this.position, value);
            this.position += 4;
        };
        AMF3Encode.prototype.writeDouble = function (value) {
            this.buf.setFloat64(this.position, value);
            this.position += 8;
        };
        AMF3Encode.prototype.writeString = function (str) {
            var stringsTable = this.stringsTable;
            var index = stringsTable.indexOf(str);
            var handle;
            if (index == -1) {
                var length_1 = str.length;
                handle = length_1 << 1;
                handle |= 1;
                this.write29(handle, true);
                var _a = this, position = _a.position, buf = _a.buf;
                for (var i = 0; i < length_1; i++) {
                    buf.setUint8(position++, str.charCodeAt(i));
                }
                this.position = position;
                stringsTable.push(str);
            }
            else {
                handle = index << 1;
                handle |= 0;
                this.write29(handle, true);
            }
        };
        AMF3Encode.prototype.write29 = function (v, unsign) {
            // if(unsign == false){
            // 	if (v < 0)
            // 		v = (-v - 1)*2 + 1;
            // 	else
            // 		v *= 2;
            // }
            var len = 0;
            if (v < 0x80)
                len = 1;
            else if (v < 0x4000)
                len = 2;
            else if (v < 0x200000)
                len = 3;
            else
                len = 4;
            // else if (v < 0x40000000) len = 4;
            // else throw new Error("U29 Range Error");// 0x40000000 - 0xFFFFFFFF : throw range exception
            switch (len) {
                case 1: // 0x00000000 - 0x0000007F : 0xxxxxxx
                    this.writeByte(v);
                    break;
                case 2: // 0x00000080 - 0x00003FFF : 1xxxxxxx 0xxxxxxx
                    this.writeByte(((v >> 7) & 0x7F) | 0x80);
                    this.writeByte(v & 0x7F);
                    break;
                case 3: // 0x00004000 - 0x001FFFFF : 1xxxxxxx 1xxxxxxx 0xxxxxxx
                    this.writeByte(((v >> 14) & 0x7F) | 0x80);
                    this.writeByte(((v >> 7) & 0x7F) | 0x80);
                    this.writeByte(v & 0x7F);
                    break;
                case 4: // 0x00200000 - 0x3FFFFFFF : 1xxxxxxx 1xxxxxxx 1xxxxxxx xxxxxxxx
                    this.writeByte(((v >> 22) & 0x7F) | 0x80);
                    this.writeByte(((v >> 15) & 0x7F) | 0x80);
                    this.writeByte(((v >> 8) & 0x7F) | 0x80);
                    this.writeByte(v & 0xFF);
                    break;
            }
            // // 写入 7 位
            // if (v < 0x80)
            // 	return this.writeByte (v);
            // this.writeByte (v|0x80);
            // v = v >> 7;
            // // 写入 7 位
            // if (v < 0x80)
            // 	return this.writeByte (v);
            // 	this.writeByte (v|0x80);
            // v = v >> 7;
            // // 写入 7 位
            // if (v < 0x80)
            // 	return this.writeByte (v);
            // 	this.writeByte (v|0x80);
            // v = v >> 7;
            // // 写入 8 位
            // if (v >= 0x100)
            // 	throw new Error ('bad integer value');
            // this.writeByte (v);
        };
        AMF3Encode.prototype.isRealNum = function (val) {
            // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
            if (val === "" || val == null) {
                return false;
            }
            if (!isNaN(val)) {
                return true;
            }
            else {
                return false;
            }
        };
        AMF3Encode.prototype.writeObject = function (o) {
            var type = typeof o;
            if (type === "string") {
                this.writeByte(6 /* STRING */);
                this.writeString(String(o));
            }
            else if (type === "boolean") {
                this.writeByte(o == true ? 3 /* TRUE */ : 2 /* FALSE */);
            }
            else if ('number' === type) {
                if ((o >> 0) === o && o >= -0x10000000 && o < 0x10000000) {
                    if (o < 0) {
                        o = 0xFFFFFFFF - (o + 1);
                    }
                    this.writeByte(4 /* INT */);
                    this.write29(o, false);
                }
                else {
                    this.writeByte(5 /* DOUBLE */);
                    this.writeDouble(o);
                }
            }
            else if (o instanceof Uint8Array
                || (o instanceof Uint32Array)
                || (o instanceof Uint16Array)
                || (o instanceof Float32Array)
                || o instanceof Float64Array) {
                this.writeBytes(o.buffer);
            }
            else if (o instanceof Array) {
                this.writeArray(o);
            }
            else if (o instanceof Object) {
                this.writeByte(10 /* OBJECT */);
                var objectsTable = this.objectsTable;
                var index = objectsTable.indexOf(o);
                var ins = 0;
                if (index != -1) {
                    this.write29(index << 1, true);
                    return;
                }
                objectsTable.push(o);
                this.write29(11, true); //isDynamic && isIExternalizable && inlineClassDef && 新对象
                this.write29(1, true); //class name
                for (var key in o) {
                    this.writeString(key);
                    this.writeObject(o[key]);
                }
                this.writeByte(1); //结束
            }
            else if (null === o) {
                this.writeByte(1 /* NULL */);
            }
            else if (undefined === o) {
                this.writeByte(0 /* UNDEFINED */);
            }
        };
        AMF3Encode.prototype.writeArray = function (arr) {
            this.writeByte(9 /* ARRAY */);
            var objectsTable = this.objectsTable;
            var index = objectsTable.indexOf(arr);
            var ins = 0;
            if (index != -1) {
                this.write29(index << 1, true);
                return;
            }
            objectsTable.push(arr);
            var len = arr.length;
            this.write29((len << 1) | 1, true);
            this.writeByte(1);
            for (var i = 0; i < len; i++) {
                this.writeObject(arr[i]);
            }
        };
        AMF3Encode.prototype.writeBytes = function (buffer) {
            this.writeByte(12 /* BYTEARRAY */);
            var objectsTable = this.objectsTable;
            var index = objectsTable.indexOf(buffer);
            var ins = 0;
            if (index != -1) {
                this.write29(index << 1, true);
                return;
            }
            objectsTable.push(buffer);
            var length = buffer.byteLength;
            this.write29((length << 1) | 1, true);
            this.unit8.set(new Uint8Array(buffer), this.position);
            this.position += buffer.byteLength;
        };
        AMF3Encode.prototype.toUint8Array = function () {
            return new Uint8Array(this.buf.buffer).slice(0, this.position);
        };
        return AMF3Encode;
    }(Byte));
    rf.AMF3Encode = AMF3Encode;
    function amf_readObject(byte) {
        var amf = rf.singleton(AMF3);
        // var inflate = new Zlib.Inflate(new Uint8Array(byte));
        // var plain;
        // if(inflate instanceof Uint8Array){
        // 	plain = inflate;
        // }else{
        // 	plain = inflate.decompress();
        // }
        // amf.setArrayBuffer(plain.buffer);
        if (byte instanceof Uint8Array) {
            byte = byte.buffer;
        }
        amf.setArrayBuffer(byte);
        var o = amf.readObject();
        return o;
    }
    rf.amf_readObject = amf_readObject;
})(rf || (rf = {}));
//# sourceMappingURL=AMF3.js.map