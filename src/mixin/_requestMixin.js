import axios from 'axios';
export default {
  methods: {

    endpoint(url) {
      // return "http://api.e7.mmdmst.ir/" + url;
      if (this.isDev)
        return "http://localhost:8001/" + url;
      // else return "http://api.sh.mmdmst.ir/" + url;
      else return "http://api." + window.location.hostname + "/" + url;
    },
    request(options) {

      this.$store.commit('incrementOGR');
      let headers = {
        'Confirmed': true
      };

      this.appendToken(headers);

      if (!options.method) {
        options.method = 'get';
      }

      axios.request({
          headers: headers,
          url: options.url,
          method: options.method,
          data: options.data,
          params: options.params,
        })
        .then((res) => {
          this.$store.commit('decrementOGR');
          let data = res.data;
          if (data.token) {
            this.setToken();
          }

          options.success(res.data);
        })
        .catch((error) => {
          this.$store.commit('decrementOGR');
          if (error.response) {
            let statusCode = error.response.status
            if (statusCode == 401) this.handle_401(error);
            else if (statusCode == 400) this.handle_400(error);
            else if (statusCode == 406) this.handle_406(error, options);
            options.error && options.error(error);
          } else {
            this.handle_noResponse(error);
          }
        });
    },
    appendToken(headers) {
      if (!this.token) {
        console.warn('user is not login');
      } else {
        headers["authorization"] = "JWT " + this.token;
      }
    },
    handle_401(error) {
      if (this.$router.currentRoute.name == 'Login') return;
      this.notify('شما از سامانه خارج شده اید', 'warning');
      this.$router.push({
        name: "Login",
        params: {
          cb: this.$router.currentRoute.name,
          cbp: this.$router.currentRoute.params
        }
      });
    },
    handle_400(error) {
      let errors = error.response.data;
      Object.keys(errors).forEach(err => {
        this.notify(err + ': ' + errors[err], 'danger');
      });
    },
    handle_406(error, options) {
      let confirmations = error.response.data;

      for (const text of confirmations) {
        if (!confirm(text)) return;
      }
      if (options.data) options.data._confirmed = true;
      else options.data = {
        _confirmed: true
      }
      this.request(options);
    },
    handle_noResponse(error) {
      console.warn('NO RESPONSE FROM SERVER');
      this.notify('خطا در برقراری ارتباط با سرور', 'danger');
      return;

    }

  }

}
