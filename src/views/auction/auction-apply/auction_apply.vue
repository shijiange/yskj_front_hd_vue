<template>
  <div id="auction_apply" ref="auction_apply">
    <c-title :hide="false" text="拍卖申请"></c-title>
    <div class="content">
      <div class="bannar">
        <img :src="banner_img">
      </div>
      <div class="title">
        <div class="line"></div>
        <span>申请信息</span>
      </div>
      <div class="item">
        <div class="left"><span>姓名</span><span class="xi">*</span></div>
        <input class="right" placeholder="请输入姓名" v-model="real_name">
      </div>
      <div class="item">
        <div class="left"><span>手机号</span><span class="xi">*</span></div>
        <input class="right" placeholder="请输入手机号" v-model="mobile">
      </div>
      <div class="item">
        <div class="left"><span>所在城市</span><span class="xi">*</span></div>
        <input class="right" placeholder="请选择城市" @click.stop="show1 = true" v-model="city" readonly >
      </div>
      <div class="item">
        <div class="left"><span>街道</span><span class="xi">*</span></div>
        <input class="right" placeholder="请选择街道"   @click.stop="streetShow = true" v-model="street" readonly >
      </div>
      <div class="item">
        <div class="left"><span>详细地址</span><span class="xi">*</span></div>
        <input class="right" placeholder="请输入详细地址" v-model="address">
      </div>
      <div class="item">
        <div class="left"><span>身份证号码</span><span class="xi">*</span></div>
        <input class="right" placeholder="请输入身份证号码" v-model="identity_card">
      </div>
      <div class="item">
        <div class="left"><span>企业名称</span><span class="xi">*</span></div>
        <input class="right" placeholder="请输入企业名称" v-model="company">
      </div>
      <div class="upload">

        <div class="list">
          <div class="left"><span>身份证人像面</span><span class="xi">*</span></div>
          <div class="image"
          :style="{backgroundImage: 'url(' + (back.length>0 ? back : require('../../../assets/images/bg_idcard_up.png')) + ')'}">
            <div class="icon">
              <van-uploader :after-read="idback">
              </van-uploader>
            </div>
          </div>
        </div>

        <div class="list">
          <div class="left"><span>身份证国徽面</span><span class="xi">*</span></div>
          <div class="image"
          :style="{backgroundImage: 'url(' + (positive.length>0 ? positive : require('../../../assets/images/bg_idcard_down@2x.png')) + ')'}">
            <div class="icon">
              <van-uploader :after-read="idpositive">
              </van-uploader>
            </div>
          </div>
        </div>



        <div class="list">
          <div class="left"><span>手持身份证照片</span><span class="xi">*</span></div>
          <div class="image"
          :style="{backgroundImage: 'url(' + (holdID.length>0 ? holdID : require('../../../assets/images/bg_idcard_up.png')) + ')'}">
            <div class="icon">
              <van-uploader :after-read="idHand">
              </van-uploader>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="left"><span>企业营业执照照片</span><span class="xi">*</span></div>
          <div class="image"
          :style="{backgroundImage: 'url(' + (license.length>0 ? license : require('../../../assets/images/bg_idcard_up.png')) + ')'}">
            <div class="icon">
              <van-uploader :after-read="licensePhoto">
              </van-uploader>
            </div>
          </div>
        </div>
        <div class="remark">
          <div class="line"></div>
          <span>备注信息</span>
        </div>
        <textarea class="mes" placeholder="填写备注信息" v-model="remark"></textarea>
        <div class="check">
          <van-checkbox v-model="checked" checked-color="#f40420"></van-checkbox>
          <div class="agree"><span>阅读并同意</span><span class="apply" @click="showPop">《申请协议》</span></div>
        </div>
      </div>
      <div class="btn" @click="apply">
        提交
      </div>
    </div>
    <yd-cityselect v-model="show1" :callback="result1" :items="district"></yd-cityselect>
    <van-popup v-model="show" position="center" round style="width: 80%;">
      <div class="popup">
        <i class="iconfont icon-pm_auction_success" style="color: #ff2c29; font-size: 50px;"></i>
        <div class="success">提交成功</div>
        <span>请等待管理员审核</span>
        <div class="pop-btn" @click="toaucion">确认</div>
      </div>
    </van-popup>
    <van-popup v-model="show2" position="center" round style="width: 80%;">
      <div class="popup-agreement">
        <div class="title">
          申请协议
          <i class="iconfont icon-close11" @click="show2=false"></i>
        </div>
        <div style="text-align: left;">
        <p v-html="agreement"></p>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="streetShow"
      position="right"
      style="width: 100%; height: 100%;">
      <van-nav-bar title="选择街道" class="pcStyle_ydT">
        <template #left>
          <span>
            <van-icon name="arrow-left" size="18" @click.native="streetShow=false" color='#333' />
          </span>
        </template>
      </van-nav-bar>    
      <!-- <div style="clear:both;margin-top:2.5rem;"></div> -->
      <van-cell :border="flase" center  v-for="(item,i) in districtVal" :key="i" @click.native="streetConfirm(item)" title-style="text-align:left">
          <span slot="title">{{item.areaname}}</span>
      </van-cell>
    </van-popup>
  </div>
</template>

<script>
import auction_apply_controller from "./auction_apply_controller";

export default auction_apply_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#auction_apply {
  background-color: #fff;
  position: relative;
  height: 100vh;

  .content {
    padding: 0 0.75rem;
    background: #fff;
    padding-bottom: 0.5rem;

    .bannar {
      margin: 1rem 0;
      width: 100%;

      img {
        width: 100%;
        height: 100%;
        border-radius: 0.25rem;
      }
    }

    .title {
      display: flex;

      .line {
        width: 0.3125rem;
        height: 1.125rem;
        background-color: #f40420;
        border-radius: 0.1875rem;
        margin-right: 0.75rem;
      }
    }

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: solid 1px #ededed;
      padding: 1.375rem 0;

      .left {
        .xi {
          color: #f40420;
        }
      }

      .right {
        outline: none;
        border: none;
        flex: 1;
        text-align: right;
      }
    }

    .upload {
      .list {
        padding-top: 1rem;

        .left {
          .xi {
            color: #f40420;
          }
        }

        text-align: left;

        .image {
          height: 11rem;
          margin: 0 auto;
          background-image: url("../../../assets/images/bg_business.png");
          margin-top: 1rem;
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
              opacity: 0;
            }
          }
        }
      }
    }

    .remark {
      display: flex;
      margin: 1rem 0;

      .line {
        width: 0.3125rem;
        height: 1.125rem;
        background-color: #f40420;
        border-radius: 0.1875rem;
        margin-right: 0.75rem;
      }
    }

    .mes {
      background-color: #f2f2f7;
      outline: none;
      border: none;
      width: 100%;
      height: 10.9375rem;
      border-radius: 0.1875rem;
      padding-top: 0.5rem;
      padding-left: 0.5rem;
    }

    .check {
      font-size: 12px;
      display: flex;
      align-items: center;
      margin: 0.5rem 0;

      .agree {
        margin-left: 0.5rem;
      }

      .apply {
        color: #ef3e3e;
      }
    }
  }

  .btn {
    width: 100%;
    height: 2.25rem;
    background-color: #ff2c29;
    border-radius: 1.125rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #fff;
    padding-bottom: 0.5rem;
  }
}

.popup {
  padding: 1.5rem 1rem;
  background-color: #fff;
  border-radius: 1rem;

  img {
    margin-bottom: 1.5rem;
  }

  .success {
    font-size: 24px;
    color: #000;
    margin-bottom: 1rem;
    width: 100%;
  }

  span {
    color: #999;
    display: inline-block;
    width: 100%;
  }

  .pop-btn {
    margin: 0 auto;
    width: 12.75rem;
    height: 2.8125rem;
    background-color: #ff6333;
    border-radius: 1.4375rem;
    font-size: 18px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    margin-top: 2.6875rem;
  }
}

.popup-agreement {
  padding: 1rem;
  padding-bottom: 2rem;
  background-color: #fff;
  border-radius: 1rem;

  .title {
    position: relative;
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      position: absolute;
      right: 0;
    }
  }
}
</style>
