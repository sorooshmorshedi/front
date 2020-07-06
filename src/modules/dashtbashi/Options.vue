<template>
  <list-modal-form
    :title="title"
    :items="items"
    :cols="cols"
    :deletable="false"
    :clearable="false"
    :showActions="item.id != undefined"
    @rowClick="setItem"
    @submit="submit"
    ref="listModelForm"
  >
    <template #default>
      <v-row>
        <v-col cols="12">
          <v-text-field label="نام" v-model="item.name" disabled />
        </v-col>
        <v-col cols="12">
          <v-text-field label="مقدار" v-model="item.value" />
        </v-col>
      </v-row>
    </template>
  </list-modal-form>
</template>
<script>
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";
import GetOptionsApi from "@/views/panel/options/getOptionsApi"

export default {
  mixins: [ListModalFormMixin],
  data() {
    return {
      item: {},
      baseUrl: "home/options",
      cols: [
        {
          th: "نام",
          td: "name",
          type: "text",
          filters: ["name"]
        },
        {
          th: "مقدار",
          td: "value",
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
    },
  }
};
</script>