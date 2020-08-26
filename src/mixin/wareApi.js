import {
  mapState
} from "vuex";

export default {
  data() {
    return {
      pricingTypes: [{
          id: 'f',
          name: 'فایفو'
        },
        {
          id: 'wm',
          name: 'میانگین موزون'
        },
      ]
    }
  },
  methods: {
    getWareLevels(force = false) {
      if (!force && this.wareLevels.length) return;
      return this.request({
        url: this.endpoint("wares/wareLevels"),
        method: "get",
        success: data => {
          this.$store.commit("setWares", {
            wareLevels: data
          });
        }
      });
    },
    getWares(force = false, init = false) {
      if (!force && this.wares.length) return;

      if (this.isGetting.wares) return;
      this.$store.commit('updateIsGetting', {
        wares: true
      })


      return this.request({
        url: this.endpoint('wares/wares'),
        method: 'get',
        success: data => {
          this.$store.commit('setWares', {
            wares: data
          });
          init && this.init();

          this.$store.commit('updateIsGetting', {
            'wares': false
          })
        }
      })
    },
    getWarehouses(force = false, init = false) {
      if (!force && this.warehouses.length) return;
      return this.request({
        url: this.endpoint('wares/warehouses'),
        method: 'get',
        success: data => {
          this.$store.commit('setWares', {
            warehouses: data
          });
          init && this.init();
        }
      })
    },
    getUnits(force = false, init = false) {
      if (!force && this.units.length) return;
      return this.request({
        url: this.endpoint('wares/units'),
        method: 'get',
        success: data => {
          this.$store.commit('setWares', {
            units: data
          });
          init && this.init();
        }
      })
    },
  },
  computed: {
    ...mapState({
      wareLevels: state => state.wares.wareLevels,
      wares: state => state.wares.wares,
      warehouses: state => state.wares.warehouses,
      units: state => state.wares.units,
      isGetting: state => state.isGetting
    }),
  }
}