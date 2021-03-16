<template>
  <m-form
    title="موزع ها"
    :items="items"
    :cols="cols"
    :canSubmit="canSubmit"
    :canDelete="canDelete"
    :is-editing.sync="isEditing"
    :showListBtn="false"
    :show-navigation-btns="false"
    @click:row="setItem"
    @clearForm="clearForm"
    @submit="submit"
    @delete="deleteItem"
  >
    <template #default>
      <v-row>
        <v-col cols="12" md="4">
          <v-autocomplete
            label="* کاربر"
            v-model="item.user"
            :items="users"
            item-text="name"
            item-value="id"
            :disabled="!isEditing"
          />
        </v-col>

        <v-col cols="12" md="8">
          <v-autocomplete
            label="روش های دریافت"
            :disabled="!isEditing"
            :items="receiveTypes"
            v-model="item.defaultAccounts"
            item-text="name"
            item-value="id"
            :multiple="true"
          />
        </v-col>
      </v-row>
    </template>
  </m-form>
</template>
<script>
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";
import DistributionApiMixin from "@/modules/distribution/api";
import UserApiMixin from "@/views/panel/user/api";
import accountApiMixin from "@/mixin/accountMixin";

export default {
  mixins: [MFormMixin, DistributionApiMixin, UserApiMixin, accountApiMixin],
  data() {
    return {
      item: {},
      baseUrl: "distributions/distributors",
      permissionBasename: "distributor",
      appendSlash: true,
      cols: [
        {
          text: "نام",
          value: "user.name",
        },
      ],
    };
  },
  computed: {
    items() {
      return this.$store.state.distributors;
    },
    receiveTypes() {
      let type = "receive";
      return this.defaultAccounts.filter(
        (o) => o.usage && o.usage.toLowerCase().includes(type)
      );
    },
  },
  methods: {
    getData() {
      this.getDefaultAccounts();
      this.getUsers();
      this.getDistributors(true);
    },
  },
};
</script>