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

        <v-card-title class="d-block text-center">فراموشی کلمه عبور</v-card-title>

        <v-card-text class="text--primary mb-2">
          <v-form ref="profileForm">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="نام کاربری"
                  v-model="username"
                  :disabled="codeSent"
                  class="text-field-ltr"
                  :rules="rules.required"
                  :hide-details="false"
                />
              </v-col>
              <v-col cols="12" md="6">
                <m-phone-field
                  label="شماره موبایل"
                  v-model="phone"
                  :disabled="codeSent"
                  :rules="rules.required"
                />
              </v-col>
            </v-row>
          </v-form>
          <v-form ref="verifyForm">
            <v-row>
              <template v-if="codeSent">
                <v-col cols="12" md="12">
                  <v-text-field
                    class="text-field-ltr"
                    label="کد دریافت شده"
                    v-model="code"
                    :rules="rules.required"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    class="text-field-ltr"
                    type="password"
                    label="کلمه عبور جدید"
                    v-model="newPassword"
                    :rules="passwordRules"
                    :hide-details="false"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    class="text-field-ltr"
                    type="password"
                    label="تکرار کلمه عبور جدید"
                    v-model="newPasswordRepeat"
                    :rules="rules.required"
                    :hide-details="false"
                  />
                </v-col>
              </template>
            </v-row>
          </v-form>
          <v-row>
            <v-col cols="12">
              <div class="d-flex justify-center mt-0">
                <vue-recaptcha
                  ref="recaptcha"
                  sitekey="6Lda3sYaAAAAAKJ3kt1GnJWq5ennm3QIkz_NKNMs"
                  @verify="response => recaptchaResponse = response"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class>
          <template v-if="!codeSent">
            <v-spacer></v-spacer>
            <v-btn @click="sendCode" class="blue white--text w-100px">ارسال کد تایید</v-btn>
          </template>
          <template v-else>
            <v-btn
              @click="sendVerificationCode({phone, username, recaptchaResponse})"
              text
            >ارسال دوباره کد</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="changePassword" class="green white--text">ثبت کلمه عبور جدید</v-btn>
          </template>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import AuthMixin from "@/views/auth/mixin";
import { MFormMixin } from "@/components/m-form";

export default {
  name: "Login",
  mixins: [AuthMixin, MFormMixin],
  data() {
    return {
      phone: "09307468674",
      username: "2540118755",
      code: "",
      newPassword: "Mmd2Sobhan!",
      newPasswordRepeat: "Mmd2Sobhan!",
      codeSent: false,
    };
  },
  created() {},
  methods: {
    sendCode() {
      if (this.$refs.profileForm.validate()) {
        this.sendVerificationCode(
          {
            phone: this.phone,
            username: this.username,
            recaptchaResponse: this.recaptchaResponse,
          },
          () => (this.codeSent = true)
        );
      }
    },
    changePassword() {
      if (this.$refs.verifyForm.validate()) {
        if (this.newPassword != this.newPasswordRepeat) {
          this.notify("کلمه عبور و تکرار آن یکسان نیستند", "danger");
          return;
        }
        this.request({
          url: this.endpoint("users/changePasswordByVerificationCode"),
          method: "post",
          data: {
            username: this.username,
            phone: this.phone,
            code: this.code,
            new_password: this.newPassword,
            recaptchaResponse: this.recaptchaResponse,
          },
          token: false,
          success: (data) => {
            this.successNotify();
            this.$router.push({ name: "Login" });
          },
          error: (error) => {
            this.$refs.recaptcha.reset();
            this.handleError(error, {});
          },
        });
      }
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
