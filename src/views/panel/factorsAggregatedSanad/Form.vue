<template>
  <m-form
    :title="title"
    :showList="false"
    :listRoute="{name:'FactorsAggregatedSanadsList'}"
    exportBaseUrl="reports/lists/factorsAggregatedSanad"
    :exportParams="{id: this.id}"
    :canDelete="canDelete"
    :canSubmit="canSubmit"
    :isEditing.sync="isEditing"
    @goToForm="getItemByPosition"
    @submit="submit"
    @delete="deleteItem"
    @clearForm="clearForm()"
  >
    <template #header-btns>
      <open-sanad-btn v-if="item.sanad" :sanad="item.sanad" />
    </template>

    <template>
      <v-row>
        <v-col cols="12" md="2">
          <v-text-field class="rounded-lg" disabled label="شماره" v-model="item.code" background-color="white" />
        </v-col>
        <v-col cols="12" md="2">
          <date v-model="item.date" label=" * تاریخ " :default="true" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
              class="rounded-lg"
            v-if="item.created_by"
            label="کاربر"
            disabled
            v-model="item.created_by.name"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-textarea class="rounded-lg" label="توضیحات" v-model="item.explanation" :disabled="!isEditing"></v-textarea>
        </v-col>

        <v-col cols="12" v-if="id">
          <v-card-subtitle
            v-if="isEditing"
          >فاکتور های فعلی (برای حذف فاکتور آن را از انتخاب خارج کنید)</v-card-subtitle>
          <m-datatable
            :headers="headers"
            :filters.sync="filters"
            v-model="factors"
            :showExportBtns="false"
            :items="item.factors"
            ref="datatable"
          >
            <template #item.payable_value="{ item }">{{ getFactorPayableValue(item) | toMoney }}</template>
            <template #item.detail="{ item }">
              <detail-link :to="to(item)" />
            </template>
          </m-datatable>
        </v-col>

        <template v-if="isEditing">
          <v-col cols="12" v-if="id">
            <v-card-subtitle>فاکتور هایی که میخواهید اضافه کنید از لیست پایین انتخاب کنید</v-card-subtitle>
          </v-col>
          <v-col cols="12" class="py-1">
            <m-datatable
              :headers="headers"
              :filters.sync="filters"
              v-model="factors"
              :showExportBtns="false"
              apiUrl="reports/lists/factors"
              ref="datatable"
            >
              <template #item.detail="{ item }">
                <detail-link :to="to(item)" />
              </template>
            </m-datatable>
          </v-col>
        </template>
      </v-row>
    </template>
  </m-form>
</template>

<script>
import { MFormMixin } from "@/components/m-form";
import FormsMixin from "@/mixin/forms";
import FactorMixin from "@/views/panel/factor/mixin";

export default {
  name: "DistributionForm",
  mixins: [MFormMixin, FormsMixin, FactorMixin],
  props: {
    type: {
      required: true,
    },
  },
  data() {
    return {
      baseUrl: "factors/factorsAggregatedSanads",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,

      filters: {
        type: this.type,
        is_defined: true,
        has_auto_sanad: false,
        aggregatedSanad__isnull: true,
      },

      factors: [],
      factor: null,
    };
  },
  computed: {
    title() {
      return "سند تجمیعی " + this.getFactorTitle(this.type, false);
    },
    permissionBasename() {
      let basenames = {
        buy: "buyFactor",
        sale: "saleFactor",
        backFromBuy: "backFromBuyFactor",
        backFromSale: "backFromSaleFactor",
        cw: "consumptionWareFactor",
        rc: "receipt",
        rm: "remittance",
        p: "production",
      };
      return basenames[this.type] + "AggregatedSanad";
    },
    headers() {
      return [
        {
          text: "شماره",
          value: "code",
        },
        {
          text: "تاریخ",
          value: "date",
          type: "date",
        },
        {
          text: "خریدار / فروشنده",
          value: "account.name",
        },
        {
          text: "شرح",
          value: "explanation",
        },
        {
          text: "مبلغ کل فاکتور",
          value: "total_sum",
          type: "numeric",
        },
        {
          text: "مشاهده فاکتور",
          value: "detail",
          sortable: false,
          filterable: false,
        },
      ];
    },
  },
  methods: {
    getItemTemplate() {
      return {
        factors: [],
      };
    },
    getItemByPosition(position) {
      return this.request({
        url: this.endpoint(`${this.baseUrl}/byPosition`),
        method: "get",
        params: {
          id: this.item.id,
          position: position,
        },
        success: (data) => {
          this.setItem(data);
        },
      });
    },
    getData() {},
    setItem(item) {
      this.item = item;
      this.changeRouteTo(item.id);
      this.factors = this.copy(item.factors);
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      item.type = this.type;
      item.factors = this.factors.map((o) => o.id);
      return item;
    },
    getItemByPosition(pos) {
      return this.request({
        url: this.endpoint("factors/factorsAggregatedSanads/byPosition"),
        method: "get",
        params: {
          type: this.type,
          id: this.item.id,
          position: pos,
        },
        success: (data) => {
          this.setItem(data, true);
        },
        error: (error) => {
          if (error.response.status == 404) {
            this.notify("فاکتور وجود ندارد", "warning");
          }
        },
      });
    },
    to(item) {
      return {
        name: "FactorForm",
        params: {
          isPreFactor: item.is_pre_factor,
          type: item.type,
          id: item.id,
        },
      };
    },
    clearForm() {
      this.isEditing = true;
      this.item = this.getItemTemplate();
      this.factors = [];
      this.changeRouteTo(null);
    },
  },
};
</script>

<style scoped lang="scss"></style>

