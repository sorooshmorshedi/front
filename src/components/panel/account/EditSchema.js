import store from '@/vuex';
export default {
  init(data) {
    let fields;
    let field;
    for (let i = 0; i < 4; i++) {
      fields = this[i].groups[0].fields;
      field = null;

      field = fields.filter(f => f.model == 'code')[0];
      field && (field.values = data.levels[i]);

      field = fields.filter(f => f.model == 'parent')[0];
      field && (field.values = data.levels[i - 1]);

      field = fields.filter(f => f.model == 'type')[0];
      field && (field.values = data.accountTypes);

      field = fields.filter(f => f.model == 'costCenterGroup')[0];
      field && (field.values = data.costCenterGroups);

      field = fields.filter(f => f.model == 'floatAccountGroup')[0];
      field && (field.values = data.floatAccountGroups);
    }

    fields = this.floatAccounts.groups[0].fields;
    field = fields.filter(f => f.model == 'floatAccountGroup')[0];
    field && (field.values = data.floatAccountGroups);

  },
  0: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
        label: "نام گروه",
        type: "input",
        inputType: "text",
        model: "name",
        styleClasses: "col-sm-12 col-md-10",
      }, ]
    }]
  },
  1: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
          label: "شماره گروه اصلی",
          type: "vueMultiSelect",
          model: "parent",
          disabled: true,
          styleClasses: "col-sm-12 col-lg-3",
          selectOptions: {
            label: 'title',
            trackBy: 'code',
          },
          values: [],
        },
        {
          label: "نام حساب کل",
          type: "input",
          inputType: "text",
          model: "name",
          styleClasses: "col-sm-12 col-lg-4"
        },
        {
          label: "نوع حساب پیشفرض",
          type: "vueMultiSelect",
          model: "type",
          styleClasses: "col-sm-12 col-lg-3",
          selectOptions: {
            label: 'name',
            trackBy: 'pk',
          },
          values: [],
        }
      ]
    }]
  },
  2: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
          label: "شماره حساب کل",
          type: "vueMultiSelect",
          model: "parent",
          disabled: true,
          styleClasses: "col-sm-12 col-lg-3",
          selectOptions: {
            label: 'name',
            trackBy: 'code',
          },
          values: [],
        },
        {
          label: "نام حساب معین",
          type: "input",
          inputType: "text",
          model: "name",
          styleClasses: "col-sm-12 col-lg-4"
        },
        {
          label: "نوع حساب پیشفرض",
          type: "vueMultiSelect",
          model: "type",
          styleClasses: "col-sm-12 col-lg-3",
          selectOptions: {
            label: 'name',
            trackBy: 'pk',
          },
          values: [],
        }
      ]
    }]

  },
  3: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
          label: "شماره حساب معین",
          type: "vueMultiSelect",
          disabled: true,
          model: "parent",
          styleClasses: "col-sm-12 col-lg-3",
          selectOptions: {
            label: 'name',
            trackBy: 'code',
          },
          values: [],
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
            label: 'name',
            trackBy: 'pk',
          },
          values: [],
        },
        {
          label: "گروه مرکز هزینه",
          type: "vueMultiSelect",
          model: "costCenterGroup",
          styleClasses: "col-sm-12 col-lg-3",
          selectOptions: {
            label: 'name',
            trackBy: 'pk',
          },
          values: [],
        },
        {
          label: "گروه حساب تفضیلی شناور",
          type: "vueMultiSelect",
          model: "floatAccountGroup",
          styleClasses: "col-sm-12 col-lg-3",
          selectOptions: {
            label: 'name',
            trackBy: 'pk',
          },
          values: [],
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
  },
  floatAccounts: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
          label: "نام ",
          type: "input",
          inputType: "text",
          model: "name",
          styleClasses: "col-sm-12 col-lg-3"
        },
        {
          label: "گروه حساب تفضیلی شناور",
          type: "vueMultiSelect",
          model: "floatAccountGroup",
          styleClasses: "col-sm-12 col-lg-3",
          selectOptions: {
            label: 'name',
            trackBy: 'pk',
          },
          values: [],
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
  },
  floatAccountGroup: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
          label: "نام",
          type: "input",
          inputType: "text",
          model: "name",
          styleClasses: "col-12 col-lg-4",
        },
        {
          label: "توضیحات",
          type: "textArea",
          model: "explanation",
          rows: 4,
          styleClasses: "col-12 col-lg-9"
        }
      ]
    }]
  },

}
