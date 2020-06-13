<template>
  <v-row>
    <v-col cols="12" :md="showList?6:12">
      <v-card>
        <v-card-title class="title" v-if="showTitle">
          {{ title }}
          <v-spacer></v-spacer>
          <v-btn class="light-blue white--text mr-1" @click="emitClearForm" v-if="clearable">
            تعریف
            {{ title }}
            جدید
          </v-btn>
          <slot name="header-buttons"></slot>
        </v-card-title>
        <v-card-text>
          <slot name="default"></slot>
        </v-card-text>
        <v-card-actions v-if="showActions">
          <v-spacer></v-spacer>
          <slot name="actions"></slot>
          <v-btn v-if="deletable" @click="emitDelete" color="red" outlined>حذف</v-btn>
          <v-btn @click="emitSubmit" class="green white--text">ثبت</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" md="6" v-if="showList" class="items-list">
      <v-card>
        <v-card-text>
          <datatable :cols="cols" :data="items" @rowClick="rowClick" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import datatable from "@/components/mcomponents/datatable/Client";

export default {
  components: { datatable },
  props: {
    title: {
      required: true
    },
    items: {
      required: true
    },
    cols: {
      required: true
    },
    deletable: {
      default: true
    },
    showList: {
      default: true
    },
    showTitle: {
      default: true
    },
    clearable: {
      default: true
    },
    showActions: {
      default: true
    }
  },
  data() {
    return {};
  },
  watch: {
    query() {
      this.queryChanged();
    }
  },
  mounted() {
    this.queryChanged();
  },
  methods: {
    queryChanged() {},
    emitClearForm() {
      this.$emit("clearForm");
    },
    emitSubmit() {
      this.$emit("submit");
    },
    emitDelete() {
      this.$emit("delete");
    },
    rowClick(item) {
      this.$emit("rowClick", item);
      this.modal("#form");
    }
  }
};
</script>

<style lang="scss">
.items-list {
  tr:hover {
    cursor: pointer !important;
  }
}
</style>

