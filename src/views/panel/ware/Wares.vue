<template>
  <m-form
    title="کالا"
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
        <v-col cols="12" md="8">
          <v-autocomplete
            :return-object="true"
            label=" * دسته بندی"
            :items="parentItems"
            v-model="item.category"
            :disabled="item.id || !isEditing"
            item-text="name"
            item-value="id"
            :hint="parents"
            :hide-details="false"
            :persistent-hint="true"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="4">
          <v-switch
            :disabled="item.id || !isEditing"
            label="کالا خدماتی است"
            v-model="item.is_service"
            hint="کالای خدماتی انبار گردانی ندارد"
          ></v-switch>
        </v-col>
        <v-col cols="12" v-if="item.id">
          <v-text-field label="کد" v-model="item.code" disabled />
        </v-col>
        <v-col cols="12" md="8">
          <v-text-field label=" * نام" v-model="item.name" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            :return-object="true"
            label=" * واحد"
            :items="units"
            v-model="item.unit"
            item-text="name"
            item-value="id"
            :disabled="!isEditing"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="6">
          <money label="قیمت" v-model="item.price" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            label=" * نوع قیمت گذاری"
            :items="pricingTypes"
            v-model="item.pricingType"
            item-text="name"
            item-value="id"
            :disabled="!isEditing"
            :return-object="true"
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-autocomplete
            :return-object="false"
            label=" * انبار پیشفرض"
            :items="warehouses"
            v-model="item.warehouse"
            :disabled="!isEditing"
            item-text="name"
            item-value="id"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="بارکد" v-model="item.barcode" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="6">
          <money label="حداقل فروش" v-model="item.minSale" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="6">
          <money label="حداکثر فروش" v-model="item.maxSale" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="6">
          <money label="حداقل موجودی" v-model="item.minInventory" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="6">
          <money label="حداکثر موجودی" v-model="item.maxInventory" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="!isEditing" />
        </v-col>
      </v-row>
    </template>
  </m-form>
</template>
<script>
import { fromCodeFilter, toCodeFilter } from "@/mixin/accountMixin.js";
import WareApiMixin from "@/mixin/wareApi";
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";

export default {
  mixins: [MFormMixin, WareApiMixin],
  props: {
    level: {
      requried: true,
    },
  },
  data() {
    return {
      item: {},
      baseUrl: "wares/wares",
      permissionBasename: "ware",
      cols: [
        {
          text: "کد",
          value: "code",
          type: "number",
          filters: [
            {
              label: "از",
              model: "code__from",
              filter: fromCodeFilter,
            },
            {
              label: "تا",
              model: "code__to",
              filter: toCodeFilter,
            },
          ],
        },
        {
          text: "نام",
          value: "name",
          type: "text",
          filters: ["name"],
        },
      ],
    };
  },
  computed: {
    parentItems() {
      return this.wareLevels.filter((o) => o.level == 2);
    },
    items() {
      return this.wares;
    },
    parents() {
      let parent = this.item.category;
      let parents = [];
      let parentId = false;
      if (typeof parent == typeof 72) {
        parentId = parent;
      } else if (parent && parent.id) {
        parentId = parent.id;
      }
      while (parentId) {
        let parent = this.wareLevels.filter((o) => o.id == parentId)[0];
        parents.push(parent.name);
        parentId = parent.parent;
      }
      return parents.reverse().join(" > ");
    },
  },
  methods: {
    getData() {
      this.getWareLevels();
      this.getUnits();
      this.getWarehouses();
      this.getWares(true);
    },
    setItem(item) {
      this.item = this.copy(item);
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      return item;
    },
    getItemTemplate() {
      return {
        category: null,
      };
    },
  },
};
</script>