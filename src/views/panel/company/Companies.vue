<template>
  <div class="rtl">
    <m-form
      title="شرکت"
      :items="items"
      :cols="cols"
      :canSubmit="canSubmit"
      :canDelete="canDelete"
      :is-editing.sync="isEditing"
      :showListBtn="false"
      :show-navigation-btns="false"
      @click:row="setItem"
      @clearForm="clearForm"
      @submit="submit"
      @delete="deleteItem"
    >
      <template #default>
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field label=" * نام" v-model="item.name" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="4">
            <m-file-input
              label="لوگو"
              :disabled="!isEditing"
              v-model="item.logo"
              :delete-attachment.sync="item.delete_logo"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea rows="3" label="آدرس 1" v-model="item.address1" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea rows="3" label="آدرس 2" v-model="item.address2" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="کشور" v-model="item.country" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="شماره ثبت" v-model="item.sabt_number" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="تلفن 1" v-model="item.phone1" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="تلفن 2" v-model="item.phone2" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="فکس" v-model="item.fax" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="ایمیل" v-model="item.email" type="email" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="کد پستی"
              v-model="item.postal_code"
              type="number"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="وبسایت" v-model="item.website" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="کد اقتصادی" v-model="item.eghtesadi_code" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="شناسه ملی / کد ملی" v-model="item.shenase" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12">
            <v-textarea rows="3" label="توضیحات" v-model="item.explanation" :disabled="!isEditing" />
          </v-col>
        </v-row>
      </template>

      <template #item.activate="{ item }">
        <v-btn
          v-if="!company || company.id != item.id"
          @click="activeCompany(item)"
          color="blue"
          icon
          large
        >
          <v-icon>fa-toggle-off</v-icon>
        </v-btn>
        <v-btn v-else icon color="blue" large>
          <v-icon>fa-toggle-on</v-icon>
        </v-btn>
      </template>
    </m-form>
  </div>
</template>
<script>
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";
import GetUserApi from "@/views/panel/user/getUserApi";

export default {
  mixins: [MFormMixin, GetUserApi],
  props: {},
  data() {
    return {
      baseUrl: "companies",
      permissionBasename: "company",
      items: [],
      cols: [
        {
          text: "نام",
          value: "name",
        },
        {
          text: "",
          value: "activate",
          sortable: false,
          filterable: false,
        },
      ],
    };
  },
  computed: {
    createUrl() {
      return `${this.baseUrl}/`;
    },
    updateUrl() {
      return this.item.id && `${this.baseUrl}/${this.item.id}/`;
    },
    deleteUrl() {
      return this.item.id && `${this.baseUrl}/${this.item.id}/`;
    },
  },
  methods: {
    getData() {
      this.getCompanies();
      this.getUser();
    },
    getCompanies() {
      this.request({
        url: this.endpoint("companies/"),
        method: "get",
        success: (data) => {
          this.items = data;
        },
      });
    },
    getSerialized() {
      let item = this.copy(this.item);

      delete item["financial_years"];

      if (typeof item["logo"] == typeof "") {
        delete item["logo"];
      }

      return this.jsonToFormData(item);
    },
    activeCompany(item) {
      this.request({
        url: this.endpoint("users/setActiveCompany"),
        method: "post",
        data: {
          company: item.id,
        },
        success: (data) => {
          this.successNotify();
          window.location.reload();
          this.getUser();
        },
      });
    },
  },
};
</script>