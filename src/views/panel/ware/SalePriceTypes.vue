<template>
  <m-form
    title="نوع های نرخ فروش"
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
          <v-text-field label=" * نام" v-model="item.name" :disabled="!isEditing" />
        </v-col>
      </v-row>
    </template>
  </m-form>
</template>
<script>
import WareApiMixin from "@/mixin/wareApi";
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";

export default {
  mixins: [MFormMixin, WareApiMixin],
  data() {
    return {
      item: {},
      baseUrl: "wares/salePriceTypes",
      permissionBasename: "salePriceType",
      cols: [
        {
          text: "نام",
          value: "name",
        },
      ]
    };
  },
  computed: {
    items() {
      return this.salePriceTypes;
    }
  },
  methods: {
    getData() {
      this.getSalePriceTypes(true);
    }
  }
};
</script>