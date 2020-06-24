<template>
  <list-modal-form
    title="ماشین ها"
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
          <v-text-field label=" * شماره ماشین" v-model="item.car_number" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="شماره کارت هوشمند" v-model="item.smart_card_number" />
        </v-col>
        <v-col cols="12" md="6">
          <v-autocomplete
            label="مالک"
            v-model="item.owner"
            :items="owners"
            item-text="text"
           />
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
      baseUrl: "dashtbashi/cars",
      leadingSlash: true,
      owners: [
        {
          text: "شرکت",
          id: "c",
        },
        {
          text: "دیگر",
          id: "o",
        },
        {
          text: "رحمان",
          id: "rn",
        },
        {
          text: "رحیم",
          id: "rm",
        },
        {
          text: "ابراهیم",
          id: "e",
        },
      ],
      cols: [
        {
          th: "شماره",
          td: "car_number",
          type: "text",
          filters: ["car_number"]
        }
      ]
    };
  },
  computed: {
    items() {
      return this.$store.state.cars;
    }
  },
  methods: {
    getData() {
      this.getCars(true);
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      return item;
    }
  }
};
</script>