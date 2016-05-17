'use strict';
var util = require('util');

module.exports = function() {
};

function getErrorObjectSnap(jo) {
    var o = {};
    var i = 0;
    for(var field in jo) {
        if(typeof jo[field] == "object") {
            continue;
        }
        if(i > 5) {
            break;
        }
        o[field] = jo[field];
        ++i;
    }
    var str = JSON.stringify(o);
    if(i > 5) {
        str = str.substring(0, str.length - 1);
        str += '........' + '}';
    }

    return str;
}

module.exports.prototype.getValue = function(value, field, jo) {
    var type = field.type;
    var resolvedType = field.resolvedType;
    if(value == null) {
        return type?type.defaultValue : null;
    }
    var uint32_max = 4294967295;
    var int32_max = 2147483647;
    var int32_min = (-int32_max - 1);

    var uint64_max = 18446744073709551615;
    var int64_max = 9223372036854775807;
    var int64_min = -(int64_max - 1);
    //整数类型边界的判断有问题。
    switch(type.name) {
        case "int32":
        case "sint32":
        case "sfixed32":
            if(!Number.isInteger(value)) {
                throw new Error(util.format("Field[\"%s\":%s] not integer, in %s", field.name, value, getErrorObjectSnap(jo)));
            }
            if((value < int32_min) || (value > int32_max)) {
                throw new Error(util.format("Integer[%s] Overflow at \"%s\":%s, in %s", field.type.name, field.name, value, getErrorObjectSnap(jo)));
            }
            return value;
        case "uint32":
        case "fixed32":
            if(!Number.isInteger(value)) {
                throw new Error(util.format("Field[\"%s\":%s] not integer, in %s", field.name, value, getErrorObjectSnap(jo)));
            }
            if((value < 0) || (value > uint32_max)) {
                throw new Error(util.format("Integer[%s] Overflow at \"%s\":%s, in %s", field.type.name, field.name, value, getErrorObjectSnap(jo)));
            }
            return value;

        case "int64":
        case "sint64":
        case "sfixed64":
            if(!Number.isInteger(value)) {
                throw new Error(util.format("Field[\"%s\":%s] not integer, in %s", field.name, value, getErrorObjectSnap(jo)));
            }
            if((value < int64_min) || (value > int64_max)) {
                throw new Error(util.format("Integer[%s] Overflow at \"%s\":%s, in %s", field.type.name, field.name, value, getErrorObjectSnap(jo)));
            }
            return value;
        case "uint64":
        case "fixed64":
            if(!Number.isInteger(value)) {
                throw new Error(util.format("Field[\"%s\":%s] not integer, in %s", field.name, value, getErrorObjectSnap(jo)));
            }
            if((value < 0) || (value > uint64_max)) {
                throw new Error(util.format("Integer[%s] Overflow at \"%s\":%s, in %s", field.type.name, field.name, value, getErrorObjectSnap(jo)));
            }
            return value;

        case "message" :
            return this.jsonDecode(value, resolvedType.clazz);
        case "float":
        case "double":
        case "bool":
        case "string":
        case "enum":
            return value;
        default:
            throw new Error(util.format("Field[%s] type unknow, in %s", field.name, getErrorObjectSnap(jo)));
    }
};

module.exports.prototype.jsonDecode = function(jo, T) {
    var pbo = new T();
    for(var field of pbo.$type.children)
    {
        var fjo = jo[field.name];

            if(field.required) {
                if(fjo == undefined) {
                    throw new Error(util.format('Missing required field[%s].', field.name));
                }
            }
            if(field.repeated) {
                if(!fjo instanceof Array) {
                    throw Error(util.format('Field[%s] does not match target type[Array].', field.name));
                }
                for(var element of fjo) {
                    var fpbo = this.getValue(element, field, jo);
                    pbo.add(field.name, fpbo);
                }
            } else {
                var fpbo = this.getValue(fjo, field, jo);
                pbo.set(field.name, fpbo);
            }
    }
    return pbo;
};
