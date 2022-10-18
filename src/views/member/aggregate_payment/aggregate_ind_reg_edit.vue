<template>
  <div id="aggregate">
    <c-title :hide="false" text="个人注册"></c-title>
    <div class="agg_content">
      <div class="agg_per_inf">
        <div class="title">个人信息</div>
        <div class="content">
          <ul>
            <li>
              <van-field
                v-model="lePerName"
                placeholder="请按照证件上的真实姓名填写"
                readonly
                clearable
                :border="false"
              >
                <span slot="label"><i class="xin_icon iconfont icon-info-must"></i>法人姓名：</span>
              </van-field>
            </li>
            <li>
              <van-field v-model="lePerstatus" placeholder="请按照证件上的真实号码填写" clearable :border="false">
                <span slot="label"><i class="xin_icon iconfont icon-info-must"></i>法人身份证号：</span>
              </van-field>
            </li>

            <li>
              <van-field v-model="lePerphone" placeholder="为方便请认真填写真实码号" clearable :border="false">
                <span slot="label"><i class="xin_icon iconfont icon-info-must"></i>商户法人手机：</span>
              </van-field>
            </li>
            <li>
              <van-field v-model="lePerpostbox" placeholder="请填写真实邮箱地址信息" clearable :border="false">
                <span slot="label"><i class="xin_icon iconfont icon-info-must"></i>法人邮箱：</span>
              </van-field>
            </li>
            <li>
              <van-cell-group :border="false">
                <van-cell :border="false" is-link title-class="left-van">
                  <span slot="title"><i class="xin_icon iconfont icon-info-must"></i>商户分类：</span>
                  <span slot="default" @click="comtenshowbtn">{{ comtentext }}</span>
                </van-cell>
              </van-cell-group>
            </li>
            <li>
              <van-cell-group :border="false">
                <van-cell :border="false" is-link title-class="left-van">
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
              <van-field v-model="businScope" placeholder="请填写商户经营范围" clearable :border="false">
                <span slot="label"><i class="xin_icon iconfont icon-info-must"></i>商户经营范围：</span>
              </van-field>
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
                <van-cell :border="false" is-link title-class="left-van">
                  <span slot="title"><i class="xin_icon iconfont icon-info-must"></i>开户行：</span>
                  <span slot="default" @click="bankDepositBtn">{{ bankDepositText }}</span>
                </van-cell>
              </van-cell-group>
            </li>
            <li>
              <van-cell-group :border="false">
                <van-cell :border="false" is-link title-class="left-van">
                  <span slot="title"><i class="xin_icon iconfont icon-info-must"></i>开户行省份：</span>
                  <span slot="default" @click="bankprovinceBtn">{{ bankprovinceText }}</span>
                </van-cell>
              </van-cell-group>
            </li>
            <li>
              <van-cell-group :border="false">
                <van-cell :border="false" is-link title-class="left-van">
                  <span slot="title"><i class="xin_icon iconfont icon-info-must"></i>开户行城市：</span>
                  <span slot="default" @click="bankCityBtn">{{ bankCityText }}</span>
                </van-cell>
              </van-cell-group>
            </li>
            <li>
              <van-cell-group :border="false">
                <van-cell :border="false" is-link title-class="left-van">
                  <span slot="title"><i class="xin_icon iconfont icon-info-must"></i>开户支行：</span>
                  <span slot="default" @click="subbranchBtn">{{ subbranchText }}</span>
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
                        <img
                          :style="imageUrl ? 'display: block;' : 'display: none;'"
                          style="width: 100%; height: 100%;"
                          :src="imageUrl"
                        />
                      </van-uploader>
                    </div>
                    <h3>上传法人身份证正面</h3>
                  </div>
                  <div class="right">
                    <div class="add_photo">
                      <van-uploader :after-read="reverseRead">
                        <img
                          :style="imageUrl_1 ? 'display: block;' : 'display: none;'"
                          style="width: 100%; height: 100%;"
                          :src="imageUrl_1"
                        />
                      </van-uploader>
                    </div>
                    <h3>上传法人身份证反面</h3>
                  </div>
                </div>
                <div class="vid_content">
                  <div class="left">
                    <div class="add_photo">
                      <van-uploader :after-read="creditCardRead">
                        <img
                          :style="imageUrl_2 ? 'display: block;' : 'display: none;'"
                          style="width: 100%; height: 100%;"
                          :src="imageUrl_2"
                        />
                      </van-uploader>
                    </div>
                    <h3>上传结算银行卡</h3>
                  </div>
                  <div class="right">
                    <div class="add_photo">
                      <van-uploader :after-read="handstatusRead">
                        <img
                          :style="imageUrl_3 ? 'display: block;' : 'display: none;'"
                          style="width: 100%; height: 100%;"
                          :src="imageUrl_3"
                        />
                      </van-uploader>
                    </div>
                    <h3>上传手持身份证</h3>
                  </div>
                </div>
                <div class="vid_content">
                  <div class="left">
                    <div class="add_photo">
                      <van-uploader :after-read="handcreditCardRead">
                        <img
                          :style="imageUrl_4 ? 'display: block;' : 'display: none;'"
                          style="width: 100%; height: 100%;"
                          :src="imageUrl_4"
                        />
                      </van-uploader>
                    </div>
                    <h3>上传手持银行卡</h3>
                  </div>
                  <div class="right" style="width: 8.8rem; height: 5rem;"></div>
                </div>
                <div class="vid_message">
                  需要上传包括：”法人身份证正面“、”法人身份证反面“、“结算银行卡“、“手持身份证”、“手持银行卡”。
                </div>
              </div>
            </li>
            <li>
              <van-field v-model="mercAbbre" placeholder="请填写商户简称" readonly clearable :border="false">
                <span slot="label"><i class="xin_icon iconfont icon-info-must"></i>商户简称：</span>
              </van-field>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div @click="individual" class="sub_btn">
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
    <van-popup v-model="bankDepositshow" :lazy-render="false" position="bottom" :overlay="true">
      <van-picker
        :show-toolbar="true"
        ref="banklist_sele"
        @change="banklistbtn"
        :columns="bankDepcolumns"
        :loading="bankDeploading"
        @confirm="bankconbtn"
        @cancel="bankcancelbtn"
      />
    </van-popup>
    <van-popup v-model="bankprovinceShow" :lazy-render="false" position="bottom" :overlay="true">
      <van-picker
        :show-toolbar="true"
        ref="bankprovince_sele"
        @change="bankprovincelistbtn"
        :columns="bankprovcolumns"
        :loading="bankprovloading"
        @confirm="bankprovinceconbtn"
        @cancel="bankprovincecancelbtn"
      />
    </van-popup>
    <van-popup v-model="bankCityShow" :lazy-render="false" position="bottom" :overlay="true">
      <van-picker
        :show-toolbar="true"
        ref="bankCity_sele"
        @change="bankCitylistbtn"
        :columns="bankcitycolumns"
        :loading="bankcityloading"
        @confirm="bankCitybtn"
        @cancel="bankCitycancelbtn"
      />
    </van-popup>
    <van-popup v-model="subbranchShow" :lazy-render="false" position="bottom" :overlay="true">
      <van-picker
        :show-toolbar="true"
        ref="subbranch_sele"
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
import aggregate_Ind_regcontroller_edit from './aggregate_ind_reg_editcontroller';
export default aggregate_Ind_regcontroller_edit;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#aggregate {
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
        //   border-bottom: 0.0625rem solid #ebebeb;
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
          //   border-bottom: 1px solid #ebebeb;
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
    // margin-left: -1rem;
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
    flex: 0.3;
  }

  /deep/.van-cell--clickable:active {
    background-color: #fff;
  }
}
</style>
