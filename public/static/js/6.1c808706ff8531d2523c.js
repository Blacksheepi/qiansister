webpackJsonp([6],{rB3Y:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=o("teIl"),n=o("TVmP"),i=o("PvTS"),r=o("x2ix"),s=o("+aT9"),c=o.n(s),d={data:function(){return{map:{},markers:[],geocoder:"",currentId:"",project:{}}},components:{headTop:a.a,footerBottom:n.default,topNav:i.default,projectList:r.a},mounted:function(){this.init()},methods:{init:function(){var t=this;t.map=new c.a.Map("container",{resizeEnable:!0,dragEnable:!0,keyboardEnable:!0,doubleClickZoom:!0,zoom:6,center:[118.79647,32.05838]}),c.a.plugin(["AMap.ToolBar","AMap.Scale","AMap.OverView"],function(){t.map.addControl(new c.a.ToolBar),t.map.addControl(new c.a.Scale),t.map.addControl(new c.a.OverView({isOpen:!0}))}),c.a.plugin("AMap.Geocoder",function(){t.geocoder=new c.a.Geocoder({})}),t.map.setFitView()},hoverItem:function(t){var e=this;if(t.id!=e.currentId){this.project=t,e.map.remove(e.markers);var o=t.location;e.geocoder.getLocation(o,function(o,a){if("complete"==o&&a.geocodes.length){var n=[a.geocodes[0].location.getLng(),a.geocodes[0].location.getLat()],i=new c.a.Marker({position:n,map:e.map});e.map.setZoomAndCenter(6,n),i.setAnimation("AMAP_ANIMATION_BOUNCE"),e.markers.push(i)}else e.map.remove(e.markers);e.currentId=t.id})}}}},p={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"home"}},[e("head-top"),this._v(" "),e("top-nav"),this._v(" "),e("div",{staticClass:"main-container"},[e("project-list",{on:{hoverItem:this.hoverItem}}),this._v(" "),e("div",{staticClass:"nav-right view row-container"},[e("div",{staticClass:"page-title"},[this.project.location?e("span",[this._v(this._s(this.project.name+"所在地"))]):e("span",[this._v("项目所在地")]),this._v(" "),this.project.location?e("span",[this._v(this._s("："+this.project.location))]):this._e()]),this._v(" "),this._m(0)])],1)],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"container"}},[e("div",{attrs:{id:"map-container"}})])}]},l=o("VU/8")(d,p,!1,function(t){o("w4VL")},null,null);e.default=l.exports},w4VL:function(t,e){}});
//# sourceMappingURL=6.1c808706ff8531d2523c.js.map