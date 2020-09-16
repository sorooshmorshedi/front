export default {
  url: "reports/lists/sanads",
  cols: [{
      text: "عطف",
      value: "id",
    },
    {
      text: "شماره",
      value: "code",
    },
    {
      text: "بدهکار",
      value: "bed",
    },
    {
      text: "بستانکار",
      value: "bes",
    },
    {
      text: "تاریخ",
      value: "date",
    },
    {
      text: "سیستمی",
      value: "is_auto_created",
      type: 'boolean',
    },
    {
      text: "توضیحات",
      value: "explanation",
    },
  ],
  label: 'اسناد',
  routerName: 'SanadForm'
}