# json2pb

Json2pb is a command line tool for converting json file to protobuf encoding file.
Json2pb是一个可以把存储json对象的文件转换为存储Protobuf编码的文件。


如果每一个json对象都含有_message字段来说明这个对象的类型

那么把Json对象用Protobuf打包只需要输入：json2pb -pmotion.proto motion.json

想要把csv资源打包的朋友们， 可以使用[evalcsv](https://github.com/randyliu/evalcsv.git)把csv转换为json对象。


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
	      -t, --tag                    The tag of storing message name, default is _message
	      -n, --namespace              Set the namespace to be built.
	      -p, --proto                  Specify the .proto file for searching class name.

Example
-------

- 每一个json对象必须含有一个_message字段来说明这个对象的类型。

    motion.json:
    
		{
		      "_message": "motion",
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
		              "_message": "motion_row"
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
		              "_message": "motion_row"
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
