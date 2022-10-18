<!-- 主播申请 -->
<template>
  <div id="AnchorApply">
    <c-title :hide="false" text="主播申请"></c-title>
    <div class="banner">
      <img :src="bannerSrc" />
    </div>
    <div class="main">
      <van-cell-group :border="false" class="store_apply top-info ">
        <van-cell :border="false" class="otherTitle" center title-class="left-title">
          <span slot="title">申请信息</span>
        </van-cell>

        <van-cell :border="false" center>
          <span slot="title" class="dd name">姓名 <em>*</em></span>
          <input slot="default" type="text" placeholder="姓名" v-model="realname" />
        </van-cell>
        <van-cell :border="false" center>
          <span slot="title" class="dd name">手机号 <em>*</em></span>
          <input slot="default" type="number" placeholder="手机号" v-model="mobile" />
        </van-cell>

        <van-cell :border="false" center>
          <span slot="title" class="dd name">所在城市 <em>*</em></span>
          <input
            slot="default"
            type="text"
            placeholder="请选择城市"
            @click="addressShows = true"
            readonly
            v-model="addressName"
          />
          <template #right-icon>
            <van-icon name="arrow" class="search-icon" />
          </template>
        </van-cell>

        <van-cell :border="false" center v-if="strShow">
          <span slot="title" class="dd name">所在街道 <em>*</em></span>
          <input
            slot="default"
            type="text"
            placeholder="请选择街道"
            @click.stop="streetShow = true"
            v-model="street"
            readonly
          />
          <template #right-icon>
            <van-icon name="arrow" class="search-icon" />
          </template>
        </van-cell>

        <van-cell :border="false" center >
          <span slot="title" class="dd name">详细地址 <em>*</em></span>
          <input slot="default" type="text" class="dd" v-model="address" placeholder="街道楼排号等"/>
        </van-cell>
      </van-cell-group>


      <van-cell-group :border="false" class="store_apply remark-info">
        <van-cell :border="false" class="otherTitle" center title-class="left-title">
          <span slot="title">备注信息</span>
        </van-cell>

        <van-cell :border="false"  center>
          <van-field
              v-model="applyModel"
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

      <div style="display: flex; padding: 0 0.625rem;">
        <van-checkbox v-model="agreementChoose" checked-color="#f15353"></van-checkbox>&nbsp;&nbsp;阅读并同意<i
          style="color: #ff5959;"
          @click="showAreement = true"
          >《申请协议》</i
        >
      </div>
      <div class="submit" @click="submitApply">提交</div>
    </div>
    <!-- 街道地址 -->
    <yd-cityselect v-model="addressShows" :callback="addressCallback" :items="area"></yd-cityselect>
    <van-popup v-model="streetShow" position="right" :style="{ height: '100%', width: '100%' }">
      <van-nav-bar title="选择街道" class="pcStyle_ydT">
        <template #left>
          <span>
            <van-icon name="arrow-left" size="18" @click.native="streetShow = false" color="#333" />
          </span>
        </template>
      </van-nav-bar>
      <!-- <div style="clear:both;margin-top:2.5rem;"></div> -->

      <van-cell :border="false" is-link :key="i" arrow v-for="(item, i) in districtVal" @click.native="streetConfirm(item)" title-style="text-align:left">
          <span slot="title">{{ item.areaname }}</span>
      </van-cell>


    </van-popup>
    <van-popup v-model="showAreement" round closeable :close-on-click-overlay="false">
      <div class="popupClass1">
        <div class="title">申请协议</div>
        <div class="text" v-html="agreement"></div>
      </div>
    </van-popup>
    <van-popup v-model="showPopup" round :close-on-click-overlay="false">
      <div class="popupClass">
        <img src="../../assets/images/addcheck.png" alt="" />
        <h2>提交成功</h2>
        <h3>请等待管理员审核！</h3>
        <span class="btn" @click="gotoLiveHome">去直播首页逛逛</span>
      </div>
    </van-popup>
    <van-popup v-model="showVeriVfy" round :close-on-click-overlay="false">
      <div class="popupClass">
        <img src="../../assets/images/addcheck.png" alt="" />
        <h2>审核通过</h2>
        <h3>恭喜您成为主播！</h3>
        <span class="btn" @click="gotoLiveHome">去直播首页逛逛</span>
      </div>
    </van-popup>
    <van-popup v-model="showDissatisfy" round :close-on-click-overlay="false">
      <div class="popupClass2">
        <img src="../../assets/images/material_close.png" alt="" />
        <h2>申请条件不满足</h2>
        <h3>您不满足申请条件，不能申请成为主播！</h3>
        <div class="getCondition">
          <div class="warnTitle">获取申请资格</div>
          <div class="list" v-if="conditionss.agent">
            <div>成为推广员</div>
            <div class="DissatisfyBtn" @click="gotoGetCondition(1)">前往</div>
          </div>
          <div class="list" v-if="conditionss.store">
            <div>成为门店店主/店员</div>
            <div class="DissatisfyBtn" @click="gotoGetCondition(2)">前往</div>
          </div>
          <div class="list" v-if="conditionss.supplier">
            <div>成为供应商</div>
            <div class="DissatisfyBtn" @click="gotoGetCondition(3)">前往</div>
          </div>
          <div class="list" v-if="conditionss.hotel">
            <div>成为酒店</div>
            <div class="DissatisfyBtn" @click="gotoGetCondition(4)">前往</div>
          </div>
          <div class="warnTitle1">满足其中一种身份即可申请</div>
        </div>
      </div>
    </van-popup>

    <van-popup v-model="showBuyGoods" round :close-on-click-overlay="false" class="BuyGoods-popup-class">
      <div class="BuyGoods-popup-title">
        购买指定商品
        <div class="iconfont icon-close11" @click.stop="closedBuyGoodsPopup"></div>
      </div>
      <div class="BuyGoods-popup-text">购买以下商品获取申请主播资格</div>
      <div class="BuyGoods-popup-list">
        <div
          class="BuyGoods-popup-child"
          v-for="item in showBuyGoodslist"
          :key="item.id"
          @click.stop="gotoGoods(item.id)"
        >
          <img :src="item.thumb" alt="" />
          <div class="BuyGoods-popup-child-title">{{ item.title }}</div>
          <div class="BuyGoods-popup-child-price">{{ $i18n.t('money') }} {{ item.price }}</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import anchorApply_Controller from './anchorApply_Controller';
export default anchorApply_Controller;
</script>
<style lang="scss" rel="stylesheet/scss">
#AnchorApply {
  padding: 40px 0;
  padding-top: 0;
  background: #fff;

  .banner {
    background: #fff;

    img {
      width: 94%;
      overflow: hidden;
      border-radius: 0.375rem;
      display: block;
      margin: 0 auto;
    }
  }

  .main {
    .submit {
      width: 20.594rem;
      height: 2.5rem;
      line-height: 2.5rem;
      background-color: #ef3e3e;
      border-radius: 1.25rem;
      margin: 0.875rem auto 0;
      color: #fff;
    }

    .store_apply {
      background: #fff;

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
      }

      .otherTitle::after {
        width: 0%;
      }

      h3 {
        background: #fff;
        color: #999;
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
          background: url('../../assets/images/close_iocn.png');
          background-size: 100%;
        }
      }
    }
  }

  .popupClass,
  .popupClass2 {
    width: 18rem;

    img {
      width: 3.469rem;
      height: 3.469rem;
      display: block;
      margin-top: 1.375rem;
    }

    h2 {
      font-size: 1.5rem;
      font-weight: bold;
      color: #000;
      height: 3.594rem;
      line-height: 3.594rem;
    }

    h3 {
      font-size: 0.875rem;
      color: #999;
      font-weight: 400;
    }

    .btn {
      height: 2.835rem;
      line-height: 2.835rem;
      background: #fe8a02;
      font-size: 1.125rem;
      color: #fff;
      padding: 0 1.25rem;
      border-radius: 1.375rem;
      display: inline-block;
      margin: 2.656rem auto 1.5rem;
    }

    .getCondition {
      border-top: 0.0625rem solid #e6e6e6;
      margin-top: 1rem;
      padding-top: 1rem;

      .warnTitle {
        color: #ef3e3e;
      }

      .warnTitle1 {
        color: #b9b9b9;
        font-size: 0.75rem;
        text-align: left;
        padding: 0.875rem;
      }

      .list {
        display: flex;
        justify-content: space-between;
        padding: 0.875rem 1.25rem 0;

        .DissatisfyBtn {
          padding: 0 0.5rem;
          color: #fff;
          font-size: 0.75rem;
          height: 1.375rem;
          line-height: 1.375rem;
          background: #f49f19;
          border-radius: 0.75rem;
        }
      }
    }
  }

  .popupClass1 {
    width: 20rem;
    padding: 0 1rem 1rem;

    .title {
      font-size: 1.125rem;
      color: #000;
      font-weight: bold;
      height: 2.875rem;
      line-height: 2.875rem;
    }

    .text {
      max-height: 22rem;
      overflow: scroll;
      line-height: 1.5rem;
      font-size: 0.875rem;
    }
  }

  .BuyGoods-popup-class {
    width: 18rem;
    height: 25rem;
    display: flex;
    flex-direction: column;

    .BuyGoods-popup-title {
      height: 3rem;
      line-height: 3rem;
      font-size: 1rem;
      text-align: center;
      font-weight: bold;
      color: #333;

      .iconfont {
        position: absolute;
        right: 1rem;
        top: 0;
        width: 2rem;
        height: 2rem;
      }
    }

    .BuyGoods-popup-text {
      color: #666;
      height: 1.5rem;
      line-height: 1.5rem;
      text-align: left;
      text-indent: 0.875rem;
    }

    .BuyGoods-popup-list {
      width: 18rem;
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 0 0.625rem;
      overflow-y: scroll;

      .BuyGoods-popup-child {
        width: 8rem;
        height: 12.125rem;
        flex-shrink: 0;
        overflow: hidden;
        text-align: left;
        border-radius: 0.375rem;
        margin: 0 0 0.875rem;
        border: 1px solid #f5f5f5;

        img {
          width: 8rem;
          height: 8rem;
        }

        .BuyGoods-popup-child-title {
          height: 2.375rem;
          line-height: 1rem;
          margin-bottom: 0.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          padding: 0.375rem;
        }

        .BuyGoods-popup-child-price {
          color: #f15353;
          padding: 0 0.375rem 0.375rem;
        }
      }
    }
  }
}

#AnchorApply {
  .main {
    .left-title {
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

    .otherTitle {
      text-align: left;
      height: 50px;
      padding: 0 12px;
    }

    .van-cell__title {
      flex: none;
      width: auto;
      color: #333;
      font-weight: bold;
      white-space: nowrap;

      em {
        color: #f86e6e;
        font-size: 18px;
      }
    }

    .van-cell__value {
      input {
        width: 100%;
        border: none;
        color: #333;
        text-align: right;
      }
    }
  }

  .remark-info {
    .van-cell {
      text-align: left;
      padding: 0 12px;
    }
  }
}
</style>
