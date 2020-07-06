<template>
  <daily-form
    formName="حواله"
    title="حواله"
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
          <v-text-field label="شماره حواله" v-model="item.code" :disabled="!editable" />
        </v-col>
        <v-col cols="12" md="3">
          <date v-model="item.issue_date" label="تاریخ صدور" :default="true" :disabled="!editable" />
        </v-col>
        <v-col cols="12" md="3">
          <date
            v-model="item.loading_date"
            label="تاریخ بارگیری"
            :default="true"
            :disabled="!editable"
          />
        </v-col>
        <v-col cols="12" md="3">
          <date
            v-model="item.end_date"
            label="تاریخ پایان حواله"
            :default="true"
            :disabled="!editable"
          />
        </v-col>
        <v-col cols="12" md="3">
          <money label="مقدار حواله" v-model="item.amount" :disabled="!editable" />
        </v-col>
        <v-col cols="12" md="6">
          <ware-select label="کالا" v-model="item.ware" :disabled="!editable" />
        </v-col>
        <v-col cols="12" md="3">
          <money label="نرخ حواله پیمانکار" v-model="item.contractor_price" :disabled="!editable" />
        </v-col>
        <v-col cols="12" md="3">
          <money label="نرخ کرایه" v-model="item.fare_price" :disabled="!editable" />
        </v-col>
        <v-col cols="12" md="3">
          <city-select label="مبدا" v-model="item.origin" :disabled="!editable" />
        </v-col>
        <v-col cols="12" md="3">
          <city-select label="مقصد" v-model="item.destination" :disabled="!editable" />
        </v-col>
        <v-col cols="12" md="3">
          <account-select label="نام پیمانکار" v-model="item.contractor" :disabled="!editable" />
        </v-col>

        <v-col cols="12" md="3">
          <money label="انعام" v-model="item.driver_tip_price" :disabled="!editable" />
        </v-col>

        <v-col cols="12" md="3">
          <v-autocomplete
            label="پرداخت کننده انعام"
            v-model="item.driver_tip_payer"
            :items="tipPayers"
            :disabled="!editable"
          />
        </v-col>

        <v-col cols="12" md="3">
          <money
            label="مبلغ اختلاف بارنامه"
            v-model="item.lading_bill_difference"
            :disabled="!editable"
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-autocomplete
            label="روش پرداخت مبلغ حواله"
            v-model="item.remittance_payment_method"
            :items="remittancePaymentMethods"
            :disabled="!editable"
          />
        </v-col>

        <v-col cols="12" md="9">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="!editable" />
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
      baseUrl: "dashtbashi/remittances",
      leadingSlash: true,
      hasList: false
    };
  },
  methods: {
    getData() {
      if (this.id) {
        this.getItem(this.id);
      }
    },
    getItem() {
      if (this.item.id == this.id) return;
      this.request({
        url: this.endpoint("dashtbashi/remittances/" + this.id + "/"),
        method: "get",
        success: data => {
          this.setItem(data);
        }
      });
    },
    validate(clearForm) {
      this.submit(clearForm);
    },
    getItemByPosition(pos) {
      this.request({
        url: this.endpoint("dashtbashi/remittances/byPosition"),
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

