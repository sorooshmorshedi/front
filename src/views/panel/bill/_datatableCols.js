export default {
  cols: [
    {
      th: 'نوع',
      td: 'form_name',
      type: 'text',
      sortable: false,
      filters: [],
    },
    {
      th: "شماره سند",
      td: "sanad",
      type: "number",
      sortable: false,
      filters: []
    },
    {
      th: "تاریخ",
      td: "date",
      type: "date",
      sortable: false,
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
      th: "شرح",
      td: "explanation",
      type: "text",
      sortable: false,
      filters: ["explanation"]
    },
    {
      th: "بدهکار",
      td: "bed",
      type: "money",
      sortable: false,
      filters: []
    },
    {
      th: "بستانکار",
      td: "bes",
      type: "money",
      sortable: false,
      filters: []
    },
    {
      th: "مانده",
      td: "remain",
      type: "money",
      sortable: false,
      filters: []
    },
    {
      th: "تشخیص",
      td: "remain_type",
      type: "string",
      sortable: false,
      filters: []
    },
  ],
}
