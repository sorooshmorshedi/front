<template>
  <m-form
    title
    :showList="false"
    :isEditing.sync="isEditing"
    :listRoute="{name:'LadingsReport'}"
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
    @clearForm="clearForm(true)"
  >
    <template #header-btns>
      <open-sanad-btn v-if="item.sanad" :sanad="item.sanad" />
    </template>
    <template>
      <v-row>
        <v-col cols="12" md="2">
          <v-text-field label="عطف" v-model="item.local_id" :disabled="true" />
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            :return-object="true"
            label="حمل کننده"
            v-model="item.driving"
            :items="$store.state.drivings"
            item-text="title"
            item-value="id"
            :disabled="!isEditing"
          />
        </v-col>

        <v-col cols="12" md="2">
          <v-autocomplete
            :return-object="false"
            label="نوع بارگیری"
            v-model="item.type"
            :disabled="!isEditing"
            :items="types"
            item-value="id"
          />
        </v-col>
      </v-row>
      <v-row v-if="item.type.includes('l')">
        <v-col cols="12">
          <v-card-title class="py-0">بارگیری</v-card-title>
        </v-col>
        <template>
          <v-col cols="12" md="2">
            <v-autocomplete
              :return-object="true"
              label="شماره حواله"
              v-model="remittance"
              :disabled="!isEditing"
              :items="remittances"
              :search-input.sync="remittanceSearch"
              :item-text="(item) => item.code + ' - ' + item.contractor.name"
              item-value="id"
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              label="شماره بارگیری"
              v-model="item.lading_number"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <date
              label="تاریخ سند"
              v-model="item.sanad_date"
              :default="true"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <date
              label="تاریخ بارگیری"
              v-model="item.lading_date"
              :default="true"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <ware-select label="کالا" v-model="item.ware" :disabled="!isEditing" />
          </v-col>

          <v-col cols="12" md="3">
            <account-select
              label="پیمانکار"
              v-model="item.contractor"
              :disabled="!isEditing"
              items-type="level3"
            />
          </v-col>
          <v-col cols="12" md="2">
            <money
              label="نرخ حواله پیمانکار"
              v-model="item.contractor_price"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <money label="نرخ کرایه" v-model="item.fare_price" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="2">
            <money
              label="فی کمیسیون"
              v-model="+item.contractor_price - +item.fare_price"
              :disabled="true"
            />
          </v-col>
          <v-col cols="12" md="3">
            <money label="انعام راننده" v-model="item.driver_tip_price" :disabled="!isEditing" />
          </v-col>

          <v-col cols="12" md="2">
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

          <v-col cols="12" md="2">
            <money
              label="مبلغ اختلاف بارنامه"
              v-model="item.lading_bill_difference"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-autocomplete
              :return-object="false"
              label="روش پرداخت مبلغ حواله"
              v-model="item.remittance_payment_method"
              :items="remittancePaymentMethods"
              :disabled="!isEditing"
            />
          </v-col>

          <v-col cols="12" md="2">
            <money
              label="مقدار بارنامه مبدا"
              v-model="item.origin_amount"
              :disabled="!isEditing"
              @input="!is_destination_amount_dirty?item.destination_amount = item.origin_amount:''"
            />
          </v-col>
          <v-col cols="12" md="2">
            <money
              label="مقدار بارنامه مقصد"
              v-model="item.destination_amount"
              :disabled="!isEditing"
              @input="is_destination_amount_dirty = true"
            />
          </v-col>
          <v-col cols="12" md="2">
            <city-select label="مبدا" v-model="item.origin" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="2">
            <city-select label="مقصد" v-model="item.destination" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="2">
            <m-file-input
              label="فایل"
              :disabled="!isEditing"
              v-model="item.lading_attachment"
              :delete-attachment.sync="item.delete_lading_attachment"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-autocomplete
              :return-object="false"
              label="نوع پیمانکار"
              v-model="item.contractor_type"
              :items="contractorTypes"
              :disabled="!isEditing"
              item-text="title"
              item-value="id"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-autocomplete
              :return-object="true"
              v-if="item.contractor_type == 'cmp'"
              label="نوع هزینه ی حمل"
              v-model="item.ware_type"
              :items="wareTypes"
              :disabled="!isEditing"
              item-text="title"
              item-value="id"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field
              v-if="item.created_by"
              label="کاربر"
              disabled
              v-model="item.created_by.name"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-textarea
              label="توضیحات بارگیری"
              v-model="item.lading_explanation"
              :disabled="!isEditing"
            />
          </v-col>
          <template v-if="item.driving">
            <v-col cols="2">
              <money label="مبلغ کل" :value="ladingTotalValue" disabled />
            </v-col>
            <v-col cols="2">
              <money
                :label="'درآمد کمسیون ' + (item.driving.car.owner == 'o'?'متفرقه': 'شرکت')"
                :value="companyCommissionIncome"
                disabled
              />
            </v-col>
            <v-col cols="2">
              <money
                :label="item.driving.car.owner == 'o'?'حساب پرداختنی راننده متفرقه':'درآمد ماشین'"
                :value="carIncome"
                disabled
              />
            </v-col>
          </template>

          <v-col cols="12">
            <v-divider color="indigo" style="border-width: 2px;"></v-divider>
          </v-col>
        </template>
      </v-row>
      <v-row v-if="item.type.includes('b')">
        <v-col cols="12">
          <v-card-title class="py-0">بارنامه دولتی</v-card-title>
        </v-col>
        <v-col cols="12" md="2">
          <v-autocomplete
            :return-object="true"
            label="سری بارنامه"
            :items="ladingBillSeriesItems"
            v-model="ladingBillSeries"
            item-text="serial"
            item-value="id"
            no-filter
            :search-input.sync="ladingBillSearchInput"
            :disabled="!isEditing"
            @change="ladingBillSeries && (item.billNumber = ladingBillSeries.numbers.filter(o=> !o.is_revoked)[0])"
            clearable
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="2">
          <v-autocomplete
            :return-object="true"
            label="شماره بارنامه"
            :items="ladingBillSeries?ladingBillSeries.numbers.filter(o => !o.is_revoked):[]"
            v-model="item.billNumber"
            item-text="number"
            item-value="id"
            :disabled="!isEditing"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="2">
          <date
            label="تاریخ بارنامه"
            v-model="item.bill_date"
            :default="true"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="2">
          <money label="مبلغ بارنامه" v-model="item.bill_price" :disabled="!isEditing" />
        </v-col>

        <v-col cols="12" md="2">
          <money label="انعام باربری" v-model="item.cargo_tip_price" :disabled="!isEditing" />
        </v-col>

        <v-col cols="12" md="2">
          <v-autocomplete
            :return-object="true"
            label="انجمن"
            v-model="item.association"
            :items="$store.state.associations"
            item-text="name"
            item-value="id"
            :disabled="!isEditing"
            @change="item.association_price = item.association.price"
          />
        </v-col>
        <v-col cols="12" md="2">
          <money label="مبلغ انجمن" v-model="item.association_price" :disabled="!isEditing" />
        </v-col>

        <v-col cols="12" md="2">
          <v-autocomplete
            :return-object="false"
            label="نحوه دریافت"
            v-model="item.receive_type"
            :items="receiveTypes"
            :disabled="!isEditing"
          />
        </v-col>

        <v-col cols="12" md="4">
          <money label="ارزش افزوده بارنامه دولتی" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="2">
          <m-file-input
            label="فایل"
            :disabled="!isEditing"
            v-model="item.bill_attachment"
            :delete-attachment.sync="item.delete_bill_attachment"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-textarea
            label="توضیحات بارنامه"
            v-model="item.bill_explanation"
            :disabled="!isEditing"
          />
        </v-col>

        <v-col cols="6">
          <money label="مبلغ کل بارنامه" :value="billTotalPrice" disabled />
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
      baseUrl: "dashtbashi/ladings",
      leadingSlash: true,
      permissionBasename: "lading",
      formData: true,
      hasList: false,
      hasIdProp: true,
      ladingBillSeries: null,
      ladingBillSeriesItems: [],
      ladingBillSearchInput: "",
      is_destination_amount_dirty: false,
      remittanceSearch: "",
      remittances: [],
      remittance: null,
      contractorTypes: [
        { id: "o", title: "سایر" },
        { id: "cmp", title: "شرکت" },
      ],
      wareTypes: [
        { id: "b", title: "خریداری شده" },
        { id: "s", title: "فروش رفته" },
      ],
      types: [
        {
          text: "بارگیری",
          id: "l",
        },
        {
          text: "بارگیری و بارنامه دولتی",
          id: "lb",
        },
        {
          text: "بارنامه دولتی",
          id: "b",
        },
      ],
    };
  },
  computed: {
    billTotalPrice() {
      let value =
        +this.item.association_price +
        +this.item.bill_price +
        +this.item.cargo_tip_price;
      this.item.lading_bill_total_value = Math.round(value * 100 || 0) / 100;
      return value;
    },
    ladingTotalValue() {
      let value = this.item.destination_amount * this.item.contractor_price;
      this.item.lading_total_value = Math.round(value * 100 || 0) / 100;
      return value;
    },
    companyCommissionIncome() {
      let value =
        this.item.destination_amount *
        (this.item.contractor_price - this.item.fare_price);
      this.item.company_commission_income = Math.round(value * 100 || 0) / 100;
      return value;
    },
    carIncome() {
      let value = this.item.destination_amount * this.item.fare_price;
      this.item.car_income = Math.round(value * 100 || 0) / 100;
      return value;
    },
  },
  watch: {
    ladingBillSearchInput() {
      this.getLadingBillSeries(this.ladingBillSearchInput);
    },
    remittanceSearch() {
      this.getRemittances(this.remittanceSearch);
    },
    remittance() {
      if (this.remittance) {
        if (
          this.item.remittance &&
          this.item.remittance.id == this.remittance.id
        ) {
          return;
        }
        Object.keys(this.remittance).forEach((key) => {
          if (key == "id") {
            this.item.remittance = this.remittance.id;
          } else if (!["local_id"].includes(key)) {
            this.item[key] = null;
            this.$set(this.item, key, this.remittance[key]);
          }
        });
      }
    },
  },
  methods: {
    clearForm() {
      this.isEditing = true;
      this.item = this.getItemTemplate();
      this.changeRouteTo(null);
      this.remittance = null;
    },
    getItemTemplate() {
      return {
        type: "",
        remittance: {},
        association: {
          id: null,
          price: null,
        },
        association_price: 0,
        cargo_tip_price: 0,
        contractor_type: this.contractorTypes[0],
        lading_ware: null,
        lading_contractor_price: null,
        lading_contractor: null,
        lading_bill_total_value: 0,
      };
    },
    getData() {
      this.getDrivings();
      this.getAssociations();
      if (this.id) {
        this.getItem(this.id);
      }
    },
    getLadingBillSeries(search) {
      this.request({
        loading: false,
        url: this.endpoint("dashtbashi/ladingBillSeries/?limit=10&offset=0"),
        method: "get",
        params: {
          serial__icontains: search,
        },
        success: (data) => {
          this.ladingBillSeriesItems = data["results"];
        },
      });
    },
    setItem(item) {
      this.item = item;
      this.remittance = item.remittance;
      this.ladingBillSeries = item.billNumber ? item.billNumber.series : null;
      this.changeRouteTo(item.id);
    },
    getItemByPosition(pos) {
      this.request({
        url: this.endpoint("dashtbashi/ladings/byPosition"),
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
            this.notify("بارگیری وجود ندارد", "warning");
          }
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
</style>

