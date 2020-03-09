import _ from 'lodash';
import {
  fromCodeFilter,
  toCodeFilter
} from '@/mixin/accountMixin'

export default {
  cols: [{
      th: "کد حساب",
      td: "code",
      type: "number",
      filters: [{
        label: 'از کد حساب',
        model: "code__from",
        filter: fromCodeFilter
      }, {
        label: 'تا کد حساب',
        model: "code__to",
        filter: toCodeFilter
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
      th: "مانده بدهکار",
      td: "bed_remain",
      type: "money",
      filters: ["bed_remain"]
    },
    {
      th: "مانده بستانکار",
      td: "bes_remain",
      type: "money",
      filters: ["bes_remain"]
    },
  ],
}
