<template>
  <div id="goods" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
    <c-title :hide="false" :text="'活动详情'"></c-title>
    <div class="banner" :style="{ height:fun.getPhoneEnv() == 3 ? '375px' : '100vw' }">
      <img :src="datas.cover" alt=""/>
    </div>
    <div class="content">
      <div class="title">
        {{ datas.title }}
      </div>
      <div class="share" @click="shareWeixin()">
        <i class="iconfont icon-fenxiang"></i>
        分享
      </div>
    </div>
    <div class="button">
      <div class="btn-li">
        <i class="iconfont icon-fx_canyu"></i>
        {{ datas.join_num ? datas.join_num : 0 }} 人参与
      </div>
      <div class="btn-li" @click="postShow()">
        <i class="iconfont icon-fx_hiabao"></i>
        海报
      </div>
    </div>
    <div style="height: 0.5rem; background: #f4f4f4;"></div>
    <div class="good-list">
      <div class="title">选择商品</div>
      <div class="good-lis" v-for="(item, index) in goods_list" :key="index">
        <div class="choose">
          <!-- <van-checkbox
            v-model="item.checked1"
            checked-color="#ff3633"
            @click="chooseGoods(index,item)"
          ></van-checkbox> -->
          <van-radio-group v-model="checked">
            <van-radio :name="index" checked-color="#ff3633"></van-radio>
          </van-radio-group>
        </div>
        <div class="img" @click="gotoGoods(item.id)">
          <img :src="item.thumb" alt=""/>
        </div>
        <div class="good-content" @click="gotoGoods(item.id)">
          <div class="content-a">
            {{ item.title }}
          </div>
          <div class="price">{{$i18n.t("money")}} {{ item.price }}</div>
        </div>
      </div>
    </div>
    <div class="detail" style="padding-bottom: 4rem;">
      <div class="title">活动详情</div>
      <div class="detail-content" v-html="datas.desc"></div>
    </div>
    <div class="fixed-btn">
      <div class="btn-a" @click="goHome">
        <i class="iconfont icon-dianpu"></i>
        <div>店铺</div>
      </div>
      <a :href="cservice">
        <div class="btn-a">
          <i class="iconfont icon-wodekefu"></i>
          <div>客服</div>
        </div>
      </a>
      <div class="btn-a" @click="goMember">
        <i class="iconfont icon-verification_member"></i>
        <div>我的</div>
      </div>
      <div class="btn-b" @click="buyNow()">
        <div>立即购买</div>
      </div>
    </div>
    <van-popup
      v-model="posterShow"
      closeOnClickModal="true"
      style="width: 17.8125rem; height: 34.5rem; padding: 0; background: none;"
    >
      <div style="width: 100%; height: 100%; overflow: hidden;" class="code_box">
        <div style="width: 100%; height: 31.25rem; border-radius: 0.375rem;">
          <img
            :src="'data:' + posterImg.mime + ';base64,' + posterImg.base64Image"
            style="width: 100%; border-radius: 0.375rem;"
          />
        </div>
        <!-- 关闭图标 -->
        <div class="icon_close" @click="posterShow = false">
          <i class="iconfont icon-close11"></i>
        </div>
        <!--  -->
      </div>
    </van-popup>

    <van-popup
      :style="{overflow:'visible'}"
      v-model="popupSpecs"
      position="bottom"
      class="mint-popup-4 pcStyle_mint"
      closeOnClickModal="true"
    >
      <div class="specifications">
        <div class="icon_close" @click="popupSpecs = false">
          <i class="iconfont icon-close11"></i>
        </div>
        <div class="shopimg">
          <div id="chooser_img">
            <img :src="selected_goods.thumb"/>
          </div>
          <div class="right">
            <div class="price">
              {{$i18n.t("money")}}
              <span id="option_price">{{ popPrice }}</span>
              <!-- <span v-if="isRent">/天</span> -->
            </div>
            <div class="option">库存{{ popStock }}{{ selected_goods.sku }}</div>
            <div class="option">{{ goodsDescription }}</div>
          </div>
        </div>

        <div class="shopinfo noVantRadio">
          <dl v-for="(specs, i) in selected_goods.has_many_specs" :key="i">
            <dt>{{ specs.title }}</dt>
            <dd>
              <van-radio-group
                v-model="specs.description"
                checked-color="#f15353"
                @change="selectSpecs"
              >
                <van-radio
                  :class="{ vantRadioshow: specs.description == specitem }"
                  :disabled="specitem.c"
                  v-for="(specitem, i) in specs.has_many_specs_item"
                  :name="specitem"
                  :key="i"
                >
                  {{ specitem.title }}
                </van-radio>
              </van-radio-group>
            </dd>
          </dl>
        </div>
        <!-- <div v-if="!isRent">
            <van-row>
              <van-col :span="12" id="num">
                购买数量：
              </van-col>
              <van-col :span="11">
                <div class="num">
                  <div class="leftnav" @click="reduceGoods">-</div>
                  <input
                    type="number"
                    class="shownum"
                    v-model.lazy="goodsCount"
                  />
                  <div class="rightnav" @click="addGoods">+</div>
                </div>
              </van-col>
            </van-row>
          </div> -->
        <van-button
          type="danger"
          size="small"
          id="btsmall"
          @click="submitAction"
          v-show="selected_goods.stock >= 1"
        >
          确认
        </van-button>
        <van-button
          type="danger"
          color="#999999"
          size="small"
          disabled
          id="btsmall"
          v-show="selected_goods.stock <= 0"
        >
          确认
        </van-button>
      </div>
    </van-popup>

    <van-popup
      :style="{overflow:'visible'}"
      v-model="popupSpecs2"
      position="bottom"
      class="mint-popup-4 pcStyle_mint"
      closeOnClickModal="true"
    >
      <div class="specifications">
        <div class="shopimg">
          <div id="chooser_img">
            <img :src="selected_goods.thumb"/>
          </div>
          <div class="right">
            <div class="price">
              {{$i18n.t("money")}}
              <span id="option_price">{{ selected_goods.price }}</span>
              <!-- <span v-if="isRent">/天</span> -->
            </div>
            <div class="option">
              库存{{ selected_goods.stock }}
              <span v-if="selected_goods.sku">
                {{ selected_goods.sku }}
              </span>
            </div>
            <div class="option">{{ goodsDescription }}</div>
          </div>
        </div>

        <div v-if="!isRent">
          <van-row>
            <van-col :span="12" id="num">
              购买数量：
            </van-col>
            <van-col :span="11">
              <div class="num">
                <div class="leftnav" @click="reduceGoods">-</div>
                <!-- <input type="text" disabled=false class="shownum" v-model='goodsCount'> -->
                <input
                  type="number"
                  class="shownum"
                  v-model.lazy="goodsCount"
                />
                <div class="rightnav" @click="addGoods">+</div>
                <!-- <input type="number" class="shownum" v-model.lazy='goodsCount' > -->
              </div>
            </van-col>
          </van-row>
        </div>
        <!-- 关闭图标 -->
        <div class="icon_close" @click="popupSpecs2 = false">
          <i class="iconfont icon-close11"></i>
        </div>
        <!--  -->
        <van-button
          size="small"
          id="btsmall"
          type="danger"
          v-show="selected_goods.stock >= 1"
          @click="buyNowNew"
        >
          确认
        </van-button>
        <van-button
          type="danger"
          color="#999999"
          size="small"
          disabled
          id="btsmall"
          v-show="selected_goods.stock <= 0"
        >
          确认
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import activity_detail_controller from "./activity_detail_controller";

export default activity_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  // @import "./goods.scss";

  #goods {
    background: #fff;
    min-height: 100vh;

    .banner {
      height: 100vw;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .content {
      display: flex;
      padding: 0.75rem 0;
      align-items: center;

      .title {
        flex: 1;
        margin-left: 0.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        text-align: left;
        margin-right: 0.5rem;
      }

      .share {
        flex: 0 0 4rem;
        height: 1.5rem;
        line-height: 1.5rem;
        background: #f4f4f4;
        border-top-left-radius: 1rem;
        border-bottom-left-radius: 1rem;
        color: #adadad;
      }
    }

    .button {
      display: flex;
      width: 100%;

      .btn-li {
        color: #adadad;
        flex: 1;
        line-height: 1.25rem;
        margin-bottom: 0.5rem;
      }
    }

    .good-list {
      padding: 0.5rem;

      .title {
        font-size: 0.875rem;
        font-weight: 600;
        text-align: left;
        padding: 0.5rem 0;
      }

      .good-lis {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;

        .choose {
          flex: 0 0 1.5rem;
        }

        .img {
          flex: 0 0 7rem;
          height: 7rem;
          border-radius: 0.35rem;
          margin-right: 0.5rem;

          img {
            width: 100%;
            height: 100%;
            border-radius: 0.35rem;
          }
        }

        .good-content {
          flex: 1;
          align-self: flex-start;
          text-align: left;
          height: 7rem;
          position: relative;

          .content-a {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
          }

          .price {
            font-size: 0.9375rem;
            position: absolute;
            bottom: 10px;
            color: #ff3633;
          }
        }
      }
    }

    .detail {
      padding: 0 0.5rem;
      text-align: left;

      .title {
        font-size: 0.875rem;
        font-weight: 600;
        text-align: left;
        padding: 0.5rem 0;
      }

      img {
        width: 100%;
        height: 100%;
      }
    }

    .fixed-btn {
      position: fixed;
      bottom: 0;
      height: 3rem;
      border-top: 1px solid #e5e5e5;
      display: flex;
      width: 100%;
      background: #fff;

      .btn-a {
        i {
          font-size: 20px;
        }

        flex: 0 0 3rem;
        padding: 0.25rem;
      }

      .btn-b {
        margin: 0.25rem 0;
        flex: 3;
        border-radius: 2rem;
        line-height: 2.5rem;
        background: #ff7554;
        color: #fff;
      }
    }

    .code_box {
      position: relative;

      .icon_close {
        position: absolute;
        bottom: 0;
        right: 50%;
        width: 2.5rem;
        height: 2.5rem;
        margin-right: -1.25rem;
        border: 1px solid #fff;
        border-radius: 100%;

        i {
          line-height: 2.5rem;
          font-size: 1.125rem;
          color: #fff;
        }
      }
    }

    .mint-swipe-indicator {
      width: 0.5rem;
      height: 0.5rem;
      display: inline-block;
      border-radius: 100%;
      background: #dc1a7c;
      margin: 0 0.1875rem;
    }

    #hoid {
      padding: 0.3125rem;
      width: 1.6rem;
      position: fixed;
      z-index: 2;
      height: 2.25rem;
    }

    #cart {
      padding: 0.3125rem;
      width: 1.6rem;
      position: fixed;
      z-index: 2;
      box-sizing: content-box;
    }

    #navTab {
      position: fixed;
      z-index: 999;
      width: 14rem;
      left: 50%;
      margin-left: -7rem;
      display: none;
      background: #fdfdfd;

      a {
        padding: 0 0.8rem;
        height: 2.25rem;
        line-height: 2.25rem;
      }

      .current {
        color: #1f1f1f;
        font-weight: bold;
        border-bottom: 0.1875rem transparent solid;
        border-width: 100%;
        border-color: #f15353;
      }
    }

    #navTab.hoet {
      display: flex;
      justify-content: space-around;
    }

    #shopInfo .detailNav {
      top: 2.25rem;
    }

    #member {
      padding: 0.3125rem;
      width: 1.6rem;
      position: fixed;
      z-index: 2;
      box-sizing: content-box;
    }

    #cart {
      right: 0;
    }

    #member {
      right: 2rem;
    }

    #hoid.hoet {
      // transition: 0.3s;
      background: rgba(253, 253, 253, 1);
      width: 100%;
      color: #1f1f1f;
    }

    #back {
      width: 1.6rem;
      height: 1.6rem;
      border-radius: 100%;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.4);
      text-indent: 0;
      line-height: 1.7rem;
      overflow: hidden;
    }

    .hoet #back {
      transition: 0.1s;
      background-color: rgba(237, 237, 237, 0);
      color: #1f1f1f;
    }

    .mint-swipe {
      height: 100vw;

      img {
        width: 100%;
      }
    }

    .van-row {
      background: #fff;
      color: #666;
    }

    .el-row {
      background: #fff;
      color: #666;
      padding: 0 0.75rem;
    }

    .el-col-5 {
      text-align: right;
    }

    .el-col-24 {
      margin-bottom: 0.3125rem;
    }

    .sale {
      text-align: right;
    }

    .mint-popup {
      box-sizing: content-box;
      width: 100%;
      padding: 0 0.625rem;
      padding-top: 0.625rem;
    }

    #stockcontainer {
      font-size: 12px;
      color: #999;
      text-align: left;
      line-height: 1.875rem;
      padding: 0 0.75rem 0.2rem;
    }

    #share {
      font-size: 12px;
      color: #666;
      text-align: right;

      i {
        font-size: 1.125rem;
        margin-bottom: 0.1875rem;
        color: #666;
      }
    }

    #other {
      color: #999;
      text-align: left;
      margin-left: 4.16667%;
      margin-bottom: 0.625rem;
    }

    .but {
      z-index: 98;
      position: fixed;
      bottom: 4.9375rem;
      right: 1.25rem;

      button {
        width: 3.0625rem;
        height: 3.0625rem;
        border-radius: 50%;
        background-color: #f15353;
        box-shadow: 0 0 0.375rem 0 rgba(171, 32, 32, 1);
        border: none;
        text-align: center;
        color: #fff;
      }
    }

    .shopimg {
      #chooser_img {
        position: relative;
        float: left;
        width: 6rem;

        img {
          position: absolute;
          top: -2.1875rem;
          left: 0.625rem;
          width: 100%;
          border-radius: 0.1875rem;
          border: 0.0625rem solid #f0f1f3;
        }
      }

      .right {
        margin-left: 32vw;
        text-align: left;

        .price {
          color: #f15353;
          font-size: 16px;
          line-height: 1.875rem;
          height: 1.875rem;
          overflow: hidden;

          span {
            font-size: 18px;
          }
        }

        .option {
          color: #999;
          font-size: 10px;
          line-height: 1rem;
          height: 1rem;
          overflow: hidden;
        }
      }
    }

    .shopinfo {
      text-align: left;
      padding-left: 0.625rem;
      margin: 2.5rem 0 1.5rem 0;
      max-height: 50vh;
      overflow: scroll;

      dl dt {
        margin-bottom: 0.3125rem;
      }

      dl dd {
        margin-bottom: 0.3125rem;
      }
    }

    #btsmall {
      width: 100%;
      border-radius: 0;
      height: 3.0625rem;
      font-size: 16px;
    }

    #num {
      height: 1.75rem;
      line-height: 1.75rem;
      text-align: left;
    }

    .specifications {
      position: relative;
      margin-bottom: -0.625rem;
      width: 100%;

      .el-radio-button,
      .el-radio-button__inner {
        margin-right: 0.3125rem;
        margin-bottom: 0.3125rem;
      }

      .el-radio-group .el-radio-button .el-radio-button__inner {
        border-radius: 0.25rem;
      }

      .el-radio-button--small .el-radio-button__inner {
        background: red;
      }

      .num {
        margin-top: 1rem;
        border-radius: 0.1875rem;
        float: right;
        background-color: #fff;
      }

      .num .leftnav {
        height: 1.75rem;
        width: 1.75rem;
        float: left;
        background-color: #f2f2f2;
        color: #999;
        text-align: center;
        border-radius: 0.1875rem;
        line-height: 1.75rem;
        font-size: 18px;
        font-weight: bold;
      }

      .num .shownum {
        height: 1.75rem;
        width: 2.25rem;
        float: left;
        border: 0;
        margin: 0;
        padding: 0;
        text-align: center;
        color: #333;
      }

      .num .rightnav {
        height: 1.75rem;
        width: 1.75rem;
        float: right;
        background-color: #f2f2f2;
        color: #999;
        text-align: center;
        border-radius: 0.1875rem;
        line-height: 1.75rem;
        font-size: 18px;
        font-weight: bold;
      }

      .el-row {
        border-top: solid 0.0625rem #f2f2f2;
        border-bottom: solid 0.0625rem #f2f2f2;
        margin: 1.25rem 0.875rem;
        padding: 0;
        font-size: 14px;
        display: flex;
        justify-content: space-between;

        #num {
          height: 3.75rem;
          line-height: 3.75rem;
        }
      }

      .van-row {
        border-top: solid 0.0625rem #f2f2f2;
        border-bottom: solid 0.0625rem #f2f2f2;
        margin: 1.25rem 0.875rem;
        padding: 0;
        font-size: 14px;
        display: flex;
        justify-content: space-between;

        #num {
          height: 3.75rem;
          line-height: 3.75rem;
        }
      }

      .icon_close {
        position: absolute;
        top: -0.625rem;
        right: 1rem;
        width: 2.5rem;
        height: 2.5rem;

        i {
          line-height: 2.5rem;
          font-size: 1.125rem;
          color: #999;
        }
      }
    }

    .mint-popup {
      display: flex;
      align-items: center;
      padding: 0.625rem;
      justify-content: space-between;
      padding-right: 0.875rem;
    }

    #select {
      width: 28%;
      border: solid 0.0625rem #f0f0f0;
      border-radius: 0.25rem;
      height: 1.875rem;
      line-height: 1.875rem;
      text-align: center;
      float: right;
      display: flex;

      #left {
        font-size: 20px;
        border-right: 0.0625rem solid #f0f0f0;
        color: #888;
        flex: 1;
      }

      span {
        flex: 2;
      }

      #right {
        font-size: 20px;
        border-left: 0.0625rem solid #f0f0f0;
        color: #888;
        flex: 1;
      }
    }

    .yd-popup {
      .yd-cell-item {
        padding: 0.625rem 0;

        .yd-cell-right {
          min-height: auto;
          height: auto;
          color: #333;
        }
      }

      .yd-navbar {
        font-weight: bold;
      }
    }
  }

  .noVantRadio {
    .van-radio-group {
      display: flex;
      flex-wrap: wrap;

      .van-radio {
        margin-right: 0.3125rem;
        margin-bottom: 0.3125rem;
        background: #fff;
        border: 1px solid #bfcbd9;
        text-align: center;
        box-sizing: border-box;
        border-radius: 0.25rem;
      }

      .vantRadioshow {
        background-color: rgb(241, 83, 83);
        border-color: rgb(241, 83, 83);
        box-shadow: rgb(241, 83, 83) -1px 0 0 0;
      }
    }
  }

  .pcStyle {
    width: 375px !important;
  }

  .pcStyle .fixed-btn {
    width: 375px !important;
  }
</style>
