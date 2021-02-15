<template>
  <v-card>
    <v-card-title>کاردکس همه کالا ها</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" md="4">
          <v-select :items="wareLevels" v-model="filters.level" label="سطح کالا" />
        </v-col>
        <v-col cols="12" md="4">
          <v-select :items="waresStatuses" v-model="filters.status" label="وضعیت کالا"></v-select>
        </v-col>
        <v-col cols="12" md="4" class="d-flex justify-center justify-md-end">
          <v-btn
            v-if="isAdvari"
            @click="sortInventory"
            color="blue white--text"
          >مرتب سازی کاردکس کالا</v-btn>
        </v-col>
        <v-col cols="12" class="all-wares-inventory">
          <m-datatable :api-url="url" :headers="headers" :filters.sync="filters" ref="datatable" />
        </v-col>
      </v-row>
    </v-card-text>

    <v-dialog
      v-model="errorDialog"
      scrollable
      max-width="1200px"
      transition="dialog-transition"
      :fullscreen="isPrinting"
    >
      <v-card>
        <v-card-title>اتمام عملیات مرتب سازی کاردکس کالا به دلیل منفی شدن کالا های زیر امکان پذیر نیست</v-card-title>

        <v-card-text>
          <m-datatable
            :headers="errorHeaders"
            :items="errors"
            :filters.sync="errorFilters"
            :isDialog="true"
          >
            <template #item.factor_item_order="{ item }">{{ +item.factor_item_order + 1 }}</template>
            <template #item.factor.code="{ item }">
              <v-btn
                :to="{name: 'FactorForm', params: {id: item.factor.id, type: item.factor.type}}"
                rounded
                outlined
                color="blue white--text"
                target="_blank"
              >{{ item.factor.code }}</v-btn>
            </template>
            <template #item.detail="{ item }">
              <open-inventory-btn :wareId="item.ware_id" />
            </template>
          </m-datatable>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import _ from "lodash";
import wareApiMixin from "@/mixin/wareApi";
import MDatatable from "@/components/mcomponents/datatable/MDatatable.vue";
import OpenInventoryBtn from "@/components/btns/OpenInventoryBtn";
export default {
  components: { MDatatable, OpenInventoryBtn },
  mixins: [wareApiMixin],
  data() {
    return {
      url: "reports/inventory/ware/all",
      headers: [
        {
          text: "کد",
          value: "code",
          sortable: false,
        },
        {
          text: "نام",
          value: "name",
          sortable: false,
        },
        {
          text: "واحد",
          value: "unit",
          sortable: false,
          filterable: false,
        },
        {
          text: "مقدار وارده",
          value: "input.count",
          type: "numeric",
          sortable: false,
          filterable: false,
        },
        {
          text: "فی وارده",
          value: "input.fee",
          type: "numeric",
          sortable: false,
          filterable: false,
        },
        {
          text: "مبلغ وارده",
          value: "input.value",
          type: "numeric",
          sortable: false,
          filterable: false,
        },
        {
          text: "مقدار صادره",
          value: "output.count",
          type: "numeric",
          sortable: false,
          filterable: false,
        },
        {
          text: "فی صادره",
          value: "output.fee",
          type: "numeric",
          sortable: false,
          filterable: false,
        },
        {
          text: "مبلغ صادره",
          value: "output.value",
          type: "numeric",
          sortable: false,
          filterable: false,
        },
        {
          text: "مقدار مانده",
          value: "remain.count",
          type: "numeric",
          sortable: false,
          filterable: false,
        },
        {
          text: "فی مانده",
          value: "remain.fee",
          type: "numeric",
          sortable: false,
          filterable: false,
        },
        {
          text: "مبلغ مانده",
          value: "remain.value",
          type: "numeric",
          sortable: false,
          filterable: false,
        },
      ],
      filters: {
        level: 3,
      },
      errors: [],
      errorDialog: false,
      errorFilters: {},
      errorHeaders: [
        {
          text: "کالا",
          value: "ware_name",
        },
        {
          text: "فاکتور",
          value: "factor.code",
        },
        {
          text: "شماره ردیف فاکتور",
          value: "factor_item_order",
        },
        {
          text: "تعداد کسری",
          value: "count",
        },
        {
          text: "",
          value: "detail",
          sortable: false,
          filterable: false,
          hideInExport: true,
        },
      ],
    };
  },
  methods: {
    sortInventory() {
      if (
        true ||
        confirm(
          ` آیا مرتب سازی کاردکس در سال مالی ${this.financialYear.name} انجام شود؟ `
        )
      ) {
        this.request({
          url: this.endpoint(`wares/sortInventory`),
          method: "post",
          success: () => {
            this.successNotify();
            this.$refs.datatable.getDataFromApi();
          },
          error: (error) => {
            this.errors = error.response.data[0]["messages"];
            this.errorDialog = true;
          },
        });
      }
    },
  },
};
</script>

<style lang="scss">
.all-wares-inventory #datatable > div.v-data-table__wrapper > table tr {
  td,
  th {
    &:nth-child(8),
    &:nth-child(11),
    &:nth-child(14) {
      border-right: 1px solid #e0e0e0 !important;
    }
  }
}
</style>
