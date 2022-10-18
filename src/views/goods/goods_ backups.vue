<template>
  <!-- 没用到这个页面 -->
  <transition name="fade">
    <div id="goods">
      <div id="hoid" @click="goto" :class="{ hoet: hoet }">
        <div id="back"><i class="iconfont icon-member-left"></i></div>
      </div>
      <!-- <mt-loadmore
        :top-method="loadTop"
        @top-status-change="handleTopChange"
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        ref="loadmore"
        topPullText=""
        topDropText=""
        topLoadingText=""
        bottomPullText=""
        bottomDropText=""
        bottomLoadingText=""
      > -->
      <van-row>
        <van-col :span="19" :offset="1" id="tilie">
          {{ goodsInfo.title }}
        </van-col>
        <van-col :span="4">
          <div id="share" @click="shareWeixin()">
            <i class="fa fa-share-alt" aria-hidden="true"></i>
            <br/><span>分享</span>
          </div>
        </van-col>
      </van-row>
      <van-row>
        <van-col :span="10" :offset="1" id="price">
          {{$i18n.t("money")}}<span id="price-num">
              {{
                goodsInfo.has_option == 1
                  ? goodsInfo.min_price + "-" + goodsInfo.max_price
                  : goodsInfo.price
              }}</span
        >
        </van-col>
        <van-col :span="13" id="stockcontainer">
          库存:{{ goodsInfo.stock }} 销量:{{ goodsInfo.show_sales }}
        </van-col>
      </van-row>
      <div id="poeg">
        <div class="title">继续拖动，查看图文详情</div>
        <div class="spas"></div>
      </div>
      <div style="height: 3.75rem;"></div>
      <!-- </mt-loadmore> -->
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
                {{$i18n.t("money")}}<span id="option_price">{{ popPrice }}</span>
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
                    :key='i'
                    :name="specitem"
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
            <van-col :span="12">
              <div class="num">
                <button id="btn_minus">
                  <i class="fa fa-minus" @click="reduceGoods"></i>
                </button>
                <input
                  type="text"
                  id="total"
                  disabled="false"
                  v-model="goodsCount"
                />
                <button id="btn_plus">
                  <i class="fa fa-plus" @click="addGoods"> </i>
                </button>
              </div>
            </van-col>
          </van-row>
          <van-button
            size="small"
            type="danger"
            id="btsmall"
            @click="submitAction"
          >确认
          </van-button>
        </div>
      </van-popup>

      <van-row id="foot">
        <van-col :span="8">
          <div class="addfav" :class="{ nocar: !isGoods }" type="info">
            <template v-if="!favorite"
            ><i class="fa fa-star normal" @click="onFavorite(favorite)"></i>
              <br/>
              收藏
            </template>
            <template v-if="favorite">
              <i class="fa fa-star active" @click="onFavorite(favorite)"></i>
              <br/>
              收藏
            </template>
          </div>
        </van-col>
        <van-col :span="8">
          <div
            :class="{ cart: true, cell: true, nocar: !isGoods }"
            @click="addCart"
          >
            加入购物车
          </div>
        </van-col>
        <van-col :span="8">
          <div class="buy cell" :class="{ nocar: !isGoods }" @click="buyNow">
            立即购买
          </div>
        </van-col>
      </van-row>
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
