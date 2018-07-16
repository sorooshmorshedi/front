import {
  mapState
} from "vuex";
import createSchema from "@/components/panel/ware/CreateSchema";
import editSchema from "@/components/panel/ware/EditSchema";

export default {
  data() {
    return {
      mode: null,
      createSchema: createSchema,
      editSchema: editSchema,
      ware: {
        code: '',
        parent: {},
        pricing_type: {},
        unit: {},
        wareHouse: {},
      },
      wareLevel: {
        code: '',
        level: 0,
        parent: {},
      },
      unit: {},
      levelsLen: {
        0: 1,
        1: 2,
        2: 2,
        3: 3
      },
      pricing_types: [{
          pk: 0,
          name: 'فایفو'
        },
        {
          pk: 1,
          name: 'لایفو'
        },
        {
          pk: 2,
          name: 'میانگین موزون'
        },
        {
          pk: 3,
          name: 'ارزش ویژه'
        },

      ]
    }
  },
  created() {
    this.getData();
  },
  watch: {
    'wareLevel.parent': function () {
      this.setWareLevelCode();
    },
    'ware.category': function () {
      this.setWareCode();
    }
  },
  methods: {
    setCode() {
      this.setWareLevelCode();
      this.setWareCode();
    },
    setWareLevelCode() {
      if (this.mode != 'create') return;
      if (this.wareLevel.level != undefined) {
        let code;
        let maxCode;
        let codes = [];

        if (this.wareLevel.level == 0) {
          this.wareLevels.forEach(wl => {
            codes.push(+wl.code);
          })
          code = '';
          maxCode = 9;
        } else {
          if (!this.wareLevel.parent) {
            this.wareLevel.code = '';
            return;
          }
          code = this.wareLevel.parent.code;
          maxCode = +(code + '' + (10 ** this.levelsLen[this.wareLevel.level] - 1));

          let q = [];
          this.wareLevels.forEach(wl => q.push(wl));
          while (q.length != 0) {
            let wl = q.shift();
            codes.push(+wl.code);
            wl.children && wl.children.forEach(child => {
              q.push(child)
            });
          }
        }
        for (let i = 0; i < this.levelsLen[this.wareLevel.level]; i++) code += '0';
        code = +code + 1;
        while (codes.includes(code)) {
          if (code > maxCode) return;
          code++;
        }
        this.wareLevel.code = code;
        this.log('Calculated WareLevel Code: ', this.wareLevel.code);
      } else {
        console.error('wareLevel has no code attribute: ', this.wareLevelw);
      }

    },
    setWareCode() {
      if (this.mode != 'create') return;
      if (!this.ware.category) {
        this.ware.code = '';
        return;
      }
      let codes = [];
      let code = this.ware.category.code;;
      let maxCode = code + '' + 10 ** this.levelsLen[3] - 1;
      this.wares.forEach(w => {
        codes.push(+w.code);
      });

      for (let i = 0; i < this.levelsLen[3]; i++) code += '0';
      code = +code + 1;
      while (codes.includes(code)) {
        if (code > maxCode) return;
        code++;
      }
      this.ware.code = code;
      this.log('Calculated Ware Code: ', this.ware.code);
    },
    splitCode(code) {
      return [
        code.substr(0, 1),
        code.substr(0, 3),
        code.substr(0, 5),
        code
      ];
    },
    async getData(fource = false) {
      this.log('Get all wares data');
      Promise.all([
        this.getWareLevels(fource, false),
        this.getWares(fource, false),
        this.getWareHouses(fource, false),
        this.getUnits(fource, false),
        this.getAccounts(false, false),
      ]).then(values => {
        this.init();
      })
    },
    init() {
      this.log('wares initialization');
      this.createSchema.init(this.waresSelectValues);
      this.editSchema.init(this.waresSelectValues);
      this.clearWares();
      this.setCode();
    },
    getWareLevels(fource = false, init = true) {
      if (!fource && this.wareLevels.length) return;
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
    getWares(fource = false, init = true) {
      if (!fource && this.wares.length) return;
      return this.request({
        url: this.endpoint('wares/wares'),
        method: 'get',
        success: data => {
          let wares = [];
          data.forEach(w => {
            wares.push({
              ...w,
              pricing_type: this.pricing_types[w.pricing_type],
            })
          })
          this.$store.commit('setWares', {
            wares: wares
          });
          init && this.init();
        }
      })
    },
    getWareHouses(fource = false, init = true) {
      if (!fource && this.wareHouses.length) return;
      return this.request({
        url: this.endpoint('wares/wareHouses'),
        method: 'get',
        success: data => {
          this.$store.commit('setWares', {
            wareHouses: data
          });
          init && this.init();
        }
      })
    },
    getUnits(fource = false, init = true) {
      if (!fource && this.units.length) return;
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
    getAccounts(fource = false, init = true) {
      if (!fource && this.accounts.length) return;
      return this.request({
        url: this.endpoint('accounts/accounts'),
        method: 'get',
        success: data => {
          this.$store.commit('setAccounts', {
            accounts: data
          });
          init && this.init();
        }
      })
    },
    storeWare() {
      let data = this.copy(this.ware);
      let parent = data.parent;
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].pk != undefined) data[key] = data[key].pk;
      })
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
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].pk != undefined) data[key] = data[key].pk;
      })
      this.request({
        url: this.endpoint('wares/wares/' + data.pk),
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
        url: this.endpoint('wares/wares/' + node.pk),
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
        if (data[key] && data[key].pk) data[key] = data[key].pk;
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
            if (data[key].pk) data[key] = data[key].pk;
            else delete data[key];
          }
        } else {
          if (data[key] == null) delete data[key];
        }
      })
      this.request({
        url: this.endpoint('wares/wareLevels/' + data.pk),
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
        url: this.endpoint('wares/wareLevels/' + node.pk),
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
        pricing_type: {},
        unit: {},
        wareHouse: {},
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
  },
  computed: {
    ...mapState({
      wareLevels: state => state.wares.wareLevels,
      wares: state => state.wares.wares,
      wareHouses: state => state.wares.wareHouses,
      units: state => state.wares.units,
      accounts: state => state.accounts.accounts,
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
        wareHouses: [],
        units: [],
        suppliers: [],
        pricing_types: this.pricing_types,
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
      this.wareHouses.forEach(wh => {
        res.wareHouses.push({
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
