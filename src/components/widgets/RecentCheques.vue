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
import MDatatable from "@/components/mcomponents/datatable/MDatatable";
export default {
  components: { MDatatable },
  props: {
    type: {
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
      return this.now.add("day", 1).format("jYYYY-jMM-jDD");
    },
    listRoute() {
      return {
        name: "List",
        params: {
          form: "cheque",
          type: this.type == "p" ? "paid" : "received",
        },
        query: {
          status__in: "notPassed",
          due__lte: this.limit,
        },
      };
    },
  },
  mounted() {
    this.request({
      url: this.endpoint("reports/lists/cheques"),
      method: "get",
      params: {
        limit: 7,
        offset: 0,
        status: "notPassed",
        received_or_paid: this.type,
        due__lte: this.limit,
      },
      success: (data) => {
        this.items = data.results;
      },
    });
  },
};
</script>