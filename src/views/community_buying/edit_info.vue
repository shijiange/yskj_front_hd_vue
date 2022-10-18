<!--社区团购-我的信息 自提点信息 -->
<template>
  <div id="community_buying-edit_info">
    <div class="supplier">
      <c-title :hide="false" text="我的信息"></c-title>
      <div class="banner" v-if="!fun.isTextEmpty(bannerImg)">
        <img :src="bannerImg" />
      </div>
      <div class="main" v-if="apply">
        <!-- 填写申请信息 -->
        <div class="store_apply">
          <div class="otherTitle">
            <span class="left">账号信息</span>
          </div>
          <!-- <div class="list-item">
            <span class="left">登录账号 <em>*</em></span>
            <input
              class="right"
              type="text"
              placeholder="账号"
              v-model="apply.username"
            />
          </div>
          <div class="list-item">
            <span class="left">登录密码 <em>*</em></span>
            <input
              class="right"
              type="password"
              placeholder="密码"
              v-model="apply.password"
            />
          </div>
          <span id="tips"  v-if="pass_safe == 1"
            >密码至少8-16个字符，至少1个大写字母，1个小写字母和1个数字，其他可以是任意字符</span
          > -->
          <div class="list-item border-none">
            <span class="left">姓名 <em>*</em></span>
            <input class="right" type="text" placeholder="姓名" v-model="apply.realname" />
          </div>
          <!-- <div class="list-item">
            <span class="left">手机号 <em>*</em></span>
            <input
              class="right"
              type="number"
              placeholder="手机号"
              v-model="apply.mobile"
            />
          </div> -->
          <!-- <div class="warn-text">注：账号/密码用于您登录PC端管理后台，请务必牢记！</div> -->
        </div>
        <div class="store_apply">
          <div class="otherTitle">
            <span class="left">提货点信息</span>
          </div>
          <div class="list-item">
            <span class="left">提货点名称 <em>*</em></span>
            <input class="right" type="text" placeholder="提货点名称" v-model="apply.deliver_name" />
          </div>
          <div class="list-item">
            <span class="left">提货点电话 <em>*</em></span>
            <input class="right" type="text" placeholder="提货点电话" v-model="apply.deliver_mobile" />
          </div>
          <div class="list-item">
            <span class="left">所在城市 <em>*</em></span>
            <input
              class="right"
              type="text"
              @click.stop="addressShow = true"
              v-model="addressName"
              readonly
              placeholder="请选择城市"
            />
            <i class="iconfont icon-advertise-next "></i>
          </div>
          <div class="list-item" v-if="strShow || apply.street_id">
            <span class="left">街道 <em>*</em></span>
            <input
              class="right"
              type="text"
              @click.stop="streetShow = true"
              v-model="street"
              readonly
              placeholder="请选择街道"
            />
            <i class="iconfont icon-advertise-next "></i>
          </div>
          <div class="list-item">
            <span class="left">详细地址 <em>*</em></span>

            <input class="right" type="text" v-model="apply.address" placeholder="街道楼排号等" />
          </div>
          <!-- <div class="list-item">
            <span class="left">地理位置 <em>*</em></span>
            <span
              class="right"
              style="display: flex;justify-content: flex-end;align-items: center;"
            >
              <div class="addressDiv" style="text-align:right;">
                {{ addressInfo }}
              </div>
              <i
                class="iconfont icon-dingwei"
                style="color:#f86e6e;padding-right:0.25rem;"
              ></i>
              <div class="" style=""  @click="toGeolocation">
                {{ addressInfo ? "切换" : "自动定位" }}
              </div>
            </span>
          </div> -->
          <div class="list-item" @click="tapStarTime = true">
            <span class="left">营业开始时间 <em>*</em></span>
            <div class="right">{{apply.business_hours_start}}</div>
            <i class="iconfont icon-advertise-next "></i>
          </div>
          <div class="list-item" @click="tapEndTime = true">
            <span class="left">营业结束时间 <em>*</em></span>
            <div class="right">{{apply.business_hours_end}}</div>
            <i class="iconfont icon-advertise-next "></i>
          </div>
          <div style="clear: both;"></div>
        </div>

        <div class="store_apply">
          <!-- <div class="otherTitle">
            <span class="left">资质证件</span>
          </div> -->
          <div style="">
            <p style="font-weight: bold;" class="list-item border-none">
              营业执照、食品流通许可证等资质证照 <em style="color: #f86e6e;">*</em>
            </p>
            <div class="otherphoto">
              <div class="imgflex" @click="selectIndex(4)">
                <div v-for="(val, index) in apply.aptitute" :key="index">
                  <div class="photobox">
                    <img :src="val" style="width: 100%;" />
                    <i @click="removeImg_1(index)"></i>
                  </div>
                </div>
                <van-uploader :after-read="multipleMethod_1"  multiple>
                  <div
                    style="padding: 0.2rem; width: 4.25rem; height: 4.25rem; border: 1px dashed #c0ccda; margin: 0 auto; display: flex;"
                  >
                    <img src="../../assets/images/up_icon.png" style="width: 50%; height: 50%;" class="avatar" />
                  </div>
                </van-uploader>
              </div>
            </div>
            <p style="font-weight: bold;" class="list-item border-none">身份证人像面</p>
            <div class="otherphoto">
              <div class="imgflex" @click="selectIndex(6)">
                <van-uploader :after-read="onRead" :max-size="photosize" @oversize="onphotosize" style="width: 100%;">
                  <div style="width: 100%; height: 11rem;">
                    <img
                      :src="
                        apply.id_card_side ? apply.id_card_side : require('../../assets/images/bg_idcard_up@2x.png')
                      "
                      style="width: 100%; height: 100%;"
                      class="avatar"
                    />
                  </div>
                </van-uploader>
              </div>
            </div>
            <p style="font-weight: bold;" class="list-item border-none">身份证国徽面</p>
            <div class="otherphoto">
              <div class="imgflex" @click="selectIndex(5)">
                <van-uploader :after-read="onRead"  style="width: 100%;">
                  <div style="width: 100%; height: 11rem;">
                    <img
                      :src="
                        apply.id_card_front ? apply.id_card_front : require('../../assets/images/bg_idcard_down@2x.png')
                      "
                      style="width: 100%; height: 100%;"
                      class="avatar"
                    />
                  </div>
                </van-uploader>
              </div>
            </div>

            <p style="font-weight: bold;" class="list-item border-none">自提点图片<em style="color: #f86e6e;">*</em></p>
            <div class="otherphoto" style="padding: 0.625rem;">
              <div class="imgflex" @click="selectIndex(7)">
                <div v-for="(val, index) in apply.thumb" :key="index">
                  <div class="photobox">
                    <img :src="val" style="width: 100%;" />
                    <i @click="removeImg_2(index)"></i>
                  </div>
                </div>
                <van-uploader :after-read="multipleMethod_1"  multiple>
                  <div
                    style="padding: 0.2rem; width: 4.25rem; height: 4.25rem; border: 1px dashed #c0ccda; margin: 0 auto; display: flex;"
                  >
                    <img src="../../assets/images/up_icon.png" style="width: 50%; height: 50%;" class="avatar" />
                  </div>
                </van-uploader>
              </div>
            </div>
          </div>
        </div>


        <!-- 入驻说明 -->
        <!-- <div class="store_apply" v-if="o2o_info">
          <div class="otherTitle">
            <span class="left">商家入驻协议</span>
          </div>
          <div style="padding:0 12px 12px;">
            <div id="t1" v-html="o2o_info"></div>
          </div>
        </div> -->
        <!-- 是否同意协议 @click="showAgreement"-->
        <!-- <div style="display:flex;padding: 0 0.625rem;">
          <van-checkbox
            v-model="agreementChoose"
            checked-color="#f15353"
          ></van-checkbox
          >&nbsp;&nbsp;阅读并同意<i style="color:#ff5959;">《商家入驻协议》</i>
        </div> -->
        <!--文字说明；后台设置-->
        <div style="clear: both; margin-top: 0.9375rem;"></div>
        <input type="submit" value="提交" class="btn set-pc-style" @click="setApplyData" />
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
    <van-popup v-model="streetShow" position="right" :style="{width:'100%'}" >
      <van-nav-bar
        title="选择街道"
        left-arrow
        @click-left="onClickLeft"
        fixed="true"
      />
      <div style="clear: both; margin-top: 2.5rem;"></div>
      <van-cell
        :border="false"
        is-link
        :key="i"
        arrow
        v-for="(item, i) in districtVal"
        @click.native="streetConfirm(item)"
        title-style="text-align:left"
        :clickable="false"
      >
        <span slot="title">{{ item.areaname }}</span>
        <span slot="default"></span>
      </van-cell>
    </van-popup>
    <van-popup v-model="tapStarTime" position="bottom" :style="{width:'100%'}">
      <van-datetime-picker
        v-model="apply.business_hours_start"
        type="time"
        title="选择营业开始时间"
        :min-hour="0"
        :max-hour="24"
        @cancel="tapStarTime = false"
        @confirm="startConfirm"
      ></van-datetime-picker>
    </van-popup>
    <van-popup v-model="tapEndTime" position="bottom" :style="{width:'100%'}">
      <van-datetime-picker
        v-model="apply.business_hours_end"
        type="time"
        title="选择营业结束时间"
        :min-hour="0"
        :max-hour="24"
        @cancel="tapEndTime = false"
        @confirm="tapEndTime = false"
      ></van-datetime-picker>
    </van-popup>
  </div>
</template>

<script>
import edit_info_controller from './edit_info_controller';
export default edit_info_controller;
</script>
<style lang="scss" scoped>
#community_buying-edit_info {
  background: #fff;
  padding-bottom: 80px;

  input {
    border: none;
  }

  .supplier .banner img {
    width: 100%;
  }

  .main {
    text-align: left;

    .otherTitle {
      height: 2.125rem;
      line-height: 2.125rem;
      padding: 0 0.875rem;
      background: #f2f2f2;

      span {
        // color: #f86e6e;
        color: #333;
        font-weight: 700;
        // line-height: 1rem;
        // font-size: 1rem;
        // border-left: .2rem solid #f86e6e;
        // padding-left: 0.5rem;
      }
    }

    .list-item {
      height: 3.125rem;
      line-height: 3.125rem;
      margin: 0 0.875rem;
      display: flex;
      position: relative;

      .addressDiv {
        line-height: 18px;
      }

      .left {
        padding-right: 0.5rem;
        font-weight: bold;
        color: #333;

        em {
          color: #f86e6e;
          font-size: 18px;
        }
      }

      .right {
        flex: 1;
        text-align: right;
        overflow: hidden;
      }
    }

    .list-item::after {
      height: 1px;
      position: absolute;
      z-index: 0;
      bottom: 0;
      left: 0;
      content: '';
      width: 100%;
      background-image: linear-gradient(0deg, #ececec 50%, transparent 0);
    }

    .border-none::after {
      height: 0;
    }

    .warn-text {
      margin: 0;
      padding: 0 0.625rem;
      text-align: left;
      font-weight: 400;
      font-size: 12px;
      line-height: 2rem;
      background: #fff;
      color: #999;
      height: 2rem;
    }

    #tips {
      margin: 0;
      padding: 0.625rem;
      text-align: left;
      font-size: 10px;
      line-height: 1rem;
      background: #f8f8f8;
      color: #f86e6e;
    }
  }

  .otherphoto {
    padding: 0.625rem;

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
        background: url('../../assets/images/close_iocn.png');
        background-size: 100%;
      }
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
    position: fixed;
    bottom: 0;
    left: 0;
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
}
</style>
