import Vue from 'vue';
import axios from 'axios';

import moment from 'moment-jalaali';

import {
  mapState
} from 'vuex'

Vue.mixin({
  data() {
    return {
      OGR: 0, //on going requests
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
      this.OGR++;
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
          // console.log('success');
          let data = res.data;
          if (data.token) {
            localStorage.setItem('token', data.token);
            this.token = data.token;
          }
          this.OGR--;
          options.success(res.data);
        })
        .catch((error) => {
          if (!error.response) {
            console.warn('NO RESPONSE FROM SERVER');
            // console.warn('Call Success any way');
            // options.success();
            return;
          }
          if (this.OGR == 0) {
            console.warn('OGR IS ZERO');
            return;
          }
          this.OGR--;
          if (error.response.status == 401) {
            if (this.$router.currentRoute.name == 'Login') return;
            this.notify('شما از سامانه خارج شده اید', 'warning');
            this.$router.push({
              name: "Login",
              params: {
                cb: this.$router.currentRoute.name
              }
            });
            return;
          }
          options.error && options.error(error.response);
          let errors = error.response.data;
          Object.keys(errors).forEach(err => {
            this.notify(err + ': ' + errors[err], 'danger');
          });
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
        if (res[key] && res[key].id) res[key] = res[key].id;
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
      if (this.isDev)
        return "http://localhost:8000/" + url;
      // else return "http://api.sh.mmdmst.ir/" + url;
      else return "http://mmdmst.ir:8080/" + url;
    },
    setToken(token) {
      localStorage.setItem('token', token);
      this.token = token;
    },
    modal(selector, func) {
      $(selector).modal(func);
    },
    copy(obj) {
      // return JSON.parse(JSON.stringify(obj));
      let res = null;
      if (Array.isArray(obj)) {
        res = obj.slice();
      } else {
        res = Object.assign({}, obj);
      }
      return res;
      // console.log('copy result: ', res);
    },
    log(t) {
      console.log(t);
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
      for (let i = 0; i < len; i++) {
        if (i && i % 3 == 0) {
          res.push(',');
        }
        res.push(m[i]);
      }
      return res.reverse().join('');

    },
    print(){
      print();
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      permissions: state => state.user.permissions,
    }),
    isDev() {
      return process.env.NODE_ENV === 'development';
    },
  },
  watch: {
    OGR() {
      if (this.OGR > 0) {
        $('#loading').addClass('show');
      } else {
        $('#loading').removeClass('show');
      }
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
      for (let i = 0; i < len; i++) {
        if (i && i % 3 == 0) {
          res.push(',');
        }
        res.push(m[i]);
      }
      return res.reverse().join('');
    },
  }
})
