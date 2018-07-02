<template>
  <div class="row rtl">
    <div class="col-12 col ">
      <div class="card right ">
        <div class="card-body">
          <div class="title">مرکز هزینه</div>
          <div id="accordion">
            <button @click="createCCG()" type="button" class="btn btn-info">افزودن گروه مرکز هزینه</button>
            <button @click="createCC()" type="button" class="btn btn-info">افزودن مرکز هزینه</button>
            <div class="card" v-for="(ccg, i) in costCenterGroups" :key="i">
              <div class="card-header">
                <h5 class="mb-0">
                  <button class="btn btn-link" data-toggle="collapse" :data-target="'#collapse' + i">
                    {{ ccg.name }}
                  </button>
                  <i class="fas fa-pencil-alt text-warning" @click="editCCG(ccg)" />
                  <i class="fas fa-trash-alt text-danger" @click="deleteCCG(ccg)" />
                  <i class="fas fa-plus text-success" @click="createCC(ccg)" />
                </h5>
              </div>
              <div :id="'collapse' + i" class="collapse show">
                <div class="card-body">
                  <b v-if="ccg.explanation">توضیحات : </b>
                  {{ ccg.explanation }}
                  <br>
                  <br>
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item" v-for="(cc, i) in ccg.costCenters" :key="i">
                      {{ cc.name }}
                      <i class="fas fa-pencil-alt text-warning" @click="editCC(cc,ccg)" />
                      <i class="fas fa-trash-alt text-danger" @click="deleteCC(cc)" />
                      <b v-if="cc.explanation">توضیحات : </b>
                      {{ cc.explanation }}
                    </li>
                  </ul>
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
                  <multiselect label="name" track-by="pk" :options="accountsSelectValues.costCenterGroups" v-model="costCenter.group" />
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
            <button v-if="!costCenterGroup.pk" @click="storeCC()" type="button" class="btn btn-primary">ثبت</button>
            <button v-else @click="updateCC()" type="button" class="btn btn-primary">ثبت</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="ccg" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">گروه مرکز هزینه</h4>
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="form-group col-12">
                  <label for="">نام گروه</label>
                  <input type="text" class="form-control" v-model="costCenterGroup.name">
                </div>
                <div class="form-group col-12">
                  <label>توضیحات</label>
                  <textarea class="form-control" rows="3" v-model="costCenterGroup.explanation"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
            <button v-if="!costCenterGroup.pk" @click="storeCCG()" type="button" class="btn btn-primary">ثبت</button>
            <button v-else @click="updateCCG()" type="button" class="btn btn-primary">ثبت</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import accountMixin from "@/mixin/account";
export default {
  name: "CostCenter",
  mixins: [accountMixin],
  data() {
    return {
      costCenter: {
        group: {}
      },
      costCenterGroup: {}
    };
  },
  methods: {
    editCCG(ccg) {
      this.costCenterGroup = this.copy(ccg);
      $("#ccg").modal("show");
    },
    updateCCG() {
      this.request({
        url: this.endpoint(
          "accounts/costCenterGroups/" + this.costCenterGroup.pk
        ),
        method: "put",
        data: this.costCenterGroup,
        success: data => {
          this.notify("گروه مرکز هزینه با موفقیت ویرایش شد", "success");
          this.getCostCenterGroups(true);
          $("#ccg").modal("hide");
          this.costCenterGroup = {};
        }
      });
    },
    createCCG() {
      $("#ccg").modal("show");
    },
    storeCCG() {
      this.request({
        url: this.endpoint("accounts/costCenterGroups"),
        method: "post",
        data: this.costCenterGroup,
        success: data => {
          this.notify("گروه مرکز هزینه با موفقیت ساخته شد", "success");
          this.getCostCenterGroups(true);
          $("#ccg").modal("hide");
          this.costCenterGroup = {};
        }
      });
    },
    deleteCCG(ccg) {
      this.request({
        url: this.endpoint("accounts/costCenterGroups/" + ccg.pk),
        method: "delete",
        success: data => {
          this.notify("گروه مرکز هزینه با موفقیت حذف شد", "success");
          this.getCostCenterGroups(true);
        }
      });
    },

    createCC(ccg = null) {
      this.costCenter.group = ccg;
      $("#cc").modal("show");
    },
    editCC(cc, ccg) {
      this.costCenter = this.copy(cc);
      this.costCenter.group = ccg;
      $("#cc").modal("show");
    },
    updateCC() {
      let payload = this.copy(this.costCenter);
      payload.group = payload.group.pk;
      this.request({
        url: this.endpoint("accounts/costCenters/" + this.costCenter.pk),
        method: "put",
        data: payload,
        success: data => {
          this.notify("مرکز هزینه با موفقیت ویرایش شد", "success");
          this.getCostCenterGroups(true);
          $("#cc").modal("hide");
          this.costCenter = {};
        }
      });
    },
    storeCC() {
      let payload = this.copy(this.costCenter);
      payload.group = payload.group.pk;
      this.request({
        url: this.endpoint("accounts/costCenters"),
        method: "post",
        data: payload,
        success: data => {
          this.notify("مرکز هزینه با موفقیت ساخته شد", "success");
          this.getCostCenterGroups(true);
          $("#cc").modal("hide");
          this.costCenter = {};
        }
      });
    },
    deleteCC(cc) {
      this.request({
        url: this.endpoint("accounts/costCenters/" + cc.pk),
        method: "delete",
        success: data => {
          this.notify("مرکز هزینه با موفقیت حذف شد", "success");
          this.getCostCenterGroups(true);
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
#accordion {
  .card {
    margin-top: 8px;
    .card-header {
      padding: 5px;
      i {
        font-size: 0.9em;
      }
    }
  }
}
i {
  margin: 0px;
  cursor: pointer !important;
  padding: 5px;
  border-radius: 3px;
  &:hover {
    background-color: #eee;
  }
}
</style>

