<template>
  <div id="aggregate">
    <c-title :hide="false" text="入网信息"></c-title>
    <div class="agg_content">
      <div class="agg_ope_acc">
        <div class="title">开户信息</div>
        <div class="content">
          <ul>
            <li>
              <van-field
                class="info-list"
                center
                v-model="cardNumber"
                placeholder="请填写结算银行账号或银行卡号"
                :border="false"
              >
                <span slot="label"><i class="xin_icon iconfont icon-info-must"></i>结算银行卡号：</span>
              </van-field>
            </li>
            <li>
              <van-cell-group class="open-bank">
                <van-cell title-style="text-align:left" is-link>
                  <span slot="title"
                    ><i class="xin_icon iconfont icon-info-must" style="color: #f15353; font-size: 0.75rem;"></i
                    >开户行：</span
                  >
                  <span slot="default" @click="bankDepositBtn">{{ bankDepositText }}</span>
                </van-cell>
              </van-cell-group>
            </li>
            <li>
              <van-cell-group class="address-list">
                <van-cell title-style="text-align:left" is-link>
                  <span slot="title">开户行省份：</span>
                  <span slot="default" @click="bankprovinceBtn">{{ bankprovinceText }}</span>
                </van-cell>
              </van-cell-group>
            </li>
            <li>
              <van-cell-group class="address-list">
                <van-cell title-style="text-align:left" is-link>
                  <span slot="title">开户行城市：</span>
                  <span slot="default" @click="bankCityBtn">{{ bankCityText }}</span>
                </van-cell>
              </van-cell-group>
            </li>
            <li>
              <van-cell-group class="address-list">
                <van-cell title-style="text-align:left" is-link>
                  <span slot="title">开户支行：</span>
                  <span slot="default" @click="subbranchBtn">{{ subbranchText }}</span>
                </van-cell>
              </van-cell-group>
            </li>
            <li class="proving">
              <van-field v-model="identifyingCode" center clearable placeholder="请输入验证码">
                <template #button>
                  <van-button
                    type="default"
                    :disabled="btnTag"
                    :color="btnBg"
                    size="small"
                    @click.native="verificationCode"
                    >{{ btnText }}</van-button
                  >
                </template>
              </van-field>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="btn_box">
      <van-button color="#389ef2" type="primary" @click.native="confirmBtn">确认修改</van-button>
      <van-button plain type="info" @click.native="detailsBtn">入网详情</van-button>
    </div>
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
import aggregate_bank_card_setcontroller from './aggregate_bank_card_setcontroller';
export default aggregate_bank_card_setcontroller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#aggregate {
  .agg_content {
    background: #fff;

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

      .content ul {
        li {
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
              margin: 0 auto;
              padding-top: 0.9rem;
              font-size: 12px;
              line-height: 1.25rem;
              color: #8c8c8c;
              padding-bottom: 1.4rem;
            }
          }
          // .sub_btn{
          //     padding-top: 2.5rem;
          //     padding-bottom: 0.625rem;
          //     .yd-btn{
          //         width: 20rem;
          //         height: 2.6rem;
          //     }
          // }
          // .rev_btn{
          //     padding-top: 0.625rem;
          //     padding-bottom: 1.25rem;
          //     .yd-btn{
          //         width: 20rem;
          //         height: 2.6rem;
          //         border: 1px solid #4a7de5;
          //     }
          // }
        }

        .proving {
          .provingbtn {
            min-width: 5.625rem;
            height: 1.625rem;
            line-height: 1.625rem;
            text-align: center;
            border-radius: 1rem;
            color: #f15353;
            background: #ebebeb;
            font-size: 13px;
          }
        }
      }
    }
  }

  .btn_box {
    margin-top: 1.125rem;

    button {
      width: 20.625rem;
      height: 2.625rem;
      border-radius: 0.375rem;
      font-size: 16px;
      margin: 0.375rem auto;
    }

    button:last-child {
      border: solid 0.0625rem #389ef2;
    }
  }
}

#aggregate .info-list /deep/.van-field__label {
  white-space: nowrap;
  margin-left: -0.5rem;

  .xin_icon {
    color: #f15353;
    font-size: 0.75rem;
  }
}

/deep/.van-field__body input::placeholder {
  color: #666;
}

.open-bank .van-cell,
.proving .van-cell {
  padding-left: 10px;
  flex: 0.5;
}

.open-bank .van-cell__value {
  flex: 2.5;
}

.address-list .van-cell__title {
  flex: 0.5;
}

/deep/.van-cell--clickable:active {
  background-color: #fff;
}
</style>
