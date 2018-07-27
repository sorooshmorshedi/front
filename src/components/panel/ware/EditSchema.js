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

      field = fields.filter(f => f.model == 'wareHouse')[0];
      field && (field.values = data.wareHouses);

      field = fields.filter(f => f.model == 'ware')[0];
      field && (field.values = data.wares);

      field = fields.filter(f => f.model == 'supplier')[0];
      field && (field.values = data.suppliers);

      field = fields.filter(f => f.model == 'pricing_type')[0];
      field && (field.values = data.pricing_types);
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
        styleClasses: "col-sm-12 col-lg-7",
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
        styleClasses: "col-sm-12 col-lg-7"
      }, ]
    }]
  },
  3: {
    groups: [{
      legend: "",
      styleClasses: "row",
      fields: [{
          label: "نام کالا",
          type: "input",
          inputType: "text",
          model: "name",
          styleClasses: "col-sm-12 col-lg-3"
        },
        {
          label: "بارکد",
          type: "input",
          inputType: "text",
          model: "barcode",
          styleClasses: "col-sm-12 col-lg-3"
        },
        {
          label: "قیمت",
          type: "input",
          inputType: "text",
          model: "price",
          styleClasses: "col-sm-12 col-lg-3"
        },
        {
          label: "نوع قیمت گذری",
          type: "vueMultiSelect",
          model: "pricing_type",
          styleClasses: "col-sm-12 col-lg-3",
          selectOptions: {
            label: 'name',
            trackBy: 'id',
          },
          values: [],
        },
        {
          label: "حداقل فروش",
          type: "input",
          inputType: "text",
          model: "min_sale",
          styleClasses: "col-sm-12 col-lg-3",
        },
        {
          label: "حداکثر فروش",
          type: "input",
          inputType: "text",
          model: "max_sale",
          styleClasses: "col-sm-12 col-lg-3",
        },
        {
          label: "واحد شمارش",
          type: "vueMultiSelect",
          model: "unit",
          styleClasses: "col-sm-12 col-lg-3",
          selectOptions: {
            label: 'name',
            trackBy: 'id',
          },
          values: [],
        },
        {
          label: "انبار پیشفرض",
          type: "vueMultiSelect",
          model: "wareHouse",
          styleClasses: "col-sm-12 col-lg-3",
          selectOptions: {
            label: 'name',
            trackBy: 'id',
          },
          values: [],
        },
        {
          label: "حداقل موجودی",
          type: "input",
          inputType: "text",
          model: "min_inventroy",
          styleClasses: "col-sm-12 col-lg-3",
        },
        {
          label: "حداقل موجودی",
          type: "input",
          inputType: "text",
          model: "max_inventroy",
          styleClasses: "col-sm-12 col-lg-3",
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
          label: "تامین کننده اصلی",
          type: "vueMultiSelect",
          model: "supplier",
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
          styleClasses: "col-sm-12 col-lg-9"
        },
      ]
    }]
  },

}
