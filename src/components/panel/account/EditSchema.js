import store from '@/vuex';
export default {
  init(data) {
    let fields;
    let field;
    Object.keys(this).forEach(i => {

      if (!this[i].groups) return;

      fields = this[i].groups[0].fields;

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

      field = fields.filter(f => f.model == 'floatAccountGroup')[0];
      field && (field.values = data.floatAccountGroups);

    });

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
            label: 'title',
            trackBy: 'id',
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
            label: 'title',
            trackBy: 'id',
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
            label: 'title',
            trackBy: 'id',
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
            trackBy: 'id',
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
            trackBy: 'id',
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
  personAccount: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
          label: "نام ",
          type: "input",
          inputType: "text",
          model: "name",
          styleClasses: "col-sm-12 col-lg-6"
        },
        {
          label: "گروه مرکز هزینه",
          type: "vueMultiSelect",
          model: "costCenterGroup",
          styleClasses: "col-sm-12 col-lg-3",
          selectOptions: {
            label: 'name',
            trackBy: 'id',
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
            trackBy: 'id',
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

        },
      ]
    }]

  },
  person: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
          label: "موبایل",
          type: "input",
          inputType: "text",
          model: "mobile",
          styleClasses: "col-sm-12 col-lg-2"
        },
        {
          label: "شماره تلفن 1",
          type: "input",
          inputType: "text",
          model: "phone1",
          styleClasses: "col-sm-12 col-lg-2"
        },
        {
          label: "شماره تلفن 2",
          type: "input",
          inputType: "text",
          model: "phone2",
          styleClasses: "col-sm-12 col-lg-2"
        },
        {
          label: "وبسایت",
          type: "input",
          inputType: "text",
          model: "website",
          styleClasses: "col-sm-12 col-lg-3"
        },
        {
          label: "فکس",
          type: "input",
          inputType: "text",
          model: "fax",
          styleClasses: "col-sm-12 col-lg-3"
        },
        {
          label: "ایمیل",
          type: "input",
          inputType: "text",
          model: "email",
          styleClasses: "col-sm-12 col-lg-3"
        },
        {
          label: "استان",
          type: "input",
          inputType: "text",
          model: "province",
          styleClasses: "col-sm-12 col-lg-3"
        },
        {
          label: "شهر",
          type: "input",
          inputType: "text",
          model: "city",
          styleClasses: "col-sm-12 col-lg-3"
        },
        {
          label: "کد پستی",
          type: "input",
          inputType: "text",
          model: "postalCode",
          styleClasses: "col-sm-12 col-lg-3"
        },
        {
          label: "آدرس 1",
          type: "input",
          inputType: "text",
          model: "address1",
          styleClasses: "col-sm-12 col-lg-12"
        },
        {
          label: "آدرس 2",
          type: "input",
          inputType: "text",
          model: "address2",
          styleClasses: "col-sm-12 col-lg-12"
        },

        {
          label: "شماره حساب 1",
          type: "input",
          inputType: "text",
          model: "accountNumber1",
          styleClasses: "col-sm-12 col-lg-3"
        },
        {
          label: "شماره حساب 2",
          type: "input",
          inputType: "text",
          model: "accountNumber2",
          styleClasses: "col-sm-12 col-lg-3"
        },
        {
          label: "کد اقتصادی",
          type: "input",
          inputType: "text",
          model: "eghtesadiCode",
          styleClasses: "col-sm-12 col-lg-3"
        },
      ]
    }]

  },
  bankAccount: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
          label: "عنوان حساب",
          type: "input",
          inputType: "text",
          model: "name",
          styleClasses: "col-sm-12 col-lg-6"
        },
        {
          label: "گروه مرکز هزینه",
          type: "vueMultiSelect",
          model: "costCenterGroup",
          styleClasses: "col-sm-12 col-lg-3",
          selectOptions: {
            label: 'name',
            trackBy: 'id',
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
            trackBy: 'id',
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

        },
      ]
    }]

  },
  bank: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
          label: "نام بانک",
          type: "input",
          inputType: "text",
          model: "name",
          styleClasses: "col-sm-12 col-lg-3"
        },
        {
          label: "نام شعبه",
          type: "input",
          inputType: "text",
          model: "branch",
          styleClasses: "col-sm-12 col-lg-2"
        },
        {
          label: "کد شعبه",
          type: "input",
          inputType: "text",
          model: "branchCode",
          styleClasses: "col-sm-12 col-lg-2"
        },
        {
          label: "شماره حساب",
          type: "input",
          inputType: "text",
          model: "accountNumber",
          styleClasses: "col-sm-12 col-lg-2"
        },
        {
          label: "کد شبا",
          type: "input",
          inputType: "text",
          model: "sheba",
          styleClasses: "col-sm-12 col-lg-3"
        },
        {
          label: "شماره تماس",
          type: "input",
          inputType: "text",
          model: "phone",
          styleClasses: "col-sm-12 col-lg-3"
        },
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
            trackBy: 'id',
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
