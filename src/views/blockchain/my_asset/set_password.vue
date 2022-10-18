<template>
  <div id="set_password">
    <c-title :hide="false" :text="'交易密码'"></c-title>
    <div id="password_one" v-if="!has_password">
      <div class="user">
        <div class="img">
          <img :src="passData.avatar_image">
        </div>
        <span>{{passData.nickname}}</span>
      </div>
      <div class="info">
        <ul class="info_a">
          <li>
            <span>手机号：</span>
            <input type="text" placeholder="请输入手机号" disabled v-model.trim="form.mobile">
          </li>
          <li v-if="passData.captcha_status">
            <span>图形验证码：</span>
            <input type="text" placeholder="请输入验证码" v-model.trim="form.captcha">
            <img style='width: 20%; height: 40px; position: absolute; display: block; left: 74%; z-index: 999;' :src="imgcode" @click='getimgdata()' v-if='imgcode'>
            <!--<span>图形验证码</span>-->
          </li>
         <van-field
                v-model.trim="form.code"
                center
                clearable
                label="验证码:"
                placeholder="请输入验证码"
                label-width="7.5rem"
              >
                <template #button>
                  <van-button type="default" :disabled = "btnTag"   :color="btnBg" size="small" @click.native="verificationCode">{{btnText}}</van-button>
                </template>
          </van-field>
        </ul>
        <ul class="info_b">
          <li>
            <span>支付密码：</span>
            <input type="password" placeholder="请输入6位支付密码" MAXLENGTH="6" v-model.trim="form.password">
          </li>
          <li>
            <span>确认密码：</span>
            <input type="password" placeholder="请确认密码" MAXLENGTH="6" v-model.trim="form.confirm_password">
          </li>
        </ul>
      </div>
      <div class="btn" @click="setPassword">
        <van-button type="large">确定</van-button>
      </div>
    </div>

    <div id="password_two" v-if="has_password">
      <div class="user">
        <div class="img">
          <img :src="passData.avatar_image">
        </div>
        <span>{{passData.nickname}}</span>
      </div>
      <div class="info">
        <ul class="info_a">
          <li>
            <span>手机号：</span>
            <input type="text" placeholder="请输入手机号" disabled v-model.trim="form.mobile">
          </li>
        </ul>
      </div>
      <div class="explain">
        <p>您已设置过支付密码，如忘记，请点击忘记密码
          <br>重置支付密码！</p>
      </div>
      <div class="btn" @click="forgetPassword">
        <van-button type="large">忘记密码</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import set_password_controller from "./set_password_controller";

export default set_password_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #set_password {
    #password_one {
      .user {
        margin: 1.25rem auto;

        .img {
          margin: 0 auto;
          width: 3.75rem;
          height: 3.75rem;
          border-radius: 2.25rem;
          overflow: hidden;
          background: #ccc;

          img {
            width: 100%;
          }
        }

        span {
          display: block;
          font-size: 16px;
          font-weight: bold;
          line-height: 1.875rem;
        }
      }

      .info {
        .info_a {
          background: #fff;
          border-top: solid 0.0625rem #ebebeb;
          border-bottom: solid 0.0625rem #ebebeb;
          padding-left: 0.875rem;

          li {
            display: flex;
            align-items: center;
            line-height: 2.8125rem;
            padding-right: 0.875rem;
            border-bottom: solid 0.0625rem #ebebeb;
            font-size: 16px;
            position: relative;

            span {
              flex-shrink: 0;
            }

            span:first-child {
              width: 7.5rem;
              text-align: left;
            }

            span:last-child {
              position: absolute;
              right: 0.625rem;
              font-size: 12px;
              padding: 0.125rem 0.625rem;
              color: #f15353;
              background: #f5f5f5;
              border-radius: 1rem;
              height: 1.625rem;
              line-height: 1.625rem;
            }

            input {
              border: none;
            }
          }

          li:last-child {
            border: none;
          }
        }

        .info_b {
          margin-top: 0.625rem;
          background: #fff;
          border-top: solid 0.0625rem #ebebeb;
          border-bottom: solid 0.0625rem #ebebeb;
          padding-left: 0.875rem;

          li {
            display: flex;
            align-items: center;
            line-height: 2.8125rem;
            padding-right: 0.875rem;
            border-bottom: solid 0.0625rem #ebebeb;
            font-size: 16px;
            position: relative;

            span:first-child {
              width: 7.5rem;
              text-align: left;
            }

            span:last-child {
              position: absolute;
              right: 0.625rem;
              font-size: 12px;
              padding: 0.125rem 0.625rem;
              color: #f15353;
              background: #f5f5f5;
              border-radius: 1rem;
              height: 1.625rem;
              line-height: 1.625rem;
            }

            input {
              border: none;
            }
          }

          li:last-child {
            border: none;
          }
        }
      }

      .btn {
        margin: 1.25rem auto;

        button {
          padding: 0;
          width: 18.75rem;
          height: 2.625rem;
          border-radius: 0.25rem;
          background: #f7a145;
          font-size: 16px;
          border: none;
          color: #fff;
        }
      }
    }

    #password_two {
      .user {
        margin: 1.25rem auto;

        .img {
          margin: 0 auto;
          width: 3.75rem;
          height: 3.75rem;
          border-radius: 2.25rem;
          overflow: hidden;
          background: #ccc;

          img {
            width: 100%;
          }
        }

        span {
          display: block;
          font-size: 16px;
          font-weight: bold;
          line-height: 1.875rem;
        }
      }

      .info {
        .info_a {
          background: #fff;
          border-top: solid 0.0625rem #ebebeb;
          border-bottom: solid 0.0625rem #ebebeb;
          padding-left: 0.875rem;

          li {
            display: flex;
            align-items: center;
            line-height: 2.8125rem;
            padding-right: 0.875rem;
            border-bottom: solid 0.0625rem #ebebeb;
            font-size: 16px;
            position: relative;

            span:first-child {
              width: 7.5rem;
              text-align: left;
            }

            span:last-child {
              position: absolute;
              right: 0.625rem;
              font-size: 12px;
              padding: 0.125rem 0.625rem;
              color: #f15353;
              background: #f5f5f5;
              border-radius: 1rem;
              height: 1.625rem;
              line-height: 1.625rem;
            }

            input {
              border: none;
              color: #333;
            }
          }

          li:last-child {
            border: none;
          }
        }
      }

      .explain {
        margin: 1.25rem auto;

        p {
          color: #8c8c8c;
        }
      }

      .btn {
        margin: 1.25rem auto;

        button {
          padding: 0;
          width: 18.75rem;
          height: 2.625rem;
          border-radius: 0.25rem;
          background: #f7a145;
          font-size: 16px;
          border: none;
          color: #fff;
        }
      }
    }

    .yd-btn-warning:not(.yd-btn-loading) {
      height: 40px;
    }

    /deep/.van-cell {
      padding: 10px 12px 10px 0;
      font-size: 16px;

      .van-field__label {
        margin-right: 0;
        color: #333;
      }

      /deep/input::placeholder {
        color: #757575;
      }
    }
  }

</style>