<template>
  <transition name="fade2">
    <div id="goods">
      <div id="hoid" @click="goto" :class="{ hoet: hoet }">
        <div id="back">
          <i class="iconfont icon-member-left"></i>
        </div>
      </div>
      <div id="cart" @click="gotoCart" :class="{ hoet: hoet }" v-if="is_o2o">
        <div id="back">
          <i class="iconfont icon-ai-home"></i>
        </div>
      </div>
      <div id="member" @click="gotoMember" :class="{ hoet: hoet }">
        <div id="back">
          <i class="iconfont icon-wode-wode"></i>
        </div>
      </div>
      <c-myswipe
        style="height: 100vw;"
        :pagination-visible="true"
        :slides="goodsInfo.thumb_url"
        :repeating="true"
        :auto="0"
      >
        <div v-for="(ithumb, index) in goodsInfo.thumb_url" :key="index">
          <template v-if="ithumb">
            <img :src="ithumb" width="100%"/>
          </template>
          <template v-if="!ithumb">
            <img src="../../assets/images/img_default.png" width="100%"/>
          </template>
        </div>
      </c-myswipe>

      <van-row>
        <van-col :span="21" id="tilie">
          {{ goodsInfo.title }}
        </van-col>
        <van-col :span="3">
          <div id="share" @click="shareWeixin()">
            <i class="fa fa-share-alt" aria-hidden="true"></i>
            <br/>
            <span>分享</span>
          </div>
        </van-col>
      </van-row>

      <van-row>
        <van-col :span="24" id="price" v-if="!isGoodsLove">
          <span id="price-num">{{
            goodsInfo.has_option == 1
              ? goodsInfo.min_price + "-" + goodsInfo.max_price
              : goodsInfo.price
          }}</span>
        </van-col>
        <van-col
          :span="24"
          id="price"
          style="background: #f2efef;"
          v-if="isGoodsLove"
        >
          <van-col
            :span="5"
            style="background: #ffe000; padding: 0.5rem; color: #000;"
          >
            <div
              id="price-num"
              style="font-size: 0.8rem; font-weight: 600; text-align: center;"
            >
              天天兑价
            </div>
            <div
              id="price-num"
              style="font-size: 0.8rem; font-weight: 600; text-align: center;"
            >
              {{$i18n.t("money")}}{{ goodsInfo.price }}
            </div>
          </van-col>
          <van-col :span="19" style="text-align: left; padding-left: 0.625rem;">
            <div
              id="price-num"
              style="font-size: 0.8rem; font-weight: 600; text-align: left; margin-bottom: 0.3125rem; margin-top: 0.3125rem;"
            >
              {{$i18n.t("money")}}{{
              goods_love_cash + " + " + goods_love_deduction + goods_love_name
              }}
            </div>
            <div
              id="price-num"
              style="font-size: 0.8rem; font-weight: 600; text-align: left; color: #000;"
            >
              <span v-show="parseInt(goodsInfo.market_price)">原价:{{$i18n.t("money")}}{{ goodsInfo.market_price }}</span>
            </div>
          </van-col>
        </van-col>
        <van-col :span="24" id="stockcontainer">
          <van-col :span="12"> 库存:{{ goodsInfo.stock }}</van-col>
          <van-col :span="12" class="sale">
            销量:{{ goodsInfo.show_sales }}
          </van-col>
        </van-col>
        <van-col v-if="is_o2o">
          <div id="select">
            <div
              id="left"
              @click="updateCart(goodsInfo.id, -1)"
              v-if="o2oCount > 0"
            >
              -
            </div>
            <span style="width: 1.25rem; font-size: 20px;">{{ o2oCount }}</span>
            <div id="right" @click="addCart1(goodsInfo)">+</div>
          </div>
        </van-col>
      </van-row>

      <van-button
        class="good_speci"
        v-if="!is_o2o && isGoods && goodsInfo.has_option != 1"
        @click="buyNow"
      >
        <span id="optiondiv">{{
          goodsCount > 0
            ? "已添加" + goodsCount + goodsInfo.sku
            : "请选择商品数量"
        }}</span>
        <i
          class="fa fa-angle-right"
          style="margin-right: 0; float: right; line-height: 2.75rem; font-size: 1.625rem; color: #666;"
        ></i>
      </van-button>

      <van-popup
        :style="{overflow:'visible'}"
        v-model="popupSpecs"
        position="bottom"
        class="mint-popup-4"
        closeOnClickModal="true"
      >
        <div class="specifications">
          <div class="shopimg">
            <div id="chooser_img">
              <img :src="popThumb"/>
            </div>
            <div class="right">
              <div class="price">
                {{$i18n.t("money")}}
                <span id="option_price">{{ popPrice }}</span>
              </div>
              <div class="option">库存{{ popStock }}{{ goodsInfo.sku }}</div>
              <div class="option">{{ goodsDescription }}</div>
            </div>
          </div>

          <div class="shopinfo noVantRadio">
            <dl v-for="(specs,i) in goodsInfo.has_many_specs" :key='i'>
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
                    v-for="(specitem,i) in specs.specitem"
                    :name="specitem"
                    :key='i'
                  >{{ specitem.title }}
                  </van-radio>
                </van-radio-group>
              </dd>
            </dl>
          </div>
          <van-row>
            <van-col :span="12" id="num">
              购买数量：
            </van-col>
            <van-col :span="11">
              <div class="num">
                <div class="leftnav" @click="reduceGoods">-</div>
                <input
                  type="text"
                  disabled="false"
                  class="shownum"
                  v-model="goodsCount"
                />
                <div class="rightnav" @click="addGoods">+</div>
              </div>
            </van-col>
          </van-row>
          <van-button
            size="small"
            id="btsmall"
            type="danger"
            @click="submitAction"
          >确认
          </van-button>
        </div>
      </van-popup>

      <van-popup
        :style="{overflow:'visible'}"
        v-model="popupSpecs2"
        position="bottom"
        class="mint-popup-4"
        closeOnClickModal="true"
      >
        <div class="specifications">
          <div class="shopimg">
            <div id="chooser_img">
              <img :src="popThumb"/>
            </div>
            <div class="right">
              <div class="price">
                {{$i18n.t("money")}}
                <span id="option_price">{{ popPrice }}</span>
              </div>
              <div class="option">库存{{ popStock }}{{ goodsInfo.sku }}</div>
              <div class="option">{{ goodsDescription }}</div>
            </div>
          </div>

          <van-row>
            <van-col :span="12" id="num">
              购买数量：
            </van-col>
            <van-col :span="11">
              <div class="num">
                <div class="leftnav" @click="reduceGoods">-</div>
                <input
                  type="text"
                  disabled="false"
                  class="shownum"
                  v-model="goodsCount"
                />
                <div class="rightnav" @click="addGoods">+</div>
              </div>
            </van-col>
          </van-row>
          <van-button size="small" id="btsmall" type="danger" @click="buyNowNew"
          >确认
          </van-button
          >
        </div>
      </van-popup>

      <div id="foot" v-if="!is_o2o">
        <div
          class="addfav"
          :class="{ nocar: !isGoods }"
          type="info"
          v-if="!is_o2o"
        >
          <template v-if="!favorite">
            <i class="fa fa-star normal" @click="onFavorite(favorite)"></i>
            收藏
          </template>
          <template v-if="favorite">
            <i class="fa fa-star active" @click="onFavorite(favorite)"></i>
            收藏
          </template>
        </div>
        <div class="addfav" type="info" v-if="!is_o2o">
          <template>
            <i class="fa fa-cart-plus active" @click="gotoCart1()"></i>
            购物车
          </template>
        </div>
        <template v-if="!isMiniApp">
          <div class="cservice" v-if="!is_o2o && cservice">
            <a :href="cservice"
            >{{ isMiniApp }} <i class="iconfont icon-kefu"></i>客服0</a
            >
          </div>
        </template>
        <div class="cservice" v-if="!is_o2o && cservice && isMiniApp">
          <div @click="gotoMiniAppCs">
            <i class="iconfont icon-kefu"></i>客服1
          </div>
        </div>

        <div
          :class="{ cart: true, cell: true, nocar: !isGoods || !isAddCart }"
          @click="addCart"
        >
          加入购物车
        </div>
        <div
          class="buy cell"
          :class="{ nocar: !isGoods }"
          v-if="!is_o2o"
          @click="buyNow"
        >
          立即购买
        </div>
      </div>
      <div id="store-position">
        <div class="store-box" v-if="is_o2o" @click="gotoList">
          <div class="store-name">
            <i class="iconfont icon-dianpu"></i><span>门店名称</span>
          </div>
          <div style="color: #8c8c8c;" class="flexName">{{ o2oName }}</div>
        </div>

        <div class="contact-box" v-if="is_o2o">
          <div class="contact">
            <a :href="o2oPhone"
            ><i class="iconfont icon-dianhua1"></i><span>联系商家</span></a
            >
          </div>
          <div class="position" @click="goToAdress">
            <i class="iconfont icon-dingwei"></i>
          </div>
        </div>
      </div>

      <div style="height: 0.625rem; clear: both;" v-if="is_o2o"></div>
      <div id="shopInfo" ref="goodinfo" :class="{ goodTop: goodTop == true, 'pcStyle':fun.getPhoneEnv() == 3 }">
        <div id="tabs">
          <van-tabs v-model="activeName">
            <van-tab name="first">
              <span slot="title" @click="handleClick('0')">商品介绍</span>
            </van-tab>
            <van-tab name="second">
              <span slot="title" @click="handleClick('1')">商品参数</span>
            </van-tab>
            <van-tab name="third">
              <span slot="title" @click="handleClick('2')">用户评价</span>
            </van-tab>
          </van-tabs>
          <div>
            <!-- <mt-tab-container v-model="activeName"> -->
            <div v-show="activeName=='first'">
              <!-- <mt-tab-container-item id="first"> -->
              <div id="goods_content" v-html="first_content"></div>
              <!-- </mt-tab-container-item> -->
            </div>
            <div v-show="activeName=='second'">
              <!-- <mt-tab-container-item id="second"> -->
              <div class="parameter" v-for="(item,i) in second_content" :key='i'>
                <div class="par-info">
                  <span class="name">{{ item.title }}</span>
                  <span class="value">{{ item.value }}</span>
                </div>
              </div>
              <!-- </mt-tab-container-item> -->
            </div>
            <div v-show="activeName=='third'">
              <!-- <mt-tab-container-item id="third"> -->
              <div style="margin-bottom: 3.125rem;">
                <div class="pj" v-for="(n,i) in third_content" :key='i'>
                  <div layout="row" layout-align="start center" id="user">
                    <div>
                      <img :src="n.head_img_url"/>
                    </div>
                    <div>{{ n.nick_name }}</div>
                    <div>{{ n.created_at }}</div>
                  </div>
                  <van-rate
                    v-model="n.level"
                    disabled
                    disabled-color="#ff9900"
                  />
                  <p>{{ n.content }}</p>

                  <div v-if="n.append">
                    <p class="last_day">
                      追评
                      <span>{{ n.append.created_at }}</span>
                    </p>
                    <p class="">{{ n.append.content }}</p>
                  </div>

                  <div class="comment">
                    <span @click="toContentInfo(n)"
                    >评论数:{{ n.reply_count }}</span
                    >
                  </div>
                </div>
              </div>
              <!-- </mt-tab-container-item> -->
            </div>
            <!-- </mt-tab-container> -->
          </div>
        </div>
        <div style="height: 3.75rem;"></div>
      </div>

      <div class="a2q" v-if="is_o2o">
        <div class="a2w ">
          <div></div>
        </div>
        <div class="a33">
          <p class="a34" hidegatherlist=""></p>
          <ul class="a35"></ul>
        </div>
        <div class="a2z"></div>
        <a
          href="javascript:void 0;"
          @click="goShowCart"
          v-show="!showCart"
          class="a2r outcartcontent show "
          :class="{ light: carts.length > 0 }"
        >
          <i class="a2s" v-show="carts.length > 0">{{ cartsNum }}</i>
        </a>
        <div class="a2t" :style="leftPrice">
          <div v-show="carts.length > 0" class="">{{$i18n.t("money")}}{{ cartsTotal }}</div>
          <div v-show="carts.length == 0" class="a2u">购物车是空的</div>
        </div>
        <a
          class="a2v"
          :class="{ disabled: goodsCarts.length == 0 }"
          @click="goodsOrder(goodsCarts)"
        >去结算</a
        >
        <div class="minicart-content" :style="minicartStyle">
          <a
            href="javascript:void 0;"
            @click="goShowCart"
            class="a2r incartcontent light"
            :class="showLogo"
          >
            <i class="a2s">{{ cartsNum }}</i>
          </a>
          <i class="a37"></i>
          <div class="a38 ">
            <span class="a4b a4c checked" checkallgoods="" @click="lg"
            >全选</span
            >
            <p class="a4e">(已选{{ cartsNum }}件)</p>
          </div>
          <div class="a3b">
            <div class="a3m single">
              <div class="a3r single" expandgift="single">
                <span></span>
                <div style="display: none;"></div>
              </div>
              <ul class="minicart-goods-list single">
                <li class="a3o single" v-for="(item,i) in carts" :key='i'>
                  <span
                    class="a4b a3p checked"
                    checkgoods=""
                    @click="checkCart(item.id)"
                  ></span>
                  <a class="a3s">
                    <table class="a3t">
                      <tbody>
                      <tr>
                        <td
                          style=" width: 3.875rem;"
                          @click="goToGoodsO2O(item)"
                        >
                          <img class="a3u" :src="item.goods.thumb"/>
                        </td>
                        <td>
                          <div class="a3x" @click="goToGoodsO2O(item)">
                            {{ item.goods.title }}
                          </div>
                          <div class="a46" @click="goToGoodsO2O(item)">
                            <div class="a3q">{{$i18n.t("money")}}{{ item.goods.price }}</div>
                          </div>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </a>
                  <a
                    @click="updateCart(item.goods_id, -1)"
                    class="a3v"
                    style="right: 3.8125rem; background-position: center -4.25rem;"
                  ></a>
                  <em style="" class="a3y">{{ item.total }}</em>
                  <a @click="updateCart(item.goods_id, 1)" class="a3w"></a>
                </li>
              </ul>
              <div class="a3n single" style=""></div>
            </div>
          </div>
        </div>
        <div
          class="a30"
          @click="goShowCart"
          style="display: block;"
          v-if="showCart"
        ></div>
        <div class="a30" v-if="!showCart"></div>
      </div>
    </div>
  </transition>
</template>

<script>
import goods from "./goods_controller";

export default goods;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/css/goods.scss";

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
</style>
