<template>
  <div id="register">
    <div class="image">
      <img v-if="banner_url && show_banner" :src="banner_url" alt="" />
      <img v-if="!banner_url && show_banner" src="../../../assets/images/share_bg1@2x.png" alt="" />
    </div>
    <!-- 新页面 -->
    <div class="box" :style="{top: show_banner?'-5rem':'5rem'}">
      <div class="box1">
        <div id="content">
          <ul class="area_number">
            <li v-if="country_code == 1" class="country-code">
              <div class="must">*</div>
              <span>国家区号</span>
              <van-field v-model="value" placeholder="+86" v-model.trim="form.country" center clearable :border="false" />
            </li>
          </ul>

          <ul class="login_info">
            <li v-if="imgcode" class="codeBox commont-style">
              <div class="must">*</div>
              <!-- <input type="text" placeholder="请输入右侧图形验证码" v-model.trim="form.captcha"> -->
              <van-field v-model.trim="form.captcha" :border="false" placeholder="请输入右侧图形验证码" center clearable />
              <!-- :style="{ top: country_code == 1 ? '8rem' : '6rem' }" -->
              <img slot="button" style="width: 23%; height: 2.5rem; z-index: 999;" :src="imgcode" @click="getimgdata()" v-if="imgcode" />
            </li>
            <li class="commont-style">
              <div class="must">*</div>
              <van-field v-model.trim="form.mobile" :border="false" placeholder="请输入手机号码" center clearable />
            </li>

            <li class="commont-style">
              <div class="must">*</div>
              <!-- <input type="text" placeholder="请输入验证码" v-model.trim="form.code"> -->
              <van-field v-model.trim="form.code" center clearable placeholder="请输入验证码">
                <template #button>
                  <van-button size="small" type="primary" :disabled="btnTag" :color="btnBg" @click.native="verificationCode">{{ btnText }}</van-button>
                </template>
              </van-field>
            </li>
            <li class="invitCode commont-style" v-if="invite">
              <div class="must" v-if="isrequired">*</div>
              <div class="must" v-else style="opacity: 0;">*</div>
              <van-field v-model.trim="form.invite_code" :border="false" placeholder="请输入邀请码" center clearable />
            </li>

            <li class=" commont-style" v-if="is_password">
              <div class="must">*</div>
              <van-field v-model.trim="form.password" :type="setpassword" :border="false" placeholder="设置密码" center clearable>
                <template slot="right-icon">
                  <i class="iconfont icon-onlineCar_f" style="font-size: 30px;" @click.stop="SetPwdClick()" v-if="!visibleSet"></i>
                  <i class="iconfont icon-onlineCar_g" style="font-size: 30px;" @click.stop="SetPwdClick()" v-if="visibleSet"></i>
                </template>
              </van-field>
            </li>

            <li class="commont-style" v-if="is_password">
              <div class="must">*</div>
              <van-field v-model.trim="form.confirm_password" :type="surepassword" :border="false" placeholder="确认密码" center clearable>
                <template slot="right-icon">
                  <i class="iconfont icon-onlineCar_f" style="font-size: 30px;" @click.stop="surePwdClick()" v-if="!visibleSure"></i>
                  <i class="iconfont icon-onlineCar_g" style="font-size: 30px;" @click.stop="surePwdClick()" v-if="visibleSure"></i>
                </template>
              </van-field>
            </li>
          </ul>
          <div class="agreement">
            <van-checkbox v-model="agreementCB" checked-color="#f15353" shape="square">&nbsp;</van-checkbox>
            <!--<el-checkbox v-model="agreementCB">&nbsp;</el-checkbox>-->
            <span slot="right" style="font-size: 16px; text-decoration: underline;" @click="agreement_show = true">注册协议</span>
          </div>
          <!-- <div class="btn">
						<button type="button" @click="register">绑定</button>
					</div>  -->
        </div>
        <diyorm
          v-if="diyform.fields"
          ref="gofunarr"
          v-on:gofunarr="postDiy"
          :modeType="'Single'"
          :singleStatus="true"
          :singleDatas="diyform"
          :desThumb="false"
          :memberBtn="false"
          :methodType="'funarr'"
        ></diyorm>
        <div class="btn">
          <button type="button" @click="getPrepBind">绑定</button>
        </div>
        <!-- <div class="btn">
					<button type="button" @click="goto">去哪</button>
				</div>
				<div class="btn">
					<button type="button" @click="successShow">注册成功</button>
				</div> -->
      </div>
    </div>
    <van-popup v-model="success_show" closeOnClickModal="true" style="width: 80%; height: 50vh; padding: 0; border-radius: 1rem;">
      <div style="width: 100%; overflow: hidden;" class="code_box">
        <div style="width: 100%; height: 4.125rem; margin: 2rem 0;">
          <img src="../../../assets/images/share_success@2x.png" alt="" style="width: 6.8rem; height: 100%;" />
        </div>
        <div style="line-height: 3rem; font-size: 2rem; color: #f15353;">
          注册成功
        </div>
        <div style="color: #999;">
          恭喜您，成功注册，快去下载体验吧
        </div>
        <div class="btn" style="margin: 3rem auto; width: 80%;">
          <button type="button" @click="jumpDown">下载APP</button>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="agreement_show" closeOnClickModal="true" style="width: 90%; height: 70vh; padding: 0; border-radius: 1rem; overflow-y: auto;">
      <div style="width: 100%; overflow: hidden;" class="code_box">
        <div v-html="register_explain" style="margin: 0.75rem; text-align: left;"></div>
      </div>
    </van-popup>

    <van-popup v-model="pickerShow" position="bottom">
      <van-datetime-picker type="date" title="选择年月日" v-model="pickerValue" @cancel="pickerShow = false" @confirm="setDate" />
    </van-popup>

    <yd-cityselect v-model="showCity" :callback="setCity" :items="district"></yd-cityselect>

    <van-popup v-model="show2" class="mint-popup-3" position="right" closeOnClickModal="true" modal="false" style="z-index: 2004;">
      <div class="city-info">
        <van-nav-bar left-arrow title="协议" fixed @click-left="popClose" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']" />
        <div>
          <div style="height: 2.5rem; clear: both;"></div>

          <div id="a_content" v-html="protocol_content"></div>
        </div>
      </div>
    </van-popup>
    <!-- 会员id变更时提示 -->
    <van-popup v-model="showChangeID" class="changeId_popup" :close-on-click-overlay="false" round>
      <div class="changeId_main">
        <i class="iconfont icon-toast_warn"></i>
        <p class="changeId_warnTitel">重要提示</p>
        <p class="changeId_warnText">
          当前绑定绑定操作会导致用户ID变更：原会员ID:{{ changidInfo.uid }}，变更后会员ID:{{ changidInfo.change_uid }}；绑定后所有数据记录以变更后会员ID{{ changidInfo.change_uid }}为准，<em
            style="color: #d53125;"
            >原会员ID{{ changidInfo.uid }}数据将被删除，数据不会进行合并，且不可找回！</em
          >请谨慎操作！<br />
          绑定后请注意重新生成推广海报、重新发送推广链接！
        </p>
        <span class="changeId_Btn" @click="register">确认合并</span>
        <span class="changeId_Btn changeId_Btn_other" @click="showChangeID = false">取消</span>
      </div>
    </van-popup>
    <div style="height: 2.5rem; clear: both;"></div>
  </div>
</template>

<script>
import scan_editmobilecontroller from "./scan_editmobilecontroller";
export default scan_editmobilecontroller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#register {
  min-height: 100vh;
  background: #fff;

  .must {
    color: #f15353;
    align-self: center;
    margin-top: 0.5rem;
    margin-right: 0.5rem;
  }

  .box {
    margin: 0 auto;
    width: 90%;
    border-radius: 1rem;
    box-shadow: 0 0 10px #ccc;
    position: relative;
    top: -5rem;
    background: #fff;

    .box1 {
      padding: 0 5%;
      // 新css
      #content {
        background-color: #fff;
        // height: 627px;
        overflow-y: hidden;

        .area_number {
          padding-top: 1.25rem;
          font-size: 18px;
          color: #333;
          margin-bottom: 1.875rem;

          li {
            height: 2.5rem;
            line-height: 2.5rem;
            padding: 0 1.25rem;
            display: flex;
            justify-content: space-between;

            span {
              width: 5.75rem;
              text-align: left;
            }

            .yd-input {
              border: none;
              border-bottom: solid 0.0625rem #ccc;
              width: 15rem;
            }
          }
        }

        .login_info {
          li {
            margin: 1.25rem auto 0 auto;
            // width: 20.625rem;
            display: flex;
            font-size: 16px;
            height: 2.5rem;
            line-height: 2.5rem;

            /* border-bottom: solid 0.0625rem #ccc; */
            position: relative;

            input {
              width: 14.625rem;
              border: none;
            }
            // span {
            //   font-size: 14px;
            //   position: absolute;
            //   right: 0;
            //   color: #333;
            // }
            .img {
              width: 2.5rem;
              overflow: hidden;

              img {
                margin-top: 26%;
                width: 48%;
              }
            }
          }
          // .code {
          //   justify-content: space-between;
          //   button {
          //     border: none;
          //     background-color: #ebebeb;
          //     color: #f15353;
          //     font-size: 14px;
          //     border-radius: 1.875rem;
          //     padding: 0 0.625rem;
          //     height: 1.875rem;
          //     line-height: 1.875rem;
          //     margin-top: 0.25rem;
          //   }
          // }
        }

        .agreement {
          margin-top: 0.625rem;
          height: 2.25rem;
          line-height: 2.25rem;
          text-align: left;
          padding: 0 1.25rem;
          display: flex;

          .span {
            text-align: center;
            font-size: 20px;
            margin-left: 0.375rem;
            display: block;
          }
        }
        // .btn {
        //   margin-top: 2.5rem;
        //   width: 100%;
        //   button {
        //     width: 100%;
        //     height: 2.8125rem;
        //     font-size: 16px;
        //     margin-bottom: 1.25rem;
        //     border-radius: 1.875rem;
        //     border: none;
        //     background-color: #f15353;
        //     color: #fff;
        //   }
        // }
      }
    }
  }

  .image {
    width: 100%;
    height: auto;
    // border-bottom-left-radius: 7rem;
    // border-bottom-right-radius: 7rem;
    img {
      width: 100%;
      height: auto;
      // border-bottom-left-radius: 7rem;
      // border-bottom-right-radius: 7rem;
    }
  }

  #agreement {
    height: 1.875rem;
    line-height: 1.875rem;

    .span {
      text-align: center;
      font-size: 20px;
    }
  }

  .city-info {
    overflow-y: scroll;
    width: 100vw;
    height: 100vh;
    background: #fff;
  }

  .mint-header {
    background: none;
    color: #666;
  }

  .is-fixed .mint-header-title {
    font-weight: bold;
  }

  .mint-header.is-fixed {
    border-bottom: 0.0625rem solid #e8e8e8;
    background: #fff;
    z-index: 99;
  }

  #lin {
    margin-bottom: 1.25rem;
  }
  // margin-top: 3.125rem;
  width: 100%;

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

  //   #bts {
  //     margin: auto 0.3125rem;
  //     .mint-button--default {
  //       background-color: #13ce66;
  //       color: #fff;
  //     }
  .btn {
    margin-top: 2.5rem;
    width: 100%;

    button {
      // width: 20.625rem;
      width: 100%;
      height: 2.8125rem;
      font-size: 16px;
      margin-bottom: 1.25rem;
      border-radius: 1.875rem;
      border: none;
      background-color: #f15353;
      color: #fff;
    }
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

  .changeId_popup {
    .changeId_main {
      padding: 2rem;
      width: 18.875rem;

      i {
        font-size: 3rem;
        color: rgb(213, 49, 37);
      }

      .changeId_warnTitel {
        margin: 0.75rem 0;
        font-size: 1.125rem;
        font-weight: bold;
        color: #000;
      }

      .changeId_warnText {
        text-align: left;
        font-size: 0.875rem;
      }

      .changeId_Btn {
        width: 5rem;
        border: 1px solid #c5c5c5;
        background: #d53125;
        border-radius: 0.35rem;
        color: #fff;
        height: 2rem;
        display: block;
        line-height: 2rem;
        margin: 1rem auto 0;
      }

      .changeId_Btn_other {
        opacity: 0.5;
      }
    }
  }
}

#register {
  .van-cell-group__title {
    text-align: left;
    padding: 2.5px 12px 5px;
  }

  /deep/input {
    color: #555;
  }

  /deep/input::placeholder {
    color: #555;
    font-size: 16px;
  }

  /deep/.van-cell:active {
    background-color: #fff !important;
  }

  .country-code {
    .van-cell {
      padding: 0 0 0 10px;
      border-bottom: solid 0.0625rem #eee;
    }

    span {
      white-space: nowrap;
    }
  }

  .login_info {
    .commont-style {
      .van-cell {
        padding: 0;
        border-bottom: solid 0.0625rem #eee;
      }
    }
  }

  /deep/.van-field__right-icon {
    padding-top: 8px;
  }

  .address_nontext {
    .sel-address {
      padding: 0 12px;
      height: 50px;
      font-size: 16px;
      color: #555;

      .van-cell__title {
        flex: none;
      }

      .van-cell__value {
        input {
          width: 100%;
          border: none;
        }
      }
    }

    .van-textarea {
      padding: 5px;
      border: 1px solid #e3e3e3;

      /deep/textarea::placeholder {
        color: #555;
      }
    }
  }

  .second-commont {
    .van-cell {
      padding: 0 12px;
      height: 50px;
      font-size: 16px;
      color: #555;
    }

    .van-cell__title {
      flex: none;
    }

    .van-field {
      padding: 0;
      border-bottom: solid 0.0625rem #eee;
    }
  }

  .select {
    .van-cell {
      padding: 0 12px;
      height: 50px;
      font-size: 16px;
      color: #555;
    }

    .van-cell__title {
      text-align: left;
    }
  }

  .down-pull {
    margin-top: 10px;
    margin-bottom: 10px;

    /deep/.van-cell__title {
      text-align: left;
      flex: none;
      width: auto;
      margin-right: 0;
    }

    input {
      width: 100%;
      border: none;
      color: #333;
    }

    select {
      width: 100%;
      border: none;
      color: #555;
    }

    .van-cell {
      height: 50px;
      padding: 0 12px;
      color: #555;
      font-size: 16px;
    }

    .van-cell__value {
      span {
        color: #555;
      }
    }

    .van-field {
      padding: 0;
      border-bottom: solid 0.0625rem #eee;
    }
  }

  .one-line {
    .van-cell {
      padding: 0 12px;
      height: 50px;
      color: #555;
      font-size: 16px;

      .van-cell__title {
        flex: none;
      }

      .van-cell__value {
        height: 100%;
      }
    }
  }

  /deep/.van-cell--clickable:active {
    background-color: #fff;
  }

  .van-nav-bar,
  /deep/.van-nav-bar__content {
    height: 40px;
  }

  /deep/.van-nav-bar__title {
    font-weight: 700;
    font-size: 14px;
    color: #666;
  }

  /deep/.van-nav-bar .van-icon {
    color: #666;
  }

  /deep/.van-nav-bar__left {
    padding: 0 0 0 10px;
  }

  .pcStyle {
    width: 375px;
    margin: 0 auto;
    left: 50%;
    margin-left: -187.5px;
  }
}
</style>
<style lang="scss" rel="stylesheet/scss">
.vant-sure-class {
  .van-field__right-icon {
    color: green;
  }
}

.vant-no-sure-class {
  .van-field__right-icon {
    color: red;
  }
}
</style>
