<template>
  <m-form
    title="انتصاب راننده به ماشین"
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
        <v-col cols="12" md="6">
          <v-autocomplete
            label="ماشین"
            v-model="item.car"
            :items="$store.state.cars"
            item-text="car_number_str"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-autocomplete
            label="راننده"
            v-model="item.driver"
            :disabled="!isEditing"
            :items="$store.state.drivers"
            item-text="name"
          />
        </v-col>
        <v-col cols="12" md="12">
          <v-text-field label="هزینه موبایل" v-model="item.mobile_cost" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="حقوق ثابت" v-model="item.fixed_salary" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            type="number"
            label="درصد پورسانت"
            v-model="item.commission"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="پاداش" v-model="item.reward" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="عائله" v-model="item.family" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="!isEditing" />
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