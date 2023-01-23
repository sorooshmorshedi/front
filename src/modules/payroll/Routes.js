import WorkshopList from "@/modules/payroll/workshop/WorkshopList";
import PersonnelList from "@/modules/payroll/personnel/PersonnelList";
import WorkshopContractList from "@/modules/payroll/contract/ContractList";
import WorkshopPersonnelList from "@/modules/payroll/workshop_personnel/WorkshopPersonnelList";
import ContractRowList from "@/modules/payroll/contract_row/ContractRowList";
import PersonnelFamilyList from "@/modules/payroll/personnel_family/PersonnelFamilyList";
import AbsenceList from "@/modules/payroll/absence/AbsenceList";
import HRLetterList from "@/modules/payroll/hr_letter/HRLetterList";
import WorkshopForm from "@/modules/payroll/workshop/WorkshopForm";
import WorkshopInfoList from "@/modules/payroll/workshop/WorkshopInfo";
import WorkshopSettingForm from "@/modules/payroll/workshop/WorkshopSettingForm";
import PersonnelForm from "@/modules/payroll/personnel/PersonnelForm";
import ContractRowForm from "@/modules/payroll/contract_row/ContractRowForm";
import PersonnelFamilyForm from "@/modules/payroll/personnel_family/PersonnelFamilyForm";
import WorkshopContractForm from "@/modules/payroll/contract/ContractForm";
import WorkshopPersonnelForm from "@/modules/payroll/workshop_personnel/WorkshopPersonnelForm";
import AbsenceForm from "@/modules/payroll/absence/AbsenceForm";
import HRLetterForm from "@/modules/payroll/hr_letter/HRLetterForm";
import MissionForm from "@/modules/payroll/mission/MissionForm";
import MissionList from "@/modules/payroll/mission/MissionList";
import PaymentForm from "@/modules/payroll/payment/PaymentForm";
import PayslipForm from "@/modules/payroll/payment/Payslip";
import TemplateForm from "@/modules/payroll/hr_letter/Template";
import TemplateList from "@/modules/payroll/hr_letter/TemplateList";
import PaymentList from "@/modules/payroll/payment/PaymentList";
import PaymentEdit from "@/modules/payroll/payment/PaymentEdit";
import ListOfPayItem from "@/modules/payroll/payment/ListOfPayItemList";
import TaxRowList from "@/modules/payroll/workshop/tax/TaxRowList";
import TaxRowForm from "@/modules/payroll/workshop/tax/TaxRowForm";
import LoanList from "@/modules/payroll/loan/LoanList";
import LoanForm from "@/modules/payroll/loan/LoanForm";
import DeductionList from "@/modules/payroll/deduction/DeductionList";
import DeductionTemplateList from "@/modules/payroll/deduction/DeductionTemplateList";
import AdjustmentList from "@/modules/payroll/contract_row/AdjustmentList";
import AdjustmentForm from "@/modules/payroll/contract_row/AdjustmentForm";
import DeductionForm from "@/modules/payroll/deduction/DeductionForm";
import DeductionTemplate from "@/modules/payroll/deduction/Template";
import PayForm from "@/modules/payroll/pay/PayForm";
import ListOfPayItemForm from "@/modules/payroll/payment/ListOfPayItemForm";
import adjustmentList from "@/modules/payroll/contract_row/AdjustmentList";
import contractRowAdjustment from "@/modules/payroll/contract_row/ContractRowAdjustment";

const Workshop = () => import( /* wepackChunkName: "workshop" */ "@/modules/payroll/workshop/WorkshopForm.vue")
const WorkshopInfo = () => import( /* wepackChunkName: "workshopInfo" */ "@/modules/payroll/workshop/WorkshopInfo.vue")
const WorkshopSetting = () => import( /* wepackChunkName: "workshop_setting" */ "@/modules/payroll/workshop/WorkshopSettingForm.vue")
const Personnel = () => import( /* wepackChunkName: "personnel" */ "@/modules/payroll/personnel/PersonnelForm.vue")
const PersonnelFamily = () => import( /* wepackChunkName: "personnel_family" */ "@/modules/payroll/personnel_family/PersonnelFamilyForm.vue")
const WorkshopPersonnel = () => import( /* wepackChunkName: "workshop_personnel" */ "@/modules/payroll/workshop_personnel/WorkshopPersonnelForm.vue")
const ContractRow = () => import( /* wepackChunkName: "contract_row" */ "@/modules/payroll/contract_row/ContractRowForm.vue")
const WorkshopContract = () => import( /* wepackChunkName: "contract" */ "@/modules/payroll/contract/ContractForm.vue")
const Absence = () => import( /* wepackChunkName: "contract" */ "@/modules/payroll/absence/AbsenceForm.vue")
const HRLetter = () => import( /* wepackChunkName: "hr_letter" */ "@/modules/payroll/hr_letter/HRLetterForm.vue")
const Mission = () => import( /* wepackChunkName: "mission" */ "@/modules/payroll/mission/MissionForm.vue")
const Payment = () => import( /* wepackChunkName: "payment" */ "@/modules/payroll/payment/PaymentForm.vue")
const PayEdit = () => import( /* wepackChunkName: "payment" */ "@/modules/payroll/payment/PaymentEdit.vue")
const TaxRow = () => import( /* wepackChunkName: "tax_row" */ "@/modules/payroll/workshop/tax/TaxRowForm.vue")
const Loan = () => import( /* wepackChunkName: "loan" */ "@/modules/payroll/loan/LoanForm.vue")
const Deduction = () => import( /* wepackChunkName: "deduction" */ "@/modules/payroll/deduction/DeductionForm.vue")
const Pay = () => import( /* wepackChunkName: "pay" */ "@/modules/payroll/pay/PayForm.vue")
const Adjustment = () => import( /* wepackChunkName: "adjustment" */ "@/modules/payroll/contract_row/AdjustmentForm.vue")
const Template = () => import( /* wepackChunkName: "template" */ "@/modules/payroll/hr_letter/Template.vue")
const ListOfPayItemDetail = () => import( /* wepackChunkName: "list_of_pay_item" */ "@/modules/payroll/payment/ListOfPayItemForm.vue")

export default [
    {
        name: 'Workshop',
        path: 'workshop',
        component: Workshop,
        props: true,
        children : [
            {
                name: 'WorkshopDetail',
                path: ':id',
                component: WorkshopForm,
            },
        ]

    },
    {
        name: 'WorkshopList',
        path: 'workshop/list',
        component: WorkshopList,
    },
    {
        name: 'WorkshopSetting',
        path: 'setting',
        component: WorkshopSetting,
        props: true,
        children : [
            {
                name: 'WorkshopSettingDetail',
                path: ':id',
                component: WorkshopSettingForm,
            },
        ]

    },
    {
        name: 'Personnel',
        path: 'personnel',
        component: Personnel,
        props: true,
        children : [
            {
                name: 'PersonnelDetail',
                path: ':id',
                component: PersonnelForm,
            },
        ]

    },
    {
        name: 'PersonnelList',
        path: 'personnel/list',
        component: PersonnelList,
    },
    {
        name: 'TaxRow',
        path: 'tax_row',
        component: TaxRow,
        props: true,
        children : [
            {
                name: 'TaxRowDetail',
                path: ':id',
                component: TaxRowForm,
            },
        ]

    },
    {
        name: 'TaxRowList',
        path: 'tax_row/list',
        component: TaxRowList,
    },
    {
        name: 'ContractRow',
        path: 'contract_row',
        component: ContractRow,
        props: true,
        children : [
            {
                name: 'ContractRowDetail',
                path: ':id',
                component: ContractRowForm,
            },
        ]
    },
    {
        name: 'ContractRowList',
        path: 'contract_row/list',
        component: ContractRowList,
    },

    {
        name: 'PersonnelFamily',
        path: 'personnel_family',
        component: PersonnelFamily,
        props: true,
        children : [
            {
                name: 'PersonnelFamilyDetail',
                path: ':id',
                component: PersonnelFamilyForm,
            },
        ]
    },
    {
        name: 'PersonnelFamilyList',
        path: 'personnel_family/list',
        component: PersonnelFamilyList,
    },

    {
        name: 'WorkshopContract',
        path: 'workshop_contract',
        component: WorkshopContract,
        props: true,
        children : [
            {
                name: 'WorkshopContractDetail',
                path: ':id',
                component: WorkshopContractForm,
            },
        ]
    },
    {
        name: 'WorkshopContractList',
        path: 'workshop_contract/list',
        component: WorkshopContractList,
    },

    {
        name: 'WorkshopPersonnel',
        path: 'workshop_personnel',
        component: WorkshopPersonnel,
        props: true,
        children : [
            {
                name: 'WorkshopPersonnelDetail',
                path: ':id',
                component: WorkshopPersonnelForm,
            },
        ]
    },
    {
        name: 'WorkshopPersonnelList',
        path: 'workshop_personnel/list',
        component: WorkshopPersonnelList,
    },
    {
        name: 'Absence',
        path: 'absence',
        component: Absence,
        props: true,
        children : [
            {
                name: 'AbsenceDetail',
                path: ':id',
                component: AbsenceForm,
            },
        ]
    },
    {
        name: 'AbsenceList',
        path: 'absence/list',
        component: AbsenceList,
    },

    {
        name: 'HRLetter',
        path: 'hr_letter',
        component: HRLetter,
        props: true,
        children : [
            {
                name: 'HRLetterDetail',
                path: ':id',
                component: HRLetterForm,
            },
        ]
    },
    {
        name: 'HRLetterList',
        path: 'hrLetter/list',
        component: HRLetterList,
    },

    {
        name: 'Mission',
        path: 'mission',
        component: Mission,
        props: true,
        children : [
            {
                name: 'MissionDetail',
                path: ':id',
                component: MissionForm,
            },
        ]
    },
    {
        name: 'MissionList',
        path: 'mission/list',
        component: MissionList,
    },

    {
        name: 'Payment',
        path: 'payment',
        component: Payment,
        props: true,
        children : [
            {
                name: 'PaymentDetail',
                path: ':id',
                component: PaymentForm,
            },
        ]

    },
    {
        name: 'PaymentList',
        path: 'ListOfPay',
        component: PaymentList,
    },
    {
        name: 'ListOfPayItem',
        path: 'listOfPayItem',
        component: ListOfPayItem,
        children : [
            {
                name: 'ListOfPayDetail',
                path: ':id',
                component: ListOfPayItem,
            },
        ]

    },

    {
        name: 'WorkshopInfo',
        path: 'info/workshop',
        component: WorkshopInfo,
    },
    {
        name: 'Loan',
        path: 'loan',
        component: Loan,
        props: true,
        children : [
            {
                name: 'LoanDetail',
                path: ':id',
                component: LoanForm,
            },
        ]

    },
    {
        name: 'LoanList',
        path: 'loan/list',
        component: LoanList,
    },
    {
        name: 'Deduction',
        path: 'deduction',
        component: Deduction,
        props: true,
        children : [
            {
                name: 'DeductionDetail',
                path: ':id',
                component: DeductionForm,
            },
        ]

    },
    {
        name: 'DeductionList',
        path: 'deduction/list',
        component: DeductionList,
    },

    {
        name: 'ListOfPayItemForm',
        path: 'listOfPayItemForm',
        component: ListOfPayItemDetail,
        children : [
            {
                name: 'ListOfPayItemForm',
                path: ':id',
                component: ListOfPayItemDetail,
            },
        ]

    },
    {
        name: 'Payslip',
        path: 'Payslip',
        component: PayslipForm,
        children : [
            {
                name: 'PayslipDetail',
                path: ':id',
                component: PayslipForm,
            },
        ]

    },
    {
        name: 'payForm',
        path: 'pay',
        component: Pay,
        children : [
            {
                name: 'pay',
                path: ':id',
                component: PayForm,
            },
        ]

    },

    {
        name: 'Adjustment',
        path: 'adjustment',
        component: Adjustment,
        props: true,
        children : [
            {
                name: 'AdjustmentDetail',
                path: ':id',
                component: AdjustmentForm,
            },
        ]

    },
    {
        name: 'AdjustmentList',
        path: 'adjustment/list',
        component: adjustmentList,
    },
    {
        name: 'ContractRowAdjustment',
        path: 'ContractRowAdjustment',
        component: contractRowAdjustment,
    },
    {
        name: 'HRTemplate',
        path: 'hr_template',
        component: TemplateForm,
        props: true,
        children : [
            {
                name: 'HRTemplateDetail',
                path: ':id',
                component: TemplateForm,
            },
        ]
    },
    {
        name: 'TemplateList',
        path: 'hr_template/list',
        component: TemplateList,
    },
    {
        name: 'PayListEdit',
        path: 'payList/edit',
        component: PaymentEdit,
    },
    {
        name: 'DeductionTemplate',
        path: 'deductionTemplate',
        component: DeductionTemplate,
    },
    {
        name: 'DeductionTemplate',
        path: 'deductionTemplate',
        component: DeductionTemplate,
        props: true,
        children : [
            {
                name: 'DeductionTemplateDetail',
                path: ':id',
                component: DeductionTemplate,
            },
        ]
    },
    {
        name: 'DeductionTemplateList',
        path: 'deductionTemplate/list',
        component: DeductionTemplateList,
    },




]
