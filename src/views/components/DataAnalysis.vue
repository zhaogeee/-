<!-- eslint-disable vue/valid-v-for -->
<template>
    <div class="bg">
        <a-collapse v-model:activeKey="activeKey" :bordered="false">
            <a-collapse-panel key="1" header="标志点坐标与平面方程结果" class="panel">
                <a-descriptions title="标志点数值">
                    <template v-for="point in Points">
                        <a-descriptions-item :label="point.name">({{point.x}},{{point.z}},{{point.z}})</a-descriptions-item>
                    </template>
                </a-descriptions>
                <a-descriptions title="平面方程">
                    <a-descriptions-item>{{plane}}</a-descriptions-item>
                </a-descriptions>
            </a-collapse-panel>
            <a-collapse-panel key="2" header="数据分析测量值" class="panel">
                <a-descriptions title="正貌分析">
                    <a-descriptions-item label="面上部高度">{{OrthData.height1}} mm</a-descriptions-item>
                    <a-descriptions-item label="面中部高度">{{OrthData.height2}} mm</a-descriptions-item>
                    <a-descriptions-item label="面下部高度">{{OrthData.height3}} mm</a-descriptions-item>
                    <a-descriptions-item label="左睑裂宽度">{{OrthData.width1}} mm</a-descriptions-item>
                    <a-descriptions-item label="两眼睑内侧联合间距">{{OrthData.width2}} mm</a-descriptions-item>
                    <a-descriptions-item label="右睑裂宽度">{{OrthData.width3}} mm</a-descriptions-item>
                </a-descriptions>
                <a-descriptions title="侧貌分析">
                    <template #extra>
                        <a-switch v-model:checked="checked" checked-children="关闭" un-checked-children="查看" @click="showAngle"/>
                    </template>
                    <a-descriptions-item label="鼻额角" ><a-badge color="blue"/>{{ProData.angle1}} °</a-descriptions-item>
                    <a-descriptions-item label="鼻面角" :span="2"><a-badge color="orange"/>{{ProData.angle2}} °</a-descriptions-item>
                    <a-descriptions-item label="鼻唇角"><a-badge color="pink"/>{{ProData.angle3}} °</a-descriptions-item>
                    <a-descriptions-item label="鼻颏角" :span="2"><a-badge color="yellow"/>{{ProData.angle4}} °</a-descriptions-item>
                </a-descriptions>
                <a-descriptions title="不对称性分析——中线点到MSP距离">
                    <template v-for="(item,index) in centreLine">
                        <a-descriptions-item :label="item">{{centerData[index]}} mm</a-descriptions-item>
                    </template>
                </a-descriptions>
                <a-descriptions title="不对称性分析——双侧点到MSP距离差值">
                    <template v-for="(item,index) in bilateralLine">
                        <a-descriptions-item :label="item">{{bilateralData[index]}} mm</a-descriptions-item>
                    </template>
                </a-descriptions>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script>
import { ref,onMounted } from 'vue';
import {getLandmarks} from "../../api/patientApi"
import {orthomorphicAnalysis,profileAnalysis,centreLineAnalysis,bilateralPoint} from '../../api/analysisApi'
// import {getPoint} from "../../hooks/Visual"
export default {
    emits:['showAngle'],
    setup(props,{emit}) {
        const activeKey = ref(['2']);
        let OrthData = ref({})
        let ProData = ref({})
        let plane = ref()
        const centerData = ref([])
        const bilateralData = ref([])
        const checked = ref(false)
        const patientId = sessionStorage.getItem('patientId')
        // const text = `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`;
        let getOrth = async ()=>{
            const res = await orthomorphicAnalysis({patientId})
            if(res.code==200){
                OrthData.value={
                    height1:res.data.height[0],
                    height2:res.data.height[1],
                    height3:res.data.height[2],
                    width1:res.data.width[0],
                    width2:res.data.width[1],
                    width3:res.data.width[2]
                }
                console.log(OrthData.value)
            }
        }
        let getProfile = async ()=>{
            const res = await profileAnalysis({patientId})
            if(res.code==200){
                ProData.value = res.data
            }
        }
        // const planePoints = JSON.parse(sessionStorage.getItem("plane")).points
        let getcenter = async ()=>{
            const planePoints = JSON.parse(sessionStorage.getItem("plane")).points
            const res = await centreLineAnalysis({
                patientId:patientId,
                planePoints1:planePoints[0].toString(),
                planePoints2:planePoints[1].toString(),
                planePoints3:planePoints[2].toString()
            })
            if(res.code==200){
                console.log("中线",res.data)
                centerData.value = res.data
            }
        }
        let getbilateral = async ()=>{
            const planePoints = JSON.parse(sessionStorage.getItem("plane")).points
            const res = await bilateralPoint({
                patientId:patientId,
                planePoints1:planePoints[0].toString(),
                planePoints2:planePoints[1].toString(),
                planePoints3:planePoints[2].toString()
            })
            if(res.code==200){
                console.log("双侧",res.data)
                bilateralData.value = res.data
            }
        }
        // getOrth()
        // getProfile()
        // getcenter()
        // getbilateral()
        const pointName = ['发际点','眉间点','鼻根点','鼻尖点','鼻底点','上唇凸点','下唇凸点','颏上点','颏前点','颏下点','眉峰点（左）','眉峰点（右）',
    '内眦点（左）','内眦点（右）','外眦点（左）','外眦点（右）','瞳孔（左）','瞳孔（右）','颧点（左）','颧点（右）','鼻翼点（左）','鼻翼点（右）','鼻翼下点（左）','鼻翼下点（右）','耳屏点（左）','耳屏点（右）','下颌角点（左）','下颌角点（右）','唇峰点（左）','唇峰点（右）','口角点（左）','口角点（右）']
        const Points = ref([])
        const getPoint = async()=>{
            const patientId = sessionStorage.getItem("patientId")
                const res = await getLandmarks({patientId})
                if(res.code==200){
                    res.data.forEach((item,index)=>{
                        Points.value.push({
                            key:index+1,
                            name:pointName[index],
                            x:item[0],
                            y:item[1],
                            z:item[2]
                        })
                    })
                }
        }
        const centreLine = ['发际点Tri','眉间点Gb','鼻根点N','鼻尖点Prn','鼻底点Sn','上唇凸点Ls','下唇凸点Li','颏上点Sl','颏前点Pg','颏下点Gn']
        const bilateralLine = ['眉峰点Su','内眦点En','外眦点Ex','瞳孔Pu','颧点Zg','鼻翼点Ala','鼻翼下点Sal','耳屏点Tr','下颌角点Go','唇峰点Cph','口角点Ch']
        // const points = getPoint(patientId)
        const showAngle=()=>{
            emit('showAngle',checked.value)
        }
        onMounted(()=>{
            plane.value = JSON.parse(sessionStorage.getItem("plane")).func
            getPoint()
            getOrth()
            getProfile()
            getcenter()
            getbilateral()
        })
        
        return {
            activeKey,
            checked,
            plane,
            OrthData,
            ProData,
            Points,
            centreLine,
            bilateralLine,
            centerData,
            bilateralData,
            // points,
            showAngle
        };
    },
}
</script>

<style lang="scss" scoped>
.panel {
    background-color: #fff;
    font-size: 18px;
    padding-left: 22px;
}
::v-deep .ant-descriptions-title {
    font-size:20px;
}
::v-deep .ant-descriptions-item-label{
    font-size: 16px;
}
::v-deep .ant-descriptions-item-content{
    font-size: 16px;
}
.bg {
    // height:60vh;
    overflow: hidden;
}
</style>