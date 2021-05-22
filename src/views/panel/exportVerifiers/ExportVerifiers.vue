<template>
  <m-form
    title="تایید کنندگان خروجی"
    :items="items"
    :cols="cols"
    :deletable="item.id"
    :is-editing.sync="isEditing"
    @click:row="setItem"
    @clearForm="clearForm"
    @submit="submit"
    @delete="deleteItem"
  >
    <template #default>
      <v-row>
        <template v-if="hasParent">
          <v-col cols="12">
            <v-autocomplete
              :return-object="false"
              label=" * فرم"
              :items="forms"
              v-model="item.form"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-text-field label="نام" v-model="item.name" />
          </v-col>
          <v-col cols="12">
            <v-text-field label=" * سمت" v-model="item.post" />
          </v-col>
        </template>
      </v-row>
    </template>
  </m-form>
</template>
<script>
import { MFormMixin } from "@/components/m-form";

export default {
  mixins: [MFormMixin],
  data() {
    let forms = [
      { text: "سند", value: "s" },
      { text: "رسید", value: "frc" },
      { text: "حواله", value: "frm" },
      { text: "پیش فاکتور خرید", value: "pfs" },
      { text: "پیش فاکتور فروش", value: "frb" },
      { text: "فاکتور خرید", value: "fb" },
      { text: "فاکتور فروش", value: "fs" },
      { text: "فاکتور برگشت از خرید", value: "fbfb" },
      { text: "فاکتور برگشت از فروش", value: "fbfs" },
      { text: "دریافت", value: "tr" },
      { text: "پرداخت", value: "tp" },
      { text: "انتقال", value: "t" },
      { text: "حواله کالای مصرفی", value: "cwr" },
      { text: "رسید تعدیل انبار", value: "ia" },
      { text: "حواله تعدیل انبار", value: "oa" },
    ];
    return {
      item: {},
      items: [],
      baseUrl: "reports/exportVerifiers",
      appendSlash: true,
      forms: forms,
      cols: [
        {
          text: "فرم",
          value: "form",
          items: forms,
        },
        {
          text: "نام",
          value: "name",
        },
        {
          text: "سمت",
          value: "post",
        },
      ],
    };
  },
  computed: {
    hasParent() {
      return this.level != 0;
    },
  },
  methods: {
    getData() {
      this.getVerifiers(true);
    },
    getVerifiers() {
      this.request({
        url: this.endpoint("reports/exportVerifiers/"),
        method: "get",
        success: (data) => {
          this.items = data;
        },
      });
    },
    setItem(item) {
      this.item = item;
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      item.type = this.factorType;
      return item;
    },
  },
};
</script>