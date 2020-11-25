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
      ],

      waresStatuses: [{
          value: "all",
          text: "همه"
        },
        {
          value: "withRemain",
          text: "کالا های دارای مانده"
        },
        {
          value: "withoutRemain",
          text: "بدون مانده"
        },
        {
          value: "withTransaction",
          text: "کالا های دارای گردش"
        },
        {
          value: "withoutTransaction",
          text: "کالا های بدون گردش"
        },
      ],

      wareLevels: [{
          value: null,
          text: "همه"
        },
        {
          value: 0,
          text: "ماهیت"
        },
        {
          value: 1,
          text: "گروه"
        },
        {
          value: 2,
          text: "دسته بندی"
        },
        {
          value: 3,
          text: "کالا"
        },
      ],

    }
  },
  methods: {
    getWares(force = false, init = false) {
      if (!force && this.wares.length) return;

      if (!this.canGet('wares')) return;


      return this.request({
        url: this.endpoint('wares/wares'),
        method: 'get',
        success: data => {
          this.$store.commit('setWares', {
            wares: data
          });
          init && this.init();

          this.toggleIsGetting('wares')
          this.EventBus.$emit('get:wares', data);
        }
      })
    },
    getWarehouses(force = false, init = false) {
      if (!force && this.warehouses.length) return;
      if (!this.canGet('warehouses')) return;
      return this.request({
        url: this.endpoint('wares/warehouses'),
        method: 'get',
        success: data => {
          this.$store.commit('setWares', {
            warehouses: data
          });
          init && this.init();
          this.toggleIsGetting('warehouses')
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
      wares: state => state.wares.wares,
      warehouses: state => state.wares.warehouses,
      units: state => state.wares.units,
      isGetting: state => state.isGetting
    }),
  }
}