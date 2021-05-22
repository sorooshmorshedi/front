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
    @click:row="setItem"
    @clearForm="clearForm"
    @submit="submit"
    @delete="deleteItem"
  >
    <template #default>
      <v-row>
        <v-col cols="12" md="6">
          <v-autocomplete
            :return-object="true"
            label="* ماشین"
            v-model="item.car"
            :items="$store.state.dashtbashiCars"
            item-text="car_number_str"
            item-value="id"
            :disabled="item.id"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-autocomplete
            :return-object="true"
            label="* راننده"
            v-model="item.driver"
            :disabled="item.id"
            :items="$store.state.dashtbashiDrivers"
            item-text="name"
            item-value="id"
          />
        </v-col>
        <v-col cols="12" md="12">
          <money label="هزینه موبایل" v-model="item.mobile_cost" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="6">
          <money label="حقوق ثابت" v-model="item.fixed_salary" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="6">
          <money label="درصد پورسانت" v-model="item.commission" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="6">
          <money label="پاداش" v-model="item.reward" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="6">
          <money label="عائله" v-model="item.family" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="!isEditing" />
        </v-col>
      </v-row>
    </template>
  </m-form>
</template>
<script>
import { MFormMixin } from "@/components/m-form";
import GetApi from "./GetApi";

export default {
  mixins: [MFormMixin, GetApi],
  data() {
    return {
      item: {},
      baseUrl: "dashtbashi/drivings",
      appendSlash: true,
      cols: [
        {
          text: "عنوان",
          value: "title",
          type: "text",
          filters: ["title"],
        },
      ],
    };
  },
  computed: {
    items() {
      return this.$store.state.drivings;
    },
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
    },
  },
};
</script>