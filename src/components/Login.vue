<template>

 <div style="padding-left:60%;padding-top:10%;padding-right:10%">
    <a-tabs defaultActiveKey="1">
      <a-tab-pane tab="账号登录" key="1">
        <a-form  :form="loginform" >
    <a-form-item :validate-status="formErrorValid('loginId') ? 'error' : ''" :help="formErrorValid('loginId') || ''">
       <a-input placeholder="请输入账号,账号为注册手机号" allowClear addonBefore="账号"  v-model="account.loginId"  maxlength="20" v-decorator="[
          'loginId',{ rules: [{ required: true, message: '请输入账号!' }] },]"/>
    </a-form-item>
    <a-form-item :validate-status="formErrorValid('pwd') ? 'error' : ''" v-model="account.pwd"   maxlength="20" :help="formErrorValid('pwd') || ''">
        <a-input-password placeholder="请输入密码"  allowClear addonBefore="密码"
           v-decorator="['pwd',{ rules: [{ required: true, message: '请输入密码!' }] },]"/>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit" :disabled="hasErrors(loginform.getFieldsError())">
        提交
      </a-button>
       <a-button type="default" html-type="reset" @click="regeistform.reset()">
        取消
      </a-button>
      </a-form-item>
       <a-form-item>
       <a-button type="link" @click="openRegeistPage">注册</a-button>
       <a-button type="link">忘记密码</a-button>
    </a-form-item>

      <a-drawer title="注册账号" :width="720"  :visible="visible"  :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}" @close="visible=false">
           <a-form  :form="regeistform"  @submit="regesistAccount">
              <a-form-item :validate-status="formErrorValid2('loginId') ? 'error' : ''" :help="formErrorValid2('loginId') || ''">
               <a-input placeholder="请输入手机号" allowClear addonBefore="手机号"  v-model="regeistAccount.loginId"  maxlength="20" v-decorator="[
                 'loginId',{ rules: [{ required: true, message: '请输入手机号!'},{pattern:'^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\\d{8}$',message:'手机号码有误，请重填'}] },]"/>
             </a-form-item>
              <a-form-item :validate-status="formErrorValid2('pwd') ? 'error' : ''" :help="formErrorValid2('pwd') || ''">
               <a-input-password placeholder="请输入密码" allowClear addonBefore="密码"  v-model="regeistAccount.pwd"  maxlength="20" v-decorator="[
                 'pwd',{ rules: [{ required: true, message: '请输入密码!'},{pattern:/^[a-zA-Z0-9]{6,8}$/,message:'密码为6-8为字符或数字'}] },]"/>
             </a-form-item>
              <a-form-item :validate-status="formErrorValid2('pwd2') ? 'error' : ''" :help="formErrorValid2('pwd2') || ''">
               <a-input-password placeholder="请再次输入密码" allowClear addonBefore="验证密码"  v-model="regeistAccount.pwd2"  maxlength="20" v-decorator="[
                 'pwd2',{ rules: [{ required: true,validator:validatorSame}] },]"/>
             </a-form-item>
              <a-form-item>
                <a-button type="primary" html-type="submit" :disabled="hasErrors(regeistform.getFieldsError())">
                提交
              </a-button>
              <a-button type="default" html-type="reset" @click="regeistform.resetFields();">
               取消
              </a-button>
      </a-form-item>
           </a-form>
      </a-drawer>
  </a-form>
      </a-tab-pane>
      <a-tab-pane tab="微信登录" key="2" forceRender>微信登录</a-tab-pane>
    </a-tabs>
     

 </div> 
</template>

<script>
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
export default {
  data() {
    return {
      hasErrors,
      loginform: this.$form.createForm(this, { name: 'horizontal_login'}),
      regeistform: this.$form.createForm(this, { name: '2'}),
      account: {loginId:0,pwd:0},//登录对象
      visible: false,//是否显示注册界面
      regeistAccount:{loginId:0,pwd:0,pwd2:0,qrcode:0}//注册账号
    };
  },
  mounted() {
    this.$nextTick(() => {
      if(this.visible){
        this.loginform.validateFields();
      }else{
        this.regeistform.validateFields();
      }
    });
  },
  methods: {
    //用于登录表单错误验证显示
    formErrorValid(errorArea){
       const { getFieldError, isFieldTouched } = this.loginform;
      return isFieldTouched(errorArea) && getFieldError(errorArea);
    },
    //用于注册表单错误验证显示
    formErrorValid2(errorArea){
       const { getFieldError, isFieldTouched } = this.regeistform;
      return isFieldTouched(errorArea) && getFieldError(errorArea);
    },
    //打开注册界面
    openRegeistPage(){
      this.regeistAccount={loginId:0,pwd:0,pwd2:0,qrcode:0};
      this.visible=true;
    },
    //自定义验证，密码是否相同
    validatorSame(rule,value,calback){
      if(this.regeistAccount.pwd2){
         if(this.regeistAccount.pwd!=this.regeistAccount.pwd2){
             return calback(new Error("两次密码不一致"));
          }
        }else{
          return calback(new Error("验证密码不可为空"));
        }
    },
    //提交账号
    regesistAccount(){
      this.$http.post(
            "portal/login",{loginId:this.regesistAccount.loginId,pwd:this.regesistAccount.pwd,code:this.regeistAccount.code},
            //解决跨域问题，不加无法跨域
            {emulateJSON: true}
        ).then(
            function (res) {
                console.log(res);
                this.msg = res.bodyText;
            },
            function (res) {
                console.log(res.status);
            }
        );
    }
  },
};
</script>
<style>
</style>