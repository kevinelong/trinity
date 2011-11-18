var trinity = require("../src/trinity.js");
trinity.set("path", __dirname + "trinity/");

module.exports = {
	"trinity set config.path": function (test) {
		test.expect(3);
		test.ok(trinity);
		test.ok(trinity.set);
		trinity.set("path", __dirname + "/trinity/");
		trinity("test", {}, function (error, docfrag, load) {
			test.ok(docfrag);
			test.done();
		});
	},
	"trinity set config.static": function (test) {
		test.expect(1);
		trinity.set("static", "other");
		trinity("test", {}, function (error, docfrag, load) {
			var p = docfrag.ownerDocument.body.childNodes[1];
			test.ok(p.textContent === " other world ");
			trinity.set("static", "static");
			test.done();
		});
	},
	"trinity set config.publicPath": function (test) {
		test.expect(1);
		trinity.set("publicPath", "other");
		trinity("test", {}, function (error, docfrag, load) {
			var doc = docfrag.ownerDocument;
			var children = [].slice.call(doc.head.childNodes);
			test.ok(children.some(function (node) {
				return node.tagName === "STYLE" &&
					node.src === "other/static.css";
			}));
			trinity.set("publicPath", "trinity");
			test.done();
		});	
	},
	"trinity works with basic html": function (test) {
		test.expect(2);
		trinity("test", {}, function (error, docfrag, load) {
			test.ok(docfrag);
			test.ok(docfrag.firstChild.tagName === "P");
			test.done();
		});
	},
	"trinity json object is optional": function (test) {
		test.expect(2);
		trinity("test", function (error, docfrag, load) {
			test.ok(docfrag);
			test.ok(docfrag.firstChild.tagName === "P");
			test.done();
		});	
	},
	"trinity works with static file": function (test) {
		test.expect(5);
		trinity("test", {}, function (error, docfrag, load) {
			var doc = docfrag.ownerDocument;
			test.ok(doc);
			test.ok(doc.body);
			test.ok(doc.body.childNodes[1]);
			test.ok(doc.body.childNodes[1].tagName === "P");
			test.ok(doc.body.childNodes[1].textContent === " Hello world ");
			test.done();
		});
	},
	"trinity returns err on non existant file": function (test) {
		test.expect(2);
		trinity("notexist", {}, function (error, docfrag, load) {
			test.ok(error);
			test.ok(error.message.indexOf("No such file") > -1);
			test.done();
		});
	},
	"trinity works with static css": function (test) {
		test.expect(2);
		trinity("test", {}, function (error, docfrag, load) {
			var doc = docfrag.ownerDocument;
			test.ok(doc.head);
			var children = [].slice.call(doc.head.childNodes);
			test.ok(children.some(function (node) {
				return node.tagName === "STYLE" &&
					node.src === "trinity/static.css";
			}));
			test.done();
		});
	},
	"trinity works with static js": function (test) {
		test.expect(1);
		trinity("test", {}, function (error, docfrag, load) {
			var doc = docfrag.ownerDocument;
			var children = [].slice.call(doc.head.childNodes);
			test.ok(children.some(function (node) {
				return node.tagName === "SCRIPT" &&
					node.src === "trinity/static.js";
			}));
			test.done();
		});
	},
	"trinity works with css": function (test) {
		test.expect(1);
		trinity("test", {}, function (error, docfrag, load) {
			var doc = docfrag.ownerDocument;
			var children = [].slice.call(doc.head.childNodes);
			test.ok(children.some(function (node) {
				return node.tagName === "STYLE" &&
					node.textContent.indexOf("color: blue;") > -1;
			}));
			test.done();
		});
	},
	"trinity works without css": function (test) {
		test.expect(1);
		trinity("simple", {}, function (error, docfrag, load) {
			test.ok(docfrag.firstChild);
			test.done();
		});
	},
	"trinity test json passes through": function (test) {
		test.expect(1);
		trinity("test", {"baz": "bar"}, function (error, docfrag, load) {
			test.ok(docfrag.firstChild.textContent === "bar");
			test.done();
		});	
	},
	"trinity works with js": function (test) {
		test.expect(2);
		trinity("test", {}, function (error, docfrag, load) {
			var div = docfrag.childNodes[1];
			test.ok(div);
			test.ok(div.tagName === "DIV");
			test.done();
		});
	},
	"test loading other fragments": function (test) {
		test.expect(6);
		trinity("test", {}, function (error, docfrag, load) {
			test.ok(load);
			load("simple", {}, function (error, docfrag, load) {
				test.ok(error === null);
				test.ok(docfrag);
				test.ok(load);
				test.ok(docfrag.firstChild);
				test.ok(docfrag.firstChild.textContent === " simple ");
				test.done();
			});
		})
	}
};