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
      <div class="form-group col-12">
        <label class="required">نام</label>
        <input type="text" class="form-control" v-model="item.name">
      </div>
      <div class="r">
        <div class="form-group col-12">
          <label>توضیحات</label>
          <textarea class="form-control" rows="5" v-model="item.explanation"></textarea>
        </div>
      </div>
    </list-modal-form>
  </div>
</template>
<script>
import AccountApiMixin from "../../../mixin/accountMixin.js";
import ListModalFormMixin from "../../mcomponents/form/ListModalForm.js";

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