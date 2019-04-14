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
                    <div class="col-lg-4"></div>

                    <div class="col-lg-12">
                      <datatable
                        v-if="rows.length"
                        :cols="datatableCols.cols"
                        :data="rows"
                        :colHeaders="datatableCols.colHeaders"
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
import datatable from "@/components/mcomponents/datatable/Client";
import wareApiMixin from "@/mixin/wareApi";
import datatableCols from "./_datatableCols";
import _ from "lodash";
export default {
  name: "Inventory",
  components: { datatable },
  mixins: [wareApiMixin],
  props: ["wareId"],
  data() {
    return {
      datatableCols,
      ware: null,
      rows: []
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
    getInventoryReport() {
      if (!this.ware) return;
      this.request({
        url: this.endpoint("reports/inventory"),
        params: {
          ware: this.ware.id,
          warehouse: this.ware.warehouse.id
        },
        success: data => {
          this.rows = data;
        }
      });
    },
    init() {
      if (this.wareId) {
        this.ware = this.waresSelectValues.wares.filter(
          o => (o.id == this.wareId)
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
  }
};
</script>

<style scoped lang="scss">
</style>
