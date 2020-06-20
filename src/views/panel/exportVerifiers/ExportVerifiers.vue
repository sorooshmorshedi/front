<template>
  <list-modal-form
    title="تایید کنندگان خروجی"
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
        <template v-if="hasParent">
          <v-col cols="12">
            <v-autocomplete
              label=" * فرم"
              :items="forms"
              v-model="item.form"
              item-text="label"
              item-value="value"
              :return-object="false"
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
  </list-modal-form>
</template>
<script>
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";

export default {
  mixins: [ListModalFormMixin],
  data() {
    let forms = [
        { label: "سند", value: "S" },
        { label: "فاکتور خرید", value: "FB" },
        { label: "فاکتور فروش", value: "FS" },
        { label: "فاکتور برگشت از خرید", value: "FBFB" },
        { label: "فاکتور برگشت از فروش", value: "FBFS" },
        { label: "رسید", value: "RT" },
        { label: "حواله", value: "RC" },
        { label: "دریافت", value: "TR" },
        { label: "پرداخت", value: "TP" }

    ]
    return {
      item: {},
      items: [],
      itemTemplate: {},
      baseUrl: "reports/exportVerifiers",
      leadingSlash: true,
      forms: forms,
      cols: [
        {
          th: "فرم",
          td: "form",
          type: "select",
          filters: ["select"],
          options: forms
        },
        {
          th: "نام",
          td: "name",
          type: "text",
          filters: ["name"]
        },
        {
          th: "حساب",
          td: "account.title",
          type: "text",
          filters: ["account__title__icontains"]
        }
      ]
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
        success: data => {
          this.items = data;
        }
      });
    },
    setItem(item) {
      this.item = item;
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      item.type = this.factorType;
      return item;
    }
  }
};
</script>