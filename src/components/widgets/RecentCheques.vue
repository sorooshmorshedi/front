<template>
  <v-card>
    <v-card-title>
      {{ title }}
      <v-spacer></v-spacer>
      <v-btn color="blue white--text" :to="listRoute">مشاهده همه</v-btn>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        :disable-pagination="true"
        :hide-default-footer="true"
      >
        <template #item.value="{ item }">{{ item.value | toMoney }}</template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    type: {
      required: true,
    },
    isPaid: {
      required: true,
    },
  },
  data() {
    return {
      items: [],
      headers: [
        {
          text: "شماره",
          value: "serial",
        },
        {
          text: "شرح",
          value: "explanation",
        },
        {
          text: "تاریخ",
          value: "date",
        },
        {
          text: "تاریخ سررسید",
          value: "due",
        },
        {
          text: "مبلغ",
          value: "value",
        },
        {
          text: "نام حساب",
          value: "account.name",
        },
      ],
    };
  },
  computed: {
    title() {
      if (this.type == "p") {
        return "چک های پرداختنی در هفت روز آینده";
      } else {
        return "چک های دریافتنی در هفت روز آینده";
      }
    },
    limit() {
      return this.serverNow.clone().add("day", 1).format("jYYYY-jMM-jDD");
    },
    listRoute() {
      return {
        name: "ChequesList",
        params: {
          type: this.type == "p" ? "paid" : "received",
        },
        query: {
          "filters.status__in": "notPassed",
          "filters.ordering": "due",
        },
      };
    },
  },
  mounted() {
    this.request({
      url: this.endpoint("reports/lists/cheques"),
      method: "get",
      params: {
        limit: 3,
        offset: 0,
        status: "notPassed",
        is_paid: this.isPaid,
        type: this.type,
        due__lte: this.limit,
        ordering: "due",
      },
      success: (data) => {
        this.items = data.results;
      },
    });
  },
};
</script>