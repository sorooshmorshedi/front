<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <div class="title">
            {{ type.label }}
            <!-- <button type="button" class="btn btn-info" data-toggle="modal" data-target="#receipt-selection-modal" style="margin-right:15px;">
              انتخاب {{ type.label }}
            </button>-->
          </div>
          <div class="row">
            <div class="col-lg-6 col-sm-8">
              <div class="row">
                <div class="form-group col-lg-4 col-sm-4">
                  <label>شماره {{ type.label }}</label>
                  <input
                    v-if="receipt.id"
                    type="text"
                    class="form-control"
                    disabled
                    v-model="receipt.code"
                  >
                  <input v-else type="text" class="form-control" disabled :value="rarCode">
                </div>
                <div class="form-group col-lg-4 col-sm-4">
                  <label>تاریخ {{ type.label }}</label>
                  <date class="form-control" v-model="receipt.date" :default="true"/>
                </div>
                <div class="form-group col-lg-4 col-sm-4">
                  <label>ساعت {{ type.label }}</label>
                  <mtime class="form-control" v-model="receipt.time" :default="true"/>
                </div>
              </div>
            </div>
            <div class="form-group col-lg-6 col-sm-4">
              <label>توضیحات</label>
              <textarea class="form-control" rows="3" v-model="receipt.explanation"></textarea>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="table-responsive-lg">
                <table class="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>کالا</th>
                      <th>انبار</th>
                      <th>تعداد</th>
                      <th>واحد</th>
                      <th class="d-print-none"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(row,i) in rows"
                      :key="i"
                      :class="{'d-print-none': i == rows.length-1}"
                    >
                      <td>{{ i+1 }}</td>
                      <td>
                        <multiselect
                          :option-height="104"
                          dir="rtl"
                          :options="waresSelectValues.wares"
                          v-model="rows[i].ware"
                          track-by="id"
                          label="title"
                        />
                      </td>
                      <td>
                        <multiselect
                          v-if="rows[i].ware"
                          dir="rtl"
                          :allow-empty="false"
                          :options="waresSelectValues.warehouses"
                          v-model="rows[i].ware.warehouse"
                          track-by="id"
                          label="title"
                        />
                        <span v-else>-</span>
                      </td>
                      <td>
                        <input
                          dir="ltr"
                          type="number"
                          class="form-control form-control"
                          v-model="rows[i].count"
                        >
                      </td>
                      <td>{{ rows[i].ware?rows[i].ware.unit.name:' - ' }}</td>
                      <td class="d-print-none">
                        <button
                          v-if="i != rows.length-1"
                          @click="deleteItemRow(i)"
                          type="button"
                          class="btn btn-sm btn-warning"
                        >حذف ردیف</button>
                      </td>
                    </tr>
                    <tr></tr>
                    <tr class="bg-info text-white">
                      <td colspan="13"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <hr class="d-print-none">
          <div class="row d-print-none">
            <div class="col-12 text-left">
              <button
                v-if="receipt.id"
                @click="deleteReceipt(receipt)"
                type="button"
                class="btn btn-outline-danger"
              >حذف {{ type.label }}</button>
              <button @click="validate()" type="button" class="btn submit btn-primary w-100px">ثبت</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="receipt-selection-modal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{ type.label }} های ثبت شده</h4>
            <button type="button" class="close" data-dismiss="modal">
              <span arrptype-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-12">
                <div class="table-responsive">
                  <table class="table table-striped table-hover table-pointer">
                    <thead>
                      <tr>
                        <th>شماره {{ type.label }}</th>
                        <th>توضیحات</th>
                        <th>تاریخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(receipt,i) in receipts.filter(o => o.type == type.name)"
                        :key="i"
                        @click="selectReceipt(receipt)"
                      >
                        <td>{{ receipt.code }}</td>
                        <td>{{ receipt.explanation }}</td>
                        <td>{{ receipt.date }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">بازگشت</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReceiptApiMixin from "@/mixin/receiptApi";
import wareApiMixin from "@/mixin/wareApi";
import date from "@/components/mcomponents/cleave/Date";
import mtime from "@/components/mcomponents/cleave/Time";
export default {
  name: "ReceiptAndRemiitance",
  components: { date, mtime },
  props: ["receiptType", "id"],
  mixins: [wareApiMixin, ReceiptApiMixin],
  data() {
    return {
      receipt: {},
      rows: [],
      itemsToDelete: [],
      type: {
        name: "",
        label: ""
      },
      rowTemplate: {},
      Receipts: []
    };
  },
  created() {
    this.getData();
    this.init();
  },
  methods: {
    getData() {
      this.getWarehouses();
      this.getWares();
      this.getReceiptCodes();
      this.id && this.getReceipt(this.id);
    },
    init() {
      if (!this.id) {
        this.receipt = {};
        this.rows = [];
        this.rows.push(this.copy(this.rowTemplate));
      }
      this.type.name = this.receiptType;
      if (this.type.name == "receipt") this.type.label = "رسید";
      else this.type.label = "حواله";
    },
    validate() {
      let isValid = true;
      if (this.rows.length == 1) {
        this.notify(`لطفا حداقل یک ردیف وارد کنید`, "danger");
        isValid = false;
      }
      this.rows.forEach((r, i) => {
        if (i == this.rows.length - 1) return;
        if (!this.hasValue(r.count)) {
          this.notify(`لطفا تعداد ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
      });
      if (!isValid) return;

      this.receipt.type = this.type.name;
      this.checkInventories();
    },
    checkInventories() {
      if (this.type.name == "receipt") {
        if (this.receipt.id) this.updateReceipt();
        else this.storeReceipt();
        return;
      }
      let payload = [];
      this.rows.forEach((row, i) => {
        if (i == this.rows.length - 1) return;
        payload.push({
          ware: row.ware.id,
          warehouse: row.ware.warehouse.id
        });
      });
      this.request({
        url: this.endpoint("wares/inventory/check"),
        method: "post",
        data: payload,
        success: data => {
          let flag = true;
          data.forEach((count, i) => {
            if (this.rows[i].id) {
              let item = this.receipt.items.filter(
                o => o.id == this.rows[i].id
              )[0];
              count += item.count;
            }
            if (count < this.rows[i].count) {
              this.notify(
                `موجودی انبار ردیف ${i +
                  1} کافی نمی باشد، موجودی این انبار برای این کالا ${count} می باشد`,
                "danger"
              );
              flag = false;
            }
          });

          if (!flag) return;

          if (this.receipt.id) this.updateReceipt();
          else this.storeReceipt();
        }
      });
    },
    selectReceipt(receipt) {
      this.receipt = receipt;
      this.itemsToDelete = [];
      this.rows = [];
      receipt.items.forEach(item => {
        this.rows.push(this.copy(item));
      });
      this.rows.push(this.copy(this.rowTemplate));
      $("#receipt-selection-modal").modal("hide");
    },
    deleteItemRow(index) {
      let row = this.rows[index];
      if (row.id) this.itemsToDelete.push(row.id);
      this.rows.splice(index, 1);
    }
  },
  computed: {},
  watch: {
    rows: {
      handler(newRows, oldRows) {
        let row = this.rows[this.rows.length - 1];
        if (row && row.ware) {
          this.rows.push({
            discountValue: "",
            discountPercent: ""
          });
        }
      },
      deep: true
    },
    receiptType() {
      this.init();
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
.table-responsive {
  overflow-y: show;
}
</style>

