import {
  mapState
} from "vuex";
export default {
  methods: {
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
    getFloatAccountGroups(fource = false, init = true) {
      if (!fource && this.floatAccountGroups.length) return;
      return this.request({
        url: this.endpoint('accounts/floatAccountGroups'),
        method: 'get',
        success: data => {
          this.$store.commit('setAccounts', {
            floatAccountGroups: data
          });
          init && this.init();
        }
      })
    },
    getAccountTypes(fource = false, init = true) {
      if (!fource && this.accountTypes.length) return;
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
    getCostCenterGroups(fource = false, init = true) {
      if (!fource && this.costCenterGroups.length) return;
      return this.request({
        url: this.endpoint('accounts/costCenterGroups'),
        method: 'get',
        success: data => {
          this.$store.commit('setAccounts', {
            costCenterGroups: data
          });
          init && this.init();
        }
      })
    },
    getIndependentAccounts(fource = false, init = true) {
      if (!fource && this.getIndependentAccounts.length) return;
      return this.request({
        url: this.endpoint('accounts/independentAccounts'),
        method: 'get',
        success: data => {
          this.$store.commit('setAccounts', {
            independentAccounts: data
          });
          init && this.init();
        }
      })
    },
    storeAccount() {
      let data = this.copy(this.account);
      let parent = data.parent;
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].pk) data[key] = data[key].pk;
      })
      this.request({
        url: this.endpoint('accounts/accounts'),
        method: 'post',
        data: data,
        success: data => {
          this.getData(true);
          this.modal("#account-modal", "hide");
          this.notify('حساب با موفقیت ساخته شد', 'success');
        }
      })
    },
    updateAccount() {
      this.log('update account');
      let data = this.copy(this.account);
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
      console.log(data);
      this.request({
        url: this.endpoint('accounts/accounts/' + data.pk),
        method: 'put',
        data: data,
        success: data => {
          this.getData(true);
          this.modal("#account-modal", "hide");
          this.notify('حساب با موفقیت ویرایش شد', 'success');
        }
      })

    },
    deleteAccount(node) {
      // add confirmation 
      this.request({
        url: this.endpoint('accounts/accounts/' + node.pk),
        method: 'delete',
        success: data => {
          this.notify('حساب با موفقیت حذف شد', 'success');
          this.$refs.tree && this.$refs.tree.delNode(node.parent, node)
          if (this.mode == 'edit') this.getAccounts(true);
        }
      })
    },
    storeFloatAccountGroup() {
      let data = this.copy(this.floatAccountGroup);
      this.request({
        url: this.endpoint('accounts/floatAccountGroups'),
        method: 'post',
        data: data,
        success: data => {
          this.notify('گروه حساب شناور با موفقیت ساخته شد', 'success');
          this.getFloatAccountGroups(true);
        }
      })
    },
    updateFloatAccountGroup() {
      let data = this.copy(this.floatAccountGroup);
      this.request({
        url: this.endpoint('accounts/floatAccountGroups/' + data.pk),
        method: 'put',
        data: data,
        success: data => {
          this.notify('گروه حساب شناور با موفقیت ویرایش شد', 'success');
          this.getFloatAccountGroups(true);
        }
      })

    },
    deleteFloatAccountGroup(pk) {
      this.request({
        url: this.endpoint('accounts/floatAccountGroups/' + pk),
        method: 'delete',
        success: data => {
          this.notify('گروه حساب شناور با موفقیت حذف شد', 'success');
          this.getFloatAccountGroups(true);
        }
      })
    },
    storeFloatAccount() {
      let data = this.copy(this.floatAccount);
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].pk) data[key] = data[key].pk;
      })
      this.request({
        url: this.endpoint('accounts/floatAccounts'),
        method: 'post',
        data: data,
        success: data => {
          this.notify('حساب شناور با موفقیت ساخته شد', 'success');
          this.clearAccounts();
        }
      })
    },
    updateFloatAccount() {
      let data = this.copy(this.floatAccount);
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].pk) data[key] = data[key].pk;
      })
      this.request({
        url: this.endpoint('accounts/floatAccounts/' + data.pk),
        method: 'put',
        data: data,
        success: data => {
          this.notify('حساب شناور با موفقیت ویرایش شد', 'success');
          this.clearAccounts();
        }
      })

    },
    deleteFloatAccount(pk) {
      // add confirmation 
      this.request({
        url: this.endpoint('accounts/floatAccounts/' + pk),
        method: 'delete',
        success: data => {
          this.notify('حساب شناور با موفقیت حذف شد', 'success');
          this.getFloatAccountGroups(true);
        }
      })
    },
    clearAccounts() {
      console.log('clear account object');
      this.account = {
        parent: null,
        level: this.account.level,
        code: '',
        type: null,
      };
      Object.keys(this.floatAccount).forEach(k => {
        this.floatAccount[k] = null;
      });
      Object.keys(this.floatAccountGroup).forEach(k => {
        this.floatAccountGroup[k] = null;
      });
    },
  },
  computed: {
    ...mapState({
      accounts: state => state.accounts.accounts,
      floatAccountGroups: state => state.accounts.floatAccountGroups,
      accountTypes: state => state.accounts.accountTypes,
      costCenterGroups: state => state.accounts.costCenterGroups,
      independentAccounts: state => state.accounts.independentAccounts,
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
      };
      let q = [];
      this.accounts.forEach(acc => q.push(acc));
      while (q.length != 0) {
        let account = q.shift();
        res.levels[account.level].push(account)
        account.children && account.children.forEach(child => {
          // child.parent = account;
          q.push(child)
        });
      }
      this.costCenterGroups.forEach(cc => {
        res.costCenterGroups.push({
          ...cc,
        })
        res.costCenters.push(...cc.costCenters);
      })
      this.accountTypes.forEach(at => {
        res.accountTypes.push({
          ...at,
        })
      })
      this.floatAccountGroups.forEach(fag => {
        res.floatAccountGroups.push({
          ...fag,
          floatAccounts: [],
        });
        fag.floatAccounts.length && fag.floatAccounts.forEach(fa => {
          fa.floatAccountGroup = fag;
          res.floatAccounts.push(fa);
        });
      })
      return res;
    },
  }
}
