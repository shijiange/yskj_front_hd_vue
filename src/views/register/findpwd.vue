<template>
  <div id="findpwd">
    <c-title :hide="false" text="忘记密码"></c-title>
    <!--<img style='width:20%;height:40px;position:absolute;display:block;left:74%;top:8rem;z-index:999' :src="imgcode" @click='getimgdata' v-if='imgcode'>-->
    <!-- 新页面 -->
    <div id="content">
      <ul class="area_number">
        <li v-if="country_code == 1 && is_enable == 0">
          <div class="must">*</div>
          <span>国家区号</span>
          <input type="text" placeholder="+86" v-model.trim="form.country"/>
        </li>
      </ul>
      <ul class="login_info">
        <li v-if="imgcode">
          <div class="must">*</div>
          <input type="text" placeholder="请输入右侧图形验证码" v-model.trim="form.captcha"/>
          <div>
            <img style="width: 100%; height: 2.5rem; z-index: 999;" :src="imgcode" @click="getimgdata()" v-if="imgcode"/>
          </div>
        </li>
        <li v-if="is_enable == 0">
          <div class="must">*</div>
          <input type="text" placeholder="请输入手机号" v-model.trim="form.mobile"/>
        </li>
        <li v-if="is_enable == 1">
          <div class="must">*</div>
          <input type="text" placeholder="请输入账号" v-model.trim="form.mobile"/>
        </li>
        <li class="code" v-if="is_enable == 0">
          <div class="must">*</div>
          <input type="text" placeholder="请输入验证码" v-model.trim="form.code"/>

          <van-button
            type="default"
            size="small"
            :color="btnBg"
            round
            :disabled="btnTag"
            @click.native="verificationCode"
          >{{ btnText }}
          </van-button
          >
        </li>
        <li>
          <div class="must">*</div>
            <van-field v-model.trim="form.password" :type="visibleSet?'text':'password'" class="password-input" :border="false" placeholder="设置密码" center clearable>
              <template slot="right-icon">
                <i :class="['iconfont', visibleSet?'icon-onlineCar_f':'icon-onlineCar_g']" style="font-size: 30px;" @click.stop="visibleSet=!visibleSet"></i>
              </template>
            </van-field>
        </li>
        <li>
          <div class="must">*</div>
            <van-field v-model.trim="form.confirm_password" :type="visibleSure?'text':'password'" class="password-input" :border="false" placeholder="确认密码" center clearable>
              <template slot="right-icon">
                <i :class="['iconfont', visibleSure?'icon-onlineCar_f':'icon-onlineCar_g']" style="font-size: 30px;" @click.stop="visibleSure=!visibleSure"></i>
              </template>
            </van-field>
        </li>
      </ul>
      <div style="margin-top: 10px;" v-if="is_enable == 1">
        <div
          style="width: 100%; text-align: left; text-indent: 20px; background: #e3e3e3; color: #6666; padding: 5px 0;">
          密保问题
        </div>
        <div style="padding: 0 0.5rem;">
          <van-cell-group>
            <van-field v-model="fathername" required label="父亲姓名" placeholder="请输入父亲姓名"/>
            <van-field v-model="mothername" required label="母亲姓名" placeholder="请输入母亲姓名"/>
          </van-cell-group>
        </div>
      </div>
      <div class="btn">
        <button type="button" @click="findpwd">提交修改</button>
      </div>
    </div>
    <!-- end -->
  </div>
</template>

<script>
import findpwd_controller from "./findpwd_controller";

export default findpwd_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  #findpwd {
    width: 100%;

    .must {
      color: #f15353;
      align-self: center;
      margin-top: 0.5rem;
      margin-right: 0.5rem;
    }

    .password-input {
      padding: 0;
      border-bottom: solid 1px #eee;
    }

    #code {
      background: #ccc;
      padding: 0.1875rem 0.3125rem;
      border-radius: 0.1875rem;
    }

    h1 {
      color: #42b983;
    }

    .mint-button--large {
      margin-top: 0.625rem;
    }

    #bts {
      margin: auto 0.3125rem;

      .mint-button--default {
        background-color: #13ce66;
        color: #fff;
      }
    }

    .forget {
      color: #999;
      float: right;
    }
    // 新页面
    #content {
      background-color: #fff;
      height: 627px;

      .area_number {
        padding-top: 20px;
        font-size: 16px;
        color: #333;
        margin-bottom: 30px;

        li {
          height: 40px;
          line-height: 40px;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;

          span {
            width: 92px;
            text-align: left;
          }

          input {
            border: none;
            border-bottom: solid 1px #eee;
            width: 240px;
            padding: 0 10px;
          }
        }
      }

      .login_info {
        margin: 20px;

        li {
          margin: 20px auto 0 auto;
          width: 21rem;
          display: flex;
          font-size: 16px;
          height: 40px;
          line-height: 40px;

          /* border-bottom: solid 1px #ccc; */
          position: relative;

          input {
            width: 100%;
            border: none;
            border-bottom: solid 1px #eee;
          }

          span {
            // font-size: 14px;
            // position: absolute;
            // right: 0;
            // color: #333;
          }

          .img {
            width: 40px;
            overflow: hidden;

            img {
              margin-top: 26%;
              width: 48%;
            }
          }
        }

        .code {
          // justify-content: space-between;
          button {
            // border: none;
            // background-color: #ebebeb;
            // color: #f15353;
            // font-size: 14px;
            // border-radius: 30px;
            // padding: 0 10px;
            // height: 30px;
            // line-height: 30px;
            // margin-top: 4px;
          }

          .van-button {
            width: 8.125rem;
          }

          .van-button__text {
            white-space: nowrap;
            color: #ffff;
          }
        }
      }

      .btn {
        margin-top: 40px;

        button {
          width: 315px;
          height: 45px;
          font-size: 16px;
          margin-bottom: 20px;
          border-radius: 30px;
          border: none;
          background-color: #f15353;
          color: #fff;
        }
      }
    }
  }
</style>
