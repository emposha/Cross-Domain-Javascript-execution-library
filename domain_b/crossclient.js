/*
  CrossDomain Javascript Function Execute Client Side - Distributed under MIT - Keep this message! */
var crossdomain = {
    archive: {},
    client: function (frame_id) {
        if (typeof this.archive[frame_id] == "undefined") {
            this.archive[frame_id] = new this.fc(frame_id);
        }
        return this.archive[frame_id];
    }
}
crossdomain.fc = function () {
    this.path = null;
    this.done = false;
    this.timer = 0;
    this.ready = null;
    this.frame_id = arguments[0];
}
crossdomain.fc.prototype = {
    init: function (path) {
        this.path = path;
    },
    insertFrame: function () {
        if (document.getElementById(this.frame_id) == null) {
            var frame = document.createElement("iframe");
            frame.setAttribute("id", this.frame_id);
            frame.setAttribute("src", "");
            frame.style.display = "none";
            document.body.appendChild(frame);
        }
    },
    callfunc: function (func, attr) {
        if (this.path != null) {
            var url = (this.path.indexOf("?") != -1 ? this.path + "&" : this.path + "?") + "func=" + func + "&attr=" + this.base64_encode(this.serialize(attr));
            this.insertFrame();
            document.getElementById(this.frame_id).setAttribute("src", url);
        }
    },
    base64_encode: function (data) {
        var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var o1, o2, o3, h1, h2, h3, h4, bits, i = ac = 0,
            enc = "",
            tmp_arr = [];
        if (!data) {
            return data;
        }
        data = this.utf8_encode(data + '');
        do {
            o1 = data.charCodeAt(i++);
            o2 = data.charCodeAt(i++);
            o3 = data.charCodeAt(i++);
            bits = o1 << 16 | o2 << 8 | o3;
            h1 = bits >> 18 & 0x3f;
            h2 = bits >> 12 & 0x3f;
            h3 = bits >> 6 & 0x3f;
            h4 = bits & 0x3f;
            tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
        } while (i < data.length);
        enc = tmp_arr.join('');
        switch (data.length % 3) {
        case 1:
            enc = enc.slice(0, -2) + '==';
            break;
        case 2:
            enc = enc.slice(0, -1) + '=';
            break;
        }
        return enc;
    },
    utf8_encode: function (string) {
        string = (string + '').replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        var utftext = "";
        var start, end;
        var stringl = 0;
        start = end = 0;
        stringl = string.length;
        for (var n = 0; n < stringl; n++) {
            var c1 = string.charCodeAt(n);
            var enc = null;
            if (c1 < 128) {
                end++;
            } else if ((c1 > 127) && (c1 < 2048)) {
                enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
            } else {
                enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
            }
            if (enc != null) {
                if (end > start) {
                    utftext += string.substring(start, end);
                }
                utftext += enc;
                start = end = n + 1;
            }
        }
        if (end > start) {
            utftext += string.substring(start, string.length);
        }
        return utftext;
    },
    serialize: function (mixed_value) {
        var _getType = function (inp) {
                var type = typeof inp,
                    match;
                var key;
                if (type == 'object' && !inp) {
                    return 'null';
                }
                if (type == "object") {
                    if (!inp.constructor) {
                        return 'object';
                    }
                    var cons = inp.constructor.toString();
                    if (match = cons.match(/(\w+)\(/)) {
                        cons = match[1].toLowerCase();
                    }
                    var types = ["boolean", "number", "string", "array"];
                    for (key in types) {
                        if (cons == types[key]) {
                            type = types[key];
                            break;
                        }
                    }
                }
                return type;
            };
        var type = _getType(mixed_value);
        var val, ktype = '';
        switch (type) {
        case "function":
            val = "";
            break;
        case "undefined":
            val = "N";
            break;
        case "boolean":
            val = "b:" + (mixed_value ? "1" : "0");
            break;
        case "number":
            val = (Math.round(mixed_value) == mixed_value ? "i" : "d") + ":" + mixed_value;
            break;
        case "string":
            val = "s:" + mixed_value.length + ":\"" + mixed_value + "\"";
            break;
        case "array":
        case "object":
            val = "a";
            var count = 0;
            var vals = "";
            var okey;
            var key;
            for (key in mixed_value) {
                ktype = _getType(mixed_value[key]);
                if (ktype == "function") {
                    continue;
                }
                okey = (key.match(/^[0-9]+$/) ? parseInt(key) : key);
                vals += this.serialize(okey) + this.serialize(mixed_value[key]);
                count++;
            }
            val += ":" + count + ":{" + vals + "}";
            break;
        }
        if (type != "object" && type != "array") val += ";";
        return val;
    }
}