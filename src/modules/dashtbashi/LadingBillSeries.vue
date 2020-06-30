<template>
  <daily-form
    formName="سری بارنامه"
    title="سری بارنامه"
    @clearForm="clearForm(true)"
    :showNavigationButtons="true"
    :showSubmitAndClearForm="true"
    :hasList="false"
    :hasFirst="true"
    :hasLast="true"
    :hasPrev="true"
    :hasNext="true"
    :editable="editable"
    :deletable="this.id"
    @goToForm="getItemByPosition"
    @edit="makeFormEditable()"
    @validate="validate"
    @delete="deleteItem"
  >
    <template #inputs>
      <v-row>
        <v-col cols="12" md="3">
          <v-text-field disabled label="عطف" v-model="item.id" />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field label="سریال" v-model="item.serial" :disabled="!editable" />
        </v-col>
        <v-col cols="12" md="3">
          <money label="از شماره" v-model="item.from_bill_number" :disabled="!editable" />
        </v-col>
        <v-col cols="12" md="3">
          <money label="تا شماره" v-model="item.to_bill_number" :disabled="!editable" />
        </v-col>
      </v-row>
    </template>
  </daily-form>
</template>

<script>
import formsMixin from "@/mixin/forms";
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm";
import GetApi from "./GetApi";
export default {
  props: {
    id: {
      default: null
    }
  },
  mixins: [formsMixin, ListModalFormMixin, GetApi],
  data() {
    return {
      item: {},
      baseUrl: "dashtbashi/ladingBillSeries",
      leadingSlash: true,
      hasList: false,
    };
  },
  methods: {
    getData() {
      if (this.id) {
        this.getItem(this.id);
      }
    },
    validate(clearForm) {
      this.submit(clearForm);
    },
    getItemByPosition(pos) {
      this.request({
        url: this.endpoint("dashtbashi/ladingBillSeries/byPosition"),
        method: "get",
        params: {
          id: this.id,
          position: pos
        },
        success: data => {
          this.setItem(data);
        },
        error: error => {
          if (error.response.status == 404) {
            this.notify("حواله وجود ندارد", "warning");
          }
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>

