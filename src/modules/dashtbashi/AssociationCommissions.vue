<template>
  <list-modal-form
    title="کمیسیون انجمن"
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
        <v-col cols="12" md="12">
          <v-text-field label="نام" v-model="item.name" />
        </v-col>
        <v-col cols="12" md="12">
          <money label="مبلغ" v-model="item.price" />
        </v-col>
        <v-col cols="12">
          <v-textarea label="توضیحات" v-model="item.explanation" />
        </v-col>
      </v-row>
    </template>
  </list-modal-form>
</template>
<script>
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";
import GetApi from "./GetApi";

export default {
  mixins: [ListModalFormMixin, GetApi],
  data() {
    return {
      item: {},
      itemTemplate: {},
      baseUrl: "dashtbashi/associationCommissions",
      leadingSlash: true,
      cols: [
        {
          th: "نام",
          td: "name",
          type: "text",
          filters: ["name"]
        },
        {
          th: "مبلغ",
          td: "price",
          type: "text",
          filters: ["price"]
        }
      ]
    };
  },
  computed: {
    items() {
      return this.$store.state.associationCommissions;
    }
  },
  methods: {
    getData() {
      this.getAssociationCommissions(true);
    }
  }
};
</script>