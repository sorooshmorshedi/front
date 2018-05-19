<template>
  <div class="row rtl align-items-center justify-content-center" style="min-height:70vh">
    <div class="col-sm-4 card">
      <div class="card-body">
  
        <div class="form-group">
          <label for="username">نام کاربری</label>
          <input type="text" class="form-control" name="username" id="username" aria-describedby="helpIdusername" placeholder="نام کاربری">
          <small id="helpIdusername" class="form-text text-muted">نام کاربری خود را وارد کنید</small>
        </div>
        <div class="form-group">
          <label for="password">رمز عبور</label>
          <input type="password" class="form-control" name="password" id="password" aria-describedby="helpIdpassword" placeholder="رمز عبور">
          <small id="helpIdpassword" class="form-text text-muted">پسورد خود را وارد کنید</small>
        </div>
        <button @click="login()" type="button" name="submit-btn" id="submit-btn" class="btn btn-primary " style="min-width:100px;">ورود</button>
        <a name="" id="" class="secondary d-block d-sm-inline" href="#" role="button">رمز عبور خود را فراموش کرده اید؟</a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      return {}
    },
    methods: {
      login() {
        this.$router.push({
          name: 'Panel'
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  #login {
    padding-bottom: 70px;
    margin-bottom: 0px;
    background-image: url('/static/img/login-background.jpg');
    background-position: bottom;
    background-size: cover;
  }
</style>
