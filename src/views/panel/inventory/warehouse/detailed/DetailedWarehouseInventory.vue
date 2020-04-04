<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <div class="title">کاردکس انبار</div>

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
                        :options="waresSelectValues.wares"
                        v-model="ware"
                        track-by="id"
                        label="title"
                      />
                    </div>
                    <div class="form-group col-12 col-lg-6">
                      <label>انبار</label>
                      <multiselect
                        :option-height="104"
                        dir="rtl"
                        :options="waresSelectValues.warehouses"
                        v-model="warehouse"
                        track-by="id"
                        label="title"
                      />
                    </div>
                    <div class="col-lg-4"></div>

                    <div class="col-lg-12">
                      <datatable
                        v-if="this.ware"
                        :url="url"
                        :cols="datatableCols.cols"
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
      url: "reports/inventory/warehouse",
      datatableCols,
      ware: null,
      warehouse: null,
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
      if (this.wareId) {
        this.ware = this.waresSelectValues.wares.filter(
          o => o.id == this.wareId
        )[0];
      }
    }
  },
  computed: {
    defaultFilters() {
      let res = {}
      if(this.ware) res.ware = this.ware.id
      else res.ware = null
      if(this.warehouse) res.warehouse = this.warehouse.id
      else res.warehouse = null
      return res
    }
  }
};
</script>

<style scoped lang="scss">
</style>
