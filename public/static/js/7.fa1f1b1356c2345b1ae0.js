webpackJsonp([7],{"8rYO":function(e,t){},rB3Y:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=o("teIl"),n=o("TVmP"),r=o("PvTS"),i=o("x2ix"),c=o("+aT9"),s=o.n(c),d={data:function(){return{map:{},markers:[],geocoder:"",currentId:"",project:{}}},components:{headTop:a.a,footerBottom:n.default,topNav:r.default,projectList:i.a},mounted:function(){this.init()},methods:{init:function(){var e=this;e.map=new s.a.Map("container",{resizeEnable:!0,dragEnable:!0,keyboardEnable:!0,doubleClickZoom:!0,zoom:6,center:[118.79647,32.05838]}),s.a.plugin(["AMap.ToolBar","AMap.Scale","AMap.OverView"],function(){e.map.addControl(new s.a.ToolBar),e.map.addControl(new s.a.Scale),e.map.addControl(new s.a.OverView({isOpen:!0}))}),s.a.plugin("AMap.Geocoder",function(){e.geocoder=new s.a.Geocoder({})}),e.map.setFitView()},hoverItem:function(e){var t=this;if(e.id!==t.currentId){this.project=e,t.map.remove(t.markers);var o=e.location;t.geocoder.getLocation(o,function(o,a){if("complete"==o&&a.geocodes.length){var n=[a.geocodes[0].location.getLng(),a.geocodes[0].location.getLat()],r=new s.a.Marker({position:n,map:t.map});t.map.setZoomAndCenter(6,n),r.setAnimation("AMAP_ANIMATION_BOUNCE"),t.markers.push(r)}else t.map.remove(t.markers);t.currentId=e.id})}}}},p={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{attrs:{id:"home"}},[o("head-top"),e._v(" "),o("top-nav"),e._v(" "),o("div",{staticClass:"main-container"},[o("project-list",{on:{hoverItem:e.hoverItem}}),e._v(" "),o("div",{staticClass:"nav-right view row-container"},[o("div",{staticClass:"page-title"},[e.project.location?o("span",[e._v(e._s(e.project.name+"所在地"))]):o("span",[e._v("项目所在地")]),e._v(" "),e.project.location?o("span",[e._v(e._s("："+e.project.location))]):e._e()]),e._v(" "),e._m(0)])],1)],1)},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"container"}},[t("div",{attrs:{id:"map-container"}})])}]};var l=o("VU/8")(d,p,!1,function(e){o("8rYO")},null,null);t.default=l.exports}});
//# sourceMappingURL=7.fa1f1b1356c2345b1ae0.js.map