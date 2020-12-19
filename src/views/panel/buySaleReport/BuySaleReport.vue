<template>
  <v-card>
    <v-card-title>گزارش {{ layout.title }}</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" md="8">
          <ware-select label="کالا" v-model="ware" />
        </v-col>
        <v-col cols="12" md="4" v-if="ware && ware.pricingType">
          نحوه محاسبه:
          <span>{{ ware.pricingType.name }}</span>
        </v-col>
        <v-col cols="12">
          <m-datatable
            v-if="filters.ware"
            :headers="headers"
            :api-url="url"
            :filters.sync="filters"
            ref="datatable"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import wareApiMixin from "@/mixin/wareApi";
export default {
  props: {
    wareId: {},
    type: {
      required: true,
    },
  },
  mixins: [wareApiMixin],
  data() {
    return {
      url: "reports/buySale",
      ware: null,
      filters: {
        factor__type__in: "",
        ware: "",
      },
      layout: {
        title: "",
      },
      headers: [
        {
          text: "نوع فاکتور",
          value: "factor.type",
          items: [
            {
              text: "موجودی اول دوره",
              value: "fpi",
            },
            {
              text: "فروش",
              value: "sale",
            },
            {
              text: "برگشت از فروش",
              value: "backFromSale",
            },
            {
              text: "خرید",
              value: "buy",
            },
            {
              text: "برگشت از خرید",
              value: "backFromBuy",
            },
          ],
        },
        {
          text: "تاریخ",
          value: "factor.date",
          type: "date",
        },
        {
          text: "شماره عطف",
          value: "factor.id",
        },
        {
          text: "شماره فاکتور",
          value: "factor.code",
        },
        {
          text: "خریدار/فروشنده",
          value: "factor.account.name",
          type: "text",
        },
        {
          text: "انبار",
          value: "warehouse.name",
          type: "text",
        },
        {
          text: "تعداد",
          value: "count",
          type: "numeric",
          sortable: false,
        },
        {
          text: "فی",
          value: "fee",
          type: "numeric",
          sortable: false,
        },
        {
          text: "مبلغ",
          value: "value",
          type: "numeric",
          sortable: false,
        },
        {
          text: "تخفیف",
          value: "discount",
          type: "numeric",
          sortable: false,
        },
        {
          text: "مبلغ کل",
          value: "total_value",
          type: "numeric",
          sortable: false,
        },
        {
          text: "شرح فاکتور",
          value: "factor.explanation",
          type: "text",
        },
        {
          text: "توضیحات",
          value: "explanation",
          type: "text",
        },
      ],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      Promise.all([this.getWares()]).then((data) => {
        this.init();
      });
    },
    init() {
      this.log("init list");
      this.setLayout();
      this.setDefaultFilters();

      if (this.wareId) {
        this.ware = this.wares.filter((o) => o.id == this.wareId)[0];
      }
    },
    setLayout() {
      if (this.type == "sale") this.layout.title = "فروش";
      else this.layout.title = "خرید";
    },
    setDefaultFilters() {
      if (this.type == "sale") {
        this.filters["factor__type__in"] = ["sale", "backFromSale"].join(",");
      } else {
        this.filters["factor__type__in"] = ["buy", "backFromBuy"].join(",");
      }
    },
    selectWare() {
      this.filters.ware = this.ware.id;
    },
  },
  watch: {
    form() {
      this.init();
    },
    type() {
      this.init();
    },
    ware: {
      handler() {
        this.selectWare();
      },
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
</style>