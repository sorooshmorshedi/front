import {
  mapState
} from "vuex";
import {
  maxBy
} from 'lodash';

export default {
  data() {
    return {
      GuaranteeTypes: [{
        id: 1,
        name: 'چک ضمانتی',
        codename: 'gc'
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
    getTypeName(codename) {
      console.log(codename);
      let type = this.chequeTypes.find((o) => o.value == codename)
      if(type){
        return type.text
      } else {
        console.error("Codename is incurrect:", codename, this.chequeTypes)
        return ''
      }
    },
    getCheque(id) {
      this.getChequeMeta();
      return this.request({
        url: this.endpoint(`cheques/cheques/${id}`),
        method: 'get',
        success: data => {
          this.setItem(data);
        }
      })
    },
    getChequeMeta(reload) {
      this.fillStore({
        url: 'cheques/cheques/meta',
        storeKey: 'chequeMeta',
        reload: reload
      })
    },
  },
  computed: {
    ...mapState({
      chequeTypes: (state) => state.chequeMeta.types.map(o => { return { text: o[1], value: o[0] } }),
      chequeStatuses: (state) => state.chequeMeta.statuses.map(o => { return { text: o[1], value: o[0] } }),
      chequeOwnerTypes: (state) => state.chequeMeta.owner_types.map(o => { return { text: o[1], value: o[0] } }),
      chequeStatusTree: (state) => state.chequeMeta.tree,
    }),
    chequeGuaranteeTypes() {
      return this.chequeTypes.filter(o => this.$store.state.chequeMeta.guarantee_types.includes(o.value))
    }
  }
}