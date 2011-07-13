/*
  CrossDomain Javascript Function Execute Server Side 1.00
  
  Changelog:
  - 1.0: project started
*/

/* Coded by: Maxim Voldachinsky <admin@emposha.com> */
/* Copyright: Emposha.com <http://www.emposha.com/> - Distributed under MIT - Keep this message! */
var crossdomain =
{
	object : null,
	server: function() {
		if (this.object == null) {
			this.object = new this.fc();
		}
		return this.object;
	}
}
crossdomain.fc = function()
{
	
}
crossdomain.fc.prototype =
{
	init: function()
	{
		var func = this.parseGet("func");
		var attr = this.unserialize(this.base64_decode(this.parseGet("attr")));
		var params = '';
		if (typeof(attr) == 'object') 
		{
			for (var key in attr) 
			{
				params += attr[key] + ",";
			}
		}
		try
		{
			params = this.substr(params,0,-1);
			eval("window.parent.parent." + func + "(" + params + ")");
		} 
		catch ( e ) 
		{
			//console.log(e);
		}
	},
	parseGet: function (key)
	{
		var query = window.location.search.substring(1);
		var pairs = query.split("&");
		for (var i=0;i < pairs.length;i++)
		{
			var pos = pairs[i].indexOf('=');
			if (pos >= 0) 
			{	
				var argname = pairs[i].substring(0,pos);
				var value = pairs[i].substring(pos+1);
				if ( argname == key ) 
				{
					return value;
				}	
			}	
		}
		return "";
	},
	substr: function ( f_string, f_start, f_length ) {	 
	    f_string += '';
	 
	    if(f_start < 0) {
	        f_start += f_string.length;
	    }
	 
	    if(f_length == undefined) {
	        f_length = f_string.length;
	    } else if(f_length < 0){
	        f_length += f_string.length;
	    } else {
	        f_length += f_start;
	    }
	 
	    if(f_length < f_start) {
	        f_length = f_start;
	    }
	 
	    return f_string.substring(f_start, f_length);
	},
	base64_decode: function ( data ) {	 
	    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	    var o1, o2, o3, h1, h2, h3, h4, bits, i = ac = 0, dec = "", tmp_arr = [];
	 
	    if (!data) {
	        return data;
	    }
	 
	    data += '';
	 
	    do { 
	        h1 = b64.indexOf(data.charAt(i++));
	        h2 = b64.indexOf(data.charAt(i++));
	        h3 = b64.indexOf(data.charAt(i++));
	        h4 = b64.indexOf(data.charAt(i++));
	 
	        bits = h1<<18 | h2<<12 | h3<<6 | h4;
	 
	        o1 = bits>>16 & 0xff;
	        o2 = bits>>8 & 0xff;
	        o3 = bits & 0xff;
	 
	        if (h3 == 64) {
	            tmp_arr[ac++] = String.fromCharCode(o1);
	        } else if (h4 == 64) {
	            tmp_arr[ac++] = String.fromCharCode(o1, o2);
	        } else {
	            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
	        }
	    } while (i < data.length);
	 
	    dec = tmp_arr.join('');
	    dec = this.utf8_decode(dec);
	 
	    return dec;
	},
	utf8_decode: function ( str_data ) 
	{
	    var tmp_arr = [], i = ac = c1 = c2 = c3 = 0;
	 
	    str_data += '';
	 
	    while ( i < str_data.length ) {
	        c1 = str_data.charCodeAt(i);
	        if (c1 < 128) {
	            tmp_arr[ac++] = String.fromCharCode(c1);
	            i++;
	        } else if ((c1 > 191) && (c1 < 224)) {
	            c2 = str_data.charCodeAt(i+1);
	            tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
	            i += 2;
	        } else {
	            c2 = str_data.charCodeAt(i+1);
	            c3 = str_data.charCodeAt(i+2);
	            tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
	            i += 3;
	        }
	    }
	 
	    return tmp_arr.join('');
	},
	unserialize: function (data)
	{
	    var error = function (type, msg, filename, line){throw new window[type](msg, filename, line);};
	    var read_until = function (data, offset, stopchr){
	        var buf = [];
	        var chr = data.slice(offset, offset + 1);
	        var i = 2;
	        while(chr != stopchr){
	            if((i+offset) > data.length){
	                error('Error', 'Invalid');
	            }
	            buf.push(chr);
	            chr = data.slice(offset + (i - 1),offset + i);
	            i += 1;
	        }
	        return [buf.length, buf.join('')];
	    };
	    var read_chrs = function (data, offset, length){
	        buf = [];
	        for(var i = 0;i < length;i++){
	            var chr = data.slice(offset + (i - 1),offset + i);
	            buf.push(chr);
	        }
	        return [buf.length, buf.join('')];
	    };
	    var _unserialize = function (data, offset){
	        if(!offset) offset = 0;
	        var buf = [];
	        var dtype = (data.slice(offset, offset + 1)).toLowerCase();
	        
	        var dataoffset = offset + 2;
	        var typeconvert = new Function('x', 'return x');
	        var chrs = 0;
	        var datalength = 0;
	        
	        switch(dtype){
	            case "i":
	                typeconvert = new Function('x', 'return parseInt(x)');
	                var readData = read_until(data, dataoffset, ';');
	                var chrs = readData[0];
	                var readdata = readData[1];
	                dataoffset += chrs + 1;
	            break;
	            case "b":
	                typeconvert = new Function('x', 'return (parseInt(x) == 1)');
	                var readData = read_until(data, dataoffset, ';');
	                var chrs = readData[0];
	                var readdata = readData[1];
	                dataoffset += chrs + 1;
	            break;
	            case "d":
	                typeconvert = new Function('x', 'return parseFloat(x)');
	                var readData = read_until(data, dataoffset, ';');
	                var chrs = readData[0];
	                var readdata = readData[1];
	                dataoffset += chrs + 1;
	            break;
	            case "n":
	                readdata = null;
	            break;
	            case "s":
	                var ccount = read_until(data, dataoffset, ':');
	                var chrs = ccount[0];
	                var stringlength = ccount[1];
	                dataoffset += chrs + 2;
	                
	                var readData = read_chrs(data, dataoffset+1, parseInt(stringlength));
	                var chrs = readData[0];
	                var readdata = readData[1];
	                dataoffset += chrs + 2;
	                if(chrs != parseInt(stringlength) && chrs != readdata.length){
	                    error('SyntaxError', 'String length mismatch');
	                }
	            break;
	            case "a":
	                var readdata = {};
	                
	                var keyandchrs = read_until(data, dataoffset, ':');
	                var chrs = keyandchrs[0];
	                var keys = keyandchrs[1];
	                dataoffset += chrs + 2;
	                
	                for(var i = 0;i < parseInt(keys);i++){
	                    var kprops = _unserialize(data, dataoffset);
	                    var kchrs = kprops[1];
	                    var key = kprops[2];
	                    dataoffset += kchrs;
	                    
	                    var vprops = _unserialize(data, dataoffset);
	                    var vchrs = vprops[1];
	                    var value = vprops[2];
	                    dataoffset += vchrs;
	                    
	                    readdata[key] = value;
	                }
	                
	                dataoffset += 1;
	            break;
	            default:
	                error('SyntaxError', 'Unknown / Unhandled data type(s): ' + dtype);
	            break;
	        }
	        return [dtype, dataoffset - offset, typeconvert(readdata)];
	    };
	    return _unserialize(data, 0)[2];
	}
}