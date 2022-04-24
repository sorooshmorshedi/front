import TenderList from "@/modules/contracting/tender/TenderList";
import ContractList from "@/modules/contracting/contract/ContractList";
import StatementList from "@/modules/contracting/statement/StatementList";
import TenderForm from "@/modules/contracting/tender/TenderForm";
import ContractForm from "@/modules/contracting/contract/ContractForm";
import StatementForm from "@/modules/contracting/statement/StatementForm";
import SupplementList from "@/modules/contracting/supplement/SupplementList";
import SupplementForm from "@/modules/contracting/supplement/SupplementForm";

const Tender = () => import( /* wepackChunkName: "contracting" */ "@/modules/contracting/tender/TenderForm.vue")
const Contract = () => import( /* wepackChunkName: "contracting" */ "@/modules/contracting/contract/ContractForm.vue")
const Statement = () => import( /* wepackChunkName: "contracting" */ "@/modules/contracting/statement/StatementForm.vue")
const Supplement = () => import( /* wepackChunkName: "contracting" */ "@/modules/contracting/supplement/SupplementForm.vue")

export default [
    {
        name: 'Tender',
        path: 'tender',
        component: Tender,
        props: true,
    },
    {
        name: 'Contract',
        path: 'contract',
        component: Contract,
        props: true,
    },
    {
        name: 'Statement',
        path: 'statement',
        component: Statement,
        props: true,
    },
    {
        name: 'Supplement',
        path: 'supplement',
        component: Supplement,
    },
    {
        name: 'TenderList',
        path: 'tender/list',
        component: TenderList,
    },
    {
        name: 'TenderDetail',
        path: 'tender/:id?',
        component: TenderForm,
        props: true,
    },
    {
        name: 'ContractList',
        path: 'contract/list',
        component: ContractList,
    },
    {
        name: 'ContractDetail',
        path: 'contract/:id?',
        component: ContractForm,
        props: true,
    },

    {
        name: 'StatementList',
        path: 'statement/list',
        component: StatementList,

    },
    {
        name: 'StatementDetail',
        path: 'statement/:id?',
        component: StatementForm,
        props: true,
    },

    {
        name: 'SupplementList',
        path: 'supplement/list',
        component: SupplementList,

    },
    {
        name: 'SupplementDetail',
        path: 'supplement/:id?',
        component: SupplementForm,
        props: true,
    },

]