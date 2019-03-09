<template>
  <div>
    <div class="fixed-head">
      <table class="table table-striped table-bordered">
        <thead>
          <!-- Filters -->
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
                  <option selected value>همه</option>
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
          <!-- Idk -->
          <tr v-if="colHeaders">
            <th
              v-for="(header, i) in colHeaders"
              :key="i"
              :colspan="header.colspan"
              class="text-center"
            >{{ header.title }}</th>
          </tr>
          <!-- Headers (th) -->
          <tr>
            <th>#</th>
            <th v-for="(col, i) in notHiddenCols" :key="i" @click="orderBy(col)">
              <span style="margin-left: 5px;">
                <i class="fas" :class="orderClass(col)"></i>
              </span>
              {{ col.th }}
            </th>

            <th></th>
          </tr>
        </thead>
        <tbody>
          <!-- Rows -->
          <tr v-for="(item, i) in items" :key="i" :class="item.classes" @click="rowClick(item)">
            <td>{{ offset+i+1 }}</td>
            <td v-for="(col, j) in notHiddenCols" :key="j">
              <template v-if="col.type == 'select'">{{ getSelectLabel(item, col)}}</template>
              <template v-else-if="col.type == 'money' ">{{ get(item, col.td) | toMoney }}</template>
              <template v-else>{{ get(item, col.td) }}</template>
            </td>
            <td>
              <a v-if="routerName" @click.prevent="goToDetails(item)" href>مشاهده جزئیات</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Page navigation rtl " style="display:none">
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
    routerName: {},
    routerDefaultParams: {},
    cols: {},
    defaultFilters: {},
    data: {},
    colHeaders: {},
    hiddenCols: {
      default() {
        return [];
      }
    }
  },
  components: { date, money, mtime },
  data() {
    return {
      limit: 10,
      offset: 0,
      count: 0,
      filters: {},
      order: ""
    };
  },
  created() {
    this.clearFilters();
  },
  mounted() {},
  watch: {
    defaultFilters() {
      this.items = [];
      if (this.defaultFilters) {
        this.filters = { ...this.defaultFilters };
      } else {
        this.filters = {};
      }
    }
  },
  computed: {
    items() {
      let res = this.data.filter(item => {
        for (const filter of Object.keys(this.filters)) {
          let arr = filter.split("__");
          if (arr.length > 2) console.error("Error in filter:", filter);

          if (
            arr.length == 1 &&
            !String(this.get(item, arr[0])).includes(
              String(this.filters[arr[0]])
            )
          ) {
            return false;
          }

          let filterName = arr[0];
          let filterValue = this.filters[filter];
          let filterType = arr[1];

          let filterFunction = this.getFilterFunction(filter);
          if (filterFunction && !filterFunction(item, filterValue)) {
            return false;
          }

          if (!filterValue) continue;

          switch (filterType) {
            case "gte":
              if (this.get(item, filterName) < filterValue) return false;
              break;
            case "lte":
              if (this.get(item, filterName) > filterValue) return false;
              break;
            case "startswith":
              return _.startsWith(this.get(item, filterName), filterValue);
              break;
            case "endswith":
              return _.endsWith(this.get(item, filterName), filterValue);
              break;
          }
        }
        return true;
      });

      if (this.order) res = this.sortItems(res);

      return res;
    },
    pages() {
      let pages = [];
      let currentPage = this.offset / this.limit;
      let lastPage = Math.floor(this.count / this.limit);

      let pageLinkLimit = 2;

      if (currentPage >= 3) pages.push(-1);
      for (let i = currentPage - pageLinkLimit; i <= currentPage; i++) {
        if (i < 0) continue;
        pages.push(i);
      }

      for (
        let i = currentPage + 1;
        i <= currentPage + pageLinkLimit && i <= lastPage;
        i++
      )
        pages.push(i);
      if (pages[pages.length - 1] != lastPage) pages.push(-1);

      return {
        currentPage,
        pages
      };
    },
    filterFields() {
      let res = [];
      for (let col of this.notHiddenCols) {
        let colFilters = [];
        if (!col.filters) continue;
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
    },
    notHiddenCols() {
      return this.cols.filter(o => {
        return !this.hiddenCols.includes(o.td);
      });
    }
  },
  methods: {
    orderBy(col) {
      if (col.sortable == false) return;
      if (this.order == col.td) this.order = `-${col.td}`;
      else if (this.order == `-${col.td}`) this.order = "";
      else this.order = col.td;
      this.log("ordered by ", this.order);
    },
    orderClass(col) {
      let td = col.td;
      if (col.sortable == false) return { hide: true };
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
      this.getData();
    },
    get(o, p) {
      return _.get(o, p, "-");
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
      let option = col.options.filter(
        o => this.get(item, col.td) == o.value
      )[0];
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
    getFilterFunction(filterModel) {
      for (const col of this.cols) {
        for (const filter of col.filters) {
          if (filter.model == filterModel) {
            return filter.filter;
          }
        }
        return null;
      }
    },
    rowClick(item) {
      this.$emit("rowClick", item);
    },
    sortItems(items) {
      items.sort((a, b) => {
        let rev = false;
        let field = this.order.split("__").join("");
        if (this.order[0] == "-") {
          rev = true;
          field = field.substr(1, field.length - 1);
        }
        if (a[field] > b[field]) {
          return rev ? 1 : -1;
        }
        return rev ? -1 : 0;
      });
      return items;
    }
  }
};
</script>

<style lang="scss" scoped>
@import url('./datatable.scss');
</style>
