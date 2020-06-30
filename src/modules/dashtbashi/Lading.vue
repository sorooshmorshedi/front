<template>
  <daily-form
    formName="بارگیری"
    title="بارگیری"
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
      <v-row v-if="!id">
        <v-col cols="12">
          <v-switch label="بارگیری سیستمی" v-model="hasRemittance"></v-switch>
        </v-col>
      </v-row>
      <template v-if="hasRemittance && item.remittance">
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              label="شماره حواله"
              v-model="item.remittance.code"
              :disabled="!editable"
              append-icon="fa-search"
              @click:append="getRemittanceByCode"
            />
          </v-col>
          <v-col cols="12" md="3">
            <ware-select label="کالا" v-model="item.ware" :disabled="!editable" />
          </v-col>
          <v-col cols="12" md="3">
            <money
              label="نرخ حواله پیمانکار"
              v-model="item.contractor_price"
              :disabled="!editable"
            />
          </v-col>
          <v-col cols="12" md="3">
            <account-select label="پیمانکار" v-model="item.contractor" :disabled="!editable" />
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

          <v-col cols="12" md="3">
            <money label="نرخ کرایه" v-model="item.fare_price" :disabled="!editable" />
          </v-col>

          <v-col cols="12" md="3">
            <city-select label="مبدا" v-model="item.origin" :disabled="!editable" />
          </v-col>
          <v-col cols="12" md="3">
            <city-select label="مقصد" v-model="item.destination" :disabled="!editable" />
          </v-col>

          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="2">
            <v-text-field label="شماره بارگیری" v-model="item.lading_number" :disabled="!editable" />
          </v-col>
          <v-col cols="12" md="2">
            <date
              label="تاریخ بارگیری"
              v-model="item.lading_date"
              :default="true"
              :disabled="!editable"
            />
          </v-col>
          <v-col cols="12" md="2">
            <money label="مقدار بارنامه مبدا" v-model="item.original_amount" :disabled="!editable" />
          </v-col>
          <v-col cols="12" md="2">
            <money
              label="مقدار بارنامه مقصد"
              v-model="item.destination_amount"
              :disabled="!editable"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-file-input label="فایل" />
          </v-col>
          <v-col cols="12">
            <v-textarea
              label="توضیحات بارگیری"
              v-model="item.lading_explanation"
              :disabled="!editable"
            />
          </v-col>

          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
        </v-row>
      </template>
      <v-row>
        <v-col cols="12">
          <v-card-title class="py-0">بارنامه دولتی</v-card-title>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field label="عطف" v-model="item.id" :disabled="true" />
        </v-col>
        <v-col cols="12" md="6">
          <v-autocomplete
            label="حمل کننده"
            v-model="item.driving"
            :items="$store.state.drivings"
            item-text="title"
            :disabled="!editable"
          />
        </v-col>

        <v-col cols="12" md="3">
          <money label="انعام" v-model="item.tip_price" :disabled="!editable" />
        </v-col>

        <v-col cols="12" md="3">
          <v-autocomplete
            label="پرداخت کننده انعام"
            v-model="item.tip_payer"
            :items="tipPayers"
            :disabled="!editable"
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-autocomplete
            label="انجمن"
            v-model="item.association"
            :items="$store.state.associations"
            item-text="name"
            :disabled="!editable"
            @change="item.association_price = item.association.price"
          />
        </v-col>
        <v-col cols="12" md="3">
          <money label="مبلغ انجمن" v-model="item.association_price" :disabled="!editable" />
        </v-col>

        <v-col cols="12" md="2">
          <v-autocomplete
            label="سری بارنامه"
            :items="ladingBillSeriesItems"
            v-model="ladingBillSeries"
            item-text="serial"
            no-filter
            :search-input.sync="ladingBillSearchInput"
            :disabled="!editable"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="2">
          <v-autocomplete
            label="شماره بارنامه"
            :items="ladingBillSeries?ladingBillSeries.numbers.filter(o => !o.is_revoked):[]"
            v-model="item.billNumber"
            item-text="number"
            :disabled="!editable"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="2">
          <date
            label="تاریخ بارنامه"
            v-model="item.bill_date"
            :default="true"
            :disabled="!editable"
          />
        </v-col>
        <v-col cols="12" md="2">
          <money label="مبلغ بارنامه" v-model="item.bill_price" :disabled="!editable" />
        </v-col>

        <v-col cols="12" md="2">
          <v-autocomplete
            label="نحوه دریافت"
            v-model="item.receive_type"
            :items="receiveTypes"
            :disabled="!editable"
          />
        </v-col>
        <v-col cols="12" md="2">
          <v-file-input label="فایل"></v-file-input>
        </v-col>

        <v-col cols="12" md="8">
          <v-textarea
            label="توضیحات بارنامه"
            v-model="item.bill_explanation"
            :disabled="!editable"
          />
        </v-col>

        <v-col cols="4">
          <money label="مبلغ کل بارنامه" :value="billTotalPrice" disabled />
        </v-col>
      </v-row>
      <v-row v-if="item.driving">
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="3">
          <money label="مبلغ کل" :value="item.destination_amount * item.contractor_price" disabled />
        </v-col>
        <v-col cols="3">
          <money
            :label="'درآمد کمسیون ' + (item.driving.car.owner == 'o'?'متفرقه': 'شرکت')"
            :value="item.destination_amount * (item.contractor_price - item.fare_price)"
            disabled
          />
        </v-col>
        <v-col cols="3">
          <money
            :label="item.driving.car.owner == 'o'?'حساب پرداختنی راننده متفرقه':'درآمد ماشین'"
            :value="item.destination_amount * item.fare_price"
            disabled
          />
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
      baseUrl: "dashtbashi/ladings",
      leadingSlash: true,
      hasList: false,
      hasRemittance: true,
      ladingBillSeries: null,
      ladingBillSeriesItems: [],
      ladingBillSearchInput: ""
    };
  },
  computed: {
    billTotalPrice() {
      return (
        +this.item.association.price +
        +this.item.bill_price +
        +this.item.tip_price
      );
    },
    itemTemplate() {
      return {
        remittance: {
          id: null,
          code: null
        },
        association: {
          id: null,
          price: null
        },
        lading_ware: null,
        lading_contractor_price: null,
        lading_contractor: null
      };
    }
  },
  watch: {
    ladingBillSearchInput() {
      this.getLadingBillSeries(this.ladingBillSearchInput);
    }
  },
  methods: {
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
          serial__icontains: search
        },
        success: data => {
          this.ladingBillSeriesItems = data["results"];
        }
      });
    },
    setItem(item) {
      // must be implemented, but by default
      this.item = item;
      this.ladingBillSeries = item.billNumber ? item.billNumber.series : null;
      if (!this.hasList && this.id != item.id) {
        this.changeRouteTo(item.id);
      }
    },
    validate(clearForm) {
      this.submit(clearForm);
    },
    getItemByPosition(pos) {
      this.request({
        url: this.endpoint("dashtbashi/ladings/byPosition"),
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
            this.notify("بارگیری وجود ندارد", "warning");
          }
        }
      });
    },
    getRemittanceByCode() {
      this.request({
        url: this.endpoint("dashtbashi/remittances/byCode"),
        method: "get",
        params: {
          code: this.item.remittance.code
        },
        success: data => {
          this.item.remittance = data;
          Object.keys(data).forEach(key => {
            if (["id"].includes(key)) return;
            this.item[key] = null;
            this.$set(this.item, key, data[key]);
          });
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

