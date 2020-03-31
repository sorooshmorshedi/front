import {
  mapState
} from "vuex";

export default {
  data() {
    return {
      pricingTypes: [{
          id: 0,
          name: 'فایفو'
        },
        {
          id: 1,
          name: 'میانگین موزون'
        },
      ]
    }
  },
  methods: {
    getWareLevels(force = false, init = false) {
      if (!force && this.wareLevels.length) return;
      return this.request({
        url: this.endpoint('wares/wareLevels'),
        method: 'get',
        success: data => {
          this.$store.commit('setWares', {
            wareLevels: data
          });
          init && this.init();
        }
      })
    },
    getWares(force = false, init = false) {
      if (!force && this.wares.length) return;
      return this.request({
        url: this.endpoint('wares/wares'),
        method: 'get',
        success: data => {
          let wares = [];
          data.forEach(w => {
            wares.push({
              ...w,
              pricingType: this.pricingTypes[w.pricingType],
            })
          })
          this.$store.commit('setWares', {
            wares: wares
          });
          init && this.init();
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
    storeWare() {
      let data = this.copy(this.ware);
      let parent = data.parent;

      data = this.extractIds(data);
      data = this.rawData(data);

      this.request({
        url: this.endpoint('wares/wares'),
        method: 'post',
        data: data,
        success: data => {
          this.getData(true);
          this.modal("#ware-modal", "hide");
          this.notify('کالا با موفقیت ساخته شد', 'success');
        }
      })
    },
    updateWare() {
      this.log('update ware');
      let data = this.copy(this.ware);
      let parent = data.parent;

      data = this.extractIds(data);
      data = this.rawData(data);

      this.request({
        url: this.endpoint('wares/wares/' + data.id),
        method: 'put',
        data: data,
        success: data => {
          this.getData(true);
          this.modal("#ware-modal", "hide");
          this.notify('کالا با موفقیت ویرایش شد', 'success');
        }
      })

    },
    deleteWare(node) {
      // add confirmation 
      this.request({
        url: this.endpoint('wares/wares/' + node.id),
        method: 'delete',
        success: data => {
          this.notify('کالا با موفقیت حذف شد', 'success');
          if (this.mode == 'edit') this.getWares(true);
        }
      })
    },
    storeWareLevel() {
      let data = this.copy(this.wareLevel);
      let parent = data.parent;
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].id) data[key] = data[key].id;
      })
      this.request({
        url: this.endpoint('wares/wareLevels'),
        method: 'post',
        data: data,
        success: data => {
          this.getData(true);
          this.modal("#wareLevel-modal", "hide");
          this.notify('کالا با موفقیت ساخته شد', 'success');
        }
      })
    },
    updateWareLevel() {
      this.log('update wareLevel');
      let data = this.copy(this.wareLevel);
      let parent = data.parent;
      Object.keys(data).forEach(key => {
        if (data[key]) {
          if (typeof data[key] == 'object') {
            if (data[key].id) data[key] = data[key].id;
            else delete data[key];
          } else {
            if (data[key] == "") data[key] = null;
          }
        } else {
          if (data[key] == null) delete data[key];
        }
      })
      this.request({
        url: this.endpoint('wares/wareLevels/' + data.id),
        method: 'put',
        data: data,
        success: data => {
          this.getData(true);
          this.modal("#wareLevel-modal", "hide");
          this.notify('کالا با موفقیت ویرایش شد', 'success');
        }
      })

    },
    deleteWareLevel(node) {
      // add confirmation 
      this.request({
        url: this.endpoint('wares/wareLevels/' + node.id),
        method: 'delete',
        success: data => {
          this.notify('کالا با موفقیت حذف شد', 'success');
          if (this.mode == 'edit') this.getWareLevels(true);
        }
      })
    },
    clearWares() {
      this.log('clear ware object');
      this.ware = {
        code: '',
        parent: null,
        pricingType: {},
        unit: {},
        warehouse: {},
      };
      this.wareLevel = {
        code: '',
        level: this.wareLevel.level,
        parent: null,
      };
      this.unit = {};
      // Object keys(this.floatWare).forEach(k => {
      //   this.floatWare[k] = null;
      // });
      // Object.keys(this.floatWareGroup).forEach(k => {
      //   this.floatWareGroup[k] = null;
      // });
    },
    rawData(data) {
      data.price = data.price.split(',').join('');
      return data;
    }
  },
  computed: {
    ...mapState({
      wareLevels: state => state.wares.wareLevels,
      wares: state => state.wares.wares,
      warehouses: state => state.wares.warehouses,
      units: state => state.wares.units,
      accounts: state => state.accounts,
    }),
    waresSelectValues() {
      this.log('Generate wares SelectValues');
      let res = {
        levels: {
          0: [],
          1: [],
          2: [],
        },
        wares: [],
        warehouses: [],
        units: [],
        suppliers: [],
        pricingTypes: this.pricingTypes,
      };
      let q = [];
      this.wareLevels.forEach(wl => q.push(wl));
      while (q.length != 0) {
        let level = q.shift();
        res.levels[level.level].push(level)
        level.children && level.children.forEach(child => {
          // child.parent = level;
          q.push(child)
        });
      }
      q = [];
      this.accounts.forEach(acc => q.push(acc));
      while (q.length != 0) {
        let acc = q.shift();
        if (acc.level == 3) {
          res.suppliers.push(acc)
        }
        acc.children && acc.children.forEach(child => {
          q.push(child)
        });
      }
      this.wares.forEach(w => {
        res.wares.push({
          ...w,
        });
      });
      this.warehouses.forEach(wh => {
        res.warehouses.push({
          ...wh
        })
      })
      this.units.forEach(u => {
        res.units.push({
          ...u
        });
      });
      return res;
    },
  }
}
