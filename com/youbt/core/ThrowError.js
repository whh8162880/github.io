RELEASE = false;
DEBUG = true;
var rf;
(function (rf) {
    rf.ClientCheck = {
        /**
         * 是否做客户端检查
         */
        isClientCheck: true
    };
    /**
     * 错误前缀
     */
    rf.errorPrefix = "";
    if (RELEASE) {
        /**
         * 内存中存储的错误数据信息
         *
         */
        var errorMsg = [];
        /**
         * 在内存中存储报错数据
         * @param msg
         * @param atWho
         *
         */
        function pushMsg(msg) {
            if (errorMsg.length > rf.ThrowError.MaxCount) {
                errorMsg.shift();
            }
            var msg = getMsg(msg);
            errorMsg.push(msg);
            return msg;
        }
    }
    if (DEBUG) {
        rf.Log = function () {
            var msg = "%c";
            for (var i = 0; i < arguments.length; i++) {
                msg += arguments[i];
            }
            console.log(msg, "color:red");
        };
    }
    /**
    * 在内存中存储报错数据
    * @param msg
    * @private
    */
    function getMsg(msg) {
        return new Date()["format"]("[yyyy-MM-dd HH:mm:ss]", true) + "[info:]" + msg;
    }
    /**
     * 抛错
     * @param {string | Error}  msg 描述
     **/
    rf.ThrowError = function (msg, err, alert) {
        if (DEBUG && alert) {
            window.alert(msg);
        }
        msg = rf.errorPrefix + msg;
        msg += "%c";
        if (err) {
            msg += "\nError:\n[name]:" + err.name + ",[message]:" + err.message;
        }
        else {
            err = new Error();
        }
        msg += "\n[stack]:\n" + err.stack;
        if (DEBUG) {
            msg = getMsg(msg);
        }
        else if (RELEASE) {
            msg = pushMsg(msg);
        }
        console.log(msg, "color:red");
    };
    if (RELEASE) {
        rf.ThrowError.MaxCount = 50;
        rf.ThrowError.errorMsg = errorMsg;
    }
})(rf || (rf = {}));
//# sourceMappingURL=ThrowError.js.map