/**
 * Created by randy on 2016/4/17.
 */
'use strict';

var fs = require('co-fs'),
    path = require('path'),
    pkg     = require('../package.json');

var packer = module.exports = {};

packer.namespace = '';
packer.builder = null;
packer.root = null;

packer.encode = function*(obj) {

    return null;
};
