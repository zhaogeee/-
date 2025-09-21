import {postRequest,putRequest } from "../util/request"
const login = (params)=>{
    console.log(params)
    return postRequest("/account/login",params)
}
const register = (params)=>{
    console.log(params)
    return postRequest("/account/register",params)
}
const editPassword = (params)=>{
    return putRequest("/account/editPassword",params)
}
const editEmail = (params)=>{
    return putRequest("/account/editEmail",params)
}
export {
    login,
    register,
    editEmail,
    editPassword
}