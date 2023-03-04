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
      <v-card :style="{border: 'white'}"  class="elevation-1 mt-8 rounded-lg pa-5" >
        <v-card :style="{border: 'white'}" class="elevation-1 ma-5 rounded-lg" >
          <v-row class="pl-3">
            <v-col cols="12" md="6">
              <v-btn :to="{name: 'Login'}" :style="{'color' : '#100C0C' }" color="white" block large depressed class="rounded-lg mr-2"> ورود </v-btn>
            </v-col>
            <v-col cols="12" md="6">
              <v-btn color="#002357"   block large depressed class="rounded-lg white--text"> ثبت نام </v-btn>
            </v-col>
          </v-row>
        </v-card>
        <v-form ref="form">
          <v-row class="ml-2 mr-2">
            <v-col cols="12" md="12">
              <v-text-field
                  class="mt-10"
                  label=" * نام"
                  v-model="item.first_name"
                  :disabled="!isEditing"
                  :rules="rules.required"
                  :hide-details="false"
              />
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field
                  label="* نام خانوادگی"
                  v-model="item.last_name"
                  :disabled="!isEditing"
                  :rules="rules.required"
                  :hide-details="false"
              />
            </v-col>

            <v-col cols="12" md="12">
              <m-phone-field label="* شماره موبایل " v-model="item.phone" :disabled="!isEditing" />
            </v-col>
            <v-col cols="12" md="12">
              <m-national-code
                  label="* کد ملی "
                  v-model="item.username"
                  :disabled="!isEditing"
                  class="text-field_ltr"
              />
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field
                  class="text-field-ltr"
                  label=" * کلمه عبور"
                  type="password"
                  v-model="item.password"
                  :disabled="!isEditing"
                  :rules="passwordRules"
                  :hide-details="false"
              />
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field
                  class="text-field-ltr"
                  label=" * تکرار کلمه عبور"
                  type="password"
                  v-model="item.passwordRepeat"
                  :disabled="!isEditing"
                  :rules="rules.required"
                  :hide-details="false"
              />
            </v-col>
          </v-row>
        </v-form>

        <v-card-actions class="pb-3 flex-row flex-md-row">

          <v-btn @click="register" depressed block color="#FF8700" class="white--text mt-5" large>ثبت نام</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-dialog v-model="phoneVerificationDialog" max-width="500px" transition="dialog-transition">
      <v-card class="rounded-lg pa-5">
        <v-card-title :style="{'color': '#002357'}" >تایید شماره موبایل</v-card-title>
        <v-card-subtitle class="mt-n1">
          کد ارسال شده به شماره
          <span>{{ item.phone }}</span>
          را وارد کنید
        </v-card-subtitle>

        <v-card-text>
          <v-form>
            <v-text-field class="rounded-lg text-field-ltr" v-model="item.verificationCode" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="phoneVerificationDialog = false" text color="primary">تغییر شماره موبایل</v-btn>
          <v-spacer></v-spacer>
          <v-btn
              @click="sendVerificationCode({phone: item.phone, recaptchaResponse})"
              outlined
              color="#002357"
          >ارسال دوباره</v-btn>
          <v-btn @click="createUser" depressed  color="#FF8700" class="white--text ">تایید</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-row>
</template>

<script>
import { MFormMixin } from "@/components/m-form";
import UserApi from "@/views/panel/user/api";
import AuthMixin from "@/views/auth/mixin";

export default {
  name: "Register",
  mixins: [AuthMixin, MFormMixin, UserApi],
  props: {},
  data() {
    return {
      item: {},
      phoneVerificationDialog: false,
      requiredRule: [
        (value) =>
          !["", null, undefined].includes(value) || "این فیلد اجباری می باشد",
      ],
    };
  },
  computed: {},
  methods: {
    getItemTemplate() {
      return {};
    },
    register() {
      if (this.$refs.form.validate()) {
        this.verifyPhone();
      }
    },
    verifyPhone() {
      if (this.item.password != this.item.passwordRepeat) {
        this.notify("کلمه عبور و تکرار آن یکسان نیستند", "danger");
        return;
      }
      this.sendVerificationCode({
        phone: this.item.phone,
        recaptchaResponse: this.recaptchaResponse,
      });
      this.phoneVerificationDialog = true;
    },
    createUser() {
      this.request({
        url: this.endpoint(`users/create`),
        method: "post",
        data: this.item,
        success: (data) => {
          this.successNotify();
          this.setToken(data.token);
          this.$router.push({ name: "Profile" });
        },
      });
    },
  },
};
</script>