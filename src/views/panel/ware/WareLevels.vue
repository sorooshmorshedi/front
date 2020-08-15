<template>
  <m-form
    :title="title"
    :items="items"
    :cols="cols"
    :deletable="item.id"
    :clearable="false"
    @rowClick="setItem"
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
          :to="`/panel/wareLevels/${i-1}`"
        >تعریف {{ getWareLevelTitle(i-1) }}</v-btn>
        <v-btn
          :key="i"
          v-else
          class="blue white--text mr-1"
          @click="clearForm"
        >تعریف {{ getWareLevelTitle(i-1) }}</v-btn>
      </template>
      <v-btn :key="i" class="blue white--text mr-1" :to="{name:'Wares'}">تعریف کالا</v-btn>
    </template>
    <template #default>
      <v-row>
        <template v-if="hasParent">
          <v-col cols="12">
            <v-autocomplete
              :return-object="true"
              :label="' * ' + getWareLevelTitle(level - 1)"
              :items="parentItems"
              v-model="item.parent"
              item-text="name"
              item-value="id"
            ></v-autocomplete>
          </v-col>
        </template>
        <v-col cols="12" v-if="item.id">
          <v-text-field label="کد" v-model="item.code" disabled />
        </v-col>
        <v-col cols="12">
          <v-text-field label=" * نام" v-model="item.name" />
        </v-col>
      </v-row>
    </template>
  </m-form>
</template>
<script>
import { fromCodeFilter, toCodeFilter } from "@/mixin/accountMixin.js";
import WareApiMixin from "@/mixin/wareApi";
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";

export default {
  mixins: [ListModalFormMixin, WareApiMixin],
  props: {
    level: {
      required: true
    }
  },
  data() {
    return {
      item: {},
      baseUrl: "wares/wareLevels",
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
    title() {
      return this.getWareLevelTitle(this.level);
    },
    parentTitle() {
      return this.getWareLevelTitle(+this.level - 1);
    },
    hasParent() {
      return this.level != 0;
    },
    parentItems() {
      return this.wareLevels.filter(o => o.level == this.level - 1);
    },
    items() {
      return this.wareLevels.filter(o => o.level == this.level);
    }
  },
  methods: {
    getData() {
      this.getWareLevels(true);
    },
    getWareLevelTitle(level) {
      switch (Number(level)) {
        case 0:
          return "ماهیت";
        case 1:
          return "گروه";
        case 2:
          return "دسته بندی";
      }
    },
    getWareLevels(force = false) {
      if (!force && this.wareLevels.length) return;
      return this.request({
        url: this.endpoint("wares/wareLevels"),
        method: "get",
        success: data => {
          this.$store.commit("setWares", {
            wareLevels: data
          });
        }
      });
    },
    setItem(item) {
      if (typeof item.parent == typeof 72) {
        item.parent = this.parentItems.filter(o => o.id == item.parent)[0];
      }
      this.item = item;
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      item.level = this.level;
      return item;
    }
  }
};
</script>