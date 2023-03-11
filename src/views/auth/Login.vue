<template>
  <v-row class="mt-md-8">
    <v-col
        cols="12"
        md="4"
        class="d-flex order-1 order-md-0 flex-row flex-md-column justify-space-around justify-md-center align-right pr-8"
    >
    </v-col>
    <v-col cols="12" md="4" class="pt-0">
      <v-img
          class="white--text align-end"
          height="92"
          contain
          src="/img/loginLogo.png"
      ></v-img>
      <v-card :style="{border: 'white'}" class="elevation-1 mt-8 rounded-lg pa-5">
        <v-card :style="{border: 'white'}" class="elevation-1 ma-5 rounded-lg">
          <v-row class="pl-3">
            <v-col cols="12" md="6">
              <v-btn color="#002357" block large depressed class="mr-3 rounded-lg white--text"> ورود</v-btn>
            </v-col>
            <v-col cols="12" md="6">
              <v-btn :to="{name: 'Register'}" :style="{'color' : '#100C0C'}" color="white" block large depressed
                     class="rounded-lg"> ثبت نام
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
        <v-card-text class="text--primary" @keyup.enter="login">
          <v-text-field
              class="mt-7 text-field-ltr rounded-lg"
              dense
              hide-details
              background-color="white"
              label="نام کاربری"
              v-model="username"
          />
          <v-text-field
              dense
              type="password"
              background-color="white"
              class="mt-8 text-field-ltr rounded-lg"
              outlined
              hide-details
              label="رمز عبور"
              v-model="password"
          />

        </v-card-text>
        <v-btn class="mt-3" color="#697480" text :to="{name: 'ForgetPassword'}">رمز عبور خود را فراموش کرده اید؟</v-btn>

        <v-card-actions class="pb-3 flex-row flex-md-row">

          <v-btn @click="login" depressed block color="#FF8700" class="white--text mt-5" large>ورود</v-btn>
        </v-card-actions>
      </v-card>
      <v-row class="mt-16 d-flex justify-center">
        <v-col cols="12" md="1" class="mt-1 d-flex justify-center">
          <v-tooltip bottom color="primary">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  depressed
                  :target="(isXs || isSm)?'_blank':null"
                  :href="(isXs || isSm)?'tel:07191002510':null"
                  fab
                  color="primary white--text"
                  width="37"
                  height="37"
                  class="mt-md-3"
                  v-bind="!(isXs || isSm)?attrs:{}"
                  v-on="!(isXs || isSm)?on:{}"
              >
                <v-icon>fa-phone</v-icon>
              </v-btn>
            </template>
            <span dir="ltr">071 - 9100 25 10</span>
          </v-tooltip>
        </v-col>

        <v-col cols="12" md="1" class="mt-1 d-flex justify-center">
          <v-tooltip top color="secondary">
            <template v-slot:activator="{ on, attrs }">
              <a href="https://sobhan.net" target="_blank">
                <v-img
                    v-bind="attrs"
                    v-on="on"
                    class="mt-3 "
                    style="border-radius: 30%"
                    contain
                    max-height="39"
                    max-width="39"
                    src="/img/icons/logo.svg"
                />
              </a>
            </template>
            سایت حسابداری سبحان
          </v-tooltip>
        </v-col>
        <v-col cols="12" md="1" class="mt-1  d-flex justify-center ">
          <v-tooltip bottom color="success">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  depressed
                  v-bind="attrs"
                  class="mt-3"
                  v-on="on"
                  target="_blank"
                  href="https://ble.ir/sobhan_finance"
                  fab
                  color="success white--text"
              >
                <v-img
                    max-height="25"
                    max-width="25"
                    src="/img/icons/bale.svg"
                />
              </v-btn>
            </template>
            پیام رسان بــلـه سبحان
          </v-tooltip>
        </v-col>
        <v-col cols="12" md="1" class="mt-1 d-flex justify-center">
          <v-tooltip top color="primary">
            <template v-slot:activator="{ on, attrs }">
              <a href="https://eitaa.com/sobhan_finance" target="_blank">
                <v-img
                    v-bind="attrs"
                    v-on="on"
                    class="mt-3 "
                    style="border-radius: 30%"
                    contain
                    max-height="39"
                    max-width="39"
                    src="/img/eitaa.png"
                />
              </a>
            </template>
            پیام رسان ایـتا سبحان
          </v-tooltip>
        </v-col>
        <v-col cols="12" md="1" class="mt-1 d-flex justify-center">
          <v-tooltip bottom color="#019EF6">
            <template v-slot:activator="{ on, attrs }">
              <a href="https://www.t.me/sobhan_finance" target="_blank">
                <v-img
                    v-bind="attrs"
                    v-on="on"
                    class="mt-3 "
                    style="border-radius: 30%"
                    contain
                    max-height="39"
                    max-width="39"
                    src="/img/tel.png"
                />
              </a>
            </template>
            کانال تـلگرام سبحان
          </v-tooltip>

        </v-col>
        <v-col cols="12" md="1" class="mt-1 d-flex justify-center">
          <v-tooltip top color="error">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  depressed
                  v-bind="attrs"
                  class="mt-3 "
                  v-on="on"
                  target="_blank"
                  href="https://www.instagram.com/sobhan_finance/"
                  fab
                  color="error white--text"
              >
                <v-icon>fab fa-instagram</v-icon>
              </v-btn>
            </template>
            اینـستاگرام سبحان
          </v-tooltip>

        </v-col>
      </v-row>
    </v-col>

    <v-dialog
        v-model="twoFactorAuthenticationDialog"
        max-width="400px"
        transition="dialog-transition"
    >
      <v-card class="rounded-lg pa-5">
        <v-card-title :style="{'color': '#002357'}">کد ورود دو عاملی را وارد کنید</v-card-title>
        <v-card-text class="mt-5">
          <v-text-field class="rounded-lg text-field-ltr" v-model="twoFactorAuthenticationCode"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
              @click="login"
              depressed
              block
              color="#FF8700"
              class="white--text mt-5"
              large
          >تایید
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import AuthMixin from "@/views/auth/mixin";

export default {
  name: "Login",
  mixins: [AuthMixin],
  data() {
    return {
      username: "",
      password: "",

      twoFactorAuthenticationDialog: "",
      twoFactorAuthenticationCode: "",
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
        this.$router.push({name: "Home"});
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
          code: this.twoFactorAuthenticationCode,
        },
        token: false,
        success: (data) => {
          if (data.need_two_factor_authentication) {
            this.twoFactorAuthenticationDialog = true;
          } else {
            this.twoFactorAuthenticationDialog = false;
            this.setToken(data.token);
            this.redirect();
          }
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
