<template>
  <div class="rtl">
    <m-form
        :title="title"
        :items="items"
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
      <template #header-btns>
        <v-tooltip top color="accent">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                depressed
                small
                v-bind="attrs"
                v-on="on"
                v-if="!isInvitation"
                class="secondary white--text mr-2  mt-md-0 rounded-lg"
                :to="{name: 'Users'}"
            >کاربران
            </v-btn>
          </template>
          نمایش کاربران
        </v-tooltip>
      </template>

      <template #default>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
                class="text-field-ltr rounded-lg"
                label=" * کد ملی"
                v-model="item.username"
                :disabled="!isEditing"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
                class="rounded-lg"
                label="* کد تایید"
                v-model="item.confirmation_code"
                :disabled="!isEditing"
            />
          </v-col>

          <v-col cols="12">
            <v-autocomplete
                class="rounded-lg"
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
                class="rounded-lg"
                :return-object="false"
                label="نقش ها"
                :items="roles"
                v-model="item.roles"
                :disabled="!isEditing"
                item-text="name"
                item-value="id"
                multiple
            ></v-autocomplete>
          </v-col>
        </v-row>
      </template>
    </m-form>
  </div>
</template>
<script>
import {MFormMixin} from "@/components/m-form";
import getRolesApi from "../role/getRolesApi";
import UserApi from "@/views/panel/user/api";
import CompanyMixin from "@/views/panel/company/mixin";
import AuthMixin from "@/views/auth/mixin";

export default {
  mixins: [MFormMixin, getRolesApi, UserApi, CompanyMixin, AuthMixin],
  props: {
    isInvitation: {
      default: false,
    },
  },
  data() {
    return {
      baseUrl: "companies/companyUserInvitations",
      appendSlash: true,
      roles: [],
      items: [],
      financialYears: [],
      permissionBasename: "user",
    };
  },
  computed: {
    title() {
      return "دعوت از کاربران";
    },
    cols() {
      return [
        {
          text: "کد ملی",
          value: "username",
        },
        {
          text: "کد تایید",
          value: "confirmation_code",
        },
        {
          text: "وضعیت",
          value: "status",
          type: "select",
          items: this.UserInvitationStatuses,
        },
      ];
    },
  },
  methods: {
    getItemTemplate() {
      return {
        id: null,
        roles: [],
        financialYears: [],
      };
    },
    getData() {
      this.getCompanyUserInvitations((data) => {
        this.items = data;
      });
      this.getRoles((data) => (this.roles = data));
      this.getFinancialYears((data) => (this.financialYears = data));
    },
  },
};
</script>