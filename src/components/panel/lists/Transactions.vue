<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right ">
        <div class="card-body">
          <div class="title">
            لیست {{ type.label }}
          </div>

          <datatable :cols="cols" :url="url" router-name="TransactionForm" />

        </div>
      </div>
    </div>

  </div>

</template>

<script>
import datatable from "@/components/mcomponents/Datatable";
export default {
  name: "Transaction",
  props: ["transactionType"],
  components: { datatable },
  data() {
    return {
      url: "",
      cols: [
        {
          th: "نام",
          td: "name",
          type: 'text',
          filters: ['name__icontains']
        },
        {
          th: "کد",
          td: "code",
          type: 'number',
          filters: ['code__icontains']
        }
      ],
      type: {
        label: "",
        name: ""
      }
    };
  },
  created() {
    this.url = this.endpoint("reports/transactions");
    this.init();
  },
  methods: {
    init() {
      if (this.transactionType == "receive") {
        this.type.label = "دریافت ها";
        this.type.name = "receive";
      } else if (this.transactionType == "payment") {
        this.type.label = "پرداخت ها";
        this.type.name = "payment";
      } else {
        console.error("404");
      }
    }
  },
  watch: {
    transactionType() {
      this.init();
    }
  }
};
</script>

<style scoped lang="scss">
</style>
