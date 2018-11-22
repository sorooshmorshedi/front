<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right ">
        <div class="card-body">
          <div class="title">
            دفتر روزنامه
          </div>
          <div class="row">
            <div class="col-lg-12">
              <div class="card right ">
                <div class="card-body">
                  <div class="row">
                    <div class="form-group col-lg-2">
                      <label>سطح حساب</label>
                      <select class="custom-select " v-model="accountLevel">
                        <option value="0">گروه</option>
                        <option value="1">کل</option>
                        <option value="2">معین</option>
                        <option value="3">تفضیلی</option>
                      </select>
                    </div>
                    <div class="col-lg-12">
                      <datatable :cols="datatableCols.cols" :url="datatableCols.url" />
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
import accountApiMixin from "@/mixin/accountApi";
import datatableCols from "./_datatableCols";
import _ from "lodash";
export default {
  name: "Journal",
  components: { datatable },
  mixins: [accountApiMixin],
  props: ["journalAccountIds"],
  data() {
    return {
      datatableCols,
      accountLevel: 0
    };
  },
  created() {
    this.getData();
    console.log(this.journalAccountIds);
  },
  methods: {
    getData() {
      this.getAccounts();
      this.init();
    },
    init() {
      if (!this.journalAccountIds) {
        this.journals = [{}];
        return;
      }
      for (const id of this.journalAccountIds) {
        let acc = this.findAccount('id', id);
        this.journals.push({
          level: acc.level,
          account: acc
        });
      }
    },
    deleteJournal(journal) {
      this.journals.splice(this.journals.indexOf(journal), 1);
    }
  },
  watch: {
    journals: {
      handler() {
        if (this.journals[this.journals.length - 1].level)
          this.journals.push({});
      },
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
.journal {
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
