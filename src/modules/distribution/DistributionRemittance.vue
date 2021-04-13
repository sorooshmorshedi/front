<template>
  <v-card>
    <v-card-title>حواله توزیع</v-card-title>
    <v-card-text>
      <v-row v-if="item">
        <v-col cols="12" md="2">
          <v-text-field disabled label="عطف" :value="item.local_id" background-color="white" />
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field disabled label="شماره" :value="item.code" background-color="white" />
        </v-col>
        <v-col cols="12" md="2">
          <date :value="item.date" label="تاریخ" :default="true" disabled />
        </v-col>

        <v-col cols="12" md="2">
          <mtime label="ساعت" :value="item.time" disabled />
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field label="ماشین" :value="item.car.car_number" disabled />
        </v-col>

        <v-col cols="12" md="8">
          <v-textarea label="توضیحات" :value="item.explanation" disabled></v-textarea>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            label="کاربر"
            disabled
            v-if="item.created_by"
            :value="item.created_by.name"
          />
        </v-col>
        <v-col cols="12">
          <m-datatable :headers="headers" :items="items" :filters.sync="filters" ref="datatable"></m-datatable>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import mtime from "@/components/mcomponents/cleave/Time";
export default {
  name: "DistributionRemittance",
  components: { mtime },
  props: {
    id: {
      required: true,
    },
  },
  data() {
    return {
      item: null,
      filters: {},
    };
  },
  computed: {
    headers() {
      let headers = [
        {
          text: "نام کالا",
          value: "name",
        },
        {
          text: "کد کالا",
          value: "code",
        },
        {
          text: "تعداد",
          value: "string_count",
        },
      ];

      return headers;
    },
    items() {
      return this.item.wares;
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.request({
        url: this.endpoint(`distributions/distributions/${this.id}`),
        method: "get",
        success: (data) => {
          this.item = data;
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
</style>
/style>