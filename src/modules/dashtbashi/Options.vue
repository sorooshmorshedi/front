<template>
  <m-form
    :title="title"
    :items="items"
    :cols="cols"
    :canSubmit="canSubmit"
    :canDelete="false"
    :canClear="false"
    :is-editing.sync="isEditing"
    :showListBtn="false"
    :show-navigation-btns="false"
    :showActions="item.id != undefined"
    @click:row="setItem"
    @submit="submit"
  >
    <template #default>
      <v-row>
        <v-col cols="12">
          <v-text-field label="نام" v-model="item.name" disabled />
        </v-col>
        <v-col cols="12">
          <v-text-field label="مقدار" v-model="item.value" :disabled="!isEditing" />
        </v-col>
      </v-row>
    </template>
  </m-form>
</template>
<script>
import { MFormMixin } from "@/components/m-form";
import GetOptionsApi from "@/views/panel/options/getOptionsApi";

export default {
  mixins: [MFormMixin, GetOptionsApi],
  data() {
    return {
      item: {},
      baseUrl: "home/options",
      cols: [
        {
          text: "نام",
          value: "name",
          type: "text",
          filters: ["name"]
        },
        {
          text: "مقدار",
          value: "value",
          type: "text",
          filters: ["value"]
        }
      ]
    };
  },
  computed: {
    title() {
      return "تنظیمات";
    },
    items() {
      return this.systemOptions;
    }
  },
  methods: {
    getData() {
      this.getOptions(true);
    }
  }
};
</script>