# json2pb

Json2pb是一个可以把json对象转换为Protobuf编码的命令行工具。

把Json对象用Protobuf打包只需要输入：json2pb -pmotion.proto motion.json

*想要把csv文件打包的朋友们， 可以先用[evalcsv](https://github.com/randyliu/evalcsv.git)把csv文件转换为json对象。*


Install
-------

1. Install [node.js](https://nodejs.org)

2. Install with [npm](https://npmjs.org/package/json2pb)
```
    npm install -g json2pb
```


Usage
-----
		Usage: json2pb [options] files
			Options:
			-h, --help                   Display this information.
			-v, --version                Print the compiler version.
			-m, --message                Set the message to be built.
			-p, --proto                  Specify the .proto file for searching class name.

Example
-------

    motion.json:
    
		{
		      "rows": [
		          {
		              "motion_id": 11001,
		              "name": "跪姿肩部下沉",
		              "privileges": [
		                  "owner",
		                  "admin",
		                  "user",
		                  "guest"
		              ],
		              "type": "热身",
		              "category": "胸",
		          },
		          {
		              "motion_id": 11002,
		              "name": "直体肩部下沉",
		              "privileges": [
		                  "owner",
		                  "admin",
		                  "user",
		                  "guest"
		              ],
		              "type": "热身",
		              "category": "胸",
		          }
		      ]
		    }

	motion.proto:
	
		syntax = "proto3";
    		message motion_row {
	        	int32 motion_id = 1;
	         	string name = 2;
	  		repeated string privileges = 3;
	        	string type = 4;
	         	string category = 5;
    		}
    
    		message motion {
    			repeated motion_row rows = 1;
    		}

  command line:
  
		json2pb -pmotion.proto motion.json
    
    
Author
------

[@randyliu](http://github.com/randyliu)

Licence
-------
[See the MIT License](https://opensource.org/licenses/MIT)
