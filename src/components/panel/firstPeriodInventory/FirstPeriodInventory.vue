<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <form-header
            formName="موجودی اول دوره"
            title="موجودی اول دوره"
            :hasClear="false"
            :ListRouteName="false"
          ></form-header>

          <div class="row">
            <div class="col-lg-6">
              <div class="row">
                <div class="form-group col-lg-6 col-sm-12">
                  <label>تاریخ</label>
                  <date
                    class="form-control"
                    v-model="factor.date"
                    :default="true"
                    :disabled="!editable"
                  />
                </div>
                <div class="form-group col-lg-6 col-sm-12">
                  <label>ساعت</label>
                  <mtime
                    class="form-control"
                    v-model="factor.time"
                    :default="true"
                    :disabled="!editable"
                  />
                </div>
                <div class="col-lg-6 col-sm-12" v-if="factor.sanad">
                  <label>شماره سند</label>
                  <div class="input-group">
                    <input type="text" class="form-control" disabled :value="factor.sanad">
                    <div class="input-group-prepend d-print-none">
                      <button
                        @click="openSanad(factor.sanad)"
                        class="btn btn-outline-info"
                        type="button"
                        id="button-addon1"
                      >مشاهده سند</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group col-lg-6">
              <label>توضیحات</label>
              <textarea
                class="form-control"
                rows="5"
                v-model="factor.explanation"
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
                      <th>شرح</th>
                      <th>انبار</th>
                      <th>تعداد</th>
                      <th>واحد</th>
                      <th>قیمت واحد</th>
                      <th>جمع</th>
                      <th>توضیحات</th>
                      <th class="d-print-none"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(row,i) in filteredRows"
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
                          label="name"
                          :disabled="!editable"
                          @select="setDefaultValue"
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
                        <money
                          class="form-control form-control"
                          v-model="rows[i].fee"
                          :disabled="!editable"
                        />
                      </td>
                      <td dir="ltr">
                        <money class="form-control form-control" :value="rowSum(rows[i])" disabled/>
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
                      <td :colspan="8"></td>
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
          <div class="row">
            <div class="col-lg-6 col-sm-6"></div>
            <div class="col-lg-6 col-sm-6">
              <div class="row">
                <div class="col-lg-12">
                  <table class="table table-bordered finals">
                    <tbody>
                      <tr>
                        <th>جمع:</th>
                        <td colspan="2">{{ sum | toMoney }} ریال</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <hr class="d-print-none">

          <form-footer
            formName="موجودی اول دوره"
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
import _ from 'lodash'

export default {
  name: "Form",
  components: { money, date, mtime },
  props: ["factorType", "id"],
  mixins: [formsMixin, wareApiMixin],
  data() {
    return {
      factor: {},
      rows: [],
      rowTemplate: {
        fee: ""
      },
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
      this.getFirstPeriodInventory();
    },
    getFirstPeriodInventory() {
      this.request({
        url: this.endpoint("factors/firstPeriodInventory"),
        method: "get",
        success: data => {
          if (!data.message) {
            this.factor = data;
            this.rows = data.items;
            this.rows.push(this.copy(this.rowTemplate));
          }
        }
      });
    },
    initForm() {
      this.log("Init Form");
      this.rows = [];
      this.rows.push(this.copy(this.rowTemplate));
      this.getData();
    },
    setDefaultValue(row) {
      if (!row.id) return;
      this.$nextTick(() => {
        let item = this.rows.filter(o => o.ware && o.ware.id == row.id)[0];
        let value = item.ware.price;
        item.fee = value;
      });
    },
    validate(clearFactor = false) {
      let isValid = true;
      this.rows.forEach((r, i) => {
        if (i == this.rows.length - 1) return;
        if (!r.count || r.count == 0) {
          this.notify(`لطفا تعداد ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
        if (r.fee == undefined) {
          this.notify(`لطفا قیمت واحد ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
      });
      if (!isValid) return;
      this.storeFirstPeriodInventory();
    },
    storeFirstPeriodInventory() {
      let items = this.rows.slice(0, this.rows.length - 1);
      items.forEach(item => (item.warehouse = item.ware.warehouse));
      items = items.map(this.extractIds);
      this.request({
        url: this.endpoint("factors/firstPeriodInventory"),
        method: "post",
        data: {
          factor: this.factor,
          items: items,
          ids_to_delete: this.idsToDelete
        },
        success: data => {
          this.successNotify();
          this.idsToDelete = [];
        }
      });
    },
    deleteItemRow(index) {
      if (index == -1) {
        this.rows.forEach(row => {
          if (row.id) this.idsToDelete.push(row.id);
        });
        this.rows.splice(0, this.rows.length - 1);
      } else {
        let row = this.rows[index];
        if (row.id) this.idsToDelete.push(row.id);
        this.rows.splice(index, 1);
      }
    },
    rowSum(row) {
      if (!this.hasValue(row.fee) || !this.hasValue(row.count)) return 0;
      return +row.fee * +row.count;
    }
  },
  computed: {
    filteredRows() {
      return this.rows.filter(o => {
        return !o.deleted;
      });
    },
    sum() {
      let res = 0;
      this.rows.forEach(r => {
        res += this.rowSum(r);
      });
      return res;
    },
    warehouseWares() {
      let res = [];
      this.rows.forEach((r, i) => {
        if (!r.warehouse) res.push([]);
        else {
          res.push(
            this.wares.filter(w => {
              return w.warehouse.id == r.warehouse.id;
            })
          );
        }
      });
      return res;
    }
  },
  watch: {
    rows: {
      handler(newRows, oldRows) {
        let row = this.rows[this.rows.length - 1];
        if (row && row.ware) {
          if (row.fee == "") this.setDefaultValue(row);
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

