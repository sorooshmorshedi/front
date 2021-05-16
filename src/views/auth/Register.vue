<template>
  <v-row class="d-flex justify-center mt-md-8">
    <v-col cols="12" sm="12" md="6">
      <v-card>
        <v-card-title>ثبت نام در سامانه حسابداری سبحان</v-card-title>

        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label=" * نام"
                  v-model="item.first_name"
                  :disabled="!isEditing"
                  :rules="rules.required"
                  :hide-details="false"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="* نام خانوادگی"
                  v-model="item.last_name"
                  :disabled="!isEditing"
                  :rules="rules.required"
                  :hide-details="false"
                />
              </v-col>

              <v-col cols="12" md="6">
                <m-phone-field label="* شماره موبایل " v-model="item.phone" :disabled="!isEditing" />
              </v-col>
              <v-col cols="12" md="6">
                <m-national-code label="* کد ملی " v-model="item.username" :disabled="!isEditing" />
              </v-col>
              <v-col cols="12" md="12" v-if="!item.id">
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
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="register" color="blue white--text w-100px">ثبت نام</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-dialog
      v-model="phoneVerificationDialog"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title>تایید شماره موبایل</v-card-title>
        <v-card-subtitle class="mt-n1">
          کد ارسال شده به شماره
          <span>{{ item.phone }}</span>
          را وارد کنید
        </v-card-subtitle>

        <v-card-text>
          <v-form>
            <v-text-field class="text-field-ltr" v-model="item.verificationCode" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="phoneVerificationDialog = false" text color="warning">تغییر شماره موبایل</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="sendVerificationCode(item.phone)" outlined color="blue">ارسال دوباره</v-btn>
          <v-btn @click="createUser" color="blue white--text w-100px">تایید</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";
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
  computed: {
  },
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
      this.sendVerificationCode(this.item.phone);
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