<template>
  <m-form
    title="راننده ها"
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
        <v-col cols="12" md="12">
          <v-text-field label=" * نام" v-model="item.name" :disabled="item.id" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="شماره شناسنامه"
            v-model="item.shenasname_number"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field label="کد ملی" v-model="item.melli_code" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="4">
          <date label="تاریخ تولد" v-model="item.date_of_birth" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field label="نام پدر" v-model="item.father_name" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field label="تلفن همراه" v-model="item.phone" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field label="تلفن ثابت" v-model="item.landline_phone" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="شماره گواهینامه"
            v-model="item.driving_licence_number"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="شماره کارت سلامت"
            v-model="item.health_card_number"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="شماره کارت بانکی"
            v-model="item.bank_card_number"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label="شماره حساب بانکی"
            v-model="item.bank_account_number"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="8">
          <v-text-field label="شماره شبا" v-model="item.iban" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field label="نام بانک" v-model="item.bank_name" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="!isEditing" />
        </v-col>
      </v-row>
    </template>
  </m-form>
</template>
<script>
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";
import GetApi from "./GetApi";

export default {
  mixins: [MFormMixin, GetApi],
  data() {
    return {
      item: {},
      baseUrl: "dashtbashi/drivers",
      permissionBasename: "driver",
      appendSlash: true,
      cols: [
        {
          text: "نام",
          value: "name",
          type: "text",
          filters: ["name"],
        },
      ],
    };
  },
  computed: {
    items() {
      return this.$store.state.drivers;
    },
  },
  methods: {
    getData() {
      this.getDrivers(true);
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      return item;
    },
  },
};
</script>