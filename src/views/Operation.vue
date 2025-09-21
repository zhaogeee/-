<template>
<div class="bgd">
    <a-row>
        <a-col span="2">
            <a-steps :current="current" direction="vertical" style="height:100%;margin:20px 10px">
                <a-step title="数据导入" style="height:33%;font-size:16px;"/>
                <a-step title="数据处理" style="height:33%"/>
                <a-step title="数据分析" style="height:33%"/>
            </a-steps>
        </a-col>
        <a-col span="16">
            <div class="steps-content">
                <a-form>
                    <div v-if="current===0">
                        <a-row>
                            <a-col span="10">
                                <AddPatient/>
                            </a-col>
                            <a-col span="14">
                                <DataUpload @upload="receiveFile"/>
                            </a-col>
                        </a-row>                            
                    </div>
                    <div v-if="current===1">
                        <DataHandle @algorithm="receiveAlgorithm" @newPoint ="newPoint" @showPlane="showPlane"/>      
                    </div>
                    <div v-if="current===2">
                        <DataAnalysis @showAngle ="createAngle"/>           
                    </div>
                </a-form>
            </div>
        </a-col>
        <a-col span="6">
            <a-row>
               <div id="canvas"></div> 
            </a-row>
            <a-row>
               <a-button @click="createLandmarks(landmarks,'green')" style="">渲染标志点</a-button>
               <!-- <a-button @click="showPlane(1)">渲染平面</a-button> -->
               <!-- <a-button @click="createAngle">渲染角度</a-button> -->
            </a-row>
        </a-col>
        
    </a-row>
    <div class="steps-action">
        <a-button v-if="current > 0" style="margin-right: 5%" @click="prev" class="btn">Previous</a-button>
        <a-button v-if="current < steps.length - 1" type="primary" @click="next" class="btn">Next</a-button>
        <a-button
        v-if="current == steps.length - 1"
        type="primary" class="btn"
        @click="Back"
        >
        Done
        </a-button>  
    </div>
    
</div>   
</template>
<script>
// import {UploadOutlined} from "@ant-design/icons-vue";
import { message, notification } from 'ant-design-vue';
import {getMSP,getLandmarks} from '../api/patientApi';
import { useRouter } from "vue-router";
import {ref,onMounted, reactive} from 'vue';
import * as Three from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import AddPatient from "./components/AddPatient.vue";
import DataUpload from "./components/DataUpload.vue";
import DataHandle from "./components/DataHandle.vue";
import DataAnalysis from "./components/DataAnalysis.vue";
import axios from 'axios';

export default({
    components:{
        // UploadOutlined,
        DataUpload,
        AddPatient,
        DataHandle,
        DataAnalysis
    },
    setup() { 
        // const patientId = ref(sessionStorage.getItem("patiendId"))
        onMounted(async()=>{
            // init(111)
            // animate()
            current.value=0
            sessionStorage.setItem("current",current.value)
            const patientId = sessionStorage.getItem("patientId")
            console.log("ppp",patientId)
            if(parseInt(patientId)!==0){
                updateLandmarks()
                init(patientId)
                animate()
            }
            
        })
        //步骤条控制
        const current = ref(0);
        const next = () =>{
            current.value=sessionStorage.getItem("current")
            current.value++;
            sessionStorage.setItem("current",current.value)
            if(current.value===1){
                updateLandmarks()
            }
        };
        const prev = () =>{
            current.value=sessionStorage.getItem("current")
            current.value--;
            sessionStorage.setItem("current",current.value)
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
                // icon: h(UploadOutlined, { style: "color: #108ee9" }),
            });
        };
        const onSubmit = async () =>{
            openNotification();
        }
        const receiveAlgorithm = async(receivemsg)=>{
            // let msg = "code:"+receivemsg.code+"data:"+receivemsg.data;
            // scene.remove(planemesh
            // alert(msg);
            //算法选择了后两种，则直接获取平面方程，跳转到分析页面
            if(parseInt(receivemsg.data)>1){
                const res = await getMSP({
                    patientId:parseInt(sessionStorage.getItem("patientId")),
                    index:parseInt(receivemsg.data),
                    point:[[]]
                })
                if(res.code==200){
                    sessionStorage.setItem("plane",res.data.plane)
                    const point1 = res.data.point1
                    const point2 = res.data.point1
                    const point3 = res.data.point1
                    createPlane(point1,point2,point3)
                    current.value++
                    sessionStorage.setItem("current",current.value)
                    notification.open({
                        message: "提示",
                        description: "平面构建成功！您可在右侧可视化查看MSP平面结果！",
                    });
                }
                
            }else {
                notification.open({
                    message: "提示",
                    description: "您已选择基于标志点构建算法，可在该页面进行标志点勾选。",
                });
            }
        }
        // const plane = ref()
        const showPlane = (msg)=>{
            console.log(msg)
            const msp = JSON.parse(sessionStorage.getItem("plane"))
            // plane.value=msp
            let point1 = msp.points[0]
            let point2 = msp.points[1]
            let point3 = msp.points[2]
            console.log(point1[0])
            createPlane(point1[0],point1[1],point1[2],point2[0],point2[1],point2[2],point3[0],point3[1],point3[2])
        }
        const receiveFile =async(msg)=>{
            const patientId = msg.patientId
            console.log("请求文件"+msg)
            init(patientId)
            animate()
            // const res = await getUrl({patientId})
            // if(res.code==200){
            //     console.log(res.data)
            //     //使用url下载文件
            //     let fileUrl = res.data[0]
            //     // let fileName = "patient"+patientId+".obj"
            //     let mtlurl = res.data[1]
            //     // let mtlName = "patient"+patientId+".mtl"
            //     // downloadFile(fileUrl,fileName)
            //     init(fileUrl,mtlurl)
            //     animate()
            // }
        }
        // const downloadFile = ()=>{
        //     // fetch(fileUrl)
        //     //     .then(response=>response.blob())
        //     //     .then(blob =>{
        //     //         const url = window.URL.createObjectURL(blob)
        //     //         // const link = document.createElement('a')
        //     //         // link.href = url
        //     //         // link.setAttribute('download',fname)
        //     //         // document.body.appendChild(link)
        //     //         // link.click()
        //     //         console.log("下载文件"+fname,url)
        //     //         return url
        //     //     })
        //     //     .catch(error=>{
        //     //         console.log(error)
        //     //     })
        //     let blob = new Blob([data], { type: "application/octet-stream" });

        // }
        const newPoint = (e)=>{
            console.log(e)
            createLandmarks(e,'red')
        }

        //three.js可视化
        const width = 400;
        const height = 400;
        const k = width/height;
        const s = 150;
        const scene = new Three.Scene();
        scene.background = new Three.Color("#F5F5F5");
        //创建相机
        const camera = new Three.OrthographicCamera(-s*k,s*k,s,-s,1,1000);
        const color = 0xFFFFFF;
        const intensity = 4;
        const light = new Three.AmbientLight(color, intensity);
        const directionlight = new Three.DirectionalLight(color,intensity);
        const renderer = new Three.WebGLRenderer({
                //抗锯齿
                antialias: true,
        });
        const loader = new OBJLoader();
        const mtlloader = new MTLLoader();
        const objModel = ref(null);
        let planemesh;
        //标志点
        let landmarks=reactive([])
        //初始化模型
        const init=(patient)=>{
            directionlight.position.set(0,0,50);
            scene.add(light);
            scene.add(directionlight);
            camera.position.z = 100;
            camera.position.y=0;
            scene.add(camera)
            // console.log(objurl)
            axios({
                    method: "get",
                    url: "https://4068-218-249-94-210.ngrok-free.app/api/operation/getUrl", //后端下载接口地址
                    responseType: "blob",  // 设置接受的流格式
                    headers: {
                        token:sessionStorage.getItem('AccountToken'),
                        "ngrok-skip-browser-warning":69420
                    },
                    params: { // get方式，请写params, post方式写data，这里是get方式的传参
                        patientId:patient,
                        fileType: "mtl",
                    },
                }).then((res) => {
                    console.log(res)
                    // const mtlurl = window.URL.createObjectURL(new Blob([res.data]));
                    // let link = document.createElement('a');
                    // link.href = mtlurl;
                    // link.setAttribute('download', '1.mtl');
                    // document.body.appendChild(link);
                    // link.click();
                    const mtlBlob = new Blob([res.data]);
                    const reader = new FileReader();
                    reader.onload = function(event){
                        let mtlContent = event.target.result;
                        // const pngUrl = "11111.png"
                        axios({
                            method: "get",
                            url: "https://4068-218-249-94-210.ngrok-free.app/api/operation/getUrl", //后端下载接口地址
                            responseType: "blob",  // 设置接受的流格式
                            headers: {
                                token:sessionStorage.getItem('AccountToken'),
                                "ngrok-skip-browser-warning":69420
                            },
                            params: { // get方式，请写params, post方式写data，这里是get方式的传参
                                patientId:patient,
                                fileType: "png",
                            },
                        }).then((res) => {
                            // res 中还有一层data ,如果直接用blob流，文件里面是object，我就是犯错了。
                            console.log(res)
                            const pngUrl = window.URL.createObjectURL(new Blob([res.data]));
                            message.success("png获取成功！")
                            // const strippedPngUrl = pngUrl.replace(/^blob:http:\/\/10.29.198.84:8080\//, '');
                            // message.success("png获取成功！")
                            const strippedPngUrl = pngUrl.replace(/^blob:http:\/\/62.234.15.205:8080\//, '');
                            // console.log(strippedPngUrl)
                            mtlContent = mtlContent.replace(/map_Kd\s+\S+\.png/g, `map_Kd ${strippedPngUrl}`);
                            const newMtlBlob = new Blob([mtlContent], { type: 'text/plain' });
                            const newMtlUrl = window.URL.createObjectURL(newMtlBlob);
                            axios({
                                method: "get",
                                url: "https://4068-218-249-94-210.ngrok-free.app/api/operation/getUrl", //后端下载接口地址
                                responseType: "blob",  // 设置接受的流格式
                                headers: {
                                    token:sessionStorage.getItem('AccountToken'),
                                    "ngrok-skip-browser-warning":69420
                                },
                                params: { // get方式，请写params, post方式写data，这里是get方式的传参
                                    patientId:patient,
                                    fileType: "obj",
                                },
                            }).then((res)=>{
                                const objurl = window.URL.createObjectURL(new Blob([res.data]));
                                message.success("obj获取成功！")
                                mtlloader.load(newMtlUrl,(mtl)=>{
                                mtl.preload()
                                loader.setMaterials(mtl);
                                loader.load(objurl,(root)=>{
                                    objModel.value=root
                                    scene.add(root)
                                })
                            })
                            })                                                        
                        });
                    }
                    reader.readAsText(mtlBlob);
                    message.success("mtl获取成功！")
                });
            
            // createLandmarks();
            //控件对象
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.target.set(0,0,0)
            //渲染器添加到dom
            renderer.setSize(width,height)
            document.querySelector("#canvas").appendChild(renderer.domElement)
        }

        //渲染标志点
        const updateLandmarks = async()=>{
            const patientId = sessionStorage.getItem("patientId")
            const res = await getLandmarks({patientId})
            if(res.code==200){
                res.data.forEach((item)=>{
                        landmarks.push({
                            x:item[0],
                            y:item[1],
                            z:item[2]
                        })
                })
            }
        }
        const createLandmarks=(landmarks,pcolor)=>{
            let material = new Three.MeshBasicMaterial({color:pcolor})
            //遍历创建标志点
            landmarks.forEach(item=>{
                let x = item.x;
                let y = item.y;
                let z = item.z;
                const geometry = new Three.SphereGeometry(1.5,32,16);
                geometry.translate(x,y,z);
                const circle = new Three.Mesh(geometry,material);
                scene.add(circle)
            })
            //重新渲染
            animate();
            console.log("标志点")
        }
        
        //渲染角度 1.鼻额角（眉间点2-鼻根点3-鼻尖点4）2.鼻面角（鼻尖点4至鼻根点3，眉间点2至颏前点9）3.鼻唇角（鼻尖点4-鼻底点5-上唇凸点6）4.鼻颏角（鼻尖点4至鼻根点3，鼻尖点4至颏前点9）
        const createLine = (p1,p2,c)=>{
            const linematerial=new Three.LineBasicMaterial({color:c,linewidth: 30,})
            const geometry = new Three.BufferGeometry();
            const line1 = new Three.LineCurve3( p1,p2 )
            // const line2 = new Three.LineCurve3( v3 , v4 )
            let points = line1.getPoints(100);
            geometry.setFromPoints(points)
            const line = new Three.Line(geometry,linematerial);
            line.name = 'angle'//scene.getObjectByName('hello',true)查找元素
            scene.add(line)
            // return line
        }
        //画角
        const createAngle = (e)=>{
            scene.remove(planemesh)
            const color = ["#108ee9","orange","deeppink","yellow"]
            const v2 = new Three.Vector3( landmarks[1].x,landmarks[1].y,landmarks[1].z+1 )
            const v3 = new Three.Vector3( landmarks[2].x,landmarks[2].y,landmarks[2].z+1 )
            const v31 = new Three.Vector3( landmarks[2].x,landmarks[2].y,landmarks[2].z )
            const v4 = new Three.Vector3( landmarks[3].x,landmarks[3].y,landmarks[3].z+1 )
            const v41 = new Three.Vector3( landmarks[3].x,landmarks[3].y,landmarks[3].z )
            const v5 = new Three.Vector3( landmarks[4].x,landmarks[4].y,landmarks[4].z+1 )
            const v6 = new Three.Vector3( landmarks[5].x,landmarks[5].y,landmarks[5].z+1 )
            const v9 = new Three.Vector3( landmarks[8].x,landmarks[8].y,landmarks[8].z+1 )
            if(e){
                //1.鼻额角
                createLine(v2,v3,color[0])
                createLine(v3,v4,color[0])
                //2.鼻面角
                createLine(v4,v31,color[1])
                createLine(v2,v9,color[1])
                //3.鼻唇角
                createLine(v4,v5,color[2])
                createLine(v5,v6,color[2])
                //4.鼻颏角
                createLine(v41,v31,color[3])
                createLine(v4,v9,color[3])
            }else{
                do{
                    scene.remove(scene.getObjectByName('angle',true))
                }while(scene.getObjectByName('angle',true))
            }
            animate()
            console.log("鼻额角")
        }
        //渲染平面
        const createPlane=(point11,point12,point13,point21,point22,point23,point31,point32,point33)=>{
            //三点确认平面
            const point_1 = new Three.Vector3(point11,point12, point13)
            const point_2 = new Three.Vector3(point21, point22, point23)
            const point_3 = new Three.Vector3(point31, point32, point33)
            const plane = new Three.Plane().setFromCoplanarPoints(point_1,point_2,point_3) 
            //创建平面网格
            const planegeometry = new Three.PlaneGeometry(150,250);
            const planematerial = new Three.MeshBasicMaterial( {color: 'lightskyblue', side: Three.DoubleSide} );
            planemesh = new Three.Mesh(planegeometry,planematerial)
            //根据平面设置法线和位置
            planemesh.geometry.lookAt(plane.normal);
            planemesh.position.copy(plane.normal.multiplyScalar(plane.constant))
            scene.add(planemesh);
            animate()
            console.log("MSP渲染")
        }
        const animate = () => {
            // 在每帧更新渲染
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        const router = useRouter();
        const Back = ()=>{
            router.back()
        }
        return {
            headers: {
                authorization: 'authorization-text',
            },
            Back,
            current,
            createPlane,
            createAngle,
            receiveAlgorithm,
            receiveFile,
            // getFile,
            showPlane,
            createLandmarks,
            newPoint,
            landmarks,
            getLandmarks,
            steps,
            next,
            prev,
            pointNum,
            onSubmit,
            objModel
        }
    },
})
</script>

<style lang="scss" scoped>
.bgd {
  padding: 20px 20px;
  background: #fff;
//   height:80vh;
  overflow: hidden;
}
.steps-header {
    width: 100%;
    height: 80vh;
}
.steps-content {
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fff;
  min-height: 65vh;
  padding: 3%;
//   padding-left: 20px;
  overflow: hidden;
}
.steps-action {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
.ant-form-item {
    margin-top: 10px;
    ::v-deep .ant-form-item-label > label {
        font-size: 18px;
    }
    .ant-input {
        font-size: 16px;
    }
}
.btn{
    font-size:20px;
    height:40px;
}
#canvas{
    width:400px;
    height:400px;
    margin-left: 10px;
    margin-bottom: 20px;
}
</style>