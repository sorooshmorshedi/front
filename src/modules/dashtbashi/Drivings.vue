<template>
  <list-modal-form
    title="انتصاب راننده به ماشین"
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
        <v-col cols="12" md="6">
          <v-autocomplete
            label="ماشین"
            v-model="item.car"
            :items="$store.state.cars"
            item-text="car_number_str"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-autocomplete
            label="راننده"
            v-model="item.driver"
            :items="$store.state.drivers"
            item-text="name"
          />
        </v-col>
        <v-col cols="12" md="12">
          <v-text-field label="هزینه موبایل" v-model="item.mobile_cost" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="حقوق ثابت" v-model="item.fixed_salary" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field type="number" label="درصد پورسانت" v-model="item.commission" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="پاداش" v-model="item.reward" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="عائله" v-model="item.family" />
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
      baseUrl: "dashtbashi/drivings",
      leadingSlash: true,
      cols: [
        {
          th: "عنوان",
          td: "title",
          type: "text",
          filters: ["title"]
        }
      ]
    };
  },
  computed: {
    items() {
      return this.$store.state.drivings;
    }
  },
  methods: {
    getData() {
      this.getDrivers();
      this.getCars();
      this.getDrivings(true);
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      return item;
    }
  }
};
</script>