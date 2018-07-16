import createSchema from "@/components/panel/account/createSchema";
import editSchema from "@/components/panel/account/editSchema";
import AccountApi from "./accountApi";

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
        if (!this.account.parent) return '';
        accounts = this.account.parent.children;
      }
      let lastAccount = accounts.sort((c1, c2) => {
        return c1.code < c2.code
      })[0];
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
        // this.account.type.pk = this.account.parent.type.pk;
        this.account.type = this.account.parent.type;
      }
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
      this.log('Get all accounts data');
      Promise.all([
        this.getAccounts(fource, false),
        this.getFloatAccountGroups(fource, false),
        this.getAccountTypes(fource, false),
        this.getCostCenterGroups(fource, false),
        this.getIndependentAccounts(fource, false),
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
  computed: {}
}
