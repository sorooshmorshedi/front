<template>
  <list-modal-form
    title="کالا"
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
          <v-autocomplete
            label="دسته بندی"
            :items="parentItems"
            v-model="item.category"
            item-text="name"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" v-if="item.id">
          <v-text-field label="کد" v-model="item.code" disabled />
        </v-col>
        <v-col cols="12" md="8">
          <v-text-field label="نام" required v-model="item.name" />
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete label="واحد" :items="units" v-model="item.unit" item-text="name"></v-autocomplete>
        </v-col>
        <v-col cols="12" md="6">
          <money label="قیمت" v-model="item.price" />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            label="نوع قیمت گذاری"
            :items="pricingTypes"
            v-model="item.pricingType"
            item-text="name"
            :return-object="true"
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-autocomplete
            label="انبار پیشفرض"
            :items="warehouses"
            v-model="item.warehouse"
            item-text="name"
            :return-object="false"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="بارکد" required v-model="item.barcode" />
        </v-col>
        <v-col cols="12" md="6">
          <money label="حداقل فروش" v-model="item.minSale" />
        </v-col>
        <v-col cols="12" md="6">
          <money label="حداکثر فروش" v-model="item.maxSale" />
        </v-col>
        <v-col cols="12" md="6">
          <money label="حداقل موجودی" v-model="item.minInventory" />
        </v-col>
        <v-col cols="12" md="6">
          <money label="حداکثر موجودی" v-model="item.maxInventory" />
        </v-col>
        <v-col cols="12">
          <v-textarea label="توضیحات" v-model="item.explanation" />
        </v-col>
      </v-row>
    </template>
  </list-modal-form>
</template>
<script>
import { fromCodeFilter, toCodeFilter } from "@/mixin/accountMixin.js";
import WareApiMixin from "@/mixin/wareApi";
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";

export default {
  mixins: [ListModalFormMixin, WareApiMixin],
  props: {
    level: {
      requried: true
    }
  },
  data() {
    return {
      item: {},
      itemTemplate: {},
      baseUrl: "wares/wares",
      cols: [
        {
          th: "کد",
          td: "code",
          type: "number",
          filters: [
            {
              label: "از",
              model: "code__from",
              filter: fromCodeFilter
            },
            {
              label: "تا",
              model: "code__to",
              filter: toCodeFilter
            }
          ]
        },
        {
          th: "نام",
          td: "name",
          type: "text",
          filters: ["name"]
        }
      ]
    };
  },
  computed: {
    parentItems() {
      return this.wareLevels.filter(o => o.level == 2);
    },
    items() {
      return this.wares;
    }
  },
  methods: {
    getData() {
      this.getWareLevels();
      this.getUnits();
      this.getWarehouses();
      this.getWares(true);
    },
    setItem(item) {
      console.log(item.pricingType);
      this.item = this.copy(item);
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      return item;
    }
  }
};
</script>