<template>
  <div id="aggregate">
    <c-title :hide="false" text="企业注册"></c-title>
    <div class="agg_content">
      <div class="agg_per_inf">
        <div class="title">个人信息</div>
        <div class="content">
          <ul>
            <li>
              <van-field v-model="merchant" placeholder="请填写与营业执照或资质证一直的名称" clearable :border="false">
                <span slot="label"><i class="xin_icon iconfont icon-info-must"></i>商户全称：</span>
              </van-field>
            </li>
            <li>
              <van-field v-model="merAbbre" placeholder="收银台上显示的收款方名称" clearable :border="false">
                <span slot="label"><i class="xin_icon iconfont icon-info-must"></i>商户简称：</span>
              </van-field>
            </li>
            <li class="radio-box">
              <van-cell-group :border="false">
                <van-cell :border="false" center title-class="left-title" value-class="right-value">
                  <span slot="title"><i class="xin_icon iconfont icon-info-must"></i>证件类型：</span>
                  <van-radio-group
                    v-model="radio1"
                    direction="horizontal"
                    slot="default"
                    @change="documentSelection($event)"
                  >
                    <van-radio name="CORP_CODE">营业执照</van-radio>
                    <van-radio name="UNI_CREDIT_CODE">统一社会信用代码证</van-radio>
                  </van-radio-group>
                </van-cell>
              </van-cell-group>
            </li>

            <li>
              <van-field
                v-model="ertificateNmber"
                placeholder="请填写对应的证件类型的证件编号"
                clearable
                :border="false"
              >
                <span slot="label"><i class="xin_icon iconfont icon-info-must"></i>证件号：</span>
              </van-field>
            </li>
            <li>
              <van-field
                v-model="judicialPerson"
                placeholder="请按照证件上的真实姓名准确填写"
                clearable
                :border="false"
              >
                <span slot="label"><i class="xin_icon iconfont icon-info-must"></i>法人名称：</span>
              </van-field>
            </li>
            <li>
              <van-field v-model="personNumber" placeholder="请按照证件上的真实号码准确填写" clearable :border="false">
                <span slot="label"><i class="xin_icon iconfont icon-info-must"></i>法人身份证号：</span>
              </van-field>
            </li>
            <li>
              <van-field v-model="merchantContact" placeholder="请填写商户联系人姓名" clearable :border="false">
                <span slot="label"><i class="xin_icon iconfont icon-info-must"></i>商户联系人：</span>
              </van-field>
            </li>
            <li>
              <van-field v-model="mobileNumber" placeholder="请填写联系人手机号码" clearable :border="false">
                <span slot="label"><i class="xin_icon iconfont icon-info-must"></i>联系人手机号：</span>
              </van-field>
            </li>
            <li>
              <van-field v-model="corporateMailbox" placeholder="请填写联系人邮箱地址信息" clearable :border="false">
                <span slot="label"><i class="xin_icon iconfont icon-info-must"></i>联系人邮箱：</span>
              </van-field>
            </li>
            <li>
              <van-cell-group :border="false">
                <van-cell :border="false" is-link title-class="left-van" center>
                  <span slot="title"><i class="xin_icon iconfont icon-info-must"></i>商户分类：</span>
                  <span slot="default" @click="comtenshowbtn">{{ comtentext }}</span>
                </van-cell>
              </van-cell-group>
            </li>
            <li>
              <van-cell-group :border="false">
                <van-cell :border="false" is-link title-class="left-van" center>
                  <span slot="title"><i class="xin_icon iconfont icon-info-must"></i>所在城市：</span>
                  <span slot="default" @click="cityshowbtn">{{ citytext }}</span>
                </van-cell>
              </van-cell-group>
            </li>
            <li>
              <van-field v-model="detaAddress" placeholder="街道楼牌号等" clearable :border="false">
                <span slot="label"><i class="xin_icon iconfont icon-info-must"></i>详细地址：</span>
              </van-field>
            </li>
            <li>
              <van-field
                v-model="registNumber"
                placeholder="选择证件类型为“营业执照，则必填”"
                clearable
                :border="false"
              >
                <span slot="label" style="padding-left: 10px;">税务登记编号：</span>
              </van-field>
            </li>
            <li>
              <van-field v-model="accPermitNumber" placeholder="请填写开户许可证编号" clearable :border="false">
                <span slot="label"><i class="xin_icon iconfont icon-info-must"></i>开户许可证编号：</span>
              </van-field>
            </li>
          </ul>
        </div>
      </div>
      <div class="agg_organize">
        <div class="title">组织机构信息</div>
        <div class="content">
          <ul>
            <li>
              <van-field
                v-model="codeEvidence"
                placeholder="选择证件类型为“营业执照，则必填”"
                clearable
                :border="false"
              >
                <span slot="label" style="padding-left: 10px;">代码证：</span>
              </van-field>
            </li>
            <li class="radio_left radio-box">
              <van-cell-group :border="false">
                <van-cell :border="false" center title-class="left-title" value-class="right-value text-right">
                  <span slot="title" style="padding-left: 10px;">代码证是否长期有效：</span>
                  <van-radio-group v-model="radio2" direction="horizontal" slot="default">
                    <van-radio :name="true">是</van-radio>
                    <van-radio :name="false">否</van-radio>
                  </van-radio-group>
                </van-cell>
              </van-cell-group>
            </li>
            <li>
              <van-cell-group :border="false">
                <van-cell :border="false" is-link title-class="left-van" center>
                  <span slot="title" style="padding-left: 10px;">代码证有效期：</span>
                  <span slot="default" @click="seleStartTime" style="font-size: 13px;">{{ startTime }}</span>
                </van-cell>
              </van-cell-group>
            </li>
          </ul>
        </div>
      </div>
      <div class="agg_ope_acc">
        <div class="title">开户信息</div>
        <div class="content">
          <ul>
            <li>
              <van-field v-model="cardNumber" placeholder="请填写结算银行账号或银行卡号" clearable :border="false">
                <span slot="label"><i class="xin_icon iconfont icon-info-must"></i>结算银行卡号：</span>
              </van-field>
            </li>
            <li>
              <van-cell-group :border="false">
                <van-cell :border="false" is-link title-class="left-van" center>
                  <span slot="title"><i class="xin_icon iconfont icon-info-must"></i>开户行：</span>
                  <span slot="default" @click="bankDepositBtn" style="font-size: 13px;">{{ bankDepositText }}</span>
                </van-cell>
              </van-cell-group>
            </li>
            <li>
              <van-cell-group :border="false">
                <van-cell :border="false" is-link title-class="left-van" center>
                  <span slot="title"><i class="xin_icon iconfont icon-info-must"></i>开户行省份：</span>
                  <span slot="default" @click="bankprovinceBtn" style="font-size: 13px;">{{ bankprovinceText }}</span>
                </van-cell>
              </van-cell-group>
            </li>
            <li>
              <van-cell-group :border="false">
                <van-cell :border="false" is-link title-class="left-van" center>
                  <span slot="title"><i class="xin_icon iconfont icon-info-must"></i>开户行城市：</span>
                  <span slot="default" @click="bankCityBtn" style="font-size: 13px;">{{ bankCityText }}</span>
                </van-cell>
              </van-cell-group>
            </li>
            <li>
              <van-cell-group :border="false">
                <van-cell :border="false" is-link title-class="left-van" center>
                  <span slot="title"><i class="xin_icon iconfont icon-info-must"></i>开户支行：</span>
                  <span slot="default" @click="subbranchBtn" style="font-size: 13px;">{{ subbranchText }}</span>
                </van-cell>
              </van-cell-group>
            </li>
            <li>
              <div class="agg_aud_vid">
                <div class="vid_title"><i class="xin_icon iconfont icon-info-must"></i>资质影印件信息：</div>
                <div class="vid_content">
                  <div class="left">
                    <div class="add_photo">
                      <van-uploader :after-read="onfrontRead">
                        <img :style="imageUrl ? 'display: block;' : 'display: none;'" :src="imageUrl" />
                      </van-uploader>
                    </div>
                    <h3><i class="xin_icon iconfont icon-info-must"></i>上传法人身份证正面</h3>
                  </div>
                  <div class="right">
                    <div class="add_photo">
                      <van-uploader :after-read="reverseRead">
                        <img :style="imageUrl_1 ? 'display: block;' : 'display: none;'" :src="imageUrl_1" />
                      </van-uploader>
                    </div>
                    <h3><i class="xin_icon iconfont icon-info-must"></i>上传法人身份证反面</h3>
                  </div>
                </div>
                <div class="vid_content">
                  <div class="left">
                    <div class="add_photo">
                      <van-uploader :after-read="accountRead">
                        <img :style="imageUrl_6 ? 'display: block;' : 'display: none;'" :src="imageUrl_6" />
                      </van-uploader>
                    </div>
                    <h3><i class="xin_icon iconfont icon-info-must"></i>上传银行开户许可证</h3>
                  </div>
                  <div class="right">
                    <div class="add_photo">
                      <van-uploader :after-read="certificateRead">
                        <img :style="imageUrl_3 ? 'display: block;' : 'display: none;'" :src="imageUrl_3" />
                      </van-uploader>
                    </div>
                    <h3><i class="xin_icon iconfont icon-info-must"></i>上传税务登记证</h3>
                  </div>
                </div>
                <div class="vid_content">
                  <div class="left">
                    <div class="add_photo">
                      <van-uploader :after-read="frameworkRead">
                        <img :style="imageUrl_4 ? 'display: block;' : 'display: none;'" :src="imageUrl_4" />
                      </van-uploader>
                    </div>
                    <h3><i class="xin_icon iconfont icon-info-must"></i>上传组织机构代码证</h3>
                  </div>
                  <div class="right" v-if="business">
                    <div class="add_photo">
                      <van-uploader :after-read="licenceeRead">
                        <img :style="imageUrl_2 ? 'display: block;' : 'display: none;'" :src="imageUrl_2" />
                      </van-uploader>
                    </div>
                    <h3><i class="xin_icon iconfont icon-info-must"></i>上传营业执照</h3>
                  </div>
                  <div class="right" v-if="!business">
                    <div class="add_photo">
                      <van-uploader :after-read="applicationRead">
                        <img :style="imageUrl_5 ? 'display: block;' : 'display: none;'" :src="imageUrl_5" />
                      </van-uploader>
                    </div>
                    <h3><i class="xin_icon iconfont icon-info-must"></i>上传统一社会应用代码证</h3>
                  </div>
                </div>
                <div class="vid_content">
                  <div class="left">
                    <div class="add_photo">
                      <van-uploader :after-read="peopleRead">
                        <img :style="imageUrl_7 ? 'display: block;' : 'display: none;'" :src="imageUrl_7" />
                      </van-uploader>
                    </div>
                    <h3><i class="xin_icon iconfont icon-info-must"></i>法人手持营业执照及身份证</h3>
                  </div>
                </div>
                <div class="vid_message">
                  需要上传包括：”法人身份证正面“、”法人身份证反面“、“营业执照“、“税务登记证”、“组织机构代码证”、“统一社会应用代码证”、“银行开户许可证”，“法人手持营业执照及身份证”。
                </div>
              </div>
            </li>
            <li>
              <div class="agg_aud_vid" style="padding-bottom: 1rem;">
                <div class="vid_title">
                  其他资质（最多5张）：
                </div>
                <div class="vid_content">
                  <div style="display: flex; flex-wrap: wrap;">
                    <div class="imgflex">
                      <div v-for="(val, index) in imageShowUrlData_8" :key="index">
                        <div class="photobox">
                          <img :src="val" style="width: 100%;" />
                          <i @click="removeImg_1(index)"></i>
                        </div>
                      </div>
                      <van-uploader :after-read="multipleMethod_1" multiple v-if="imageShowUrlData_8.length < 5">
                        <div
                          style="padding: 0.2rem; width: 5rem; height: 5rem; border: 1px dashed #c0ccda; margin: 0 auto; display: flex;"
                        >
                          <img src="../../../assets/images/up_icon.png" style="width: 50%; height: 50%;" class="avatar" />
                        </div>
                      </van-uploader>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="sub_btn" @click="individual">
      <van-button color="#389ef2" type="primary">提交</van-button>
    </div>
    <van-popup v-model="comtenshow" position="bottom" :overlay="true">
      <van-picker
        :show-toolbar="true"
        @change="comtlistbtn"
        :columns="comtcolumns"
        :loading="comtLoad"
        @confirm="comtconbtn"
        @cancel="comtcancelbtn"
      />
    </van-popup>
    <van-popup v-model="cityshow" position="bottom" :overlay="true">
      <van-picker
        :show-toolbar="true"
        @change="citylistbtn"
        :columns="citycolumns"
        :loading="cityLoad"
        @confirm="cityconbtn"
        @cancel="citycancelbtn"
      />
    </van-popup>
    <van-popup v-model="dateshow_1" position="bottom" :overlay="true">
      <van-datetime-picker v-model="value1" type="date" @confirm="confirmbtn" @cancel="cancelbtn" />
    </van-popup>
    <van-popup v-model="bankDepositshow" position="bottom" :overlay="true">
      <van-picker
        :show-toolbar="true"
        @change="banklistbtn"
        :columns="bankDepcolumns"
        :loading="bankDeploading"
        @confirm="bankconbtn"
        @cancel="bankcancelbtn"
      />
    </van-popup>
    <van-popup v-model="bankprovinceShow" position="bottom" :overlay="true">
      <van-picker
        :show-toolbar="true"
        @change="bankprovincelistbtn"
        :columns="bankprovcolumns"
        :loading="bankprovloading"
        @confirm="bankprovinceconbtn"
        @cancel="bankprovincecancelbtn"
      />
    </van-popup>
    <van-popup v-model="bankCityShow" position="bottom" :overlay="true">
      <van-picker
        :show-toolbar="true"
        @change="bankCitylistbtn"
        :columns="bankcitycolumns"
        :loading="bankcityloading"
        @confirm="bankCitybtn"
        @cancel="bankCitycancelbtn"
      />
    </van-popup>
    <van-popup v-model="subbranchShow" position="bottom" :overlay="true">
      <van-picker
        :show-toolbar="true"
        @change="subbranchlistbtn"
        :columns="subbranchcolumns"
        :loading="subbranchloading"
        @confirm="subbranchbtn"
        @cancel="subbranchcancelbtn"
      />
    </van-popup>
  </div>
</template>

<script>
import company_edit_controller from './company_edit_controller';

export default company_edit_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#aggregate {
  .xin_icon {
    color: #f15353;
    // margin-left: -1rem;
    font-size: 0.75rem;
  }

  .agg_content {
    background: #fff;

    .agg_per_inf {
      .title {
        background: #f5f5f5;
        height: 2.25rem;
        line-height: 2.25rem;
        text-align: left;
        padding-left: 0.8rem;
        font-weight: bold;
        color: #333;
        font-size: 16px;
      }

      .content ul li .yd-cell-box {
        // border-bottom: 1px solid #ebebeb;
        margin-bottom: 0;

        .yd-cell-item {
          padding-left: 1.5rem;

          .yd-cell-left {
            span {
              position: relative;
            }
          }
        }
      }

      .content ul li:nth-last-of-type(1) .yd-cell-box {
        border: none;
      }
    }

    .agg_organize {
      .title {
        height: 2.25rem;
        line-height: 2.25rem;
        text-align: left;
        padding-left: 0.8rem;
        font-weight: bold;
        color: #333;
        font-size: 1rem;
      }

      .content ul li .yd-cell-box {
        // border-bottom: 1px solid #ebebeb;
        margin-bottom: 0;

        .yd-cell-item {
          padding-left: 1.5rem;

          .yd-cell-left {
            span {
              position: relative;

              .xin_icon {
                color: #f15353;
                // margin-left: -1rem;
                font-size: 0.75rem;
              }
            }
          }
        }
      }

      .content ul li:nth-last-of-type(1) .yd-cell-box {
        border: none;
      }
    }

    .agg_ope_acc {
      .title {
        background: #f5f5f5;
        height: 2.25rem;
        line-height: 2.25rem;
        text-align: left;
        padding-left: 0.8rem;
        font-weight: bold;
        color: #333;
        font-size: 16px;
      }

      .content ul li {
        .yd-cell-box {
          // border-bottom: 1px solid #ebebeb;
          margin-bottom: 0;

          .yd-cell-item {
            padding-left: 1.5rem;

            .yd-cell-left {
              span {
                position: relative;

                .xin_icon {
                  color: #f15353;
                  margin-left: -1rem;
                  font-size: 0.75rem;
                }
              }
            }
          }
        }

        .agg_aud_vid {
          border-bottom: 0.0625rem solid #ebebeb;

          .imgflex {
            display: flex;
            flex-wrap: wrap;
            margin: 1rem;

            .photobox {
              position: relative;
              width: 5rem;
              height: 5rem;
              border: 1px dashed #c0ccda;
              margin-right: 0.2rem;
              margin-bottom: 0.2rem;

              img {
                width: 100%;
                height: 100%;
              }

              i {
                width: 1.2rem;
                height: 1.2rem;
                position: absolute;
                top: 0.1rem;
                right: 0.1rem;
                background: url('../../../assets/images/close_iocn.png');
                background-size: 100%;
              }
            }
          }

          .vid_title {
            height: 3.12rem;
            line-height: 3.12rem;
            text-align: left;
            padding-left: 1rem;

            .xin_icon {
              color: #f15353;
              margin-left: -0.5rem;
              font-size: 0.75rem;
            }
          }

          .vid_content {
            display: flex;
            justify-content: space-around;

            img {
              width: 100%;
              height: 5rem;
            }

            .left {
              .add_photo {
                width: 8.8rem;
                height: 5rem;
                border: 0.0625rem solid #319ff8;
                border-radius: 0.3125rem;
                background: url('../../../assets/images/agg_add_icon.png') no-repeat center center;
                background-size: 1.8rem 1.8rem;

                .van-uploader {
                  width: 100%;
                  height: 5rem;
                }
              }

              h3 {
                height: 1.56rem;
                line-height: 1.56rem;
                font-size: 12px;
              }
            }

            .right {
              .add_photo {
                width: 8.8rem;
                height: 5rem;
                border: 0.0625rem solid #319ff8;
                border-radius: 0.3125rem;
                background: url('../../../assets/images/agg_add_icon.png') no-repeat center center;
                background-size: 1.8rem 1.8rem;

                .van-uploader {
                  width: 100%;
                  height: 5rem;
                }
              }

              h3 {
                height: 1.56rem;
                line-height: 1.56rem;
                font-size: 12px;
              }
            }
          }

          .vid_message {
            width: 20rem;
            margin: 0.625rem auto;
            padding: 0.625rem 0.25rem;
            font-size: 12px;
            line-height: 1.25rem;
            color: #8c8c8c;
            background: #fafafa;
            border-radius: 0.25rem;
          }
        }
      }
    }
  }

  .sub_btn {
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;

    button {
      width: 20.625rem;
      height: 2.625rem;
      border-radius: 0.375rem;
      font-size: 16px;
    }
  }
}

#aggregate {
  .xin_icon {
    color: #f15353;
    margin-left: 5px;
    font-size: 0.75rem;
  }

  .van-cell {
    padding-left: 6px;
    padding-right: 6px;
  }

  /deep/.van-field__label {
    margin-right: 0;
    white-space: nowrap;
    width: auto;

    span {
      color: #333;
    }
  }

  /deep/.van-field__body input::-webkit-input-placeholder {
    color: #666;
  }

  .left-van {
    text-align: left;
    white-space: nowrap;
    flex: none;
  }

  .left-title {
    flex: none;
    text-align: left;
    white-space: nowrap;
  }

  .right-value {
    // display: flex;
    /deep/.van-radio-group {
      white-space: nowrap;

      .van-radio__icon {
        float: left;
      }
    }
  }

  .text-right > .van-radio-group {
    float: right;
  }

  .van-cell__value {
    width: 100%;
  }

  /deep/.van-cell--clickable:active {
    background-color: #fff;
  }
}
</style>
