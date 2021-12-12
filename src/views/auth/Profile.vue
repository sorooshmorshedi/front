<template>
  <v-row class="d-flex justify-center">
    <v-col cols="12">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>تنظیمات کاربری</v-toolbar-title>
        </v-toolbar>
        <v-tabs vertical v-model="openTab">
          <v-tab>
            <v-icon class="ml-4">fa-user</v-icon>
            <span>مشخصات کاربری</span>
          </v-tab>
          <v-tab>
            <v-icon class="ml-4">fa-key</v-icon>
            <span>تغییر کلمه عبور</span>
          </v-tab>
          <v-tab>
            <v-icon class="ml-4">fa-envelope-open-text</v-icon>
            <span>لیست دعوت ها</span>
          </v-tab>
          <v-tab @click="getSecretKey">
            <v-icon class="ml-4">fa-shield-alt</v-icon>
            <span class>ورود دوعاملی</span>
          </v-tab>

          <v-tab-item>
            <v-card flat>
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
                      <m-phone-field
                        label="* شماره موبایل "
                        v-model="item.phone"
                        :disabled="true"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <m-national-code
                        label="* کد ملی "
                        v-model="item.username"
                        :disabled="true"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  @click="openChangePhoneDialog"
                  color="light-blue white--text"
                  >تغییر شماره موبایل</v-btn
                >
                <template v-if="!isEditing">
                  <v-btn @click="isEditing = true" class="amber w-100px"
                    >ویرایش</v-btn
                  >
                </template>
                <template v-else>
                  <v-btn @click="updateProfile" color="blue white--text w-100px"
                    >ثبت</v-btn
                  >
                </template>
              </v-card-actions>
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-form ref="changePasswordForm">
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-text-field
                        class="text-field-ltr"
                        label=" * کلمه عبور فعلی"
                        type="password"
                        v-model="oldPassword"
                        :rules="rules.required"
                        :hide-details="false"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        class="text-field-ltr"
                        label=" * کلمه عبور جدید"
                        type="password"
                        v-model="newPassword"
                        :rules="passwordRules"
                        :hide-details="false"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        class="text-field-ltr"
                        type="password"
                        label=" * تکرار کلمه عبور جدید"
                        v-model="newPasswordRepeat"
                        :rules="rules.required"
                        :hide-details="false"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="changePassword" color="blue white--text w-100px"
                  >ثبت</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <m-datatable
                  :headers="invitationsHeaders"
                  :items="invitations"
                  :showExportBtns="false"
                >
                  <template #item.action="{ item }">
                    <template v-if="item.status == 'p'">
                      <v-btn
                        @click="confirmInvitation(item)"
                        color="green white--text"
                        >تایید دعوت</v-btn
                      >
                      <v-btn
                        @click="changeInvitationStatus(item, 'r')"
                        color="red white--text mr-1"
                        >رد دعوت</v-btn
                      >
                    </template>
                    <span v-else>-</span>
                  </template>
                </m-datatable>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="8">
                    <p>
                      توسط ورود دوعاملی امنیت داده های خود را در سامانه حسابداری
                      سبحان چند برابر کنید
                    </p>
                    <p>
                      با فعال سازی ورود دو عاملی هنگام ورود به سامانه علاوه بر
                      نام کاربری و کلمه عبور باید کد تایید نیز وارد نمایید
                    </p>
                    <p>کد تایید هر 30 ثاینه یک بار عوض می شود</p>
                    <p>برای فعال سازی مراحل زیر را طی کنید:</p>
                    <ul
                      class="mr-4 mb-2"
                      v-if="!user.has_two_factor_authentication"
                    >
                      <li>
                        نرم افزار Google Authenticator را دانلود و نصب نمایید
                      </li>
                      <li>
                        کد رو به رو را در نرم افزار Google Authenticator اسکن
                        کنید
                      </li>
                      <li>
                        کد تولید شده توسط نرم افزار را وارد کنید و روی دکمه
                        تایید کلید نمایید
                      </li>
                    </ul>
                    <v-btn
                      color="red white--text"
                      v-if="user.has_two_factor_authentication"
                      @click="removeSecretKeyDialog = true"
                      >غیر فعال سازی ورود دو عاملی</v-btn
                    >
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-row
                      class
                      no-gutters
                      v-if="
                        secretKey.qr_code && !user.has_two_factor_authentication
                      "
                    >
                      <v-col class="d-flex justify-center">
                        <vue-qrcode
                          :value="secretKey.qr_code"
                          :options="{ width: 300 }"
                        ></vue-qrcode>
                      </v-col>
                      <v-col cols="12" md="8" offset-md="1">
                        <v-text-field
                          label="کد تایید"
                          class="text-field-ltr"
                          v-model="secretKey.code"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="2">
                        <v-btn
                          @click="setSecretKey"
                          block
                          class="mt-3 mt-md-1 mr-md-2"
                          color="blue white--text"
                          >تایید</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-col>
    <v-dialog
      v-model="removeSecretKeyDialog"
      max-width="400px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title>غیر فعال سازی ورود دو عاملی</v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <p>برای غیر فعال سازی ورود دو عاملی کد تایید را وارد کنید</p>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="کد تایید"
                class="text-field-ltr"
                v-model="secretKey.code"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" offset-md="3">
              <v-btn
                @click="removeSecretKey"
                block
                class="mt-3 mt-md-1 mr-md-2"
                color="red white--text"
                >غیر فعال سازی</v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="confirmInvitationDialog"
      scrollable
      max-width="400px"
      transition="dialog-transition"
    >
      <v-card v-if="invitation">
        <v-card-title>تایید دعوت</v-card-title>
        <v-card-subtitle class="mt-0">
          لطفا کد تاییدی که از شرکت
          <span>{{ invitation.company_name }}</span>
          دریافت کرده اید را وارد کنید
        </v-card-subtitle>

        <v-card-text>
          <v-text-field
            class="text-field-ltr"
            label="کد تایید دریافتی"
            v-model="confirmationCode"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="changeInvitationStatus(invitation, 'a', confirmationCode)"
            block
            color="blue white--text "
            >تایید</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="changePhoneDialog"
      scrollable
      max-width="400px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title>تغییر شماره موبایل</v-card-title>

        <v-card-text>
          <v-form ref="changePhoneForm">
            <v-row>
              <v-col cols="12" md="8">
                <m-phone-field label="* شماره موبایل جدید" v-model="newPhone" />
              </v-col>
              <v-col cols="12" md="4">
                <v-btn
                  block
                  color="blue white--text"
                  class="mt-1"
                  :disabled="codeSent"
                  @click="sendCode"
                >
                  ارسال کد
                </v-btn>
              </v-col>
              <v-col cols="12" v-if="codeSent">
                <v-text-field
                  class="text-field-ltr"
                  label="کد تایید دریافتی"
                  v-model="phoneVerificationCode"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions v-if="codeSent">
          <v-btn
            @click="sendVerificationCode({ newPhone, user: user.username })"
            text
            >ارسال دوباره کد</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn @click="changePhone" color="blue white--text w-100px"
            >تایید</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { MFormMixin } from "@/components/m-form";
import UserApi from "@/views/panel/user/api";
import GetUserApi from "@/views/panel/user/getUserApi";
import AuthMixin from "@/views/auth/mixin";
import MDatatable from "@/components/m-datatable";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import Template from "../Template.vue";

export default {
  components: { MDatatable, VueQrcode, Template },
  name: "Register",
  mixins: [AuthMixin, MFormMixin, UserApi, GetUserApi],
  props: {},
  data() {
    return {
      isEditing: false,
      openTab: 0,

      oldPassword: null,
      newPassword: null,
      newPasswordRepeat: null,

      invitations: [],
      invitation: null,
      confirmInvitationDialog: false,
      confirmationCode: null,

      secretKey: {},
      removeSecretKeyDialog: false,

      changePhoneDialog: false,
      newPhone: "",
      phoneVerificationCode: null,
      codeSent: false,
    };
  },
  computed: {
    invitationsHeaders() {
      return [
        {
          text: "شرکت",
          value: "company_name",
        },
        {
          text: "وضعیت",
          value: "status",
          type: "select",
          items: this.UserInvitationStatuses,
        },
        {
          text: "",
          value: "action",
          filterable: false,
          sortable: false,
        },
      ];
    },
  },
  mounted() {
    this.getInvitations();
    this.setItem(this.user);
  },
  methods: {
    sendCode() {
      if (this.$refs.changePhoneForm.validate()) {
        this.sendVerificationCode(
          {
            phone: this.newPhone,
            username: this.user.uesrname,
          },
          () => (this.codeSent = true)
        );
      }
    },
    changePhone() {
      if (this.$refs.changePhoneForm.validate()) {
        this.request({
          url: this.endpoint(`users/changePhone`),
          method: "post",
          data: {
            new_phone: this.newPhone,
            code: this.phoneVerificationCode,
          },
          success: (data) => {
            this.successNotify();
            this.phone = this.newPhone;
            this.changePhoneDialog = false;
            this.newPhone = undefined;
            this.phoneVerificationCode = undefined;
            this.codeSent = false;
          },
        });
      }
    },
    openChangePhoneDialog() {
      this.changePhoneDialog = true;
    },
    setSecretKey() {
      this.request({
        url: this.endpoint(`users/secretKey`),
        method: "put",
        data: {
          secret_key: this.secretKey.secret_key,
          code: this.secretKey.code,
        },
        success: (data) => {
          this.secretKey.code = null;
          this.successNotify();
          this.getUser();
        },
      });
    },
    removeSecretKey() {
      this.request({
        url: this.endpoint(`users/secretKey`),
        method: "delete",
        data: {
          code: this.secretKey.code,
        },
        success: () => {
          this.removeSecretKeyDialog = false;
          this.successNotify();
          this.getSecretKey();
          this.getUser();
        },
      });
    },
    getSecretKey() {
      this.request({
        url: this.endpoint(`users/secretKey`),
        method: "get",
        success: (data) => {
          this.secretKey = data;
        },
      });
    },
    updateProfile() {
      this.request({
        url: this.endpoint(`users/update/${this.item.id}`),
        method: "put",
        data: this.item,
        success: (data) => {
          this.successNotify();
          this.isEditing = false;
        },
      });
    },
    changePassword() {
      if (this.$refs.changePasswordForm.validate()) {
        if (this.newPassword != this.newPasswordRepeat) {
          this.notify("کلمه عبور و تکرار آن یکسان نیستند", "danger");
          return;
        }
        this.request({
          url: this.endpoint(`users/changePassword`),
          method: "post",
          data: {
            old_password: this.oldPassword,
            new_password: this.newPassword,
          },
          success: (data) => {
            this.successNotify();
            this.oldPassword = null;
            this.newPassword = null;
            this.newPasswordRepeat = null;
            this.openTab = 0;
          },
        });
      }
    },
    confirmInvitation(invitation) {
      this.invitation = invitation;
      this.confirmInvitationDialog = true;
    },
    changeInvitationStatus(item, status, confirmationCode = null) {
      this.request({
        url: this.endpoint(`users/invitations/changeStatus`),
        method: "post",
        data: {
          id: item.id,
          status: status,
          confirmation_code: confirmationCode,
        },
        success: () => {
          this.confirmInvitationDialog = false;
          this.confirmationCode = null;
          this.successNotify();
          this.getInvitations();
        },
      });
    },
    getInvitations() {
      this.request({
        url: this.endpoint(`users/invitations`),
        method: "get",
        success: (data) => {
          this.invitations = data;
        },
      });
    },
  },
};
</script>
