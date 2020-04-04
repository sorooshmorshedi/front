import {
  mapState
} from "vuex";
import {
  maxBy
} from 'lodash';

export default {
  data() {
    return {}
  },
  methods: {
    getCheque(id) {
      return this.request({
        url: this.endpoint(`cheques/cheques/${id}`),
        method: 'get',
        success: data => {
          this.setCheque(data);
        }
      })
    },
  },
}
