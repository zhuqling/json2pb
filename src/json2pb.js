'use strict';
var    mod_getopt = require('posix-getopt'),
        pkg     = require('../package.json'),
        ProtoBuf = require("protobufjs"),
        packer  = require('./packer.js'),
        cofs = require('co-fs'),
        ejs = require('ejs');

var json2pb = module.exports = {};

function version()
{
    console.log("%s version %s", pkg['name'], pkg['version']);
}

function usage()
{
    console.error("Usage: %s [options] files\n", pkg['name']);
    console.error("Use %s --help for a list of options", pkg['name']);
}

function help()
{
    console.error("Usage: %s [options] files", pkg['name']);
    console.error("Options:");
    console.error("  -h, --help                   Display this information.");
    console.error("  -v, --version                Print the compiler version.");
    console.error("  -t, --tag                    The tag of storing message name, default is %s", packer.tag);
    console.error("  -n, --namespace              Set the namespace to be built.");
    console.error("  -p, --proto                  Specify the .proto file for searching class name.");
}

json2pb.main = function*(argv) {
    var parser, option;
    var builder = ProtoBuf.newBuilder({ convertFieldsToCamelCase: false });

    parser = new mod_getopt.BasicParser('v(version)h(help)t:(tag)n:(namespace)p:(proto)', argv);
    var namespace = '';
    while ((option = parser.getopt()) !== undefined) {
        switch (option.option) {
            case 'v':
                version();
                return 0;
            case 'h':
                help();
                return 0;
            case 'n':
                namespace = option.optarg;
                break;
            case 't':
                packer.tag = option.optarg;
                break;
            case 'p':
                ProtoBuf.loadProtoFile(option.optarg, builder);
                break;
            default:
                /* error message already emitted by getopt */
                return 1;
        }
    }

    if (parser.optind() >= argv.length) {
        console.error('Missing required argument: "input"');
        usage();
        return 1;
    }
    packer.root = builder.build(namespace);
    if(packer.root == null)
    {
        console.error('Missing --proto=[protobuf .proto file].');
        usage();
        return 1;
    }


    for(var i = parser.optind(); i < argv.length; ++i) {
        var input_file = argv[i];
        var output_file = null;
        if (input_file.substring(input_file.length - 5, input_file.length) == '.json') {
            output_file = input_file.substring(0, input_file.length - 5) + '.pb';
        } else {
            output_file = input_file + '.pb';
        }

        var str = yield cofs.readFile(input_file, 'utf8');
        var obj = JSON.parse(str);
        var pbobj = yield packer.json2pb(obj);
        var byteBuffer = pbobj.encode();
        var buffer = byteBuffer.toBuffer();
        yield cofs.writeFile(output_file, buffer);
        yield cofs.chmod(output_file, 438);
    }

    return 0;
};
