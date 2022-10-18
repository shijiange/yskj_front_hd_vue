<!-- 安装服务（绿象）--安装师傅申请 -->
<template>
  <div id="worker_apply">
    <div class="supplier">
      <c-title :hide="false" :text="`${diyName}申请`"></c-title>
      <div class="banner" v-if="!fun.isTextEmpty(bannerImg)">
        <img :src="bannerImg" />
      </div>
      <div class="main" v-if="o2o_status == 1">
        <!-- 填写申请信息 -->
        <van-cell-group :border="false" class="store_apply top-info">
          <van-cell :border="false" center class="otherTitle">
            <span slot="title" class="top-title">申请信息</span>
          </van-cell>

          <van-cell :border="false" center class="otherTitle">
            <span slot="title">姓名 <em>*</em></span>
            <input slot="default" type="text" placeholder="请输入姓名" v-model="apply.realname" />
          </van-cell>

          <van-cell :border="false" center class="otherTitle">
            <span slot="title">手机号 <em>*</em></span>
            <input slot="default" type="number" placeholder="请输入联系电话" v-model="apply.mobile" />
          </van-cell>
          <van-cell :border="false" center class="otherTitle">
            <span slot="title">所在区域 <em>*</em></span>
            <input
              slot="default"
              type="text"
              @click.stop="addressShow = true"
              v-model="addressName"
              readonly
              placeholder="请选择所在区域"
            />
            <template #right-icon>
              <van-icon name="arrow" class="search-icon" />
            </template>
          </van-cell>

          <van-cell :border="false" center class="otherTitle" v-if="strShow">
            <span slot="title">街道 <em>*</em></span>
            <input
              slot="default"
              type="text"
              @click.stop="streetShow = true"
              v-model="street"
              readonly
              placeholder="请选择街道"
            />
            <template #right-icon>
              <van-icon name="arrow" class="search-icon" />
            </template>
          </van-cell>

          <van-cell :border="false" center class="otherTitle">
            <span slot="title">身份证号 <em>*</em></span>
            <input slot="default" type="number" placeholder="请输入身份证号" v-model="apply.id_card" />
          </van-cell>
                    <div style="padding: 0 12px; text-align: left;">

            <p class="header_class">身份证人像面 <em style="color: #f86e6e;">*</em></p>
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

            <p class="header_class">身份证国徽面 <em style="color: #f86e6e;">*</em></p>
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


            <p class="header_class">上传电工证 <em style="color: #f86e6e;">*</em></p>
            <div class="otherphoto" style="padding-bottom: 0.625rem;">
              <div class="imgflex" @click="selectIndex(7)">
                <van-uploader :after-read="onRead"  style="width: 100%;">
                  <div style="padding: 0.25rem 1rem; width: 100%; height: 11rem;">
                    <img
                      :src="
                        apply.electrician_card ? apply.electrician_card : require('../../../assets/images/elec_card.png')
                      "
                      style="width: 100%;"
                      class="avatar"
                    />
                  </div>
                </van-uploader>
              </div>
            </div>
          </div>
        </van-cell-group>

        <van-cell-group :border="false" class="store_apply bottom-info">
          <van-cell :border="false" center class="otherTitle">
            <span slot="title" class="top-title">备注信息</span>
          </van-cell>
          <van-cell :border="false" center class="otherTitle" style="padding-bottom: 0.625rem;">
            <van-field
              v-model="apply.remark"
              rows="3"
              autosize
              type="textarea"
              maxlength="100"
              placeholder="填写备注信息"
              show-word-limit
              style="background-color: #f8f8f8; border-radius: 0.469rem; padding: 10px;"
            />
          </van-cell>
        </van-cell-group>
        <!-- 是否同意协议 @click="showAgreement"-->
        <div class="agreement_box">
          <van-checkbox v-model="agreementChoose" checked-color="#f15353"></van-checkbox> &nbsp;&nbsp;
          <i style="color: #ff5959; padding-left: 0.5rem;" @click="agreementShow = true">注册协议</i>
        </div>
        <!--文字说明；后台设置-->
        <div style="clear: both; margin-top: 0.9375rem;"></div>
        <input type="submit" value="提交" class="btn" @click="setApplyData" />
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
    <van-popup v-model="streetShow" position="right" :style="{ height: '100%', width: '100%' }">
      <van-nav-bar title="选择街道">
        <template #left>
          <span>
            <van-icon name="arrow-left" size="18" @click.native="streetShow = false" color="#333" />
          </span>
        </template>
      </van-nav-bar>
      <div style="clear: both; margin-top: 2.5rem;"></div>
      <van-cell :border="false" center is-link title-style="text-align:left" :key="i" v-for="(item, i) in districtVal" @click.native="streetConfirm(item)">
          <span slot="title">{{item.areaname}}</span>
      </van-cell>
    </van-popup>
    <!-- 申请协议 -->
    <van-popup v-model="agreementShow" closeable :style="{ height: '50%', width: '18rem' }" round>
      <h2 style="height: 3rem; line-height: 3rem; font-size: 1rem;">注册协议</h2>
      <div v-html="o2o_info" style="text-align: left; font-size: 0.875rem; line-height: 1.25rem; padding: 0.875rem;"></div>
    </van-popup>
  </div>
</template>
<script>
import worker_apply_contronller from './worker_apply_contronller';
export default worker_apply_contronller;
</script>
<style lang="scss" rel="stylesheet/scss">
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
}

#worker_apply {
  .main {
    .store_apply {
      background: #fff;
      margin-bottom: 0;

      .yd-cell-item {
        .yd-cell-left {
          width: 6rem;

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
          text-align: left;
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

      .yd-cell-item:not(:last-child)::after {
        width: 94%;
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
    }

    .agreement_box {
      display: flex;
      padding: 0.625rem 0.625rem 0;
    }

    .header_class {
      height: 3rem;
      line-height: 3rem;
      font-weight: bold;
    }
  }
}

#worker_apply {
  .main {
    .store_apply {
      background: #fff;
      margin-bottom: 0;
    }

    .top-info {
      .van-cell {
        height: 50px;
        padding: 0 12px;

        .van-cell__title {
          flex: none;
          width: 6rem;
          color: #555;
          text-align: left;
          font-weight: bold;

          em {
            color: #f86e6e;
            font-size: 18px;
          }
        }

        .top-title {
          display: inline-block;
          color: #f86e6e;
          font-weight: bold;
          line-height: 0.875rem;
          font-size: 0.875rem;
          border-left: 0.2rem solid #f86e6e;
          padding-left: 0.5rem;
        }

        input {
          width: 100%;
          height: 100%;
          color: #333;
        }

        /deep/input::placeholder {
          color: #555;
        }
        // .van-field {
        //   padding: 0;
        // }
      }
    }

    .bottom-info {
      .van-cell__title {
        flex: none;
        width: 6rem;
        color: #555;
        text-align: left;
        font-weight: bold;

        em {
          color: #f86e6e;
          font-size: 18px;
        }

        .top-title {
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
}
</style>
