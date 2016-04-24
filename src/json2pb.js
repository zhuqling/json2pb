'use strict';
var    mod_getopt = require('posix-getopt'),
        pkg     = require('../package.json'),
        ProtoBuf = require("protobufjs"),
        cofs = require('co-fs');

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
    console.error("  -m, --message                Set the message to be built.");
    console.error("  -p, --proto                  Specify the protobuf's .proto file.");
}

json2pb.main = function*(argv) {
    var parser, option;
    var message = null;
    var builder = ProtoBuf.newBuilder({ convertFieldsToCamelCase: false });

    parser = new mod_getopt.BasicParser('v(version)h(help)m:(message)p:(proto)', argv);
    while ((option = parser.getopt()) !== undefined) {
        switch (option.option) {
            case 'v':
                version();
                return 0;
            case 'h':
                help();
                return 0;
            case 'm':
                message = option.optarg;
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
        console.error('Missing required argument: "file"');
        usage();
        return 1;
    }

    if(message == null) {
        console.error('Missing --message=[messsage to be built].');
        usage();
        return 1;
    }

    var root = builder.build();
    if(root == null)
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
        var pbobj = root[message].decodeJSON(str);
        var byteBuffer = pbobj.encode();
        var buffer = byteBuffer.toBuffer();
        yield cofs.writeFile(output_file, buffer);
        yield cofs.chmod(output_file, 438);
    }

    return 0;
};
