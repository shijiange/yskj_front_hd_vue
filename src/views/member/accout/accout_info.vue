<template>
    <div id="accout">
        <c-title :hide="false" text='开户信息'></c-title>
        <div class="list-box">
         
            
                <ul class="list-info">
                    <li class="left"><span>用户类型：</span></li>
                    <li class="right">
                        <ul class="right-child">

                            <van-radio-group v-model="userVal" direction="horizontal">
                                <van-radio name="2">个人</van-radio>
                                <van-radio name="1">企业</van-radio>
                            </van-radio-group>                            
                        </ul>
                    </li>
                </ul>
                <ul class="list">
                    <li class="left">
                        <span>客户号：</span>
                    </li>
                    <li class="right" id="ver-info">
                        <input type="text" placeholder="请输入客户号，类型为数字或字母" v-model="customNum">
                        
                        <van-icon class="iconfont icon-info-mark" custom size="22px" color="#f15353"></van-icon>
                    </li>
                </ul>
                
                 <ul class="list-info">
                    <li class="left"><span>证件类型：</span></li>
                    <li class="right">
                        <ul class="right-child">
                            <van-radio-group v-model="cardVal" direction="horizontal">
                                <van-radio name="1">身份证号码</van-radio>
                                <van-radio name="2">营业执照</van-radio>
                            </van-radio-group>
                        </ul>
                    </li>
                </ul>
              
                <ul class="list">
                     <li class="left">
                         <span>证件号码：</span>
                     </li>
                    <li class="right">
                        <input type="text" placeholder="请输入证件号码" v-model="cardNum">
                    </li>
                    
                </ul>
             
                <ul class="list">
                    <li class="left"><span>用户姓名：</span></li>
                    <li class="right" id="ver-info">
                        <input type="text" placeholder="请输入真实姓名或企业名称" v-model="userName">
                        <van-icon class="iconfont icon-info-mark" size="22px" color="#f15353"></van-icon>
                    </li>
                    
                    
                </ul>
                <ul class="list">
                    <li class="left"><span>法人姓名：</span></li>
                    <li class="right"><input type="text" placeholder="请输入法人姓名" v-model="legalName"></li>
                    
                    
                </ul>
                <ul class="list">
                    <li class="left"><span>法人身份证：</span></li>
                    <li class="right"><input type="text" placeholder="请输入法人身份证号码" v-model="legalCardNo"></li>
                </ul>
                
                <ul class="list">
                    <li class="left"><span>手机号码：</span></li>
                    <li class="right" id="ver-info">
                        <input type="text" placeholder="请输入手机号码" v-model="mobile">
                        <van-icon class="iconfont icon-info-mark" size="22px" color="#f15353"></van-icon>
                    </li>
                    
                    
                </ul>
                <ul class="list">
                    <li class="left"><span>固定电话：</span></li>
                    <li class="right"><input type="text" placeholder="请输入固定电话" v-model="telephone"></li>
                </ul>

                <ul class="list">
                    <li class="left"><span>邮箱：</span></li>
                    <li class="right"><input type="text" placeholder="请输入邮箱地址" v-model="mail"></li>
                    
                    
                </ul>
                <ul class="list">
                    <li class="left"><span>联系地址：</span></li>
                    <li class="right"><input type="text" placeholder="请输入联系地址" v-model="address"></li>
                    
                    
                </ul>
                <ul class="list">
                    <li class="left"><span>备注：</span></li>
                    <li class="right"><input type="text" placeholder="请输入备注" v-model="other"></li>
                </ul>
                <!-- <ul class="list">
                    <li class="left"><span>结算通交易账户：</span></li>
                    <li class="right"> <input type="text" placeholder="请输入结算通交易账户"></li>
                    
                   
                </ul>
                <ul class="list" id="login-name">
                    <li class="left"><span>登录名：</span></li>
                    <li class="right"> <input type="text" placeholder="请输入用户名"></li>
                </ul>
                <div class="login-name">注：用户名为数字、或字母+数字组合，且长度不能大于12</div> -->
                
               
                <van-popup v-model="popupVisible" style="width: 12.5rem; height: 10rem;">
                     <form :action="action" method="post" style="width: 100%; height: 100%; padding: 0.9375rem;">
                         <h1 style="font-size: 1.25rem; color: red; margin-top: 0.625rem;">确认开户吗？</h1>

                         <input type="text" name="ipsRequest" :value="msg" style="display: none; margin-top: 0.625rem;"/>

                         <input type="submit" value="确认" style="width: 5rem; height: 2rem; border-radius: 0.25rem; font-size: 1rem; color: #fff; background-color: #04be02; border: none; margin-top: 1.25rem;"/>
                     </form>
                </van-popup>  
            
        </div>
        <div class="btn">
            <button type="button" @click="submit" v-if="btn_applyShow">申请</button>

            <button type="button" @click="alterData" v-if="btn_alterShow">确认修改</button>
        </div>
        <div style="height: 1.875rem;"></div>
    </div>
</template>

<script>
import accout_info_controller from "./accout_info_controller";
export default accout_info_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #accout {
    .list-box {
      .list {
        display: flex;
        background-color: #fff;
        border-bottom: solid 1px #ebebeb;
        height: 3.0625rem;
        line-height: 3.0625rem;
        font-size: 14px;

        .left {
          width: 30%;
          text-align: right;
        }

        .right {
          width: 70%;
          text-align: left;

          input {
            border: none;
            width: 100%;
          }

          .right-child {

            // li{
            //     display: flex;
            //     flex:1;
            //     span{
            //         margin-left:1.5rem;
            //     }

            //     input{
            //         line-height:3.0625rem;
            //     }

            // }
            //     i{
            //         position: absolute;
            //     }

            // .mint-radiolist{
            //      display: flex;
            //      height:3.0625rem;
            //      .mint-cell{
            //         display: flex;
            //         flex: 1;
            //         .mint-radiolist-label{
            //             display: inline-block!important;
            //             width: 123px;
            //             .mint-radio{
            //                 float: left;
            //             }
            //         }
            //      }
            // }
          }

          textarea {
            border: none;
            width: 100%;
            margin-top: 1rem;
          }
        }

        #ver-info {
          display: flex;
          align-items: center;
          padding-right: 0.875rem;

          i {
            position: absolute;
            right: 0.875rem;
          }
        }
      }

      .list-info {
        display: flex;
        background-color: #fff;
        border-bottom: solid 1px #ebebeb;
        height: 3.0625rem;
        font-size: 14px;

        .left {
          width: 30%;
          text-align: right;
          line-height: 3.0625rem;
        }

        .right {
          width: 70%;
          text-align: left;
          padding-top: 1rem;
        }
      }

      #login-name {
        border: none;
      }

      .login-name {
        color: #999;
        line-height: 1.875rem;
        padding: 0 0.875rem;
        background-color: #fafafa;
      }

      .type {
        background-color: #fafafa;
        font-size: 14px;

        li:first-child {
          border-bottom: solid 1px #ebebeb;
        }

        li {
          line-height: 2.5rem;
          height: 2.5rem;
          display: flex;

          .left {
            width: 30%;
            text-align: right;
          }

          .right {
            width: 70%;
            text-align: left;
          }
        }

        i {
          position: absolute;
          right: 0.875rem;
        }
      }
    }

    .btn {
      margin-top: 1.25rem;

      button {
        width: 90%;
        height: 2.875rem;
        border-radius: 0.25rem;
        font-size: 16px;
        color: #fff;
        background-color: #04be02;
        border: none;
      }
    }
  }
</style>