import {
  mapState
} from "vuex";
export default {
  data() {
    return {
      isGettingAccounts: false,
      isGettingFloatAccounts: false
    }
  },
  computed: {
    ...mapState({
      accounts: state => state.accounts,
      floatAccountGroups: state => state.floatAccountGroups,
      floatAccounts: state => state.floatAccounts,
      accountTypes: state => state.accountTypes,
      costCenterGroups: state => state.costCenterGroups,
      defaultAccounts: state => state.defaultAccounts,
      isGetting: state => state.isGetting
    }),
    accountsSelectValues() {
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
      if (!this.accounts) return res;

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
    getSortedAccounts(accounts, reverse = false) {
      reverse = reverse ? 0 : 1

      accounts.sort((a, b) => b.id - a.id);

      accounts.sort((a, b) => a.code - b.code);
      let getChildren = (account) => {
        return accounts.filter(
          (o) => o.code.startsWith(account.code) && o.level == account.level + 1
        );
      };

      let sortedAccounts = this.accounts.filter((o) => o.level == 0);

      for (let i = 0; i < 3; i++) {
        for (let account of accounts.filter((o) => o.level == i)) {
          sortedAccounts.splice(
            sortedAccounts.indexOf(account) + reverse,
            0,
            ...getChildren(account)
          );
        }
      }
      return sortedAccounts;
    },
    getAccounts(force = false, init = false) {
      if (!force && this.accounts.length) return;
      if (this.isGetting.accounts) return;
      this.$store.commit('updateIsGetting', {
        accounts: true
      })

      return this.request({
        url: this.endpoint('accounts/accounts'),
        method: 'get',
        success: data => {
          this.log('Get Accounts : Done')
          this.$store.commit('setAccounts', data);
          this.log('Commit Accounts : Done')
          init && this.init();
          this.log('Init:', init, ' : Done')
          this.EventBus.$emit('get:accounts', data);
          this.$store.commit('updateIsGetting', {
            'accounts': false
          })
        }
      })
    },
    getFloatAccountGroups(force = false, init = false) {
      if (!force && this.floatAccountGroups.length) return;
      if (this.isGettingFloatAccounts) return;
      this.isGettingFloatAccounts = true;

      return this.request({
        url: this.endpoint("accounts/floatAccountGroups"),
        method: 'get',
        success: data => {
          this.$store.commit('setFloatAccountGroups', data);
          init && this.init();
          this.isGettingFloatAccounts = false;
        }
      })
    },
    getFloatAccounts(force = false, init = false) {
      if (!force && this.floatAccounts.length) return;
      return this.request({
        url: this.endpoint('accounts/floatAccounts'),
        method: 'get',
        success: data => {
          this.$store.commit('setFloatAccounts', data);
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
          this.$store.commit('setAccountTypes', data);
          init && this.init();
        }
      })
    },
    getDefaultAccounts(force = false, init = false) {
      if (!force && this.defaultAccounts.length) return;
      if (this.isGetting.defaultAccounts) return;
      this.$store.commit('updateIsGetting', {
        defaultAccounts: true
      })
      return this.request({
        url: this.endpoint('accounts/defaultAccounts'),
        method: 'get',
        success: data => {
          this.$store.commit('setDefaultAccounts', data);
          init && this.init();
          this.$store.commit('updateIsGetting', {
            defaultAccounts: false
          })
        }
      })
    },
    findAccount(property, value, accounts) {
      if (!accounts) accounts = this.accounts;
      for (const account of accounts) {
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
      if (!account || !account.code) return [];
      let res = [];
      let codes = this.splitCode(account.code);
      for (const code of codes) {
        let acc = this.findAccount("code", code);
        if (!acc) {
          continue;
        }
        res.push(acc.name);
        if (codes.indexOf(code) == code.length - 3) break;
      }
      return res;
    },

    getTitle(level, account_type = "o") {
      if (account_type == "b") return "حساب بانک";
      if (account_type == "p") return "حساب اشخاص";
      switch (Number(level)) {
        case 0:
          return "گروه";
        case 1:
          return "کل";
        case 2:
          return "معین";
        case 3:
          return "تفصیلی";
      }
    },
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