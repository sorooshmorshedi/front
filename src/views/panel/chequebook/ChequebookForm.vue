<template>
  <m-form
    title="دسته چک"
    :items="items"
    :cols="cols"
    :canSubmit="canSubmit"
    :canDelete="canDelete"
    :is-editing.sync="isEditing"
    :showListBtn="false"
    :show-navigation-btns="false"
    @rowClick="setItem"
    @clearForm="clearForm"
    @submit="submit"
    @delete="deleteItem"
  >
    <template #header-btns>
      <v-btn
        v-if="item.id"
        class="blue white--text mr-1"
        :to="{name: 'List', params: {form: 'cheque'}, query: {filters: JSON.stringify({chequebook__id: item.id})}}"
      >مشاهده چک ها</v-btn>
    </template>
    <template #default>
      <v-row>
        <v-col cols="12">
          <account-select
            items-type="banks"
            label=" * حساب بانک"
            v-model="item.account"
            :disabled="!isEditing"
            :floatAccount="item.floatAccount"
            @update:floatAccount="v => item.floatAccount = v"
            :costCenter="item.costCenter"
            @update:costCenter="v => item.costCenter = v"
          />
        </v-col>
        <v-col cols="12" md="12">
          <v-text-field label="* سری" v-model="item.serial" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            label=" * از شماره سریال"
            type="number"
            v-model="item.serial_from"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            type="number"
            label=" * تا شماره سریال"
            v-model="item.serial_to"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="!isEditing"></v-textarea>
        </v-col>
      </v-row>
    </template>
  </m-form>
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
      permissionBasename: "chequebook",
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
          td: "serial",
          type: "text",
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

