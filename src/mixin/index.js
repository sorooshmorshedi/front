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
  mounted() {
  },
  methods: {
    async request(options) {
      this.errors = [];
      this.OGR++;
      if (!this.token) {
        console.log("user isn't login");
      }

      if (!options.method) {
        options.method = 'get';
      }
      await axios.request({
          headers: {
            "authorization": "JWT " + this.token
          },
          url: options.url,
          method: options.method,
          data: options.data
        })
        .then((res) => {
          let data = res.data;
          if (data.token) {
            localStorage.setItem('token', data.token);
            this.token = data.token;
          }
          this.OGR--;
          options.success(res.data);
        })
        .catch((error) => {
          this.OGR--;
          options.error && options.error(error.response);
          let errors = error.response.data;
          Object.keys(errors).forEach(err => {
            $.notify({
              message: errors[err],
            },{
              type: 'danger'
            })
          })
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
      if (url[0] == "/") {
        url.splice(0, 1);
      }
      if (url[url.length - 1] == "/") {
        url.splice(url.length - 1, 1);
      }
      return "http://localhost:8000/" + url;
    },
    setToken(token) {
      localStorage.setItem('token', token);
      this.token = token;
    },
    modal(selector) {
      $(selector).modal('open');
    },
    copy(obj) {
      return JSON.parse(JSON.stringify(obj));
    },

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
    toJalali(date){
      return moment(date).format('jYYYY/jMM/jDD');
    }
  }
})