export default {
  url: "reports/journal",
  cols: [{
      text: "شماره",
      value: "sanad.code",
      type: "number",
      filters: ["code__icontains"]
    },
    {
      text: "تاریخ",
      value: "sanad.date",
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
      text: "کد حساب",
      value: "account.code",
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
      text: "نام حساب",
      value: "account.name",
      type: "text",
      filters: ["account__name__icontains"]
    },
    {
      text: "شرح",
      value: "explanation",
      type: "text",
      filters: ["explanation__icontains"]
    },
    {
      text: "بدهکار",
      value: "bed",
      type: "money",
    },
    {
      text: "بستانکار",
      value: "bes",
      type: "money",
    },
  ],
}
