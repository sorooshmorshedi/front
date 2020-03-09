<template>
  <div>
    <list-modal-form
      title="حساب شناور"
      :items="floatAccounts"
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

        <div class="form-group col-12">
          <label class="required">گروه</label>
          <multiselect
            dir="rtl"
            :options="floatAccountGroups"
            v-model="item.floatAccountGroups"
            track-by="id"
            label="name"
            :multiple="true"
          />
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
      baseUrl: "accounts/floatAccounts",
      cols: [
        {
          th: "نام حساب",
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
    getData(){
      this.getFloatAccounts(true);
    },
    getSerialized() {
      let data = this.copy(this.item);
      data = this.extractIds(data);
      data.syncFloatAccountGroups = [];
      for (const fag of data.floatAccountGroups) {
        data.syncFloatAccountGroups.push(fag.id);
      }
      return data;
    }
  }
};
</script>