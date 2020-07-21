<template>
  <div class="rtl">
    <m-form
      :title="title"
      :items="items"
      :cols="cols"
      :canSubmit="canSubmit"
      :canDelete="canDelete"
      :canClear="canClear"
      :is-editing.sync="isEditing"
      :showListBtn="false"
      :show-navigation-btns="false"
      @rowClick="setItem"
      @clearForm="clearForm"
      @submit="submit"
      @delete="deleteItem"
    >
      <v-row>
        <v-col cols="12">
          <v-text-field label=" * نام" v-model="item.name" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="!isEditing" />
        </v-col>
      </v-row>
    </m-form>
  </div>
</template>
<script>
import AccountApiMixin from "@/mixin/accountMixin";
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";

export default {
  mixins: [ListModalFormMixin, AccountApiMixin],
  props: {
    is_cost_center: {
      default: false
    }
  },
  data() {
    return {
      baseUrl: "accounts/floatAccountGroups",
      cols: [
        {
          th: "نام گروه",
          td: "name",
          type: "text",
          filters: ["name"]
        },
        {
          th: "توضیحات",
          td: "explanation",
          type: "text",
          filters: ["expalantion"]
        }
      ]
    };
  },
  computed: {
    title() {
      if (this.isCostCenter) return "گروه مرکز هزینه";
      else return "گروه حساب شناور";
    },
    items() {
      return this.floatAccountGroups.filter(
        o => o.is_cost_center == this.isCostCenter
      );
    },
    isCostCenter() {
      return ["true", true].includes(this.is_cost_center);
    }
  },
  methods: {
    getItemTemplate() {
      return {
        is_cost_center: this.is_cost_center
      };
    },
    getData() {
      this.getFloatAccountGroups(true);
    }
  }
};
</script>