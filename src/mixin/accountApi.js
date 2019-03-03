import {
  mapState
} from "vuex";
export default {
  methods: {
    getAccounts(force = false, init = true) {
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
    getFloatAccountGroups(force = false, init = true) {
      if (!force && this.floatAccountGroups.length) return;
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
    getFloatAccounts(force = false, init = true) {
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
    getAccountTypes(force = false, init = true) {
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
    getCostCenterGroups(force = false, init = true) {
      if (!force && this.costCenterGroups.length) return;
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
    getIndependentAccounts(force = false, init = true) {
      if (!force && this.getIndependentAccounts.length) return;
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
    getDefaultAccounts(force = false, init = true) {
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
    storeAccount() {
      let data = this.copy(this.account);
      let parent = data.parent;
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].id) data[key] = data[key].id;
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
            if (data[key].id) data[key] = data[key].id;
            else delete data[key];
          }
        } else {
          if (data[key] == null) delete data[key];
        }
      })
      this.request({
        url: this.endpoint('accounts/accounts/' + data.id),
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
      if (!node) {
        console.error("node is not provided")
        return;
      }
      // todo: add confirmation 
      this.request({
        url: this.endpoint('accounts/accounts/' + node.id),
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
        url: this.endpoint('accounts/floatAccountGroups/' + data.id),
        method: 'put',
        data: data,
        success: data => {
          this.notify('گروه حساب شناور با موفقیت ویرایش شد', 'success');
          this.getFloatAccountGroups(true);
        }
      })

    },
    deleteFloatAccountGroup(id) {
      if (!id) {
        console.error("id is not provided")
        return;
      }
      this.request({
        url: this.endpoint('accounts/floatAccountGroups/' + id),
        method: 'delete',
        success: data => {
          this.getFloatAccounts();
          this.notify('گروه حساب شناور با موفقیت حذف شد', 'success');
          this.getFloatAccountGroups(true);
        }
      })
    },
    storeFloatAccount() {
      let data = this.copy(this.floatAccount);
      data = this.extractIds(data);
      for (const fg of data.floatAccountGroups) {
        data.floatAccountGroups[data.floatAccountGroups.indexOf(fg)] = fg.id;
      }
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
      data = this.extractIds(data);
      let fags = [];
      for (const fag of data.floatAccountGroups) {
        fags.push(fag.id);
      }
      data.floatAccountGroups = fags;
      this.request({
        url: this.endpoint('accounts/floatAccounts/' + data.id),
        method: 'put',
        data: data,
        success: data => {
          this.getFloatAccounts();
          this.notify('حساب شناور با موفقیت ویرایش شد', 'success');
        }
      })

    },
    deleteFloatAccount(id) {
      if (!id) {
        console.error("id is not provided")
        return;
      }
      // add confirmation 
      this.request({
        url: this.endpoint('accounts/floatAccounts/' + id),
        method: 'delete',
        success: data => {
          this.notify('حساب شناور با موفقیت حذف شد', 'success');
          this.getFloatAccountGroups(true);
        }
      })
    },
    storePerson() {
      let data = this.copy(this.account);
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].id) data[key] = data[key].id;
      })
      data.level = 3;
      this.log('create person account');
      this.request({
        url: this.endpoint('accounts/accounts'),
        method: 'post',
        data: data,
        success: data => {
          let payload = this.copy(this.person);
          Object.keys(payload).forEach(key => {
            if (payload[key] && payload[key].id) payload[key] = payload[key].id;
          })
          payload.account = data.id;
          this.log('create person');
          this.request({
            url: this.endpoint('accounts/persons'),
            method: 'post',
            data: payload,
            success: data => {
              this.notify('شخص با موفقیت ساخته شد', 'success');
              this.getAccounts(true);
              this.clearAccounts();
            }
          })
        }
      })

    },
    updatePerson() {
      let data = this.copy(this.account);
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].id) data[key] = data[key].id;
      })
      this.log('create person account');
      this.request({
        url: this.endpoint('accounts/accounts/' + this.account.id),
        method: 'put',
        data: data,
        success: data => {
          let payload = this.copy(this.account.person);
          Object.keys(payload).forEach(key => {
            if (payload[key] && payload[key].id) payload[key] = payload[key].id;
          })
          payload.account = data.id;
          this.log('create person');
          this.request({
            url: this.endpoint('accounts/persons/' + this.account.id),
            method: 'put',
            data: payload,
            success: data => {
              this.notify('شخص با موفقیت ویرایش شد', 'success');
              this.getAccounts(true);
              this.clearAccounts();
            }
          })
        }
      })

    },
    storeBank() {
      let data = this.copy(this.account);
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].id) data[key] = data[key].id;
      })
      data.level = 3;
      this.log('create bank account');
      this.request({
        url: this.endpoint('accounts/accounts'),
        method: 'post',
        data: data,
        success: data => {
          let payload = this.copy(this.bank);
          Object.keys(payload).forEach(key => {
            if (payload[key] && payload[key].id) payload[key] = payload[key].id;
          })
          payload.account = data.id;
          this.log('create bank');
          this.request({
            url: this.endpoint('accounts/banks'),
            method: 'post',
            data: payload,
            success: data => {
              this.notify('بانک با موفقیت ساخته شد', 'success');
              this.getAccounts(true);
              this.clearAccounts();
            }
          })
        }
      })

    },
    updateBank() {
      let data = this.copy(this.account);
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].id) data[key] = data[key].id;
      })
      this.log('update bank account');
      this.request({
        url: this.endpoint('accounts/accounts/' + this.account.id),
        method: 'put',
        data: data,
        success: data => {
          let payload = this.copy(this.account.bank);
          Object.keys(payload).forEach(key => {
            if (payload[key] && payload[key].id) payload[key] = payload[key].id;
          })
          payload.account = data.id;
          this.log('update bank');
          this.request({
            url: this.endpoint('accounts/banks/' + this.account.id),
            method: 'put',
            data: payload,
            success: data => {
              this.notify('بانک با موفقیت ویرایش شد', 'success');
              this.getAccounts(true);
              this.clearAccounts();
            }
          })
        }
      })

    },
    clearAccounts() {
      this.log('Clear account object');
      this.account = {
        parent: null,
        level: this.account.level,
        code: '',
        type: null,
      };
      let personType;
      this.person && (personType = this.person.type);
      let list = ['floatAccount', 'floatAccountGroup', 'person', 'bank'];
      list.forEach(item => {
        Object.keys(this[item]).forEach(k => {
          this[item] = this.copy(this[item]);
          if (_.isArray(this[item][k])) {
            this[item][k] = [];
          } else {
            this[item][k] = null;
          }
        });
      })
      this.person && (this.person.type = personType);
    },
    splitCode(code) {
      let res = [];
      let levelCodeLens = [1, 3, 5, 9];
      levelCodeLens.forEach((len) => {
        let codePart = code.substr(0, len);
        if (!res.includes(codePart)) res.push(codePart);
      })
      return res;
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
    accountParentsName(account) {
      if (!account) return [];
      let res = [];
      let codes = this.splitCode(account.code);
      for (const code of codes) {
        let acc = this.findAccount('code', code);
        if (!acc) {
          console.log('no account for', code);
          continue;
        }
        res.push(acc.name);
        if (codes.indexOf(code) == code.length - 3) break;
      }
      return res;
    },
    accountRemain(account) {
      if (!account) return '';
      let res = '';
      res += 'مانده بدهکار: ' +
        this.toMoney(account.bed) +
        "<br>" +
        'مانده بستانکار: ' +
        this.toMoney(account.bes);
      return res;
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
  },
  computed: {
    ...mapState({
      accounts: state => state.accounts.accounts,
      floatAccountGroups: state => state.accounts.floatAccountGroups,
      floatAccounts: state => state.accounts.floatAccounts,
      accountTypes: state => state.accounts.accountTypes,
      costCenterGroups: state => state.accounts.costCenterGroups,
      independentAccounts: state => state.accounts.independentAccounts,
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
        banks: [],
        defaultAccounts: [],
      };
      let q = [];
      this.accounts.forEach(acc => q.push(acc));
      while (q.length != 0) {
        let account = q.shift();

        res.levels[account.level].push(account);

        if (account.person && account.person.type == 'buyer') res.buyers.push(account);

        if (account.person && account.person.type == 'seller') res.sellers.push(account);

        if (account.bank) res.banks.push(account);

        account.children && account.children.forEach(child => {
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

      res.floatAccountGroups = this.floatAccountGroups;

      this.floatAccounts.forEach(fa => {
        let fags = [];
        fa.floatAccountGroups && fa.floatAccountGroups.forEach(id => {
          let fag;
          if (typeof (id) !== 'number') {
            fag = id;
          } else {
            fag = this.floatAccountGroups.filter(o => o.id == id)[0];
          }
          if (fag) fags.push(fag);
        })
        fa.floatAccountGroups = fags;
        res.floatAccounts.push(fa);
      });

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
  }
}
