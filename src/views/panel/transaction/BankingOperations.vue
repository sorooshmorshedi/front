<template>
  <m-form
    title="عملیات های بانکی"
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
        <v-col cols="12">
          <v-text-field class="rounded-lg" label=" * نام" v-model="item.name" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12">
          <v-textarea class="rounded-lg" label="توضیحات" v-model="item.explanation" :disabled="!isEditing" />
        </v-col>
      </v-row>
    </template>
  </m-form>
</template>
<script>
import { MFormMixin } from "@/components/m-form";
import TransactionMixin from "@/views/panel/transaction/mixin";

export default {
  mixins: [MFormMixin, TransactionMixin],
  data() {
    return {
      item: {},
      baseUrl: "transactions/bankingOperations",
      appendSlash: true,
      permissionBasename: "bankingOperation",
      cols: [
        {
          text: "نام",
          value: "name",
        },
        {
          text: "توضیحات",
          value: "explanation",
        }
      ]
    };
  },
  computed: {
    items() {
      return this.bankingOperations;
    }
  },
  methods: {
    getData() {
      this.getBankingOperations(true);
    }
  }
};
</script>