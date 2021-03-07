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
        <v-col cols="12">
          <v-autocomplete
            label="* کاربر"
            v-model="item.user"
            :items="users"
            item-text="name"
            item-value="id"
            :disabled="!isEditing"
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

export default {
  mixins: [MFormMixin, DistributionApiMixin, UserApiMixin],
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
  },
  methods: {
    getData() {
      this.getDistributors(true);
      this.getUsers();
    },
  },
};
</script>