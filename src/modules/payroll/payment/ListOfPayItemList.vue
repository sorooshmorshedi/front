<template>
  <v-card>
    <v-toolbar
        class="mt-10 mr-5 ml-5"
        color="indigo"
        dark
    >
      <v-toolbar-title>حقوق و دستمزد</v-toolbar-title>

      <v-divider
          class="mx-4"
          vertical
      ></v-divider>

      <span class="subheading mr-4">کارگاه :  {{list_of_pay.workshop_display}}</span>
      <v-divider class="mr-4" vertical></v-divider>
      <span class="subheading mr-4 ">سال : {{list_of_pay.year}}</span>

      <v-divider class="mr-4" vertical></v-divider>
      <span class="subheading mr-4 "> ماه : {{list_of_pay.month}}</span>
      <v-divider class="mr-4" vertical></v-divider>

    </v-toolbar>
    <v-card-text>
      <m-datatable :headers="headers" :apiUrl="url" :filters.sync="filters" @dblclick:row="(e, row) => $router.push(to(row.item))"
                   ref="datatable">
        <template #item.detail="{ item }">
          <detail-link :to="to(item)" />
        </template>

      </m-datatable>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: "PaymentItemList",
  props: {},
  data() {
    return {
      url: "payroll/listOfPayItem/all",
      filters: {list_of_pay : this.$route.params.id},
      list_of_pay: null,
    };
  },
  mounted(){
    this.request({
      url: this.endpoint(`payroll/paylist/` + this.$route.params.id + '/' ),
      method: "get",
      success: data => {
        console.log(data);
        this.list_of_pay = data

      }
    })
  },
  computed: {
    headers() {
      return [
        {
          text: "پرسنل در کارگاه",
          value: "personnel_name",
        },
        {
          text: "بیمه مبشود؟",
          value: "is_insurance_display",
        },
        {
          text: "کارکرد عادی",
          value: "normal_worktime",
        },
        {
          text: "کارکرد واقعی",
          value: "real_worktime",
        },
        {
          text: "حقوق",
          value: "total_payment",
        },
      ];
    },
  },
  methods: {
    to(item) {
      return {
        name: "PaymentItemDetail",
        params: {
          id: item.id,
        },
      };
    },

  },
};
</script>

<style scoped lang="scss">
</style>