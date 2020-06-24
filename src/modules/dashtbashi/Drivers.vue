<template>
  <list-modal-form
    title="راننده ها"
    :items="items"
    :cols="cols"
    :deletable="item.id"
    @rowClick="setItem"
    @clearForm="clearForm"
    @submit="submit"
    @delete="deleteItem"
    ref="listModelForm"
  >
    <template #default>
      <v-row>
        <v-col cols="12" md="12">
          <v-text-field label=" * نام" v-model="item.name" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field label="شماره شناسنامه" v-model="item.shenasname_number" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field label="کد ملی" v-model="item.melli_code" />
        </v-col>
        <v-col cols="12" md="4">
          <date label="تاریخ تولد" v-model="item.date_of_birth" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field label="نام پدر" v-model="item.father_name" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field label="تلفن همراه" v-model="item.phone" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field label="تلفن ثابت" v-model="item.landline_phone" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="شماره گواهینامه" v-model="item.driving_licence_number" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="شماره کارت سلامت" v-model="item.health_card_number" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="شماره کارت بانکی" v-model="item.bank_card_number" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="شماره حساب بانکی" v-model="item.bank_account_number" />
        </v-col>
        <v-col cols="12" md="8">
          <v-text-field label="شماره شبا" v-model="item.iban" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field label="نام بانک" v-model="item.bank_name" />
        </v-col>
        <v-col cols="12">
          <v-textarea label="توضیحات" v-model="item.explanation" />
        </v-col>
      </v-row>
    </template>
  </list-modal-form>
</template>
<script>
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";
import GetApi from "./GetApi";

export default {
  mixins: [ListModalFormMixin, GetApi],
  data() {
    return {
      item: {},
      itemTemplate: {},
      baseUrl: "dashtbashi/drivers",
      leadingSlash: true,
      cols: [
        {
          th: "نام",
          td: "name",
          type: "text",
          filters: ["name"]
        }
      ]
    };
  },
  computed: {
    items() {
      return this.$store.state.drivers;
    }
  },
  methods: {
    getData() {
      this.getDrivers(true);
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      return item;
    }
  }
};
</script>