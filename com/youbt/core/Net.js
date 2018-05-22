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
    /**
     * HTTP 请求类
     */
    var HttpRequest = /** @class */ (function (_super) {
        __extends(HttpRequest, _super);
        function HttpRequest() {
            return _super.call(this) || this;
        }
        Object.defineProperty(HttpRequest.prototype, "response", {
            get: function () {
                if (!this._xhr) {
                    return undefined;
                }
                if (this._xhr.response != undefined) {
                    return this._xhr.response;
                }
                if (this._responseType == 0 /* TEXT */) {
                    return this._xhr.responseText;
                }
                if (this._responseType == 1 /* ARRAY_BUFFER */ && /msie 9.0/i.test(navigator.userAgent)) {
                    var w = window;
                    return w["convertResponseBodyToText"](this._xhr["responseBody"]);
                }
                // if (this._responseType == "document") {
                //     return this._xhr.responseXML;
                // }
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HttpRequest.prototype, "responseType", {
            get: function () {
                return this._responseType;
            },
            set: function (value) {
                this._responseType = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HttpRequest.prototype, "withCredentials", {
            get: function () {
                return this._withCredentials;
            },
            /**
             * 表明在进行跨站(cross-site)的访问控制(Access-Control)请求时，是否使用认证信息(例如cookie或授权的header)。(这个标志不会影响同站的请求)
             */
            set: function (value) {
                this._withCredentials = value;
            },
            enumerable: true,
            configurable: true
        });
        HttpRequest.prototype.setRequestHeader = function (header, value) {
            if (!this.headerObj) {
                this.headerObj = {};
            }
            this.headerObj[header] = value;
        };
        HttpRequest.prototype.getResponseHeader = function (header) {
            if (!this._xhr) {
                return undefined;
            }
            var result = this._xhr.getResponseHeader(header);
            return result ? result : "";
        };
        HttpRequest.prototype.getAllResponseHeaders = function () {
            if (!this._xhr) {
                return undefined;
            }
            var result = this._xhr.getAllResponseHeaders();
            return result ? result : "";
        };
        HttpRequest.prototype.open = function (url, method) {
            if (method === void 0) { method = 0 /* GET */; }
            this._url = url;
            this._method = method;
            if (this._xhr) {
                this._xhr.abort();
                this._xhr = undefined;
            }
            this._xhr = this.getXHR();
            this._xhr.onreadystatechange = this.onReadyStateChange.bind(this);
            this._xhr.onprogress = this.updateProgress.bind(this);
            this._xhr.open(this._method == 1 /* POST */ ? "POST" : "GET", this._url, true);
        };
        HttpRequest.prototype.getXHR = function () {
            if (window["XMLHttpRequest"]) {
                return new window["XMLHttpRequest"]();
            }
            return new window["ActiveXObject"]("MSXML2.XMLHTTP");
        };
        HttpRequest.prototype.onReadyStateChange = function () {
            var _this = this;
            var xhr = this._xhr;
            if (xhr.readyState == 4) {
                var ioError_1 = (xhr.status >= 400 || xhr.status == 0);
                var url_1 = this._url;
                setTimeout(function () {
                    if (ioError_1) {
                        if (true && !_this.hasEventListener(16 /* IO_ERROR */)) {
                            rf.ThrowError("http request error: " + url_1);
                        }
                        _this.simpleDispatch(16 /* IO_ERROR */);
                    }
                    else {
                        _this.simpleDispatch(4 /* COMPLETE */);
                    }
                }, 0);
            }
        };
        HttpRequest.prototype.updateProgress = function (event) {
            if (event.lengthComputable) {
                this.simpleDispatch(15 /* PROGRESS */, [event.loaded, event.total]);
            }
        };
        HttpRequest.prototype.send = function (data) {
            if (this._responseType != undefined) {
                this._xhr.responseType = this._responseType == 0 /* TEXT */ ? "text" : "arraybuffer";
            }
            if (this._withCredentials != undefined) {
                this._xhr.withCredentials = this._withCredentials;
            }
            if (this.headerObj) {
                for (var key in this.headerObj) {
                    this._xhr.setRequestHeader(key, this.headerObj[key]);
                }
            }
            this._xhr.send(data);
        };
        HttpRequest.prototype.abort = function () {
            if (this._xhr) {
                this._xhr.abort();
            }
        };
        return HttpRequest;
    }(rf.MiniDispatcher));
    rf.HttpRequest = HttpRequest;
    /**
     * 图片加载类
     */
    var ImageLoader = /** @class */ (function (_super) {
        __extends(ImageLoader, _super);
        function ImageLoader() {
            return _super.call(this) || this;
        }
        Object.defineProperty(ImageLoader, "crossOrigin", {
            get: function () {
                return this._crossOrigin;
            },
            /**
             * 当从其他站点加载一个图片时，指定是否启用跨域资源共享(CORS)，默认值为null。
             * 可以设置为"anonymous","use-credentials"或null,设置为其他值将等同于"anonymous"。
             */
            set: function (value) {
                this._crossOrigin = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageLoader.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageLoader.prototype, "crossOrigin", {
            get: function () {
                return this._crossOrigin;
            },
            set: function (value) {
                this._hasCrossOriginSet = true;
                this._crossOrigin = value;
            },
            enumerable: true,
            configurable: true
        });
        ImageLoader.prototype.load = function (url) {
            var image = document.createElement("img");
            image.crossOrigin = "Anonymous";
            this._data = undefined;
            this._currentImage = image;
            if (this._hasCrossOriginSet) {
                if (this._crossOrigin) {
                    image.crossOrigin = this._crossOrigin;
                }
            }
            else {
                if (ImageLoader.crossOrigin) {
                    image.crossOrigin = ImageLoader.crossOrigin;
                }
            }
            image.onload = this.onImageComplete.bind(this);
            image.onerror = this.onLoadError.bind(this);
            image.src = url;
        };
        ImageLoader.prototype.onImageComplete = function (event) {
            var _this = this;
            var image = this.getImage(event);
            if (!image) {
                return;
            }
            this._data = image;
            setTimeout(function () {
                _this.simpleDispatch(4 /* COMPLETE */);
            }, 0);
        };
        ImageLoader.prototype.onLoadError = function () {
            var image = this.getImage(event);
            if (!image) {
                return;
            }
            this.simpleDispatch(16 /* IO_ERROR */, image.src);
        };
        ImageLoader.prototype.getImage = function (event) {
            var image = event.target;
            image.onerror = undefined;
            image.onload = undefined;
            if (this._currentImage !== image) {
                return undefined;
            }
            this._currentImage = undefined;
            return image;
        };
        return ImageLoader;
    }(rf.MiniDispatcher));
    rf.ImageLoader = ImageLoader;
    /**
     * Socket 连接
     */
    var Socket = /** @class */ (function (_super) {
        __extends(Socket, _super);
        function Socket(host, port) {
            var _this = _super.call(this) || this;
            _this._connected = false;
            _this._addInputPosition = 0;
            _this.endian = true;
            /**
             * 不再缓存服务端发来的数据
             */
            _this.disableInput = false;
            if (host && port > 0 && port < 65535) {
                _this.connect(host, port);
            }
            return _this;
        }
        Object.defineProperty(Socket.prototype, "connected", {
            get: function () {
                return this._connected;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Socket.prototype, "input", {
            /**
             * 输入流，服务端发送的数据
             */
            get: function () {
                return this._input;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Socket.prototype, "output", {
            /**
             * 输出流，要发送给服务端的数据
             */
            get: function () {
                return this._output;
            },
            enumerable: true,
            configurable: true
        });
        Socket.prototype.connect = function (host, port) {
            var url = "ws://" + host + ":" + port;
            if (window.location.protocol == "https:") {
                url = "wss://" + host + ":" + port;
            }
            this.connectByUrl(url);
        };
        Socket.prototype.connectByUrl = function (url) {
            var _this = this;
            if (this._webSocket != null) {
                this.close();
            }
            this._webSocket && this.cleanSocket();
            this._webSocket = new WebSocket(url);
            this._webSocket.binaryType = "arraybuffer";
            this._input = new rf.ByteArray();
            this._input.endian = this.endian;
            this._output = new rf.ByteArray();
            this._output.endian = this.endian;
            this._addInputPosition = 0;
            this._webSocket.onopen = function (e) {
                _this.onOpen(e);
            };
            this._webSocket.onmessage = function (msg) {
                _this.onMessage(msg);
            };
            this._webSocket.onclose = function (e) {
                _this.onClose(e);
            };
            this._webSocket.onerror = function (e) {
                _this.onError(e);
            };
        };
        Socket.prototype.cleanSocket = function () {
            try {
                this._webSocket.close();
            }
            catch (e) {
            }
            this._connected = false;
            this._webSocket.onopen = null;
            this._webSocket.onmessage = null;
            this._webSocket.onclose = null;
            this._webSocket.onerror = null;
            this._webSocket = null;
        };
        Socket.prototype.onOpen = function (e) {
            this._connected = true;
            this.simpleDispatch(9 /* OPEN */, e);
        };
        Socket.prototype.onMessage = function (msg) {
            if (!msg || !msg.data) {
                return;
            }
            var data = msg.data;
            // 不缓存接收的数据则直接抛出数据
            if (this.disableInput && data) {
                this.simpleDispatch(17 /* MESSAGE */, data);
                return;
            }
            // 如果输入流全部被读取完毕则清空
            if (this._input.length > 0 && this._input.bytesAvailable < 1) {
                this._input.clear();
                this._addInputPosition = 0;
            }
            ;
            // 获取当前的指针位置
            var pre = this._input.position;
            if (!this._addInputPosition) {
                this._addInputPosition = 0;
            }
            // 指向添加数据的指针位置
            this._input.position = this._addInputPosition;
            if (data) {
                // 添加数据
                if ((typeof data == "string")) {
                    this._input.writeUTFBytes(data);
                }
                else {
                    this._input._writeUint8Array(new Uint8Array(data));
                }
                // 记录下一次添加数据的指针位置
                this._addInputPosition = this._input.position;
                // 还原到当前的指针位置
                this._input.position = pre;
            }
            this.simpleDispatch(17 /* MESSAGE */, data);
        };
        Socket.prototype.onClose = function (e) {
            this._connected = false;
            this.simpleDispatch(10 /* CLOSE */, e);
        };
        Socket.prototype.onError = function (e) {
            this.simpleDispatch(14 /* ERROR */, e);
        };
        /**
         * 发送数据到服务器
         * @param data 需要发送的数据 可以是String或者ArrayBuffer
         */
        Socket.prototype.send = function (data) {
            this._webSocket.send(data);
        };
        Socket.prototype.flush = function () {
            if (this._output && this._output.length > 0) {
                var evt;
                try {
                    this._webSocket && this._webSocket.send(this._output.buffer);
                }
                catch (e) {
                    evt = e;
                }
                this._output.endian = this.endian;
                this._output.clear();
                if (evt) {
                    this.simpleDispatch(14 /* ERROR */, evt);
                }
            }
        };
        Socket.prototype.close = function () {
            if (this._webSocket != undefined) {
                try {
                    this._webSocket.close();
                }
                catch (e) {
                }
            }
        };
        return Socket;
    }(rf.MiniDispatcher));
    rf.Socket = Socket;
})(rf || (rf = {}));
//# sourceMappingURL=Net.js.map