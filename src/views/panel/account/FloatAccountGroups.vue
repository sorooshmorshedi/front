<template>
  <div class="rtl">
    <list-modal-form
      :title="title"
      :items="items"
      :cols="cols"
      :deletable="item.id"
      @rowClick="setItem"
      @clearForm="clearForm"
      @submit="submit"
      @delete="deleteItem"
      ref="listModelForm"
    >
      <v-row>
        <v-col cols="12">
          <v-text-field label=" * نام" v-model="item.name" />
        </v-col>
        <v-col cols="12">
          <v-textarea label="توضیحات" v-model="item.explanation" />
        </v-col>
      </v-row>
    </list-modal-form>
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
      itemTemplate: {
        is_cost_center: this.is_cost_center
      },
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
    getData() {
      this.getFloatAccountGroups(true);
    }
  }
};
</script>