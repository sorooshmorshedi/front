<template>
  <list-modal-form
    title="واحد های شمارش"
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
        <v-col cols="12">
          <v-text-field label="نام" required v-model="item.name" />
        </v-col>
        <v-col cols="12">
          <v-textarea label="توضیحات" v-model="item.explanation" />
        </v-col>
      </v-row>
    </template>
  </list-modal-form>
</template>
<script>
import WareApiMixin from "@/mixin/wareApi";
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";

export default {
  mixins: [ListModalFormMixin, WareApiMixin],
  data() {
    return {
      item: {},
      itemTemplate: {},
      baseUrl: "wares/units",
      cols: [
        {
          th: "نام",
          td: "name",
          type: "text",
          filters: ["name"]
        },
        {
          th: "توضیحات",
          td: "explanation",
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
    },
  }
};
</script>