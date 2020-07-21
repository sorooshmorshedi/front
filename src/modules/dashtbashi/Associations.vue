<template>
  <m-form
    title="انجمن"
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
    <template #default>
      <v-row>
        <v-col cols="12" md="12">
          <v-text-field label="نام" v-model="item.name" :disabled="isEditing" />
        </v-col>
        <v-col cols="12" md="12">
          <money label="مبلغ" v-model="item.price" :disabled="isEditing" />
        </v-col>
        <v-col cols="12">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="isEditing" />
        </v-col>
      </v-row>
    </template>
  </m-form>
</template>
<script>
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";
import GetApi from "./GetApi";

export default {
  mixins: [ListModalFormMixin, GetApi],
  data() {
    return {
      item: {},
      baseUrl: "dashtbashi/associations",
      basePermission: "association",
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
      return this.$store.state.associations;
    }
  },
  methods: {
    getData() {
      this.getAssociations(true);
    }
  }
};
</script>