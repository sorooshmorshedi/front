<template>
  <div class="row rtl align-items-center justify-content-center" id="login">
    <div class="col-sm-4">
      <div class="card">
        <img class="card-img-top" src="/static/img/SobhanAccountingLogo.png" alt="Card image cap">
        <div class="card-body">
          <h4 class="card-title">حسابداری آنلاین سبحان</h4>
          <form>
            <div class="form-group">
              <label for="username">نام کاربری</label>
              <input
                type="text"
                class="form-control"
                name="username"
                id="username"
                aria-describedby="helpIdusername"
                placeholder="نام کاربری"
                v-model="username"
              >
            </div>
            <div class="form-group">
              <label for="password">رمز عبور</label>
              <input
                type="password"
                class="form-control"
                name="password"
                id="password"
                aria-describedby="helpIdpassword"
                placeholder="رمز عبور"
                v-model="password"
              >
            </div>
            <button
              @click.prevent="login()"
              type="submit"
              name="submit-btn"
              id="submit-btn"
              class="btn btn-primary"
              style="min-width:100px;"
            >ورود</button>
            <a
              name
              id
              class="secondary d-block d-sm-inline"
              href="#"
              role="button"
            >رمز عبور خود را فراموش کرده اید؟</a>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  created() {},
  methods: {
    login() {
      this.request({
        url: this.endpoint("login"),
        method: "post",
        data: {
          username: this.username,
          password: this.password
        },
        success: data => {
          this.setToken(data.token);
          let redirectUrl = this.query.redirectUrl;
          if (redirectUrl) {
            this.$router.push(redirectUrl);
          } else {
            this.$router.push({ name: "Home" });
          }
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
#login {
  margin-top: 15vh;
  height: 70vh;
  margin-bottom: 15vh;

  .card-img-top {
    width: 60%;
    margin: 0px auto;
  }
}
</style>
