import { createRouter, createWebHashHistory } from "vue-router";
export const routes = [
    {
        path: "/Homepage",
        name: "Index",
        component: () => import("../views/NavigationBar"),
        redirect: "/Homepage", 
        children:[
            {
                path: "/Homepage",
                name: "Homepage",
                meta: { name: "主页" },
                component: () => import("../views/HomePage.vue"),
            },
            {
                path:"/Operation",
                name:"Operation",
                meta:{name:"新增患者"},
                component:() => import("../views/Operation.vue"),
            },
            {
                path:"/Setting",
                name:"Setting",
                meta:{name:"账户管理"},
                component:() => import("../views/Setting.vue"),
            },
        ]
    },
    {
        path:"/",
        name:"Login",
        meta:{name:"登录"},
        component:()=> import("../views/Login.vue")
    },
    
];
const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes,
});
export default router;
