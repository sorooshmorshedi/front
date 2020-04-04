<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="title">لیست شرکت ها</div>
      <table class="table table-stripped">
        <thead>
          <tr>
            <th>#</th>
            <th>نام شرکت</th>
            <th>نام سال مالی جاری</th>
            <th>شروع سال مالی جاری</th>
            <th>پایان سال مالی جاری</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(c, i) in companies" :key="i">
            <td>{{ i+1 }}</td>
            <td>{{ c.name }}</td>
            <template v-if="isUserCompany(c)">
              <td>{{ user.active_financial_year.name }}</td>
              <td>{{ user.active_financial_year.start }}</td>
              <td>{{ user.active_financial_year.end }}</td>
            </template>
            <template v-else>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </template>
            <td>
              <button
                @click="activeCompany(c)"
                type="button"
                class="btn btn-info"
              >فعال کردن شرکت</button>
              <router-link
                :to="{name: 'UpdateCompany', params: {id: c.id}}"
                class="btn btn-info"
              >ویرایش</router-link>
              <button
                type="button"
                class="btn btn-info"
                data-toggle="modal"
                data-target="#financial-years"
                @click="selectCompany(c)"
              >سال های مالی</button>
              <button
                type="button"
                class="btn btn-info"
                data-toggle="modal"
                data-target="#financial-year-form"
                @click="selectCompany(c)"
              >تعریف سال مالی جدید</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal fade" id="financial-years" tabindex="-1" v-if="company.id">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">سال های مالی شرکت {{ company.name }}</h5>
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <table class="table table-striped">
              <thead class="thead-inverse">
                <tr>
                  <th>#</th>
                  <th>نام</th>
                  <th>شروع</th>
                  <th>پایان</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(fy, i) in company.financial_years" :key="fy.id">
                  <td>{{ i+1 }}</td>
                  <td>{{ fy.name }}</td>
                  <td>{{ fy.start }}</td>
                  <td>{{ fy.end }}</td>
                  <td>
                    <button
                      @click="activeFinancialYear(fy)"
                      type="button"
                      class="btn btn-info"
                    >فعال کردن سال مالی</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">بستن</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="financial-year-form" tabindex="-1" v-if="company.id">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">تعریف سال مالی جدید برای شرکت {{ company.name }}</h5>
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>نام سال مالی</label>
              <input type="text" class="form-control" v-model="financialYear.name">
            </div>
            <div class="form-group">
              <label>شروع سال مالی</label>
              <date-picker
                v-model="financialYear.start"
                format="YYYY-MM-DD"
                display-format="jYYYY/jMM/jDD"
              />
            </div>
            <div class="form-group">
              <label>پایان سال مالی</label>
              <date-picker
                v-model="financialYear.end"
                format="YYYY-MM-DD"
                display-format="jYYYY/jMM/jDD"
              />
            </div>
            <div class="form-group">
              <label>توضیحات</label>
              <textarea class="form-control" rows="4" v-model="financialYear.explanation"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="createFinancialYear()" type="button" class="btn btn-primary">ثبت</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">بستن</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
      companies: [],
      company: {},
      financialYear: {}
    };
  },
  created() {
    this.getCompanies();
  },
  computed: {},
  methods: {
    getCompanies() {
      this.request({
        url: this.endpoint("companies/"),
        method: "get",
        success: data => {
          this.companies = data;
        }
      });
    },
    selectCompany(company) {
      this.company = company;
      this.financialYear.company = company.id;
    },
    createFinancialYear() {
      this.request({
        url: this.endpoint("companies/financialYears/"),
        method: "post",
        data: this.financialYear,
        success: data => {
          this.notify("سال مالی با موفقیت ثبت شد", "success");
          this.getCompanies();
          $("#financial-year-form").modal("hide");
        }
      });
    },
    activeFinancialYear(financialYear) {
      this.request({
        url: this.endpoint("users/setActiveFinancialYear"),
        method: "post",
        data: {
          financial_year: financialYear.id
        },
        success: data => {
          this.successNotify();
          this.$store.commit("setUser", data);
          $("#financial-years").modal("hide");
        }
      });
    },
    activeCompany(company) {
      this.request({
        url: this.endpoint("users/setActiveCompany"),
        method: "post",
        data: {
          company: company.id
        },
        success: data => {
          this.successNotify();
          this.getCompanies();
        }
      });
    },
    isUserCompany(company) {
      let activeCompany = this.user.active_company;
      let activeFinancialYear = this.user.active_financial_year;
      if (!activeCompany || !activeFinancialYear) return false;
      if (company.id == activeCompany.id) return true;
      return false;
    }
  }
};
</script>

<style scoped lang="scss">
* {
}
</style>
