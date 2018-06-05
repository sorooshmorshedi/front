import store from '@/vuex';
export default {
  group: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
          label: "کد گروه",
          type: "input",
          inputType: "text",
          model: "code",
          disabled: true,
          styleClasses: "col-sm-12 col-md-2"
        },
        {
          label: "نام گروه",
          type: "input",
          inputType: "text",
          model: "name",
          styleClasses: "col-sm-12 col-md-10"
        }
      ]
    }]

  },
  kol: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
          label: "شماره گروه اصلی",
          type: "vueMultiSelect",
          model: "parent",
          styleClasses: "col-sm-12 col-lg-3",
          selectOptions: {
            label: 'name',
            trackBy: 'code',
          },
          values() {
            let vals = [];
            store.getters.accounts.forEach(acc => {
              vals.push({
                code: acc.code,
                name: acc.code + ' - ' + acc.name
              })
            })
            return vals;
          }
        },
        {
          label: "شماره حساب کل",
          type: "input",
          inputType: "text",
          model: "code",
          disabled: true,
          styleClasses: "col-sm-12 col-lg-2"

        },
        {
          label: "نام حساب کل",
          type: "input",
          inputType: "text",
          model: "name",
          styleClasses: "col-sm-12 col-lg-7"
        },
        {
          label: "نوع حساب پیشفرض",
          type: "vueMultiSelect",
          model: "type",
          styleClasses: "col-sm-12 col-lg-3",
          selectOptions: {
            label: 'name',
            trackBy: 'id',
          },
          values() {
            let vals = [];
            store.getters.accountTypes.forEach(at => {
              vals.push({
                id: at.id,
                name: at.name
              })
            })
            return vals;
          }

        }
      ]
    }]
  },
  moein: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
          label: "شماره حساب کل",
          type: "vueMultiSelect",
          model: "parent",
          styleClasses: "col-sm-12 col-lg-3",
          selectOptions: {
            label: 'name',
            trackBy: 'code',
          },
          values() {
            let vals = [];
            store.getters.accounts.forEach(acc => {
              vals.push({
                code: acc.code,
                name: acc.code + ' - ' + acc.name
              })
            })
            return vals;
          }
        },
        {
          label: "شماره حساب معین",
          type: "input",
          inputType: "text",
          model: "code",
          disabled: true,
          styleClasses: "col-sm-12 col-lg-2"

        },
        {
          label: "نام حساب معین",
          type: "input",
          inputType: "text",
          model: "name",
          styleClasses: "col-sm-12 col-lg-7"
        },
      ]
    }]

  },
  tafzili: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
          label: "شماره حساب معین",
          type: "vueMultiSelect",
          model: "parent",
          styleClasses: "col-sm-12 col-lg-3",
          selectOptions: {
            label: 'name',
            trackBy: 'code',
          },
          values() {
            let vals = [];
            store.getters.accounts.forEach(acc => {
              vals.push({
                code: acc.code,
                name: acc.code + ' - ' + acc.name
              })
            })
            return vals;
          }
        },
        {
          label: "شماره حساب تفضیلی",
          type: "input",
          inputType: "text",
          model: "code",
          disabled: true,
          styleClasses: "col-sm-12 col-lg-3"

        },
        {
          label: "نام حساب تفضیلی",
          type: "input",
          inputType: "text",
          model: "name",
          styleClasses: "col-sm-12 col-lg-3"
        },
        {
          label: "نوع حساب ",
          type: "vueMultiSelect",
          model: "type",
          styleClasses: "col-sm-12 col-lg-3",
          selectOptions: {
            label: 'type',
            trackBy: 'id',
          },
          values() {
            let vals = [];
            store.getters.accountTypes.forEach(at => {
              vals.push({
                id: at.id,
                name: at.name
              })
            })
            return vals;
          }
        },
        {
          label: "مرکز هزینه",
          type: "vueMultiSelect",
          model: "type",
          styleClasses: "col-sm-12 col-lg-3",
          selectOptions: {
            label: 'name',
            trackBy: 'id',
          },
          values() {
            let vals = [];
            store.getters.accountTypes.forEach(at => {
              vals.push({
                id: at.id,
                name: at.name
              })
            })
            return vals;
          }
        },
        {
          label: "گروه حساب تفضیلی شناور",
          type: "vueMultiSelect",
          model: "floatAccountGroup",
          styleClasses: "col-sm-12 col-lg-3",
          selectOptions: {
            label: 'name',
            trackBy: 'code',
          },
          values() {
            let vals = [];
            store.getters.accounts.forEach(acc => {
              vals.push({
                code: acc.code,
                name: acc.code + ' - ' + acc.name
              })
            })
            return vals;
          }
        },
        {
          label: "سقف بدهکاری",
          type: "input",
          inputType: "text",
          model: "max_bed",
          styleClasses: "col-sm-12 col-lg-3",
        },
        {
          label: "سقف بستانکاری",
          type: "input",
          inputType: "text",
          model: "max_bes",
          styleClasses: "col-sm-12 col-lg-3"

        },
        {
          label: "تاریخ ایجاد",
          type: "input",
          inputType: "text",
          model: "created_at",
          disabled: true,
          styleClasses: "col-sm-12 col-lg-3"
        },
        {
          label: "تاریخ آخرین ویرایش",
          type: "input",
          inputType: "text",
          model: "updated_at",
          disabled: true,
          styleClasses: "col-sm-12 col-lg-3"
        },
        {
          label: "توضیحات",
          type: "textArea",
          model: "explanation",
          rows: 4,
          styleClasses: "col-sm-12 col-lg-6"

        }
      ]
    }]


  }

}
