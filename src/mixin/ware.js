import createSchema from "@/components/panel/ware/CreateSchema";
import editSchema from "@/components/panel/ware/EditSchema";

import WareApi from "./wareApi";
import AccountApi from "./accountApi";

export default {
  mixins: [WareApi, AccountApi],
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
        warehouse: {},
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
    async getData(force = false) {
      this.log('Get all wares data');
      Promise.all([
        this.getWareLevels(force, false),
        this.getWares(force, false),
        this.getWarehouses(force, false),
        this.getUnits(force, false),
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
    clearWares() {
      this.log('clear ware object');
      this.ware = {
        code: '',
        parent: null,
        pricing_type: {},
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
  },
  computed: {
  }
}
