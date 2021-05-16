<template>
  <v-row class="d-flex justify-center mt-md-8">
    <v-col cols="12" sm="12" md="4">
      <v-card>
        <v-img
          class="white--text align-end"
          height="200px"
          contain
          src="/img/SobhanAccountingLogo.png"
        ></v-img>

        <v-card-text class="text--primary" @keyup.enter="login">
          <v-card-title class="d-block text-center">حسابداری آنلاین سبحان</v-card-title>

          <v-text-field
            class="mt-4 text-field-ltr"
            dense
            outlined
            hide-details
            label="نام کاربری"
            v-model="username"
          />
          <v-text-field
            dense
            type="password"
            class="mt-3 text-field-ltr"
            outlined
            hide-details
            label="رمز عبور"
            v-model="password"
          />

          <div class="d-flex justify-center mt-3">
            <vue-recaptcha
              sitekey="6Lda3sYaAAAAAKJ3kt1GnJWq5ennm3QIkz_NKNMs"
              @verify="response => recaptchaResponse = response"
            ></vue-recaptcha>
          </div>
        </v-card-text>

        <v-card-actions class="pb-3 flex-column flex-md-row">
          <v-btn text :to="{name: 'ForgetPassword'}">رمز عبور خود را فراموش کرده اید؟</v-btn>
          <v-spacer></v-spacer>
          <v-btn :to="{name: 'Register'}" outlined class="blue--text mr-2">ثبت نام</v-btn>
          <v-btn @click="login" class="blue white--text mr-2 w-100px">ورود</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import VueRecaptcha from "vue-recaptcha";
export default {
  name: "Login",
  components: { VueRecaptcha },
  data() {
    return {
      username: "",
      password: "",
      recaptchaResponse: "",
    };
  },
  mounted() {
    document.title = "ورود";
    if (this.token) {
      this.redirect();
    }
  },
  methods: {
    redirect() {
      let redirectUrl = this.urlQuery.redirectUrl;
      if (redirectUrl) {
        this.$router.push(redirectUrl);
      } else {
        this.$router.push({ name: "Home" });
      }
    },
    login() {
      this.request({
        url: this.endpoint("login"),
        method: "post",
        data: {
          username: this.username,
          password: this.password,
          recaptchaResponse: this.recaptchaResponse,
        },
        token: false,
        success: (data) => {
          this.setToken(data.token);
          this.redirect();
        },
      });
    },
  },
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
