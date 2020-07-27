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
      <template v-if="hasRemittance">
        <v-row>
          <v-col cols="12" md="3">
            <v-autocomplete
              label="شماره حواله"
              v-model="remittance"
              :disabled="!editable"
              :items="remittances"
              :search-input.sync="remittanceSearch"
              item-text="code"
              clearable
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

          <v-col cols="12" md="3">
            <money label="انعام راننده" v-model="item.driver_tip_price" :disabled="!editable" />
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
            <v-text-field label="شماره بارگیری" v-model="item.lading_number" :disabled="!editable" />
          </v-col>
          <v-col cols="12" md="3">
            <date
              label="تاریخ بارگیری"
              v-model="item.lading_date"
              :default="true"
              :disabled="!editable"
            />
          </v-col>
          <v-col cols="12" md="3">
            <money
              label="مقدار بارنامه مبدا"
              v-model="item.original_amount"
              :disabled="!editable"
              @input="!is_destination_amount_dirty?item.destination_amount = item.original_amount:''"
            />
          </v-col>
          <v-col cols="12" md="3">
            <money
              label="مقدار بارنامه مقصد"
              v-model="item.destination_amount"
              :disabled="!editable"
              @input="is_destination_amount_dirty = true"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-file-input label="فایل" />
          </v-col>
          <v-col cols="12">
            <v-textarea
              label="توضیحات بارگیری"
              v-model="item.lading_explanation"
              :disabled="!editable"
            />
          </v-col>

          <template v-if="item.driving">
            <v-col cols="3">
              <money
                label="مبلغ کل"
                :value="item.destination_amount * item.contractor_price"
                disabled
              />
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
          </template>

          <v-col cols="12">
            <v-divider color="indigo" style="border-width: 2px;"></v-divider>
          </v-col>
        </v-row>
      </template>
      <v-row>
        <v-col cols="12">
          <v-card-title class="py-0">بارنامه دولتی</v-card-title>
        </v-col>
        <v-col cols="12" md="3">
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
          <money label="انعام باربری" v-model="item.cargo_tip_price" :disabled="!editable" />
        </v-col>

        <v-col cols="12" md="3">
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

        <v-col cols="12" md="3">
          <v-autocomplete
            label="سری بارنامه"
            :items="ladingBillSeriesItems"
            v-model="ladingBillSeries"
            item-text="serial"
            no-filter
            :search-input.sync="ladingBillSearchInput"
            :disabled="!editable"
            @change="ladingBillSeries && (item.billNumber = ladingBillSeries.numbers.filter(o=> !o.is_revoked)[0])"
            clearable
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3">
          <v-autocomplete
            label="شماره بارنامه"
            :items="ladingBillSeries?ladingBillSeries.numbers.filter(o => !o.is_revoked):[]"
            v-model="item.billNumber"
            item-text="number"
            :disabled="!editable"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3">
          <date
            label="تاریخ بارنامه"
            v-model="item.bill_date"
            :default="true"
            :disabled="!editable"
          />
        </v-col>
        <v-col cols="12" md="3">
          <money label="مبلغ بارنامه" v-model="item.bill_price" :disabled="!editable" />
        </v-col>

        <v-col cols="12" md="3">
          <v-autocomplete
            label="نحوه دریافت"
            v-model="item.receive_type"
            :items="receiveTypes"
            :disabled="!editable"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-file-input label="فایل"></v-file-input>
        </v-col>

        <v-col cols="12" md="9">
          <v-textarea
            label="توضیحات بارنامه"
            v-model="item.bill_explanation"
            :disabled="!editable"
          />
        </v-col>

        <v-col cols="3">
          <money label="مبلغ کل بارنامه" :value="billTotalPrice" disabled />
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
      ladingBillSearchInput: "",
      is_destination_amount_dirty: false,
      remittanceSearch: "",
      remittances: [],
      remittance: null
    };
  },
  computed: {
    billTotalPrice() {
      return (
        +this.item.association_price +
        +this.item.bill_price +
        +this.item.cargo_tip_price
      );
    }
  },
  watch: {
    ladingBillSearchInput() {
      this.getLadingBillSeries(this.ladingBillSearchInput);
    },
    remittanceSearch() {
      this.getRemittances(this.remittanceSearch);
    },
    remittance() {
      Object.keys(this.remittance).forEach(key => {
        if (key == "id") {
          this.item.remittance = this.remittance.id;
        } else {
          this.item[key] = null;
          this.$set(this.item, key, this.remittance[key]);
        }
      });
    }
  },
  methods: {
    getItemTemplate() {
      return {
        remittance: {},
        association: {
          id: null,
          price: null
        },
        lading_ware: null,
        lading_contractor_price: null,
        lading_contractor: null
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
    }
  }
};
</script>

<style scoped lang="scss">
</style>

