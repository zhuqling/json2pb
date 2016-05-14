/*
'use strict';
var util = require('util');

module.exports = function() {
    this.stack = [];
};

module.exports.prototype.jsonDecode = function*(obj, T) {
    this.stack.push(obj);

    var pbo = new T();
    for(var field of pbo.$type.children)
    {
        var fjo = obj[field.name];
        if(field.required) {
            if(fjo == undefined) {
                var e = new Error(util.format('Missing required field [%s].', field.name));
                e.json2pb = {
                    obj : obj,
                    T : T
                };
                throw e;
            }
        }
        if(fjo == undefined) {
            continue;
        }

        var field_type = field.resolvedType;
        if(field.repeated) {
            for(var entity of fjo) {
                var fpbo = null;
                if(field_type == null) {
                    fpbo = entity;
                } else if(field_type.className == "Message") {
                    fpbo = yield this.jsonDecode(entity, field_type.clazz);
                }
                if(fpbo == null) {
                    var e = new Error('Object parse failed.');
                    e.json2pb = {
                        obj : obj,
                        T : T
                    };
                    throw e;
                }
                pbo.add(field.name, fpbo, true);
            }
        } else {
            var fpbo = null;
            if(field_type == null) {
                fpbo = fjo;
            } else if(field_type.className == "Message") {
                fpbo = yield this.jsonDecode(fjo, field_type.clazz);
            }
            if(fpbo == null) {
                var e = new Error('Object parse failed.');
                e.json2pb = {
                    obj : obj,
                    T : T
                };
                throw e;
            }
            pbo.set(field.name, fpbo, true);
        }
    }
    this.stack.pop();
    return pbo;
};
*/