<template>
  <div class="row">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <div class="title" v-if="showTitle">
            {{ title }}
            <button class="btn btn-info" @click="emitClearForm">
              تعریف
              {{ title }}
              جدید
            </button>
            <slot name="header-buttons"></slot>
          </div>
          <div class="row">
            <div class="col-12" :class="{'col-md-6': showList, 'col-md-12': !showList}">
              <slot name="default"></slot>

              <hr>

              <div class="text-left">
                <button
                  v-if="deletable"
                  @click="emitDelete"
                  type="button"
                  class="btn btn-danger"
                >حذف</button>
                <button @click="emitSubmit" type="button" class="btn btn-primary w-100px">ثبت</button>
              </div>
            </div>

            <div class="table-pointer col-12 col-md-6" v-if="showList">
              <datatable :cols="cols" :data="items" @rowClick="rowClick"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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

<style scoped lang="scss">
</style>

