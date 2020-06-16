<template>
  <div>
    <v-simple-table dense>
      <thead class="grey lighten-3">
        <tr class>
          <th>
            <v-btn @click="clearFilters()" icon class="red--text">
              <v-icon>delete_sweep</v-icon>
            </v-btn>
          </th>
          <th v-for="(col, i) in filterFields" :key="i" class="py-2 px-1">
            <template v-for="(filter, j) in col.filters">
              <v-text-field
                v-if="col.type == 'number'"
                :key="j"
                class="form-control text-center"
                type="number"
                :placeholder="filter.label"
                v-model="filters[filter.model]"
              />

              <v-text-field
                v-if="col.type == 'text'"
                :key="j"
                class="form-control text-center"
                type="text"
                :placeholder="filter.label"
                v-model="filters[filter.model]"
              />

              <v-select
                v-if="col.type == 'select'"
                :key="j"
                v-model="filters[filter.model]"
                :items="col.original.options"
                item-text="label"
                item-value="value"
                clearable
              ></v-select>

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
        </tr>

        <!-- Header of headers -->
        <tr v-if="colHeaders">
          <th
            v-for="(header, i) in colHeaders"
            :key="i"
            :colspan="header.colspan"
            class="text-center"
          >{{ header.title }}</th>
        </tr>

        <tr>
          <th>#</th>

          <th v-for="(col, i) in cols" :key="i" @click="orderBy(col)">
            <span style="margin-left: 5px;" v-if="col.sortable == undefined || col.sortable">
              <i class="fas" :class="orderClass(col)"></i>
            </span>
            {{ col.th }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in items" :key="i" :class="itemRowClasses(item, i, items)">
          <td v-if="hasSum && !hasNextPage && i == items.length-1">جمع</td>
          <td v-else>{{ offset+i+1 }}</td>
          <template v-for="(col, j) in cols">
            <td v-if="col.type == 'select'" :key="j">{{ getSelectLabel(item, col)}}</td>
            <td v-else-if="col.type == 'money' " :key="j" class="ltr">{{ get(item, col) | toMoney }}</td>
            <td v-else :key="j">{{ get(item, col) }}</td>
          </template>
          <td v-if="routerName">
            <v-btn icon :to="routerParam(item)" target="_blank" color="blue">
              <v-icon>fa-external-link-alt</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
    <nav>
      <div class="row">
        <div class="col-md-6 col-12">
          <v-pagination
            :value="pages.currentPage + 1"
            @input="goToPage"
            @next="nextPage"
            @previus="previousPage"
            :length="+Math.ceil(count / limit) -1"
          ></v-pagination>
        </div>
        <div class="col-md-6 col-12 justify-content-left">
          <div class>
            <div class="row">
              <label class="text-left col-md-10 col-12">تعداد رکورد نمایشی</label>
              <div class="col-md-2">
                <v-select v-model="limit" :items="[10, 20, 50, 100, 500]"></v-select>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    colHeaders: {},
    defaultFilters: {},
    hasSum: {
      default: false
    }
  },
  components: { date, money, mtime },
  data() {
    return {
      items: [],
      oldItems: [],
      limit: 20,
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
    limit() {
      this.offset = 0;
      this.debouncedGetData();
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
    defaultFilters: {
      // Why check for difference with filters?
      // Just reset filters
      handler() {
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
      },
      deep: true
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
    hasNextPage() {
      if (this.count > this.offset + this.limit) return true;
      return false;
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
      this.offset = this.limit * (n - 1);
      this.getData();
    },
    get(item, col) {
      if (col.render) {
        return col.render(item, this.items, this.oldItems);
      }
      return _.get(item, col.td, "-");
    },
    routerParam(item) {
      let params = {
        id: item.id
      };
      if (this.routerDefaultParams)
        params = { ...params, ...this.routerDefaultParams };
      return { name: this.routerName, params };
    },
    getSelectLabel(item, col) {
      let option = col.options.filter(o => this.get(item, col) == o.value)[0];
      if (option) return option.label;
      return "-";
    },
    clearFilters() {
      if (this.defaultFilters) {
        this.filters = { ...this.defaultFilters };
      } else {
        this.filters = {};
      }
    },
    itemRowClasses(item, i, items) {
      if (this.hasSum && !this.hasNextPage && i == items.length - 1) {
        return "sum-row";
      }
      return {};
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("./datatable.scss");
</style>