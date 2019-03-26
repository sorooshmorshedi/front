<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <div class="title">صورت حساب
          </div>
          <div class="row ledger">
            <div class="col-lg-12">
              <div class="card right">
                <div class="card-body">
                  <div class="row">
                    <div class="col-lg-6">
                      <label>حساب</label>
                      <multiselect
                        dir="rtl"
                        :options="accountsSelectValues.levels[3]"
                        v-model="account"
                        track-by="id"
                        label="title"
                        @select="getBill"
                        id="acc-select"
                      />
                    </div>

                    <div class="col-lg-12">
                      <datatable
                        v-if="account"
                        :cols="datatableCols.cols"
                        :data="rows"
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
import accountApiMixin from "@/mixin/accountApi";
import datatableCols from "./_datatableCols";
import _ from "lodash";
export default {
  name: "Ledger",
  components: { datatable },
  mixins: [accountApiMixin],
  props: ["accountId"],
  data() {
    return {
      account: null,
      rows: [],
      datatableCols
    };
  },
  created() {
    this.getData();
    this.init();
  },
  methods: {
    getData() {
      this.getAccounts();
    },
    getBill(account) {
      this.request({
        url: this.endpoint("reports/bill"),
        params: {
          account_id: account.id
        },
        success: (data) => {
          this.rows = data;
        }
      });
    },
    init() {}
  }
};
</script>

<style scoped lang="scss">
#acc-select {
  margin-bottom: 30px;
}
</style>
