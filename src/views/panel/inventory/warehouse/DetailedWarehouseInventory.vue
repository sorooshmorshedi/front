<template>
  <v-card>
    <v-card-title>کاردکس انبار</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" md="8">
          <ware-select label="کالا" @change="o => filters.ware = o.id" />
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            :return-object="false"
            label="انبار"
            :items="warehouses"
            v-model="filters.warehouse"
            item-text="title"
            item-value="id"
            clearable
          />
        </v-col>
        <v-col cols="12">
          <m-datatable
            v-if="filters.ware"
            :api-url="url"
            :headers="headers"
            :filters.sync="filters"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import wareApiMixin from "@/mixin/wareApi";
import _ from "lodash";
export default {
  mixins: [wareApiMixin],
  data() {
    return {
      url: "reports/inventory/warehouse",
      headers: [
        {
          text: "تاریخ",
          value: "factor.date",
          type: "date",
          sortable: false,
          filterable: false,
        },
        {
          text: "نوع فاکتور",
          value: "factor.type",
          sortable: false,
          filterable: false,
          items: [
            {
              label: "خرید",
              value: "buy",
            },
            {
              label: "برگشت از خرید",
              value: "backFromBuy",
            },
            {
              label: "فروش",
              value: "sale",
            },
            {
              label: "برگشت از فروش",
              value: "backFromSale",
            },
            {
              label: "موجودی اول دوره",
              value: "fpi",
            },
            {
              label: "وارده از انتقال",
              value: "it",
            },
            {
              label: "صادره با انتقال",
              value: "ot",
            },
          ],
        },
        {
          text: "عطف فاکتور",
          value: "factor.id",
          sortable: false,
          filterable: false,
        },
        {
          text: "شماره فاکتور",
          value: "factor.code",
          sortable: false,
          filterable: false,
        },
        {
          text: "شرح فاکتور",
          value: "factor.explanation",
          sortable: false,
          filterable: false,
        },
        {
          text: "انبار",
          value: "warehouse.name",
          sortable: false,
          filterable: false,
        },
        {
          text: "نام حساب",
          value: "factor.account.name",
          sortable: false,
          filterable: false,
        },
        {
          text: "وارده",
          value: "input",
          type: "numeric",
          sortable: false,
          filterable: false,
        },
        {
          text: "صادره",
          value: "output",
          type: "numeric",
          sortable: false,
          filterable: false,
        },
        {
          text: "مانده",
          value: "remain",
          type: "numeric",
          sortable: false,
          filterable: false,
        },
      ],
      filters: {
        ware: null,
        warehouse: null,
      },
    };
  },
  created() {
    this.getWarehouses();
  },
  methods: {},
};
</script>

<style scoped lang="scss">
</style>
