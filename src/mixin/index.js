import Vue from 'vue';
import axios from 'axios';

import moment from 'moment-jalaali';

import {
  mapState
} from 'vuex'

Vue.mixin({
  data() {
    return {
      token: null,
    }
  },
  created() {

    this.token = localStorage.getItem('token');
    if (!this.token) {
      this.$router.push({
        name: 'Login'
      });
    }

  },
  mounted() {

  },
  methods: {
    request(options) {
      // this.log('request through mixin');
      this.$store.commit('incrementOGR');
      let headers = {};

      if (!this.token) console.warn('user is not login');
      else headers["authorization"] = "JWT " + this.token;

      if (!options.method) {
        options.method = 'get';
      }
      return axios.request({
        headers: headers,
        url: options.url,
        method: options.method,
        data: options.data,
        params: options.params,
      })
        .then((res) => {
          this.$store.commit('decrementOGR');
          try {
            let data = res.data;
            if (data.token) {
              localStorage.setItem('token', data.token);
              this.token = data.token;
            }
            options.success(res.data);
          } catch (error) {
            console.error('Error in then: ', error);
          }
        })
        .catch((error) => {
          this.$store.commit('decrementOGR');
          this.log(error);
          if (!error.response) {
            this.warn('NO RESPONSE FROM SERVER');
            this.notify('خطا در برقراری ارتباط با سرور', 'danger');
            return;
          }
          if (error.response.status == 401) {
            if (this.$router.currentRoute.name == 'Login') return;
            this.notify('شما از سامانه خارج شده اید', 'warning');
            this.$router.push({
              name: "Login",
              params: {
                cb: this.$router.currentRoute.name,
                cbp: this.$router.currentRoute.params
              }
            });
            return;
          }
          if (error.response && error.response.status == 400) {
            let errors = error.response.data;
            Object.keys(errors).forEach(err => {
              this.notify(err + ': ' + errors[err], 'danger');
            });
          }
          options.error && options.error(error);
        });
    },
    initTooltips() {
      console.log('init tooltips');
      $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })
    },
    extractIds(data) {
      let res = this.copy(data);
      Object.keys(res).forEach(key => {
        if (res[key] && (typeof (res[key]) == 'object' && 'id' in res[key])) res[key] = res[key].id;
      });
      return res;
    },
    successNotify() {
      this.notify('عملیات با موفقیت انجام شد', 'success')
    },
    notify(msg, type) {
      $.notify({
        message: msg,
      }, {
          type: type,
          z_index: 2000,
        })
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
    endpoint(url) {
      // return "http://api.e7.mmdmst.ir/" + url;
      if (this.isDev)
        return "http://localhost:8000/" + url;
      // else return "http://api.sh.mmdmst.ir/" + url;
      else return "http://api." + window.location.hostname + "/" + url;
    },
    setToken(token) {
      localStorage.setItem('token', token);
      this.token = token;
    },
    modal(selector, func) {
      $(selector).modal(func);
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
    openSanad(sanadId) {
      let routeData = this.$router.resolve({
        name: "CreateSanad",
        params: {
          id: sanadId
        }
      });
      window.open(routeData.href, "_blank");
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
    print() {
      print();
    },
    removeNode(arr, node, by = 'id') {
      let index = _.findIndex(
        arr,
        o => o[by] == node[by]
      );
      arr.splice(index, 1);
    },
    replaceNode(arr, node, by = 'id') {
      let index = _.findIndex(
        arr,
        o => o[by] == node[by]
      );
      arr.splice(index, 1, node);
    },
    todayDate() {
      return moment().format('jYYYY/jMM/jDD');
    },
  },
  computed: {
    ...mapState({
      user: state => state.user,
      permissions: state => state.user.permissions,
      OGR: state => state.OGR
    }),
    isDev() {
      return process.env.NODE_ENV === 'development';
    },
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
