<template>
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
      <template v-if="item.id">
        <v-btn class="blue white--text mr-1" @click="openLedger(item)">دفتر این حساب</v-btn>
      </template>

      <template v-for="i in 4">
        <v-btn
          :key="i"
          v-if="i-1 != level"
          class="blue white--text mr-1"
          :to="`/panel/accounts/${i-1}`"
        >تعریف {{ getTitle(i-1) }}</v-btn>
      </template>
    </template>
    <template #default>
      <v-row>
        <template v-if="hasParent">
          <v-col cols="12">
            <account-select
              :label="parentTitle"
              :itemsType="itemsType"
              v-model="item.parent"
              :disabled="item.id != undefined"
            />
          </v-col>
        </template>
        <v-col cols="12">
          <v-text-field label="کد" v-model="item.code" disabled />
        </v-col>
        <v-col cols="12">
          <v-text-field label="نام" required v-model="item.name" />
        </v-col>
        <v-col cols="12" class="mt-3" v-if="item.id">
          <v-simple-table>
            <thead>
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
          </v-simple-table>
        </v-col>

        <template v-if="hasDetail">
          <v-col cols="12">
            <account-select
              label="گروه حساب تفضیلی شناور"
              itemsType="floatAccountGroups"
              v-model="item.floatAccountGroup"
              item-text="name"
            />
          </v-col>
          <v-col cols="12">
            <template v-if="hasCostCenter">
              <account-select
                label="گروه مرکز هزینه"
                itemsType="costCenterGroups"
                v-model="item.costCenterGroup"
                item-text="name"
              />
            </template>
          </v-col>
          <v-col cols="12">
            <money label="سقف بدهکاری" class="form-control" v-model="item.max_bed" />
          </v-col>
          <v-col cols="12">
            <money label="سقف بستانکاری" class="form-control" v-model="item.max_bes" />
          </v-col>
          <v-col cols="12">
            <v-textarea label="توضیحات" rows="3" v-model="item.explanation" />
          </v-col>
        </template>

        <template v-if="isBank">
          <v-col cols="12" md="4">
            <v-text-field label="نام بانک" v-model="item.bank_name" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="نام شعبه" v-model="item.branch_name" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="کد شعبه" v-model="item.branch_code" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="شماره حساب" class="form-control" v-model="item.account_number" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="کد شبا" v-model="item.sheba" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="شماره تماس" class="form-control" v-model="item.phone" />
          </v-col>
        </template>

        <template v-if="isPerson">
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              :items="[{text: 'خریدار', value: 'b'}, {text: 'فروشنده', value: 's'}]"
              v-model="item.person_type"
              item-text="text"
              item-value="value"
              :return-object="false"
              label="حساب شخص"
              required
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              :items="[{text: 'حقیقی', value: true}, {text: 'حقوقی', value: false}]"
              v-model="item.is_real"
              item-text="text"
              item-value="value"
              :return-object="false"
              :disabled="item.id"
              label="نوع شخص"
              required
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="موبایل" v-model="item.mobile" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="شماره تماس 1" v-model="item.phone_1" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="شماره تماس 2" v-model="item.phone_2" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="شماره ملی" v-model="item.melli_code" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="وبسایت" v-model="item.website" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="فکس" v-model="item.fax" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="ایمیل" v-model="item.email" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="استان" v-model="item.province" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="شهر" v-model="item.city" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="کد پستی" v-model="item.postal_code" />
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea label="آدرس 1" v-model="item.address_1" />
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea label="آدرس 2" v-model="item.address_2" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="شماره حساب 1" v-model="item.account_number_1" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="شماره حساب 2" v-model="item.account_number_2" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="کد اقتصادی" v-model="item.eghtesadi_code" />
          </v-col>
        </template>
      </v-row>
    </template>
  </list-modal-form>
</template>
<script>
import { fromCodeFilter, toCodeFilter } from "@/mixin/accountMixin.js";
import AccountApiMixin from "@/mixin/accountMixin";
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";

export default {
  mixins: [ListModalFormMixin, AccountApiMixin],
  props: {
    level: {
      requried: true
    },
    account_type: {
      default: "o"
    },
    usage: {
      default: null
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
    itemsType() {
      if (this.account_type == "o") {
        return "level" + (this.level - 1);
      }
      if (this.account_type == "b") return "buyers";
      if (this.account_type == "p") return "sellers";
      return "all";
    },
    hasParent() {
      return this.level != 0 && !this.isBank && !this.isPerson;
    },
    hasDetail() {
      return this.level == 3;
    },
    hasCostCenter() {
      return true;
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