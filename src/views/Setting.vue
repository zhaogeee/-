<template>
  <div class="bgd">
    <div class="content">
      <div>
        <a-form v-model:model="accountData" :label-col="labelCol" :wrapper-col="{span:6}">
          <a-form-item label="邮 箱">
            <a-space :size="12">
              <a-input v-model:value="accountData.email" />
              <a-button type="primary" @click="handleEditEmail">修改</a-button>
            </a-space>
          </a-form-item>
          <!-- <a-form-item label="手 机">
            <a-space :size="12">
            <a-input v-model:value="accountData.tel" />
            <a-button type="primary" @click="handleEditTel">修改</a-button>
            </a-space>
          </a-form-item> -->
          <a-form-item label="密 码">
            <a-space :size="12">
            <a-input disabled placeholder="*******"></a-input>
            <a-button type="primary" @click="showEdit">修改</a-button>
            </a-space>
          </a-form-item>
          <a-form :label-col="labelCol" :wrapper-col="{span:6}" v-show="visible">
              <a-form-item label="旧密码">
                <a-input type="password" v-model:value="pwdForm.oldPassword" />
              </a-form-item>
              <a-form-item label="新密码">
                <a-input type="password" v-model:value="pwdForm.newPassword" />
              </a-form-item>
              <a-form-item label="重复密码">
                <a-input type="password" v-model:value="pwdForm.rePassword" />
                <a-button type="primary" ghost style="margin-top:1.5rem;" @click="editPwd">修改</a-button>
              </a-form-item>  
          </a-form>
        </a-form>
      </div>
      <a-divider type="vertical" style="height: 100%; "/>
      <div style="width:20%;">
        <!-- <a-row type="flex" justify="space-around" align="middle"> -->
          <!-- <a-col :span="20"> -->
            <img src="../assets/setting.svg" class="setting"/>
          <!-- </a-col>
          <a-col :span="2" :offset="1"> -->
            
          <!-- </a-col> -->
        <!-- </a-row>          -->       
      </div>
      <!-- <a-col :span="2" :offset="2"> -->
        
      <!-- </a-col> -->
      
    </div>
    
  </div>
</template>

<script>
import {ref,reactive} from 'vue'
import { message } from "ant-design-vue";
import {editPassword,editEmail} from '../api/loginApi';
export default {
    setup(){
        let accountData = reactive({
          tel:sessionStorage.getItem('account'),
          email:sessionStorage.getItem('email')
        })
        // const originAccount = JSON.parse(sessionStorage.getItem("accountData"))
        // accountData = originAccount
        let pwdForm = reactive({
            oldPassword:'',
            newPassword:'',
            rePassword:''
        })
        const visible = ref(false);
        const editPwd = async () => {
            if( pwdForm.newPassword && pwdForm.newPassword == pwdForm.rePassword ){
                const { code } = await editPassword({
                    accountId:accountData.tel,
                    oldPassword:pwdForm.oldPassword,
                    newPassword:pwdForm.newPassword
                })
                if(code == 200){
                pwdForm = {
                    oldPassword:'',
                    newPassword:'',
                    rePassword:''
                }
                message.success("修改成功");
                }else{
                message.error(code);
                }
            }else{
                message.warning("两次密码输入不一致")
            }
            
        };
        const handleEditEmail = async () => {
            if(accountData.email != ''){
                const { code } = await editEmail({
                    accountId:accountData.tel,
                    email:accountData.email
                })
                if(code == 0){
                    message.success("修改成功");
                    sessionStorage.setItem('email',accountData.email)
                }else{
                    message.error(code);
                }
            }else{
                message.warning("邮箱不能为空");
            }
        };
        const showEdit = ()=>{
          visible.value = !visible.value
          console.log(visible.value)
        }
        return {
            labelCol:{span:8,style:{fontWeight:'bold'}},
            accountData,
            pwdForm,
            visible,
            editPwd,
            handleEditEmail,
            showEdit
        }
    }

}
</script>

<style lang="scss" scoped>
.bgd {
  padding: 3rem;
  background: #fff;
  height:80vh;
  display:flex;justify-content:space-around;
  // padding-top: 3rem;
}
.content {
  display:flex;
  justify-content:space-around;
  align-items:center;
  width:80%;
  margin-right:5%;
}

button {
  // margin-top: 40px;
  height:2.5rem;
  font-size: 16px;
  
}
.ant-form-item {
  margin-bottom: 2.5rem;
}
::v-deep .ant-form-item-label > label {
    font-size: 20px;
    line-height: 2;
    // width:120px;
}
.ant-input {
    font-size: 18px;
    line-height: 1.8;
    width:20rem;
}
.setting {
  height:400px;
}
</style>