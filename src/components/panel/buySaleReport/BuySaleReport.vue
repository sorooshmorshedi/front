<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <div class="title">گزارش {{ layout.title }}</div>

          <div class="row">
            <div class="form-group col-12 col-lg-6">
              <label>کالا</label>
              <multiselect
                :option-height="104"
                dir="rtl"
                :allow-empty="false"
                :options="waresSelectValues.wares"
                v-model="ware"
                track-by="id"
                label="title"
              />
            </div>
            <div class="col-12 col-lg-6">
              <label>انبار</label>
              <multiselect
                v-if="ware"
                dir="rtl"
                :allow-empty="false"
                :options="waresSelectValues.warehouses"
                v-model="ware.warehouse"
                track-by="id"
                label="title"
              />
            </div>
            <datatable
              v-if="ware"
              :cols="options.cols"
              :url="options.url"
              :default-filters="defaultFilters"
              ref="datatable"
              class="col-12 mt-4"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
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
        ware: "",
        warehouse: ""
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
      Promise.all([this.getWares(), this.getWarehouses()]).then(data => {
        this.init();
      });
    },
    init() {
      this.log("init list");
      this.setLayout();
      this.setDefaultFilters();

      if (this.wareId) {
        this.ware = this.waresSelectValues.wares.filter(
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
        this.defaultFilters["factor__type__in"] = ["sale", "backFromSale"].join(',');
      } else {
        this.defaultFilters["factor__type__in"] = ["buy", "backFromBuy"].join(',');
      }
    },
    selectWare() {
      this.defaultFilters["ware"] = this.ware.id;
      this.defaultFilters["warehouse"] = this.ware.warehouse.id;
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