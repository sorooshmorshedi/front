<script>
import { Doughnut, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Doughnut,
  props: {
    label: {},
    codeStartsWith: {},
    legendPossition: {},
    value: {},

    height: {
      default: null,
    },
    width: {
      default: null,
    },
  },
  data() {
    return {
      colors: [
        "rgb(54, 162, 235)",
        "rgb(75, 192, 192)",
        "rgb(255, 159, 64)",
        "rgb(153, 102, 255)",
        "rgb(255, 99, 132)",
        "rgb(255, 205, 86)",
      ],
    };
  },
  computed: {
    labels() {
      return this.data.map((o) => o.name);
    },
    dataset() {
      return this.data.map((o) => o[this.value] || Math.floor(Math.random() * 10 ** 9));
    },
    backgroundColor() {
      return this.data.map((o, i) => this.colors[i % this.colors.length]);
    },
    chartData() {
      return {
        labels: this.labels,
        datasets: [
          {
            label: this.label,
            backgroundColor: this.backgroundColor,
            data: this.dataset,
          },
        ],
      };
    },
    chartOptions() {
      return {
        title: {
          text: this.label,
        },
        tooltips: {
          callbacks: {
            label: ({ index }, data) => {
              let label = data.labels[index];
              let value = data.datasets[0].data[index];
              return `${label} ${this.toMoney(value)}`;
            },
          },
        },
        legend: {
          position: this.legendPossition,
          rtl: true,
        },
      };
    },
  },
  mounted() {
    this.request({
      url: this.endpoint("reports/buySale?limit=10&offset=0&search=&factor__type__in=sale,backFromSale"),
      method: "get",
      params: {
        account_code_starts_with: this.codeStartsWith,
      },
      success: (data) => {
        this.data = data.filter((o) => o.level == 1);

        this.renderChart(this.chartData, this.chartOptions);
      },
    });
  },
};
</script>