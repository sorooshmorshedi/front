<template>
  <div class="row rtl">
    <div class="col-12">
      <datatable
        :cols="datatableOptions.cols"
        :data="treeAccounts"
        @rowContextMenu="contextMenu"
        :printable="true"
      />
    </div>

    <vue-context ref="menu" class="context-menu">
      <ul slot-scope="child" v-if="child.data">
        <li @click="editAccount(child.data.account)">
          <i class="fas fa-pencil-alt text-warning"/>
          <span>ویرایش حساب</span>
        </li>
        <li @click="createAccount(child.data.account)" v-if="child.data.account.level != 3">
          <i class="fas fa-plus text-success"/>
          <span>افزودن حساب فرزند</span>
        </li>
        <li @click="openLedger(child.data.account)">
          <i class="fas fa-book-open text-danger"/>
          دفتر این حساب
        </li>
      </ul>
    </vue-context>
  </div>
</template>

<script>
import accountMixin from "@/mixin/accountMixin";
import datatable from "@/components/mcomponents/datatable/Client";
import datatableOptions from "./TreeDatatableCols";

export default {
  mixins: [accountMixin],
  components: { datatable },
  data() {
    return {
      account: {},
      datatableOptions
    };
  },
  created() {
    this.getAccounts();
  },
  methods: {
    editAccount(node) {
      this.$router.push({
        name: "Accounts",
        params: {
          level: node.level,
          account_type: node.account_type
        },
        query: {
          showForm: true,
          item: node
        }
      });
    },
    createAccount(node) {
      this.$router.push({
        name: "Accounts",
        params: {
          level: node.level + 1,
          account_type: node.account_type
        },
        query: {
          showForm: true,
          item: {
            parent: node
          }
        }
      });
    },
    contextMenu(e, item) {
      e.preventDefault();
      this.account = item;
      this.$refs.menu.open(e, { account: item });
    }
  },
  computed: {
    treeAccounts() {
      let res = [];
      this.accountsSelectValues.all.forEach(o => {
        if (o) {
          o.classes = "level-" + o.level;
          res.push(o);
        }
      });
      return res;
    }
  }
};
</script>

<style lang="scss">
$pad: 30px;
.level-1 td:nth-child(4) {
  padding-right: $pad;
}
.level-2 td:nth-child(4) {
  padding-right: $pad * 2;
}
.level-3 td:nth-child(4) {
  padding-right: $pad * 3;
}
</style>