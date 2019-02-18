export default {
  url: "reports/lists/sanads",
  cols: [{
      th: "شماره",
      td: "code",
      type: "number",
      filters: ["serial__icontains"]
    },
    {
      th: "بدهکار",
      td: "bed",
      type: "money",
      filters: ["bed__icontains"]
    },
    {
      th: "بستانکار",
      td: "bes",
      type: "money",
      filters: ["bes__icontains"]
    },
    {
      th: "تاریخ",
      td: "date",
      type: "date",
      filters: [{
          label: "xxxx-xx-xx از تاریخ ",
          model: "date__gte"
        },
        {
          label: "xxxx-xx-xx تا تاریخ",
          model: "date__lte"
        }
      ]
    },
    {
      th: "نوع سند",
      td: "type",
      type: "select",
      options: [{
          label: 'موقت',
          value: 'temporary'
        },
        {
          label: 'قطعی',
          value: 'definite'
        },
      ],
      filters: ["type"]
    },
    {
      th: "توضیحات",
      td: "explanation",
      type: "text",
      filters: ["explanation__icontains"]
    },
  ],
  label: 'اسناد',
  routerName: 'CreateSanad'
}
