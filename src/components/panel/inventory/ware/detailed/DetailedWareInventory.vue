<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <div class="title">کاردکس کالا</div>

          <div class="row inventory">
            <div class="col-lg-12">
              <div class="card right">
                <div class="card-body">
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
                    <div class="col-lg-4"></div>

                    <div class="col-lg-12">
                      <datatable
                        :url="url"
                        :cols="datatableCols.cols"
                        :colHeaders="datatableCols.colHeaders"
                        :defaultFilters="defaultFilters"
                        hasSum=1
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import datatable from "@/components/mcomponents/datatable/Server";
import wareApiMixin from "@/mixin/wareApi";
import datatableCols from "./_datatableCols";
import _ from "lodash";
export default {
  components: { datatable },
  mixins: [wareApiMixin],
  props: ["wareId"],
  data() {
    return {
      url: "reports/inventory/ware",
      datatableCols,
      ware: null,
      defaultFilters: {
        ware: null
      },
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
    getInventoryReport() {
      if (!this.ware) return;
      this.defaultFilters.ware = this.ware.id
    },
    init() {
      if (this.wareId) {
        this.ware = this.waresSelectValues.wares.filter(
          o => o.id == this.wareId
        )[0];
      }
    }
  },
  watch: {
    ware: {
      handler() {
        this.getInventoryReport();
      },
      deep: true
    }
  },
  computed: {
  }
};
</script>

<style scoped lang="scss">
</style>
