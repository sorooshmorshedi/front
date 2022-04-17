import Options from './Options';
import Cars from './Cars';
import Drivers from './Drivers';
import Drivings from './Drivings';
import Associations from "./Associations"

import LadingBillSeries from "./LadingBillSeries"
import RevokeLadingBillNumber from "./RevokeLadingBillNumber"
import Remittance from "./Remittance"
import Lading from "./Lading"
import OilCompanyLading from "./OilCompanyLading"
import OtherDriverPayment from "./OtherDriverPayment"

import OtherDriverPaymentReport from "./reports/OtherDriversPaymentReport.vue"
import RemittancesList from "./reports/RemittancesList.vue"
import LadingBillSeriesList from "./reports/LadingBillSeriesList"
import LadingsList from "./reports/LadingsList"
import LadingNumberReport from "./reports/LadingNumberReport"
import OilCompanyLadingsList from "./reports/OilCompanyLadingsList"
import LadingsReportForContractor from "./reports/LadingsReportForContractor"
import LadingsReportForDriver from "./reports/LadingsReportForDriver"
import TransportationCommissionReport from "./reports/TransportationCommissionReport"
import OtherDriverPaymentsList from "./reports/OtherDriverPaymentsList"

export default [{
    name: 'Options',
    path: 'options',
    component: Options,
  }, {
    name: 'DashtbashiCars',
    path: 'dashtbashiCars',
    component: Cars,
  },
  {
    name: 'DashtbashiDrivers',
    path: 'dashtbashiDrivers',
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
    name: 'RemittancesList',
    path: 'remittancesList',
    component: RemittancesList,
  },
  {
    name: 'LadingBillSeriesList',
    path: 'ladingBillSeriesList',
    component: LadingBillSeriesList,
  },
  {
    name: 'LadingsList',
    path: 'ladingsList',
    component: LadingsList
  },
  {
    name: 'OilCompanyLadingsList',
    path: 'OilCompanyLadingsList/:detailed?',
    component: OilCompanyLadingsList,
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