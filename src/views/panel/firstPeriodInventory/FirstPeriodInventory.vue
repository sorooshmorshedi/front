<template>
  <daily-form
    formName="موجودی اول دوره"
    title="موجودی اول دوره"
    :hasClear="false"
    :ListRouteName="false"
    :showNavigationButtons="false"
    :hasFirst="false"
    :hasLast="false"
    :hasPrev="false"
    :hasNext="false"
    :editable="editable"
    :showSubmitAndClearForm="false"
    @validate="validate"
    @edit="makeFormEditable()"
  >
    <template #inputs>
      <v-row>
        <v-col cols="12" md="2">
          <date
            label="تاریخ فاکتور"
            required
            v-model="factor.date"
            :default="true"
            :disabled="!editable"
          />
        </v-col>
        <v-col cols="12" md="2">
          <mtime
            label="ساعت فاکتور"
            required
            v-model="factor.time"
            :default="true"
            :disabled="!editable"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-textarea
            label="شرح"
            v-model="factor.explanation"
            :disabled="!editable"
            @keyup.enter.stop
          ></v-textarea>
        </v-col>
      </v-row>

      <v-simple-table>
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
              <ware-select v-model="rows[i].ware" :disabled="!editable" style="width: 200px;" />
            </td>
            <td>
              <v-autocomplete
                v-if="rows[i].ware && !rows[i].ware.isService"
                v-model="rows[i].warehouse"
                :disabled="!editable"
                :items="waresSelectValues.warehouses"
                item-text="name"
                style="width: 150px;"
              ></v-autocomplete>
              <span v-else>-</span>
            </td>
            <td>
              <money
                class="form-control form-control"
                v-model="rows[i].count"
                :disabled="!editable"
                decimalScale="6"
              />
            </td>
            <td>{{ rows[i].ware?rows[i].ware.unit.name:' - ' }}</td>
            <td>
              <money class="form-control form-control" v-model="rows[i].fee" :disabled="!editable" />
            </td>
            <td dir="ltr">
              <money
                class="form-control form-control"
                :value="rowSum(rows[i])"
                disabled
                decimalScale="6"
              />
            </td>
            <td>
              <v-text-field v-model="rows[i].explanation" :disabled="!editable" />
            </td>
            <td class="d-print-none">
              <v-btn
                v-if="i != rows.length-1"
                @click="deleteItemRow(i)"
                class="red--text"
                icon
                :disabled="!editable"
              >
                <v-icon>delete</v-icon>
              </v-btn>
            </td>
          </tr>
          <tr class="grey lighten-3">
            <td :colspan="5"></td>
            <td>جمع:</td>
            <td>{{ sum | toMoney }} ریال</td>
            <td></td>
            <td>
              <v-btn @click="deleteItemRow(-1)" icon class="red--text" :disabled="!editable">
                <v-icon>delete_sweep</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </template>
  </daily-form>
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
      let raw_items = this.rows.slice(0, this.rows.length - 1);
      let items = [];
      items.forEach(item => {
        items.push(this.extractIds(o));
      });
      this.request({
        url: this.endpoint("factors/firstPeriodInventory"),
        method: "post",
        data: {
          factor: this.factor,
          factor_items: {
            items: items,
            ids_to_delete: this.idsToDelete
          }
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
  v-text-field {
    text-align: center;
  }
}
.custom-checkbox {
  padding-left: 0px;
  margin-left: 0px;
}
</style>

