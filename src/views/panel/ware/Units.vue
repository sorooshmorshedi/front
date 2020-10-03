<template>
  <m-form
    title="واحد های شمارش"
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
        <v-col cols="12">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="!isEditing" />
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
      baseUrl: "wares/units",
      permissionBasename: "unit",
      cols: [
        {
          text: "نام",
          value: "name",
          type: "text",
          filters: ["name"]
        },
        {
          text: "توضیحات",
          value: "explanation",
          type: "text",
          filters: ["explanation"]
        }
      ]
    };
  },
  computed: {
    items() {
      return this.units;
    }
  },
  methods: {
    getData() {
      this.getUnits(true);
    }
  }
};
</script>