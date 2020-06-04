<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title>دفتر کل، معین، تفضیلی</v-card-title>
      </v-card>
    </v-col>
    <v-col cols="12" class="ledger" v-for="(ledger, i) in ledgers" :key="ledger.id">
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                v-model="ledger.level"
                label="سطح حساب"
                :items="accountLevels"
                item-text="text"
                item-value="value"
                :return-object="false"
              />
            </v-col>
            <v-col cols="12" md="6">
              <account-select
                label="حساب"
                v-if="ledger.level"
                :deep-select="false"
                :items-type="'level' + ledger.level"
                v-model="ledger.account"
              />
            </v-col>
            <v-col cols="12" md="2" v-if="i != ledgers.length-1" class="text-left">
              <v-btn
                label="بستن گزارش این حساب"
                @click="deleteLedger(ledger)"
                icon
                class="red--text"
              >
              <v-icon>fa-times</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12">
              <div class="card right">
                <div class="card-body">
                  <div class="row">
                    <div class="form-group col-lg-2"></div>
                    <div class="col-lg-4"></div>
                    <div class="col-lg-4"></div>

                    <div class="col-lg-12">
                      <datatable
                        v-if="ledger.account"
                        :cols="datatableCols.cols"
                        :url="datatableCols.url"
                        :default-filters="{ account__code__startswith:ledger.account.code }"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import datatable from "@/components/mcomponents/datatable/Server";
import accountApiMixin from "@/mixin/accountMixin";
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
      ledgers: [],
      accountLevels: [
        { value: 0, text: "گروه" },
        { value: 1, text: "کل" },
        { value: 2, text: "معین" },
        { value: 3, text: "تفضیلی" }
      ]
    };
  },
  created() {
    this.getData();
    this.init();
  },
  methods: {
    getData() {
      this.getAccounts(false, true);
    },
    init() {
      if (!this.ledgerAccountIds) {
        this.ledgers = [
          {
            id: 0
          }
        ];
        return;
      }
      if (typeof this.ledgerAccountIds == "string") {
        let acc = this.findAccount("id", +this.ledgerAccountIds);
        this.addLedger(acc);
      } else {
        for (const id of this.ledgerAccountIds) {
          let acc = this.findAccount("id", id);
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
        id: account.id,
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
        let lastLedger = this.ledgers[this.ledgers.length - 1];
        if (lastLedger.level) {
          this.ledgers.push({ id: lastLedger.id + 1 });
        }
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
