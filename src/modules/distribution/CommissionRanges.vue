<template>
  <m-form
    title="بازه پورسانت"
    :items="items"
    :showList="true"
    :cols="cols"
    :canSubmit="canSubmit"
    :canDelete="canDelete"
    :is-editing.sync="isEditing"
    :showListBtn="false"
    :show-navigation-btns="false"
    @click:row="setItem"
    @clearForm="clearForm"
    @submit="submit"
    @delete="deleteItem"
  >
    <template #default>
      <v-row>
        <v-col cols="12">
          <v-text-field class="rounded-lg" label=" * نام" v-model="item.name" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12">
          <input-table v-model="rows">
            <template #thead>
              <tr>
                <th>#</th>
                <th>از مبلغ</th>
                <th>تا مبلغ</th>
                <th>درصد پورسانت</th>
                <th></th>
              </tr>
            </template>
            <template #tbody>
              <tr v-for="(row,i) in rows" :key="i">
                <td class="tr-counter">{{ i+1 }}</td>
                <td>
                  <money v-model="row.from_value" :disabled="!isEditing" />
                </td>
                <td>
                  <money v-model="row.to_value" :disabled="!isEditing" />
                </td>
                <td>
                  <money v-model="row.percent" :disabled="!isEditing" />
                </td>
                <td class="d-print-none">
                  <v-btn
                    v-if="i != rows.length-1"
                    @click="deleteRow(i)"
                    class="red--text"
                    icon
                    :disabled="!isEditing"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </input-table>
        </v-col>
        <v-col cols="12">
          <v-textarea class="rounded-lg" label="توضیحات" v-model="item.explanation" :disabled="!isEditing" />
        </v-col>
      </v-row>
    </template>
  </m-form>
</template>
<script>
import { MFormMixin } from "@/components/m-form";
import DistributionApiMixin from "@/modules/distribution/api";

export default {
  name: "CommissionRanges",
  mixins: [MFormMixin, DistributionApiMixin],
  data() {
    return {
      item: {},
      baseUrl: "distributions/commissionRanges",
      permissionBasename: "commissionRange",
      rowKey: "from_value",
      appendSlash: true,
      cols: [
        {
          text: "نام",
          value: "name",
        },
      ],
    };
  },
  computed: {
    items() {
      return this.commissionRanges;
    },
  },
  methods: {
    getData() {
      this.getCommissionRanges(true);
    },
    getRowTemplate() {
      return {
        from_value: null,
        to_value: null,
        percent: null,
      };
    },
    getItemTemplate() {
      return {};
    },
  },
};
</script>