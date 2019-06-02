<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <form-header
            formName="انتقال"
            title="انتقال بین انبار ها"
            @clearForm="clearForm(true)"
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
                      <th>موجودی انبار ها</th>
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
                      <td class="d-print-none">
                        <button
                          v-if="row.ware"
                          @click="showInventory(row.ware)"
                          type="button"
                          class="btn btn-sm btn-info"
                        >مشاهده مانده</button>
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
                      <td :colspan="3"></td>
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
            formName="انتقال"
            :hasFirst="true"
            :hasLast="true"
            :hasPrev="true"
            :hasNext="true"
            :editable="editable"
            @goToForm="goToForm"
            @validate="validate"
            @edit="makeFormEditable()"
          />
        </div>
      </div>
    </div>

    <div class="modal fade" id="inventory-modal" v-if="inventory.ware">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">موجودی انبار ها برای {{ inventory.ware.name }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>انبار</th>
                    <th>مانده</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(warehouse, i) in inventory.warehouses" :key="warehouse.id">
                    <td>{{ i }}</td>
                    <td>{{ warehouse.name }}</td>
                    <td>{{ warehouse.remain_count }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">بستن</button>
          </div>
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
      idsToDelete: [],
      inventory: {
        ware: null,
        warehouses: []
      }
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
          this.selectTransfer(data);
        }
      });
    },
    selectTransfer(transfer, changeRoute = false) {
      this.transfer = transfer;
      this.rows = transfer.items;
      this.rows.push(this.copy(this.rowTemplate));

      if (changeRoute) {
        this.makeFormUneditable();
        this.$router.push({
          name: "TransferForm",
          params: {
            id: transfer.id
          }
        });
      }
    },
    showInventory(ware) {
      this.inventory.ware = ware;
      this.getInventory(ware);
    },
    getInventory(ware) {
      this.request({
        url: this.endpoint(`wares/inventory/forWare`),
        method: "get",
        params: {
          ware: ware.id
        },
        success: data => {
          this.inventory.warehouses = data;
          $("#inventory-modal").modal("show");
        }
      });
    },
    initForm() {
      this.log("Init Form");
      this.clearForm();
      this.getData();
    },
    clearForm(changeRoute = false) {
      this.transfer = {};
      this.rows = [];
      this.rows.push(this.copy(this.rowTemplate));
      if (changeRoute) {
        this.$router.push({
          name: "TransferForm"
        });
      }
    },
    validate(clearForm = false) {
      let isValid = true;
      if (this.rows.length == 1) {
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
        if (r.input_warehouse == r.output_warehouse) {
          this.notify(
            `لطفا انبار ورودی و خروجی ردیف ${i + 1} نمی تواند یکی باشد`,
            "danger"
          );
          isValid = false;
        }
      });
      if (!isValid) return;
      if (this.transfer.id) this.updateTransfer(clearForm);
      else this.storeTransfer(clearForm);
    },
    storeTransfer(clearForm) {
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
          if (clearForm) {
            this.clearForm();
          } else {
            this.selectTransfer(data, true);
            this.makeFormUneditable();
          }
        }
      });
    },
    deleteItemRow(index) {
      if (index == -1) {
        this.rows.splice(0, this.rows.length - 1);
      } else {
        this.rows.splice(index, 1);
      }
    },
    goToForm(pos) {
      return this.request({
        url: this.endpoint("factors/getTransferByPosition"),
        method: "get",
        params: {
          id: this.transfer.id,
          position: pos
        },
        success: data => {
          this.selectTransfer(data, true);
        },
        error: error => {
          if (error.response.status == 404) {
            this.notify("فاکتور وجود ندارد", "warning");
          }
        }
      });
    }
  },
  computed: {
    sum() {
      let res = 0;
      this.rows.forEach(row => {
        if (row.count) res += +row.count;
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

