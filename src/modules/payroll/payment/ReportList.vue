<template>
  <v-card class="rounded-lg">
    <v-toolbar
        class="mt-3 mr-3 ml-3 rounded-lg"
        flat
        color="back"
    >
      <v-toolbar-title class="secondary--text">حقوق و دستمزد {{ list_of_pay.name }}</v-toolbar-title>
      <span class="subheading mr-4 ml-4 secondary--text">کارگاه :  {{ list_of_pay.workshop_display }}</span>
      <span class="subheading mr-4 secondary--text ">سال : {{ list_of_pay.year }}</span>
      <span class="subheading mr-2 ml-2 secondary--text "> ماه : {{ list_of_pay.month_name }}</span>
      <v-spacer></v-spacer>
      <v-tooltip top color="secondary">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              v-bind="attrs"
              v-on="on"
              small
              class="secondary white--text mr-1 mt-1 mt-md-0 pa-4"
              @click="goToList"
              icon
          >
            <v-img max-height="25" max-width="25" src="/img/icons/list_icon.svg"></v-img>
          </v-btn>
        </template>
        لیست
      </v-tooltip>
      <v-tooltip top color="primary">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              v-bind="attrs"
              v-on="on"
              small
              class=" white--text mr-1 mt-1 mt-md-0 pa-4"
              @click="goToListOfPay"
              icon
          >
            <v-img max-height="38" max-width="38" src="/img/icons/back.svg"></v-img>
          </v-btn>
        </template>
        بازگشت
      </v-tooltip>
    </v-toolbar>
    <v-simple-table
        class="ma-4 "
    >
      <template v-slot:default>
        <thead class="white--text primary">
        <th class="white--text text-center" colspan="5">گزارشات مالیات</th>

        </thead>
        <thead class="white--text secondary">
        <tr>
          <th class="white--text text-center"> فایل اطلاعات کارکنان جدید</th>
          <th class="white--text text-center"> فایل اطلاعات ماهانه کارگاه</th>
          <th class="white--text text-center"> فایل اطلاعات ماهانه کارگران</th>
          <th class="white--text text-center"> گزارش ماهانه</th>
        </tr>
        </thead>
        <tbody class="">
        <tr>

          <td class="pt-3 text-center">
            <v-dialog
                class="rounded-lg"
                max-width="900"
                hide-overlay
                transition="dialog-bottom-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    class="secondary  mr-1 mt-1 mt-md-0"
                    depressed
                    v-bind="attrs"
                    v-on="on"
                    icon
                >
                  <v-img max-height="20" max-width="20" src="/img/icons/file_download.svg"></v-img>
                </v-btn>

              </template>
              <template v-slot:default="dialog">
                <v-card class="rounded-lg">
                  <v-toolbar
                      flat
                      class="rounded-lg"
                      color="success"
                      dark
                  >فایل اطلاعات کارکنان جدید برای مالیات
                  </v-toolbar>
                  <v-card-text class="pa-5">
                    <v-container fluid class="pa-5">
                      <v-select
                          @change="reportTaxPerson"
                          color="info"
                          v-model="workshop_personnel"
                          :items="workshop_personnels"
                          item-text="personnel_name"
                          item-value="id"
                          label="انتخاب پرسنل"
                          multiple
                      >
                        <template v-slot:prepend-item>
                          <v-list-item
                              ripple
                              @mousedown.prevent
                              @click="toggle"
                          >
                            <v-list-item-action>
                              <v-icon :color="workshop_personnel.length > 0 ? 'success' : ''">
                                {{ icon }}
                              </v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                              <v-list-item-title>
                                انتخاب همه
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-divider class="mt-2"></v-divider>
                        </template>
                        <template v-slot:append-item>
                          <v-divider class="mb-2"></v-divider>
                          <v-list-item disabled>
                            <v-list-item-avatar color="grey lighten-3">
                              <v-icon>
                                fa-plus
                              </v-icon>
                            </v-list-item-avatar>

                            <v-list-item-content v-if="getAllPerson">
                              <v-list-item-title>
                                همه پرسنل ها
                              </v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-content v-else-if="getSomePerson">
                              <v-list-item-title>
                                تعداد پرسنل ها
                              </v-list-item-title>
                              <v-list-item-subtitle>
                                {{ workshop_personnel.length }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-content v-else>
                              <v-list-item-title>
                                پرسنلی انتخاب نشده
                              </v-list-item-title>
                              <v-list-item-subtitle>
                                برای گزارش حداقل یک پرسنل نیاز است
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-select>
                    </v-container>
                  </v-card-text>
                  <v-card-actions class="justify-end mt-16 mb-5">
                    <v-btn
                        color="success"
                        class="white--text rounded-lg"
                        depressed
                        large
                        :disabled="workshop_personnel.length == 0"
                        target="_blank"
                        :href="endpoint(`payroll/diskette/tax/newPersons/` + person_string + '/' + '?token=' + token)"
                        @click="dialog.value = false"
                    >گزارش
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </td>
          <td class="pt-3 text-center">
            <v-btn
                small
                target="_blank"
                class="secondary  mr-1 mt-1 mt-md-0"
                :href="endpoint(`payroll/diskette/tax/summary/` + $route.params.id + '/' + '?token=' + token)"
                icon
            >
              <v-img max-height="20" max-width="20" src="/img/icons/file_download.svg"></v-img>
            </v-btn>
          </td>
          <td class="pt-3 text-center">
            <v-btn
                small
                target="_blank"
                class="secondary  mr-1 mt-1 mt-md-0"
                :href="endpoint(`payroll/diskette/tax/` + $route.params.id + '/' + '?token=' + token)"
                icon
            >
              <v-img max-height="20" max-width="20" src="/img/icons/file_download.svg"></v-img>
            </v-btn>
          </td>

          <td class="pt-2 text-center">
            <v-tooltip top color="#019EF6">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    small
                    v-bind="attrs"
                    v-on="on"
                    class="export-btn mr-md-2 mt-2  pa-4"
                    @click="printTaxCardex('html')"
                    icon
                >
                  <v-img max-height="30" max-width="30" src="/img/icons/print_icon.svg"></v-img>
                </v-btn>
              </template>
              چاپ گزارش ماهانه مالیات
            </v-tooltip>
            <v-tooltip top color="#019EF6">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    v-on="on"
                    small
                    class="secondary--text export-btn mt-2  mr-md-2 "
                    @click="printTaxCardex('pdf')"
                    icon
                >
                  <v-img src="/img/icons/pdf.svg"></v-img>
                </v-btn>
              </template>
              خروجی PDF گزارش ماهانه مالیات
            </v-tooltip>
            <v-tooltip top color="#019EF6">
              <template v-slot:activator="{ on, attrs }">
                <v-btn depressed
                       icon
                       v-bind="attrs"
                       v-on="on"
                       @click="printTaxCardex('xlsx')"
                       class="secondary--text export-btn mt-2  mr-md-2 pa-1">
                  <v-img src="/img/icons/xls.svg"></v-img>
                </v-btn>
              </template>
              خروجی اکسل گزارش ماهانه مالیات
            </v-tooltip>
          </td>

        </tr>
        </tbody>
      </template>
    </v-simple-table>


    <v-simple-table
        class="ma-5 "
    >
      <template v-slot:default>
        <thead class="primary">
        <th class="white--text text-center" colspan="5">گزارشات بیمه</th>

        </thead>
        <thead class="white--text secondary">
        <tr>
          <th class="white--text text-center"> کد کارگاه</th>
          <th class="white--text text-center"> ردیف پیمان</th>
          <th class="white--text text-center"> فایل اطلاعات ماهانه کارگاه</th>
          <th class="white--text text-center"> فایل اطلاعات ماهانه بیمه شدگان</th>
          <th class="white--text text-center"> گزارش ماهانه بیمه</th>
        </tr>
        </thead>
        <tbody class="">
        <tr>
          <td class=" text-center pt-3"> {{ list_of_pay.workshop_code }}</td>
          <td class=" text-center pt-3"></td>
          <td class="pt-2 text-center">
            <v-btn
                small
                target="_blank"
                class="secondary  mr-1 mt-1 mt-md-0"
                :href="endpoint(`payroll/diskette/insurance/` + $route.params.id + '/' + '?token=' + token)"
                icon
            >
              <v-img max-height="20" max-width="20" src="/img/icons/file_download.svg"></v-img>
            </v-btn>
          </td>
          <td class="pt-2 text-center">
            <v-btn
                small
                target="_blank"
                class="secondary  mr-1 mt-1 mt-md-0"
                :href="endpoint(`payroll/diskette/insurance/workshopPerson/` + $route.params.id + '/' + '?token=' + token)"
                icon
            >
              <v-img max-height="20" max-width="20" src="/img/icons/file_download.svg"></v-img>
            </v-btn>

          </td>

          <td class="pt-2 text-center">
            <v-tooltip bottom color="#019EF6">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    small
                    v-bind="attrs"
                    v-on="on"
                    class="export-btn mr-md-2 mt-2  pa-4"
                    @click="printCardex('html')"
                    icon
                >
                  <v-img max-height="30" max-width="30" src="/img/icons/print_icon.svg"></v-img>
                </v-btn>
              </template>
              چاپ گزارش ماهانه بیمه
            </v-tooltip>
            <v-tooltip bottom color="#019EF6">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    v-on="on"
                    small
                    class="secondary--text export-btn mt-2  mr-md-2 "
                    @click="printCardex('pdf')"
                    icon
                >
                  <v-img src="/img/icons/pdf.svg"></v-img>
                </v-btn>
              </template>
              خروجی PDF گزارش ماهانه بیمه
            </v-tooltip>
            <v-tooltip bottom color="#019EF6">
              <template v-slot:activator="{ on, attrs }">
                <v-btn depressed
                       icon
                       v-bind="attrs"
                       v-on="on"
                       @click="printCardex('xlsx')"
                       class="secondary--text export-btn mt-2  mr-md-2 pa-1">
                  <v-img src="/img/icons/xls.svg"></v-img>
                </v-btn>
              </template>
              خروجی اکسل گزارش ماهانه بیمه
            </v-tooltip>

          </td>
        </tr>

        <tr v-for="row in contract_row">
          <td class=" text-center pt-3"> {{ list_of_pay.workshop_code }}</td>
          <td class=" text-center pt-3"> {{ row.contract_row }}</td>
          <td class="pt-2 text-center">
            <v-btn
                class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
                rounded
                title="فایل بیمه"
                :href="endpoint(`payroll/diskette/contractRowInsurance/` + $route.params.id + '/' + row.id + '/' + '?token=' + token)"
                icon
            >
              <v-icon>fa-file-download</v-icon>
            </v-btn>
          </td>
          <td class="pt-2 text-center">
            <v-btn
                class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
                rounded
                title="فایل بیمه"
                :href="endpoint(`payroll/diskette/insurance/contractRowPerson/`  + $route.params.id + '/' + row.id + '/' + '?token=' + token)"
                icon
            >
              <v-icon>fa-file-download</v-icon>
            </v-btn>
          </td>
          <td class="pt-2 text-center">
            <v-btn
                class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
                rounded
                title="چاپ"
                icon
                @click="printRowCardex('html', row.id)"
            >
              <v-icon>fa-print</v-icon>
            </v-btn>
            <v-btn
                class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
                rounded
                title="PDF"
                @click="printRowCardex('pdf', row.id)"
                icon

            >
              <v-icon>fa-file-pdf</v-icon>
            </v-btn>
            <v-btn
                small
                class=" grey--text  text--darken-3 export-btn mr-1 mt-1 mt-md-0"
                @click="printRowCardex('xlsx', row.id)"
                title="اکسل"
                icon
            >
              <v-icon>fa-file-excel</v-icon>
            </v-btn>

          </td>

        </tr>
        </tbody>
      </template>
    </v-simple-table>


    <m-datatable v-show="false" :headers="headers" :apiUrl="url" :exportUrl="export_url" :filters.sync="export_filter"
                 ref="exportTable">
    </m-datatable>


  </v-card>
</template>
<script>
export default {
  name: "ReportList",
  props: {},
  data() {
    return {
      ULTIMATE_TYPES: [
        {name: ' قطعی', value: true},
        {name: 'غیر قطعی', value: false},
      ],

      CALCULATE_TYPES: [
        {name: ' محاسبه شده', value: true},
        {name: 'محاسبه نمی شود', value: false},
      ],

      url: "payroll/listOfPayItem/less",
      exportUrl: "payroll/payroll",
      export_url: "payroll/payroll",
      filters: {list_of_pay: this.$route.params.id},
      export_filter: {id: this.$route.params.id},
      accept_dialog: false,
      un_accept_dialog: false,
      delete_dialog: false,
      workshop_personnels: [],
      workshop_personnel: [],
      ids: '',
      person_string: '',
      workshop_dialog: false,
      un_ultimate_dialog: false,
      list_of_pay: null,
      my_list: null,
      contract_row: [],
    };
  },
  mounted() {
    this.request({
      url: this.endpoint(`payroll/paylist/less/` + this.$route.params.id + '/'),
      method: "get",
      success: data => {
        console.log(data)
        this.list_of_pay = data
        this.request({
          url: this.endpoint(`payroll/workshop/workshop_personnel/` + data.workshop + '/'),
          method: "get",
          success: data => {
            for (let person of data) {
              this.workshop_personnels.push(person)
            }
            console.log('---------------------')
            console.log(this.workshop_personnels)
          }
        })

        for (let row of this.list_of_pay.contract_row) {
          this.request({
            url: this.endpoint(`payroll/contract/row/` + row + '/'),
            method: "get",
            success: data => {
              console.log(data)
              this.contract_row.push(data)
            }
          })
        }
      }
    })

  },
  computed: {
    headers() {
      return [];
    },
    getAllPerson() {
      return this.workshop_personnel.length === this.workshop_personnels.length
    },
    getSomePerson() {
      return this.workshop_personnel.length > 0 && !this.getAllPerson
    },
    icon() {
      if (this.getAllPerson) return 'fa-check-square'
      if (this.getSomePerson) return 'fa-check-square'
      return 'fa-square'
    },

  },
  methods: {
    to(item) {
      return {
        name: "ListOfPayItemForm",
        params: {
          id: item.id,
        },
      };
    },
    printThis(type) {
      this.$refs.exportTable.exportTo(type)
    },
    goPay() {
      this.$router.push('/panel/pay/' + this.$route.params.id + '/')
    },

    printInsurance(type, pk) {
      this.export_filter = {id: this.$route.params.id}
      this.export_url = "payroll/total/insurance/report"
      this.$refs.exportTable.exportTo(type)
    },
    printRowInsurance(type, row_id) {
      this.export_filter = {id: this.$route.params.id}
      this.export_url = "payroll/rowInsurance"
      let my_type = type
      my_type = my_type + '/' + row_id.toString() + '/'
      this.$refs.exportTable.exportTo(my_type)
    },

    printTaxCardex(type) {
      this.export_filter = {id: this.$route.params.id}
      this.export_url = 'payroll/tax/cardex'
      this.$refs.exportTable.exportTo(type)

    },
    printTaxWorkshop(type) {
      this.export_filter = {id: this.$route.params.id}
      this.export_url = 'payroll/month/tax'
      this.$refs.exportTable.exportTo(type)

    },
    printCardex(type) {
      this.export_filter = {id: this.$route.params.id}
      this.export_url = 'payroll/insuranceCardex'
      this.$refs.exportTable.exportTo(type)

    },
    printRowCardex(type, row_id) {
      this.export_filter = {id: this.$route.params.id}
      this.export_url = "payroll/rowCardex"
      let my_type = type
      my_type = my_type + '/' + row_id.toString() + '/'
      this.$refs.exportTable.exportTo(my_type)
    },
    goToList() {
      this.$router.push('/panel/ListOfPay')
    },
    goToListOfPay() {
      this.$router.push('/panel/listOfPayItem/' + this.$route.params.id + '/')
    },
    toggle() {
      this.$nextTick(() => {
        if (this.getAllPerson) {
          this.workshop_personnel = []
        } else {
          let persons = []
          for (let person of this.workshop_personnels) {
            persons.push(person.id)
          }
          this.workshop_personnel = persons
        }
        this.reportTaxPerson()
      })
    },
    reportTaxPerson() {
      this.person_string = ''
      for( let person in this.workshop_personnel ){
        if (this.person_string == '') {
        this.person_string += this.workshop_personnel[person]
        } else {
          this.person_string += '-'
          this.person_string += this.workshop_personnel[person]

        }
      }
    },



  }
};
</script>

<style scoped lang="scss">
</style>