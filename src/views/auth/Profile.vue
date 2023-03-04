<template>
  <v-row class="d-flex mr-5 ml-5">
    <strong :style="{'color': '#080707'}" class="mr-5 mb-5">
      حساب کاربری
    </strong>
    <v-col cols="12">
      <v-card class="rounded-lg pt-4 pb-4" :style="'border: 1px solid white;'">
        <v-row class="mr-1 ml-1">
          <v-col cols="12" md="1" class=" justify-sm-center pr-4">
            <v-img
                contain
                max-height="134"
                max-width="134"
                src="/img/user.png"
            />
          </v-col>
          <v-col cols="12" md="3" class="mt-6  justify-start">
            <v-row>
              <strong :style="{'color': '#080707'}" class="mr-5 mb-5">
                {{ user.name }}
              </strong>
            </v-row>
            <v-row>
            <span :style="{'color': '#080707'}" class="mr-5 mb-5">
            ماژول حسابداری , خزانه داری
            </span>
            </v-row>
          </v-col>
          <v-col cols="12" md="8" class="mt-4 d-flex justify-end">
            <v-chip
                class="mt-5 ml-2"
                color="success"
                variant="outlined"
            >
              <v-icon class="ml-2" start> fa-certificate</v-icon>
              وضعیت ماژول فعال
            </v-chip>

          </v-col>
        </v-row>
      </v-card>
      <v-card class="rounded-lg mt-7 pt-4 pb-4" :style="'border: 1px solid white;'">
        <v-tabs v-model="openTab" class="mr-10" color="#019EF6">
          <v-tab>
            <v-icon class="ml-4">fa-user-secret</v-icon>
            <span>مشخصات کاربری</span>
          </v-tab>
          <v-tab>
            <v-icon class="ml-4">fa-unlock-alt</v-icon>
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
            <v-card flat class="mt-5 ml-10" :style="'border: 1px solid white;'">
              <v-card-text>
                <v-form ref="form">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                          class="rounded-lg"
                          label=" * نام"
                          v-model="item.first_name"
                          :disabled="!isEditing"
                          :rules="rules.required"
                          :hide-details="false"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                          class="rounded-lg"
                          label="* نام خانوادگی"
                          v-model="item.last_name"
                          :disabled="!isEditing"
                          :rules="rules.required"
                          :hide-details="false"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <mobile
                          class="rounded-lg"
                          label="* شماره موبایل "
                          v-model="item.phone"
                          :disabled="true"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <m-national-code
                          class="rounded-lg"
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
                    depressed
                    @click="openChangePhoneDialog"
                    color="back secondary--text"
                >تغییر شماره موبایل
                </v-btn>
                <template v-if="!isEditing">
                  <v-btn depressed @click="isEditing = true" class="primary white--text w-100px"
                  >ویرایش
                  </v-btn
                  >
                </template>
                <template v-else>
                  <v-btn depressed @click="updateProfile" color="success white--text w-100px"
                  >ثبت
                  </v-btn
                  >
                </template>
              </v-card-actions>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat class="mt-5 ml-10" :style="'border: 1px solid white;'">
              <v-card-text>
                <v-form ref="changePasswordForm">
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                          class="text-field-ltr rounded-lg"
                          label=" * کلمه عبور فعلی"
                          type="password"
                          v-model="oldPassword"
                          :rules="rules.required"
                          :hide-details="false"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                          class="text-field-ltr rounded-lg"
                          label=" * کلمه عبور جدید"
                          :type="pass_type"
                          v-model="newPassword"
                          :rules="passwordRules"
                          :append-icon="pass_icon"
                          :hide-details="false"
                          @click:append="changeType"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                          class="text-field-ltr rounded-lg"
                          :type="pass_type"
                          label=" * تکرار کلمه عبور جدید"
                          v-model="newPasswordRepeat"
                          :rules="rules.required"
                          :hide-details="false"
                          :append-icon="pass_icon"
                          @click:append="changeType"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="changePassword" color="success white--text w-100px"
                >ثبت
                </v-btn
                >
              </v-card-actions>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat class="mt-5 ml-10" :style="'border: 1px solid white;'">
              <v-card-text>
                <m-datatable
                    :headers="invitationsHeaders"
                    :items="invitations"
                    :show-applied-filters="false"
                    :showExportBtns="false"
                >
                  <template #item.action="{ item }">
                    <template v-if="item.status == 'p'">
                      <v-btn
                          depressed
                          @click="confirmInvitation(item)"
                          color="success white--text"
                      >تایید دعوت</v-btn
                      >
                      <v-btn
                          depressed
                          @click="changeInvitationStatus(item, 'r')"
                          color="error white--text mr-1"
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
            <v-card flat class="mt-5 ml-10" :style="'border: 1px solid white;'">
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="8">
                    <p>
                      با فعال سازی ورود دوعاملی امنیت داده های خود را در سامانه حسابداری
                      سبحان چند برابر کنید
                    </p>
                    <p>
                      با فعال سازی ورود دو عاملی هنگام ورود به سامانه علاوه بر
                      نام کاربری و کلمه عبور باید کد تایید نیز وارد نمایید
                    </p>
                    <p>کد تایید هر 30 ثاینه یک بار عوض می شود</p>
                    <p class="secondary--text mt-10">برای فعال سازی مراحل زیر را طی کنید:</p>
                    <ul
                        class=" mr-4 mb-2"
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
                            :options="{ width: 30 }"
                        ></vue-qrcode>
                      </v-col>
                      <v-col cols="12" md="8" offset-md="1">
                        <v-text-field
                            @keyup.enter="setSecretKey"
                            label="کد تایید"
                            class=" rounded-lg mr-16"
                            width="20"
                            v-model="secretKey.code"
                            append-icon="fa-arrow-left"
                            @click:append="setSecretKey"
                        >
                        </v-text-field>
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
      <v-card class="rounded-lg">
        <v-card-title class="secondary--text">غیر فعال سازی ورود دو عاملی</v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <p >برای غیر فعال سازی ورود دو عاملی کد تایید را وارد کنید</p>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  color="secondary"
                  label="کد تایید"
                  class="text-field-ltr rounded-lg"
                  v-model="secretKey.code"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="5" >
            </v-col>
            <v-col cols="12" md="3" >
              <v-btn
                  @click="removeSecretKeyDialog = false"
                  block
                  depressed
                  class="mt-3 mt-md-1 mr-md-6"
                  color="error white--text"
              >بستن</v-btn
              >
            </v-col>
            <v-col cols="12" md="3" class="ml-1">
              <v-btn
                  @click="removeSecretKey"
                  block
                  depressed
                  class="mt-3 mt-md-1 mr-md-2"
                  color="success white--text"
              >غیر فعال سازی</v-btn
              >
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
        @click:outside="confirmInvitationDialog = false"
        v-model="confirmInvitationDialog"
        scrollable
        max-width="400px"
        transition="dialog-transition"
    >
      <v-card class="rounded-lg pa-3">
        <v-card-title class="mt-0 secondary--text">تایید دعوت</v-card-title>
        <v-card-subtitle class="mt-0" >
          لطفا کد تاییدی که از شرکت
          <span v-if="invitation">{{ invitation.company_name }}</span>
          دریافت کرده اید را وارد کنید
        </v-card-subtitle>
        <v-card-text>
          <v-text-field
              color="secondary"
              class="text-field-ltr rounded-lg mt-2"
              label="کد تایید دریافتی"
              v-model="confirmationCode"
          />
        </v-card-text>
        <v-card-actions class="mb-2">
          <v-btn
              @click="changeInvitationStatus(invitation, 'a', confirmationCode)"
              block
              color="success white--text "
          >تایید</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
        v-model="changePhoneDialog"
        scrollable
        max-width="500px"
        transition="dialog-transition"
    >
      <v-card class="rounded-lg pa-2">
        <v-card-title class="secondary--text">تغییر شماره موبایل</v-card-title>

        <v-card-text>
          <v-form ref="changePhoneForm">
            <v-row class="mt-2">
              <v-col cols="12" :md="codeSent ? 12 : 8">
                <mobile class="rounded-lg" color="secondary" label="* شماره موبایل جدید" v-model="newPhone" :disabled="codeSent" />
              </v-col>
              <v-col cols="12" md="4" v-if="!codeSent">
                <v-btn
                    block
                    depressed
                    color="success white--text"
                    class="mt-2"
                    :disabled="codeSent"
                    @click="sendCode"
                >
                  ارسال کد
                </v-btn>
              </v-col>
              <v-col cols="12" v-if="codeSent">
                <v-text-field
                    color="secondary"
                    class="text-field-ltr rounded-lg"
                    label="کد تایید دریافتی"
                    v-model="phoneVerificationCode"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions v-if="codeSent" class="justify-end">
          <v-btn @click="sendCode" :disabled="!canResend" outlined >
            <span v-if="canResend">
              ارسال دوباره کد
            </span>
            <span v-else class="black--text">
              {{ timer }}
            </span>
          </v-btn>
          <v-btn @click="changePhone" color="success white--text w-100px"
          >تایید</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import {MFormMixin} from "@/components/m-form";
import UserApi from "@/views/panel/user/api";
import GetUserApi from "@/views/panel/user/getUserApi";
import AuthMixin from "@/views/auth/mixin";
import MDatatable from "@/components/m-datatable";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import Template from "../Template.vue";
import mobile from "@/components/scomponents/Mobile";

export default {
  components: {MDatatable, VueQrcode, Template, mobile},
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
      pass_type: "password",
      pass_icon: "fa-eye",
      invitation: null,
      confirmInvitationDialog: false,
      confirmationCode: null,

      secretKey: {},
      removeSecretKeyDialog: false,

      changePhoneDialog: false,
      newPhone: "",
      phoneVerificationCode: null,
      codeSent: false,

      canResend: false,
      timer: 0,
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
        this.canResend = false;
        this.timer = 120;
        this.timerInterval = setInterval(() => {
          if (this.timer == 0) {
            clearInterval(this.timerInterval);
            this.canResend = true;
          } else {
            this.timer -= 1;
          }
        }, 1000);
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
            this.item.phone = this.newPhone;
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
          window.location.reload()
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
    changeType() {
      if (!this.pass_type) {
        this.pass_type = "password"
        this.pass_icon = "fa-eye"
      } else {
        this.pass_type = ""
        this.pass_icon = "fa-eye-slash "
      }
    },
  },
};
</script>
