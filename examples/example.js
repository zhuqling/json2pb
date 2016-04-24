/**
 * Created by randy on 2016/4/24.
 */

ProtoBuf = require("protobufjs"),
    fs = require('fs');

var builder = ProtoBuf.newBuilder({ convertFieldsToCamelCase: false });
ProtoBuf.loadProtoFile(__dirname + '/motion.proto', builder);
var root = builder.build('json2pb');


var buffer = fs.readFileSync(__dirname + '/motion.pb');

var motion = root.motion.decode(buffer);
console.log(motion.encodeJSON());