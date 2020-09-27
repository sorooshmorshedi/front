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
      text: "شماره سند",
      value: "sanad",
      type: "number",
      sortable: false,
      filters: []
    },
    {
      text: "تاریخ",
      value: "date",
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
      text: "شرح",
      value: "explanation",
      type: "text",
      sortable: false,
      filters: ["explanation"]
    },
    {
      text: "بدهکار",
      value: "bed",
      type: "money",
      sortable: false,
      filters: []
    },
    {
      text: "بستانکار",
      value: "bes",
      type: "money",
      sortable: false,
      filters: []
    },
    {
      text: "مانده",
      value: "remain",
      type: "money",
      sortable: false,
      filters: []
    },
    {
      text: "تشخیص",
      value: "remain_type",
      type: "string",
      sortable: false,
      filters: []
    },
  ],
}
