<template>
  <div class="rtl">
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
      <v-row>
        <v-col cols="12">
          <v-text-field class="rounded-lg" label=" * نام" v-model="item.name" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12">
          <v-textarea class="rounded-lg" label="توضیحات" v-model="item.explanation" :disabled="!isEditing" />
        </v-col>
      </v-row>
    </m-form>
  </div>
</template>
<script>
import AccountApiMixin from "@/mixin/accountMixin";
import { MFormMixin } from "@/components/m-form";

export default {
  mixins: [MFormMixin, AccountApiMixin],
  props: {
    is_cost_center: {
      default: false,
    },
  },
  data() {
    return {
      baseUrl: "accounts/floatAccountGroups",
      permissionBasename: "floatAccountGroup",
      cols: [
        {
          text: "نام گروه",
          value: "name",
          type: "text",
          filters: ["name"],
        },
        {
          text: "توضیحات",
          value: "explanation",
          type: "text",
          filters: ["expalantion"],
        },
      ],
    };
  },
  computed: {
    title() {
      if (this.isCostCenter) return "گروه مرکز هزینه و درآمد";
      else return "گروه حساب شناور";
    },
    items() {
      if (this.isCostCenter) return this.costCenterGroups;
      return this.floatAccountGroups;
    },
    isCostCenter() {
      return ["true", true].includes(this.is_cost_center);
    },
  },
  methods: {
    getItemTemplate() {
      return {
        is_cost_center: this.is_cost_center,
      };
    },
    getData() {
      this.getFloatAccountGroups(true);
    },
  },
};
</script>