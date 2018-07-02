<template>
  <div class="rtl">
    <input type="text" v-model="searchAccount" />
    <v-tree v-if="treeAccounts.length" class="rtl" ref='tree' :data='treeAccounts' :tpl="tpl"  />

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
            <vue-form-generator tag="div" :schema="(account.pk)?editSchema[account.level]:createSchema[account.level]" :model="account" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
            <button v-if="account.pk" @click="updateAccount()" type="button" class="btn btn-primary">ثبت</button>
            <button v-else @click="storeAccount()" type="button" class="btn btn-primary">ثبت</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import accountMixin from "@/mixin/account";

export default {
  name: "TreeView",
  mixins: [accountMixin],
  created() {},
  data() {
    return {
      searchAccount: "",
      // expandTo: null,
      expandTo: '501010001',
    };
  },
  methods: {
    editAccount(node) {
      this.mode = "edit";
      this.account = node;
      this.modal("#account-modal", "show");
    },
    createAccount(node) {
      this.mode = "create";
      this.account = {};
      this.account.parent = node;
      this.account.level = node.level + 1;
      this.modal("#account-modal", "show");
    },
    tpl(node, ctx) {
      if (!node.pk) {
        return <span domPropsInnerHTML={node.title} />;
      }
      return (
        <span>
          <span
            domPropsInnerHTML={node.title}
            onClick={() => {
              // ctx.parent.nodeSelected(ctx.props.node);
              // console.log(ctx.parent.getSelectedNodes());
            }}
          />
          <i
            class="fas fa-pencil-alt text-warning"
            onClick={() => this.editAccount(node)}
          />
          <i
            class="fas fa-trash-alt text-danger"
            onClick={() => this.deleteAccount(node)}
          />
          {node.level < 3 ? (
            <i
              class="fas fa-plus text-success"
              onClick={() => this.createAccount(node)}
            />
          ) : (
            ""
          )}
        </span>
      );
    }
  },
  watch: {
    searchAccount() {
      this.$refs.tree.searchNodes(this.searchAccount);
    },
    "account.code": function() {
      this.expandTo = this.account.code;
    }
  },
  computed: {
    treeAccounts() {
      if(this.accounts.length == 0) return [];
      console.log("treeAccounts", this.expandTo);
      // let accounts = this.copy(this.accounts);
      let accounts = this.copy(this.accounts);

      // let parts = this.splitCode(this.expandTo);
      // let tmp = accounts.filter(acc => acc.code == parts[0])[0];
      // tmp && (tmp.expanded = true);
      // tmp && (tmp = tmp.children.filter(acc => acc.code == parts[1])[0]);
      // tmp && (tmp.expanded = true);
      // tmp && (tmp = tmp.children.filter(acc => acc.code == parts[2])[0]);
      // tmp && (tmp.expanded = true);

      let root = [
        {
          title: "نمودار درختی حساب ها",
          expanded: true,
          children: accounts
        }
      ];
      // root = this.accounts;
      return root;
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
    cursor: pointer !important;
    padding: 5px;
    border-radius: 3px;
    &:hover {
      background-color: #eee;
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