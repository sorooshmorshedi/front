<template>
  <v-row no-gutters>
    <v-col v-for="(n, i) in levelsCount" :key="i" :class="i != 0?'pr-3':'pr-0'">
      <v-autocomplete
          class="rounded-lg"
          v-if="i == 0 || (selectedLevels[i-1] && selectedLevels[i-1].length)"
          :label="getTitle(i)"
          :items="getItems(i)"
          v-model="selectedLevels[i]"
          :item-text="levelText"
          item-value="id"
          :multiple="true"
          :clearable="true"
          :small-chips="true"
          :deletable-chips="true"
          :return-object="true"
          @input="emit(i)"
          @click:clear="emit(i)"
      />
    </v-col>
  </v-row>
</template>

<script>
import {getText} from "@/variables";

export default {
  name: "TreeSelect",
  props: {
    levelsCount: {
      require: true,
    },
    items: {
      require: true,
    },
    labels: {
      require: true,
    },
    itemText: {
      default: "text",
    },
    itemsIn: {},
  },
  data() {
    return {
      selectedLevels: [],
    };
  },
  created() {
    let selectedLevels = [];
    for (let i = 0; i < this.levelsCount; i++) {
      selectedLevels.push([]);
    }
    this.$set(this, "selectedLevels", selectedLevels);
  },
  computed: {
    nodes() {
      return this.buildTree(this.items);
    },
    levelText() {
      return "title";
    },
  },
  methods: {
    buildTree(items) {
      let nodes = this.copy(items);

      nodes = nodes.map((o) => {
        return {children: [], title: this.getItemText(o), ...o};
      });

      for (let node of nodes) {
        let parent = nodes.find((o) => o.id == node.parent);
        if (parent) {
          node.title = `${this.getItemText(node)} > ${this.getItemText(node)}`;
          parent.children.push(node);
        }
      }

      let roots = nodes.filter((o) => !o.parent);
      return roots;
    },
    getTitle(level) {
      return getText(this.labels, level);
    },
    getItems(level) {
      if (level == 0) {
        return this.nodes;
      }

      let items = [];
      let parents = this.selectedLevels[level - 1];
      if (parents) {
        for (let parent of this.selectedLevels[level - 1]) {
          items.push(...parent.children);
        }
      }

      return items;
    },
    clearSelectedLevels(i) {
      for (let j = i + 1; j < this.levelsCount; j++) {
        this.selectedLevels[j] = null;
      }
    },
    emit(level) {
      this.clearSelectedLevels(level);

      let selected_items = [];
      if (level == this.levelsCount - 1) {
        selected_items = this.selectedLevels[level];
      } else {
        let parents = this.selectedLevels[level];
        selected_items = this.items
            .filter((o) => o.level == this.levelsCount - 1)
            .filter((o) => {
              for (let parent of parents) {
                if (o.code.startsWith(parent.code)) {
                  return true;
                }
              }
              return false;
            });
      }
      this.$emit("update:itemsIn", selected_items.map((o) => o.id).join(","));
    },
    getItemText(item) {
      let value = this.itemText.split(".").reduce((o, i) => {
        if (o) return o[i];
        return null;
      }, item);

      return value;
    },
  },
};
</script>
