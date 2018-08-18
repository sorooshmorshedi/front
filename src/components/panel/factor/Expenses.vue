<template>
  <div class="row rtl">
    <div class="col-12 col-lg-12">
      <div class="title">هزینه های پیشفرض فاکتور</div>
      <button @click="createExpense()" type="button" class="btn btn-info">افزودن</button>
      <br>
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>نام</th>
            <th>حساب</th>
            <th>توضیحات</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(e, i) in factorExpenses" :key="i">
            <td>{{ i+1 }}</td>
            <td>{{ e.name }}</td>
            <td>{{ e.account.title }}</td>
            <td>{{ e.explanation }}</td>
            <td>
              <i class="fas fa-pencil-alt text-warning" @click="editExpense(e)" />
            </td>
            <td>
              <i class="fas fa-trash-alt text-danger" @click="deleteExpense(e)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal fade" id="factor-expense-modal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">هزینه پیشفرض فاکتور</h4>
            <button type="button" class="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="form-group col-12">
                  <label for="">نام</label>
                  <input type="text" class="form-control" v-model="expense.name">
                </div>
                <div class="form-group col-12">
                  <label>حساب</label>
                  <multiselect dir="rtl" :options="this.accountsSelectValues.levels[3]" v-model="expense.account" track-by="id" label="title" />
                </div>
                <div class="form-group col-12">
                  <label>توضیحات</label>
                  <textarea class="form-control" rows="3" v-model="expense.explanation"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
            <button v-if="!expense.id" @click="storeExpense()" type="button" class="btn btn-primary">ثبت</button>
            <button v-else @click="updateExpense()" type="button" class="btn btn-primary">ثبت</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import accountApiMixin from "@/mixin/accountApi";
import factorApiMixin from "@/mixin/factorApi";

export default {
  mixins: [accountApiMixin, factorApiMixin],
  name: "Expenses",
  data() {
    return {
      expense: {}
    };
  },
  created() {
    this.getFactorExpenses();
    this.getAccounts();
  },
  methods: {
    editExpense(expense) {
      this.expense = this.copy(expense);
      $("#factor-expense-modal").modal("show");
    },
    updateExpense() {
      let data = {
        ...this.expense,
        account: this.expense.account.id
      };
      this.request({
        url: this.endpoint("factors/expenses/" + this.expense.id + "/"),
        method: "put",
        data: data,
        success: data => {
          this.successNotify();
          this.getFactorExpenses(true);
          $("#factor-expense-modal").modal("hide");
          this.expense = {};
        }
      });
    },
    createExpense() {
      this.expense = {};
      $("#factor-expense-modal").modal("show");
    },
    storeExpense() {
      let data = {
        ...this.expense,
        account: this.expense.account.id
      };
      this.request({
        url: this.endpoint("factors/expenses/"),
        method: "post",
        data: data,
        success: data => {
          this.successNotify();
          this.getFactorExpenses(true);
          $("#factor-expense-modal").modal("hide");
          this.expense = {};
        }
      });
    },
    deleteExpense(expense) {
      this.request({
        url: this.endpoint("factors/expenses/" + expense.id),
        method: "delete",
        success: data => {
          this.successNotify();
          this.getFactorExpenses(true);
        }
      });
    }
  },
  computed: {}
};
</script>

<style scoped lang="scss">
i {
  margin: 0px;
  cursor: pointer !important;
  padding: 5px;
  border-radius: 3px;
  &:hover {
    background-color: #eee;
  }
}
button {
  margin-bottom: 8px;
}
</style>

