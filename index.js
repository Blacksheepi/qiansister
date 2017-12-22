require("babel-core/register");
require("./bin/www");
require("babel-core").transform("code", {
   plugins: ["transform-runtime"]
});