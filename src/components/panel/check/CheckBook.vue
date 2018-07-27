<template>
  <div class="row rtl">
    <div class="col-12 col ">
      <div class="card right ">
        <div class="card-body">
          <div class="title">مرکز هزینه</div>
          <div id="accordion">
            <button @click="createCB()" type="button" class="btn btn-info">افزودن دسته چک</button>
            <div class="card" v-for="(cb, i) in checkBooks" :key="i">
              <div class="card-header">
                <h5 class="mb-0">
                  <button class="btn btn-link" data-toggle="collapse" :data-target="'#collapse' + i">
                    <!-- {{ cb.name }} -->
                  </button>
                  <i class="fas fa-pencil-alt text-warning" @click="editCB(cb)" />
                  <i class="fas fa-trash-alt text-danger" @click="deleteCB(cb)" />
                </h5>
              </div>
              <div :id="'collapse' + i" class="collapse show">
                <div class="card-body">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="cc" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">مرکز هزینه</h4>
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="form-group col-12">
                  <label for="">نام مرکز هزینه</label>
                  <!-- <multiselect label="name" track-by="id" :options="accountsSelectValues.costCenterGroups" v-model="costCenter.group" /> -->
                </div>
                <div class="form-group col-12">
                  <label for="">نام مرکز هزینه</label>
                  <input type="text" class="form-control" v-model="costCenter.name">
                </div>
                <div class="form-group col-12">
                  <label>توضیحات</label>
                  <textarea class="form-control" rows="3" v-model="costCenter.explanation"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
            <button v-if="1" type="button" class="btn btn-primary">ثبت</button>
            <button v-else type="button" class="btn btn-primary">ثبت</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import accountApiMixin from "@/mixin/accountApi";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
export default {
  name: "Create",
  components: { money, date },
  mixins: [accountApiMixin],
  data() {
    return {
      checkBooks: [],
      check: {},
      rows: [{}]
    };
  },
  created() {
    this.getAccounts();
    this.getCostCenterGroups();
  },
  mounted() {},
  computed: {
    bedSum() {
      let sum = 0;
      this.rows.forEach(r => {
        if (r.bed) sum += +r.bed;
      });
      return sum;
    },
    besSum() {
      let sum = 0;
      this.rows.forEach(r => {
        if (r.bes) sum += +r.bes;
      });
      return sum;
    }
  },
  watch: {
    rows: {
      handler() {
        if (this.rows[this.rows.length - 1].account) {
          this.rows.push({});
        }
      },
      deep: true
    }
  },
  methods: {
    floatAccounts(row) {
      if (row.account && row.account.floatAccountGroup) {
        return row.account.floatAccountGroup.floatAccounts;
      } else {
        return [];
      }
    },
    costCenters(row) {
      if (row.account && row.account.costCenterGroup) {
        return row.account.costCenterGroup.costCenters;
      } else {
        return [];
      }
    }
  }
};
</script>

<style scoped lang="scss">
.table-responsive {
  overflow: visible;
  th,
  td,
  input {
    text-align: center;
  }
}
</style>

