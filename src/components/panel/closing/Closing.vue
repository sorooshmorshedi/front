<template>
  <div class="rtl">
    <div>
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <div class="row">
            <div class="form-group col-12">
              <label class="required">سال مالی جدید</label>
              <multiselect
                dir="rtl"
                :options="financialYears"
                v-model="targetFinancialYear"
                track-by="id"
                label="name"
                :multiple="false"
              />
            </div>
            <div class="col-12">
              <button @click="close" type="button" class="btn btn-info w-100px">بستن و انتقال</button>
              <button @click="move" type="button" class="btn btn-info w-100px">انتقال</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      targetFinancialYear: null
    };
  },
  computed: {
    financialYears() {
      if (!this.user || !this.user.active_company) return [];
      return this.user.active_company.financial_years.filter(
        o => o.id != this.user.active_financial_year.id
      );
    }
  },
  methods: {
    close() {
      this.request({
        url: this.endpoint("companies/closeFinancialYear"),
        method: "post",
        data: {
          target_financial_year: this.targetFinancialYear.id
        },
        success: data => {
          this.successNotify();
        }
      });
    },
    move() {
      this.request({
        url: this.endpoint("companies/moveFinancialYear"),
        method: "post",
        data: {
          target_financial_year: this.targetFinancialYear.id
        },
        success: data => {
          this.successNotify();
        }
      });
    }
  }
};
</script>