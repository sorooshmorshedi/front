import createSchema from "@/components/panel/account/createSchema";
import editSchema from "@/components/panel/account/editSchema";
import AccountApi from "./accountApi";
import _ from 'lodash'

export default {
  mixins: [AccountApi],
  data() {
    return {
      mode: null,
      createSchema: createSchema,
      editSchema: editSchema,
      account: {
        parent: null,
        level: 0,
        code: '',
        type: {},
      },
      person: {},
      bank: {},
      floatAccount: {},
      floatAccountGroup: {},
      levels: {
        0: "group",
        1: "kol",
        2: "moein",
        3: "tafzili"
      },
      levelsLen: {
        0: 1,
        1: 2,
        2: 2,
        3: 4
      }
    }
  },
  created() {
    this.getData();
  },
  watch: {
    'account.level': function () {
      this.setCodeAndType();
    },
    'account.parent': function () {
      this.setCodeAndType();
    },
  },
  methods: {
    setCodeAndType() {
      if (this.mode != 'create') return;
      this.log('set new account code and type');
      let accounts = [];
      if (this.account.level == 0) {
        accounts = this.copy(this.accounts);
      } else {
        if (['buyer', 'seller', 'bank'].includes(this.account.level)) {
          this.account.parent = this.accountsSelectValues.levels[2].filter((acc) => {
            return acc.code == '11004';
          })[0]
          this.account.level = 3;
        }
        if (!this.account.parent) return '';
        accounts = this.account.parent.children;
      }
      let lastAccount = _.maxBy(accounts, o => o.code);
      let code = '';
      if (!lastAccount) {
        if (this.account.parent) code = this.account.parent.code;
        else code = '';
        for (let i = 0; i < this.levelsLen[this.account.level]; i++) {
          code += '0';
        }
        code = +code + 1;
      } else {
        code = +lastAccount.code + 1;
      }
      this.account.code = code;

      if (this.account.parent) {
        // this.account.type.id = this.account.parent.type.id;
        this.account.type = this.account.parent.type;
      }
    },
    async getData(force = false) {
      this.log('Get all accounts data');
      Promise.all([
        this.getAccounts(force, false),
        this.getFloatAccountGroups(force, false),
        this.getAccountTypes(force, false),
        this.getCostCenterGroups(force, false),
        this.getIndependentAccounts(force, false),
      ]).then(values => {
        this.init();
      })
    },
    init() {
      this.log('accounts initialization');
      this.createSchema.init(this.accountsSelectValues);
      this.editSchema.init(this.accountsSelectValues);
      this.clearAccounts();
      this.setCodeAndType();
    },
  },
  computed: {
    hasValidCode() {
      if (!this.account) return true;
      let len = this.levelsLen[this.account.level];
      let code = String(this.account.code);
      let chunk = Number(code.substr(code.length - len, len));
      if(code == '') return true;
      if(chunk == 0) return false;
      return true;

    }
  }
}
