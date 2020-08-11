<template>
  <m-form
    title="بارگیری"
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
    @clearForm="clearForm(true)"
  >
    <template #header-btns>
      <open-sanad-btn v-if="item.sanad" :sanad="item.sanad" />
    </template>
    <template>
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
              :disabled="!isEditing"
              :items="remittances"
              :search-input.sync="remittanceSearch"
              item-text="code"
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <ware-select label="کالا" v-model="item.ware" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              label="نوع پیمانکار"
              v-model="item.contractor_type"
              :items="contractorTypes"
              :return-object="false"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
              v-if="item.contractor_type == 'cmp'"
              label="نوع کالا"
              v-model="item.ware_type"
              :items="wareTypes"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <money
              label="نرخ حواله پیمانکار"
              v-model="item.contractor_price"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <account-select label="پیمانکار" v-model="item.contractor" :disabled="!isEditing" />
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
              label="روش پرداخت مبلغ حواله"
              v-model="item.remittance_payment_method"
              :items="remittancePaymentMethods"
              :disabled="!isEditing"
            />
          </v-col>

          <v-col cols="12" md="3">
            <money label="نرخ کرایه" v-model="item.fare_price" :disabled="!isEditing" />
          </v-col>

          <v-col cols="12" md="3">
            <city-select label="مبدا" v-model="item.origin" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="3">
            <city-select label="مقصد" v-model="item.destination" :disabled="!isEditing" />
          </v-col>

          <v-col cols="12" md="3">
            <money label="انعام راننده" v-model="item.driver_tip_price" :disabled="!isEditing" />
          </v-col>

          <v-col cols="12" md="3">
            <v-autocomplete
              label="پرداخت کننده انعام"
              v-model="item.driver_tip_payer"
              :items="tipPayers"
              :disabled="!isEditing"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              label="شماره بارگیری"
              v-model="item.lading_number"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <date
              label="تاریخ بارگیری"
              v-model="item.lading_date"
              :default="true"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <money
              label="مقدار بارنامه مبدا"
              v-model="item.original_amount"
              :disabled="!isEditing"
              @input="!is_destination_amount_dirty?item.destination_amount = item.original_amount:''"
            />
          </v-col>
          <v-col cols="12" md="3">
            <money
              label="مقدار بارنامه مقصد"
              v-model="item.destination_amount"
              :disabled="!isEditing"
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
              :disabled="!isEditing"
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
            :disabled="!isEditing"
          />
        </v-col>

        <v-col cols="12" md="3">
          <money label="انعام باربری" v-model="item.cargo_tip_price" :disabled="!isEditing" />
        </v-col>

        <v-col cols="12" md="3">
          <v-autocomplete
            label="انجمن"
            v-model="item.association"
            :items="$store.state.associations"
            item-text="name"
            :disabled="!isEditing"
            @change="item.association_price = item.association.price"
          />
        </v-col>
        <v-col cols="12" md="3">
          <money label="مبلغ انجمن" v-model="item.association_price" :disabled="!isEditing" />
        </v-col>

        <v-col cols="12" md="3">
          <v-autocomplete
            label="سری بارنامه"
            :items="ladingBillSeriesItems"
            v-model="ladingBillSeries"
            item-text="serial"
            no-filter
            :search-input.sync="ladingBillSearchInput"
            :disabled="!isEditing"
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
            :disabled="!isEditing"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="3">
          <date
            label="تاریخ بارنامه"
            v-model="item.bill_date"
            :default="true"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="3">
          <money label="مبلغ بارنامه" v-model="item.bill_price" :disabled="!isEditing" />
        </v-col>

        <v-col cols="12" md="3">
          <v-autocomplete
            label="نحوه دریافت"
            v-model="item.receive_type"
            :items="receiveTypes"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-file-input label="فایل"></v-file-input>
        </v-col>

        <v-col cols="12" md="9">
          <v-textarea
            label="توضیحات بارنامه"
            v-model="item.bill_explanation"
            :disabled="!isEditing"
          />
        </v-col>

        <v-col cols="3">
          <money label="مبلغ کل بارنامه" :value="billTotalPrice" disabled />
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
      default: null
    }
  },
  mixins: [formsMixin, ListModalFormMixin, GetApi],
  data() {
    return {
      baseUrl: "dashtbashi/ladings",
      leadingSlash: true,
      permissionBasename: "lading",
      hasList: false,
      hasIdProp: true,
      hasRemittance: true,
      ladingBillSeries: null,
      ladingBillSeriesItems: [],
      ladingBillSearchInput: "",
      is_destination_amount_dirty: false,
      remittanceSearch: "",
      remittances: [],
      remittance: null,
      contractorTypes: [
        { id: "o", title: "سایر" },
        { id: "cmp", title: "شرکت" }
      ],
      wareTypes: [
        { id: "b", title: "خریداری شده" },
        { id: "s", title: "فروش رفته" }
      ]
    };
  },
  computed: {
    billTotalPrice() {
      let value =
        +this.item.association_price +
        +this.item.bill_price +
        +this.item.cargo_tip_price;
      this.item.lading_bill_total_value = value;
      return value;
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
        contractor_type: this.contractorTypes[0],
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

