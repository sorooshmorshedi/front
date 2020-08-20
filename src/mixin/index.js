import Vue from 'vue';

import moment from 'moment-jalaali';

import RequestMixin from "./_requestMixin.js";

import {
  EventBus
} from "@/main"

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
    EventBus() {
      return EventBus;
    },
    ...mapState({
      user: state => state.user,
      financialYear: state => state.user ? state.user.active_financial_year || null : null,
      company: state => state.user ? state.user.active_company || null : null,
      systemOptions: state => state.options,
      OGR: state => state.OGR,
      now: state => state.now,
      isPrinting: state => state.isPrinting
    }),
    isDev() {
      return process.env.NODE_ENV === 'development';
    },
    urlQuery() {
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
    hasPerm(operation, basename, object = null) {
      if (this.user.is_superuser) return true
      let roles = this.user.roles.filter(o => o.company = this.company.id);
      for (let role of roles) {
        for (let permission of role.permissions) {
          let codename = permission.codename
          if (codename.startsWith(operation) && codename.endsWith(basename)) {
            if (codename.includes('Own')) {
              if (object.created_by == this.user.id) return true
            } else {
              return true
            }
          }
        }
      }
      return false
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
    toMoney(value) {

      let isNegative = false;
      if (!value) value = "";
      else {
        let numeric_value = Number(value);
        if (number < 0) {
          isNegative = true;
          numeric_value = -numeric_value
        }
        if (!isNaN(numeric_value)) value = String(numeric_value);
        else value = String(value);
      }

      value = value.split(",").join("");

      let formattedValue = value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      if (isNegative) {
        return `-${value}`;
      } else {
        return value
      }
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
    toMoney(value) {

      let isNegative = false;
      if (value == null || value == undefined) value = "";
      else {
        let numeric_value = Number(value);
        if (numeric_value < 0) {
          isNegative = true;
          numeric_value = -numeric_value
        }
        if (!isNaN(numeric_value)) value = String(numeric_value);
        else value = String(value);
      }

      value = value.split(",").join("");

      let formattedValue = value
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      if (isNegative) {
        return `-${formattedValue}`;
      } else {
        return formattedValue
      }
    },
  }
})