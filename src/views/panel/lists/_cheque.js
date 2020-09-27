export default {
  url: "reports/lists/cheques",
  routerName: 'ChequeDetail',
  cols: [{
      text: "شماره",
      value: "serial",
    },
    {
      text: "شرح",
      value: "explanation",
    },
    {
      text: "تاریخ",
      value: "date",
    },
    {
      text: "تاریخ سررسید",
      value: "due",
    },
    {
      text: "مبلغ",
      value: "value",
    },
    {
      text: "نام حساب",
      value: "account.name",
    },
    {
      text: "وضعیت",
      value: "status",
      items: [{
          text: 'سفید',
          value: 'blank'
        },
        {
          text: 'پاس نشده',
          value: 'notPassed'
        },
        {
          text: 'در جریان',
          value: 'inFlow'
        },
        {
          text: 'پاس شده',
          value: 'passed'
        },
        {
          text: 'برگشتی',
          value: 'bounced'
        },
        {
          text: 'نقدی',
          value: 'cashed'
        },
        {
          text: 'باطل شده',
          value: 'revoked'
        },
        {
          text: 'انتقالی',
          value: 'transferred',
        }
      ],
    },
    {
      text: "نام بانک",
      value: "bankName",
      type: "text",
      filters: ["bankName__icontains"]
    }
  ],
}