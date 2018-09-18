export default {
  cols: [{
      th: "کد حساب",
      td: "code",
      type: "number",
      filters: [{
        label: 'از کد حساب',
        model: "code__gte"
      }, {
        label: 'تا کد حساب',
        model: "code__lte"
      }]
    },
    {
      th: "نام حساب",
      td: "name",
      type: "text",
      filters: ["name"]
    },
    {
      th: "جمع بدهکار",
      td: "bed_sum",
      type: "money",
      filters: ["bed_sum"]
    },
    {
      th: "جمع بستانکار",
      td: "bes_sum",
      type: "money",
      filters: ["bes_sum"]
    },
  ],
}
