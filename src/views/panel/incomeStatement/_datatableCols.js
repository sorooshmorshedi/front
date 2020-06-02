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
      td: "bed",
      type: "money",
    },
    {
      th: "بستانکار",
      td: "bes",
      type: "money",
    },
  ],
}