<template>
  <v-card>
    <v-card-title>دفتر روزنامه</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            label="سطح حساب"
            v-model="accountLevel"
            item-text="text"
            item-value="value"
            :items="accountLevels"
            :return-object="false"
          />
        </v-col>
        <v-col cols="12">
          <datatable :cols="datatableCols.cols" :url="datatableCols.url" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import datatable from "@/components/mcomponents/datatable/Server";
import accountApiMixin from "@/mixin/accountMixin";
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
      accountLevel: 0,
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
        let acc = this.findAccount("id", id);
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
