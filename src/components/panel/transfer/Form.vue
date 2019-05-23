<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <form-header
            formName="انتقال"
            title="انتقال بین انبار ها"
            :hasClear="false"
            :ListRouteName="false"
          ></form-header>

          <div class="row">
            <div class="col-lg-6">
              <div class="row">
                <div class="form-group col-lg-4 col-sm-2">
                  <label>شماره انتقال</label>
                  <input type="text" class="form-control" disabled v-model="transfer.code">
                </div>
                <div class="form-group col-lg-8 col-sm-12">
                  <label>تاریخ</label>
                  <date
                    class="form-control"
                    v-model="transfer.date"
                    :default="true"
                    :disabled="!editable"
                  />
                </div>
              </div>
            </div>
            <div class="form-group col-lg-6">
              <label>توضیحات</label>
              <textarea
                class="form-control"
                rows="5"
                v-model="transfer.explanation"
                :disabled="!editable"
              ></textarea>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="table-responsive-lg">
                <table class="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>نام/کد کالا</th>
                      <th>از انبار</th>
                      <th>تعداد</th>
                      <th>واحد</th>
                      <th>به انبار</th>
                      <th>توضیحات</th>
                      <th class="d-print-none"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row,i) in rows" :key="i">
                      <td>{{ i+1 }}</td>
                      <td>
                        <multiselect
                          :option-height="104"
                          dir="rtl"
                          :options="waresSelectValues.wares"
                          v-model="rows[i].ware"
                          track-by="id"
                          label="name"
                          :disabled="!editable"
                        />
                      </td>
                      <td>
                        <multiselect
                          v-if="rows[i].ware"
                          dir="rtl"
                          :allow-empty="false"
                          :options="waresSelectValues.warehouses"
                          v-model="rows[i].output_warehouse"
                          track-by="id"
                          label="name"
                          :disabled="!editable"
                        />
                        <span v-else>-</span>
                      </td>
                      <td>
                        <money
                          class="form-control form-control"
                          v-model="rows[i].count"
                          :disabled="!editable"
                        />
                      </td>
                      <td>{{ rows[i].ware?rows[i].ware.unit.name:' - ' }}</td>
                      <td>
                        <multiselect
                          v-if="rows[i].ware"
                          dir="rtl"
                          :allow-empty="false"
                          :options="waresSelectValues.warehouses"
                          v-model="rows[i].input_warehouse"
                          track-by="id"
                          label="name"
                          :disabled="!editable"
                        />
                        <span v-else>-</span>
                      </td>
                      <td>
                        <input
                          type="text"
                          class="form-control form-control"
                          v-model="rows[i].explanation"
                          :disabled="!editable"
                        >
                      </td>
                      <td class="d-print-none">
                        <button
                          v-if="i != rows.length-1"
                          @click="deleteItemRow(i)"
                          type="button"
                          class="btn btn-sm btn-warning"
                          :disabled="!editable"
                        >حذف ردیف</button>
                      </td>
                    </tr>
                    <tr class="bg-info text-white">
                      <td :colspan="2"></td>
                      <td>جمع</td>
                      <td>{{ sum | toMoney }}</td>
                      <td :colspan="3"></td>
                      <td>
                        <button
                          @click="deleteItemRow(-1)"
                          type="button"
                          class="btn btn-danger d-print-none"
                          :disabled="!editable"
                        >حذف همه ردیف ها</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <hr class="d-print-none">

          <form-footer
            v-if="!this.id"
            formName="انتقال"
            :showPagination="false"
            :hasFirst="false"
            :hasLast="false"
            :hasPrev="false"
            :hasNext="false"
            :editable="editable"
            :hasSubmitAndClearForm="false"
            @validate="validate"
            @edit="makeFormEditable()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import wareApiMixin from "@/mixin/wareApi";
import formsMixin from "@/mixin/forms";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import mtime from "@/components/mcomponents/cleave/Time";
import _ from "lodash";

export default {
  name: "Form",
  components: { money, date, mtime },
  props: ["id"],
  mixins: [formsMixin, wareApiMixin],
  data() {
    return {
      transfer: {},
      rows: [],
      rowTemplate: {},
      idsToDelete: []
    };
  },
  created() {
    this.initForm();
  },
  methods: {
    getData() {
      this.getWarehouses();
      this.getWares();
      if (this.id) this.getTransfer();
    },
    getTransfer() {
      this.request({
        url: this.endpoint(`factors/transfers/${this.id}/`),
        method: "get",
        success: data => {
          this.transfer = data;
          this.rows = data.items;
          this.rows.push(this.copy(this.rowTemplate));
        }
      });
    },
    initForm() {
      this.log("Init Form");
      this.rows = [];
      this.rows.push(this.copy(this.rowTemplate));
      this.getData();
    },
    validate(clearForm = false) {
      let isValid = true;
      if(this.rows.length == 1) {
          this.notify(`حداقل یک ردیف وارد کنید`, "danger");
          isValid = false;
      }
      this.rows.forEach((r, i) => {
        if (i == this.rows.length - 1) return;
        if (!r.count || r.count == 0) {
          this.notify(`لطفا تعداد ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
        if (!r.input_warehouse || !r.output_warehouse) {
          this.notify(
            `لطفا انبار ورودی و خروجی ردیف ${i + 1} را وارد کنید`,
            "danger"
          );
          isValid = false;
        }
        if(r.input_warehouse == r.output_warehouse) {
          this.notify(
            `لطفا انبار ورودی و خروجی ردیف ${i + 1} نمی تواند یکی باشد`,
            "danger"
          );
          isValid = false;
        }
      });
      if (!isValid) return;
      this.storeTransfer();
    },
    storeTransfer() {
      let items = this.rows.slice(0, this.rows.length - 1);
      items = items.map(this.extractIds);
      this.transfer.items = items;
      this.request({
        url: this.endpoint("factors/transfers/"),
        method: "post",
        data: {
          transfer: this.transfer
        },
        success: data => {
          this.successNotify();
        }
      });
    },
    deleteItemRow(index) {
      if (index == -1) {
        this.rows.splice(0, this.rows.length - 1);
      } else {
        this.rows.splice(index, 1);
      }
    }
  },
  computed: {
    sum() {
      let res = 0;
      this.rows.forEach(row => {
        if(row.count) res += +row.count;
      });
      return res;
    }
  },
  watch: {
    rows: {
      handler(newRows, oldRows) {
        let row = this.rows[this.rows.length - 1];
        if (row && row.ware) {
          this.rows.push(this.copy(this.rowTemplate));
        }
      },
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
.finals {
  td {
    text-align: left;
  }
}

.table-responsive-lg {
  // overflow: visible;
  th,
  td,
  input {
    text-align: center;
  }
}
.custom-checkbox {
  padding-left: 0px;
  margin-left: 0px;
}
</style>

