import TenderList from "@/modules/contracting/Tender/TenderList";
import ContractList from "@/modules/contracting/Contract/ContractList";
import StatementList from "@/modules/contracting/Statement/StatementList";

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
        name: 'ContractList',
        path: 'contract/list',
        component: ContractList,
    },
    {
        name: 'StatementList',
        path: 'statement/list',
        component: StatementList,
    },


]