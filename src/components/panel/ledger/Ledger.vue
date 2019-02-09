<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right ">
        <div class="card-body">
          <div class="title">
            دفتر کل، معین، تفضیلی
            <!-- <router-link :to="{name:'LedgerReport', query:{accs:[1,5]}}">asoidfj</router-link> -->
          </div>
          <transition-group name="list">

            <div class="row ledger" v-for="(ledger, i) in ledgers" :key="ledger.account.id">
              <div class="col-lg-12">
                <div class="card right ">
                  <div class="card-body">
                    <div class="row">
                      <div class="form-group col-lg-2">
                        <label>سطح حساب</label>
                        <select class="custom-select " v-model="ledger.level">
                          <option value="0">گروه</option>
                          <option value="1">کل</option>
                          <option value="2">معین</option>
                          <option value="3">تفضیلی</option>
                        </select>
                      </div>
                      <div class="col-lg-4">
                        <label>حساب</label>
                        <multiselect :disabled="ledger.level == undefined" dir="rtl" :options="ledger.level == undefined?[]:accountsSelectValues.levels[ledger.level]" v-model="ledger.account" track-by="id" label="title" />
                      </div>
                      <div class="col-lg-4"></div>
                      <div class="col-lg-2" v-if="i != ledgers.length-1">
                        <label class="text-center d-block">بستن گزارش این حساب</label>
                        <button @click="deleteLedger(ledger)" type="button" class="btn btn-warning btn-block">بستن</button>
                      </div>

                      <div class="col-lg-12">
                        <datatable v-if="ledger.account" :cols="datatableCols.cols" :url="datatableCols.url" :default-filters="{ account__code__startswith:ledger.account.code }" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import datatable from "@/components/mcomponents/datatable/Server";
import accountApiMixin from "@/mixin/accountApi";
import datatableCols from "./_datatableCols";
import _ from "lodash";
export default {
  name: "Ledger",
  components: { datatable },
  mixins: [accountApiMixin],
  props: ["ledgerAccountIds"],
  data() {
    return {
      datatableCols,
      ledgers: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.getAccounts();
      this.init();
    },
    init() {
      if (!this.ledgerAccountIds) {
        this.ledgers = [{}];
        return;
      }
      if (typeof this.ledgerAccountIds == "string") {
        let acc = this.findAccount("id", this.ledgerAccountIds);
        this.addLedger(acc);
      } else {
        for (const id of this.ledgerAccountIds) {
          let acc = this.findAccount('id', id);
          if (!acc) {
            console.error("There is no code ");
            return;
          }
          this.addLedger(acc);
        }
      }
    },
    addLedger(account) {
      this.ledgers.push({
        level: account.level,
        account: account
      });
    },
    deleteLedger(ledger) {
      this.ledgers.splice(this.ledgers.indexOf(ledger), 1);
    }
  },
  watch: {
    ledgers: {
      handler() {
        if (this.ledgers[this.ledgers.length - 1].level) this.ledgers.push({});
      },
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
.ledger {
  margin-bottom: 15px;
}

.list-item {
  // display: inline-block;
  // margin-right: 10px;
  transition: all 1s;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 1s;
}
</style>
