<template>
  <div class="row rtl align-items-center justify-content-center" style="min-height:70vh">
    <div class="col-sm-4 card">
      <div class="card-body">
        <form>
          <div class="form-group">
            <label for="username">نام کاربری</label>
            <input type="text" class="form-control" name="username" id="username" aria-describedby="helpIdusername" placeholder="نام کاربری" v-model="username">
          </div>
          <div class="form-group">
            <label for="password">رمز عبور</label>
            <input type="password" class="form-control" name="password" id="password" aria-describedby="helpIdpassword" placeholder="رمز عبور" v-model="password">
          </div>
          <button @click.prevent="login()" type="submit" name="submit-btn" id="submit-btn" class="btn btn-primary " style="min-width:100px;">ورود</button>
          <a name="" id="" class="secondary d-block d-sm-inline" href="#" role="button">رمز عبور خود را فراموش کرده اید؟</a>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  props: ['cb'],
  data() {
    return {
      username: "",
      password: ""
    };
  },
  created(){
    !cb && (cb = 'Panel');
  },
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
          console.log("success");
          this.$router.push({
            name: this.cb
          });
        },
        error: error => {
          console.log("error", error);
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
#login {
  padding-bottom: 70px;
  margin-bottom: 0px;
  background-image: url("/static/img/login-background.jpg");
  background-position: bottom;
  background-size: cover;
}
</style>
