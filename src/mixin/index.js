import Vue from 'vue';

import moment from 'moment-jalaali';

import RequestMixin from "./_requestMixin.js";

import {
  mapState
} from 'vuex'

Vue.mixin({
  mixins: [RequestMixin],
  data() {
    return {
      token: null,
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      financialYear: state => state.user ? state.user.active_financial_year || null : null,
      company: state => state.user ? state.user.active_company || null : null,
      permissions: state => state.user.permissions,
      systemOptions: state => state.options,
      OGR: state => state.OGR,
      now: state => state.now
    }),
    isDev() {
      return process.env.NODE_ENV === 'development';
    },
    query() {
      return this.$route.query;
    }
  },
  created() {

    this.token = localStorage.getItem('token');
    if (!this.token && this.$route && !['Login', 'ForgetPassword'].includes(this.$route.name)) {
      this.$router.push({
        name: 'Login'
      });
    }
  },
  mounted() {},
  methods: {
    getOptionValue(codename) {
      return this.systemOptions.filter(o => o.codename == codename)[0].value;
    },

    askConfirmations(confirmations) {
      /*
      # Structure
      confirmation = {
        text: '',
      }
      */

      for (const confirmation of confirmations) {
        let confirmed = confirm(confirmation.text);
        if (!confirmed) return false;
      }

      return true

    },
    initTooltips() {
      console.log('init tooltips');
      $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })
    },
    extractIds(data, exclude = []) {
      let res = this.copy(data);
      Object.keys(res).forEach(key => {
        if (exclude && exclude.includes(key)) return;
        if (res[key] && (typeof (res[key]) == 'object' && 'id' in res[key])) res[key] = res[key].id;
      });
      return res;
    },
    successNotify() {
      this.notify('عملیات با موفقیت انجام شد', 'success')
    },
    notify(msg, type) {
      let colors = {
        'danger': 'red',
        'warning': 'orange',
        'success': 'green'
      }
      this.$store.commit('setSnackbar', {
        show: true,
        color: colors[type],
        text: msg
      });
    },
    hasPermission(permission) {
      return this.permissions && this.permissions.includes(permission);
    },
    goTo(selector) {
      $('body,html')
        .scrollTop($(selector)
          .offset()
          .top - $('selector')
          .height() - 50);
    },
    setToken(token) {
      localStorage.setItem('token', token);
      this.token = token;
    },
    copy(obj) {
      let res = null;
      if (Array.isArray(obj)) {
        res = obj.slice();
      } else {
        res = Object.assign({}, obj);
      }
      return res;
    },
    log(t) {
      console.log(moment().format('HH:mm:ss:SS'), t);
    },
    openFactor(factor) {
      let routeData = this.$router.resolve({
        name: "FactorForm",
        params: {
          factorType: factor.type,
          id: factor.id
        }
      });
      window.open(routeData.href, "_blank");
    },
    hasValue(v) {
      return !['', 0, '0', undefined, null].includes(v);
    },
    toGDate(date) {
      return moment(date, "jYYYY-jMM-jDD").format(
        "YYYY-MM-DD"
      );
    },
    toMoney(m) {
      if (!m) return m;
      let res = [];
      m = m + '';
      if (m.includes(',')) {
        m = m.split(',');
      } else {
        m = String(Number(m));
        m = m.split('');
      }
      let len = m.length;
      m.reverse();
      let i = 0;
      if (m.includes('.')) i = m.find('.');
      for (i = 0; i < len; i++) {
        if (i && i % 3 == 0) {
          res.push(',');
        }
        res.push(m[i]);
      }
      return res.reverse().join('');

    },
    todayDate() {
      return moment().format('jYYYY/jMM/jDD');
    },
    getRandomId() {
      return 'rid-' + Math.floor(Math.random() * 10000)
    },

    updateQueryString(key, value) {
      let route = this.$route;

      let query = {
        ...route.query
      };
      query[key] = value

      this.$router.push({
        name: route.name,
        params: route.params,
        query: query
      })
    }
  },
  filters: {
    toJalali(date) {
      return moment(date).format('jYYYY/jMM/jDD');
    },
    toMoney(m) {
      if (!m) return m;
      let res = [];
      m = m + '';
      if (m.includes(',')) {
        m = m.split(',');
      } else {
        m = String(Number(m));
        m = m.split('');
      }
      let len = m.length;
      m.reverse();
      let i = 0;
      // if (m.includes('.')) i = m.indexOf('.');
      for (i = 0; i < len; i++) {
        if (i && i % 3 == 0) {
          res.push(',');
        }
        res.push(m[i]);
      }
      return res.reverse().join('');
    },
  }
})