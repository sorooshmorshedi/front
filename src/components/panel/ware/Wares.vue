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
      :showList="usage != 'tree'"
    >
      <template #header-buttons>
        <template v-for="i in 4">
          <router-link
            :key="i"
            v-if="i-1 != level"
            tag="button"
            class="btn btn-info ml-2"
            :to="{name:'Wares', level: i-1}"
          >تعریف {{ getTitle(i-1) }}</router-link>
        </template>
      </template>
      <template #default>
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
            <template v-if="item.id">
              <div class="col-12">
                <ol class="breadcrumb mt-4">
                  <li style="padding-left: 15px;">
                    <b>حساب های پدر:</b>
                  </li>
                  <li
                    class="breadcrumb-item"
                    v-for="(account, i) in accountParentsName(item)"
                    :key="i"
                  >{{ account }}</li>
                </ol>
              </div>
            </template>
          </template>
          <div class="form-group col-12">
            <label>کد</label>
            <input type="text" class="form-control" v-model="item.code" disabled>
          </div>
          <div class="form-group col-12">
            <label class="required">نام</label>
            <input type="text" class="form-control" v-model="item.name">
          </div>

          <div class="col-12 mt-3" v-if="item.id">
            <table class="table table-striped table-bordered">
              <thead class>
                <tr>
                  <th>بدهکار</th>
                  <th>بستانکار</th>
                  <th>مانده</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ item.balance.bed | toMoney}}</td>
                  <td>{{ item.balance.bes | toMoney}}</td>
                  <td>{{ item.balance.remain | toMoney}}</td>
                </tr>
              </tbody>
            </table>
            <ol class="breadcrumb mt-2 d-none">
              <li style="padding-left: 15px;">
                <b></b>
                {{ item.balance.bed | toMoney}}
              </li>
              <li style="padding-left: 15px;">
                <b></b>
                {{ item.balance.bes | toMoney}}
              </li>

              <li style="padding-left: 15px;">
                <b></b>
                {{ item.balance.remain | toMoney}}
              </li>
            </ol>
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
      </template>
    </list-modal-form>
  </div>
</template>
<script>
import ListModalFormMixin from "../../mcomponents/form/ListModalForm.js";

export default {
  mixins: [ListModalFormMixin],
  props: {
    level: {
      requried: true
    }
  },
  data() {
    return {
      item: {},
      cols: [
        {
          th: "کد",
          td: "code",
          type: "number",
          filters: [
            {
              label: "از کد",
              model: "code__from"
            },
            {
              label: "تا کد",
              model: "code__to"
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
    baseUrl() {
      if (this.level == 3) {
        return "wares/wares";
      }
      return "wares/wareLevels";
    },
    title() {
      return this.getTitle(this.level);
    },
    parentTitle() {
      return this.getTitle(+this.level - 1);
    },
    hasParent() {
      return this.level != 0;
    },
    hasDetail() {
      return this.level == 3;
    },
    items() {
      if (this.wareLevel.level == 3) return this.waresSelectValues.wares;
      else return this.waresSelectValues.levels[this.wareLevel.level];
    },
    parentItems() {
      return this.waresSelectValues.levels[this.level - 1];
    }
  },
  methods: {
    getData() {
      this.getWareLevels(force, false);
      this.getWares(force, false);
      this.getWarehouses(force, false);
      this.getUnits(force, false);
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
      return item;
    }
  }
};
</script>