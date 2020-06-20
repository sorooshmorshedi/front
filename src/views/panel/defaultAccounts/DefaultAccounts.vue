<template>
  <list-modal-form
    :title="title"
    :items="items"
    :cols="cols"
    :deletable="item.id"
    :clearable="clearable"
    :showActions="showActions"
    @rowClick="setItem"
    @clearForm="clearForm"
    @submit="submit"
    @delete="deleteItem"
    ref="listModelForm"
  >
    <template #default>
      <v-row>
        <v-col cols="12">
          <v-text-field label=" * نام" v-model="item.name" />
        </v-col>
        <v-col cols="12">
          <account-select
            label=" * حساب"
            itemsType="level3"
            v-model="item.account"
            :floatAccount="item.floatAccount"
            @update:floatAccount="v => item.floatAccount = v"
            :costCenter="item.costCenter"
            @update:costCenter="v => item.costCenter = v"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea label="توضیحات" v-model="item.explanation" />
        </v-col>
      </v-row>
    </template>
  </list-modal-form>
</template>
<script>
import AccountApiMixin from "@/mixin/accountMixin";
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";

export default {
  mixins: [ListModalFormMixin, AccountApiMixin],
  props: {
    usage: {
      requried: true
    }
  },
  data() {
    return {
      item: {},
      itemTemplate: {
        usage: this.usage
      },
      baseUrl: "accounts/defaultAccounts",
      cols: [
        {
          th: "نام",
          td: "name",
          type: "text",
          filters: ["name"]
        },
        {
          th: "حساب",
          td: "account.title",
          type: "text",
          filters: ["account__title__icontains"]
        }
      ]
    };
  },
  computed: {
    title() {
      let title = "حساب های پیشفرض ";
      if (this.usage == "receive") return title + "دریافت";
      if (this.usage == "payment") return title + "پرداخت";
      if (this.usage == "factor") return title + "فاکتور";
      if (this.usage == "closeAccounts") return title + "بستن";
    },
    items() {
      return this.defaultAccounts.filter(o => o.usage == this.usage);
    },
    clearable() {
      return ["factor", "closingAccounts"].includes(this.user);
    },
    showActions() {
      return this.item.id != undefined;
    }
  },
  methods: {
    getData() {
      this.getDefaultAccounts(true);
      this.getAccounts();
    },
    setItem(item) {
      this.item = item;
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      return item;
    }
  }
};
</script>