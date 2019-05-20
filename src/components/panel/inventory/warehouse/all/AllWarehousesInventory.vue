<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <div class="title">کاردکس انبار همه کالا ها</div>

          <div class="row inventory">
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
            <div class="col-lg-12">
              <div class="card right">
                <div class="card-body">
                  <div class="row">
                    <div class="col-lg-12">
                      <datatable
                        :url="url"
                        :cols="datatableCols.cols"
                        :defaultFilters="defaultFilters"
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
  props: ["warehouseId"],
  data() {
    return {
      url: "reports/inventory/warehouse/all",
      warehouse: null,
      datatableCols,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      Promise.all([this.getWarehouses()]).then(data => {
        this.init();
      });
    },
    init() {
      if (this.warehouseId) {
        this.warehouse = this.waresSelectValues.warehouses.filter(
          o => o.id == this.warehouseId
        )[0];
      }
    }
  },
  watch: {},
  computed: {
    defaultFilters(){
      let res = {}
      if(this.warehouse) res.warehouse = this.warehouse.id
      else res.warehouse = null
      return res
    }
  }
};
</script>

<style scoped lang="scss">
</style>
