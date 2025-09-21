import axios from "axios";
import {postRequest,getRequest,putRequest } from "../util/request"
//获取患者信息
const getPatient = (params)=>{
    return getRequest("/operation/getPatient",params)
}
//新增患者
const addPatient = (params)=>{
    return postRequest("/operation/addPatient",params)
}
//上传面扫数据，需要用form-data，额外写
const uploadData = (formData)=>{
    const instance = axios.create()
    instance.defaults.headers.post['Content-Type'] = 'multipart/form-data';
    return instance.post("https://4068-218-249-94-210.ngrok-free.app/api/operation/upload",formData,{
        headers: {
            token:sessionStorage.getItem('AccountToken'),
            "ngrok-skip-browser-warning":69420
        },
    })
}
//获取面部数据
const getUrl = (params)=>{
    return axios({
        method: "get",
        url: "https://4068-218-249-94-210.ngrok-free.app/api/operation/getUrl", //后端下载接口地址
        responseType: "blob",  // 设置接受的流格式
        headers: {
            token:sessionStorage.getItem('AccountToken'),
            "ngrok-skip-browser-warning":69420
        },
        params: params
    })
    // return getRequest("/operation/getUrl",params)
}
//获取坐标点
const getLandmarks = (params)=>{
    return getRequest("/operation/getLandmarks",params)
}
//修改坐标点
const editLandmarks = (params)=>{
    return putRequest("/operation/editLandmarks",params)
}
//算法选择
const getMSP = (params)=>{
    return getRequest("/operation/getMSP",params)
}
export {
    getPatient,
    addPatient,
    uploadData,
    getLandmarks,
    editLandmarks,
    getMSP,
    getUrl
}
