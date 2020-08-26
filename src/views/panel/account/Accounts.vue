<template>
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
    :showList="usage != 'tree'"
    @click:row="setItem"
    @clearForm="clearForm"
    @submit="submit"
    @delete="deleteItem"
  >
    <template #header-btns>
      <template v-if="item.id != undefined">
        <v-btn class="blue white--text mr-1" @click="openLedger(item)">دفتر این حساب</v-btn>
      </template>

      <template v-for="i in 4" v-if="!isBank && !isPerson">
        <v-btn
          :key="i"
          v-if="i-1 != level"
          class="blue white--text mr-1"
          :to="`/panel/accounts/${i-1}`"
        >تعریف {{ getTitle(i-1) }}</v-btn>
        <v-btn
          :key="i"
          v-else
          class="blue white--text mr-1"
          @click="clearForm"
        >تعریف {{ getTitle(i-1) }}</v-btn>
      </template>
    </template>
    <template #default>
      <v-row>
        <template v-if="hasParent">
          <v-col cols="12">
            <account-select
              :label="' * ' + parentTitle"
              :itemsType="itemsType"
              v-model="item.parent"
              :disabled="item.id != undefined || !isEditing"
            />
          </v-col>
          <v-col cols="12" v-if="parents.length">
            <v-breadcrumbs :items="parents">
              <template v-slot:divider>
                <v-icon>fa-chevron-left</v-icon>
              </template>
            </v-breadcrumbs>
          </v-col>
        </template>
        <v-col cols="12" v-if="level != 0">
          <v-autocomplete
            label="نوع"
            :items="accountTypes"
            v-model="item.type"
            :disabled="!isEditing"
            item-text="name"
            item-value="id"
          />
        </v-col>
        <v-col cols="12" v-if="item.id != undefined">
          <v-text-field label="کد" v-model="item.code" disabled />
        </v-col>
        <v-col cols="12">
          <v-text-field label=" * نام" v-model="item.name" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" class="mt-3" v-if="item.id != undefined && item.balance">
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
          <v-col cols="12" md="6">
            <account-select
              label="گروه حساب تفضیلی شناور"
              itemsType="floatAccountGroups"
              v-model="item.floatAccountGroup"
              item-text="name"
              item-value="id"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="6">
            <template v-if="hasCostCenter">
              <account-select
                label="گروه مرکز هزینه"
                itemsType="costCenterGroups"
                v-model="item.costCenterGroup"
                item-text="name"
                :disabled="!isEditing"
              />
            </template>
          </v-col>
          <v-col cols="12" md="6">
            <money
              label="سقف بدهکاری"
              class="form-control"
              v-model="item.max_bed"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="6">
            <money
              label="سقف بستانکاری"
              class="form-control"
              v-model="item.max_bes"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea rows="2" label="توضیحات" v-model="item.explanation" :disabled="!isEditing" />
          </v-col>
        </template>

        <template v-if="isBank">
          <v-col cols="12" md="4">
            <v-text-field label="نام بانک" v-model="item.bank_name" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="نام شعبه" v-model="item.branch_name" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="کد شعبه" v-model="item.branch_code" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="شماره حساب"
              class="form-control"
              v-model="item.account_number"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="کد شبا" v-model="item.sheba" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="شماره تماس"
              class="form-control"
              v-model="item.phone"
              :disabled="!isEditing"
            />
          </v-col>
        </template>

        <template v-if="isPerson">
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              :items="[{text: 'خریدار', value: 'b'}, {text: 'فروشنده', value: 's'}]"
              v-model="item.buyer_or_seller"
              item-text="text"
              item-value="value"
              :return-object="false"
              label=" * حساب شخص"
              required
              :disabled="item.id != undefined"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              :items="personTypes"
              v-model="item.person_type"
              :disabled="item.id != undefined"
              label=" * نوع شخص"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="موبایل" v-model="item.mobile" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="شماره تماس 1" v-model="item.phone_1" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="شماره تماس 2" v-model="item.phone_2" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="شماره ملی" v-model="item.melli_code" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="وبسایت" v-model="item.website" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="فکس" v-model="item.fax" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="ایمیل" v-model="item.email" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="استان" v-model="item.province" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="شهر" v-model="item.city" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="کد پستی" v-model="item.postal_code" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea rows="2" label="آدرس 1" v-model="item.address_1" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea rows="2" label="آدرس 2" v-model="item.address_2" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="شماره حساب 1"
              v-model="item.account_number_1"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="شماره حساب 2"
              v-model="item.account_number_2"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="کد اقتصادی" v-model="item.eghtesadi_code" :disabled="!isEditing" />
          </v-col>
        </template>
      </v-row>
    </template>
  </m-form>
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
      personTypes: [
        {
          title: "حقیقی",
          id: "r"
        },
        {
          title: "حقوقی",
          id: "l"
        },
        {
          title: "پیمانکاران",
          id: "c"
        },
        {
          title: "سایر",
          id: "o"
        }
      ],
      cols: [
        {
          text: "کد حساب",
          value: "code",
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
          text: "نام حساب",
          value: "name",
          type: "text",
          filters: ["name"]
        },
        {
          text: "نوع",
          value: "type.name",
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
    permissionBasename() {
      return `account${this.level}`;
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
    },
    canClear() {
      return this.isPerson || this.isBank;
    },
    parents() {
      if (!this.hasParent || !this.item.parent) return [];
      let parents = [];
      this.accountParentsName(this.item).forEach(parent => {
        parents.push({
          text: parent
        });
      });
      // parents.splice(parent.length - 1, 1);
      return parents;
    }
  },
  methods: {
    getItemTemplate() {
      return {
        is_real: true
      };
    },
    getData() {
      this.getAccounts(true);
      this.getAccountTypes();
      this.getFloatAccountGroups(true);
    },
    getAccount(id) {
      return this.accounts.filter(o => (o.id = id))[0];
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