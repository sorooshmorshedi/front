import _ from 'lodash';
import {
  fromCodeFilter,
  toCodeFilter
} from '@/mixin/accountMixin'

export default {
  cols: [{
      text: "کد حساب",
      value: "code",
      type: 'text',
      align: 'left'
    },
    {
      text: "نام حساب",
      value: "name",
    },
  ],
}