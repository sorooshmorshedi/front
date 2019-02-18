export default {
  url: "reports/ledger",
  cols: [{
      th: "تاریخ",
      td: "sanad.date",
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
      th: "شماره سند",
      td: "sanad.code",
      type: "number",
      filters: ["code__icontains"]
    },
    {
      th: "شرح",
      td: "explanation",
      type: "text",
      filters: ["explanation__icontains"]
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
      th: "بدهکار",
      td: "value",
      type: "money",
      sortable: false,
      render(item) {
        if (item.valueType == 'bed') return item.value;
        return 0;
      }
    },
    {
      th: "بستانکار",
      td: "value",
      type: "money",
      sortable: false,
      render(item) {
        if (item.valueType == 'bes') return item.value;
        return 0;
      }
    },
    {
      th: "مانده",
      td: "remain",
      type: "money",
      sortable: false,
      render(item, items, oldItems) {
        let remain, remainType, lastItem = null;
        if (items.indexOf(item) == 0) {
          if (oldItems.length != 0) {
            lastItem = oldItems[oldItems.length - 1];
          }
        } else {
          lastItem = items[items.indexOf(item) - 1];
        }
        if (lastItem) {
          remain = lastItem.remain;
          remainType = lastItem.remainType;
        } else {
          remain = 0;
          remainType = item.valueType;
        }

        if (item.valueType == remainType) item.remain = remain + +item.value;
        else item.remain = remain - +item.value;

        if (item.remain < 0) {
          item.remain = -item.remain;
          item.remainType = remainType == 'bed' ? 'bes' : 'bed';
        } else {
          item.remainType = remainType;
        }


        return item.remain;
      },
    },
    {
      th: "تشخیص",
      td: "remainType",
      type: "string",
      sortable: false,
      render(item) {
        if (item.remain == 0) return '';
        if (item.remainType == 'bed') return 'بدهکار';
        if (item.remainType == 'bes') return 'بستانکار';
        return 'error';
      }
    },
  ],
}
