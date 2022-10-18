<template>
  <div id="checking"
       ref="checking">
    <c-title :hide="false"
             :text="title"></c-title>
    <div class="content">
      <div class="first"
           v-if="formData.platRoleID=='001'">
        <div class="head">
          <div class="line"></div>
          <span>个人信息</span>
        </div>
        <div class="form_first">
          <div class="list">
            <div class="title">
              <label>姓名</label>
              <span>*</span>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.realNm">
          </div>
          <div class="list">
            <div class="title">
              <label>证件号</label>
              <span>*</span>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.idNo">
          </div>
          <div class="list">
            <div class="title">
              <label>联系人</label>
              <span>*</span>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.contacts">
          </div>
          <div class="list">
            <div class="title">
              <label>邮箱</label>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.email">
          </div>
          <div class="list">
            <div class="title">
              <label>固定电话</label>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.telphone">
          </div>
          <div class="list">
            <div class="title">
              <label>地址</label>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.address">
          </div>
        </div>
      </div>
      <div class="first"
           v-if="formData.platRoleID!='001'">
        <div class="head">
          <div class="line"></div>
          <span>企业信息</span>
        </div>
        <div class="form_first">
          <div class="list">
            <div class="title">
              <label>企业全称</label>
              <span>*</span>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.busFullNm">
          </div>
          <div class="list">
            <div class="title">
              <label>企业简称</label>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.busShortNm">
          </div>
          <div class="list">
            <div class="title">
              <label>证件号</label>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.creditCd">
          </div>
          <div class="list">
            <div class="title">
              <label>营业范围</label>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.busScope">
          </div>
          <div class="list">
            <div class="title">
              <label>企业邮箱</label>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.email">
          </div>
          <div class="list">
            <div class="title">
              <label>固定电话</label>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.telphone">
          </div>
        </div>
      </div>
      <div class="second"
           v-if="formData.platRoleID!='001'">
        <div class="head">
          <div class="line"></div>
          <span>身份信息</span>
        </div>
        <div class="form_second">
          <div class="list">
            <div class="title">
              <label>注册人身份</label>
              <span>*</span>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.registrant">
          </div>
          <div class="list">
            <div class="title">
              <label>{{formData.registrant==1?'法人':'授权人'}}姓名</label>
              <span>*</span>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.legalPerNm">
          </div>
          <div class="list">
            <div class="title">
              <label>{{formData.registrant==1?'法人':'授权人'}}身份证号</label>
              <span>*</span>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.legalPerIdNo">
          </div>
          <div class="list"
               v-if="formData.registrant==1">
            <div class="title">
              <label>公司注册资金</label>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.busRegCapital">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权1姓名</label>
              <span>*</span>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.agent">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人1证件号</label>
              <span>*</span>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.agentIdNo">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人1手机号</label>
              <span>*</span>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.agentMbl">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权2姓名</label>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.authorizer1Nm">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人2证件号</label>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.authorizer1IdNum">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人2手机号</label>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.authorizer1Mbl">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权3姓名</label>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.authorizer2Nm">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人3证件号</label>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.authorizer2IdNum">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人3手机号</label>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.authorizer2Mbl">
          </div>
        </div>
      </div>
      <div class="third"
           v-if="formData.platRoleID!='001'">
        <div class="head">
          <div class="line"></div>
          <span>账户信息</span>
        </div>
        <div class="form_third">
          <div class="list">
            <div class="title">
              <label>账户类型</label>
              <span>*</span>
            </div>
            <div class="face">
              <input type="text"
                     disabled="true"
                     v-model="formData.accType">
            </div>
          </div>
          <div class="list">
            <div class="title">
              <label>账户户名</label>
              <span>*</span>
            </div>
            <input type="text"
                   disabled="true"
                   v-model="formData.accountNm">
          </div>
        </div>
      </div>
      <div class="four"
           v-if="formData.platRoleID!='001'">
        <div class="head">
          <div class="line"></div>
          <span>上传验证资料</span>
        </div>
        <div class="form_four">
          <div class="list"
               v-if="formData.bussLicense">
            <span>营业执照</span>
            <div class="image-one"
                 :style="{backgroundImage: 'url(' + (formData.bussLicense ?  formData.bussLicense.bussLicenseURL : require('../../../assets/images/bg_business.png')) + ')'}">
            </div>
          </div>
          <div class="list"
               v-if="formData.legalFront">
            <span>法人身份证正面</span>
            <div class="image-two"
                 :style="{backgroundImage: 'url(' + (formData.legalFront ?  formData.legalFront.legalFrontURL : require('../../../assets/images/bg_idcard_up.png')) + ')'}">
            </div>
          </div>
          <div class="list"
               v-if="formData.legalBack">
            <span>法人身份证反面</span>
            <div class="image-three"
                 :style="{backgroundImage: 'url(' + (formData.legalBack ?  formData.legalBack.legalBackURL : require('../../../assets/images/bg_idcard_down.png')) + ')'}">
            </div>
          </div>
          <div class="list"
               v-if="formData.cert">
            <span>授权书</span>
            <div class="image-four"
                 :style="{backgroundImage: 'url(' + (formData.cert ?  formData.cert.certURL : require('../../../assets/images/bg_authorization.png')) + ')'}">

            </div>
          </div>
          <div class="list"
               v-if="formData.shop">
            <span>店铺图片</span>
            <div class="image-five"
                 :style="{backgroundImage: 'url(' + (formData.shop ?  formData.shop.shopURL : require('../../../assets/images/bg_shop.png')) + ')'}">

            </div>
          </div>
          <div class="list"
               v-if="formData.cont">
            <span>合作协议文件</span>
            <div class="image-six"
                 :style="{backgroundImage: 'url(' + (formData.cont?   require('../../../assets/images/file_success.png') : require('../../../assets/images/file_send.png')) + ')'}">
            </div>
          </div>
        </div>
      </div>
      <div class="btn">
        审核中
      </div>
    </div>
  </div>
</template>

<script>
import checking_controller from "./checking_controller";
export default checking_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#checking {
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
        font-size: 12px;

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
            color: #999;
            text-align: right;
            padding-right: 1rem;
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
        }

        .list:last-child {
          border-bottom: none;
        }
      }
    }

    .second {
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

      .form_second {
        font-size: 12px;

        .list {
          padding-left: 1rem;
          display: flex;
          align-items: center;
          border-bottom: solid 1px #ccc;

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
            color: #999;
            text-align: right;
            padding-right: 1rem;
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
        }

        .list:last-child {
          border-bottom: none;
        }
      }
    }

    .third {
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

      .form_third {
        font-size: 12px;

        .list {
          padding-left: 1rem;
          display: flex;
          align-items: center;
          border-bottom: solid 1px #ccc;

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
            color: #999;
            text-align: right;
            padding-right: 1rem;
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

          .face {
            display: flex;
            align-items: center;
            flex: 1;
            justify-content: flex-end;

            .face-choose {
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
          background-position: center;
          border-radius: 0.5rem;
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

        .image-two {
          width: 20rem;
          height: 11rem;
          margin: 0 auto;
          margin-top: 1rem;
          margin-bottom: 2rem;
          border-radius: 0.5rem;
          background-image: url("../../../assets/images/bg_idcard_up.png");
          background-repeat: no-repeat;
          background-position: center;
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

        .image-three {
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

        .image-four {
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
      }
    }

    .btn {
      margin: 0 auto;
      margin-top: 1rem;
      margin-bottom: 1rem;
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
  }
}
</style>
