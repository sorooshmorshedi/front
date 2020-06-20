<template>
  <v-card>
    <v-card-title>
      عملیات های بستن
      <v-spacer></v-spacer>
      <v-btn
        @click="cancelClosing"
        :disabled="!financialYear.is_closed"
        class="blue white--text"
      >لغو بستن سال مالی جاری</v-btn>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-autocomplete
            label=" * سال مالی جدید"
            :items="financialYears"
            v-model="targetFinancialYear"
            item-text="name"
            :multiple="false"
          />
        </v-col>
        <v-col cols="12"></v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="financialYear.is_closed"
        @click="close"
        class="blue white--text w-100px"
      >بستن و انتقال</v-btn>
      <v-btn @click="move" class="blue white--text w-100px">انتقال</v-btn>
    </v-card-actions>
  </v-card>
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
          this.$store.commit("setUser", data);
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
          this.$store.commit("setUser", data);
        }
      });
    },
    cancelClosing() {
      this.request({
        url: this.endpoint("companies/cancelFinancialYearClosing"),
        method: "post",
        success: data => {
          this.successNotify();
          this.$store.commit("setUser", data);
        }
      });
    }
  }
};
</script>