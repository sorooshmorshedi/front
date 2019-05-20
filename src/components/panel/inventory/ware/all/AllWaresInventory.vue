<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <div class="title">کاردکس کالا ها</div>

          <div class="row inventory">
            <div class="col-lg-12">
              <div class="card right">
                <div class="card-body">
                  <div class="row">
                    <div class="col-lg-12">
                      <datatable
                        :url="url"
                        :cols="datatableCols.cols"
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
import datatable from "@/components/mcomponents/datatable/Server";
import datatableCols from "./_datatableCols";
import _ from "lodash";
export default {
  components: { datatable },
  data() {
    return {
      url: "reports/inventory/ware/all",
      datatableCols,
    };
  },
  created() {
    this.getData();
  },
  methods: {},
  watch: {},
  computed: {
  }
};
</script>

<style scoped lang="scss">
</style>
