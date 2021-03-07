<template>
  <m-form
    :title="title"
    :items="items"
    :cols="cols"
    :canSubmit="canSubmit"
    :canDelete="canDelete"
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
      <template v-for="i in 4">
        <v-btn
          :key="i"
          v-if="i-1 != level"
          class="blue white--text mr-1 mt-1 mt-md-0"
          :to="`/panel/visitors/${i-1}`"
        >تعریف {{ getTitle(i-1) }}</v-btn>
        <v-btn
          :key="i"
          v-else
          class="blue white--text mr-1 mt-1 mt-md-0"
          @click="clearForm"
        >تعریف {{ getTitle(i-1) }}</v-btn>
      </template>
    </template>
    <template #default>
      <v-row>
        <v-col cols="12" v-if="level != 0">
          <v-autocomplete
            :label="'* ' + getTitle(level-1)"
            v-model="item.parent"
            :items="parentItems"
            item-text="user.name"
            item-value="id"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-autocomplete
            label="* کاربر"
            v-model="item.user"
            :items="users"
            item-text="name"
            item-value="id"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-if="item.id != undefined" label="کد" v-model="item.code" disabled />
        </v-col>

        <v-col cols="12" md="4">
          <money label="پورسانت ثابت" :disabled="!isEditing" v-model="item.fixed_commission" />
        </v-col>
        <v-col cols="12" md="4">
          <money label="درصد پورسانت" :disabled="!isEditing" v-model="item.commission_percent" />
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            label="بازه پورسانت"
            :items="commissionRanges"
            v-model="item.commissionRange"
            item-text="name"
            item-value="id"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12">
          <account-select
            :disabled="!isEditing"
            label="* حساب شناور"
            itemsType="floatAccounts"
            :child-of="visitorsDefaultAccount"
            v-model="item.floatAccount"
          />
        </v-col>
      </v-row>
    </template>
  </m-form>
</template>
<script>
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";
import DistributionApiMixin from "@/modules/distribution/api";
import { VisitorLevels } from "@/variables";
import UserApiMixin from "@/views/panel/user/api";
import AccountSelect from "@/components/selects/AccountSelect.vue";
import AccountApiMixin from "@/mixin/accountMixin";

export default {
  components: { AccountSelect },
  mixins: [MFormMixin, DistributionApiMixin, UserApiMixin, AccountApiMixin],
  props: {
    level: {
      requried: true,
    },
    usage: {
      default: null,
    },
  },
  data() {
    return {
      item: {},
      baseUrl: "distributions/visitors",
      appendSlash: true,
      cols: [
        {
          text: "کد",
          value: "code",
        },
        {
          text: "نام",
          value: "user.name",
        },
        {
          text: "پورسانت ثابت",
          value: "fixed_commission",
          type: "numeric",
        },
        {
          text: "درصد پورسانت",
          value: "commission_percent",
        },
        {
          text: "بازه پورسانت",
          value: "commissionRange.name",
        },
      ],
    };
  },
  computed: {
    title() {
      return this.getTitle(this.level);
    },
    permissionBasename() {
      return "visitor";
    },
    parentTitle() {
      return this.getTitle(+this.level - 1);
    },
    items() {
      return this.visitors.filter((o) => o.level == this.level);
    },
    parentItems() {
      return this.visitors.filter((o) => o.level == this.level - 1);
    },
    visitorsDefaultAccount() {
      let defaultAccount = this.defaultAccounts.find(
        (o) => o.codename == "visitorsAccount"
      );
      if (defaultAccount) {
        return defaultAccount.account.floatAccountGroup.id;
      }
      return null;
    },
  },
  methods: {
    getData() {
      this.getVisitors(true);
      this.getDefaultAccounts();
      this.getCommissionRanges();
      this.getUsers();
    },
    getTitle(level) {
      return VisitorLevels.find((o) => o.value == level).text;
    },
    getItemTemplate() {
      return {
        level: +this.level,
      };
    },
  },
};
</script>