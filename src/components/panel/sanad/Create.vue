<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right ">
        <div class="card-body">
          <div class="title">
            سند حسابداری
            <button type="button" class="btn btn-info" data-toggle="modal" data-target="#sanad-selection-modal" style="margin-right:15px;">انتخاب سند </button>
          </div>
          <div class="row">
            <div class="col-lg-6">
              <div class="row">
                <div class="form-group col-lg-6">
                  <label>شماره سند</label>
                  <input v-if="sanad.id" type="text" class="form-control" disabled v-model="sanad.code">
                  <input v-else type="text" class="form-control" disabled :value="sanadCode">
                </div>
                <div class="form-group col-lg-6">
                  <label>تاریخ سند</label>
                  <date class="form-control" v-model="sanad.date" default=1 />
                </div>
                <div class="form-group col-lg-6">
                  <label>صادر کننده سند</label>
                  <input type="text" class="form-control" disabled>
                </div>

                <div class="form-group col-lg-6">
                  <label>نوع سند</label>
                  <div style="margin-top: 8px;margin-right: 15px;">

                    <div class="form-check form-check-inline">
                      <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="temporary" v-model="sanad.type">
                      <label class="form-check-label" for="exampleRadios1">
                        موقت
                      </label>
                    </div>
                    <div class="form-check form-check-inline" style="margin-right: 50px;">
                      <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="definite" v-model="sanad.type">
                      <label class="form-check-label" for="exampleRadios2">
                        قطعی
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group col-lg-6">
              <label>توضیحات سند</label>
              <textarea class="form-control" rows=5 v-model="sanad.explanation"></textarea>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="table-responsive">
                <table class="table table-striped ">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>شماره - نام حساب</th>
                      <th>توضیحات</th>
                      <th>تفضیلی شناور</th>
                      <th>مرکز هزینه</th>
                      <th>بدهکار</th>
                      <th>بستانکار</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row,i) in rows" :key="i">
                      <td>{{ i+1 }}</td>
                      <td>
                        <multiselect dir="rtl" :options="accountsSelectValues.levels[3]" v-model="rows[i].account" track-by="id" label="title" />
                      </td>
                      <td>
                        <input type="text" class="form-control form-control-sm" v-model="rows[i].explanation">
                      </td>
                      <td>
                        <multiselect dir="rtl" :options="floatAccounts(rows[i])" v-model="rows[i].floatAccount" track-by="id" label="name" />
                      </td>
                      <td>
                        <multiselect dir="rtl" :options="costCenters(rows[i])" v-model="rows[i].costCenter" track-by="id" label="name" />
                      </td>
                      <td>
                        <money :disabled="rows[i].bes != ''" class="form-control form-control-sm" v-model="rows[i].bed" />
                      </td>
                      <td>
                        <money :disabled="rows[i].bed != ''" class="form-control form-control-sm" v-model="rows[i].bes" />
                      </td>
                      <td>
                        <button v-if="i != rows.length-1" @click="deleteRow(i)" type="button" class="btn btn-sm btn-warning">حذف ردیف</button>
                      </td>
                    </tr>
                    <tr>
                    </tr>
                    <tr class="bg-info text-white">
                      <td colspan="2">
                        اختلاف: {{ Math.abs(bedSum - besSum) | toMoney }} {{ (bedSum > besSum)?'بستانکار':'بدهکار' }}
                      </td>
                      <td colspan="2"></td>
                      <td class="text-left">مجموع:</td>
                      <td class="">{{ bedSum | toMoney }}</td>
                      <td class="">{{ besSum | toMoney }}</td>
                      <td>
                        <button @click="deleteRow(0)" type="button" class="btn btn-sm btn-danger">حذف همه ردیف ها</button>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="row rtl">
            <div class="col-12 ">
              <button type="button" class="btn btn-info ">سند قبلی</button>
              <button type="button" class="btn btn-info ">سند بعدی</button>
              <button @click="validate()" type="button" class="btn submit btn-primary float-left w-100px">ثبت</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="sanad-selection-modal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">اسناد حسابداری</h4>
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
                        <th>شماره سند</th>
                        <th>توضیحات</th>
                        <th>تاریخ</th>
                        <th>جمع بدهکار</th>
                        <th>جمع بستانکار</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(sanad,i) in sanads" :key="i" @click="selectSanad(sanad)">
                        <td>{{ sanad.code }}</td>
                        <td>{{ sanad.explanation }}</td>
                        <td>{{ sanad.date }}</td>
                        <td>{{ sanad.bed }}</td>
                        <td>{{ sanad.bes }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
            <button type="button" class="btn btn-primary">انتخاب</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import accountApiMixin from "@/mixin/accountApi";
import sanadApiMixin from "@/mixin/sanadApi";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
export default {
  name: "Create",
  components: { money, date },
  mixins: [accountApiMixin, sanadApiMixin],
  data() {
    return {
      sanad: {
        type: "temporary"
      },
      rows: [
        {
          bed: "",
          bes: ""
        }
      ],
      itemsToDelete: []
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    setTimeout(() => {
      $("#sanad-selection-modal").modal("show");
    }, 200);
  },
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
        let row = this.rows[this.rows.length - 1];
        if (row && row.account) {
          this.rows.push({
            bed: "",
            bes: ""
          });
        }
      },
      deep: true
    }
  },
  methods: {
    getData() {
      this.getAccounts();
      this.getCostCenterGroups();
      this.getSanads();
    },
    selectSanad(sanad) {
      this.sanad = sanad;
      this.itemsToDelete = [];
      this.rows = [];
      sanad.items.forEach(item => {
        let row = {
          ...item,
          bed: "",
          bes: ""
        };
        row[item.valueType] = item.value;
        this.rows.push(row);
      });
      this.rows.push({ bed: "", bes: "" });
      $("#sanad-selection-modal").modal("hide");
    },
    deleteRow(index) {
      if (index == 0) {
        this.rows.forEach(row => {
          if (row.id) this.itemsToDelete.push(row.id);
        });
        this.rows.splice(0, this.rows.length - 1);
      } else {
        let row = this.rows[index];
        if (row.id) this.itemsToDelete.push(row.id);
        this.rows.splice(index, 1);
      }
    },
    validate() {
      if (this.sanad.id) this.updateSanad();
      else this.storeSanad();
    },
    storeSanad() {
      let data = this.copy(this.sanad);
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].id) data[key] = data[key].id;
      });
      data.code = this.sanadCode;
      this.request({
        url: this.endpoint("sanads/sanads"),
        method: "post",
        data: data,
        success: data => {
          this.sanad = data;
          this.syncSanadItems();
        }
      });
    },
    updateSanad() {
      let data = this.copy(this.sanad);
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].id) data[key] = data[key].id;
      });
      this.request({
        url: this.endpoint("sanads/sanads/" + this.sanad.id),
        method: "put",
        data: data,
        success: data => {
          this.sanad = data;
          this.syncSanadItems();
        }
      });
    },
    syncSanadItems() {
      let updatedItems = [];
      let newItems = [];
      this.rows.forEach((row, i) => {
        if (i == this.rows.length - 1) return;
        let item = this.copy(row);
        Object.keys(item).forEach(key => {
          if (item[key] && item[key].id) item[key] = item[key].id;
        });

        if (row.bed) {
          item.value = row.bed;
          item.valueType = "bed";
        } else {
          item.value = row.bes;
          item.valueType = "bes";
        }
        if (item.id) {
          updatedItems.push(item);
        } else {
          item.sanad = this.sanad.id;
          newItems.push(item);
        }
      });
      Promise.all([
        this.storeSanadItems(newItems),
        this.updateSanadItems(updatedItems),
        this.deleteSanadItems()
      ]).then(data => {
        this.successNotify();
      });
    },
    storeSanadItems(items) {
      if (!items.length) return;
      return this.request({
        url: this.endpoint("sanads/sanadItems/"),
        method: "post",
        data: items,
        success: data => {
          this.log(items.length + " sanad items created");
        }
      });
    },
    updateSanadItems(items) {
      if (!items.length) return;
      return this.request({
        url: this.endpoint("sanads/sanadItems/mass"),
        method: "put",
        data: items,
        success: data => {
          this.log(items.length + " sanad items updated");
        }
      });
    },
    deleteSanadItems() {
      if (!this.itemsToDelete.length) return;
      return this.request({
        url: this.endpoint("sanads/sanadItems/mass"),
        method: "delete",
        data: this.itemsToDelete,
        success: data => {
          this.log(this.itemsToDelete.length + " sanad items deleted");
          this.itemsToDelete = [];
        }
      });
    },
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

