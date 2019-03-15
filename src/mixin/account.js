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
      person: {
        type: '',
      },
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
      },
      config: {
        autoCodeAndType: true
      },
      DEFAULT_CODES: {
        buyer: {
          real: "10301",
          legal: "10302"
        },
        seller: {
          real: "30101",
          legal: "30102"
        },
        bank: "10101"
      }
    }
  },
  watch: {
    'account.level': function () {
      this.config.autoCodeAndType && this.setCodeAndType();
    },
    'account.parent': function () {
      this.config.autoCodeAndType && this.setCodeAndType();
    },
  },
  methods: {
    setCodeAndType() {
      if (this.mode != 'create' || this.accounts.length == 0) return;
      this.log('set new account code and type');
      let accounts = [];
      if (this.account.level == 0) {
        accounts = this.accountsSelectValues.levels[0];
      } else {
        if (!this.account.parent) {
          console.warn('Account does not have parent !', this.account);
          return '';
        }
        accounts = this.accountsSelectValues.levels[this.account.level].filter(o => _.startsWith(o.code, this.account.parent.code))
      }
      let lastAccount = _.maxBy(accounts, o => o.code);
      console.log(lastAccount)
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
    async getAllAccounts(force = false, callback = null) {
      this.log('Get All Accounts Data');
      Promise.all([
        this.getAccounts(force, false),
        this.getFloatAccountGroups(force, false),
        this.getFloatAccounts(force, false),
        this.getAccountTypes(force, false),
        this.getCostCenterGroups(force, false),
        this.getIndependentAccounts(force, false),
      ]).then(values => {
        this.log('Get All Accounts Data : Done');
        this.init();
        if (typeof (callback) === 'function') callback();
      })

    },
    init() {
      this.log('Init Accounts');
      this.createSchema.init(this.accountsSelectValues);
      this.editSchema.init(this.accountsSelectValues);
      this.clearAccounts();
      this.localAccountsInit && this.localAccountsInit();
      this.setCodeAndType();
      this.log('Init Accounts : Done');
    },
    isDefaultCode(code) {
      return [
        this.DEFAULT_CODES.buyer.real,
        this.DEFAULT_CODES.buyer.legal,
        this.DEFAULT_CODES.seller.real,
        this.DEFAULT_CODES.seller.legal,
        this.DEFAULT_CODES.bank
      ].includes(code);
    }
  },
  computed: {
    hasValidCode() {
      if (!this.account) return true;
      let len = this.levelsLen[this.account.level];
      let code = String(this.account.code);
      let chunk = Number(code.substr(code.length - len, len));
      if (code == '') return true;
      if (chunk == 0) return false;
      return true;

    }
  }
}

export function fromCodeFilter(item, value) {
  if (!value) return true;
  for (let i = value.length; i < 9; i++) value += '0';
  switch (item.level) {
    case 0:
      return item.code >= value[0];
    case 1:
      return item.code >= value.substr(0, 3);
    case 2:
      return item.code >= value.substr(0, 5);
    case 3:
      return item.code >= value.substr(0, 9);
  }

}

export function toCodeFilter(item, value) {
  if (!value) return true;
  for (let i = value.length; i < 9; i++) value += '9';
  switch (item.level) {
    case 0:
      return item.code <= value[0];
    case 1:
      return item.code <= value.substr(0, 3);
    case 2:
      return item.code <= value.substr(0, 5);
    case 3:
      return item.code <= value.substr(0, 9);
  }
}
