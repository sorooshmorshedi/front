(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d21f2c6"],{d961:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("m-form",{attrs:{title:"تحویل فاکتور ها جهت توزیع",showList:!1,listRoute:{name:"DistributionsList"},exportBaseUrl:"reports/lists/distributions",exportParams:{id:this.id},canDelete:!1,canSubmit:t.canSubmit,isEditing:t.isEditing,confirmBtnText:t.confirmBtnText,cancelConfirmBtnText:t.cancelConfirmBtnText,canConfirm:t.canConfirm,canCancelConfirm:t.canCancelConfirm},on:{"update:isEditing":function(e){t.isEditing=e},"update:is-editing":function(e){t.isEditing=e},cancelConfirm:t.cancelConfirm,confirm:t.confirm,goToForm:t.getItemByPosition,submit:t.submit,delete:t.deleteItem,clearForm:function(e){return t.clearForm()}},scopedSlots:t._u([{key:"header-btns",fn:function(){},proxy:!0}])},[[i("v-row",[i("v-col",{attrs:{cols:"12",md:"2"}},[i("v-text-field",{attrs:{disabled:"",label:"عطف","background-color":"white"},model:{value:t.item.local_id,callback:function(e){t.$set(t.item,"local_id",e)},expression:"item.local_id"}})],1),i("v-col",{attrs:{cols:"12",md:"2"}},[i("v-text-field",{attrs:{disabled:"",label:"شماره","background-color":"white"},model:{value:t.item.code,callback:function(e){t.$set(t.item,"code",e)},expression:"item.code"}})],1),i("v-col",{attrs:{cols:"12",md:"2"}},[i("date",{attrs:{label:" * تاریخ ",default:!0,disabled:!t.isEditing},model:{value:t.item.date,callback:function(e){t.$set(t.item,"date",e)},expression:"item.date"}})],1),i("v-col",{attrs:{cols:"12",md:"2"}},[i("mtime",{attrs:{label:" * ساعت",default:!0,disabled:!t.isEditing},model:{value:t.item.time,callback:function(e){t.$set(t.item,"time",e)},expression:"item.time"}})],1),i("v-col",{attrs:{cols:"12",md:"4"}},[i("v-autocomplete",{attrs:{label:"* ماشین",items:t.cars,"item-text":"car_number","item-value":"id",disabled:!t.isEditing},model:{value:t.item.car,callback:function(e){t.$set(t.item,"car",e)},expression:"item.car"}})],1),i("v-col",{attrs:{cols:"12",md:"8"}},[i("v-textarea",{attrs:{label:"توضیحات",disabled:!t.isEditing},model:{value:t.item.explanation,callback:function(e){t.$set(t.item,"explanation",e)},expression:"item.explanation"}})],1),i("v-col",{attrs:{cols:"12",md:"4"}},[t.item.created_by?i("v-text-field",{attrs:{label:"کاربر",disabled:""},model:{value:t.item.created_by.name,callback:function(e){t.$set(t.item.created_by,"name",e)},expression:"item.created_by.name"}}):t._e()],1),t.id?i("v-col",{attrs:{cols:"12"}},[t.isEditing?i("v-card-subtitle",[t._v("فاکتور های فعلی (برای حذف فاکتور آن را از انتخاب خارج کنید)")]):t._e(),i("m-datatable",{ref:"datatable",attrs:{headers:t.selectedFactorsHeaders,filters:t.filters,showExportBtns:!1,items:t.item.factors},on:{"update:filters":function(e){t.filters=e}},scopedSlots:t._u([{key:"item.operations",fn:function(e){var s=e.item;return[i("v-btn",{attrs:{"x-small":"",depressed:"",color:"green white--text"},on:{click:function(e){return t.openDialog(s,!0)}}},[t._v("تحویل کامل")]),i("v-btn",{staticClass:"mr-1",attrs:{depressed:"",color:"orange white--text"},on:{click:function(e){return t.openDialog(s,!1)}}},[t._v("تحویل ناقص")]),i("v-btn",{staticClass:"mr-1",attrs:{"x-small":"",depressed:"",color:"red white--text"}},[t._v("مرجوع")])]}}],null,!1,3920128210),model:{value:t.factors,callback:function(e){t.factors=e},expression:"factors"}})],1):t._e(),t.isEditing?[t.id?i("v-col",{attrs:{cols:"12"}},[i("v-card-subtitle",[t._v("فاکتور هایی که میخواهید اضافه کنید از لیست پایین انتخاب کنید")])],1):t._e(),i("v-col",{staticClass:"py-1",attrs:{cols:"12"}},[i("tree-select",{attrs:{levelsCount:5,items:t.paths,labels:t.PathLevels,itemsIn:t.filters.path__in,"item-text":"name"},on:{"update:itemsIn":function(e){return t.$set(t.filters,"path__in",e)},"update:items-in":function(e){return t.$set(t.filters,"path__in",e)}}})],1),i("v-col",{staticClass:"py-1",attrs:{cols:"12"}},[i("tree-select",{attrs:{levelsCount:4,items:t.visitors,labels:t.VisitorLevels,itemsIn:t.filters.visitor__in,"item-text":"user.name"},on:{"update:itemsIn":function(e){return t.$set(t.filters,"visitor__in",e)},"update:items-in":function(e){return t.$set(t.filters,"visitor__in",e)}}})],1),i("v-col",{staticClass:"py-1",attrs:{cols:"12"}},[i("m-datatable",{ref:"datatable",attrs:{headers:t.headers,filters:t.filters,showExportBtns:!1,apiUrl:"reports/lists/factors"},on:{"update:filters":function(e){t.filters=e}},model:{value:t.factors,callback:function(e){t.factors=e},expression:"factors"}})],1)]:t._e()],2)],i("v-dialog",{attrs:{scrollable:"","max-width":"300px",transition:"dialog-transition"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[t.factor?i("v-card",[i("v-card-title",[t._v(" فاکتور شماره "),i("span",{staticClass:"px-1"},[t._v(t._s(t.factor.code))]),t._v(" برای "),i("span",{staticClass:"px-1"},[t._v(t._s(t.factor.account.name))])]),i("v-card-text",[i("v-btn",{attrs:{block:"",depressed:"",color:"light-blue white--text",to:t.getFactorTransactionLink(t.factor).to}},[t._v("ثبت دریافت")]),t.isFullDelivery?t._e():i("v-btn",{staticClass:"mt-1",attrs:{block:"",depressed:"",color:"light-blue white--text",to:t.getReverseFactorLink(t.factor).to}},[t._v("ثبت برگشت از فروش")]),i("v-btn",{staticClass:"mt-1",attrs:{block:"",depressed:"",color:"light-blue white--text"}},[t._v("نسیه")])],1)],1):t._e()],1)],2)},a=[],l=(i("99af"),i("4de4"),i("d81d"),i("b0c0"),i("2909")),n=i("da4b"),r=i("923b"),o=i("12761"),c=i("4633"),u=i("14a8"),d=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-row",{attrs:{"no-gutters":""}},t._l(t.levelsCount,(function(e,s){return i("v-col",{key:s,class:0!=s?"pr-3":"pr-0"},[0==s||t.selectedLevels[s-1]&&t.selectedLevels[s-1].length?i("v-autocomplete",{attrs:{label:t.getTitle(s),items:t.getItems(s),"item-text":t.levelText,"item-value":"id",multiple:!0,clearable:!0,"small-chips":!0,"deletable-chips":!0,"return-object":!0},on:{input:function(e){return t.emit(s)},"click:clear":function(e){return t.emit(s)}},model:{value:t.selectedLevels[s],callback:function(e){t.$set(t.selectedLevels,s,e)},expression:"selectedLevels[i]"}}):t._e()],1)})),1)},m=[],f=(i("7db0"),i("a15b"),i("13d5"),i("ac1f"),i("1276"),i("2ca0"),i("b85c")),v=i("5530"),p=i("7eac"),b={name:"TreeSelect",props:{levelsCount:{require:!0},items:{require:!0},labels:{require:!0},itemText:{default:"text"},itemsIn:{}},data:function(){return{selectedLevels:[]}},created:function(){for(var t=[],e=0;e<this.levelsCount;e++)t.push([]);this.$set(this,"selectedLevels",t)},computed:{nodes:function(){return this.buildTree(this.items)},levelText:function(){return"title"}},methods:{buildTree:function(t){var e=this,i=this.copy(t);i=i.map((function(t){return Object(v["a"])({children:[],title:e.getItemText(t)},t)}));var s,a=Object(f["a"])(i);try{var l=function(){var t=s.value,a=i.find((function(e){return e.id==t.parent}));a&&(t.title="".concat(e.getItemText(t)," > ").concat(e.getItemText(t)),a.children.push(t))};for(a.s();!(s=a.n()).done;)l()}catch(r){a.e(r)}finally{a.f()}var n=i.filter((function(t){return!t.parent}));return n},getTitle:function(t){return Object(p["d"])(this.labels,t)},getItems:function(t){if(0==t)return this.nodes;var e=[],i=this.selectedLevels[t-1];if(i){var s,a=Object(f["a"])(this.selectedLevels[t-1]);try{for(a.s();!(s=a.n()).done;){var n=s.value;e.push.apply(e,Object(l["a"])(n.children))}}catch(r){a.e(r)}finally{a.f()}}return e},clearSelectedLevels:function(t){for(var e=t+1;e<this.levelsCount;e++)this.selectedLevels[e]=null},emit:function(t){var e=this;this.clearSelectedLevels(t);var i=[];if(t==this.levelsCount-1)i=this.selectedLevels[t];else{var s=this.selectedLevels[t];i=this.items.filter((function(t){return t.level==e.levelsCount-1})).filter((function(t){var e,i=Object(f["a"])(s);try{for(i.s();!(e=i.n()).done;){var a=e.value;if(t.code.startsWith(a.code))return!0}}catch(l){i.e(l)}finally{i.f()}return!1}))}this.$emit("update:itemsIn",i.map((function(t){return t.id})).join(","))},getItemText:function(t){var e=this.itemText.split(".").reduce((function(t,e){return t?t[e]:null}),t);return e}}},h=b,x=i("2877"),g=i("6544"),_=i.n(g),C=i("c6a6"),y=i("62ad"),k=i("0fd9"),T=Object(x["a"])(h,d,m,!1,null,null,null),L=T.exports;_()(T,{VAutocomplete:C["a"],VCol:y["a"],VRow:k["a"]});var w={name:"DistributionForm",mixins:[n["b"],r["a"],c["a"],u["a"]],components:{mtime:o["a"],TreeSelect:L},props:{id:{}},data:function(){return{baseUrl:"distributions/distributions",permissionBasename:"distributions",appendSlash:!0,hasList:!1,hasIdProp:!0,filters:{type:"sale",is_definite:!0,is_loaded:!1},factors:[],factor:null,isFullDelivery:null,dialog:!1,PathLevels:p["b"],VisitorLevels:p["c"]}},computed:{headers:function(){return[{text:"شماره",value:"code"},{text:"تاریخ",value:"date",type:"date"},{text:"خریدار",value:"account.name"},{text:"شرح",value:"explanation"},{text:"مبلغ کل فاکتور",value:"total_sum",type:"numeric"},{text:"ویزیتور",value:"visitor",items:this.visitors.filter((function(t){return 3==t.level})).map((function(t){return{text:t.user.name,value:t.id}})),itemText:"user.name",itemValue:"id"}]},selectedFactorsHeaders:function(){return[].concat(Object(l["a"])(this.headers),[{text:"عملیات ها",value:"operations"}])}},methods:{openDialog:function(t,e){this.factor=t,this.isFullDelivery=e,this.dialog=!0},getItemTemplate:function(){return{factors:[]}},getItemByPosition:function(t){var e=this;return this.request({url:this.endpoint("".concat(this.baseUrl,"/byPosition")),method:"get",params:{id:this.item.id,position:t},success:function(t){e.setItem(t)}})},getData:function(){this.getCars(),this.getVisitors(),this.getPaths()},setItem:function(t){this.item=t,this.changeRouteTo(t.id),this.factors=this.copy(t.factors)},getSerialized:function(){var t=this.extractIds(this.item);return t.factors=this.factors.map((function(t){return t.id})),t}}},I=w,V=i("8336"),$=i("b0af"),E=i("99d9"),F=i("169a"),j=i("8654"),B=i("a844"),D=Object(x["a"])(I,s,a,!1,null,"340e0d30",null);e["default"]=D.exports;_()(D,{VAutocomplete:C["a"],VBtn:V["a"],VCard:$["a"],VCardSubtitle:E["b"],VCardText:E["c"],VCardTitle:E["d"],VCol:y["a"],VDialog:F["a"],VRow:k["a"],VTextField:j["a"],VTextarea:B["a"]})}}]);
//# sourceMappingURL=chunk-2d21f2c6.31c23ddd.js.map