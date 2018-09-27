export default {
  url: "reports/journal",
  cols: [{
      th: "شماره",
      td: "sanad.code",
      type: "number",
      filters: ["code__icontains"]
    },
    {
      th: "تاریخ",
      td: "sanad.date",
      type: "date",
      filters: [{
        label: 'از تاریخ',
        model: "sanad__date__gte"
      }, {
        label: 'تا تاریخ',
        model: "sanad__date__lte"
      }]

    },
    {
      th: "کد حساب",
      td: "account.code",
      type: "number",
      filters: [{
        label: 'از کد حساب',
        model: "account__code__gte"
      }, {
        label: 'تا کد حساب',
        model: "account__code__lte"
      }]
    },
    {
      th: "نام حساب",
      td: "account.name",
      type: "text",
      filters: ["account__name__icontains"]
    },
    {
      th: "شرح",
      td: "explanation",
      type: "text",
      filters: ["explanation__icontains"]
    },
    {
      th: "بدهکار",
      td: "value",
      type: "money",
      render(item) {
        if (item.valueType == 'bed') return item.value;
        return 0;
      },
      order(oldOrder) {
        switch (oldOrder) {
          case 'valueType,-value':
            return 'valueType,value'
          case 'valueType,value':
            return ''
          default:
            return 'valueType,-value'
        }
      },
      orderClass(order) {
        switch (order) {
          case 'valueType,-value':
            return 'fa-sort-up'
          case 'valueType,value':
            return 'fa-sort-down'
          default:
            return 'fa-sort'
        }
      }
    },
    {
      th: "بستانکار",
      td: "value",
      type: "money",
      render(item) {
        if (item.valueType == 'bes') return item.value;
        return 0;
      },
      order(oldOrder) {
        switch (oldOrder) {
          case '-valueType,-value':
            return '-valueType,value'
          case '-valueType,value':
            return ''
          default:
            return '-valueType,-value'
        }
      },
      orderClass(order) {
        switch (order) {
          case '-valueType,-value':
            return 'fa-sort-up'
          case '-valueType,value':
            return 'fa-sort-down'
          default:
            return 'fa-sort'
        }
      }
    },
  ],
}
