(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d21f2c6"],{d961:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("m-form",{attrs:{title:"تحویل فاکتور ها جهت توزیع",showList:!1,listRoute:{name:"DistributionsList"},exportBaseUrl:"reports/lists/distributions",exportParams:{id:this.id},canDelete:!1,canSubmit:t.canSubmit,isEditing:t.isEditing,confirmBtnText:t.confirmBtnText,cancelConfirmBtnText:t.cancelConfirmBtnText,canConfirm:t.canConfirm,canCancelConfirm:t.canCancelConfirm},on:{"update:isEditing":function(e){t.isEditing=e},"update:is-editing":function(e){t.isEditing=e},cancelConfirm:t.cancelConfirm,confirm:t.confirm,goToForm:t.getItemByPosition,submit:t.submit,delete:t.deleteItem,clearForm:function(e){return t.clearForm()}},scopedSlots:t._u([{key:"header-btns",fn:function(){},proxy:!0}])},[[i("v-row",[i("v-col",{attrs:{cols:"12",md:"2"}},[i("v-text-field",{attrs:{disabled:"",label:"عطف","background-color":"white"},model:{value:t.item.local_id,callback:function(e){t.$set(t.item,"local_id",e)},expression:"item.local_id"}})],1),i("v-col",{attrs:{cols:"12",md:"2"}},[i("v-text-field",{attrs:{disabled:"",label:"شماره","background-color":"white"},model:{value:t.item.code,callback:function(e){t.$set(t.item,"code",e)},expression:"item.code"}})],1),i("v-col",{attrs:{cols:"12",md:"2"}},[i("date",{attrs:{label:" * تاریخ ",default:!0,disabled:!t.isEditing},model:{value:t.item.date,callback:function(e){t.$set(t.item,"date",e)},expression:"item.date"}})],1),i("v-col",{attrs:{cols:"12",md:"2"}},[i("mtime",{attrs:{label:" * ساعت",default:!0,disabled:!t.isEditing},model:{value:t.item.time,callback:function(e){t.$set(t.item,"time",e)},expression:"item.time"}})],1),i("v-col",{attrs:{cols:"12",md:"4"}},[i("v-autocomplete",{attrs:{label:"* ماشین",items:t.cars,"item-text":"car_number","item-value":"id",disabled:!t.isEditing},model:{value:t.item.car,callback:function(e){t.$set(t.item,"car",e)},expression:"item.car"}})],1),i("v-col",{attrs:{cols:"12",md:"8"}},[i("v-textarea",{attrs:{label:"توضیحات",disabled:!t.isEditing},model:{value:t.item.explanation,callback:function(e){t.$set(t.item,"explanation",e)},expression:"item.explanation"}})],1),i("v-col",{attrs:{cols:"12",md:"4"}},[t.item.created_by?i("v-text-field",{attrs:{label:"کاربر",disabled:""},model:{value:t.item.created_by.name,callback:function(e){t.$set(t.item.created_by,"name",e)},expression:"item.created_by.name"}}):t._e()],1),t.id?i("v-col",{attrs:{cols:"12"}},[t.isEditing?i("v-card-subtitle",[t._v("فاکتور های فعلی (برای حذف فاکتور آن را از انتخاب خارج کنید)")]):t._e(),i("m-datatable",{ref:"datatable",attrs:{headers:t.selectedFactorsHeaders,filters:t.filters,showExportBtns:!1,items:t.item.factors},on:{"update:filters":function(e){t.filters=e}},scopedSlots:t._u([{key:"item.operations",fn:function(e){e.item;return[i("v-menu",{attrs:{"offset-y":"",transition:"slide-y-transition",origin:"center center"},scopedSlots:t._u([{key:"activator",fn:function(e){var s=e.on,a=e.attrs;return[i("v-btn",t._g(t._b({attrs:{"x-small":"",depressed:"",color:"green white--text"}},"v-btn",a,!1),s),[t._v("تحویل کامل")])]}}],null,!0)},[i("v-card",[i("v-card-text",{staticClass:"pa-1"},[i("v-btn",{attrs:{block:"",depressed:"",color:"light-blue white--text"}},[t._v("ثبت دریافت")]),i("v-btn",{staticClass:"mt-1",attrs:{block:"",depressed:"",color:"light-blue white--text"}},[t._v("نسیه")])],1)],1)],1),i("v-menu",{attrs:{"offset-y":"",transition:"slide-y-transition",origin:"center center"},scopedSlots:t._u([{key:"activator",fn:function(e){var s=e.on,a=e.attrs;return[i("v-btn",t._g(t._b({staticClass:"mr-1",attrs:{depressed:"",color:"orange white--text"}},"v-btn",a,!1),s),[t._v("تحویل ناقص")])]}}],null,!0)},[i("v-card",[i("v-card-text",{staticClass:"pa-1"},[i("v-btn",{attrs:{block:"",depressed:"",color:"light-blue white--text"}},[t._v("ثبت برگشت از فروش")]),i("v-btn",{staticClass:"mt-1",attrs:{block:"",depressed:"",color:"light-blue white--text"}},[t._v("ثبت دریافت")])],1)],1)],1),i("v-btn",{staticClass:"mr-1",attrs:{"x-small":"",depressed:"",color:"red white--text"}},[t._v("مرجوع")])]}}],null,!1,3198010047),model:{value:t.factors,callback:function(e){t.factors=e},expression:"factors"}})],1):t._e(),t.isEditing?[t.id?i("v-col",{attrs:{cols:"12"}},[i("v-card-subtitle",[t._v("فاکتور هایی که میخواهید اضافه کنید از لیست پایین انتخاب کنید")])],1):t._e(),i("v-col",{staticClass:"py-1",attrs:{cols:"12"}},[i("tree-select",{attrs:{levelsCount:5,items:t.paths,labels:t.PathLevels,itemsIn:t.filters.path__in,"item-text":"name"},on:{"update:itemsIn":function(e){return t.$set(t.filters,"path__in",e)},"update:items-in":function(e){return t.$set(t.filters,"path__in",e)}}})],1),i("v-col",{staticClass:"py-1",attrs:{cols:"12"}},[i("tree-select",{attrs:{levelsCount:4,items:t.visitors,labels:t.VisitorLevels,itemsIn:t.filters.visitor__in,"item-text":"user.name"},on:{"update:itemsIn":function(e){return t.$set(t.filters,"visitor__in",e)},"update:items-in":function(e){return t.$set(t.filters,"visitor__in",e)}}})],1),i("v-col",{staticClass:"py-1",attrs:{cols:"12"}},[i("m-datatable",{ref:"datatable",attrs:{headers:t.headers,filters:t.filters,showExportBtns:!1,apiUrl:"reports/lists/factors"},on:{"update:filters":function(e){t.filters=e}},model:{value:t.factors,callback:function(e){t.factors=e},expression:"factors"}})],1)]:t._e()],2)]],2)},a=[],n=(i("99af"),i("4de4"),i("d81d"),i("b0c0"),i("2909")),r=i("da4b"),l=i("923b"),o=i("12761"),c=i("4633"),u=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-row",{attrs:{"no-gutters":""}},t._l(t.levelsCount,(function(e,s){return i("v-col",{key:s,class:0!=s?"pr-3":"pr-0"},[0==s||t.selectedLevels[s-1]&&t.selectedLevels[s-1].length?i("v-autocomplete",{attrs:{label:t.getTitle(s),items:t.getItems(s),"item-text":t.levelText,"item-value":"id",multiple:!0,clearable:!0,"small-chips":!0,"deletable-chips":!0,"return-object":!0},on:{input:function(e){return t.emit(s)},"click:clear":function(e){return t.emit(s)}},model:{value:t.selectedLevels[s],callback:function(e){t.$set(t.selectedLevels,s,e)},expression:"selectedLevels[i]"}}):t._e()],1)})),1)},d=[],m=(i("7db0"),i("a15b"),i("13d5"),i("ac1f"),i("1276"),i("2ca0"),i("b85c")),f=i("5530"),v=i("7eac"),b={name:"TreeSelect",props:{levelsCount:{require:!0},items:{require:!0},labels:{require:!0},itemText:{default:"text"},itemsIn:{}},data:function(){return{selectedLevels:[]}},created:function(){for(var t=[],e=0;e<this.levelsCount;e++)t.push([]);this.$set(this,"selectedLevels",t)},computed:{nodes:function(){return this.buildTree(this.items)},levelText:function(){return"title"}},methods:{buildTree:function(t){var e=this,i=this.copy(t);i=i.map((function(t){return Object(f["a"])({children:[],title:e.getItemText(t)},t)}));var s,a=Object(m["a"])(i);try{var n=function(){var t=s.value,a=i.find((function(e){return e.id==t.parent}));a&&(t.title="".concat(e.getItemText(t)," > ").concat(e.getItemText(t)),a.children.push(t))};for(a.s();!(s=a.n()).done;)n()}catch(l){a.e(l)}finally{a.f()}var r=i.filter((function(t){return!t.parent}));return r},getTitle:function(t){return Object(v["d"])(this.labels,t)},getItems:function(t){if(0==t)return this.nodes;var e=[],i=this.selectedLevels[t-1];if(i){var s,a=Object(m["a"])(this.selectedLevels[t-1]);try{for(a.s();!(s=a.n()).done;){var r=s.value;e.push.apply(e,Object(n["a"])(r.children))}}catch(l){a.e(l)}finally{a.f()}}return e},clearSelectedLevels:function(t){for(var e=t+1;e<this.levelsCount;e++)this.selectedLevels[e]=null},emit:function(t){var e=this;this.clearSelectedLevels(t);var i=[];if(t==this.levelsCount-1)i=this.selectedLevels[t];else{var s=this.selectedLevels[t];i=this.items.filter((function(t){return t.level==e.levelsCount-1})).filter((function(t){var e,i=Object(m["a"])(s);try{for(i.s();!(e=i.n()).done;){var a=e.value;if(t.code.startsWith(a.code))return!0}}catch(n){i.e(n)}finally{i.f()}return!1}))}this.$emit("update:itemsIn",i.map((function(t){return t.id})).join(","))},getItemText:function(t){var e=this.itemText.split(".").reduce((function(t,e){return t?t[e]:null}),t);return e}}},p=b,h=i("2877"),x=i("6544"),_=i.n(x),g=i("c6a6"),C=i("62ad"),y=i("0fd9"),k=Object(h["a"])(p,u,d,!1,null,null,null),T=k.exports;_()(k,{VAutocomplete:g["a"],VCol:C["a"],VRow:y["a"]});var w={name:"DistributionForm",mixins:[r["b"],l["a"],c["a"]],components:{mtime:o["a"],TreeSelect:T},props:{id:{}},data:function(){return{baseUrl:"distributions/distributions",permissionBasename:"distributions",appendSlash:!0,hasList:!1,hasIdProp:!0,filters:{type:"sale",is_definite:!0,is_loaded:!1},factors:[],PathLevels:v["b"],VisitorLevels:v["c"]}},computed:{headers:function(){return[{text:"شماره",value:"code"},{text:"تاریخ",value:"date",type:"date"},{text:"خریدار",value:"account.name"},{text:"شرح",value:"explanation"},{text:"مبلغ کل فاکتور",value:"total_sum",type:"numeric"},{text:"ویزیتور",value:"visitor",items:this.visitors.filter((function(t){return 3==t.level})).map((function(t){return{text:t.user.name,value:t.id}})),itemText:"user.name",itemValue:"id"}]},selectedFactorsHeaders:function(){return[].concat(Object(n["a"])(this.headers),[{text:"عملیات ها",value:"operations"}])}},methods:{getItemTemplate:function(){return{factors:[]}},getItemByPosition:function(t){var e=this;return this.request({url:this.endpoint("".concat(this.baseUrl,"/byPosition")),method:"get",params:{id:this.item.id,position:t},success:function(t){e.setItem(t)}})},getData:function(){this.getCars(),this.getVisitors(),this.getPaths()},setItem:function(t){this.item=t,this.changeRouteTo(t.id),this.factors=this.copy(t.factors)},getSerialized:function(){var t=this.extractIds(this.item);return t.factors=this.factors.map((function(t){return t.id})),t}}},L=w,I=i("8336"),V=i("b0af"),$=i("99d9"),E=i("e449"),S=i("8654"),j=i("a844"),B=Object(h["a"])(L,s,a,!1,null,"6b363acf",null);e["default"]=B.exports;_()(B,{VAutocomplete:g["a"],VBtn:I["a"],VCard:V["a"],VCardSubtitle:$["b"],VCardText:$["c"],VCol:C["a"],VMenu:E["a"],VRow:y["a"],VTextField:S["a"],VTextarea:j["a"]})}}]);
//# sourceMappingURL=chunk-2d21f2c6.8b3d4baf.js.map