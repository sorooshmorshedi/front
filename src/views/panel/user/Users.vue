<template>
  <div class="rtl">
    <m-form
      :title="title"
      :items="users"
      :cols="cols"
      :isEditing.sync="isEditing"
      :canDelete="canDelete"
      :canSubmit="canSubmit && item.id"
      :show-navigation-btns="false"
      :showListBtn="false"
      :showClearBtn="false"
      @click:row="setItem"
      @clearForm="clearForm"
      @submit="submit"
      @delete="deleteItem"
    >
      <template #header-btns>
        <v-btn
          class="blue white--text mr-1 mt-1 mt-md-0"
          :to="{name: 'UserInvitations'}"
        >افزودن کاربر</v-btn>
      </template>

      <template #default>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              class="text-field-ltr"
              label=" * کد ملی"
              v-model="item.username"
              :disabled="true"
            />
          </v-col>

          <template>
            <v-col cols="12" md="6">
              <v-text-field
                class="text-field-ltr"
                type="number"
                label="شماره موبایل"
                v-model="item.phone"
                required
                :disabled="true"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="نام" v-model="item.first_name" :disabled="true" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="نام خانوادگی" v-model="item.last_name" :disabled="true" />
            </v-col>
          </template>

          <v-col cols="12">
            <v-autocomplete
              :return-object="false"
              label="سال های مالی"
              :items="financialYears"
              v-model="item.financialYears"
              :disabled="!isEditing"
              item-text="name"
              item-value="id"
              multiple
            ></v-autocomplete>
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
    </m-form>
  </div>
</template>
<script>
import { MFormMixin } from "@/components/m-form";
import getRolesApi from "../role/getRolesApi";
import UserApi from "@/views/panel/user/api";
import CompanyMixin from "@/views/panel/company/mixin";

export default {
  mixins: [MFormMixin, getRolesApi, UserApi, CompanyMixin],
  data() {
    return {
      baseUrl: "users/list",
      roles: [],
      financialYears: [],
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
    title() {
      return "کاربران";
    },
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
        id: null,
        roles: [],
        financialYears: [],
        is_active: true,
      };
    },
    getData() {
      this.getUsers();
      this.getRoles(this.setRoles);
      this.getFinancialYears((data) => (this.financialYears = data));
    },
    setRoles(data) {
      this.roles = data;
    },
    getSerialized() {
      let user = { ...this.item };
      user.roles = this.item.roles.map((o) => o.id);
      return user;
    },
  },
};
</script>