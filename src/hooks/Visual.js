//获取标志点
import {ref} from 'vue';
import {getLandmarks} from "../api/patientApi"
const pointName = ['发际点','眉间点','鼻根点','鼻尖点','鼻底点','上唇凸点','下唇凸点','颏上点','颏前点','颏下点','眉峰点（左）','眉峰点（右）',
    '内眦点（左）','内眦点（右）','外眦点（左）','外眦点（右）','瞳孔（左）','瞳孔（右）','颧点（左）','颧点（右）','鼻翼点（左）','鼻翼点（右）','鼻翼下点（左）','鼻翼下点（右）','耳屏点（左）','耳屏点（右）','下颌角点（左）','下颌角点（右）','唇峰点（左）','唇峰点（右）','口角点（左）','口角点（右）']
const getPoint = async(patientId)=>{
    let points = ref([])
    const res = await getLandmarks({patientId})
    if(res.code==200){
        res.data.forEach((item,index)=>{
            points.value.push({
                key:index+1,
                point:pointName[index],
                x:item[0],
                y:item[1],
                z:item[2]
            })
        })
    }
    console.log("获取标志点"+points.value)
    return points.value
}
export {getPoint}
