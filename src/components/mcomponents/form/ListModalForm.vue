<template>
  <div class="row">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <div class="title">
            {{ title }}
            <button class="btn btn-info" @click="openModal">
              تعریف
              {{ title }}
              جدید
            </button>
          </div>
          <datatable :cols="cols" :data="items" @rowClick="rowClick"/>
        </div>
      </div>
    </div>

    <div class="modal fade" id="form">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <slot/>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">بستن</button>
            <button v-if="deletable" @click="emitDelete" type="button" class="btn btn-danger">حذف</button>
            <button @click="emitSubmit" type="button" class="btn btn-primary w-100px">ثبت</button>
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
    }
  },
  data() {
    return {
      isModalOpen: false
    };
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
    queryChanged() {
      if (this.query.showForm && !this.isModalOpen) this.openModal();
    },
    openModal() {
      this.emitClearForm();
      this.isModalOpen = true;
      this.modal("#form");
    },
    hideModal() {
      this.isModalOpen = false;
      this.modal("#form", "hide");
    },
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

