import {
  mapState
} from "vuex";
import {
  maxBy
} from 'lodash';

export default {
  data() {
    return {
      ChequeTypes: [{
          id: 1,
          name: 'چک',
          codename: 'c'
        },
        {
          id: 2,
          name: 'سفته',
          codename: 'pn'
        },
        {
          id: 3,
          name: 'ضمانت نامه بانکی',
          codename: 'bg'
        },
      ]
    }
  },
  methods: {
    getTypeName(codename){
      return this.ChequeTypes.find((o) => o.codename == codename).name;
    },
    getCheque(id) {
      return this.request({
        url: this.endpoint(`cheques/cheques/${id}`),
        method: 'get',
        success: data => {
          this.setItem(data);
        }
      })
    },
  },
}