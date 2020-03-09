<template>
  <div>
    <list-modal-form
      title="گروه حساب شناور"
      :items="floatAccountGroups"
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
  data() {
    return {
      item: {},
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
  methods: {
    getData() {
      this.getFloatAccountGroups(true);
    }
  }
};
</script>