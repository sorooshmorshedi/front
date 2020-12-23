<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card>
        <v-card-title>نمودار درختی کالا ها</v-card-title>
        <v-card-text>
          <tree-component
            ref="tree"
            :data="root"
            @node-click="setItem"
            @node-context-menu="contextMenu"
            node-text="name"
          />
          <context-menu ref="menu" class="context-menu">
            <template v-if="item">
              <v-card>
                <v-list dense>
                  <v-list-item @click="createChildItem(item)" v-if="item.level != 3">
                    <v-list-item-icon>
                      <v-icon class="pt-1">fas fa-plus</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>
                        <span>افزودن فرزند</span>
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
      <wares-form ref="itemForm" :show-list="false" :level="level" class="mt-n3" />
    </v-col>
  </v-row>
</template>

<script>
import TreeComponent from "@/components/tree/Tree";
import wareApiMixin from "@/mixin/wareApi";
import WaresForm from "@/views/panel/ware/Wares";

export default {
  mixins: [wareApiMixin],
  components: { TreeComponent, WaresForm },
  data() {
    return {
      item: {
        level: 0,
      },
      root: [
        {
          name: "نمودار درختی کالا ها",
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
  computed: {
    items() {
      return this.wares;
    },
  },
  created() {
    this.EventBus.$on("get:wares", () => {
      this.updateRoot();
      this.$refs.tree.performSearch(this.$refs.tree.data, "");
    });
    this.getWares();
  },
  methods: {
    setItem(node) {
      if (!node.id) return;
      this.item = { ...node };
      this.parent = null;
      this.level = node.level;
      this.$refs.itemForm.setItem(node);
    },
    contextMenu(node, index, parent, e) {
      if (!node.id) return;
      this.setItem(node);
      this.$refs.menu.open(e);
    },
    updateRoot() {
      this.root[0].children = [];
      let tree = {};
      for (let item of this.items) {
        item.children = [];
        if (this.tree[item.id] && this.tree[item.id].expanded) {
          item.expanded = true;
        }
        tree[item.id] = item;
        if (item.parent) {
          tree[item.parent].children.push(item);
        } else {
          item.show = true;
          this.root[0].children.push(item);
        }

        this.tree = tree;
      }
    },
    createChildItem(node) {
      this.$refs.itemForm.clearForm();
      this.$refs.itemForm.item.parent = node;
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