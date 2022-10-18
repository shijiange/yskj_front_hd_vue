<template>
  <div id="company_modify">
    <c-title :hide="false"
             text="企业信息修改"></c-title>
    <div class="content">
      <div class="first">
        <div class="head">
          <div class="line"></div>
          <span>企业注册信息变更</span>
        </div>
        <p class="message"
           v-if="formData.operType=='14'">(法人/授权人变更必须上传身份证和营业执照照片)</p>
        <p class="message"
           v-if="formData.operType=='15'">(如果电子登记簿余额不为 0、存在在途资金，则不允许变
          更)</p>
        <p class="message"
           v-if="formData.operType=='23'">(必须上传授权书图片)</p>
        <div class="form_first">
          <div class="list">
            <div class="title">
              <label>操作类型</label>
              <span>*</span>
            </div>
            <input type="text"
                   disabled='true'
                   style="font-size: 12px; text-align: right; padding-right: 1rem;"
                   placeholder="请选择类型">
          </div>
          <div class="absolute"
               style="border-bottom: solid 1px #ccc; font-size: 12px; padding-left: 1rem; padding-bottom: 0.5rem;">
            <van-radio-group v-model="formData.operType">
              <van-radio :name="item.id"
                         style="margin-top: 0.5rem; display: flex; justify-content: space-between; padding-right: 1rem;"
                         v-for="(item,index) in empower"
                         :key="index"
                         @click="chooseEnp()"
                         checked-color="#f87070">{{item.name}}</van-radio>

            </van-radio-group>
          </div>
          <div class="list">
            <div class="title">
              <label>持卡人姓名/账户户名</label>
              <span>*</span>
            </div>
            <input type="text"
                   v-model="formData.accountNm"
                   placeholder="请填写持卡人姓名/账户户名">
          </div>
          <div class="list">
            <div class="title">
              <label>{{info.registrant==1?'法人':'授权人'}}真实姓名</label>
            </div>
            <input type="text"
                   v-if="info.registrant==1"
                   v-model="formData.legalPerNm"
                   placeholder="请填写法人姓名">
            <input type="text"
                   v-if="info.registrant==2"
                   v-model="formData.legalPerNm"
                   placeholder="请填写授权人姓名">
          </div>
          <div class="list">
            <div class="title">
              <label>{{info.registrant==1?'法人':'授权人'}}证件号</label>
            </div>
            <input type="text"
                   v-if="info.registrant==1"
                   v-model="formData.legalPerIdNo"
                   placeholder="请填写法人身份证号">
            <input type="text"
                   v-if="info.registrant==2"
                   v-model="formData.legalPerIdNo"
                   placeholder="请填写授权人身份证号">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人1姓名</label>
            </div>
            <input type="text"
                   v-model="formData.agent"
                   placeholder="请填写被授权人1姓名">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人1证件号码</label>
            </div>
            <input type="text"
                   v-model="formData.agentIdNo"
                   placeholder="请填写被授权人1身份证">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人1联系手机号</label>
            </div>
            <input type="text"
                   v-model="formData.agentMbl"
                   placeholder="请填写被授权人1联系手机号">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人2姓名</label>
            </div>
            <input type="text"
                   v-model="formData.authorizer1Nm"
                   placeholder="请填写被授权人2姓名">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人2证件号码</label>
            </div>
            <input type="text"
                   v-model="formData.authorizer1IdNum"
                   placeholder="请填写被授权人2身份证">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人2联系手机号</label>
            </div>
            <input type="text"
                   v-model="formData.authorizer1Mbl"
                   placeholder="请填写被授权人2联系手机号">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人3姓名</label>
            </div>
            <input type="text"
                   v-model="formData.authorizer2Nm"
                   placeholder="请填写被授权人3姓名">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人3证件号码</label>
            </div>
            <input type="text"
                   v-model="formData.authorizer2IdNum"
                   placeholder="请填写被授权人3身份证">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人3联系手机号</label>
            </div>
            <input type="text"
                   v-model="formData.authorizer2Mbl"
                   placeholder="请填写被授权人3联系手机号">
          </div>
        </div>
      </div>
      <div class="four">
        <div class="head">
          <div class="line"></div>
          <span>上传验证资料</span>
        </div>
        <div class="form_four">
          <div class="list">
            <span>营业执照</span>
            <div class="image-one"
                 :style="{backgroundImage: 'url(' + (formData.bussLicenseURL.length>0 ?  formData.bussLicenseURL : require('../../../assets/images/bg_business.png')) + ')'}">
              <div class="icon">
                <van-uploader :after-read="businessRead">
                </van-uploader>
              </div>
            </div>
          </div>

          <div class="list">
            <span>{{info.registrant==1?'法人':'授权人'}}身份证人像面</span>
            <div class="image-three"
                 :style="{backgroundImage: 'url(' + (formData.legalBackURL.length>0 ?  formData.legalBackURL : require('../../../assets/images/bg_idcard_up.png')) + ')'}">
              <div class="icon">
                <van-uploader :after-read="idDownRead">
                </van-uploader>
              </div>
            </div>
          </div>

          <div class="list">
            <span>{{info.registrant==1?'法人':'授权人'}}身份证国徽面</span>
            <div class="image-two"
                 :style="{backgroundImage: 'url(' + (formData.legalFrontURL.length>0 ?  formData.legalFrontURL : require('../../../assets/images/bg_idcard_down.png')) + ')'}">
              <div class="icon">
                <van-uploader :after-read="idUpRead">
                </van-uploader>
              </div>
            </div>
          </div>

          <div class="list">
            <span>授权书</span>
            <div class="image-four"
                 :style="{backgroundImage: 'url(' + (formData.certURL.length>0 ?  formData.certURL : require('../../../assets/images/bg_authorization.png')) + ')'}">
              <div class="icon">
                <van-uploader :after-read="auorRead">
                </van-uploader>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="btn"
           @click="edit()">
        保存修改
      </div>
    </div>
  </div>
</template>

<script>
import company_modify_controller from "./company_modify_controller";
export default company_modify_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#company_modify {
  .content {
    .first {
      background-color: #fff;
      margin-bottom: 0.3rem;

      .head {
        display: flex;
        align-items: center;
        padding-top: 1rem;
        padding-left: 1rem;

        .line {
          width: 0.1875rem;
          height: 0.875rem;
          background-color: #f87070;
          margin-right: 1rem;
        }

        span {
          font-size: 14px;
          color: #f86e6e;
        }
      }

      .form_first {
        .list {
          padding-left: 1rem;
          display: flex;
          align-items: center;
          border-bottom: solid 1px #ccc;

          .act {
            display: flex;
            align-items: center;
            flex: 1;
            justify-content: flex-end;

            .act-people {
              padding: 0.125rem;
              border-radius: 1rem;
              border: solid 1px #f87070;
              margin-right: 1rem;
              display: flex;
              align-items: center;
              justify-content: center;

              span {
                padding: 0.25rem 0.5rem;
                border-radius: 1rem;
                line-height: 1rem;
                font-size: 12px;
                color: #b1b1b1;
              }
            }
          }

          .title {
            margin: 1rem 0;

            label {
              font-size: 12px;
            }

            span {
              color: #f87070;
              display: inline-block;
              vertical-align: top;
            }
          }

          input {
            flex: 1;
            border: none;
            outline: none;
            text-indent: 0.5rem;
          }

          input::-webkit-input-placeholder {
            /* WebKit browsers */

            font-size: 12px;
          }

          input:-moz-placeholder {
            /* Mozilla Firefox 4 to 18 */

            font-size: 12px;
          }

          input::-moz-placeholder {
            /* Mozilla Firefox 19+ */

            font-size: 12px;
          }

          input:-ms-input-placeholder {
            /* Internet Explorer 10+ */

            font-size: 12px;
          }

          .enp {
            display: flex;
            align-items: center;
            flex: 1;
            justify-content: flex-end;

            .enp-choose {
              padding: 0.125rem;
              border-radius: 1rem;
              border: solid 1px #f87070;
              margin-right: 0.2rem;
              display: flex;
              align-items: center;
              justify-content: center;

              span {
                padding: 0.25rem 0.5rem;
                border-radius: 1rem;
                line-height: 1rem;
                font-size: 12px;
                color: #b1b1b1;
              }
            }
          }
        }

        .list:last-child {
          border-bottom: none;
        }
      }
    }

    .four {
      background-color: #fff;
      padding-bottom: 0.5rem;

      .head {
        display: flex;
        align-items: center;
        padding-top: 1rem;
        padding-left: 1rem;
        padding-bottom: 1rem;

        .line {
          width: 0.1875rem;
          height: 0.875rem;
          background-color: #f87070;
          margin-right: 1rem;
        }

        span {
          font-size: 14px;
          color: #f86e6e;
        }
      }

      .list {
        padding-left: 1rem;
        text-align: left;

        .image-one {
          width: 20rem;
          height: 11rem;
          margin: 0 auto;
          margin-top: 1rem;
          margin-bottom: 2rem;
          background-image: url("../../../assets/images/bg_business.png");
          border-radius: 0.5rem;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          .icon {
            width: 4rem;
            height: 4rem;
            background-image: url("../../../assets/images/photo_btn.png");
            background-repeat: no-repeat;
            background-size: cover;

            img {
              width: 100%;
              height: 100%;
            }

            .van-uploader {
              width: 100%;
              height: 100%;
            }
          }
        }

        .image-two {
          width: 20rem;
          height: 11rem;
          margin: 0 auto;
          margin-top: 1rem;
          margin-bottom: 2rem;
          border-radius: 0.5rem;
          background-image: url("../../../assets/images/bg_idcard_up.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          .icon {
            width: 4rem;
            height: 4rem;
            background-image: url("../../../assets/images/photo_btn.png");
            background-repeat: no-repeat;
            background-size: cover;

            img {
              width: 100%;
              height: 100%;
            }

            .van-uploader {
              width: 100%;
              height: 100%;
            }
          }
        }

        .image-three {
          width: 20rem;
          height: 11rem;
          margin: 0 auto;
          margin-top: 1rem;
          margin-bottom: 2rem;
          border-radius: 0.5rem;
          background-repeat: no-repeat;
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          .icon {
            width: 4rem;
            height: 4rem;
            background-image: url("../../../assets/images/photo_btn.png");
            background-repeat: no-repeat;
            background-size: cover;

            img {
              width: 100%;
              height: 100%;
            }

            .van-uploader {
              width: 100%;
              height: 100%;
            }
          }
        }

        .image-four {
          width: 20rem;
          height: 11rem;
          margin: 0 auto;
          margin-top: 1rem;
          margin-bottom: 2rem;
          border-radius: 0.5rem;
          background-position: center;
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          .icon {
            width: 4rem;
            height: 4rem;
            background-image: url("../../../assets/images/photo_btn.png");
            background-repeat: no-repeat;
            background-size: cover;

            img {
              width: 100%;
              height: 100%;
            }

            .van-uploader {
              width: 100%;
              height: 100%;
            }
          }
        }

        .image-five {
          width: 20rem;
          height: 11rem;
          margin: 0 auto;
          margin-top: 1rem;
          margin-bottom: 2rem;
          border-radius: 0.5rem;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          display: flex;
          align-items: center;
          justify-content: center;

          .icon {
            width: 4rem;
            height: 4rem;
            background-image: url("../../../assets/images/photo_btn.png");
            background-repeat: no-repeat;
            background-size: cover;

            img {
              width: 100%;
              height: 100%;
            }

            .van-uploader {
              width: 100%;
              height: 100%;
            }
          }
        }

        .image-six {
          width: 20rem;
          height: 11rem;
          margin: 0 auto;
          margin-top: 1rem;
          border-radius: 0.5rem;
          background-position: center;
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          .icon {
            width: 4rem;
            height: 4rem;
            background-image: url("../../../assets/images/photo_btn.png");
            background-repeat: no-repeat;
            background-size: cover;

            img {
              width: 100%;
              height: 100%;
            }

            .van-uploader {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    .absolute {
      text-align: left;
      padding-left: 1rem;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }

    .btn {
      margin: 0 auto;
      margin-top: 1rem;
      width: 80%;
      display: flex;
      align-items: center;
      color: #fff;
      justify-content: center;
      background-color: #fd5b5b;
      height: 3rem;
    }

    .bg {
      background-color: #f87070;
      color: #fff !important;
    }

    .message {
      font-size: 12px;
      color: #999;
      text-align: left;
      padding-left: 1rem;
    }
  }
}
</style>
