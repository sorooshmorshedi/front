<template>
  <m-form
    title="حواله"
    @clearForm="clearForm(true)"
    :showList="false"
    :isEditing.sync="isEditing"
    :canDelete="canDelete"
    :canSubmit="canSubmit"
    :confirmBtnText="confirmBtnText"
    :cancelConfirmBtnText="cancelConfirmBtnText"
    :canConfirm="canConfirm"
    :canCancelConfirm="canCancelConfirm"
    @cancelConfirm="cancelConfirm"
    @confirm="confirm"
    @goToForm="getItemByPosition"
    @submit="submit"
    @delete="deleteItem"
  >
    <template>
      <v-row>
        <v-col cols="12" md="3">
          <v-text-field disabled label="عطف" v-model="item.local_id" />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field label="شماره حواله" v-model="item.code" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="3">
          <date
            v-model="item.issue_date"
            label="تاریخ صدور"
            :default="true"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="3">
          <date
            v-model="item.loading_date"
            label="تاریخ بارگیری"
            :default="true"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="3">
          <date
            v-model="item.end_date"
            label="تاریخ پایان حواله"
            :default="true"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="3">
          <money label="مقدار حواله" v-model="item.amount" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="6">
          <ware-select label="کالا" v-model="item.ware" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="3">
          <money label="نرخ حواله پیمانکار" v-model="item.contractor_price" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="3">
          <money label="نرخ کرایه" v-model="item.fare_price" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="3">
          <money label="انعام" v-model="item.driver_tip_price" :disabled="!isEditing" />
        </v-col>

        <v-col cols="12" md="3">
          <v-autocomplete
            :return-object="true"
            label="پرداخت کننده انعام"
            v-model="item.driver_tip_payer"
            :items="tipPayers"
            :disabled="!isEditing"
            item-text="title"
            item-value="id"
          />
        </v-col>

        <v-col cols="12" md="3">
          <money
            label="مبلغ اختلاف بارنامه"
            v-model="item.lading_bill_difference"
            :disabled="!isEditing"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-autocomplete
            :return-object="false"
            label="روش پرداخت مبلغ حواله"
            v-model="item.remittance_payment_method"
            :items="remittancePaymentMethods"
            :disabled="!isEditing"
          />
        </v-col>

        <v-col cols="12" md="3">
          <city-select label="مبدا" v-model="item.origin" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="3">
          <city-select label="مقصد" v-model="item.destination" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="3">
          <account-select
            label="نام پیمانکار"
            v-model="item.contractor"
            :disabled="!isEditing"
            items-type="level3"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="!isEditing" />
        </v-col>

        <v-col cols="12" md="3">
          <v-text-field
            v-if="item.created_by"
            label="کاربر"
            disabled
            v-model="item.created_by.name"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-switch label="اتمام بارگیری" v-model="item.is_finished" :disabled="!isEditing" />
        </v-col>
      </v-row>
    </template>
  </m-form>
</template>

<script>
import formsMixin from "@/mixin/forms";
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";
import GetApi from "./GetApi";
export default {
  props: {
    id: {
      default: null,
    },
  },
  mixins: [formsMixin, MFormMixin, GetApi],
  data() {
    return {
      item: {},
      hasList: false,
      hasIdProp: true,
      baseUrl: "dashtbashi/remittances",
      leadingSlash: true,
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
        url: this.endpoint("dashtbashi/remittances/byPosition"),
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

