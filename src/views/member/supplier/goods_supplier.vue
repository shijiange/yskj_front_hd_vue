<template>
  <div id="supplier">
    <!-- 搜索栏 -->
    <div class="search-header">
      <i class="iconfont icon-all_search_2"></i>
      <div class="back-icon" @click="goBack">
        <van-icon name="arrow-left" color="#333" />
      </div>

      <div class="search" @click="goToSearch(0)">搜索本店商品</div>
      <div class="help-more">
        <i class="iconfont icon-fontclass-kefu" @click="goToService"></i>
        <i class="iconfont icon-more" @click="toggleSlide()"></i>
      </div>
    </div>
    <ul class="menu" v-if="sliderShow">
      <div class="spare">
        <van-icon class="iconfont icon-spare" custom size="1rem" color="#333"></van-icon>
      </div>
      <li @click="goToUrl('home', 'route')">
        <van-icon class="iconfont icon-home" custom size="1.25rem" color="#f5f5f5"></van-icon>
        <span>首页</span>
      </li>
      <li @click="goToUrl('orderlist', 'route')">
        <van-icon class="iconfont icon-order" custom size="1.25rem" color="#f5f5f5"></van-icon>
        <span>订单</span>
      </li>
      <li @click="goToUrl('member', 'route')">
        <van-icon class="iconfont icon-my" custom size="1.25rem" color="#f5f5f5"></van-icon>
        <span>我的</span>
      </li>
    </ul>
    <!-- 商铺信息 -->
    <div class="supplier-info">
      <div class="img">
        <i v-if="!supplierInfo.logo" class="iconfont icon-dianpu" style="color: #fff"></i>
        <img v-if="supplierInfo.logo" :src="supplierInfo.logo" alt="" />
      </div>
      <div class="info-content">
        <div class="shop-name">{{ fun.isTextEmpty(supplierInfo.store_name) ? supplierInfo.username : supplierInfo.store_name }}</div>
        <div class="goods-count">
          商品数量:
          <span style="color: #f14e4e">{{ indexData.list_count }}</span>
        </div>
      </div>
      <div class="find-info" @click="goToSupplierInfo">查看信息</div>
    </div>
    <!-- tabs-box -->
    <div class="tab-box">
      <van-tabs title-active-color="#f14e4e" @change="changeTab" v-model="tabActive" style="background: #fff">
        <van-tab title="首页">
          <div class="index-main">
            <!-- 轮播 -->
            <div class="isShowBanner" v-if="indexData.slide && indexData.slide.length > 0">
              <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
                <van-swipe-item v-for="item in indexData.slide" :key="item.id" @click="goToUrl(item.link,'href')">
                  <img width="100%" height="100%" :src="item.thumb" alt="" />
                </van-swipe-item>
              </van-swipe>
            </div>
            <!-- 热销 -->
            <div class="hot-sales-box" v-if="!fun.isTextEmpty(indexData.list_is_hot)">
              <div class="hot-sales-title">
                <img src="@/assets/images/goods_supplier_hot.png" alt="" />
              </div>
              <div class="hot-sales-content">
                <ul>
                  <li class="hot-sales-item" v-for="(item, index) in indexData.list_is_hot" :key="index" @click="goToDetail(item.id)">
                    <div class="hot-sales-img">
                      <img :src="item.thumb" style="width: 100%; height: 100%" />
                    </div>
                    <div class="hot-sales-info">
                      <p class="name">{{ item.title }}</p>
                      <p class="price" v-if="item.has_option == 1 && item.min_price">{{ $i18n.t("money") }} {{ item.min_price }}</p>
                      <p class="price" v-else>{{ $i18n.t("money") }} {{ item.price }}</p>
                    </div>
                  </li>
                  <div class="find-more" @click="goToSearch(1)" v-if="indexData.list_is_hot.length > 3">查看更多</div>
                </ul>
              </div>
            </div>
            <!-- 广告位 -->
            <div class="advertise-box" v-if="indexData.advs">
              <div class="left" @click="goToAdvertise(indexData.advs[0].link)" v-if="indexData.advs.length >= 1">
                <img :src="indexData.advs[0].img" alt="" />
              </div>
              <div class="right" @click="goToAdvertise(indexData.advs[1].link)" v-if="indexData.advs.length >= 2">
                <img :src="indexData.advs[1].img" alt="" />
              </div>
            </div>
            <!-- 店长推荐 -->
            <div class="shopkeeper-propose" v-if="!fun.isTextEmpty(indexData.list_is_recommand)">
              <div class="title">
                <img src="@/assets/images/goods_supplier_propose.png" alt="" />
              </div>
              <div class="goodsList">
                <activity :arr="indexData.list_is_recommand" :showMask="false"></activity>
                <div class="space">到底了~</div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="商品">
          <div class="goods-main">
            <c-sort :supplier="true" v-on:sortIn="sortOut"></c-sort>
            <div class="goodsList">.
              <activity :arr="goodsArr" :showMask="false"></activity>
              <div v-if="good_page >= good_total_page">
                <img style="width: 6rem" src="@/assets/images/no-more-product.png" alt="" />
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="活动">
          <div class="activity-main">
            <div class="goodsList">
              <activity :arr="actGoodsArr" :showMask="true"></activity>
              <div v-if="act_page >= act_total_page">
                <img style="width: 6rem" src="@/assets/images/no-more-product.png" alt="" />
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="分类" v-if="indexData.is_hidden_category == 0">
          <classify_view :sid="supplier_id" :cat_level="cat_level" ref="child"></classify_view>
        </van-tab>
        <!-- 直播间 -->
        <van-tab title="直播" v-if="is_room == 1 && recordsList && recordsList.length > 0">
          <template v-if="!fun.isTextEmpty(recordsList)">
            <c-live :recordsList="recordsList" :showtitle="false"></c-live>
            <span style="color: #999;" v-if="showMoreLive" @click.stop="getLiveList(true)">加载更多</span>
          </template>
          <img
            v-if="fun.isTextEmpty(recordsList)"
            style="width: 6rem;"
            src="../../../assets/images/no-more-product.png"
            alt=""
          />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
import supplier_controller from "./goods_supplier_controller";
export default supplier_controller;
</script>
<style lang="scss">
#supplier {
  background-color: #f6f6f6;

  // 搜索栏
  .search-header {
    position: relative;
    display: flex;
    align-items: center;
    height: 2.875rem;
    border-bottom: 1px solid #ebebeb;
    background-color: #fff;

    .back-icon {
      width: 2.8125rem;
    }
    .icon-all_search_2 {
      position: absolute;
      left: 3.75rem;
      bottom: 0.8125rem;
      font-size: 0.875rem;
    }
    .search {
      padding-left: 2.25rem;
      width: 14.375rem;
      height: 1.875rem;
      font-size: 0.875rem;
      text-align: left;
      line-height: 1.875rem;
      color: #666;
      background-color: #eff0f1;
      border-radius: 1.875rem;
    }
    .help-more {
      flex: 1;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
    .icon-fontclass-kefu,
    .icon-more {
      font-size: 1.125rem;
      font-weight: 700;
      color: #6d6d6d;
    }
  }
  // ... icon 对话框
  .menu {
    padding: 0 0.625rem;
    position: absolute;
    right: 0.375rem;
    z-index: 10;
    background: rgba(51, 51, 51, 0.9);
    color: #f0f0f0;
    border-radius: 0.25rem;
    width: 7.5rem;
    opacity: 1;

    .spare {
      position: absolute;
      right: 0.5rem;
      top: -0.8375rem;

      i {
        opacity: 0.9;
      }
    }

    li {
      display: flex;
      width: 100%;
      font-size: 0.875rem;
      height: 2.25rem;
      border-bottom: solid 0.0625rem #d6d6d6;

      i {
        line-height: 2.25rem;
        margin-right: 0.375rem;
      }

      span {
        line-height: 2.25rem;
      }
    }

    li:last-child {
      border: none;
    }
  }
  // 商铺信息
  .supplier-info {
    display: flex;
    align-items: center;
    height: 4.375rem;
    background-color: #fff;
    .img {
      margin-left: 1rem;
      width: 2.5rem;
      height: 2.5rem;
      text-align: center;
      line-height: 2.5rem;
      border-radius: 50%;
      background-color: #fadc5d;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info-content {
      flex: 1;
      padding-left: 0.5rem;
      text-align: left;
      font-weight: 700;
      color: #333333;
    }
    .shop-name {
      font-size: 0.9375rem;
      line-height: 1.125rem;
    }
    .goods-count {
      margin-top: 0.25rem;
      font-size: 0.6875rem;
      line-height: 1.125rem;
    }
    .find-info {
      margin-right: 1rem;
      width: 4.5rem;
      height: 1.5625rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: #fff;
      text-align: center;
      line-height: 1.5625rem;
      background-color: #f14e4e;
      border-radius: 0.8125rem;
    }
  }
  // tab
  .tab-box {
    .van-tabs__wrap {
      margin-bottom: 0.625rem;
      padding-right: 7.5rem;
      height: 2.75rem;
      font-weight: 700;
    }
    .van-tab--active {
      font-size: 1rem;
      font-weight: 700;
    }
    .van-tab__text--ellipsis {
      font-size: 0.8125rem;
      overflow: inherit;
    }
  }
  // 商品列表-公用样式item
  .goodsList {
    padding: 0 0.625rem;
    background-color: #f6f6f6;
  }
  .activityUL {
    display: flex;
    flex-wrap: wrap;
    .goods-item:nth-child(2n + 1) {
      margin-right: 0.56rem;
    }
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .space {
    font-size: 0.69rem;
    color: #9a9a9a;
  }
  // tab => 首页
  .index-main {
    .my-swipe {
      height: 10rem;
    }
    .hot-sales-box {
      .hot-sales-title {
        height: 4.125rem;
        background: #f6f6f6;
        img {
          margin-top: 1.125rem;
          width: 13.25rem;
          height: 1.875rem;
        }
      }
    }
    .hot-sales-content {
      padding: 0 0.3125rem;
      height: 12.75rem;
      background-color: #f6f6f6;
      ul {
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        width: 100%;
        overflow-x: auto;
        background-color: #f6f6f6;
      }
      .hot-sales-item {
        flex-shrink: 0;
        margin: 0 0.3125rem;
        width: 8.125rem;
        border-radius: 0.3125rem;
        overflow: hidden;
        background-color: #fff;
      }
      .hot-sales-img {
        height: 8.125rem;
        background-color: pink;
      }
      .hot-sales-info {
        padding: 0.625rem;
        height: 4.5625rem;

        .name {
          font-size: 0.75rem;
          font-weight: 700;
          line-height: 0.875rem;
          color: #2c2c2c;
          text-align: left;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .price {
          font-size: 0.75rem;
          font-weight: 700;
          color: #ff464c;
          line-height: 2.125rem;
          text-align: left;
        }
      }
      .find-more {
        width: 3.5rem;
        margin: 0 0.3125rem;
        padding: 3.625rem 1.375rem;
        font-size: 0.6875rem;
        color: #4c4c4c;
        border-radius: 0 1rem 1rem 0;
        line-height: 1.375rem;
        background-color: #eee;
      }
    }
    .advertise-box {
      display: flex;
      justify-content: space-between;
      margin: 1rem 0 0.125rem;
      padding: 0 0.625rem;
      height: 6.25rem;
      background-color: #f6f6f6;
      .left,
      .right {
        width: 10.8125rem;
        height: 6.25rem;
        background-color: pink;
        border-radius: 0.3125rem;
        overflow: hidden;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .shopkeeper-propose {
      background: #f6f6f6;
      .title {
        height: 4.125rem;
        img {
          margin-top: 18px;
          width: 254px;
          height: 30px;
        }
      }
    }
  }

  // tab => 活动
  .activity-main {
    padding-top: 0.625rem;
    background: #f6f6f6;
  }
  // tab => 分类
  .category-main {
    display: flex;
    .category-level_1 {
      width: 5.25rem;
      background-color: #fff;
      overflow-y: auto;

      .item-level_1 {
        width: 100%;
        font-size: 0.875rem;
        color: #666;
        line-height: 3.125rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .active-level_1 {
        font-size: 0.9375rem;
        color: #f15353;
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .right {
      width: 18.1875rem;
    }
    .category-level_2 {
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
      padding: 0.8125rem 0;
      width: 100%;
      overflow-x: auto;

      .item-level_2 {
        flex-shrink: 0;
        margin: 0 0.375rem;
        padding: 0 0.8125rem;
        font-size: 0.75rem;
        color: #7d7d7d;
        line-height: 1.375rem;
        border: 1px solid #bfbfbf;
        border-radius: 3px;
      }
      .active-level_2 {
        font-size: 0.75rem;
        color: #f15353;
        border: solid 1px #f15353;
      }
    }

    .category-level_3 {
      padding: 0 0.5rem;
      height: 60vh;
      overflow-y: auto;
      .title {
        height: 1.875rem;
        font-size: 0.9375rem;
        font-weight: 700;
        line-height: 1.875rem;
        text-align: left;
        letter-spacing: 1px;
        color: #212121;
      }
      .content {
        display: flex;
      }
      .item_li {
        margin: 0.25rem 0.25rem;
      }
      .img {
        width: 5.125rem;
        height: 5.125rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .name {
        height: 1.875rem;
        font-size: 0.8125rem;
        color: #333;
        line-height: 1.875rem;
      }
    }
  }
}
</style>