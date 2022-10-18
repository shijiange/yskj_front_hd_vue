<template>
  <div id="all">
    <c-title :hide="false" text=" "></c-title>
    <div v-show="!isShow">
      <loading :show="true"></loading>
    </div>

    <!-- new -->
    <div id="home_seller2" v-show="isShow && store_components.length <= 0">
      <div class="header_box">
        <div class="img">
          <img :src="mainInfo.store_thumb ? mainInfo.store_thumb : require('../../assets/images/loading.jpg')" :style="{ borderRadius: mainInfo.logo_style ? '0' : '50%' }" />
        </div>
        <ul class="name">
          <li>{{ mainInfo.store_name }}</li>
          <li class="tel">
            <a :href="telephone">店铺咨询： {{ mainInfo.store_mobile }}</a>
          </li>
        </ul>
        <div class="btn" @click="goToCrash" v-if="mainInfo.is_open_cashier == 1">
          <button type="button">优惠买单</button>
        </div>
      </div>
      <!-- 独立余额 -->
      <div class="circleBox" v-if="is_open">
        <div class="circleLeft" @click="toStoreBalance">
          <span>{{ title }}</span>
          <div class="priceCir">
            <span>{{ $i18n.t("money") }}</span>
            <span class="pric">{{ member_balance }}</span>
          </div>
        </div>
        <div class="circleRight" v-if="show_button" @click="toStoreBalance('balance')">充值</div>
      </div>
      <ul class="tab-box">
        <li v-for="(item, index) in tabList" :key="index" :class="tabName == item.name ? 'choose' : ''" @click="chooseTab(item, index)">
          {{ item.name }}
        </li>
      </ul>
      <div class="detail-box" v-if="tabName == '门店详情'">
        <div class="detail-item">
          <p class="detail-title">营业时间</p>
          <p class="time">{{ mainInfo.business_hours }}</p>
        </div>
        <div class="detail-item">
          <p style="display: flex"><span class="detail-title">门店地址</span><i @click="goToAdress" class="iconfont icon-all_daohang"></i></p>
          <p>{{ mainInfo.store_address }}</p>
        </div>
        <div class="detail-item" v-if="!fun.isTextEmpty(delivery_amount)">
          <p style="margin: 10px 0">
            <span>门店配送起送价</span>
            <span class="delivery_amount">{{ $i18n.t("money") }}{{ delivery_amount }}</span>
          </p>
        </div>
        <div class="detail-item" v-if="is_open_store_delivery">
          <p class="detail-title">配送范围</p>
          <!-- 配送说明 -->
          <p v-html="delivery_note" style="margin: 1rem 0"></p>
          <!-- 配送范围地图 -->
          <div style="width: 100%; height: 18.75rem">
            <delivery-map :center_path="locations" :path_list="delivery_area"></delivery-map>
          </div>
        </div>
        <c-comment :commentInfo="commentList.new_comment" v-on:RouterTo="FromTo" :type="2" :score="commentList.average_score" :total="commentList.comment_total"></c-comment>
        <div class="detail-item">
          <p class="detail-title">门店简介</p>
          <p>{{ mainInfo.store_introduce }}</p>
        </div>
        <div class="detail-item">
          <p class="detail-title">门店详情介绍</p>
          <p v-if="!infoShow" style="margin-left: 2rem">暂无详情...</p>
          <p id="store_content" v-if="infoShow" v-html="info"></p>
        </div>
        <div class="detail-item" v-if="get_recommend_goods && get_recommend_goods.length > 0">
          <p class="detail-title">推荐商品</p>
          <div class="goods-box">
            <div class="good-item" v-for="(good, i) in get_recommend_goods" :key="i" @click.stop="toGood(good.goods_id)">
              <div class="good-img">
                <img :src="good.change_thumb" alt="" />
              </div>
              <p class="good-title">{{ good.title }}</p>
              <div class="goods_content_show" v-if="good.goods_content_show">
                <!-- 商品内容显示 #81889-->
                <template v-for="(contentChild, contentChild_index) in good.goods_content_show">
                  <div style="font-size:10px;color:#666;" :key="contentChild_index">{{ contentChild.name }}{{ contentChild.value }}%</div>
                </template>
              </div>
              <p class="good-price" v-if="fun.isTextEmpty(good.goods_show)">{{ $i18n.t("money") }}{{ good.price }}</p>
              <div class="show_price_box" v-if="!fun.isTextEmpty(good.goods_show)">
                <div class="show_price" :class="[i % 2 == 0 ? 'red_white' : 'white_red']" v-for="(item, i) in good.goods_show" :key="i">{{ item.name }}:{{ item.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="community-box" v-if="tabName == '门店微贴'">
        <c-flow :showLoading="!isLoading" :isLoadMore="menuList[this.tabIndex].isLoadMore" @getMore="getMoreData" :list="menuList[this.tabIndex].list"></c-flow>
      </div>
      <div class="live-box" v-if="tabName == '门店直播'">
        <c-live :recordsList="menuList[this.tabIndex].list" :showtitle="false"></c-live>
      </div>
      <div class="member-box" v-if="tabName == '门店员工'">
        <div class="member-item" v-for="(member, index) in menuList[this.tabIndex].list" :key="index">
          <div class="img-box" @click="toCard(member.card_id)">
            <img :src="member.avatar" alt="" />
          </div>
          <div class="text-box" @click="toCard(member.card_id)">
            <p class="name">{{ member.realname }}</p>
            <p>联系方式：{{ member.phone }}</p>
            <p>微信号：{{ member.wechat || "无" }}</p>
          </div>
          <div class="phone-box">
            <a :href="'tel:' + member.phone" style="display: flex; align-self: center">
              <div class="icon-box">
                <i class="iconfont icon-all_phone"></i>
                <!--<p>拨电话</p>-->
              </div>
            </a>
            <div class="icon-box" style="margin-left: 0.5rem" v-clipboard:copy="member.wechat" v-clipboard:success="onCopy" v-clipboard:error="onError">
              <i class="iconfont icon-card_weixin1"></i>
              <!--<p>添加微信</p>-->
            </div>
            <i class="iconfont icon-advertise-next" @click="toCard(member.card_id)"></i>
          </div>
        </div>
        <div class="blank" v-if="menuList[this.tabIndex] && menuList[this.tabIndex].list.length <= 0">
          <img src="../../assets/images/blank.png" />
          <span>暂无信息</span>
        </div>
      </div>

      <div class="group-box" v-if="tabName == '门店拼团'">
        <c-grouplist :list="menuList[this.tabIndex].list" :store_id="$route.params.store_id"></c-grouplist>
      </div>

      <div class="group-box" v-if="tabName == '定金阶梯团'">
        <deposit-ladder-cell
          v-for="(item, index) in menuList[this.tabIndex].list"
          :thumb="item.bind_goods.thumb_src"
          :title="item.activity_name"
          :price="item.bind_goods.price"
          :deposit="item.deposit"
          :count="item.order_count"
          :key="index"
          :store_id="$route.params.store_id"
          :id="item.id"
        ></deposit-ladder-cell>
      </div>

      <div class="fixed-box" @click="goToShop" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
        <span class="red-box">进店选购</span>
      </div>
      <div class="fixed-box" style="top: 60%; height: 48px" @click="goToShop('code')" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']" v-if="show_qr_code">
        <span class="red-box" style="width: 43px; height: 43px">我的二维码</span>
      </div>
    </div>
    <!--new end-->

    <!--门店装修页面-->
    <div v-show="isShow && store_components.length > 0">
      <template v-for="(item, index) in store_components">
        <component
          :key="index"
          :is="item.component_key"
          :isBottom="isBottom"
          :lastIndex="lastIndex"
          :btnFlag="btnFlag"
          :id="item.id"
          :page_id="page_id"
          :component_key="item.component_key"
          :datas="item.remote_data"
          :index="index"
          :store_id="store_id"
          @refresh="refreshComponent"
          :ref="item.component_key"
        ></component>
      </template>

      <U_foot :id="id + '1'" v-if="bottom_info" :diydatas="bottom_info"></U_foot>
    </div>
  </div>
</template>

<script>
import home from "./home_seller_controller";

export default home;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.circleBox {
  width: 100%;
  height: 7.19rem;
  background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/independenceBalance.png");
  background-repeat: no-repeat;
  background-size: cover;
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .circleLeft {
    margin-left: 2.03rem;
    color: #ffd772;
    font-size: 0.84rem;
    text-align: left;

    .priceCir {
      margin-top: 0.5rem;
      margin-bottom: 0.8rem;
      font-size: 0.84rem;

      .pric {
        font-size: 1.75rem;
      }
    }
  }

  .circleRight {
    width: 4.38rem;
    height: 1.56rem;
    background-color: #f6db97;
    border-radius: 0.78rem;
    font-size: 0.84rem;
    color: #494247;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 2.03rem;
  }
}

#all {
  background: #fff;
  position: relative;
}

.border-bottom {
  position: relative;
  border-top: none !important;
}

.border-bottom::after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0.0625rem;
  background-color: #ccc;
  -webkit-transform-origin: left bottom;
  transform-origin: left bottom;
}

/* 2倍屏 */
@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  .border-bottom::after {
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
}

/* 3倍屏 */
@media only screen and (-webkit-min-device-pixel-ratio: 3) {
  .border-bottom::after {
    -webkit-transform: scaleY(0.33);
    transform: scaleY(0.33);
  }
}

#home_seller2 {
  .header_box {
    width: 100%;
    display: flex;
    background-color: #fff;
    padding: 0.5rem 0.8rem;
    margin: 0 auto;
    position: relative;

    .img {
      flex: 0 0 3rem;
      width: 3rem;
      height: 3rem;
      border-radius: 0.125rem;
      overflow: hidden;
      margin-right: 0.625rem;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .name {
      flex: 1;

      li {
        font-size: 16px;
        font-weight: bold;
        line-height: 1.5rem;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 13rem;
      }

      .tel {
        font-size: 13px;
      }
    }

    .btn {
      flex: 0 0 85px;
      display: flex;

      button {
        align-self: center;
        justify-self: center;
        border-radius: 1rem;
        border: solid 0.0625rem #ff2c29;
        color: #ff2c29;
        padding: 0.25rem 0.625rem;
      }
    }
  }

  .tab-box {
    padding: 0.5rem 0.8rem;
    display: flex;
    flex-wrap: wrap;

    li {
      padding: 0.2rem 0.5rem;
      color: #999;
      margin: 0 0.5rem 0.3rem 0;
      font-weight: bold;
    }

    .choose {
      background-image: linear-gradient(#ff2c29, #ff2c29), linear-gradient(#ff7747, #ff7747);
      color: #fff;
      border-radius: 0.875rem;
    }
  }

  .detail-box {
    padding: 0.5rem 0.8rem;
    text-align: left;

    .detail-item {
      margin-bottom: 0.5rem;

      .delivery_amount {
        margin-left: 0.5rem;
        color: #ed0606;
        font-weight: 400;
      }
    }

    .detail-title {
      flex: 1;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .icon-all_daohang {
      flex: 0 0 1rem;
      font-size: 26px;
      color: #ff2c29;
    }

    .time {
      font-weight: bold;
      font-size: 16px;
      color: #ff2c29;
    }
  }

  .goods-box {
    display: flex;
    flex-wrap: wrap;

    .good-item {
      width: 48.5%;
      margin-bottom: 0.5rem;
      font-size: 15px;

      .good-img {
        width: 100%;
        height: 10rem;
        border-radius: 5px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }
      }

      .good-title {
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .good-price {
        color: #ff2c29;
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* 门店拼团 */
      .show_price_box {
        display: flex;
        flex-wrap: wrap;
      }

      .show_price {
        font-size: 12px;
        color: #ff2c29;
        border: solid #ff2c29 1px;
        padding: 1px 4px;
        margin-top: 5px;
      }

      .red_white {
        color: #fff;
        background: #ff2c29;
        margin-right: 5px;
      }

      .white_red {
        color: #ff2c29;
        background: #fff;
      }

      /* 门店拼团 */
    }

    .good-item:nth-child(odd) {
      margin: 0 0.5rem 0.5rem 0;
    }
  }

  .live-box {
    display: flex;
    flex-wrap: wrap;
    padding: 0.5rem 0.8rem;

    .live-item {
      width: 48.5%;
      margin-bottom: 0.5rem;
      position: relative;
      padding-bottom: 1rem;

      .live-img-box {
        position: relative;
        width: 100%;
        height: 12rem;
        color: #fff;

        img {
          width: 100%;
          height: 100%;
          border-radius: 12px;
        }

        .left-top {
          position: absolute;
          left: 0.5rem;
          top: 0.5rem;
          font-size: 12px;

          .status {
            background: #ff2c29;
            border-radius: 5px;
            padding: 2px 3px;
          }

          .gray {
            background: #999;
          }
        }

        .right-top {
          position: absolute;
          top: 0.3rem;
          right: 1rem;

          .icon-zb_goods {
            font-size: 28px;
            color: #ffa303;
          }

          .goods-num {
            position: absolute;
            top: 3px;
            right: -10px;
            font-size: 10px;
            color: #ff2c29;
            background: #fff;
            border-radius: 9px;
            padding: 1px 2px;
          }
        }

        .bottom-title {
          position: absolute;
          bottom: 1rem;
          left: 0.5rem;
          text-align: left;
          display: -webkit-box;
          text-overflow: ellipsis;
          overflow: hidden;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }

      .title-box {
        width: 80%;
        position: absolute;
        bottom: 0;
        right: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .member-img {
        width: 1.75rem;
        height: 1.75rem;
        background-color: #fff;
        border-radius: 50%;
        position: absolute;
        bottom: 0;
        left: 0;

        img {
          margin-top: 0.12rem;
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
        }
      }
    }

    .live-item:nth-child(odd) {
      margin: 0 0.5rem 0.5rem 0;
    }
  }

  .member-box {
    padding: 0.5rem 0.8rem;

    .member-item {
      display: flex;
      border-bottom: 1px solid #eee;
      padding: 0.5rem 0;

      .img-box {
        flex: 0 0 3rem;
        width: 3rem;
        height: 3rem;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .text-box {
        flex: 1;
        display: flex;
        flex-direction: column;
        text-align: left;
        margin-left: 0.5rem;
        font-size: 12px;

        .name {
          font-weight: bold;
          font-size: 14px;
        }
      }

      .phone-box {
        display: flex;
        margin-left: 0.5rem;
        flex: 0 0 7rem;
        font-size: 12px;

        .icon-box {
          align-items: center;
          display: flex;
        }

        .icon-all_phone,
        .icon-card_weixin1 {
          color: #ff2c29;
          font-size: 28px;
        }

        .icon-advertise-next {
          display: flex;
          align-self: center;
          font-size: 20px;
        }
      }
    }
  }

  .fixed-box {
    position: fixed;
    top: 50%;
    right: 0;
    background: #ffca9b;
    width: 56px;
    height: 44px;
    border-radius: 20px 0 0 20px;

    .red-box {
      font-size: 12px;
      display: inline-block;
      padding: 3px;
      margin-top: 2px;
      margin-left: -8px;
      width: 40px;
      height: 40px;
      background: #ff2c29;
      color: #fff;
      border-radius: 50%;
    }
  }
}

.pcStyle {
  position: absolute !important;

  #home_seller2 {
    .fixed-box {
      position: fixed !important;
      left: 50%;
      top: 50vh;
      margin-left: 131.5px;
    }
  }
}

#store_content {
  /deep/img {
    height: auto;
    display: flex;
  }
}
</style>
