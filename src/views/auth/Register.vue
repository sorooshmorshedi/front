<template>
  <v-row class="d-flex justify-center mt-md-8">
    <v-col cols="12" sm="12" md="6">
      <v-card>
        <v-card-title>ثبت نام در سامانه حسابداری سبحان</v-card-title>

        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field label=" * نام" v-model="item.first_name" :disabled="!isEditing" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="* نام خانوادگی"
                  v-model="item.last_name"
                  :disabled="!isEditing"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  class="text-field-ltr"
                  type="number"
                  label="* شماره موبایل "
                  v-model="item.phone"
                  required
                  :disabled="!isEditing"
                />
              </v-col>
              <v-col cols="12" md="6">
                <label></label>
                <v-text-field
                  class="text-field-ltr"
                  type="number"
                  label="* کد ملی "
                  v-model="item.username"
                  :rules="usernameRules"
                  :disabled="!isEditing"
                  :hide-details="false"
                />
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
      persistent
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
    };
  },
  computed: {
    passwordRules() {
      return [
        (value) =>
          /(?=.{8,})/.test(value) ||
          "طول کلمه عبور باید بیشتر از 8 کاراکتر باشد",
        (value) => /(?=.*[0-9])/.test(value) || "حداقل از یک عدد استفاده کنید",
        (value) =>
          /(?=.*[!@#$%^&*])/.test(value) ||
          "حداقل از یکی از کاراکتر های ! @ # $ % ^ & * استفاده کنید",
        (value) =>
          /(?=.*[A-Z])/.test(value) || "حداقل از یک حرف بزرگ استفاده کنید",
      ];
    },
    usernameRules() {
      function isValidIranianNationalCode(input) {
        if (!/^\d{10}$/.test(input)) return false;
        const check = +input[9];
        const sum =
          Array.from({ length: 9 })
            .map((_, i) => +input[i] * (10 - i))
            .reduce((x, y) => x + y) % 11;
        return sum < 2 ? check == sum : check + sum == 11;
      }

      return [
        (value) => {
          return isValidIranianNationalCode(value) || "کد ملی صحیح نمی باشد";
        },
      ];
    },
  },
  methods: {
    register() {
      if (true || this.$refs.form.validate()) {
        this.verifyPhone();
      }
    },
    verifyPhone() {
      this.sendVerificationCode();
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
          this.$router.push({ name: "Home" });
        },
      });
    },
  },
};
</script>