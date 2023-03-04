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
              <v-btn :to="{name: 'Login'}" :style="{'color' : '#100C0C' }" color="white" block large depressed
                     class="rounded-lg mr-2"> ورود
              </v-btn>
            </v-col>
            <v-col cols="12" md="6">
              <v-btn color="#002357" block large depressed class="rounded-lg white--text"> فراموشی کلمه عبور</v-btn>
            </v-col>
          </v-row>
        </v-card>
        <v-form ref="profileForm">
          <v-row class="mr-2 ml-2">
            <v-col cols="12" md="12" class="mt-10">
              <v-text-field
                  label="نام کاربری"
                  v-model="username"
                  :disabled="codeSent"
                  class="text-field-ltr rounded-lg"
                  :rules="rules.required"
                  :hide-details="false"
              />
            </v-col>
            <v-col cols="12" md="12">
              <m-phone-field
                  class="rounded-lg"
                  label="شماره موبایل"
                  v-model="phone"
                  :disabled="codeSent"
                  :rules="rules.required"
              />
            </v-col>
          </v-row>
        </v-form>
        <v-form ref="verifyForm">
          <v-row class="mr-4 ml-4 mt-5">
            <template v-if="codeSent">
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field
                      class="text-field-ltr rounded-lg"
                      label="کد دریافت شده"
                      v-model="code"
                      :rules="rules.required"
                  />
                </v-col>
                <v-col cols="12" md="12" class="mt-5">
                  <v-text-field
                      class="text-field-ltr rounded-lg"
                      type="password"
                      label="کلمه عبور جدید"
                      v-model="newPassword"
                      :rules="passwordRules"
                      :hide-details="false"
                  />
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field
                      class="text-field-ltr rounded-lg"
                      type="password"
                      label="تکرار کلمه عبور جدید"
                      v-model="newPasswordRepeat"
                      :rules="rules.required"
                      :hide-details="false"
                  />
                </v-col>
              </v-row>
            </template>
          </v-row>
        </v-form>
        <v-card-actions class="pb-3 flex-row flex-md-row">
          <v-row v-if="!codeSent" class="mr-2 ml-2 ">
            <v-btn @click="sendCode" depressed block color="#FF8700" class="white--text mt-5 rounded-lg" large>ارسال
              کد تایید
            </v-btn>
          </v-row>
          <v-row v-if="codeSent" class=" ">
          <v-col cols="12" md="6">
          <v-btn  @click="sendVerificationCode({phone, username, recaptchaResponse})"
                 depressed block color="success" class="white--text mt-5 rounded-lg mr-2" large>ارسال دوباره کد
          </v-btn>
          </v-col>
            <v-col cols="12" md="6">
              <v-btn @click="changePassword" depressed block color="#FF8700" class="white--text mt-5 rounded-lg ml-2" large>تغییر رمز عبور</v-btn>

            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>


<script>
import AuthMixin from "@/views/auth/mixin";
import {MFormMixin} from "@/components/m-form";

export default {
  name: "Login",
  mixins: [AuthMixin, MFormMixin],
  data() {
    return {
      phone: "",
      username: "",
      code: "",
      newPassword: "",
      newPasswordRepeat: "",
      codeSent: false,
    };
  },
  created() {
  },
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
            this.$router.push({name: "Login"});
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
