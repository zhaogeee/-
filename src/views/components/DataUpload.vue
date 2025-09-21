<template>
    <div class="description">
        <div class="des-header">面扫数据上传</div>
        <div class="des-content">上传面部扫描仪扫描得到的人脸三维面部数据，需上传.obj文件、.png文件与.mtl文件共三个文件。上传成功后系统将自动进行标志点确定，可在页面右侧查看可视化结果。</div> 
    </div>                        
    <a-row>
        <a-col span="14">
            <a-upload-dragger
                v-model:fileList="fileList"
                name="file"
                :multiple="true"
                :beforeUpload="beforeUpload"
                :customRequest="handleUpload"
            >
                <p class="ant-upload-drag-icon">
                <InboxOutlined/>
                </p>
                <p class="ant-upload-text">点击或拖拽文件上传</p>
                <p class="ant-upload-hint">
                请勿上传其他格式的数据文件，避免可视化渲染失败。
                </p>
            </a-upload-dragger>    
        </a-col>    
    </a-row>
</template>

<script>
import {uploadData} from "../../api/patientApi"
import {InboxOutlined} from "@ant-design/icons-vue";
import {ref} from 'vue';
import { message } from 'ant-design-vue';
// import QueryString from 'qs';
export default {
    name:'DataUpload',
    components:{
        InboxOutlined
    },
    emits:["upload"],
    setup(props,{emit}){
        const fileList = ref([])
        const formData = new FormData()
        const fileParams = ['faceObj','facePng','faceMtl']
        const fileNum = ref(0)
        const flagObj = ref(false)
        const flagPng = ref(false)
        const flagMtl = ref(false)
        const initFile = ref("")
        // const patientId = 1
        const beforeUpload = file =>{
            switch(judgeFile(file.name)){
                case 1:
                    formData.append(fileParams[0],file)
                    fileNum.value++
                    file.status = 'done'
                    flagObj.value=true
                    console.log(file)
                    break
                case 2:
                    formData.append(fileParams[2],file)
                    fileNum.value++
                    file.status = 'done'
                    flagPng.value=true
                    break
                case 3:
                    formData.append(fileParams[1],file)
                    fileNum.value++
                    flagMtl.value = true
                    break
                default:
                    file.status = 'error'
                    message.error("请检查您上传的文件类型")
            }
            console.log(fileNum.value)
            return fileNum.value==3&&flagObj.value&&flagPng.value&&flagMtl.value
        }
        const judgeFile = fileName =>{
            if(fileName.includes('.obj')){
                initFile.value = fileName.slice(0,3)
                return 1
            }
            if(fileName.includes('.mtl')){
                // initFile.value[1]=fileName
                return 2
            }
            if(fileName.includes('.png')){
                return 3
            }
            return 0
        }
        //文件上传
        const handleUpload = async (e)=>{
            console.log("回调",e)
            const patientId = sessionStorage.getItem("patientId")
            formData.append("patientId",patientId)
            console.log(formData)
            // let msg = {
            //         code:1,
            //         patientId:patientId,
            //         files:initFile.value
            // }
            //emit('upload',msg)
            const res = await uploadData(formData)
            if(res.data.code==200){
                fileList.value.forEach(element => {
                    element.status="done"
                });
                let msg = {
                    code:1,
                    patientId:patientId,
                    files:initFile.value
                }
                emit('upload',msg)
                message.success("上传成功！")
            }else{
                e.onError("上传失败")
            }
            
        }
        
        return {
            fileList,
            handleUpload,
            beforeUpload,

        }

    }

}
</script>

<style lang="scss" scoped>
.description {
    margin-bottom: 20px;
    .des-header{
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 16px;
    }
    .des-content{
        font-size: 18px;
        margin-right: 10px;
    }
    
}
</style>