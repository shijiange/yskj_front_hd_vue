<template>
  <div id="company_logon"
       ref="company_logon">
    <c-title :hide="false"
             text="企业注册"></c-title>
    <div class="content">
      <div class="first">
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
                   v-model="formData.busFullNm"
                   placeholder="与营业执照或者其他资质证明上的名称一致">
          </div>
          <div class="list">
            <div class="title">
              <label>企业简称</label>
            </div>
            <input type="text"
                   v-model="formData.busShortNm"
                   placeholder="请填写简称">
          </div>
          <div class="list">
            <div class="title">
              <label>证件号</label>
            </div>
            <input type="text"
                   v-model="formData.creditCd"
                   placeholder="请填写统一社会信用代码证件号">
          </div>
          <div class="list">
            <div class="title">
              <label>营业范围</label>
            </div>
            <input type="text"
                   v-model="formData.busScope"
                   placeholder="请填写营业范围">
          </div>
          <div class="list">
            <div class="title">
              <label>企业邮箱</label>
            </div>
            <input type="text"
                   v-model="formData.email"
                   placeholder="请填写企业邮箱">
          </div>
          <div class="list">
            <div class="title">
              <label>固定电话</label>
            </div>
            <input type="text"
                   v-model="formData.telphone"
                   placeholder="请填写固定电话">
          </div>
        </div>
      </div>
      <div class="second">
        <div class="head">
          <div class="line"></div>
          <span>身份信息</span>
        </div>
        <span class="remark">(被授权人至少填写1个，至多填写3个,被授权1信息必须与法人或授权人的信息保持一致)</span>
        <div class="form_second">
          <div class="list">
            <div class="title">
              <label>注册人身份</label>
              <span>*</span>
            </div>
            <div class="enp">
              <div class="enp-choose">
                <span v-for="(item,index) in empower"
                      :key="index"
                      @click="chooseEnp(item)"
                      :class="[item.checked?'bg':'']">
                  {{item.name}}
                </span>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="title">
              <label>{{formData.registrant==1?'法人':'授权人'}}姓名</label>
              <span>*</span>
            </div>
            <input type="text"
                   v-if="formData.registrant==1"
                   v-model="formData.legalPerNm"
                   placeholder="请填写法人姓名">
            <input type="text"
                   v-if="formData.registrant==2"
                   v-model="formData.legalPerNm"
                   placeholder="请填写授权人姓名">
          </div>
          <div class="list">
            <div class="title">
              <label>{{formData.registrant==1?'法人':'授权人'}}身份证号</label>
              <span>*</span>
            </div>
            <input type="text"
                   v-if="formData.registrant==1"
                   v-model="formData.legalPerIdNo"
                   placeholder="请填写法人身份证号">
            <input type="text"
                   v-if="formData.registrant==2"
                   v-model="formData.legalPerIdNo"
                   placeholder="请填写授权人身份证号">
          </div>
          <div class="list"
               v-if="formData.registrant==1">
            <div class="title">
              <label>公司注册资金</label>
            </div>
            <input type="text"
                   v-model="formData.busRegCapital"
                   placeholder="请填写公司注册资金">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权1姓名</label>
              <span>*</span>
            </div>
            <input type="text"
                   v-model="formData.agent"
                   placeholder="请填写被授权1姓名">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人1证件号</label>
              <span>*</span>
            </div>
            <input type="text"
                   v-model="formData.agentIdNo"
                   placeholder="请填写被授权人1身份证件号">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人1手机号</label>
              <span>*</span>
            </div>
            <input type="text"
                   v-model="formData.agentMbl"
                   placeholder="填写被授权人1手机号码">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权2姓名</label>
            </div>
            <input type="text"
                   v-model="formData.authorizer1Nm"
                   placeholder="请填写被授权2姓名">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人2证件号</label>
            </div>
            <input type="text"
                   v-model="formData.authorizer1IdNum"
                   placeholder="请填写被授权人2身份证件号">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人2手机号</label>
            </div>
            <input type="text"
                   v-model="formData.authorizer1Mbl"
                   placeholder="填写被授权人2手机号码">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权3姓名</label>
            </div>
            <input type="text"
                   v-model="formData.authorizer2Nm"
                   placeholder="请填写被授权3姓名">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人3证件号</label>
            </div>
            <input type="text"
                   v-model="formData.authorizer2IdNum"
                   placeholder="请填写被授权人3身份证件号">
          </div>
          <div class="list">
            <div class="title">
              <label>被授权人3手机号</label>
            </div>
            <input type="text"
                   v-model="formData.authorizer2Mbl"
                   placeholder="填写被授权人3手机号码">
          </div>
        </div>
      </div>
      <div class="third">
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
              <div class="face-choose">
                <span v-for="(item,index) in face"
                      :key="index"
                      @click="chooseFace(item)"
                      :class="[item.checked?'bg':'']">
                  {{item.name}}
                </span>
              </div>
            </div>
          </div>
          <div class="list">
            <div class="title">
              <label>账户户名</label>
              <span>*</span>
            </div>
            <input type="text"
                   v-model="formData.accountNm"
                   placeholder="请填写账户户名">
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
            <span>{{formData.registrant==1?'法人':'授权人'}}身份证人像面</span>
            <div class="image-three"
                 :style="{backgroundImage: 'url(' + (formData.legalBackURL.length>0 ?  formData.legalBackURL : require('../../../assets/images/bg_idcard_up.png')) + ')'}">
              <div class="icon">
                <van-uploader :after-read="idDownRead">
                </van-uploader>
              </div>
            </div>
          </div>

          <div class="list">
            <span>{{formData.registrant==1?'法人':'授权人'}}身份证国徽面</span>
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
          <div class="list">
            <span>店铺图片</span>
            <div class="image-five"
                 :style="{backgroundImage: 'url(' + (formData.shopURL.length>0 ?  formData.shopURL : require('../../../assets/images/bg_shop.png')) + ')'}">
              <div class="icon">
                <van-uploader :after-read="shopRead">
                </van-uploader>
              </div>
            </div>
          </div>
          <div class="list">
            <span>合作协议文件</span>
            <div class="image-six"
                 :style="{backgroundImage: 'url(' + (formData.contURL.length>0 ?  require('../../../assets/images/file_success.png') : require('../../../assets/images/file_send.png')) + ')'}">
              <div class="icon">
                <van-uploader :after-read="cooperationRead"
                              accept="application/pdf">
                </van-uploader>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn"
           @click="submit()">
        开通
      </div>
    </div>
  </div>
</template>

<script>
import company_logon_controller from "./company_logon_controller";
export default company_logon_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#company_logon {
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
            opacity: 0;
            width: 100%;
            height: 100%;
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
      width: 100%;
      display: flex;
      align-items: center;
      color: #fff;
      justify-content: center;
      background-color: #fd5b5b;
      height: 3rem;
    }
  }

  .bg {
    background-color: #f87070;
    color: #fff !important;
  }

  .remark {
    font-size: 12px;
    color: #999;
    padding-left: 1rem;
    display: block;
    text-align: left;
  }
}
</style>
