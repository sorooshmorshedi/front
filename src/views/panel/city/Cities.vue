<template>
  <div class="rtl">
    <m-form
      title="شهر"
      :items="items"
      :cols="cols"
      :canSubmit="canSubmit"
      :canDelete="canDelete"
      :is-editing.sync="isEditing"
      :showListBtn="false"
      :show-navigation-btns="false"
      @rowClick="setItem"
      @clearForm="clearForm"
      @submit="submit"
      @delete="deleteItem"
    >
      <template #default>
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field label=" * نام" v-model="item.name" :disabled="!isEditing" />
          </v-col>
        </v-row>
      </template>
    </m-form>
  </div>
</template>
<script>
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";
import getCitiesApi from "./getCitiesApi";

export default {
  mixins: [ListModalFormMixin, getCitiesApi],
  props: {},
  data() {
    return {
      baseUrl: "users/cities",
      permissionBasename: "city",
      cols: [
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
    items() {
      return this.$store.state.cities;
    }
  },
  methods: {
    getData() {
      this.getCities();
    }
  }
};
</script>