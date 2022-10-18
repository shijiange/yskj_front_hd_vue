<template>
  <div id="all" style="position: relative; height: 100vh;" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
    <div class="content" :style="{ backgroundImage: 'url(' + store.store_barnner_thumb + ')' }" v-show="!loadingPopup">
      <div class="search_top">
        <i class="fa fa-angle-left" style="color: #fff;" @click="goback"></i>
        <div style="display: flex;">
          <input @click.stop="searchJump" type="text" readonly placeholder="搜索店内商品" />
          <i class="iconfont icon-sousuo"></i>
        </div>
      </div>
      <div class="storeInfo_box" ref="storeInfo_box" :class="{ amout: amout }">
        <ul class="storeInfo">
          <li class="name">{{ store.store_name }}</li>
          <li class="time">
            <span>
              <i class="iconfont icon-service_j"></i>
              {{ store.business_hours }}
            </span>
            <span><i class="iconfont icon-service_o"></i>{{ store.dispatch }} </span>
          </li>
        </ul>
        <div class="coupon-box">
          <div class="coupon-left">
            <span class="red-span" v-if="i < 4" v-for="(coupon, i) in get_coupon" :key="i">{{ coupon.name }}</span>
          </div>
          <div class="coupon" @click.stop="gotoCupcon" v-if="get_coupon && get_coupon.length > 0">
            <!--<span>券</span>-->
            更多优惠券
          </div>
        </div>
        <div class="notice-box">店铺公告：{{ store.affiche }}</div>
        <div class="storeImg">
          <img :src="store.store_thumb" />
        </div>
      </div>
      <div class="menu_evaluate_business">
        <div class="nav">
          <ul class="select">
            <li v-for="(name, index) in tab" @click="changeTab(index)" :key="index">
              <span :class="index === tabIndex ? 'current' : ''">
                {{ name }}
              </span>
            </li>
          </ul>
          <button type="button" class="buy_btn" @click.stop="goBuy" v-if="store.is_open_cashier == 1">
            优惠买单
          </button>
        </div>

        <!-- 菜单 -->
        <div class="goods_box" v-show="tabIndex === 0">
          <div class="sort_box" ref="menuWrapper">
            <ul class="box">
              <li
                v-for="(items, index) in category"
                :class="{ current1: index === currentCategoryIndex }"
                ref="list_li_menulist"
                :key="items.id"
              >
                <strong class="first" @click.stop="selectCategoryMenu(items, $event)">
                  <var style="-webkit-box-orient: vertical;">
                    {{ items.name }}
                  </var>
                </strong>
                <strong
                  v-for="(item, i) in items.childrens"
                  class="second"
                  :key="i"
                  :class="{ current: item.id == currentIndex }"
                  v-show="currentCategoryIndex == index"
                  @click.stop="selectMenu(item.id, $event)"
                >
                  <var style="-webkit-box-orient: vertical;">{{ item.name }} </var>
                </strong>
              </li>
              <div style="height: 3.5rem;"></div>
              <div v-if="!amout" style="height: 7rem;"></div>
            </ul>
          </div>
          <div class="goods_list" id="wrapper" ref="foodsWrapper">
            <div>
              <div class="food-list" v-for="(good, index) in goods" :key="index">
                <div v-for="(item, i) in good" :key="i" class="food-list-hook">
                  <p class="food-list-title">{{ item.name }}({{ item.goods.length }})</p>
                  <div class="Goods" v-for="(food, i) in item.goods" :key="i" @click.stop="goToGoodsO2O(food)">
                    <div class="goodsImg">
                      <img :src="food.thumb" />
                    </div>
                    <div class="goods_right">
                      <ul class="goodsName">
                        <li class="name">{{ food.title }}</li>
                        <li class="buy">已售{{ food.show_sales + food.virtual_sales }}{{ food.sku }}</li>
                        <li class="sum sum1" v-if="food.vip_level_status && food.vip_level_status.status == 1">
                          {{ $i18n.t('money') }}
                          <span> {{ food.vip_level_status.word }}</span>
                        </li>
                        <li class="sum" v-else>
                          <span>{{ $i18n.t('money') }}</span
                          >{{ food.price }}
                        </li>
                      </ul>

                      <div
                        class="specBtn"
                        v-if="food.has_option === 1 && (!food.vip_level_status || food.vip_level_status.status == 0)"
                      >
                        <span
                          class="goods-num"
                          :class="goodsCarts[food.id] ? 'show' : 'hide'"
                          v-if="goodsCarts[food.id]"
                        >{{ goodsCartsTotal[food.id].total }}
                        </span>
                        <button type="button" @click.stop="addGood(food)">
                          选规格
                        </button>
                      </div>
                      <div
                        class="addBtn"
                        v-if="
                          !store.operating_state &&
                            showDis &&
                            food.has_option !== 1 &&
                            (!food.vip_level_status || food.vip_level_status.status == 0)
                        "
                      >
                        <i
                          class="iconfont icon-store_reduceLine"
                          @click.stop="numberLeft(food, goodsCarts[food.id])"
                          :class="goodsCarts[food.id] ? 'show' : 'hide'"
                        ></i>
                        <input
                          title="数量"
                          :id="`goodsInputs${food.id}`"
                          :class="goodsCarts[food.id] ? 'show' : 'hide'"
                          v-if="goodsCarts[food.id]"
                          type="number"
                          class="goodsNumber"
                          @click.stop
                          v-model.lazy="goodsCarts[food.id].total"
                          @focus="clickCount(goodsCarts[food.id])"
                          @blur="changeCount(goodsCarts[food.id], food)"
                        />
                        <i class="iconfont icon-store_plus" @click.stop="numberRight(food, goodsCarts[food.id])"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="index === goods.length - 1" style="height: 8.5rem;"></div>
              </div>
              <div v-if="category.length == 0">该门店没有商品</div>
            </div>
            <div
              class="loadNomore"
              v-if="loading"
              style="margin: 0 auto 2.5rem; text-align: center; width: 100%; height: 5.625rem;"
            >
              <img style="width: 5rem; height: 3.75rem;" src="../../../assets/images/no-more-product.png" />
            </div>
          </div>
        </div>
        <!-- 评价 -->
        <div class="evaluate_box" v-show="tabIndex === 1">
          <div class="evaluate_number">
            <ul class="evaluate_info">
              <li>
                <h6>{{ store.comment.average_score }}</h6>
                <span>综合评价</span>
              </li>
              <li>
                <h6>{{ store.comment.comment_total }}</h6>
                <span>评价数</span>
              </li>
            </ul>
          </div>
          <div class="evaluate_list">
            <div class="user_box" v-for="(comment, i) in new_comment" :key="i">
              <!-- <div class="ueser_img">
                <img :src="comment.head_img_url" />
              </div> -->
              <div class="user_info">
                <ul class="info_a">
                  <div class="ueser_img">
                    <img :src="comment.head_img_url" />
                  </div>
                  <li class="name_date">
                    <span class="name">{{ comment.nick_name }}</span>
                    <van-rate readonly="true" v-model="comment.level" />
                  </li>
                  <li class="rate">
                    <span class="date">{{ comment.created_at }}</span>
                  </li>
                </ul>
                <p class="text">
                  {{ comment.content }}
                </p>
                <viewer :images="comment.images">
                  <div style="overflow-x: scroll; overflow-y: hidden;">
                    <div class="img_box" ref="imgbox">
                      <div class="img" v-for="(img, i) in comment.images" :key="i">
                        <img :src="img" />
                      </div>
                    </div>
                  </div>
                </viewer>
                <div class="goodlnfo" v-if="comment.has_one_goods" @click="gotoGoodDetail(comment.has_one_goods.id)">
                  <img :src="comment.has_one_goods.thumb" alt="" />
                  <div class="goodMain">
                    <p class="titless">{{ comment.has_one_goods.title }}</p>
                    <p class="price">{{ $i18n.t('money') }}{{ comment.has_one_goods.price }}</p>
                  </div>
                  <div class="sales">已售{{ comment.has_one_goods.show_sales }}</div>
                </div>
              </div>
            </div>
          </div>
          <div style="height: 3.5rem;"></div>
        </div>
        <!-- 商家 -->
        <div class="store_box" v-show="tabIndex === 2">
          <ul class="tab-box">
            <li
              v-for="(item, index) in tabList"
              :key="index"
              :class="tabIndex2 == item ? 'choose' : ''"
              @click="chooseTab(item)"
            >
              {{ item }}
            </li>
          </ul>
          <div class="detail-box" v-if="tabIndex2 == '店铺详情'">
            <div class="detail-item">
              <p class="detail-title">营业时间</p>
              <p class="time">{{ store.business_hours }}</p>
            </div>
            <div class="detail-item">
              <p style="display: flex;">
                <span class="detail-title">门店地址</span><i @click="goToAdress" class="iconfont icon-all_daohang"></i>
              </p>
              <p>{{ store.store_address }}</p>
            </div>
            <div class="detail-item">
              <p class="detail-title">门店简介</p>
              <p>{{ store.store_introduce }}</p>
            </div>
            <div class="detail-item">
              <p class="detail-title">门店详情介绍</p>
              <p v-if="!info" style="margin-left: 2rem;">暂无详情...</p>
              <p v-if="info" v-html="info"></p>
            </div>
            <div class="detail-item" v-if="get_recommend_goods && get_recommend_goods.length > 0">
              <p class="detail-title">推荐商品</p>
              <div class="goods-box">
                <div
                  class="good-item"
                  v-for="(good, i) in get_recommend_goods"
                  :key="i"
                  @click.stop="toGood(good.goods_id)"
                >
                  <div class="good-img">
                    <img :src="good.change_thumb" alt="" />
                  </div>
                  <p class="good-title">{{ good.title }}</p>
                  <p class="good-price">{{ $i18n.t('money') }}{{ good.price }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="community-box" v-if="tabIndex2 == '门店微贴'">
            <c-flow :showLoading="cisLoadMore" @loadMore="loadMore" :list="nearbyClassification"></c-flow>
          </div>
          <div class="live-box" v-if="tabIndex2 == '门店直播'">
            <c-live :recordsList="store_room" :showtitle="false"></c-live>
          </div>
          <div class="member-box" v-if="tabIndex2 == '门店员工'">
            <div class="member-item" v-for="(member, index) in store_member" :key="index">
              <div class="img-box2" @click="toCard(member.card_id)">
                <img :src="member.avatar" alt="" />
              </div>
              <div class="text-box" @click="toCard(member.card_id)">
                <p class="name">{{ member.realname }}</p>
                <p>联系方式：{{ member.phone }}</p>
                <p>微信号：{{ member.wechat || '无' }}</p>
              </div>
              <div class="phone-box">
                <a :href="'tel:' + member.phone" style="display: flex; align-self: center;">
                  <div class="icon-box">
                    <i class="iconfont icon-all_phone"></i>
                    <!--<p>拨电话</p>-->
                  </div>
                </a>
                <div
                  class="icon-box"
                  style="margin-left: 0.5rem;"
                  v-clipboard:copy="member.wechat"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >
                  <i class="iconfont icon-card_weixin1"></i>
                  <!--<p>添加微信</p>-->
                </div>
                <i class="iconfont icon-advertise-next" @click="toCard(member.card_id)"></i>
              </div>
            </div>
          </div>

          <div style="height: 3.5rem;"></div>
        </div>
      </div>

      <!-- 未添加商品 -->
      <div class="Go_settle" v-show="carts.length === 0 && !store.operating_state && showDis">
        <i class="iconfont icon-all_buycar" @click="trggleCart"></i>
        <p>购物车是空的</p>
        <button type="button" @click.stop="goodsOrder(goodsCarts)">
          请选择商品
        </button>
      </div>
      <!-- 已添加商品 -->
      <div class="Go_settle complete" v-show="carts.length > 0 && !store.operating_state && showDis">
        <span class="number" v-show="!this.showCart">{{ cartsNum }}</span>
        <i :style="minicartStyle" class="iconfont icon-all_buycar" @click="trggleCart"></i>
        <p :style="leftPrice">
          <span>{{ $i18n.t('money') }}</span
          >{{ cartsTotal }}
        </p>
        <button @click.stop="goodsOrder(goodsCarts)" type="button">
          去结算
        </button>
      </div>
      <van-popup v-model="showCart" position="bottom" :style="{width:'100%',maxHeight:'60%',overflow:'auto'}">
        <div class="top">
          <!--<van-checkbox v-model="checked"-->
          <!--&gt;全选<span class="select">(已选{{ cartsNum }}件) </span>-->
          <!--</van-checkbox>-->
          <div style="display: flex;">
            <i class="iconfont icon-all_buycar" @click="trggleCart"></i>
            <span class="select">(已选{{ cartsNum }}件) </span>
          </div>
          <div class="clear_car" @click.stop="clearCart">
            <i class="iconfont icon-delete"></i>
            <span>清空购物车</span>
          </div>
        </div>
        <div class="carPopup" ref="cartWrapper">
          <div>
            <div class="goodsList">
              <div class="goods" v-for="(item, index) in carts" :key="index" @click.stop="goToGoodsO2O(item)">
                <!--<van-checkbox v-model="checked"></van-checkbox>-->
                <div class="goods_img">
                  <img :src="item.goods.thumb" />
                </div>
                <ul class="goodsName">
                  <li class="name">
                    {{ item.goods.title }}
                    <span v-if="item.option_str">({{ item.option_str }})</span>
                  </li>
                  <li class="price">{{ $i18n.t('money') }}{{ item.goods.price }}</li>
                </ul>
                <div class="addBtn">
                  <i class="iconfont icon-store_reduceLine" @click.stop="numberLeft1(item, index)"></i>
                  <input
                    type="number"
                    :id="`itemIputs${index}`"
                    v-model="carts[index].total"
                    @focus="clickCount(item)"
                    @blur="changeCount(item)"
                    @click.stop
                  />
                  <i class="iconfont icon-store_plus" @click.stop="numberRight1(item, index)"></i>
                </div>
              </div>
            </div>
            <div style="height: 3.5rem;"></div>
          </div>
        </div>
      </van-popup>

      <van-popup v-model="show1" position="center" round style="width: 80%;">
        <div style="background-color: #fff;">
          <p class="tips">
            商家休息中，暂不接受新订单
          </p>
          <p style="text-align: center; line-height: 2.5rem;">
            <button class="btn-sure" @click.stop="show1 = false">
              我知道了
            </button>
          </p>
        </div>
      </van-popup>
      <!-- 过期 -->
      <van-popup v-model="show8" close-on-masker="false" position="center" round style="width: 80%;">
        <div style="background-color: #fff;">
          <p class="tips">
            该商家已过期，去看看其他的吧
          </p>
          <p style="text-align: center; line-height: 2.5rem;">
            <button class="btn-sure" @click.stop="goTOHome">
              我知道了
            </button>
          </p>
        </div>
      </van-popup>

      <!--选规格-->
      <div class="scroll-hide">
        <van-popup v-model="show2" position="center" round>
          <div class="spec_big_box">
            <h3 class="title">
              {{ popTitle }}
              <i @click.stop="close" class="iconfont icon-close11"></i>
            </h3>
            <div class="spec_box q5" :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '' }">
              <div class="spec_a">
                <div v-for="(spec, i) in goodsInfo.has_many_specs" :key="i">
                  <h5>{{ spec.title }}：</h5>
                  <ul class="option">
                    <li
                      @click.stop="selectSpecs(item, item.id)"
                      v-for="(item, i) in spec.specitem"
                      :key="i"
                      :class="specid.indexOf(item.id) >= 0 ? 'cur' : ''"
                    >
                      {{ item.title }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="add_car">
              <ul class="car_btn">
                <li class="left"><span>{{$i18n.t('money')}}</span>{{ popPrice }}</li>
                <li class="right">
                  <span v-show="!popNum && popStock >= 1" @click.stop="submitAction">加入购物车</span>
                  <span v-show="popStock <= 0" style="background: #999;">库存不足</span>
                </li>
                <div class="Box" v-show="popNum >= 1">
                  <i class="iconfont icon-store_reduceLine" @click.stop="updateCart(popCard.id, -1)"></i>
                  <label class="show">{{ popNum }}</label>
                  <i class="iconfont icon-store_plus" @click.stop="updateCart(popCard.id, 1)"></i>
                </div>
              </ul>
            </div>
          </div>
        </van-popup>
      </div>
    </div>

    <div class="loadingPopup" v-show="loadingPopup">
      <p class="tips" style="padding: 1rem;">
        商品加载中 请稍后...
      </p>
    </div>

    <div class="y5" :class="[fun.getPhoneEnv() == 3 ? 'pc' : '']" @click.stop="showToolbar" style="bottom: 7.1875rem;">
      <div class="y6" v-show="toolbar">
        <router-link class="y8" :to="fun.getUrl('home')">
          首页
        </router-link>
        <router-link class="yb" :to="fun.getUrl('orderlist', { status: '0' })">
          订单
        </router-link>
        <router-link class="yc" :to="fun.getUrl('member')">
          我的
        </router-link>
        <i class="yd"></i>
      </div>
    </div>
  </div>
</template>
<script>
import home from './store_controller_v2';

export default home;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .food-list-hook {
    margin-bottom: 1.5rem;
  }

  .loadingPopup {
    position: absolute;
    left: calc(50% - 5rem);
    top: calc(65% - 4rem);
    border-radius: 20px;
  }

  .y5 {
    position: fixed;
    z-index: 1000;
    right: 0;
    bottom: 3.75rem;
    width: 2.25rem;
    height: 2.25rem;
    background:
      rgba(0, 0, 0, 0.8) url(//static-o2o.360buyimg.com/daojia/new/images/menu/bm.png) 0.4375rem 0.4375rem
    no-repeat;
    background-size: 4.0625rem 1.25rem;
    border: 0.0625rem solid #757575;
    border-radius: 0.25rem 0 0 0.25rem;
  }

  .y6 {
    position: absolute;
    right: -0.0625rem;
    bottom: 2.625rem;
    width: 5.9375rem;
    border: 0.0625rem solid #757575;
    background: rgba(0, 0, 0, 0.8);
  }

  .y6 a {
    display: block;
    padding-left: 2.375rem;
    border-bottom: 0.0625rem solid #4b4b4b;
    line-height: 2.1875rem;
    height: 2.1875rem;
    color: #fff;
    background-image: url(//static-o2o.360buyimg.com/daojia/new/images/icon/bmenu.png);
    background-repeat: no-repeat;
    background-size: 1rem 18.75rem;
  }

  .y8 {
    background-position: 0.625rem -3.125rem;
  }

  .yb {
    background-position: 0.625rem -12.5rem;
  }

  .yc {
    background-position: 0.625rem -15.625rem;
    border: none;
  }

  .yd {
    position: absolute;
    bottom: -0.75rem;
    right: 0.625rem;
    width: 0;
    height: 0;
    z-index: 15;
    border-width: 0.375rem;
    border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
    border-style: solid;
  }

  * {
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    font-weight: normal;
    font-style: normal;
  }

  select,
  option {
    word-wrap: normal;
  }

  select {
    font-size: 16px;
  }

  textarea {
    font-size: 15px;
  }

  img {
    border: 0;
    vertical-align: auto;
  }

  ul,
  li {
    list-style: none;
  }

  button {
    outline-style: none;
  }

  .checkbox,
  input[type='checkbox'] {
    vertical-align: middle;
    display: inline-block;
    width: 2.75rem;
    height: 2.75rem;
    -webkit-appearance: none;
    appearance: none;
  }

  .show {
    display: block;
  }

  .hide {
    display: none;
  }

  .tips {
    line-height: 3.5rem;
  }

  .btn-sure {
    padding: 0.3rem 0.6rem;
    background: #f15353;
    color: #fff;
  }

  .amout {
    margin-top: -8rem;
    opacity: 0;
  }

  #all {
    .content {
      padding-top: 44px;
      background-color: #f5f5f5;
      background-repeat: no-repeat;
      background-size: 100%;

      .back_search {
        position: fixed;
        top: 0;
        width: 100%;
        height: 2.75rem;
        line-height: 2.75rem;
        padding: 0 0.875rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 100;

        .fa {
          font-size: 1.75rem;
          color: #fff;
        }

        .iconfont {
          font-size: 1.375rem;
          color: #fff;
        }
      }

      .search_top {
        position: fixed;
        top: 0;
        width: 100%;
        height: 2.75rem;
        line-height: 2.75rem;
        padding: 0 0.875rem;
        display: flex;
        align-items: center;

        /* background: #fff; */
        z-index: 100;

        .fa {
          font-size: 1.75rem;
          color: #f2f2f2;
        }

        input {
          background: #fff;
          font-size: 14px;
          height: 1.875rem;
          line-height: 1.875rem;
          width: 18.75rem;
          border-radius: 1rem;
          padding-left: 2.25rem;
          margin-left: 1.25rem;
          align-self: center;
        }

        .iconfont {
          font-size: 1.25rem;
          color: #8c8c8c;
          position: absolute;
          left: 3.25rem;
          align-self: center;
        }
      }

      .storeInfo_box {
        background: #fff;
        width: 100%;
        // height: 7rem;
        border-radius: 20px 20px 0 0;
        padding: 0.625rem;
        position: relative;
        top: 1.75rem;
        left: 0;
        transition: all 0.4s ease-out 0s;

        .storeInfo {
          margin-left: 4.5rem;
        }

        .storeInfo .name {
          font-size: 16px;
          font-weight: bold;
          width: 16.3125rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
        }

        .storeInfo .time {
          font-size: 12px;
          margin-top: 0.3125rem;
          display: flex;
          align-items: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          span {
            margin-right: 0.625rem;
            line-height: 1.375rem;
            display: flex;
            align-content: center;

            .icon-service_j {
              font-size: 1.125rem;
              color: #f15353;
              margin-right: 0.25rem;
            }

            .icon-service_o {
              font-size: 1.125rem;
              color: #f15353;
              margin-right: 0.25rem;
            }
          }
        }

        .coupon-box {
          text-align: left;
          display: flex;
          margin-bottom: 0.4rem;

          .coupon-left {
            flex: 1;
            overflow-x: scroll;
            word-break: keep-all;
          }

          .red-span {
            color: #f15353;
            border: 1px solid #f15353;
            border-radius: 5px;
            padding: 0 0.2rem;
            margin-right: 0.5rem;
          }
        }

        .coupon-box .coupon {
          /* margin-top: 0.3125rem; */
          display: flex;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-left: 0.6rem;
          width: 22%;
          flex: 0 0 22%;
          color: #f15353;
        }

        .notice-box {
          text-align: left;
          font-size: 12px;
          color: #666;
          display: -webkit-box;
          text-overflow: ellipsis;
          overflow: hidden;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .storeImg {
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          overflow: hidden;
          background: #f2f2f2;
          position: absolute;
          left: 0.625rem;
          top: -1rem;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
      }

      .menu_evaluate_business {
        background: #fff;
        margin-top: 1.75rem;

        .nav {
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.9375rem;

          /* border-bottom: solid 0.0625rem #ebebeb; */
          .select {
            display: flex;

            li {
              margin-right: 1.875rem;
              font-size: 15px;
              color: #999;

              span {
                display: inline-block;
                line-height: 2.5rem;
              }

              .current {
                font-size: 16px;
                font-weight: bold;
                color: #333;
                position: relative;
              }

              .current::after {
                content: '';
                width: 100%;
                height: 0.1875rem;
                background: #f15353;
                position: absolute;
                bottom: 0;
                left: 0;
              }
            }
          }

          .buy_btn {
            font-size: 12px;
            border: solid 0.0625rem #f15353;
            border-radius: 1rem;
            height: 1.625rem;
            padding: 0 0.625rem;
            color: #f15353;
          }

          .car_btn {
            font-size: 12px;
            border: solid 0.0625rem #ff9800;
            border-radius: 1rem;
            height: 1.625rem;
            padding: 0 0.625rem;
            color: #ff9800;
          }
        }
      }

      .goods_box {
        background: #f2f2f2;
        display: flex;
        position: absolute;
        width: 100%;
        height: 83%;
        overflow: hidden;

        .sort_box {
          height: 100%;
          overflow: hidden;
          flex: 0 0 5rem;
          background: #fff;

          .second {
            background: #fff;
            position: relative;
          }

          .second::after {
            height: 100%;
            content: '';
            width: 0.0625rem;
            position: absolute;
            top: 0;
            right: 0;

            /* border-right: 1px solid #999999; */
            transform: scaleX(0.5);
          }

          .box {
            li {
              text-align: center;
              color: #999;

              strong {
                min-height: 2.875rem;
                -webkit-box-pack: center;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                display: flex;
                align-items: center;
                padding: 0 0.5rem;
                font-size: 12px;

                var {
                  line-height: 1.25rem;
                  font-size: 14px;
                }
              }

              .current {
                background: #fff;
                color: #f15353;
                position: relative;
              }

              /* .current::before {
                content: "";
                background: #f15353;
                width: 0.3rem;
                height: 100%;
                position: absolute;
                top: 0;
                left: -0.0625rem;
              } */
            }

            .current1 .first {
              color: #333;
              position: relative;

              var {
                font-weight: bold;
              }
            }

            .current1 .first::before {
              content: '';
              background: #f15353;
              width: 0.3rem;
              height: 100%;
              position: absolute;
              top: 0;
              left: -0.0625rem;
            }
          }
        }

        .goods_list {
          flex: 1;
          height: 100%;
          overflow: hidden;
          background: #fff;

          .title {
            /* background: #f2f2f2; */
            line-height: 1.875rem;
            font-size: 12px;
            padding: 0 0.625rem;
            text-align: left;
          }

          .Goods {
            display: flex;
            padding: 0.625rem;
            position: relative;

            .goodsImg {
              width: 5rem;
              height: 5rem;
              background: #f2f2f2;
              border-radius: 0.25rem;
              overflow: hidden;
              margin-right: 0.625rem;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .goods_right {
              .goodsName {
                text-align: left;
                width: 11.3125rem;

                .name {
                  font-size: 16px;
                  font-weight: bold;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }

                .buy {
                  font-size: 12px;
                  color: #8c8c8c;
                  margin-top: 0.175rem;
                }

                .sum {
                  font-size: 18px;
                  color: #f15353;
                  margin-top: 0.125rem;

                  span {
                    font-size: 14px;
                  }
                }

                .sum1 {
                  box-sizing: border-box;
                  color: #fff;
                  font-size: 0.5rem;
                  height: 1.25rem;
                  line-height: 1.25rem;
                  overflow: hidden;

                  span {
                    font-size: 0.5rem;
                    background: #f15353;
                    padding: 0.2rem 0.5rem;
                    border-top-left-radius: 0.5rem;
                    border-bottom-right-radius: 0.5rem;
                  }
                }
              }

              .specBtn {
                position: absolute;
                bottom: 0.625rem;
                right: 0.625rem;

                .goods-num {
                  position: absolute;
                  z-index: 10;
                  border-radius: 0.6rem;
                  padding: 0 0.3125rem;
                  top: -8px;
                  right: -9px;
                  background: #ff5d5c;
                  color: #fff;
                }

                button {
                  font-size: 12px;
                  background: #f15353;
                  color: #fff;
                  border-radius: 1rem;
                  width: 3.25rem;
                  height: 1.5rem;
                }
              }

              .addBtn {
                position: absolute;
                bottom: 0.625rem;
                right: 0.625rem;
                display: flex;

                .iconfont {
                  width: 1.75rem;
                  height: 1.75rem;
                  line-height: 1.75rem;
                  font-size: 26px;
                  color: #f15353;
                }

                .icon-store_reduceLine {
                  color: #aaa;
                }

                input {
                  width: 2rem;
                  text-align: center;
                  font-size: 12px;
                }
              }
            }
          }
        }
      }

      .evaluate_box {
        background: #f5f5f5;

        .evaluate_number {
          padding: 0.9375rem 0;
          background: #fff;

          .evaluate_info {
            display: flex;

            li {
              width: 50%;

              h6 {
                font-size: 28px;
              }

              span {
                font-size: 14px;
                color: #8c8c8c;
              }
            }

            li:first-child {
              border-right: solid 0.0625rem #ebebeb;
            }
          }
        }

        .evaluate_list {
          margin-top: 0.625rem;

          .user_box {
            display: flex;
            padding: 0.9375rem 0.9375rem 0;
            overflow: hidden;
            margin-bottom: 0.625rem;
            background: #fff;
            border-radius: 0.5rem;

            .ueser_img {
              width: 2.25rem;
              height: 2.25rem;
              border-radius: 2rem;
              background: #f2f2f2;
              overflow: hidden;
              margin-right: 0.625rem;

              img {
                width: 100%;
              }
            }

            .user_info {
              width: 100%;

              .info_a {
                text-align: left;
                display: flex;

                .name_date {
                  display: flex;
                  flex-wrap: wrap;
                  align-content: center;
                  flex: 1;

                  .name {
                    font-size: 14px;
                    width: 100%;
                    overflow: hidden; /* 超出部分隐藏 */
                    text-overflow: ellipsis; /* 超出部分显示省略号 */
                    white-space: nowrap; /* 规定段落中的文本不进行换行 */
                  }
                }
              }

              .date {
                font-size: 12px;
                color: #8c8c8c;
              }

              .text {
                font-size: 14px;
                line-height: 1.25rem;
                margin-top: 0.625rem;
                text-align: left;
              }

              .img_box {
                display: flex;
                flex-wrap: nowrap;
                margin-top: 0.3125rem;

                .img {
                  width: 5.9375rem;
                  height: 5.9375rem;
                  overflow: hidden;
                  background: #f2f2f2;
                  margin-right: 0.4375rem;
                  margin-bottom: 0.4375rem;
                  flex-shrink: 0;

                  img {
                    width: 100%;
                    height: 100%;
                  }
                }
                // .img:nth-child(3n) {
                //   margin-right: 0;
                // }
              }

              .goodlnfo {
                height: 2.5rem;
                display: flex;
                text-align: left;
                margin: 0.625rem 0;

                img {
                  width: 2.5rem;
                  height: 2.5rem;
                  margin-right: 0.625rem;
                }

                .goodMain {
                  flex: 1;
                  margin-right: 0.625rem;

                  .titless {
                    width: 11rem;
                    overflow: hidden; /* 超出部分隐藏 */
                    text-overflow: ellipsis; /* 超出部分显示省略号 */
                    white-space: nowrap; /* 规定段落中的文本不进行换行 */
                  }

                  .price {
                    color: #f15353;
                  }
                }

                .sales {
                  width: 20%;
                  line-height: 2.5rem;
                  font-size: 12px;
                  text-align: right;
                }
              }
            }
          }
        }
      }

      .store_box {
        background: #fff;
        min-height: 70vh;

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

            .img-box2 {
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
      }

      .Go_settle {
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 3.125rem;
        background: #f2f2f2;
        display: flex;
        justify-content: space-between;
        z-index: 3000;

        .iconfont {
          /* background: url(../../../assets/images/store_car1.png) no-repeat center; */

          /* background-size: 4rem; */
          width: 3.5rem;
          height: 3.5rem;

          /* line-height: 4rem; */
          color: #fff;
          font-size: 3rem;
          position: absolute;
          left: 0.625rem;
          bottom: 0.5rem;
          transition: transform 0.4s ease-out 0s;
          background: #b1b1b1;
          border-radius: 50%;
          padding: 0.2rem;
        }

        p {
          font-size: 16px;
          color: #666;
          padding-left: 5rem;
          line-height: 3.125rem;
        }

        button {
          width: 6rem;
          height: 2.188rem;
          border-radius: 15px;
          background: #b1b1b1;
          color: #fff;
          font-size: 16px;
          align-self: center;
          justify-self: center;
        }
      }

      .complete {
        .number {
          position: absolute;
          top: -0.5rem;
          left: 3.3rem;
          z-index: 10;
          padding: 0 0.3125rem;
          height: 0.9375rem;
          line-height: 0.9375rem;
          border-radius: 0.4375rem;
          text-align: center;
          font-size: 10px;
          background: #fff;
          color: #333;
        }

        .iconfont {
          /* background: url(../../../assets/images/store_car2.png) no-repeat center; */

          /* background-size: 4rem; */
          width: 3.5rem;
          height: 3.5rem;

          /* line-height: 4rem; */
          color: #fff;
          font-size: 3rem;
          //position: absolute;
          //left: 0.625rem;
          //bottom: -0.1rem;
          transition: transform 0.4s ease-out 0s;
          background: #f15353;
          border-radius: 50%;
          padding: 0.2rem;
        }

        p {
          color: #f15353;
          transition: transform 0.4s ease-out 0s;
        }

        button {
          width: 5.688rem;
          height: 2.188rem;
          border-radius: 15px;
          background: #f15353;
          color: #fff;
          font-size: 16px;
          align-self: center;
          justify-self: center;
        }
      }

      .top {
        display: flex;
        justify-content: space-between;
        padding: 0 0.875rem;
        align-items: center;
        height: 2.5rem;
        font-size: 16px;
        border-bottom: solid 0.0625rem #ebebeb;

        .icon-all_buycar {
          /* display: block; */

          /* background: url(../../../assets/images/store_car2.png) no-repeat center; */

          /* background-size: 2.5rem; */
          align-self: center;
          width: 2rem;
          height: 2rem;
          font-size: 1.8rem;
          color: #fff;
          background: #f15353;
          border-radius: 50%;
        }

        .select {
          font-size: 16px;
          color: #8c8c8c;
          margin-left: 0.25rem;
          line-height: 2.5rem;
        }

        .clear_car {
          font-size: 14px;
          color: #666;
          display: flex;
          align-items: center;

          .iconfont {
            font-size: 1.125rem;
            color: #666;
            margin-right: 0.25rem;
          }
        }
      }

      .carPopup {
        max-height: 22rem;
        overflow: auto;

        .goodsList {
          padding: 0 0.875rem;

          .goods {
            border-bottom: solid 0.0625rem #ebebeb;
            display: flex;
            position: relative;
            padding: 0.625rem 0;
            align-items: center;

            .goods_img {
              width: 3.375rem;
              height: 3.375rem;
              border-radius: 0.125rem;
              overflow: hidden;
              background: #f2f2f2;
              margin-right: 0.625rem;
              margin-left: 0.625rem;

              img {
                width: 100%;
              }
            }

            .goodsName {
              width: 13.75rem;
              text-align: left;

              .name {
                font-size: 15px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .price {
                color: #f15353;
                font-size: 16px;
                margin-top: 0.625rem;
              }
            }

            .addBtn {
              position: absolute;
              bottom: 0.625rem;
              right: 0;
              display: flex;

              .iconfont {
                width: 1.75rem;
                height: 1.75rem;
                line-height: 1.75rem;
                font-size: 1.625rem;
                color: #f15353;
              }

              .icon-store_reduceLine {
                color: #aaa;
              }

              input {
                width: 2rem;
                text-align: center;
                font-size: 12px;
              }
            }
          }
        }
      }

      .food-list-title {
        border-radius: 0.625rem 0.625rem 0 0;
        width: 100%;
        background-color: #fff;
        border-bottom: solid 0.0625rem #ebebeb;
        line-height: 1.875rem;
        font-size: 12px;
        padding: 0 0.625rem;
        text-align: left;
      }

      .title {
        border-radius: 0.625rem 0.625rem 0 0;
        width: 100%;
        background-color: #fff;
        line-height: 2.75rem;
        font-size: 16px;
        position: absolute;
        top: 0;

        i {
          position: absolute;
          right: 0.875rem;
          line-height: 2.75rem;
          color: #999;
          font-size: 1.125rem;
        }
      }

      .spec_big_box {
        position: relative;
        background: #fff;
        width: 20.625rem;
        height: 24.375rem;
        border-radius: 0.625rem;
      }

      .spec_box {
        background: #fff;
        height: 17.375rem;
        overflow-y: scroll;
        position: absolute;
        top: 2.5rem;

        .spec_a {
          margin-top: 0.625rem;

          h5 {
            display: block;
            line-height: 2.5rem;
            text-align: left;
            padding-left: 1.25rem;
          }

          .option {
            display: flex;
            padding: 0 1.25rem;
            flex-wrap: wrap;

            .cur {
              border: solid 0.0625rem #f15353;
              background: #faf0f0;
            }

            li {
              cursor: pointer;
              padding: 0 6px;
              min-height: 1.875rem;
              line-height: 1.875rem;
              margin-right: 0.625rem;
              margin-bottom: 0.625rem;
              background: #f5f5f5;
              border: solid 0.0625rem #ebebeb;
              border-radius: 0.1875rem;
            }
          }
        }
      }

      .add_car {
        width: 100%;
        height: 3.4375rem;
        line-height: 3.4375rem;
        background-color: #fff;
        border-top: solid 0.0625rem #ebebeb;
        border-radius: 0 0 0.625rem 0.625rem;
        position: absolute;
        bottom: 0;

        .car_btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.875rem;

          .left {
            color: #f15353;
            font-size: 16px;
            text-align: left;
            flex: 0 0 13rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            span {
              font-size: 16px;
            }
          }

          .right span {
            display: block;
            width: 5.5625rem;
            height: 1.875rem;
            line-height: 1.875rem;
            border-radius: 1rem;
            background: #f15353;
            color: #fff;
            font-size: 14px;
          }
        }
      }
    }

    .Box {
      position: absolute;
      bottom: 0.625rem;
      right: 0.625rem;
      display: flex;

      .iconfont {
        width: 1.75rem;
        height: 1.75rem;
        line-height: 1.75rem;
        font-size: 26px;
        color: #f15353;
      }

      .icon-store_reduceLine {
        color: #aaa;
      }

      input {
        width: 2rem;
        text-align: center;
        font-size: 12px;
      }
    }

    .Box label {
      right: 2.1875rem;
      color: #333;
      font-size: 12px;
      padding: 0;
      width: 1.5rem;
      height: 1.75rem;
      overflow: hidden;
      display: inline-block;
      text-align: center;
      line-height: 1.75rem;
      vertical-align: top;
      -webkit-background-origin: content-box;
      background-origin: content-box;
      background-color: transparent;
    }

    .Box .hide {
      display: none;
    }

    /* 选规格end */
  }

  .pcStyle {
    .goods_box,
    .Go_settle,
    .search_top {
      width: 375px !important;
    }
  }

  .pc {
    position: absolute !important;
  }
</style>
