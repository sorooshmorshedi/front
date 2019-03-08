import store from '@/vuex';
export default {
  init(data) {
    let fields;
    let field;
    Object.keys(this).forEach(i => {

      if (!this[i].groups) return;

      fields = this[i].groups[0].fields;
      field = fields.filter(f => f.model == 'parent')[0];
      field && (field.values = data.levels[i - 1]);

      field = fields.filter(f => f.model == 'type')[0];
      field && (field.values = data.accountTypes);

      field = fields.filter(f => f.model == 'costCenterGroup')[0];
      field && (field.values = data.costCenterGroups);

      field = fields.filter(f => f.model == 'floatAccountGroup')[0];
      field && (field.values = data.floatAccountGroups);

      field = fields.filter(f => f.model == 'floatAccountGroups')[0];
      field && (field.values = data.floatAccountGroups);
    })


  },
  0: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
          label: "کد گروه",
          type: "input",
          inputType: "text",
          model: "code",
          disabled: true,
          styleClasses: "col-12 col-md-4",
        },
        {
          label: "نام گروه",
          type: "input",
          inputType: "text",
          model: "name",
          styleClasses: "col-12 col-md-8",
        },
      ]
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
          styleClasses: "col-12 col-md-12",
          selectOptions: {
            label: 'title',
            trackBy: 'id',
          },
          values: [],
        },
        {
          label: "شماره حساب کل",
          type: "input",
          inputType: "text",
          model: "code",
          disabled: true,
          styleClasses: "col-12 col-md-4"

        },
        {
          label: "نام حساب کل",
          type: "input",
          inputType: "text",
          model: "name",
          styleClasses: "col-12 col-md-8"
        },
        {
          label: "نوع حساب پیشفرض",
          type: "vueMultiSelect",
          model: "type",
          styleClasses: "col-12 col-md-12",
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
          label: "نام و شماره حساب کل",
          type: "vueMultiSelect",
          model: "parent",
          styleClasses: "col-12 col-md-12",
          selectOptions: {
            label: 'title',
            trackBy: 'id',
          },
          values: [],
        },
        {
          label: "شماره حساب معین",
          type: "input",
          inputType: "text",
          model: "code",
          disabled: true,
          styleClasses: "col-12 col-md-4"

        },
        {
          label: "نام حساب معین",
          type: "input",
          inputType: "text",
          model: "name",
          styleClasses: "col-12 col-md-8"
        },
      ]
    }]

  },
  3: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
          label: "نام و شماره حساب معین",
          type: "vueMultiSelect",
          model: "parent",
          styleClasses: "col-12 col-md-12",
          selectOptions: {
            label: 'title',
            trackBy: 'id',
          },
          values: [],
        },
        {
          label: "شماره حساب تفضیلی",
          type: "input",
          inputType: "text",
          model: "code",
          disabled: true,
          styleClasses: "col-12 col-md-4"

        },
        {
          label: "نام حساب تفضیلی",
          type: "input",
          inputType: "text",
          model: "name",
          styleClasses: "col-12 col-md-8"
        },
        {
          label: "گروه مرکز هزینه",
          type: "vueMultiSelect",
          model: "costCenterGroup",
          styleClasses: "col-12 col-md-6",
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
          styleClasses: "col-12 col-md-6",
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
          styleClasses: "col-12 col-md-6",
        },
        {
          label: "سقف بستانکاری",
          type: "input",
          inputType: "text",
          model: "max_bes",
          styleClasses: "col-12 col-md-6"

        },
        {
          label: "توضیحات",
          type: "textArea",
          model: "explanation",
          rows: 4,
          styleClasses: "col-12 col-md-12"

        }
      ]
    }]
  },
  personAccount: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
          label: "شماره حساب ",
          type: "input",
          inputType: "text",
          model: "code",
          disabled: true,
          styleClasses: "col-12 col-md-4"

        },
        {
          label: "نام ",
          type: "input",
          inputType: "text",
          model: "name",
          styleClasses: "col-12 col-md-8"
        },
        {
          label: "گروه حساب تفضیلی شناور",
          type: "vueMultiSelect",
          model: "floatAccountGroup",
          styleClasses: "col-12 col-md-12",
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
          styleClasses: "col-12 col-md-6",
        },
        {
          label: "سقف بستانکاری",
          type: "input",
          inputType: "text",
          model: "max_bes",
          styleClasses: "col-12 col-md-6"

        },
        {
          label: "توضیحات",
          type: "textArea",
          model: "explanation",
          rows: 4,
          styleClasses: "col-12 col-md-12"

        },
      ]
    }]

  },
  person: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
          label: "نوع حساب",
          type: "select",
          model: "personType",
          styleClasses: "col-12 col-md-4",
          selectOptions: {
            label: 'name',
            trackBy: 'id',
          },
          values: [{
            name: 'حقیقی',
            id: 'real'
          }, {
            name: 'حقوقی',
            id: 'legal'
          }]

        }, {
          label: "شماره ملی",
          type: "input",
          inputType: "text",
          model: "meli_code",
          styleClasses: "col-12 col-md-4"
        }, {
          label: "موبایل",
          type: "input",
          inputType: "text",
          model: "mobile",
          styleClasses: "col-12 col-md-4"
        },
        {
          label: "شماره تلفن 1",
          type: "input",
          inputType: "text",
          model: "phone1",
          styleClasses: "col-12 col-md-4"
        },
        {
          label: "شماره تلفن 2",
          type: "input",
          inputType: "text",
          model: "phone2",
          styleClasses: "col-12 col-md-4"
        },
        {
          label: "وبسایت",
          type: "input",
          inputType: "text",
          model: "website",
          styleClasses: "col-12 col-md-4"
        },
        {
          label: "فکس",
          type: "input",
          inputType: "text",
          model: "fax",
          styleClasses: "col-12 col-md-4"
        },
        {
          label: "ایمیل",
          type: "input",
          inputType: "text",
          model: "email",
          styleClasses: "col-12 col-md-4"
        },
        {
          label: "استان",
          type: "input",
          inputType: "text",
          model: "province",
          styleClasses: "col-12 col-md-4"
        },
        {
          label: "شهر",
          type: "input",
          inputType: "text",
          model: "city",
          styleClasses: "col-12 col-md-4"
        },
        {
          label: "کد پستی",
          type: "input",
          inputType: "text",
          model: "postalCode",
          styleClasses: "col-12 col-md-4"
        },
        {
          label: "آدرس 1",
          type: "input",
          inputType: "text",
          model: "address1",
          styleClasses: "col-12 col-md-12"
        },
        {
          label: "آدرس 2",
          type: "input",
          inputType: "text",
          model: "address2",
          styleClasses: "col-12 col-md-12"
        },

        {
          label: "شماره حساب 1",
          type: "input",
          inputType: "text",
          model: "accountNumber1",
          styleClasses: "col-12 col-md-4"
        },
        {
          label: "شماره حساب 2",
          type: "input",
          inputType: "text",
          model: "accountNumber2",
          styleClasses: "col-12 col-md-4"
        },
        {
          label: "کد اقتصادی",
          type: "input",
          inputType: "text",
          model: "eghtesadiCode",
          styleClasses: "col-12 col-md-4"
        },
      ]
    }]

  },
  bankAccount: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
          label: "کد حساب",
          type: "input",
          inputType: "text",
          model: "code",
          disabled: true,
          styleClasses: "col-12 col-md-4"

        },
        {
          label: "عنوان حساب",
          type: "input",
          inputType: "text",
          model: "name",
          styleClasses: "col-12 col-md-8"
        },
        {
          label: "گروه مرکز هزینه",
          type: "vueMultiSelect",
          model: "costCenterGroup",
          styleClasses: "col-12 col-md-6",
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
          styleClasses: "col-12 col-md-6",
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
          styleClasses: "col-12 col-md-6",
        },
        {
          label: "سقف بستانکاری",
          type: "input",
          inputType: "text",
          model: "max_bes",
          styleClasses: "col-12 col-md-6"

        },
        {
          label: "توضیحات",
          type: "textArea",
          model: "explanation",
          rows: 4,
          styleClasses: "col-12 col-md-12"

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
          styleClasses: "col-12 col-md-4"
        },
        {
          label: "نام شعبه",
          type: "input",
          inputType: "text",
          model: "branch",
          styleClasses: "col-12 col-md-4"
        },
        {
          label: "کد شعبه",
          type: "input",
          inputType: "text",
          model: "branchCode",
          styleClasses: "col-12 col-md-4"
        },
        {
          label: "شماره حساب",
          type: "input",
          inputType: "text",
          model: "accountNumber",
          styleClasses: "col-12 col-md-4"
        },
        {
          label: "کد شبا",
          type: "input",
          inputType: "text",
          model: "sheba",
          styleClasses: "col-12 col-md-4"
        },
        {
          label: "شماره تماس",
          type: "input",
          inputType: "text",
          model: "phone",
          styleClasses: "col-12 col-md-4"
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
          styleClasses: "col-12 col-md-4"
        },
        {
          label: "گروه حساب تفضیلی شناور",
          type: "vueMultiSelect",
          model: "floatAccountGroups",
          styleClasses: "col-12 col-md-8",
          selectOptions: {
            label: 'name',
            trackBy: 'id',
            multiple: true,
          },
          values: [],
        },
        {
          label: "توضیحات",
          type: "textArea",
          model: "explanation",
          rows: 4,
          styleClasses: "col-12 col-md-9"

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
          styleClasses: "col-12 col-md-4",
        },
        {
          label: "توضیحات",
          type: "textArea",
          model: "explanation",
          rows: 4,
          styleClasses: "col-12 col-md-9"
        }
      ]
    }]
  },

}
