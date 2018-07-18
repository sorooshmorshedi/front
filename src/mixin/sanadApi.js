import {
  mapState
} from "vuex";

export default {
  data() {
    return {}
  },
  methods: {
    getRPTypes(fource = false, init = true) {
      if (!fource && this.RPTypes.length) return;
      return this.request({
        url: this.endpoint('sanads/RPTypes'),
        method: 'get',
        success: data => {
          this.$store.commit('setSanads', {
            RPTypes: data
          });
          init && this.init();
        }
      })
    },
    clearSanads() {
    },
  },
  computed: {
    ...mapState({
      RPTypes: state => state.sanads.RPTypes,
    }),
    sanadsSelectValues() {
      // if (!this.sanads) return [];
      this.log('Generate sanadsSelectValues');
      let res = {
        RPTypes: [], 
      }
      this.RPTypes.forEach(rptype => {
        res.RPTypes.push({
          ...rptype,
        })
      })
      return res;

    }
  }
}
