'use strict';
var util = require('util');

module.exports = function() {
    this.stack = [];
};

module.exports.prototype.getValue = function(jo, field) {
    var type = field.type;
    var resolvedType = field.resolvedType;
    if(jo == null) {
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
            if(!Number.isInteger(jo)) {
                throw new Error(util.format("Field[%s] not integer", field.name));
            }
            if((jo < int32_min) || (jo > int32_max)) {
                throw new Error(util.format("Field[%s] integer Overflow", field.name));
            }
            return jo;
        case "uint32":
        case "fixed32":
            if(!Number.isInteger(jo)) {
                throw new Error(util.format("Field[%s] not integer", field.name));
            }
            if((jo < 0) || (jo > uint32_max)) {
                throw new Error(util.format("Field[%s] integer Overflow", field.name));
            }
            return jo;

        case "int64":
        case "sint64":
        case "sfixed64":
            if(!Number.isInteger(jo)) {
                throw new Error(util.format("Field[%s] not integer", field.name));
            }
            if((jo < int64_min) || (jo > int64_max)) {
                throw new Error(util.format("Field[%s] integer Overflow", field.name));
            }
            return jo;
        case "uint64":
        case "fixed64":
            if(!Number.isInteger(jo)) {
                throw new Error(util.format("Field[%s] not integer", field.name));
            }
            if((jo < 0) || (jo > uint64_max)) {
                throw new Error(util.format("Field[%s] integer Overflow", field.name));
            }
            return jo;

        case "message" :
            return this.jsonDecode(jo, resolvedType.clazz);
        case "float":
        case "double":
        case "bool":
        case "string":
        case "enum":
            return jo;
        default:
            throw new Error('Field[%s] type unknow.', field.name, type.name);
    }
};

module.exports.prototype.jsonDecode = function(jo, T) {
    this.stack.push(jo);

    var pbo = new T();
    for(var field of pbo.$type.children)
    {
        var fjo = jo[field.name];

        try {
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
                    var fpbo = this.getValue(element, field);
                    pbo.add(field.name, fpbo);
                }
            } else {
                var fpbo = this.getValue(fjo, field);
                pbo.set(field.name, fpbo);
            }
        } catch (error) {
            error.jo = jo;
            error.ejo = {
            };
            error.ejo[field.name] = fjo;
            throw error;
        }
    }
    this.stack.pop();
    return pbo;
};
