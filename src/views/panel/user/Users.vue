<template>
  <div class="rtl">
    <m-form
      title="کاربر"
      :items="users"
      :cols="cols"
      :isEditing.sync="isEditing"
      :canDelete="canDelete"
      :canSubmit="canSubmit"
      :show-navigation-btns="false"
      :showListBtn="false"
      @click:row="setItem"
      @clearForm="clearForm"
      @submit="submit"
      @delete="deleteItem"
    >
      <template #default>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field label=" * نام" v-model="item.first_name" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="* نام خانوادگی" v-model="item.last_name" :disabled="!isEditing" />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              class="ltr"
              type="number"
              label="* شماره موبایل"
              v-model="item.phone"
              required
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="6">
            <label></label>
            <v-text-field label=" * نام کاربری" v-model="item.username" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="12" v-if="!item.id">
            <v-text-field label=" * کلمه عبور" v-model="item.password" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12">
            <v-autocomplete
              :return-object="true"
              label="نقش ها"
              :items="roles"
              v-model="item.roles"
              :disabled="!isEditing"
              item-text="name"
              item-value="id"
              multiple
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-switch label="فعال" v-model="item.is_active" :disabled="!isEditing"></v-switch>
          </v-col>
        </v-row>
      </template>
      <template #footer-btns>
        <v-btn
          :disabled="!isEditing"
          v-if="item.id && hasPerm('changePassword', 'user', item)"
          @click=" showChangePasswordDialog = true "
          class="blue white--text mr-1"
        >تغیر کلمه عبور</v-btn>
      </template>
    </m-form>

    <v-dialog v-model="showChangePasswordDialog" max-width="500px">
      <v-card>
        <v-card-title>تغیر کلمه عبور</v-card-title>
        <v-card-text>
          <v-text-field label="کلمه عبور جدید" v-model="newPassword" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="changePassword" class="w-100px green white--text">ثبت</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";
import getRolesApi from "../role/getRolesApi";
import UserApi from "@/views/panel/user/api";

export default {
  mixins: [MFormMixin, getRolesApi, UserApi],
  props: {},
  data() {
    return {
      baseUrl: "users/list",
      roles: [],
      newPassword: "",
      showChangePasswordDialog: false,
      permissionBasename: "user",
      cols: [
        {
          text: "نام",
          value: "first_name",
          type: "text",
          filters: ["first_name"],
        },
        {
          text: "نام خانوادگی",
          value: "last_name",
          type: "text",
          filters: ["last_name"],
        },
        {
          text: "نام کاربری",
          value: "username",
          type: "text",
          filters: ["username"],
        },
      ],
    };
  },
  computed: {
    createUrl() {
      return "users/create";
    },
    updateUrl() {
      return this.item.id && `users/update/${this.item.id}`;
    },
    deleteUrl() {
      return this.item.id && `users/delete/${this.item.id}`;
    },
  },
  methods: {
    getItemTemplate() {
      return {
        roles: [],
        is_active: true,
      };
    },
    getData() {
      this.getUsers();
      this.getRoles(this.setRoles);
    },
    setRoles(data) {
      this.roles = data;
    },
    changePassword() {
      this.request({
        url: this.endpoint(`users/changePassword`),
        method: "post",
        data: {
          user: this.item.id,
          password: this.newPassword,
        },
        success: (data) => {
          this.newPassword = "";
          this.successNotify();
          this.showChangePasswordDialog = false;
        },
      });
    },
    getSerialized() {
      let user = { ...this.item };
      user.roles = this.item.roles.map((o) => o.id);
      return user;
    },
  },
};
</script>