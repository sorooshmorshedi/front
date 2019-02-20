import _ from 'lodash';
export default {
  cols: [{
      th: "کد حساب",
      td: "code",
      type: "number",
      filters: [{
        label: 'از کد حساب',
        model: "code__from",
        filter(item, value) {
          if (!value) return true;
          for (let i = value.length; i < 9; i++) value += '0'; switch (item.level) {
            case 0:
              return item.code >= value[0];
            case 1:
              return item.code >= value.substr(0, 3);
            case 2:
              return item.code >= value.substr(0, 5);
            case 3:
              return item.code >= value.substr(0, 9);
          }
        }
      }, {
        label: 'تا کد حساب',
        model: "code__to",
        filter(item, value) {
          if (!value) return true;
          for (let i = value.length; i < 9; i++) value += '9';
          switch (item.level) {
            case 0:
              return item.code <= value[0];
            case 1:
              return item.code <= value.substr(0, 3);
            case 2:
              return item.code <= value.substr(0, 5);
            case 3:
              return item.code <= value.substr(0, 9);
          }
        }
      }]
    },
    {
      th: "نام حساب",
      td: "name",
      type: "text",
      filters: ["name"]
    },
    {
      th: "جمع بدهکار",
      td: "bed_sum",
      type: "money",
      filters: ["bed_sum"]
    },
    {
      th: "جمع بستانکار",
      td: "bes_sum",
      type: "money",
      filters: ["bes_sum"]
    },
    {
      th: "مانده بستانکار",
      td: "bes_remain",
      type: "money",
      filters: ["bes_remain"]
    },
    {
      th: "مانده بدهکار",
      td: "bed_remain",
      type: "money",
      filters: ["bed_remain"]
    },
  ],
}
