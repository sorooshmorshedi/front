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
import DriverPayment from "./DriverPayment"

import DriverPaymentReport from "./reports/OtherDriversPaymentReport.vue"
import RemittancesReport from "./reports/RemittancesReport.vue"
import LadingBillSeriesList from "./reports/LadingBillSeriesList"
import LadingsReport from "./reports/LadingsReport"
import LadingNumberReport from "./reports/LadingNumberReport"
import OilCompanyLadingsReport from "./reports/OilCompanyLadingsReport"
import LadingsReportForContractor from "./reports/LadingsReportForContractor"
import LadingsReportForDriver from "./reports/LadingsReportForDriver"
import TransportationCommissionReport from "./reports/TransportationCommissionReport"

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
    name: 'DriverPayment',
    path: 'driverPayment/:id?',
    component: DriverPayment,
    props: true,
  },

  {
    name: 'DriverPaymentReport',
    path: 'driverPaymentReport',
    component: DriverPaymentReport,
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
    path: 'oilCompanyLadingsReport',
    component: OilCompanyLadingsReport
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

]