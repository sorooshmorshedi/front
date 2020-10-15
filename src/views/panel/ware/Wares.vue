<template>
  <m-form
    :title="title"
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
    <template #header-btns>
      <template v-for="i in 3">
        <v-btn
          :key="i"
          v-if="i-1 != level"
          class="blue white--text mr-1"
          :to="`/panel/wares/${i-1}`"
        >تعریف {{ getWareTitle(i-1) }}</v-btn>
        <v-btn
          :key="i"
          v-else
          class="blue white--text mr-1"
          @click="clearForm"
        >تعریف {{ getWareTitle(i-1) }}</v-btn>
      </template>
      <v-btn class="blue white--text mr-1" :to="{name:'Wares', params: {level:3}}">تعریف کالا</v-btn>
    </template>

    <template #default>
      <v-row>
        <v-col cols="12" :md="isWare?8:12">
          <v-autocomplete
            :return-object="true"
            :label="' * ' + getWareTitle(level - 1)"
            :items="parentItems"
            v-model="item.parent"
            item-text="name"
            :disabled="item.id != undefined || !isEditing"
            item-value="id"
          ></v-autocomplete>
        </v-col>
        <template v-if="isWare">
          <v-col cols="12" md="4">
            <v-switch
              :disabled="item.id != undefined || !isEditing"
              label="کالا خدماتی است"
              v-model="item.is_service"
              hint="کالای خدماتی انبار گردانی ندارد"
            ></v-switch>
          </v-col>
        </template>
        <v-col cols="12">
          <v-text-field label="کد" v-model="item.code" disabled />
        </v-col>
        <v-col cols="12" :md="isWare?8:12">
          <v-text-field label=" * نام" v-model="item.name" :disabled="!isEditing" />
        </v-col>
        <template v-if="isWare">
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
        </template>
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
        },
        {
          text: "نام",
          value: "name",
        },
      ],
    };
  },
  computed: {
    title() {
      return this.getWareTitle(this.level);
    },
    isWare() {
      return this.level == 3;
    },
    parentItems() {
      return this.wares.filter((o) => o.level == +this.level - 1);
    },
    items() {
      return this.wares.filter((o) => {
        return o.level == this.level;
      });
    },
    parents() {
      let parent = this.item.parent;
      let parents = [];
      let parentId = false;
      if (typeof parent == typeof 72) {
        parentId = parent;
      } else if (parent && parent.id) {
        parentId = parent.id;
      }
      while (parentId) {
        let parent = this.wares.filter((o) => o.id == parentId)[0];
        parents.push(parent.name);
        parentId = parent.parent;
      }
      return parents.reverse().join(" > ");
    },
  },
  methods: {
    getData() {
      this.getUnits();
      this.getWarehouses();
      this.getWares(true);
    },

    getWareTitle(level) {
      switch (Number(level)) {
        case 0:
          return "ماهیت";
        case 1:
          return "گروه";
        case 2:
          return "دسته بندی";
        case 3:
          return "کالا";
      }
    },
    setItem(item) {
      this.request({
        url: this.endpoint(`wares/wares/${item.id}`),
        method: "get",
        success: (data) => {
          item = data;
          this.item = item;
        },
      });
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      item.level = this.level;
      return item;
    },
    getItemTemplate() {
      return {
        parent: null,
      };
    },
  },
};
</script>