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
          <datatable
            v-if="ware"
            :cols="options.cols"
            :url="options.url"
            :default-filters="defaultFilters"
            hasSum="1"
            sumColSpan="7"
            ref="datatable"
            class="col-12 mt-4"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import wareApiMixin from "@/mixin/wareApi";
import datatable from "@/components/mcomponents/datatable/Server";
import datatableOptions from "./datatableOptions";
export default {
  props: {
    wareId: {},
    type: {
      required: true
    }
  },
  mixins: [wareApiMixin],
  components: { datatable },
  data() {
    return {
      options: datatableOptions,
      showTable: false,
      defaultFilters: {
        factor__type__in: "",
        ware: ""
      },
      layout: {
        title: ""
      },
      ware: null
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      Promise.all([this.getWares()]).then(data => {
        this.init();
      });
    },
    init() {
      this.log("init list");
      this.setLayout();
      this.setDefaultFilters();

      if (this.wareId) {
        this.ware = this.wares.filter(
          o => o.id == this.wareId
        )[0];
      }
    },
    setLayout() {
      if (this.type == "sale") this.layout.title = "فروش";
      else this.layout.title = "خرید";
    },
    setDefaultFilters() {
      if (this.type == "sale") {
        this.defaultFilters["factor__type__in"] = ["sale", "backFromSale"].join(
          ","
        );
      } else {
        this.defaultFilters["factor__type__in"] = ["buy", "backFromBuy"].join(
          ","
        );
      }
    },
    selectWare() {
      this.defaultFilters["ware"] = this.ware.id;
    }
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
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
</style>