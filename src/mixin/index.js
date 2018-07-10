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
      errors: [],
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
  mounted() {},
  methods: {
    request(options) {
      // this.log('request through mixin');
      this.errors = [];
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
          data: options.data
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
            $.notify({
              message: err + ': ' + errors[err],
            }, {
              type: 'danger'
            })
          })
        })
    },
    notify(msg, type) {
      $.notify({
        message: msg,
      }, {
        type: type,
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
      if (url[0] == "/" || url[url.length - 1] == "/") {
        // throw "Bad URL";
      }
      return "http://localhost:8000/" + url;
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
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      permissions: state => state.user.permissions,
    }),
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
    }
  }
})
