<template>
  <div class="row rtl">
    <div class="col-12 col-md-6">
      <div class="card">
        <div class="card-body">
          <div class="title">نمودار درختی حساب ها</div>
          <tree-component :data="root" @node-click="setAccount" @node-context-menu="contextMenu"></tree-component>

          <context-menu ref="menu" class="context-menu">
            <template v-if="account">
              <ul>
                <li @click="createChildAccount(account)" v-if="account.level != 3">
                  <i class="fas fa-plus text-success"/>
                  <span>افزودن حساب {{ getTitle(account.level+1) }}</span>
                </li>
                <li @click="openLedger(account)">
                  <i class="fas fa-book-open text-danger"/>
                  دفتر این حساب
                </li>
              </ul>
            </template>
          </context-menu>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-6">
      <template v-if="account && account.level != undefined">
        <accounts usage="tree" :level="account.level" :type="account.type" :item-object="account"/>
      </template>
    </div>
  </div>
</template>

<script>
import accountMixin from "@/mixin/accountMixin";
import TreeComponent from "./tree/tree";
import Accounts from "../account/Accounts";

export default {
  mixins: [accountMixin],
  components: { TreeComponent, Accounts },
  data() {
    return {
      account: null,
      root: [
        {
          title: "سرفصل حساب ها",
          expanded: true,
          children: []
        }
      ],
      tree: {}
    };
  },
  watch: {
    accounts() {
      if (this.accounts.length) this.updateRoot();
    }
  },
  created() {
    this.getAccounts();
    this.updateRoot();
  },
  methods: {
    setAccount(node) {
      if (!node.id) return;
      this.account = node;
    },
    contextMenu(node, index, parent, e) {
      if (!node.id) return;
      this.setAccount(node);
      this.$refs.menu.open(e);
    },
    updateRoot() {
      this.root[0].children = [];
      let tree = {};
      for (let account of this.accounts) {
        account.children = [];
        if (this.tree[account.id] && this.tree[account.id].expanded) {
          account.expanded = true;
        }
        tree[account.id] = account;
        if (account.parent) {
          tree[account.parent].children.push(account);
        } else {
          this.root[0].children.push(account);
        }

        this.tree = tree;
      }
    },
    appendChildren(root) {
      root.children = this.accountsSelectValues.all.filter(o =>
        o.code.startsWith(root.code)
      );
    },
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
    createChildAccount(node) {
      this.setAccount({
        parent: node,
        level: node.level + 1,
        type: node.type
      });
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