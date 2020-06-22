<template>
  <div class="rtl">
    <list-modal-form
      title="شهر"
      :items="items"
      :cols="cols"
      :deletable="item.id"
      @rowClick="setItem"
      @clearForm="clearForm"
      @submit="submit"
      @delete="deleteItem"
      ref="listModelForm"
    >
      <template #default>
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field label=" * نام" v-model="item.name" />
          </v-col>
        </v-row>
      </template>
    </list-modal-form>
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