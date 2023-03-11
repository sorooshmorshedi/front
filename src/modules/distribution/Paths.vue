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
      :showList="usage != 'tree'"
      @click:row="setItem"
      @clearForm="clearForm"
      @submit="submit"
      @delete="deleteItem"
  >
    <template #header-btns>
      <template v-for="i in 5">
        <v-btn
            :key="i"
            v-if="i-1 != level"
            depressed
            class="secondary rounded-lg white--text mr-1 mt-1 mt-md-0"
            :to="`/panel/paths/${i-1}`"
        >تعریف {{ getTitle(i - 1) }}
        </v-btn>
        <v-btn
            :key="i"
            v-else
            depressed
            class="primary rounded-lg white--text mr-1 mt-1 mt-md-0"
            @click="clearForm"
        >تعریف {{ getTitle(i - 1) }}
        </v-btn>
      </template>
    </template>
    <template #default>
      <v-row>
        <v-col cols="12" v-if="level != 0">
          <v-autocomplete
              class="rounded-lg"
              :label="'* ' + getTitle(level-1)"
              v-model="item.parent"
              :items="parentItems"
              item-text="name"
              item-value="id"
              :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" v-if="getParents(item.parent).length">
          <v-breadcrumbs :items="getParents(item.parent)">
            <template v-slot:divider>
              <v-icon>fa-chevron-left</v-icon>
            </template>
          </v-breadcrumbs>
        </v-col>
        <v-col cols="12" md="12">
          <v-text-field label="* نام" v-model="item.name" :disabled="!isEditing"/>
        </v-col>
        <v-col cols="12" md="12">
          <v-text-field v-if="item.id != undefined" label="کد" v-model="item.code" disabled/>
        </v-col>
        <v-col cols="12" v-if="level != 4">
          <v-autocomplete
              :label="visitorsTitle + ' ها'"
              :items="pathVisitors"
              v-model="item.visitors"
              item-text="user.name"
              item-value="id"
              :disabled="!isEditing"
              :multiple="true"
          />
        </v-col>
      </v-row>
    </template>
  </m-form>
</template>
<script>
import {MFormMixin} from "@/components/m-form";
import DistributionApiMixin from "@/modules/distribution/api";
import {PathLevels, VisitorLevels} from "@/variables";

export default {
  mixins: [MFormMixin, DistributionApiMixin],
  props: {
    level: {
      requried: true,
    },
    usage: {
      default: null,
    },
  },
  data() {
    return {
      item: {},
      baseUrl: "distributions/paths",
      appendSlash: true,
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
      return this.getTitle(this.level);
    },
    permissionBasename() {
      return "path";
    },
    parentTitle() {
      return this.getTitle(+this.level - 1);
    },
    items() {
      return this.paths.filter((o) => o.level == this.level);
    },
    parentItems() {
      return this.paths.filter((o) => o.level == this.level - 1);
    },
    pathVisitors() {
      return this.visitors.filter((o) => o.level == this.level);
    },
    visitorsTitle() {
      return VisitorLevels.find((o) => o.value == this.level).text;
    },
  },
  methods: {
    getData() {
      this.getPaths(true);
      this.getVisitors();
    },
    getTitle(level) {
      return PathLevels.find((o) => o.value == level).text;
    },
    getItemTemplate() {
      return {
        level: +this.level,
      };
    },
    getParents(itemId) {
      let parents = [];
      let item = this.paths.find((o) => o.id == itemId);
      while (item) {
        parents.push({
          text: item.name,
        });
        item = this.paths.find((o) => o.id == item.parent);
      }
      parents.reverse();
      return parents;
    },
  },
};
</script>
