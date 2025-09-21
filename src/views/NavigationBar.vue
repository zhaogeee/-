<template>
    <a-layout>
        <a-layout-header>
            <div class="logo-content">
                <div class="logo">
                    <img src="../assets/a2.png" alt="" />
                </div>
                <div class="title">三维颜面不对称性分析系统</div>
            </div>
            <div>
                <a-menu 
                theme="dark"
                mode="horizontal"
                v-model:selectedKeys="selectedKeys"
                @click="menuClick"
                :style="{ margin:'0 10px 0 10px',lineHeight: '70px;',fontSize:'16px' }"
                >
                    <a-menu-item key="/Homepage">
                        <HomeOutlined :style="IconStyle"/>
                        <span class="nav-text">患者管理界面</span>
                    </a-menu-item>
                    <a-menu-item key="/Operation">
                        <ExpandOutlined :style="IconStyle"/>
                        <span class="nav-text">新增患者</span>
                    </a-menu-item>
                    <a-menu-item key="/Setting">
                        <UserOutlined :style="IconStyle"/>
                        <span class="nav-text">账户管理</span>
                    </a-menu-item>

                </a-menu>    
            </div>
            <div class="menu">
                <a-button shape="circle" type="link" @click="logout" :style="{fontSize:'18px'}">
                    <LogoutOutlined :style="IconStyle" />退出登录
                </a-button>
            </div>
            
        </a-layout-header>
        <a-layout-content
            :style="{
                margin: '24px 16px 0',
                height: 'calc(100vh - 160px)',
                overflowY: 'scroll',
            }"
        >
            <div :style="{ overflow: 'hidden', }" >
                <router-view v-slot="{ Component }">
                    <transition name="scale" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </div>
        </a-layout-content>
        <a-layout-footer
                style="text-align: center; justify-content: center;background: #fff; border-top: 1px solid #eee;height:50px"
        >
            copyright
        </a-layout-footer>
      
    </a-layout>
</template>

<script>
    import {HomeOutlined,ExpandOutlined,LogoutOutlined,UserOutlined} from "@ant-design/icons-vue";
    import { defineComponent, onMounted, ref } from "vue";
    import { useRouter, useRoute } from "vue-router"; 
    export default defineComponent ({
        components:{
            HomeOutlined,
            ExpandOutlined,
            LogoutOutlined,
            UserOutlined
        },
        setup() {
            onMounted(()=>{

            });
            const onCollapse = (collapsed, type) => {
                console.log(collapsed, type);
            };

            const onBreakpoint = () => {
                console.log();
            };
            const router = useRouter();
            const menuClick = ({ key }) => {
                // console.log(key);
                router.push(key);
            };
            const route = useRoute();
            const selectedKeys = ref([route.path]);
            const logout = ()=>{
                router.push("/")
            }
            const IconStyle = {fontSize:'18px',fontWeight:'bold'}
            return{
                onCollapse,
                onBreakpoint,
                menuClick,
                selectedKeys,
                logout,
                IconStyle
            }
            
        },
    })
</script>
<style lang="scss" scoped>
    .ant-layout-header {
        height: 80px;
        display: flex;
        justify-content:flex-start;
        padding: 0 1% 0 1%;
        align-items: center;
    }
    .logo-content {
        height: 100%;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: flex-start;
        .title {
            margin: 8px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            color:#fff;
        }
        > .logo {
            width: 65px;
            height: 65px;
            margin: 5px;

            > img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
    }
    .route-tab {
        width: 100%;
        height: 50px;
    }
    .scale-enter-active,
    .scale-leave-active {
        transition: all 0.5s ease;
    }

    .scale-enter-from,
    .scale-leave-to {
        opacity: 0;
        transform: scale(0.9);
    }
    .company{
        margin-left:10px;
        height: 95%;
        font-size: 20px;
        font-weight: bold;
        color: #8095a8;
    }
    .menu {
        width:50%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }
</style>