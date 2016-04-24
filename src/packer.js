/**
 * Created by randy on 2016/4/17.
 */
'use strict';

var fs = require('co-fs'),
    path = require('path'),
    util = require('util'),
    pkg     = require('../package.json');

var packer = module.exports = { };

packer.tag = '_message';
packer.root = null;
packer.stack = [];

packer.json2pb = function*(obj) {
    packer.stack.push(obj);

    var message_name = obj[packer.tag];
    if((message_name == undefined) || (message_name == null)) {
        throw new Error(util.format('[%s] not exists.', packer.tag));
    }
    var T = packer.root[message_name];
    if((T == undefined) || (T == null)) {
        throw new Error(util.format('Message [%s] not exists.', message_name));
    }
    var pbo = new T();
    for(var field of pbo.$type.children)
    {
        var fjo = obj[field.name];
        if(field.required) {
            if(fjo == undefined) {
                throw new Error(util.format('Missing required field [%s].', field.name));
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
                    fpbo = yield packer.json2pb(entity);
                }
                if(fpbo == null) {
                    throw new Error('Object parse failed.');
                }
                pbo[field.name].push(fpbo)
            }
        } else {
            var fpbo = null;
            if(field_type == null) {
                fpbo = fjo;
            } else if(field_type.className == "Message") {
                fpbo = yield packer.json2pb(fjo);
            }
            if(fpbo == null) {
                throw new Error('Object parse failed.');
            }
            pbo[field.name] = fpbo;
        }
    }
    packer.stack.pop();
    return pbo;
};
