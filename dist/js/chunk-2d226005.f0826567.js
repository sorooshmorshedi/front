(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d226005"],{e796:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("m-form",{attrs:{title:"موزع ها",items:t.items,cols:t.cols,canSubmit:t.canSubmit,canDelete:t.canDelete,"is-editing":t.isEditing,showListBtn:!1,"show-navigation-btns":!1},on:{"update:isEditing":function(e){t.isEditing=e},"update:is-editing":function(e){t.isEditing=e},"click:row":t.setItem,clearForm:t.clearForm,submit:t.submit,delete:t.deleteItem},scopedSlots:t._u([{key:"default",fn:function(){return[i("v-row",[i("v-col",{attrs:{cols:"12",md:"4"}},[i("v-autocomplete",{attrs:{label:"* کاربر",items:t.users,"item-text":"name","item-value":"id",disabled:!t.isEditing},model:{value:t.item.user,callback:function(e){t.$set(t.item,"user",e)},expression:"item.user"}})],1),i("v-col",{attrs:{cols:"12",md:"8"}},[i("v-autocomplete",{attrs:{label:"روش های دریافت",disabled:!t.isEditing,items:t.receiveTypes,"item-text":"name","item-value":"id",multiple:!0},model:{value:t.item.defaultAccounts,callback:function(e){t.$set(t.item,"defaultAccounts",e)},expression:"item.defaultAccounts"}})],1)],1)]},proxy:!0}])})},n=[],a=(i("4de4"),i("caad"),i("2532"),i("da4b")),u=i("923b"),o=i("38da"),c=i("a49f"),l={mixins:[a["b"],u["a"],o["a"],c["a"]],data:function(){return{item:{},baseUrl:"distributions/distributors",permissionBasename:"distributor",appendSlash:!0,cols:[{text:"نام",value:"user.name"}]}},computed:{items:function(){return this.$store.state.distributors},receiveTypes:function(){var t="receive";return this.defaultAccounts.filter((function(e){return e.usage&&e.usage.toLowerCase().includes(t)}))}},methods:{getData:function(){this.getDefaultAccounts(),this.getUsers(),this.getDistributors(!0)}}},r=l,d=i("2877"),m=i("6544"),f=i.n(m),b=i("c6a6"),p=i("62ad"),v=i("0fd9"),g=Object(d["a"])(r,s,n,!1,null,null,null);e["default"]=g.exports;f()(g,{VAutocomplete:b["a"],VCol:p["a"],VRow:v["a"]})}}]);
//# sourceMappingURL=chunk-2d226005.f0826567.js.map