<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="title">لیست شرکت ها</div>
      <table class="table table-stripped">
        <thead>
          <tr>
            <th>#</th>
            <th>نام شرکت</th>
            <th>شروع سال مالی</th>
            <th>پایان سال مالی</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(c, i) in companies" :key="i">
            <td>{{ i+1 }}</td>
            <td>{{ c.name }}</td>
            <td>{{ c.fiscal_year_start }}</td>
            <td>{{ c.fiscal_year_end }}</td>
            <td>
              <router-link
                :to="{name: 'UpdateCompany', params: {id: c.id}}"
                class="btn btn-info"
              >ویرایش</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
      companies: []
    };
  },
  created() {
    this.getCompanies();
  },
  methods: {
    getCompanies() {
      this.request({
        url: this.endpoint("companies/"),
        method: "get",
        success: data => {
          this.companies = data;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
* {
}
</style>
