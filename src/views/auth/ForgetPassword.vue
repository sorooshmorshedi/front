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

        <v-card-title class="d-block text-center">فراموشی رمز عبور</v-card-title>

        <v-card-text class="text--primary">
          <v-row class="mt-2">
            <v-col cols="12" md="12">
              <v-text-field class="ltr" label="شماره موبایل" v-model="phone" :disabled="codeSent" />
            </v-col>
            <template v-if="codeSent">
              <v-col cols="12" md="4">
                <v-text-field class="ltr" label="کد دریافت شده" v-model="code" />
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  class="ltr"
                  type="password"
                  label="رمز عبور جدید"
                  v-model="newPassword"
                />
              </v-col>
            </template>
          </v-row>
        </v-card-text>

        <v-card-actions class>
          <template v-if="!codeSent">
            <v-spacer></v-spacer>
            <v-btn @click="sendVerificationCode" class="blue white--text w-100px">ارسال کد تایید</v-btn>
          </template>
          <template v-else>
            <v-btn @click="sendVerificationCode" text>ارسال دوباره کد</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="changePassword" class="green white--text">ثبت رمز عبور جدید</v-btn>
          </template>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      phone: "",
      code: "",
      newPassword: "",
      codeSent: false
    };
  },
  created() {},
  methods: {
    sendVerificationCode() {
      this.request({
        url: this.endpoint("users/sendVerificationCodeForForgetPassword"),
        method: "post",
        data: {
          phone: this.phone
        },
        token: false,
        success: data => {
          this.codeSent = true;
        }
      });
    },
    changePassword() {
      this.request({
        url: this.endpoint("users/changePasswordByVerificationCode"),
        method: "post",
        data: {
          phone: this.phone,
          code: this.code,
          new_password: this.newPassword
        },
        token: false,
        success: data => {
          this.successNotify();
          this.$router.push({ name: "Login" });
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
