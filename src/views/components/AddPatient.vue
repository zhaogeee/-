<template>
    <div>
        <div class="basic">基本信息</div>
        <a-form :labelCol="{span:4,offset:1}" :wrapperCol="{span:12}">
            <a-form-item label="姓名" name="name">
                <a-input v-model:value="patientInformation.name" :disabled="addflag===0"/>
            </a-form-item>
            <a-form-item label="性别" name="gender">
                <a-radio-group v-model:value="patientInformation.gender">
                    <a-radio :value=0 :disabled="addflag===0">男</a-radio>
                    <a-radio :value=1 :disabled="addflag===0">女</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="年龄" name="age">
                <a-input v-model:value="patientInformation.age" :disabled="addflag===0"/>
            </a-form-item>
            <a-form-item label="就诊日期" name="date">
                <a-date-picker
                    v-model:value="patientInformation.date"
                    type="date"
                    placeholder="选择就诊日期"
                    style="width: 100%"
                    :disabled="addflag===0"
                />
            </a-form-item> 
        </a-form>
        <a-row>
           <a-button type="primary" shape="round" class="btn" ghost @click="newPatient" :disabled="addflag===0"><CheckOutlined />创建</a-button> 
        </a-row>
    </div>
</template>
<script>
import {onMounted, ref} from 'vue';
// import QueryString from "qs";
import { message } from 'ant-design-vue';
import {CheckOutlined} from "@ant-design/icons-vue";
// import axios from 'axios';
import {addPatient} from '../../api/patientApi'
export default ({
    name:'AddPatient',
    components:{
        CheckOutlined
    },
    setup() {
        const patientInformation = ref({
            name:'',
            age:'',
            gender:0,
            date:''
        })
        const addflag = ref(1)
        const patientId = ref(0)
        onMounted(()=>{
            // const pInfo = sessionStorage.getItem("pInfo")
            const patiendId = parseInt(sessionStorage.getItem("patientId"))
            if(patiendId!==0){
                const info = JSON.parse(sessionStorage.getItem("pInfo"))
                patientInformation.value = info
                // console.log(patientInformation.value.gender)
                // patientInformation.value.gender = parseInt(patientInformation.value.gender)
                addflag.value = 0
                console.log(addflag.value)
            }
        })
        const newPatient = async()=>{
            const data = {
                //注册界面写完后account从sessionStorage取
                account:sessionStorage.getItem('account'),
                patientName:patientInformation.value.name,
                patientGender:patientInformation.value.gender,
                patientAge:patientInformation.value.age,
                date:patientInformation.value.date
            }
            // console.log(qs.stringify)
            const res = await addPatient(data)
            if(res.code==200){
                patientId.value = res.data
                message.success("新增患者成功")
                sessionStorage.setItem("patientId",patientId.value)
            }else{
                message.error("新增失败")
            }
        }
        return {
            patientInformation,
            newPatient,addflag
        }
    },
})
</script>
<style lang="scss" scoped>
.basic {
    font-size: 20px;
    font-weight:bold;
    margin-left:10px;
    height:20%;
}
.ant-form-item {
    margin-top: 10%;
    height: 40px;
    ::v-deep .ant-form-item-label > label {
        font-size: 14px;
    }
    .ant-input {
        font-size: 16px;
    }
}
</style>