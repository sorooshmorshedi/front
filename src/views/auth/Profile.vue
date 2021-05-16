<template>
  <v-row class="d-flex justify-center">
    <v-col cols="12">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>تنظیمات کاربری</v-toolbar-title>
        </v-toolbar>
        <v-tabs vertical>
          <v-tab class="start">
            <v-icon class="ml-4">fa-user</v-icon>
            <span>مشخصات کاربری</span>
          </v-tab>
          <v-tab class="start">
            <v-icon class="ml-4">fa-key</v-icon>
            <span>تغییر کلمه عبور</span>
          </v-tab>
          <v-tab>
            <v-icon class="ml-4">fa-envelope-open-text</v-icon>
            <span>لیست دعوت ها</span>
          </v-tab>
          <v-tab disabled>
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
                      <m-phone-field label="* شماره موبایل " v-model="item.phone" :disabled="true" />
                    </v-col>
                    <v-col cols="12" md="6">
                      <m-national-code label="* کد ملی " v-model="item.username" :disabled="true" />
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn v-if="!isEditing" @click="isEditing = true" class="amber w-100px">ویرایش</v-btn>
                <v-btn v-else @click="editProfile" color="blue white--text w-100px">ثبت</v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-col cols="12" md="12">
                  <v-text-field
                    class="text-field-ltr"
                    label=" * کلمه عبور جدید"
                    type="password"
                    v-model="newPassword"
                    :rules="passwordRules"
                    :hide-details="false"
                  />
                </v-col>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="changePassword" color="blue white--text w-100px">ثبت</v-btn>
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
                      <v-btn @click="confirmInvitation(item)" color="green white--text">تایید دعوت</v-btn>
                      <v-btn
                        @click="changeInvitationStatus(item, 'r')"
                        color="red white--text mr-1"
                      >رد دعوت</v-btn>
                    </template>
                    <span v-else>-</span>
                  </template>
                </m-datatable>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-col>

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
          <v-text-field class="text-field-ltr" label="کد تایید دریافتی" v-model="confirmationCode" />
        </v-card-text>
        <v-card-actions>
          <v-btn
            @click="changeInvitationStatus(invitation, 'a', confirmationCode)"
            block
            color="blue white--text "
          >تایید</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";
import UserApi from "@/views/panel/user/api";
import AuthMixin from "@/views/auth/mixin";
import MDatatable from "@/components/mcomponents/datatable/MDatatable.vue";

export default {
  components: { MDatatable },
  name: "Register",
  mixins: [AuthMixin, MFormMixin, UserApi],
  props: {},
  data() {
    return {
      isEditing: false,

      newPassword: null,

      invitations: [],
      invitation: null,
      confirmInvitationDialog: false,
      confirmationCode: null,
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
  },
  methods: {
    updateProfile() {},
    changePassword() {
      return;
      this.request({
        url: this.endpoint(`users/create`),
        method: "post",
        data: this.item,
        success: (data) => {
          console.log(data);
          this.successNotify();
          this.setToken(data.token);
          this.$router.push({ name: "Home" });
        },
      });
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
          console.log(data);
          this.invitations = data;
        },
      });
    },
  },
};
</script>