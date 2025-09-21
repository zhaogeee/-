import { getRequest } from "../util/request"
//正貌分析
const orthomorphicAnalysis = (params)=>{
    return getRequest("/analysis/orthomorphicAnalysis",params)
}
//侧貌分析
const profileAnalysis = (params)=>{
    return getRequest("/analysis/profileAnalysis",params)
}
//不对称性分析
//中线点
const centreLineAnalysis = (params)=>{
    return getRequest("/analysis/centreLineAnalysis",params)
}
//双侧点
const bilateralPoint = (params)=>{
    return getRequest("/analysis/bilateralPoint",params)
}
export {
    orthomorphicAnalysis,
    profileAnalysis,
    centreLineAnalysis,
    bilateralPoint
}