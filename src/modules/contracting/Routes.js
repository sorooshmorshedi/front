import TenderList from "@/modules/contracting/Tender/TenderList";
import ContractList from "@/modules/contracting/Contract/ContractList";
import StatementList from "@/modules/contracting/Statement/StatementList";
import TenderForm from "@/modules/contracting/Tender/TenderForm";
import ContractForm from "@/modules/contracting/Contract/ContractForm";
import StatementForm from "@/modules/contracting/Statement/StatementForm";
import SupplementList from "@/modules/contracting/Supplement/SupplementList";
import SupplementForm from "@/modules/contracting/Supplement/SupplementForm";

const Tender = () => import( /* wepackChunkName: "contracting" */ "@/modules/contracting/Tender/TenderForm.vue")
const Contract = () => import( /* wepackChunkName: "contracting" */ "@/modules/contracting/Contract/ContractForm.vue")
const Statement = () => import( /* wepackChunkName: "contracting" */ "@/modules/contracting/Statement/StatementForm.vue")
const Supplement = () => import( /* wepackChunkName: "contracting" */ "@/modules/contracting/Supplement/SupplementForm.vue")

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
        props: (route) => {
            return {
                accountId: route.query.accountId,
                ...route.params,
            };
        },
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
        props: (route) => {
            return {
                accountId: route.query.accountId,
                ...route.params,
            };
        },
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
        props: (route) => {
            return {
                accountId: route.query.accountId,
                ...route.params,
            };
        },
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
        props: (route) => {
            return {
                accountId: route.query.accountId,
                ...route.params,
            };
        },
    },

]