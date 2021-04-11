<template>
  <m-form
    :title="title"
    :items="items"
    :cols="cols"
    :canSubmit="canSubmit"
    :canDelete="false"
    :showClearBtn="false"
    :is-editing.sync="isEditing"
    :showListBtn="false"
    :showSubmitAndClearBtn="false"
    :show-navigation-btns="false"
    :showActions="item.id != undefined"
    @click:row="setItem"
    @submit="submit"
  >
    <template #default>
      <v-row>
        <v-col cols="12">
          <v-text-field label="عنوان" v-model="item.name" disabled />
        </v-col>
        <v-col cols="12">
          <v-textarea label="متن" v-model="item.value" :disabled="!isEditing" />
        </v-col>
      </v-row>
    </template>
  </m-form>
</template>
<script>
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";
import DefaultTextApiMixin from "@/views/panel/defaultTexts/api";

export default {
  mixins: [MFormMixin, DefaultTextApiMixin],
  props: {
    usage: {
      required: true,
    },
  },
  data() {
    return {
      item: {},
      baseUrl: "home/defaultTexts",
      cols: [
        {
          text: "عنوان",
          value: "name",
        },
        {
          text: "متن",
          value: "value",
        },
      ],
    };
  },
  computed: {
    title() {
      return "متون پیشفرض";
    },
    items() {
      return this.defaultTexts.filter((o) => o.usage == this.usage);
    },
  },
  methods: {
    getData() {
      this.getDefaultTexts(true);
    },
  },
};
</script>