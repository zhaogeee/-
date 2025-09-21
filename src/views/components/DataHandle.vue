<template>
    <a-row style="min-height:65vh">
        <a-col :span="2" class="step">
            <a-button type="link" :disabled="selectData===0" @click="prev"><LeftOutlined  :style="{fontSize:'40px', color:'#1890ff'}"/></a-button>
        </a-col>
        <a-col :span="20">        
        <div v-show="selectData===0">
            <div class="description">
                <div class="des-header">标志点坐标编辑</div>
                <div class="des-content">您可查看32个标志点的坐标数据，有需要可对其进行修改,修改后可点击<EyeOutlined />查看修改后的标志点位置，确认无误后点击确认即可更新。</div>
            </div>
            <a-form :labelCol="labelCol">
                <template v-for="(record,index) in dataSource" :key=index>
                    <div style="width:100%;display: flex;justify-content: flex-start;align-items: center;" v-if="index%2==0">
                        <div style="width: 49%;display: flex;justify-content: flex-start;" v-for="(record, index) in shuzu(dataSource,index)" :key="index">
                            <a-form-item :label="record.point">
                                <a-input-group size="small">
                                <a-row :gutter="6" style="font-size:16px">
                                    (<a-col :span="6">
                                    <a-input v-model:value="record.x"/>
                                    </a-col>,
                                    <a-col :span="6">
                                    <a-input v-model:value="record.y"/>
                                    </a-col>,
                                    <a-col :span="6">
                                    <a-input v-model:value="record.z"/>
                                    </a-col>)
                                    <a-col :span="2">
                                        <a-button type="link" @click="editPoint(record)" ><EyeOutlined  :style="{fontSize:'20px', color:'#1890ff'}"/></a-button>
                                    </a-col>
                                    
                                </a-row>
                                </a-input-group>
                            </a-form-item>
                        </div>

                    </div>
                    
                </template>
                
            </a-form>
            <a-button type="primary" shape="round" class="btn" ghost @click="checkPoint"><CheckOutlined />确认</a-button>

        </div>
        <div v-show="selectData===1">
            <div class="description">
                <div class="des-header">算法选择</div>
                <div class="des-content">请选择一种正中矢状面(MSP)构建的算法，具体算法如下：</div>
            </div>
            <a-row style="margin-left:60px;">
                <a-radio-group name="algorithm" v-model:value="alg">
                    <a-radio :style="radioStyle" :value="1">基于标志点构建MSP(后续可对标志点全选或勾选）</a-radio>
                    <a-radio :style="radioStyle" :value="2">AI点云配准构建MSP</a-radio>
                    <a-radio :style="radioStyle" :value="3">AI全局特征构建MSP</a-radio>
                </a-radio-group>    
            </a-row>
            <a-button type="primary" shape="round" class="btn" ghost @click="onSubmit(alg)"><CheckOutlined />确认</a-button>
        </div>
        <div v-show="selectData===2">
            <div class="description">
                <div class="des-header">标志点数据筛选</div>
                <div class="des-content">您可在32个标志点数据中筛选所需要的标志点来进行MSP平面的构建，勾选后点击确认，即可生成MSP平面。<br/>其中前10个为中线标志点，后22个为11对双侧标志点，只可按对勾选。请至少勾选一个中线标志点和一对双侧标志点。</div>
            </div>
            <a-checkbox-group v-model:value="value" style="display:flex;flex-direction:column;">
                <a-row align="middle">
                    <a-col :span="20">
                       <div class="title">中线点：</div> 
                    </a-col>
                    <a-col :span="4">
                       <a-switch v-model:checked="checked" checked-children="清空" un-checked-children="全选" @click="checkAll"/> 
                    </a-col>
                            
                </a-row>
                <a-row>
                    <a-checkbox value=1 class="content">发际点 Tri</a-checkbox> 
                    <a-checkbox value=2 class="content">眉间点 Gb</a-checkbox> 
                </a-row>
                <a-row>
                    <a-checkbox value=3 class="content">鼻根点 N</a-checkbox>  
                    <a-checkbox value=4 class="content">鼻尖点 Prn</a-checkbox>
                </a-row>
                <a-row>
                    <a-checkbox value=5 class="content">鼻底点 Sn</a-checkbox>
                    <a-checkbox value=6 class="content">上唇凸点 Ls</a-checkbox>
                </a-row>
                <a-row>
                    <a-checkbox value=7 class="content">下唇凸点 Li</a-checkbox>
                    <a-checkbox value=8 class="content">颏上点 Sl</a-checkbox>
                </a-row>
                <a-row>
                    <a-checkbox value=9 class="content">颏前点 Pg</a-checkbox>
                    <a-checkbox value=10 class="content">颏下点 Gn</a-checkbox>
                </a-row><br/>
                <a-row>
                    <div class="title">双侧点：</div>  
                </a-row>
                
                <a-row>
                    <a-checkbox value=11 class="content">眉峰点 Su</a-checkbox>
                    <a-checkbox value=13 class="content">内眦点 En</a-checkbox>
                    <a-checkbox value=15 class="content">外眦点 Ex</a-checkbox>
                </a-row>
                <a-row>
                    <a-checkbox value=17 class="content">瞳孔 Pu</a-checkbox>
                    <a-checkbox value=19 class="content">颧点 Zg</a-checkbox>
                    <a-checkbox value=21 class="content">鼻翼点 Ala</a-checkbox>
                </a-row>
                <a-row>
                    <a-checkbox value=23 class="content">鼻翼下点 Sal</a-checkbox>
                    <a-checkbox value=25 class="content">耳屏点 Tr</a-checkbox>
                    <a-checkbox value=27 class="content">下颌角点 Go</a-checkbox>
                </a-row>
                <a-row>
                    <a-checkbox value=29 class="content">唇峰点 Cph</a-checkbox>
                    <a-checkbox value=31 class="content">口角点 Ch</a-checkbox>
                </a-row>
            </a-checkbox-group>
            <a-row>
            <a-button type="primary" shape="round" class="btn" ghost @click="select"><CheckOutlined />确认</a-button> 
            </a-row>
            
        </div>
        </a-col>
        <a-col :span="2" class="step">
            <a-button type="link" :disabled="selectData===2" @click="next"><RightOutlined :style="{fontSize:'40px', color:'#1890ff'}"/></a-button>
        </a-col>  
    </a-row>
    
</template>

<script>
import {editLandmarks, getMSP,getLandmarks} from "../../api/patientApi"
// import {getPoint} from "../../hooks/Visual"
import {CheckOutlined,LeftOutlined,RightOutlined,EyeOutlined} from "@ant-design/icons-vue";
import { onMounted, reactive, ref } from 'vue';
// import { cloneDeep } from 'lodash-es';
import { message, notification } from 'ant-design-vue';
// import { message } from 'ant-design-vue';
export default {
    components:{
        CheckOutlined,
        LeftOutlined,
        RightOutlined,
        EyeOutlined
    },
    emits:["showPlane",'algorithm',"newPoint"],
    setup(props,{emit}) {
        const alg = ref(1);
        const selectData = ref(0);
        const value = ref([])
        const patientId = sessionStorage.getItem("patientId")
        const checked = ref(false)
        const checkAll = ()=>{
            if(checked.value==true){
                console.log("quanxuan")
                value.value=['1','2','3','4','5','6','7','8','9','10','11','13','15','17','19','21','23','25','27','29','31']
            }else {
                value.value=[]
            }
            
        }
        //勾选点
        const select = async()=>{
            // console.log(value.value)
            const selectPoint = ref([])
            value.value.forEach(item=>{
                let num =parseInt(item)
                selectPoint.value.push(num)
                if(num>10){
                    selectPoint.value.push(num+1)
                }
            })
            if(selectPoint.value.some(x=>x>10)&&selectPoint.value.some(x=>x<=10)){
                let newPoint = []//升序排列
                newPoint.push(selectPoint.value.sort((a,b)=>{return a-b}))
                console.log(newPoint[0])
                const res = await getMSP({
                    patientId:patientId,
                    index:1,
                    point:selectPoint.value.sort((a,b)=>{return a-b}).toString()
                })
                if(res.code==200){
                    sessionStorage.setItem("plane",JSON.stringify(res.data))
                    let msg = res.data.points
                    emit("showPlane",msg)
                    notification.success({
                        message:"构建成功",
                        description:'不对称平面方程已构建成功，您可点击next在数据分析页面对方程结果和其他数据分析结果进行查看。'
                    })
                }
                
            }else{
                notification.error({
                    message:"筛选失败",
                    description:"请确认至少勾选了一个中线标志点和一对双侧标志点。"
                })
            }

        }

        const radioStyle = reactive({
            display: 'block',
            height: '40px',
            lineHeight: '30px',
            fontSize:'20px',
        });
        const onSubmit = (alg)=>{
            if(parseInt(alg)==1){
                selectData.value+=1
            }
            
            let msg = {
                code:1,
                data:alg,
            }
            emit('algorithm',msg)

        }
        //获取标志点坐标
        
        const checkPoint = async()=>{
            let newPoint = []
            dataSource.value.forEach((item)=>{
                let point = [parseFloat(item.x),parseFloat(item.y),parseFloat(item.z)]
                newPoint.push(point)
            })
            //修改标志点坐标
            const res = await editLandmarks({
                patientId:parseInt(patientId),
                point:newPoint
            })
            if(res.code==200){
                message.success("标志点数据修改成功！")
                selectData.value+=1
            }else{
                message.error("修改失败"+res.code)
            }
            console.log(newPoint)
        }
        const dataSource = ref([])
        const shuzu = (items,i)=>{
            let array = []
            let oldarr = items;
            for(let n=i;n<oldarr.length;n++){
                if(array.length<2){
                    array.push(items[n])
                }
                else{
                    break
                }
            }
            return array
        }
        const editPoint = record => {
            console.log("正在渲染标志点"+record.x)
            const newp = [{
                x:parseFloat(record.x),
                y:parseFloat(record.y),
                z:parseFloat(record.z)
            }]
            emit("newPoint",newp)
            // editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
        };
        const columns = [
            {
                title:'标志点',
                dataIndex:'point',
                width:'20%',
                align:'center',
                // slots: {
                //     customRender: 'point',
                // },

            },
            {
                title:'X坐标',
                dataIndex:'x',
                width:'20%',
                align:'center',
                // slots: {
                //     customRender: 'x',
                // },
            },
            {
                title:'Y坐标',
                dataIndex:'y',
                width:'20%',
                align:'center',
                // slots: {
                //     customRender: 'y',
                // },
            },
            {
                title:'Z坐标',
                dataIndex:'z',
                width:'20%',
                align:'center',
                // slots: {
                //     customRender: 'z',
                // },
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
        const prev = ()=>{
            selectData.value--
        }
        const next = ()=>{
            selectData.value++
        }
        const pointName = ['发际点','眉间点','鼻根点','鼻尖点','鼻底点','上唇凸点','下唇凸点','颏上点','颏前点','颏下点','眉峰点（左）','眉峰点（右）',
    '内眦点（左）','内眦点（右）','外眦点（左）','外眦点（右）','瞳孔（左）','瞳孔（右）','颧点（左）','颧点（右）','鼻翼点（左）','鼻翼点（右）','鼻翼下点（左）','鼻翼下点（右）','耳屏点（左）','耳屏点（右）','下颌角点（左）','下颌角点（右）','唇峰点（左）','唇峰点（右）','口角点（左）','口角点（右）']
        const getPoint = async()=>{
            // let points = ref([])
            // if(parseInt(sessionStorage.getItem("current"))==1){
                const patientId = sessionStorage.getItem("patientId")
                const res = await getLandmarks({patientId})
                if(res.code==200){
                    res.data.forEach((item,index)=>{
                        dataSource.value.push({
                            key:index+1,
                            point:pointName[index],
                            x:item[0],
                            y:item[1],
                            z:item[2]
                        })
                    })
                }
                console.log("获取标志点"+dataSource.value)
            // }
            // dataSource.value=points.value
        }
        onMounted(()=>{
            // dataSource.value=getPoint(patientId)
            getPoint()
            // console.log(dataSource.value)
        })

    return {
        dataSource,
        columns,
        checkPoint,
        editPoint,
        prev,
        next,
        shuzu,
        value,
        radioStyle,
        onSubmit,
        select,
        selectData,
        alg,
        checked,
        checkAll,
        labelCol: {
            style: {
                width: '150px',
                fontWeight:'bold',
            },
        },
    };
  },

}
</script>

<style lang="scss" scoped>
.description {
    margin-bottom: 20px;
    margin-left: 20px;
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
.title{
    font-size: 20px;
    margin-left: 20px;
    margin-top: 0px;
    margin-bottom: 10px;
    font-weight: normal;

}
.btn{
    font-size:20px;
    height:40px;
    margin-top: 20px;
    margin-left: 20px;
}
.content{
    font-size: 18px;
    width:150px;
    height: 40px;
    margin-left: 30px;
}
.pat-table {
    width:90%;
    font-size:18px;
    text-align:center;
}
::v-deep .ant-form-item-label > label {
    font-size: 15px;
}
.ant-input {
    font-size: 14px;
}
.step {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>