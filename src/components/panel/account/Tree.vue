<template>
  <div class="rtl">
    <input type="text" v-model="searchAccount" />
    <v-tree class="rtl" ref='tree' :data='treeAccounts' :tpl="tpl" :halfcheck='true' />

    <div class="modal" id="account-modal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">مشخصات حساب</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <vue-form-generator v-if="account.level" tag="div" :schema="schema[levels[account.level]]" :model="account" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
            <button v-if="account.id" @click="updateAccount(levels[account.level],account)" type="button" class="btn btn-primary">ثبت</button>
            <button v-else @click="storeAccount(levels[account.level],account)" type="button" class="btn btn-primary">ثبت</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import accountMixin from "@/mixin/api/account";
import schema from "./Schema";

export default {
  name: "Tree",
  mixins: [accountMixin],
  created() {},
  data() {
    return {
      treeAccounts: this.getAccountsForTree(),
      searchAccount: "",
      account: {},
      schema: schema,
      levels: ['', 'group', 'kol', 'moein', 'tafzili'],
    };
  },
  methods: {
    editAccount(node) {
      this.account = node;
      this.modal("#account-modal", "show");
    },
    createAccount(node) {
      this.account = {};
      this.account.parent = node;
      this.account.level = node.level + 1;
      this.modal("#account-modal", "show");
    },
    tpl(node, ctx) {
      return (
        <span>
          <span
            domPropsInnerHTML={node.title}
            onClick={() => {
              // ctx.parent.nodeSelected(ctx.props.node);
              // console.log(ctx.parent.getSelectedNodes());
            }}
          />
          <i class="fas fa-pencil-alt" onClick={() => this.editAccount(node)} />
          <i class="fas fa-plus" onClick={() => this.createAccount(node)} />
        </span>
      );
    }
  },
  watch: {
    searchAccount() {
      this.$refs.tree.searchNodes(this.searchAccount);
    }
  }
};
</script>

<style scoped lang="scss">
.halo-tree {
  margin-top: 15px;
}
.halo-tree li span {
  padding: 3px 5px;
  span {
    background-color: transparent !important;
  }
  i {
    margin-right: 8px;
    margin-left: 4px;
    cursor: pointer !important;
    background-color: #eee;
    padding: 5px;
    border-radius: 3px;
    &:hover {
      color: #fafafa;
      background-color: rgba(#000, 0.3);
    }
  }
}
.halo-tree li span:hover {
  background-color: transparent;
  border-radius: 5px;
}
@media (min-width: 992px) {
  #account-modal {
    .modal-dialog {
      max-width: 80%;
    }
  }
}
</style>