<template>
  <list-modal-form
    title="دسته چک"
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
      <v-btn
        v-if="item.id"
        class="blue white--text mr-1"
        :to="{name: 'List', params: {form: 'cheque'}, query: {filters: JSON.stringify({chequebook__id: item.id})}}"
      >مشاهده چک ها</v-btn>
    </template>
    <template #default>
      <v-row>
        <v-col cols="12" v-if="item.id">
          <v-text-field label="سری دسته چک" disabled v-model="item.code" />
        </v-col>
        <v-col cols="12">
          <account-select
            items-type="banks"
            label=" * حساب بانک"
            v-model="item.account"
            :disabled="!editable"
            :floatAccount="item.floatAccount"
            @update:floatAccount="v => item.floatAccount = v"
            :costCenter="item.costCenter"
            @update:costCenter="v => item.costCenter = v"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label=" * از شماره سریال"
            type="number"
            v-model="item.serial_from"
            :disabled="!editable"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            type="number"
            label=" * تا شماره سریال"
            v-model="item.serial_to"
            :disabled="!editable"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="!editable"></v-textarea>
        </v-col>
      </v-row>
    </template>
  </list-modal-form>
</template>

<script>
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";

import accountApiMixin from "@/mixin/accountMixin";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import formsMixin from "@/mixin/forms";
import GetChequebookApi from "./getChequebooksApi";

export default {
  name: "ChequebookForm",
  components: { money, date },
  mixins: [ListModalFormMixin, GetChequebookApi, accountApiMixin, formsMixin],
  data() {
    return {
      baseUrl: "cheques/chequebooks",
      leadingSlash: true,
      cols: [
        {
          th: "حساب",
          td: "account.name",
          type: "text",
          filters: ["account__name__icontains"]
        },
        {
          th: "سری",
          td: "code",
          type: "number",
          filters: ["serial__icontains"]
        },
        {
          th: "از سریال",
          td: "serial_from",
          type: "number",
          filters: ["serial__icontains"]
        },
        {
          th: "تا سریال",
          td: "serial_to",
          type: "number",
          filters: ["serial__icontains"]
        },
        {
          th: "توضیحات",
          td: "explanation",
          type: "text",
          filters: ["account__icontains"]
        }
      ]
    };
  },
  computed: {
    items() {
      return this.chequebooks;
    }
  },
  methods: {
    getData() {
      this.getChequebooks(true);
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      return item;
    }
  }
};
</script>

<style scoped lang="scss">
</style>

