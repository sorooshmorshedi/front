<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card>
        <v-card-title>نمودار درختی حساب ها</v-card-title>
        <v-card-text>
          <tree-component :data="root" @node-click="setAccount" @node-context-menu="contextMenu"></tree-component>
          <context-menu ref="menu" class="context-menu">
            <template v-if="account">
              <v-card>
                <v-list dense>
                  <v-list-item @click="createChildAccount(account)" v-if="account.level != 3">
                    <v-list-item-icon>
                      <v-icon class="pt-1">fas fa-plus</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        <span>افزودن حساب {{ getTitle(account.level+1) }}</span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item @click="openLedger(account)">
                    <v-list-item-icon>
                      <v-icon class="pt-1">fas fa-book-open</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        <span>دفتر این حساب</span>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </template>
          </context-menu>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" md="6">
      <template>
        <accounts ref="accountsForm" usage="tree" :level="level" :parent="parent" class="mt-n3" />
      </template>
    </v-col>
  </v-row>
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
      account: {
        level: 0,
      },
      root: [
        {
          title: "سرفصل حساب ها",
          expanded: true,
          show: true,
          children: [],
        },
      ],
      tree: {},
      parent: null,
      level: 0,
    };
  },
  watch: {
    accounts() {
      if (this.accounts.length) this.updateRoot();
    },
  },
  created() {
    this.getAccounts();
    this.updateRoot();
  },
  methods: {
    setAccount(node) {
      this.account = { ...node };
      this.parent = null;
      this.level = node.level;
      this.$refs.accountsForm.setItem(node);
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
          account.show = true;
          this.root[0].children.push(account);
        }

        this.tree = tree;
      }
    },
    appendChildren(root) {
      root.children = this.accountsSelectValues.all.filter((o) =>
        o.code.startsWith(root.code)
      );
    },
    editAccount(node) {
      this.$router.push({
        name: "Accounts",
        params: {
          level: node.level,
          account_type: node.account_type,
        },
        query: {
          showForm: true,
          item: node,
        },
      });
    },
    createChildAccount(node) {
      this.$refs.accountsForm.clearForm();
      this.parent = node;
      this.level = node.level + 1;
    },
  },
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