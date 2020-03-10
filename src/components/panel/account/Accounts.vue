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
      <div class="row">
        <template v-if="hasParent">
          <div class="form-group col-12">
            <label class="required">{{ parentTitle }}</label>
            <multiselect
              dir="rtl"
              :options="parentItems"
              v-model="item.parent"
              track-by="id"
              label="title"
              :disabled="item.id != undefined"
            />
          </div>
          <div class="col-12">
            <account-parent-breadcrumb :baseAccount="item"/>
          </div>
        </template>
        <div class="form-group col-12">
          <label>کد</label>
          <input type="text" class="form-control" v-model="item.code" disabled>
        </div>
        <div class="form-group col-12">
          <label class="required">نام</label>
          <input type="text" class="form-control" v-model="item.name">
        </div>

        <template v-if="hasDetail">
          <div class="form-group col-12 col-md-6">
            <label>گروه حساب تفضیلی شناور</label>
            <multiselect
              dir="rtl"
              :options="accountsSelectValues.floatAccountGroups"
              v-model="item.floatAccountGroup"
              track-by="id"
              label="name"
            />
          </div>
          <div class="form-group col-12 col-md-6">
            <template v-if="hasCostCenter">
              <label>گروه مرکز هزینه</label>
              <multiselect
                dir="rtl"
                :options="accountsSelectValues.costCenterGroups"
                v-model="item.costCenterGroup"
                track-by="id"
                label="name"
              />
            </template>
          </div>
          <div class="form-group col-12 col-md-6">
            <label>سقف بدهکاری</label>
            <money class="form-control" v-model="item.max_bed"/>
          </div>
          <div class="form-group col-12 col-md-6">
            <label>سقف بستانکاری</label>
            <money class="form-control" v-model="item.max_bed"/>
          </div>
          <div class="form-group col-12 col-md-12">
            <label>توضیحات</label>
            <textarea class="form-control" rows="3" v-model="item.explanation"></textarea>
          </div>
        </template>

        <template v-if="isBank">
          <div class="form-group col-12 col-md-4">
            <label>نام بانک</label>
            <input type="text" class="form-control" v-model="item.bank_name">
          </div>
          <div class="form-group col-12 col-md-4">
            <label>نام شعبه</label>
            <input type="text" class="form-control" v-model="item.branch_name">
          </div>
          <div class="form-group col-12 col-md-4">
            <label>کد شعبه</label>
            <input type="text" class="form-control" v-model="item.branch_code">
          </div>
          <div class="form-group col-12 col-md-4">
            <label>شماره حساب</label>
            <input type="text" class="form-control" v-model="item.account_number">
          </div>
          <div class="form-group col-12 col-md-4">
            <label>کد شبا</label>
            <input type="text" class="form-control" v-model="item.sheba">
          </div>
          <div class="form-group col-12 col-md-4">
            <label>شماره تماس</label>
            <input type="text" class="form-control" v-model="item.phone">
          </div>
        </template>

        <template v-if="isPerson">
          <div class="col-12">
            <hr>
          </div>
          <div class="form-group col-12 col-md-4">
            <label class="required">حساب شخص</label>
            <div>
              <div class="form-check form-check-inline">
                <input
                  v-model="item.person_type"
                  :disabled="item.id"
                  class="form-check-input"
                  type="radio"
                  value="b"
                  id="buyer"
                >
                <label class="form-check-label" for="buyer">خریدار</label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  v-model="item.person_type"
                  :disabled="item.id"
                  class="form-check-input"
                  type="radio"
                  value="s"
                  id="seller"
                >
                <label class="form-check-label" for="seller">فروشنده</label>
              </div>
            </div>
          </div>
          <div class="form-group col-12 col-md-4">
            <label>نوع شخص</label>
            <div>
              <div class="form-check form-check-inline">
                <input
                  v-model="item.is_real"
                  :disabled="item.id"
                  class="form-check-input"
                  type="radio"
                  :value="true"
                  id="real"
                >
                <label class="form-check-label" for="real">حقیقی</label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  v-model="item.is_real"
                  :disabled="item.id"
                  class="form-check-input"
                  type="radio"
                  :value="false"
                  id="legal"
                >
                <label class="form-check-label" for="legal">حقوقی</label>
              </div>
            </div>
          </div>
          <div class="form-group col-12 col-md-4">
            <label>موبایل</label>
            <input type="text" class="form-control" v-model="item.mobile">
          </div>
          <div class="form-group col-12 col-md-4">
            <label>شماره تماس 1</label>
            <input type="text" class="form-control" v-model="item.phone_1">
          </div>
          <div class="form-group col-12 col-md-4">
            <label>شماره تماس 2</label>
            <input type="text" class="form-control" v-model="item.phone_2">
          </div>
          <div class="form-group col-12 col-md-4">
            <label>شماره ملی</label>
            <input type="text" class="form-control" v-model="item.melli_code">
          </div>
          <div class="form-group col-12 col-md-4">
            <label>وبسایت</label>
            <input type="text" class="form-control" v-model="item.website">
          </div>
          <div class="form-group col-12 col-md-4">
            <label>فکس</label>
            <input type="text" class="form-control" v-model="item.fax">
          </div>
          <div class="form-group col-12 col-md-4">
            <label>ایمیل</label>
            <input type="text" class="form-control" v-model="item.email">
          </div>
          <div class="form-group col-12 col-md-4">
            <label>استان</label>
            <input type="text" class="form-control" v-model="item.province">
          </div>
          <div class="form-group col-12 col-md-4">
            <label>شهر</label>
            <input type="text" class="form-control" v-model="item.city">
          </div>
          <div class="form-group col-12 col-md-4">
            <label>کد پستی</label>
            <input type="text" class="form-control" v-model="item.postal_code">
          </div>
          <div class="form-group col-12 col-md-4">
            <label>آدرس 1</label>
            <input type="text" class="form-control" v-model="item.address_1">
          </div>
          <div class="form-group col-12 col-md-4">
            <label>آدرس 2</label>
            <input type="text" class="form-control" v-model="item.address_2">
          </div>
          <div class="form-group col-12 col-md-4">
            <label>شماره حساب 1</label>
            <input type="text" class="form-control" v-model="item.account_number_1">
          </div>
          <div class="form-group col-12 col-md-4">
            <label>شماره حساب 2</label>
            <input type="text" class="form-control" v-model="item.account_number_2">
          </div>
          <div class="form-group col-12 col-md-4">
            <label>کد اقتصادی</label>
            <input type="text" class="form-control" v-model="item.eghtesadi_code">
          </div>
        </template>
      </div>
    </list-modal-form>
  </div>
</template>
<script>
import { fromCodeFilter, toCodeFilter } from "@/mixin/accountMixin.js";
import AccountApiMixin from "../../../mixin/accountMixin";
import ListModalFormMixin from "../../mcomponents/form/ListModalForm.js";
import AccountParentBreadcrumb from "./AccountParentBreadcrumb";

export default {
  mixins: [ListModalFormMixin, AccountApiMixin],
  components: { AccountParentBreadcrumb },
  props: {
    level: {
      requried: true
    },
    account_type: {
      default: "o"
    }
  },
  data() {
    return {
      item: {},
      baseUrl: "accounts/accounts",
      cols: [
        {
          th: "کد حساب",
          td: "code",
          type: "number",
          filters: [
            {
              label: "از کد حساب",
              model: "code__from",
              filter: fromCodeFilter
            },
            {
              label: "تا کد حساب",
              model: "code__to",
              filter: toCodeFilter
            }
          ]
        },
        {
          th: "نام حساب",
          td: "name",
          type: "text",
          filters: ["name"]
        },
        {
          th: "نوع",
          td: "type.name",
          type: "text",
          filters: ["type.name"]
        }
      ]
    };
  },
  computed: {
    title() {
      return this.getTitle(this.level, this.account_type);
    },
    parentTitle() {
      return this.getTitle(+this.level - 1);
    },
    hasParent() {
      return this.level != 0 && !this.isBank && !this.isPerson;
    },
    hasDetail() {
      return this.level == 3;
    },
    hasCostCenter() {
      if (this.item.parent) {
        return this.item.parent.code[0] == 6;
      } else if (this.item.id) {
        return this.item.code[0] == 6;
      }
    },
    isBank() {
      return this.account_type == "b";
    },
    isPerson() {
      return this.account_type == "p";
    },
    items() {
      return this.accountsSelectValues.levels[this.level].filter(
        o => o.account_type == this.account_type
      );
    },
    parentItems() {
      return this.accountsSelectValues.levels[this.level - 1];
    }
  },
  methods: {
    getData() {
      this.getAccounts(true);
      this.getFloatAccountGroups(true);
    },
    getTitle(level, account_type = "o") {
      if (account_type == "b") return "حساب بانک";
      if (account_type == "p") return "حساب اشخاص";
      switch (Number(level)) {
        case 0:
          return "گروه";
        case 1:
          return "کل";
        case 2:
          return "معین";
        case 3:
          return "تفصیلی";
      }
    },
    setItem(item) {
      if (typeof item.parent == typeof 72) {
        item.parent = this.parentItems.filter(o => o.id == item.parent)[0];
      }
      this.item = item;
    },
    getSerialized() {
      let item = this.copy(this.item);
      item = this.extractIds(item);
      item.account_type = this.account_type;
      return item;
    }
  }
};
</script>