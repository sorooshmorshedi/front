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
        children : [
            {
                name: 'TenderDetail',
                path: ':id',
                component: TenderForm,
            },
        ]
    },
    {
        name: 'Contract',
        path: 'contract',
        component: Contract,
        props: true,
        children : [
            {
                name: 'ContractDetail',
                path: ':id',
                component: ContractForm,
            },
        ]
    },
    {
        name: 'Statement',
        path: 'statement',
        component: Statement,
        props: true,
        children : [
            {
                name: 'StatementDetail',
                path: ':id',
                component: StatementForm,
            },
        ]
    },
    {
        name: 'Supplement',
        path: 'supplement',
        component: Supplement,
        props: true,
        children : [
            {
                name: 'SupplementDetail',
                path: ':id',
                component: SupplementForm,
            },
        ]
    },
    {
        name: 'TenderList',
        path: 'tender/list',
        component: TenderList,
    },
    {
        name: 'ContractList',
        path: 'contract/list',
        component: ContractList,
    },

    {
        name: 'StatementList',
        path: 'statement/list',
        component: StatementList,

    },
    {
        name: 'SupplementList',
        path: 'supplement/list',
        component: SupplementList,

    },
]