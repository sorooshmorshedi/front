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
      @click:row="setItem"
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
import { MFormMixin } from "@/components/m-form";
import getCitiesApi from "./getCitiesApi";

export default {
  mixins: [MFormMixin, getCitiesApi],
  props: {},
  data() {
    return {
      baseUrl: "users/cities",
      permissionBasename: "city",
      cols: [
        {
          text: "نام",
          value: "name",
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