import store from '@/vuex';
export default {
  init(data) {
    let fields;
    let field;
    for (let i = 0; i <= 3; i++) {
      fields = this[i].groups[0].fields;
      field = fields.filter(f => f.model == 'parent')[0];
      field && (field.values = data.levels[i - 1]);

      field = fields.filter(f => f.model == 'category')[0];
      field && (field.values = data.levels[2]);

      field = fields.filter(f => f.model == 'unit')[0];
      field && (field.values = data.units);

      field = fields.filter(f => f.model == 'warehouse')[0];
      field && (field.values = data.warehouses);

      field = fields.filter(f => f.model == 'ware')[0];
      field && (field.values = data.wares);

      field = fields.filter(f => f.model == 'supplier')[0];
      field && (field.values = data.suppliers);

      field = fields.filter(f => f.model == 'pricingType')[0];
      field && (field.values = data.pricingTypes);
    }

  },
  0: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
        label: "نام ماهیت",
        type: "input",
        inputType: "text",
        model: "name",
        styleClasses: "col-sm-12 col-lg-12",
      }, ]
    }]
  },
  1: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
        label: "نام گروه",
        type: "input",
        inputType: "text",
        model: "name",
        styleClasses: "col-sm-12 col-lg-12",
      }, ]
    }]
  },
  2: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
        label: "نام دسته بندی",
        type: "input",
        inputType: "text",
        model: "name",
        styleClasses: "col-sm-12 col-lg-12"
      }, ]
    }]
  },
  3: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
          label: "کد کالا",
          type: "input",
          inputType: "text",
          model: "code",
          disabled: true,
          styleClasses: "col-sm-12 col-lg-4"

        },
        {
          label: "نام کالا",
          type: "input",
          inputType: "text",
          model: "name",
          styleClasses: "col-sm-12 col-lg-8"
        },
        {
          label: "واحد شمارش",
          type: "vueMultiSelect",
          model: "unit",
          styleClasses: "col-sm-12 col-lg-4",
          selectOptions: {
            label: 'name',
            trackBy: 'id',
          },
          values: [],
        },
        {
          label: "قیمت",
          type: "cleave",
          model: "price",
          cleaveOptions: {
            numeral: true,
            delimiter: ','
          },
          styleClasses: "col-sm-12 col-lg-4 ltr"
        },

        {
          label: "نوع قیمت گذری",
          type: "vueMultiSelect",
          model: "pricingType",
          styleClasses: "col-sm-12 col-lg-4",
          selectOptions: {
            label: 'name',
            trackBy: 'id',
          },
          values: [],
        },
        {
          label: "انبار پیشفرض",
          type: "vueMultiSelect",
          model: "warehouse",
          styleClasses: "col-sm-12 col-lg-4",
          selectOptions: {
            label: 'name',
            trackBy: 'id',
          },
          values: [],
        },
        {
          label: "بارکد",
          type: "input",
          inputType: "text",
          model: "barcode",
          styleClasses: "col-sm-12 col-lg-4"
        },
        {
          label: "حداقل فروش",
          type: "input",
          inputType: "text",
          model: "min_sale",
          styleClasses: "col-sm-12 col-lg-4",
        },
        {
          label: "حداکثر فروش",
          type: "input",
          inputType: "text",
          model: "max_sale",
          styleClasses: "col-sm-12 col-lg-4",
        },


        {
          label: "حداقل موجودی",
          type: "input",
          inputType: "text",
          model: "min_inventroy",
          styleClasses: "col-sm-12 col-lg-4",
        },
        {
          label: "حداکثر موجودی",
          type: "input",
          inputType: "text",
          model: "max_inventroy",
          styleClasses: "col-sm-12 col-lg-4",
        },
        {
          label: "تامین کننده اصلی",
          type: "vueMultiSelect",
          model: "supplier",
          styleClasses: "col-sm-12 col-lg-6",
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
        },
        {
          label: "تاریخ ایجاد",
          type: "input",
          inputType: "text",
          model: "created_at",
          disabled: true,
          styleClasses: "col-sm-12 col-lg-4"
        },
        {
          label: "تاریخ آخرین ویرایش",
          type: "input",
          inputType: "text",
          model: "updated_at",
          disabled: true,
          styleClasses: "col-sm-12 col-lg-4"
        },
      ]
    }]
  },

}
