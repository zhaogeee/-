<template>
<div class="bgd">
    <a-row>
        <a-button type="primary" @click="addPatient" class="btn"><PlusOutlined/>新建患者</a-button>
    </a-row>
    <a-table 
    :dataSource="dataSource" :columns="columns" size="middle" bordered class="pat-table" :pagination="{pageSize:6}">
        <template #operation="{ record }">
                <a-button type="link" v-if="record.key!=' '" @click="editPatient(record.key)">
                    <ExpandOutlined :style="fontSize"/>数据处理
                </a-button>
                                                                                                
        </template>
    </a-table>
</div>
</template>
<script>
import {getPatient} from "../api/patientApi";
import {PlusOutlined,ExpandOutlined} from "@ant-design/icons-vue";
import {ref,reactive, onMounted} from "vue";
import Construction from '../hooks/Construction' 
export default({
    components:{
        PlusOutlined,
        ExpandOutlined
    },
    setup() {
        const routeChange=Construction();
        const dataSource=ref([])
        //获取患者列表
        // let account="1"
        let account = sessionStorage.getItem("account")
        const listData = ref([])
        let getList = async ()=>{
            const res = await getPatient({account})
            if(res.code=="200"){
                res.data.forEach(item=>{
                    if(item.patientGender==0){
                        listData.value.push({
                            key:item.patientId,
                            name:item.patientName,
                            gender:'男',
                            age:item.patientAge,
                            date:item.date
                        })
                    }else{
                        listData.value.push({
                            key:item.patientId,
                            name:item.patientName,
                            gender:'女',
                            age:item.patientAge,
                            date:item.date
                        })
                    }
                })
                dataSource.value=listData.value
            }
        }
        onMounted(()=>{
            getList()
        })
        const editableData = reactive({});
        const editPatient = key => {
            // editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
            sessionStorage.setItem("patientId",key)
            let pInfo = dataSource.value.find((item)=>{return item.key==key})
            if(pInfo.gender=="男"){
                pInfo.gender=0
            }else{
                pInfo.gender=1
            }
            sessionStorage.setItem("pInfo",JSON.stringify(pInfo))
            routeChange(key,1)
            
        };
        const save = key => {
        Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
        delete editableData[key];
        };
        const cancel = key => {
        delete editableData[key];
        };
        const deletePatient = (Key)=>{
            console.log(Key);
            let data = dataSource.value.filter((item) => item.key!==Key);
            dataSource.value=data;
            console.log("删除成功");
        }
        const addPatient=()=>{
            sessionStorage.setItem("patientId",0)
            sessionStorage.setItem("pInfo",null)
            routeChange(0,1)
        }
        const dataOpt = key =>{
            console.log(key);
            routeChange(key,1)
        }
        const columns=[
            {
                title:'就诊日期',
                dataIndex:'date',
                width:'25%',
                align:'center',

            },
            {
                title:'姓名',
                dataIndex:'name',
                width: '25%',
                align:'center',
            },
            {
                title:'性别',
                dataIndex:'gender',
                width: '15%',
                align:'center',
            },
            {
                title:'年龄',
                dataIndex:'age',
                width: '15%',
                align:'center',
            },
            {
                title:'操作',
                key:'operation',
                align:'center',
                slots:{
                    customRender:'operation'
                }
            }
        ]
         return {
            dataSource,
            columns,
            editableData,
            editPatient,
            save,
            cancel,
            deletePatient,
            addPatient,
            dataOpt
        }
    },
   
})
</script>
<style lang="scss" scoped>
.bgd {
  padding: 20px;
  background: #fff;
  height:80vh
}
.btn{
    font-size:18px;
    height:35px;
    margin-bottom: 20px;
}
.pat-table {
    width:90%;
    font-size:18px;
    text-align:center;
}
.opt{
    margin-left:25%;
    width:50%;
    display: flex;
    justify-content: space-between;
}
::v-deep .ant-table-thead > tr > th {
    font-size: 16px;
}
::v-deep .ant-table-tbody > tr > td {
    font-size: 16px;
}
.ant-input {
    font-size: 16px;
}
</style>
