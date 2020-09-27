<template>
  <m-form
    title="سری بارنامه"
    :listRoute="{name:'LadingBillSeriesList'}"
    :showNavigationButtons="true"
    :showSubmitAndClearForm="true"
    :showList="false"
    :isEditing.sync="isEditing"
    :canDelete="canDelete"
    :canSubmit="canSubmit"
    @clearForm="clearForm(true)"
    @goToForm="getItemByPosition"
    @submit="submit"
    @delete="deleteItem"
  >
    <template>
      <v-row>
        <v-col cols="12" md="2">
          <v-text-field disabled label="عطف" v-model="item.id" />
        </v-col>
        <v-col cols="12" md="2">
          <date label="تاریخ" v-model="item.date" :disabled="!isEditing" :default="true" />
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field label="سریال" v-model="item.serial" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="3">
          <money label="از شماره" v-model="item.from_bill_number" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="3">
          <money label="تا شماره" v-model="item.to_bill_number" :disabled="!isEditing" />
        </v-col>
      </v-row>
    </template>
  </m-form>
</template>

<script>
import formsMixin from "@/mixin/forms";
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm";
import GetApi from "./GetApi";
export default {
  props: {
    id: {
      default: null,
    },
  },
  mixins: [formsMixin, ListModalFormMixin, GetApi],
  data() {
    return {
      item: {},
      baseUrl: "dashtbashi/ladingBillSeries",
      leadingSlash: true,
      hasList: false,
      hasIdProp: true,
    };
  },
  methods: {
    getData() {
      if (this.id) {
        this.getItem(this.id);
      }
    },
    getItemByPosition(pos) {
      this.request({
        url: this.endpoint("dashtbashi/ladingBillSeries/byPosition"),
        method: "get",
        params: {
          id: this.id,
          position: pos,
        },
        success: (data) => {
          this.setItem(data);
        },
        error: (error) => {
          if (error.response.status == 404) {
            this.notify("حواله وجود ندارد", "warning");
          }
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
</style>

