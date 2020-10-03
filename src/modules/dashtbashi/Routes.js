const Options = () => import('./Options')
const Cars = () => import('./Cars')
const Drivers = () => import('./Drivers')
const Drivings = () => import('./Drivings')
const Associations = () => import("./Associations")

const LadingBillSeries = () => import("./LadingBillSeries")
const RevokeLadingBillNumber = () => import("./RevokeLadingBillNumber")
const Remittance = () => import("./Remittance")
const Lading = () => import("./Lading")
const OilCompanyLading = () => import("./OilCompanyLading")
const OtherDriverPayment = () => import("./OtherDriverPayment")

const OtherDriverPaymentReport = () => import("./reports/OtherDriversPaymentReport.vue")
const RemittancesReport = () => import("./reports/RemittancesReport.vue")
const LadingBillSeriesList = () => import("./reports/LadingBillSeriesList")
const LadingsReport = () => import("./reports/LadingsReport")
const LadingNumberReport = () => import("./reports/LadingNumberReport")
const OilCompanyLadingsReport = () => import("./reports/OilCompanyLadingsReport")
const LadingsReportForContractor = () => import("./reports/LadingsReportForContractor")
const LadingsReportForDriver = () => import("./reports/LadingsReportForDriver")
const TransportationCommissionReport = () => import("./reports/TransportationCommissionReport")
const OtherDriverPaymentsList = () => import("./reports/OtherDriverPaymentsList")

export default [{
    name: 'Options',
    path: 'options',
    component: Options,
  }, {
    name: 'Cars',
    path: 'cars',
    component: Cars,
  },
  {
    name: 'Drivers',
    path: 'drivers',
    component: Drivers,
  },
  {
    name: 'Drivings',
    path: 'drivings',
    component: Drivings,
  },
  {
    name: 'Associations',
    path: 'associations',
    component: Associations,
  },

  {
    name: 'RevokeLadingBillNumber',
    path: 'revokeLadingBillNumber',
    component: RevokeLadingBillNumber,
  }, {
    name: 'LadingBillSeries',
    path: 'ladingBillSeries/:id?',
    component: LadingBillSeries,
    props: true,
  }, {
    name: 'Remittance',
    path: 'remittance/:id?',
    component: Remittance,
    props: true,
  }, {
    name: 'Lading',
    path: 'Lading/:id?',
    component: Lading,
    props: true,
  }, {
    name: 'OilCompanyLading',
    path: 'oilCompanyLading/:id?',
    component: OilCompanyLading,
    props: true,
  }, {
    name: 'OtherDriverPayment',
    path: 'otherDriverPayment/:id?',
    component: OtherDriverPayment,
    props: true,
  },

  {
    name: 'OtherDriverPaymentReport',
    path: 'OtherDriverPaymentReport',
    component: OtherDriverPaymentReport,
    props: true,
  },
  {
    name: 'RemittancesReport',
    path: 'remittancesReport',
    component: RemittancesReport,
  },
  {
    name: 'LadingBillSeriesList',
    path: 'ladingBillSeriesList',
    component: LadingBillSeriesList,
  },
  {
    name: 'LadingsReport',
    path: 'ladingsReport',
    component: LadingsReport
  },
  {
    name: 'OilCompanyLadingsReport',
    path: 'oilCompanyLadingsReport/:detailed?',
    component: OilCompanyLadingsReport,
    props: true
  },
  {
    name: 'LadingNumberReport',
    path: 'ladingNumberReport',
    component: LadingNumberReport
  },
  {
    name: 'LadingsReportForContractor',
    path: 'ladingReportForContractor',
    component: LadingsReportForContractor
  },
  {
    name: 'LadingsReportForDriver',
    path: 'ladingReportForDriver',
    component: LadingsReportForDriver
  },
  {
    name: 'TransportationCommissionReport',
    path: 'transportationCommissionReport',
    component: TransportationCommissionReport
  },
  {
    name: 'OtherDriverPaymentsList',
    path: 'otherDriverPaymentsList',
    component: OtherDriverPaymentsList
  },

]