<template>
  <div>
    <div class="fixed-head">
      <table class="table table-striped table-bordered">
        <thead>
          <tr>
            <th></th>
            <th v-for="(col, i) in filterFields" :key="i">
              <template v-for="(filter, j) in col.filters">
                <input
                  v-if="col.type == 'number'"
                  :key="j"
                  class="form-control text-center"
                  type="number"
                  :placeholder="filter.label"
                  v-model="filters[filter.model]"
                >
                
                <input
                  v-if="col.type == 'text'"
                  :key="j"
                  class="form-control text-center"
                  type="text"
                  :placeholder="filter.label"
                  v-model="filters[filter.model]"
                >
                
                <select
                  v-if="col.type == 'select'"
                  :key="j"
                  class="custom-select"
                  v-model="filters[filter.model]"
                >
                  <option selected value="undefined">همه</option>
                  <option
                    v-for="(o,i) in col.original.options"
                    :key="i"
                    :value="o.value"
                  >{{ o.label }}</option>
                </select>

                <date
                  v-if="col.type == 'date'"
                  :key="j"
                  class="form-control text-center"
                  :placeholder="filter.label"
                  v-model="filters[filter.model]"
                />

                <money
                  v-if="col.type == 'money'"
                  :key="j"
                  class="form-control text-center"
                  :placeholder="filter.label"
                  v-model="filters[filter.model]"
                />

                <mtime
                  v-if="col.type == 'time'"
                  :key="j"
                  class="form-control text-center"
                  :placeholder="filter.label"
                  v-model="filters[filter.model]"
                />
              </template>
            </th>
            <th>
              <button @click="clearFilters()" class="btn btn-block btn-info">خالی کردن فیلتر ها</button>
            </th>
          </tr>

          <tr>
            <th>#</th>

            <th v-for="(col, i) in cols" :key="i" @click="orderBy(col)">
              <span style="margin-left: 5px;" v-if="col.sortable == undefined || col.sortable">
                <i class="fas" :class="orderClass(col)"></i>
              </span>
              {{ col.th }}
            </th>

            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in items" :key="i">
            <td>{{ offset+i+1 }}</td>
            <td v-for="(col, j) in cols" :key="j">
              <template v-if="col.type == 'select'">{{ getSelectLabel(item, col)}}</template>
              <template v-else-if="col.type == 'money' ">{{ get(item, col) | toMoney }}</template>
              <template v-else>{{ get(item, col) }}</template>
            </td>
            <td>
              <a v-if="routerName" @click.prevent="goToDetails(item)" href>مشاهده جزئیات</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Page navigation rtl">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{disabled: offset == 0}">
          <a @click.prevent="previousPage()" class="page-link" href="#">
            <i class="fas fa-angle-double-right"></i>
          </a>
        </li>
        <li
          class="page-item"
          v-for="(page, i) in pages.pages"
          :key="i"
          :class="{active: page == pages.currentPage}"
        >
          <a v-if="page == -1" @click.prevent class="page-link" href="#">...</a>
          <a v-else @click.prevent="goToPage(page)" class="page-link" href="#">{{ page+1 }}</a>
        </li>
        <li class="page-item" :class="{disabled: offset + limit >= count}">
          <a class="page-link" href="#" @click.prevent="nextPage()">
            <i class="fas fa-angle-double-left"></i>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import mtime from "@/components/mcomponents/cleave/Time";
import moment from "moment-jalaali";
import _ from "lodash";
export default {
  name: "Datatable",
  props: {
    url: {},
    routerName: {},
    routerDefaultParams: {},
    cols: {},
    defaultFilters: {}
  },
  components: { date, money, mtime },
  data() {
    return {
      items: [],
      oldItems: [],
      limit: 10,
      offset: 0,
      count: 0,
      filters: {},
      order: "",
      debouncedGetData: null
    };
  },
  created() {
    this.debouncedGetData = _.debounce(this.getData, 1000);
    this.clearFilters();
  },
  mounted() {},
  watch: {
    filters: {
      handler() {
        if (this.debouncedGetData) this.debouncedGetData();
        else this.getData();
      },
      deep: true
    },
    order() {
      this.offset = 0;
      this.getData();
    },
    url() {
      this.items = [];
      // Why condition?
      this.debouncedGetData && this.debouncedGetData();
    },
    defaultFilters() {
      // Why check for difference with filters?
      // Just reset filters
      let flag = true;
      for (const df of Object.keys(this.defaultFilters)) {
        if (this.filters[df] != this.defaultFilters[df]) flag = false;
      }
      if (flag) return;
      this.items = [];
      if (this.defaultFilters) {
        this.filters = { ...this.defaultFilters };
      } else {
        this.filters = {};
      }
    }
  },
  computed: {
    pages() {
      let pages = [];
      let currentPage = this.offset / this.limit;
      let lastPage = Math.ceil(this.count / this.limit);
      let pageLinkLimit = 2;

      let si = Math.max(currentPage - pageLinkLimit, 0);
      let ei = Math.min(currentPage + pageLinkLimit + 1, lastPage);

      if (si != 0) pages.push(-1);

      for (let i = si; i < ei; i++) {
        pages.push(i);
      }

      if (ei != lastPage) pages.push(-1);

      let res = {
        currentPage,
        pages
      };

      return res;
    },
    filterFields() {
      let res = [];
      for (let col of this.cols) {
        if (!col.filters) {
          res.push({ filters: [] });
          continue;
        }
        let colFilters = [];
        for (let filter of col.filters) {
          if (typeof filter === "string") {
            colFilters.push({
              label: "فیلتر " + col.th,
              model: filter
            });
          } else {
            colFilters.push(filter);
          }
        }
        res.push({
          filters: colFilters,
          type: col.type,
          original: col
        });
      }
      return res;
    }
  },
  methods: {
    getData() {
      this.log("Get data");
      if (!this.url) {
        this.warn("URL is not provided");
        return;
      }
      let filters = {};
      Object.keys(this.filters).forEach(k => {
        if (["undefined", ""].includes(this.filters[k])) return;

        if (k.includes("date") || k.includes("due")) {
          let gDate = this.toGDate(this.filters[k]);
          if (gDate == "Invalid date") {
            this.notify("فرمت تاریخ وارد شده معتبر نمی باشد", "danger");
            return;
          }
          filters[k] = gDate;
        } else {
          filters[k] = this.filters[k];
        }
      });
      this.request({
        url: this.endpoint(this.url),
        method: "get",
        params: {
          limit: this.limit,
          offset: this.offset,
          ordering: this.order,
          ...filters
        },
        success: data => {
          this.count = data.count;
          if (this.offset == 0) this.oldItems = [];
          else this.oldItems = this.items;
          this.items = data.results;
        }
      });
    },
    orderBy(col) {
      if (col.sortable == undefined || col.sortable) {
        let newOrder;
        if (col.order) {
          this.order = col.order(this.order);
        } else {
          newOrder = col.td.split(".").join("__");
          if (this.order == newOrder) this.order = `-${newOrder}`;
          else if (this.order == `-${newOrder}`) this.order = "";
          else this.order = newOrder;
        }
        this.log("ordered by ", this.order);
      }
    },
    orderClass(col) {
      if (col.orderClass) return col.orderClass(this.order);
      let td = col.td.split(".").join("__");
      if (this.order == td) return { "fa-sort-up": true };
      if (this.order == `-${td}`) return { "fa-sort-down": true };
      return { "fa-sort": true };
    },
    nextPage() {
      this.offset += this.limit;
      this.getData();
    },
    previousPage() {
      this.offset -= this.limit;
      this.getData();
    },
    goToPage(n) {
      this.offset = this.limit * n;
      console.log(this.offset, this.limit, n);
      // return;
      this.getData();
    },
    get(item, col) {
      if (col.render) {
        return col.render(item, this.items, this.oldItems);
      }
      return _.get(item, col.td, "-");
    },
    goToDetails(item) {
      let params = {
        id: item.id
      };
      if (this.routerDefaultParams)
        params = { ...params, ...this.routerDefaultParams };
      this.$router.push({ name: this.routerName, params });
    },
    getSelectLabel(item, col) {
      let option = col.options.filter(o => this.get(item, col) == o.value)[0];
      if (option) return option.label;
      console.warn(item, col);
      return "-";
    },
    clearFilters() {
      if (this.defaultFilters) {
        this.filters = { ...this.defaultFilters };
      } else {
        this.filters = {};
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.fixed-head {
  overflow-y: auto;
  max-height: calc(100vh - 100px);
}

.fixed-head thead tr:nth-child(1) th {
  vertical-align: top;
}

.fixed-head thead tr:nth-child(2) {
  th {
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
    position: sticky;
    top: 0;
    background-color: #eee;
    cursor: pointer;
  }
}

.fa-sort {
  color: rgba(0, 0, 0, 0.3);
}
</style>