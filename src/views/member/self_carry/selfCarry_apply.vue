<!-- 自提点申请 页面组件 -->
<template>
  <div id="selfCarry_apply">
    <div class="supplier">
      <c-title :hide="false" :text="`${diyName}申请`"></c-title>
      <div class="banner" v-if="!fun.isTextEmpty(bannerImg)">
        <img :src="bannerImg" />
      </div>
      <div class="main" v-if="o2o_status == 1">
        <!-- 填写申请信息 -->

        <van-cell-group :border="false" class="store_apply van-group" style="margin-bottom: 10px;">
          <van-cell :border="false" class="otherTitle" center title-class="top-title">
            <span slot="title">账号信息</span>
          </van-cell>
          <van-cell :border="false" center>
            <span slot="title">登录账号 <em>*</em></span>
            <input slot="default" type="text" placeholder="账号" v-model="apply.username" />
          </van-cell>
          <van-cell :border="false" center>
            <span slot="title">登录密码 <em>*</em></span>
            <input slot="default" type="password" placeholder="密码" v-model="apply.password" />
          </van-cell>
          <span id="tips" v-if="pass_safe == 1"
            >密码至少8-16个字符，至少1个大写字母，1个小写字母和1个数字，其他可以是任意字符</span
          >
          <van-cell :border="false" center>
            <span slot="title">姓名 <em>*</em></span>
            <input slot="default" type="text" placeholder="姓名" v-model="apply.realname" />
          </van-cell>
          <van-cell :border="false" center>
            <span slot="title">手机号 <em>*</em></span>
            <input slot="default" type="number" placeholder="手机号" v-model="apply.mobile" />
          </van-cell>
          <van-cell :border="false" center v-if="merchantsCommissoner.turnOn">
            <span slot="title">{{ merchantsCommissoner.fieldName }}</span>
            <input slot="default" type="number" :placeholder="`请输入${merchantsCommissoner.fieldName}`" v-model="merchantsCommissoner.investor_uid" @input="inputMerchantsCommissonerUid" />
          </van-cell>
          <div class="van-ellipsis" style="position: relative; z-index: 1; margin-top: -10px; padding: 5px 12px; text-align: left;" v-if="merchantsCommissoner.inputUserData&&merchantsCommissoner.turnOn" v-show="merchantsCommissoner.inputUserData!==null" >昵称：{{ merchantsCommissoner.inputUserData.nickname }}</div>
          <h3>注：账号/密码用于您登录PC端管理后台，请务必牢记！</h3>
        </van-cell-group>

        <van-cell-group :border="false" class="store_apply van-group" style="margin-bottom: 10px;">
          <van-cell :border="false" class="otherTitle" center title-class="top-title">
            <span slot="title">提货点信息</span>
          </van-cell>
          <van-cell :border="false" center>
            <span slot="title">提货点名称 <em>*</em></span>
            <input slot="default" type="text" placeholder="提货点名称" v-model="apply.deliver_name" />
          </van-cell>

          <van-cell :border="false" center is-link>
            <span slot="title">所在城市 <em>*</em></span>
            <input
              slot="default"
              type="text"
              @click.stop="addressShow = true"
              v-model="addressName"
              readonly
              placeholder="请选择城市"
            />
          </van-cell>

          <van-cell :border="false" center is-link v-if="strShow">
            <span slot="title">街道 <em>*</em></span>
            <input
              slot="default"
              type="text"
              @click.stop="streetShow = true"
              v-model="street"
              readonly
              placeholder="请选择街道"
            />
          </van-cell>

          <van-cell :border="false" center>
            <span slot="title">详细地址 <em>*</em></span>
            <input slot="default" type="text" v-model="apply.address" placeholder="街道楼排号等" />
          </van-cell>

          <van-cell :border="false" center>
            <span slot="title">地理位置 <em>*</em></span>
            <span slot="default" style="display: flex; justify-content: flex-end; align-items: center;">
              <div class="addressDiv" style="text-align: right;">
                {{ addressInfo }}
              </div>
              <i class="iconfont icon-dingwei" style="color: #f86e6e; padding-right: 0.25rem;"></i>
              <div class="" style="" @click="toGeolocation">
                {{ addressInfo ? '切换' : '自动定位' }}
              </div>
            </span>
          </van-cell>

          <van-cell is-link :border="false" @click="startTimeTag = true">
            <span slot="title" class="blod-text">营业开始时间<em>*</em></span>
            <span slot="default">{{ beginTime }}</span>
          </van-cell>

          <van-cell is-link :border="false" @click="endTimeTag = true">
            <span slot="title" class="blod-text">营业结束时间<em>*</em></span>
            <span slot="default">{{ endTime }}</span>
          </van-cell>
        </van-cell-group>

        <van-cell-group :border="false" class="store_apply van-group" style="margin-bottom: 10px;">
          <van-cell :border="false" class="otherTitle" center title-class="top-title">
            <span slot="title">资质证件</span>
          </van-cell>
          <div style="padding: 0 12px; text-align: left;">
            <p style="font-weight: bold;">营业执照 <em style="color: #f86e6e;">*</em></p>
            <div class="otherphoto" style="padding-bottom: 0.625rem;">
              <div class="imgflex" @click="selectIndex(4)">
                <van-uploader :after-read="onRead" style="width: 100%;">
                  <div style="padding: 0.25rem 1rem; width: 100%; height: 11rem;">
                    <img
                      :src="imageUrl ? imageUrl : require('../../../assets/images/bg_business@2x.png')"
                      style="width: 100%;"
                      class="avatar"
                    />
                  </div>
                </van-uploader>
              </div>
            </div>

            <p style="font-weight: bold;">身份证人像面</p>
            <div class="otherphoto" style="padding-bottom: 0.625rem;">
              <div class="imgflex" @click="selectIndex(6)">
                <van-uploader :after-read="onRead"  style="width: 100%;">
                  <div style="padding: 0.25rem 1rem; width: 100%; height: 11rem;">
                    <img
                      :src="
                        apply.id_card_side ? apply.id_card_side : require('../../../assets/images/bg_idcard_up@2x.png')
                      "
                      style="width: 100%;"
                      class="avatar"
                    />
                  </div>
                </van-uploader>
              </div>
            </div>

            <p style="font-weight: bold;">身份证国徽面</p>
            <div class="otherphoto" style="padding-bottom: 0.625rem;">
              <div class="imgflex" @click="selectIndex(5)">
                <van-uploader :after-read="onRead" style="width: 100%;">
                  <div style="padding: 0.25rem 1rem; width: 100%; height: 11rem;">
                    <img
                      :src="
                        apply.id_card_front
                          ? apply.id_card_front
                          : require('../../../assets/images/bg_idcard_down@2x.png')
                      "
                      style="width: 100%;"
                      class="avatar"
                    />
                  </div>
                </van-uploader>
              </div>
            </div>


            <p style="font-weight: bold;">{{ diyName }}图片<em style="color: #f86e6e;">*</em></p>
            <div class="otherphoto" style="padding: 0.625rem 0;">
              <div class="imgflex">
                <div v-for="(val, index) in apply.thumb" :key="index">
                  <div class="photobox">
                    <img :src="val" style="width: 100%;" />
                    <i @click="removeImg_2(index)"></i>
                  </div>
                </div>
                <van-uploader :after-read="multipleMethod_1"  multiple>
                  <div
                    style="padding: 0.2rem; width: 5rem; height: 5rem; border: 1px dashed #c0ccda; margin: 0 auto; display: flex;"
                  >
                    <img src="../../../assets/images/up_icon.png" style="width: 50%; height: 50%;" class="avatar" />
                  </div>
                </van-uploader>
              </div>
            </div>
          </div>
        </van-cell-group>

        <van-cell-group :border="false" class="store_apply remark-text" style="margin-bottom: 10px;">
          <van-cell :border="false" class="otherTitle" center title-class="top-title">
            <span slot="title">备注信息</span>
          </van-cell>
          <van-cell>
            <van-field
              style="background-color: #f8f8f8; border-radius: 0.469rem; padding: 10px;"
              v-model="apply.remark"
              rows="3"
              autosize
              type="textarea"
              maxlength="100"
              placeholder="填写备注信息"
              show-word-limit
            />
          </van-cell>
        </van-cell-group>

        <!-- <van-cell-group :border="false" class="store_apply remark-text" style="margin-bottom: 10px;">
          <van-cell :border="false" class="otherTitle" center title-class="top-title">
            <span slot="title">商家入驻协议</span>
          </van-cell>
          <div style="padding: 0 12px 12px;">
            <div id="t1" v-html="o2o_info"></div>
          </div>
        </van-cell-group> -->

        <!-- 入驻说明 -->
        <!-- 是否同意协议 @click="showAgreement"-->
        <div style="display: flex; padding: 0 0.625rem;">
          <van-checkbox v-model="agreementChoose" checked-color="#f15353"></van-checkbox>&nbsp;&nbsp;阅读并同意<i
            style="color: #ff5959;" @click="agreementShow = true"
            >《商家入驻协议》</i
          >
        </div>
        <!--文字说明；后台设置-->
        <div style="clear: both; margin-top: 0.9375rem;"></div>
        <input type="submit" value="提交入驻申请" class="btn" @click="setApplyData" />
      </div>
      <!--申请后展示-->
      <div class="success" v-if="o2o_status == 2">
        <div class="ico"><i class="fa fa-check"></i></div>
        <div class="text">{{ msgText }}</div>
        <a @click="goToIndex()">
          <div class="sub">去商城逛逛</div>
        </a>
      </div>
      <!--审核通过后展示，文字后台设置 -->
      <div class="success" v-if="o2o_status == 3">
        <div class="ico"><i class="fa fa-check"></i></div>
        <div class="text">您已通过审核</div>
        <a @click="goToIndex()">
          <div class="sub">去商城逛逛</div>
        </a>
      </div>
    </div>
    <!-- 街道地址 -->
    <yd-cityselect v-model="addressShow" :callback="addressCallback" :items="area"></yd-cityselect>
    <van-popup v-model="streetShow" position="right" width="100%" :style="{ height: '100%', width: '100%' }">
      <van-nav-bar title="选择街道" class="pcStyle_ydT">
        <template #left>
          <span>
            <van-icon name="arrow-left" size="18" @click.native="streetShow = false" color="#333" />
          </span>
        </template>
      </van-nav-bar>
      <!-- <div style="clear:both;margin-top:2.5rem;"></div> -->
      <van-cell
        :border="false"
        center
        is-link
        :key="i"
        v-for="(item, i) in districtVal"
        @click.native="streetConfirm(item)"
        title-style="text-align:left"
      >
        <span slot="title">{{ item.areaname }}</span>
      </van-cell>
    </van-popup>
    <!-- 申请协议 -->
    <van-popup v-model="agreementShow" position="right" style="width: 100%;">
      <van-nav-bar title="申请协议">
        <template #left>
          <span>
            <van-icon name="arrow-left" size="18" @click.native="hideAgreement" color="#333" />
          </span>
        </template>
      </van-nav-bar>
      <!-- <div style="clear:both;margin-top:40px;"></div> -->
      <div v-html="o2o_info"></div>
    </van-popup>

    <!-- 开始营业时间 -->
    <van-popup
      v-model="startTimeTag"
      position="bottom"
      :style="{ height: '40%' }"
      style="overflow: hidden;"
      class="sel-time"
    >
      <van-datetime-picker
        v-model="apply.business_hours_start"
        type="time"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="sureStartTime"
        @cancel="startTimeTag = false"
      />
    </van-popup>

    <van-popup
      v-model="endTimeTag"
      position="bottom"
      :style="{ height: '40%' }"
      style="overflow: hidden;"
      class="sel-time"
    >
      <van-datetime-picker
        v-model="apply.business_hours_end"
        type="time"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="sureEndtTime"
        @cancel="endTimeTag = false"
      />
    </van-popup>
  </div>
</template>
<script>
import selfCarry_apply_controller from './selfCarry_apply_controller';
export default selfCarry_apply_controller;
</script>
<style lang="scss" rel="stylesheet/scss">
#tips {
  text-align: left;
  color: #ff5d5c;
  font-size: 12px;
  display: inline-block;
  padding-left: 12px;
}

.el-upload-list__item {
  padding: 0 !important;
}

.el-input__icon.el-icon-caret-top {
  color: #b8b8b8;
}

.avatar {
  width: 100%;
  height: 100%;
}

.imageRight {
  justify-content: flex-start;
  padding-left: 0.625rem;
  text-align: left !important;
}

.el-input__inner {
  border: 0.0625rem solid #b8b8b8;
  font-size: 12px;
}

.el-select {
  display: block;
  margin-bottom: 0.5rem;
  width: 100%;
  height: 2rem;
  border-radius: 0.3125rem;
  box-sizing: border-box;
  outline: none;
}

#selfCarry_apply {
  h3 {
    background: #f5f5f5;
    margin: 0;
    padding: 0 0.625rem;
    text-align: left;
    font-weight: normal;
    font-size: 12px;
    height: 2rem;
    box-sizing: border-box;
    line-height: 2rem;

    span {
      color: #999;
    }
  }
}

a {
  text-decoration: none;
  color: #222;
}

input {
  border-width: 0;
}

.supplier .banner img {
  width: 100%;
}

.welcome {
  padding-bottom: 0.625rem;

  .text {
    line-height: 2.25rem;
    height: 2.25rem;
    background-color: #fff;

    h1 {
      font-size: 14px;
    }
  }

  .info {
    .info-btn {
      padding: 0.625rem;
      background-color: #fff;

      input {
        display: block;
        margin-bottom: 0.5rem;
        width: 90%;
        height: 2rem;
        border-radius: 0.3125rem;
        padding: 0 0.3125rem;
        box-sizing: border-box;
        outline: none;
        margin: 0.625rem auto;
      }
    }

    .inp {
      border: 0.0625rem solid #b8b8b8;
    }

    .inp:focus {
      border-color: #f55955;
      box-sizing: border-box;
    }

    span {
      color: #f55955;
    }

    .btn {
      background: #f55955;
      color: #fff;
      margin-bottom: 0.5rem;
      width: 90%;
      height: 2rem;
      border-radius: 0.3125rem;
      padding: 0 0.3125rem;
      box-sizing: border-box;
      text-align: center;
      font-size: 12px;
      line-height: 2rem;
      margin: 0 auto;

      i {
        display: inline-block;
      }
    }

    .btn:focus {
      background: #d8403c;
    }

    .info-box {
      background-color: #fff;
      padding-bottom: 1.25rem;
      margin-top: 0.625rem;
      padding-left: 0.875rem;
      margin-bottom: 1.25rem;

      ul {
        display: flex;
        line-height: 2.75rem;
        height: 2.75rem;
        font-size: 14px;
        border-bottom: solid 0.0625rem #e2e2e2;

        .left {
          width: 20%;
          font-size: 14px;
        }

        .right {
          width: 80%;
          font-size: 14px;
          color: #8c8c8c;
        }
      }

      ul:last-child {
        border: none;
      }

      .name {
        .right {
          padding-right: 0.875rem;
          text-align: left;

          input {
            width: 100%;
          }
        }
      }

      .picture {
        .right {
          padding-right: 0.875rem;
          text-align: right;

          i {
            line-height: 2.75rem;
            font-size: 24px;
            color: #c9c9c9;
          }
        }
      }

      .city {
        display: flex;
        line-height: 2.75rem;
        padding-right: 0.875rem;

        .btn {
          font-size: 14px;
          padding: 0;
          height: 2.6875rem;
          display: flex;
          justify-content: space-between;
          background-color: #fff;
          width: 79%;
          line-height: 2.75rem;

          input {
            flex: 2;
          }

          i {
            line-height: 2.75rem;
            font-size: 24px;
            color: #c9c9c9;
          }
        }

        .left {
          width: 21%;
        }
      }

      .time {
        padding-right: 0.875rem;
        display: flex;
        height: 2.75rem;
        line-height: 2.75rem;

        .left {
          width: 21%;
        }

        .right {
          width: 79%;
          display: flex;
          justify-content: space-between;

          input {
            flex: 2;
          }

          i {
            line-height: 2.75rem;
            font-size: 24px;
            color: #c9c9c9;
          }
        }
      }

      .select {
        padding-right: 0.875rem;

        .left {
          width: 21%;
        }

        .right {
          width: 79%;
          display: flex;
          justify-content: space-between;

          select {
            color: #8c8c8c;
            flex: 2;
            border: none;
            border-radius: 0.25rem;

            option {
              color: #333;
            }
          }

          i {
            line-height: 2.75rem;
            font-size: 24px;
            color: #c9c9c9;
          }
        }
      }

      .remarks {
        display: flex;
        padding-right: 0.875rem;
        width: 100%;
        margin-top: 0.625rem;

        span {
          width: 21%;
          font-size: 14px;
          color: #333;
        }

        textarea {
          width: 79%;
          height: 3rem;
          padding: 0.25rem;
          border: solid 0.0625rem #e2e2e2;
          background-color: #fafafa;
          border-radius: 0.25rem;
        }
      }
    }
  }
}

.supplier .main .vip_main {
  background: #fff;
  margin: 0.9375rem 0;

  .title {
    padding: 0.625rem;
    font-size: 12px;
    border-bottom: 0.0625rem solid #eee;
    text-align: center;
  }

  .vip {
    padding: 0.9375rem 0.625rem;
    overflow: hidden;
    font-size: 12px;
    color: #999;

    .ico1,
    .ico2 {
      width: 15%;
      float: left;
    }

    .ico1 {
      i {
        background: #32cd32;
      }
    }

    .ico2 {
      i {
        background: #fece00;
      }
    }

    .text {
      float: left;
      width: 100%;

      .t1 {
        font-size: 16px;
        color: #333;
        margin-bottom: 0.3125rem;
        text-align: left;
      }

      .t2 {
        text-align: justify;
      }
    }

    i {
      background: #32cd32;
      height: 2.25rem;
      width: 2.25rem;
      border-radius: 1.125rem;
      color: #fff;
      text-align: center;
      line-height: 2.375rem;
      font-size: 18px;
    }
  }

  .vip1 {
    border-bottom: 0.0625rem solid #eee;
  }
}

.main {
  .btn {
    width: 100%;
    background: #f55955;
    color: #fff;
    height: 3rem;
    padding: 0 0.3125rem;
    box-sizing: border-box;
    text-align: center;
    font-size: 16px;
    line-height: 3rem;
  }

  .apply {
    line-height: 2.75rem;
    margin: 0 0.75rem 0 0.75rem;
    display: flex;

    .text {
      font-size: 14px;

      .red {
        color: #f15353;
      }
    }
  }

  .otherphoto {
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
}

.supplier .success {
  height: 12.5rem;
  padding-top: 4.0625rem;
  background: #fff;

  .ico {
    height: 4.0625rem;
    width: 4.0625rem;
    margin: auto;
    border: 0.1875rem solid #32cd32;
    border-radius: 4rem;
    color: #32cd32;
    font-size: 36px;
    text-align: center;
    line-height: 4rem;
  }

  .text {
    height: 2rem;
    margin-top: 1.875rem;
    color: #666;
    line-height: 1.6rem;
    text-align: center;
  }

  a .sub {
    height: 2rem;
    width: 80%;
    background: #f55955;
    margin: 1.25rem auto;
    border-radius: 2rem;
    color: #fff;
    line-height: 2rem;
    text-align: center;
    font-size: 14px;
    margin-bottom: 1.25rem;
  }

  a .sub:focus {
    background: #d8403c;
  }

  .avatar-uploader .el-upload {
    border: 0.0625rem dashed #d9d9d9;
    border-radius: 0.375rem;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 11.125rem;
    height: 11.125rem;
    line-height: 11.125rem;
    text-align: center;
  }

  .avatar {
    width: 11.125rem;
    height: 11.125rem;
    display: block;
  }

  .el-upload-list__item .is-success {
    width: 80%;
    height: 6.25rem;
  }
}

.imgflex {
  display: flex;
  flex-wrap: wrap;

  .photobox {
    position: relative;
    width: 4.25rem;
    height: 4.25rem;
    overflow: hidden;
    margin-right: 0.25rem;
    margin-bottom: 0.25rem;
    background: #f5f5f5;
    border: 1px dashed rgb(192, 204, 218);
  }
}

#selfCarry_apply {
  .main {
    .store_apply {
      background: #fff;

      .yd-cell-item {
        .yd-cell-left {
          span {
            font-weight: bold;
            color: #333;
          }

          em {
            color: #f86e6e;
            font-size: 18px;
          }
        }

        .yd-cell-right {
          justify-content: flex-end;
        }

        .yd-cell-right input {
          text-align: right;
          color: #333;
        }

        .yd-cell-right .addressDiv {
          width: 70%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          height: 18px;
        }
      }

      .otherTitle {
        border: none;

        .yd-cell-left {
          flex: 1;

          span {
            color: #f86e6e;
            font-weight: bold;
            line-height: 0.875rem;
            font-size: 0.875rem;
            border-left: 0.2rem solid #f86e6e;
            padding-left: 0.5rem;
          }
        }

        .yd-cell-right {
          width: auto;
          flex: 0;

          span {
            width: 1.25rem;
            height: 1.25rem;
            border: 1px solid #f86e6e;
            border-radius: 100%;
            text-align: center;

            i {
              color: #f86e6e;
            }
          }
        }
      }

      .otherTitle::after {
        width: 0%;
      }

      h3 {
        background: #fff;
        color: #999;
      }
    }
  }
}

#selfCarry_apply {
  .supplier {
    .main {
      .van-group {
        .van-cell {
          padding: 0 12px;
          height: 50px;

          .van-cell__title {
            text-align: left;
            flex: none;

            span {
              color: #333;
              font-weight: bold;
              font-size: 14px;
            }

            em {
              color: #f86e6e;
              font-size: 18px;
            }
          }

          .van-cell__value {
            color: #555;

            input {
              width: 100%;
              text-align: right;
              color: #333;
            }
          }

          .top-title {
            text-align: left;
            flex: none;

            span {
              display: inline-block;
              color: #f86e6e;
              font-weight: bold;
              line-height: 0.875rem;
              font-size: 0.875rem;
              border-left: 0.2rem solid #f86e6e;
              padding-left: 0.5rem;
            }
          }
        }

        /deep/.van-cell--clickable:active {
          background: #fff;
        }
      }
    }

    .remark-text {
      .top-title {
        text-align: left;
        flex: none;

        span {
          display: inline-block;
          color: #f86e6e;
          font-weight: bold;
          line-height: 0.875rem;
          font-size: 0.875rem;
          border-left: 0.2rem solid #f86e6e;
          padding-left: 0.5rem;
        }
      }
    }
  }

  .sel-time {
    .van-picker__confirm {
      color: #0bb20c;
      font-size: 15px;
    }
  }

  /deep/.van-cell--clickable:active {
    background-color: #fff;
  }
}
</style>
