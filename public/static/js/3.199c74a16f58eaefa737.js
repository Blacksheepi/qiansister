webpackJsonp([3],{B8Zw:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o={data:function(){return{form:{name:"",password:"",rememberme:!1},rules:{name:[{required:!0,message:"请输入用户名",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"}]}}},methods:{onSubmit:function(t){var e=this;e.$refs[t].validate(function(t){if(!t)return console.log("validate error"),!1;var r={username:e.form.name,password:e.form.password,rememberme:!1},o=GSHP_SERVER_ENDPOINT+"/login";e.$http.post(o,r).then(function(t){e.$store.dispatch("logIn",r),e.$router.push("/Home")},function(t){e.$alert("用户名或密码错误，请重新输入","提示",{confirmButtonText:"确定"})})})}}},n={render:function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"login-wrapper",attrs:{id:"login-page"}},[o("img",{staticClass:"lg-backgroud",attrs:{src:r("tcAy"),width:"100%",height:"100%"}}),t._v(" "),o("el-card",{staticClass:"box-card-login"},[o("el-form",{ref:"loginForm",attrs:{model:t.form,rules:t.rules}},[o("el-form-item",[o("div",{staticClass:"login-title"},[t._v("基于实测数据的绿色建筑地源热泵\u2028")]),t._v(" "),o("div",{staticClass:"login-title"},[t._v("\u2028运行效果后评估研究")])]),t._v(" "),o("el-form-item",{attrs:{prop:"name"}},[o("el-input",{attrs:{placeholder:"请输入用户名"},model:{value:t.form.name,callback:function(e){t.$set(t.form,"name","string"==typeof e?e.trim():e)},expression:"form.name"}})],1),t._v(" "),o("el-form-item",{attrs:{prop:"password"}},[o("el-input",{attrs:{type:"password","auto-complete":"off",placeholder:"请输入密码"},nativeOn:{keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13,e.key))return null;t.onSubmit("loginForm")}},model:{value:t.form.password,callback:function(e){t.$set(t.form,"password",e)},expression:"form.password"}})],1),t._v(" "),o("el-form-item",{staticStyle:{"margin-bottom":"8px"}},[o("el-button",{staticClass:"login-button",attrs:{type:"primary"},on:{click:function(e){t.onSubmit("loginForm")}}},[t._v("登录")])],1)],1)],1)],1)},staticRenderFns:[]},s=r("VU/8")(o,n,!1,function(t){r("vUzy")},null,null);e.default=s.exports},tcAy:function(t,e,r){t.exports=r.p+"static/img/loginBac.0fd3783.jpeg"},vUzy:function(t,e){}});
//# sourceMappingURL=3.199c74a16f58eaefa737.js.map