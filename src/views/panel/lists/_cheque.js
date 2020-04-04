export default {
  url: "reports/lists/cheques",
  routerName: 'ChequeDetail',
  cols: [{
      th: "شماره",
      td: "serial",
      type: "text",
      filters: ["serial__icontains"]
    },
    {
      th: "شرح",
      td: "explanation",
      type: "text",
      filters: ["account__icontains"]
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
      th: "تاریخ سررسید",
      td: "due",
      type: "date",
      filters: [{
          label: "از تاریخ",
          model: "due__gte"
        },
        {
          label: "تا تاریخ",
          model: "due__lte"
        }
      ]
    },
    {
      th: "مبلغ",
      td: "value",
      type: "money",
      filters: ["value"]
    },
    {
      th: "نام حساب",
      td: "account.name",
      type: "text",
      filters: ["account__name__icontains"]
    },
    {
      th: "وضعیت",
      td: "status",
      type: "select",
      options: [{
          label: 'سفید',
          value: 'blank'
        },
        {
          label: 'پاس نشده',
          value: 'notPassed'
        },
        {
          label: 'در جریان',
          value: 'inFlow'
        },
        {
          label: 'پاس شده',
          value: 'passed'
        },
        {
          label: 'برگشتی',
          value: 'bounced'
        },
        {
          label: 'نقدی',
          value: 'cashed'
        },
        {
          label: 'باطل شده',
          value: 'revoked'
        },
        {
          label: 'انتقالی',
          value: 'transferred',
        }
      ],
      filters: ["status"]
    },
    {
      th: "نام بانک",
      td: "bankName",
      type: "text",
      filters: ["bankName__icontains"]
    }
  ],
}