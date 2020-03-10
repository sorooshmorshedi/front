import {
  mapState
} from "vuex";
export default {
  computed: {
    ...mapState({
      accounts: state => state.accounts.accounts,
      floatAccountGroups: state => state.accounts.floatAccountGroups,
      floatAccounts: state => state.accounts.floatAccounts,
      accountTypes: state => state.accounts.accountTypes,
      costCenterGroups: state => state.accounts.costCenterGroups,
      defaultAccounts: state => state.accounts.defaultAccounts,
    }),
    accountsSelectValues() {
      if (!this.accounts) return [];
      this.log('Generate accountsSelectValues');
      let res = {
        levels: {
          0: [],
          1: [],
          2: [],
          3: [],
        },
        costCenterGroups: [],
        costCenters: [],
        floatAccountGroups: [],
        floatAccounts: [],
        accountTypes: [],
        buyers: [],
        sellers: [],
        persons: [],
        banks: [],
        defaultAccounts: [],
        all: [],
      };

      this.accounts.forEach(account => {
        res.all.push(account);
        res.levels[account.level].push(account);

        if (account.account_type == 'p') {
          res.persons.push(account);
          if (account.person_type == 'buyer') res.buyers.push(account);
          if (account.person_type == 'seller') res.sellers.push(account);
        }

        if (account.account_type == 'b') res.banks.push(account);

      });

      this.accountTypes.forEach(at => {
        res.accountTypes.push({
          ...at,
        })
      })

      res.floatAccountGroups = this.floatAccountGroups.filter(o => o.is_cost_center == false);
      res.costCenterGroups = this.floatAccountGroups.filter(o => o.is_cost_center == true);

      res.floatAccounts = this.floatAccounts.filter(o => o.is_cost_center == false);
      res.costCenters = this.floatAccounts.filter(o => o.is_cost_center == true);


      res.defaultAccounts.push({
        name: 'خنثی',
        id: null
      });

      this.defaultAccounts.forEach(da => {
        res.defaultAccounts.push({
          ...da,
        });
      });

      return res;
    },
  },
  methods: {
    getAccounts(force = false, init = false) {
      if (!force && this.accounts.length) return;
      return this.request({
        url: this.endpoint('accounts/accounts'),
        method: 'get',
        success: data => {
          this.log('Get Accounts : Done')
          this.$store.commit('setAccounts', {
            accounts: data
          });
          this.log('Commit Accounts : Done')
          init && this.init();
          this.log('Init:', init, ' : Done')
        }
      })
    },
    getFloatAccountGroups(force = false, init = false) {
      if (!force && this.floatAccountGroups.length) return;

      return this.request({
        url: this.endpoint("accounts/floatAccountGroups"),
        method: 'get',
        success: data => {
          this.$store.commit('setAccounts', {
            floatAccountGroups: data
          });
          init && this.init();
        }
      })
    },
    getFloatAccounts(force = false, init = false) {
      if (!force && this.floatAccounts.length) return;
      return this.request({
        url: this.endpoint('accounts/floatAccounts'),
        method: 'get',
        success: data => {
          this.$store.commit('setAccounts', {
            floatAccounts: data
          });
          init && this.init();
        }
      })
    },
    getAccountTypes(force = false, init = false) {
      if (!force && this.accountTypes.length) return;
      return this.request({
        url: this.endpoint('accounts/accountTypes'),
        method: 'get',
        success: data => {
          this.$store.commit('setAccounts', {
            accountTypes: data
          });
          init && this.init();
        }
      })
    },
    getDefaultAccounts(force = false, init = false) {
      if (!force && this.defaultAccounts.length) return;
      return this.request({
        url: this.endpoint('accounts/defaultAccounts'),
        method: 'get',
        success: data => {
          this.$store.commit('setAccounts', {
            defaultAccounts: data
          });
          init && this.init();
        }
      })
    },
    findAccount(property, value, accounts) {
      if (!accounts) accounts = this.accounts;
      for (const account of accounts) {
        // console.log(account[property], value);
        if (account[property] == value) {
          return account;
        }
        if (account.children && account.children.length != 0) {
          let acc = this.findAccount(property, value, account.children);
          if (acc) return acc;
        }
      }
      // console.error('Account not found: ', property, '=', value);
      return null;
    },
    openLedger(account) {
      let routeData = this.$router.resolve({
        name: "LedgerReport",
        query: {
          accs: [+account.id, ]
        }
      });
      window.open(
        routeData.href,
        "_blank",
        "location=yes,height=600,width=1200,scrollbars=yes,status=yes"
      );
    },
    splitCode(code) {
      let res = [];
      let levelCodeLens = [1, 3, 5, 9];
      levelCodeLens.forEach(len => {
        let codePart = code.substr(0, len);
        if (!res.includes(codePart)) res.push(codePart);
      });
      return res;
    },
    accountParentsName(account) {
      if (!account) return [];
      let res = [];
      let codes = this.splitCode(account.code);
      for (const code of codes) {
        let acc = this.findAccount("code", code);
        if (!acc) {
          console.log("no account for", code);
          continue;
        }
        res.push(acc.name);
        if (codes.indexOf(code) == code.length - 3) break;
      }
      return res;
    }
  },
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
