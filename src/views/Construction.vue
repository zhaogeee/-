<template>
<div class="bgd">
    <a-row>
        <a-steps :current="current" type="navigation" :style="stepStyle">
            <a-step title="Step1" />
            <a-step title="Step2" />
            <a-step title="Step3" />
        </a-steps>
        <a-col span="24">
            <div class="steps-content">
        <!-- {{ steps[current].content }} -->
            <a-form>
                <div v-show="current===0">
                    <div class="description">
                        <div class="des-header">面部标志点确定</div>
                        <div class="des-content">上传面部扫描仪扫描得到的人脸三维面部数据，由算法实现对面部解剖标志点的自动确定后得到标志点数据文件。<br>如果您已有标志点数据文件（.csv格式），可以跳过此步骤。</div> 
                    </div>                        
                    <a-row>
                        <a-col span="3">
                            <a-upload
                                v-model:pic-list="picList"
                                name="picfile"
                                :multiple="false"
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                :headers="headers"
                                @change="handleChange"
                            >
                                <a-button type="primary" shape="round" class="btn"><UploadOutlined/>Click to Upload</a-button>
                            </a-upload>    
                        </a-col>
                        
                        <a-button type="primary" ghost shape="round" class="btn"><SaveOutlined />生成标志点数据文件</a-button>    
                    </a-row>    
                </div>
                <div v-show="current===1">
                    <div class="description">
                        <div class="des-header">标志点个数确认</div>
                        <div class="des-content">通过输入文件中面部中线上的标志点个数与两侧标志点的对数来为后续对称参考平面的构建确认参数。<br>如果有对生成的标志点文件进行修改，或是自行上传其他数据文件的话，请重新输入标志点个数。</div> 
                    </div>
                    <a-row>
                        <a-col :span="5" style="margin-left:0px">
                        <a-form-item label="中线标志点个数" :labelCol="{span:11}">
                                <a-input v-model:value="pointNum.midNum" type="input"/>                   
                        </a-form-item>
                        </a-col>
                        <a-col :span="5" :offset="1" >
                            <a-form-item label="两侧标志点对数" :labelCol="{span:11}">
                                <a-input v-model:value="pointNum.sides" type="input"/>
                            </a-form-item> 
                        </a-col>    
                    </a-row>
                    <a-button type="primary" shape="round" class="btn" ghost @click="onSubmit"><CheckOutlined />修改/确认</a-button>    
                </div>
                <div v-show="current===2">
                    <div class="description">
                        <div class="des-header">标志点数据上传</div>
                        <div class="des-content">
                            请上传需要生成对称参考平面的面部标志点数据文件，上传时请确认标志点个数与第二步中所输入的相同。<br>
                            上传成功后点击“Done”按钮即可生成对称参考平面。
                        </div> 
                    </div>
                    <a-row>                        
                        <a-upload>
                            <a-button type="primary" shape="round" class="btn"><UploadOutlined/>点击上传文件</a-button>
                        </a-upload>                        
                    </a-row>           
                </div>
            </a-form>
            </div>
        </a-col>
    </a-row>
    
    
    <div class="steps-action">
        <a-button v-if="current > 0" style="margin-right: 5%" @click="prev" class="btn">Previous</a-button>
        <a-button v-if="current < steps.length - 1" type="primary" @click="next" class="btn">Next</a-button>
        <a-button
        v-if="current == steps.length - 1"
        type="primary" class="btn"
        @click="$message.success('Processing complete!')"
        >
        Done
        </a-button>  
    </div>
    
</div>   
</template>
<script>
import {UploadOutlined,CheckOutlined,SaveOutlined} from "@ant-design/icons-vue";
import { message,notification } from 'ant-design-vue';
import {ref,h} from 'vue';

export default({
    components:{
        UploadOutlined,
        CheckOutlined,
        SaveOutlined
    },
    setup() {
        const handleChange = info => {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        };
        const picList = ref([]);
        //步骤条控制
        const current = ref(0);
        const next = () =>{
            current.value++;
        };
        const prev = () =>{
            current.value--;
        };
        const steps =[
            {
                title:'确定面部标志点'
            },
            {
                title:'确定标志点个数'
            },
            {
                title:'生成对称参考平面'
            }
        ];
        //step2 标志点个数修改
        const pointNum = ref({
            midNum:10,
            sides:11
        });
        const openNotification = () => {
            notification.open({
                message: "提示",
                description: "标志点个数已确认！",
                icon: h(CheckOutlined, { style: "color: #108ee9" }),
            });
        };
        const onSubmit = async () =>{
            openNotification();
        }

        return {
            handleChange,
            headers: {
                authorization: 'authorization-text',
            },
            stepStyle:{
                maiginBottom:'60px',
                boxShadow:'0px -1px 0 0 #e8e8e8 inset'
            },
            picList,
            current,
            steps,
            next,
            prev,
            pointNum,
            onSubmit
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
.steps-header {
    width: 100%;
    height: 400px;
}
.steps-content {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fff;
  min-height: 400px;
  padding-top: 20px;
  padding-left: 20px;
}
.steps-action {
  margin-top: 24px;
  display: flex;
  justify-content: center;

}
.description {
    margin-bottom: 20px;
    .des-header{
        font-size: 25px;
        font-weight: bold;
        margin-bottom: 16px;
    }
    .des-content {
        font-size: 20px;
    }
}
.ant-form-item {
    margin-top: 10px;
    ::v-deep .ant-form-item-label > label {
        font-size: 20px;
    }
    .ant-input {
        font-size: 16px;
    }
}
.btn{
    font-size:20px;
    height:40px;
}
</style>