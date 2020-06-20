<template>
  <div class="rtl">
    <list-modal-form
      title="شرکت"
      :items="items"
      :cols="cols"
      :deletable="item.id"
      @rowClick="setItem"
      @clearForm="clearForm"
      @submit="submit"
      @delete="deleteItem"
      ref="listModelForm"
    >
      <template #header-buttons>
        <v-btn v-if="item.id" @click="activeCompany" class="blue white--text mr-1">فعال کردن شرکت</v-btn>
      </template>
      <template #default>
        <v-row>
          <v-col cols="12">
            <v-text-field label=" * نام" v-model="item.name" />
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea rows="3" label="آدرس 1" v-model="item.address1" />
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea rows="3" label="آدرس 2" v-model="item.address2" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="کشور" v-model="item.country" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="شماره ثبت" v-model="item.sabt_number" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="تلفن 1" v-model="item.phone1" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="تلفن 2" v-model="item.phone2" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="فکس" v-model="item.fax" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="ایمیل" v-model="item.email" type="email" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="کد پستی" v-model="item.postal_code" type="number" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="وبسایت" v-model="item.website" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="کد اقتصادی" v-model="item.eghtesadi_code" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="شناسه ملی / کد ملی" v-model="item.shenase" />
          </v-col>
          <v-col cols="12">
            <v-textarea rows="3" label="توضیحات" v-model="item.explanation" />
          </v-col>
        </v-row>
      </template>
    </list-modal-form>
  </div>
</template>
<script>
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";
import GetUserApi from "@/views/panel/user/getUserApi";

export default {
  mixins: [ListModalFormMixin, GetUserApi],
  props: {},
  data() {
    return {
      baseUrl: "companies",
      items: [],
      cols: [
        {
          th: "نام",
          td: "name",
          type: "text",
          filters: ["name__icontains"]
        }
      ]
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
    }
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
        success: data => {
          this.items = data;
        }
      });
    },
    activeCompany() {
      this.request({
        url: this.endpoint("users/setActiveCompany"),
        method: "post",
        data: {
          company: this.item.id
        },
        success: data => {
          this.successNotify();
          this.getUser();
        }
      });
    }
  }
};
</script>