<template>
  <list-modal-form
    title="ماشین ها"
    :items="items"
    :cols="cols"
    :deletable="item.id"
    @rowClick="setItem"
    @clearForm="clearForm"
    @submit="submit"
    @delete="deleteItem"
    ref="listModelForm"
  >
    <template #default>
      <v-row>
        <v-col cols="12" md="6">
          <label>شماره ماشین</label>
          <v-row no-gutters class="flex-row-reverse">
            <v-col cols="3">
              <div
                class="v-input v-input--hide-details v-input--dense theme--light v-text-field v-text-field--is-booted v-text-field--enclosed v-text-field--outlined"
              >
                <div class="v-input__control">
                  <div class="v-input__slot white">
                    <fieldset aria-hidden="true">
                      <legend style="width: 0px;">
                        <span>​</span>
                      </legend>
                    </fieldset>
                    <div class="v-text-field__slot ltr">
                      <input id="car-number-1" type="text" v-model="item.car_number[0]" />
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="2">
              <div
                class="v-input v-input--hide-details v-input--dense theme--light v-text-field v-text-field--is-booted v-text-field--enclosed v-text-field--outlined"
              >
                <div class="v-input__control">
                  <div class="v-input__slot white">
                    <fieldset aria-hidden="true">
                      <legend style="width: 0px;">
                        <span>​</span>
                      </legend>
                    </fieldset>
                    <div class="v-text-field__slot ltr">
                      <input id="car-number-2" type="text" v-model="item.car_number[1]" />
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="3">
              <div
                class="v-input v-input--hide-details v-input--dense theme--light v-text-field v-text-field--is-booted v-text-field--enclosed v-text-field--outlined"
              >
                <div class="v-input__control">
                  <div class="v-input__slot white">
                    <fieldset aria-hidden="true">
                      <legend style="width: 0px;">
                        <span>​</span>
                      </legend>
                    </fieldset>
                    <div class="v-text-field__slot ltr">
                      <input id="car-number-3" type="text" v-model="item.car_number[2]" />
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="4">
              <div
                class="v-input v-input--hide-details v-input--dense theme--light v-text-field v-text-field--is-booted v-text-field--enclosed v-text-field--outlined"
              >
                <div class="v-input__control">
                  <div class="v-input__slot white">
                    <fieldset aria-hidden="true">
                      <legend style="width: 0px;">
                        <span>​</span>
                      </legend>
                    </fieldset>
                    <div class="v-text-field__slot ltr">
                      <input id="car-number-4" type="text" v-model="item.car_number[3]" />
                      <div class="v-text-field__suffix">ایران</div>
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="0" md="6"></v-col>
        <v-col cols="12" md="6">
          <v-text-field label="شماره کارت هوشمند" v-model="item.smart_card_number" />
        </v-col>
        <v-col cols="12" md="6">
          <v-autocomplete label="مالک" v-model="item.owner" :items="owners" item-text="text" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="نام مالک" v-model="item.owner_name" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="کد ملی مالک" v-model="item.owner_melli_code" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="VIN" v-model="item.vin" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="نوع" v-model="item.type" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="سیستم" v-model="item.system" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="تیپ" v-model="item.model" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="ظرفیت" v-model="item.capacity" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="سوخت" v-model="item.fue" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="رنگ" v-model="item.color" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="موتور" v-model="item.engine" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="شاسی" v-model="item.chassis" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="اتاق" v-model="item.room" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="شماره مسلسل" v-model="item.serial_number" />
        </v-col>

        <v-col cols="12">
          <v-textarea label="توضیحات" v-model="item.explanation" />
        </v-col>
      </v-row>
    </template>
  </list-modal-form>
</template>
<script>
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";
import GetApi from "./GetApi";

export default {
  mixins: [ListModalFormMixin, GetApi],
  data() {
    return {
      baseUrl: "dashtbashi/cars",
      leadingSlash: true,
      owners: [
        {
          text: "شرکت",
          id: "c"
        },
        {
          text: "دیگر",
          id: "o"
        },
        {
          text: "رحمان",
          id: "rn"
        },
        {
          text: "رحیم",
          id: "rm"
        },
        {
          text: "ابراهیم",
          id: "e"
        }
      ],
      cols: [
        {
          th: "شماره",
          td: "car_number_str",
          type: "text",
          filters: ["car_number_str"]
        }
      ]
    };
  },
  computed: {
    items() {
      return this.$store.state.cars;
    },
    itemTemplate() {
      return {
        car_number: [null, null, null, null]
      };
    }
  },
  mounted() {
    IMask(document.getElementById("car-number-1"), {
      mask: "00"
    });
    IMask(document.getElementById("car-number-2"), {
      mask: "a"
    });
    IMask(document.getElementById("car-number-3"), {
      mask: "000"
    });
    IMask(document.getElementById("car-number-4"), {
      mask: "00"
    });
  },
  methods: {
    getData() {
      this.getCars(true);
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      return item;
    }
  }
};
</script>