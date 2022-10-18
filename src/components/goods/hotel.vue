<template>
  <transition name="fade2">
    <div id="goods" v-show="showGood" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <div id="navTab" :class="{ hoet: hoet }">
        <a class="nav1" :class="{ current: currentClass == 0 }" @click.stop="jump(0)">商品</a>
        <a class="nav1" :class="{ current: currentClass == 1 }" @click.stop="jump(1)">评价</a>
        <a class="nav1" :class="{ current: currentClass == 2 }" @click.stop="jump(2)">详情</a>
        <a class="nav1" :class="{ current: currentClass == 3 }" @click.stop="jump(3)" v-if="is_room == 1 && !fun.isTextEmpty(recordsList)">直播</a>
      </div>
      <div id="hoid" @click="goBack" :class="{ hoet: hoet }">
        <div id="back">
          <i class="iconfont icon-member-left"></i>
        </div>
      </div>
      <div id="cart" :class="{ hoet: hoet }">
        <div id="back" @click="gotoHome">
          <i class="iconfont icon-ai-home"></i>
        </div>
      </div>
      <div id="member" @click="gotoMember" :class="{ hoet: hoet }">
        <div id="back">
          <i class="iconfont icon-wode-wode"></i>
        </div>
      </div>
      <div ref="onePage" id="onePage" style="overflow: hidden; min-height: 100vh;">
        <div style="-webkit-overflow-scrolling: touch; min-height: 101vh;" id="main">
          <viewer :images="goods_info.thumb_url" class="section" style="position: relative;">
            <c-myswipe :style="{ height: fun.getPhoneEnv() == 3 ? '375px' : '100vw' }" :pagination-visible="true" :slides="goods_info.thumb_url" :repeating="true" :auto="0" class="banner_pcStyle">
              <div v-if="!fun.isTextEmpty(goods_info.goods_video)">
                <video
                  id="goods_vedio"
                  style="width: 100%; height: 100%; object-fit: scale-down;"
                  :poster="goods_info.video_image"
                  :src="goods_info.goods_video"
                  controls
                  webkit-playsinline="true"
                  playsinline="true"
                  x5-playsinline="true"
                  x-webkit-airplay="true"
                  x5-video-ignore-metadata="true"
                  width="100%"
                  height="100%"
                >
                  <source :src="goods_info.goods_video" />
                </video>
              </div>
              <div v-if="!goods_info.thumb_url || goods_info.thumb_url == null">
                <img :src="goods_info.thumb" width="100%" />
              </div>
              <div v-for="(ithumb, index) in goods_info.thumb_url" :key="index">
                <template v-if="ithumb">
                  <img :src="ithumb" width="100%" />
                </template>
              </div>
            </c-myswipe>
          </viewer>
          <float-order v-if="showGood" :broadcast_data="goods_plugin.broadcast_data"></float-order>
          <van-row>
            <!--<el-row>-->
            <div class="info-box">
              <div class="title-box">
                <h2>
                  <van-col :span="24" id="price">
                    {{ $i18n.t("money") }}
                    <span id="price-num">
                      {{ goods_info.price }}
                    </span>
                    <del id="original-del"><span class="original-price">房价以当天价格为准</span></del>
                  </van-col>
                </h2>
                <i class="iconfont icon-erweima" @click="postShow()"></i>
                <i class="iconfont icon-fenxiang" @click="shareWeixin()"></i>
              </div>
              <van-col :span="24" id="titleBox">
                <van-col :span="19" class="title"
                  ><h1 style="-webkit-box-orient: vertical;">{{ goods_info.title | escapeTitle }}</h1></van-col
                >
                <van-col :span="5" class="coupon"
                  ><span @click="gotoCoupon"> 领券 <i class="fa fa-angle-right"></i></span
                ></van-col>
              </van-col>
            </div>
          </van-row>

          <div class="act-box">
            <ul class="fee">
              <li>
                <span><i class="iconfont icon-service_l"></i></span>
              </li>
              <li style="margin-left: 0.5rem; color: #000;">
                <span>{{ hotel_info.hotel_name }}</span>
              </li>
            </ul>
            <ul class="fee">
              <li>
                <span><i class="iconfont icon-service_m"></i></span>
              </li>
              <li style="margin-left: 0.5rem; color: #000;">
                <span
                  ><a :href="'tel:' + hotel_info.hotel_mobile" style="color: #000;">联系{{ PageNameList.hotels }}:{{ hotel_info.hotel_mobile }}</a></span
                >
              </li>
            </ul>
          </div>
          <!-- 微贴 start -->
          <invitation :goods_plugin="goods_info_hotel"></invitation>
          <!-- 微贴 end -->
          <c-comment
            class="section"
            :commentInfo="commentLimit ? commentLimit.data : []"
            :tatal="commentLimit ? commentLimit.total : 0"
            :rate="favorable_rate"
            :goods_id="this.$route.params.id"
            :isCup="true"
            v-on:RouterTo="FromTo"
          ></c-comment>

          <div class="pullUp" v-if="!showPageB">
            <img src="../../assets/images/goods/pull_up@2x.png" alt="" id="imgs" :class="[isPullUp ? 'rotateImg' : 'normalImg']" /><i id="loadMore">{{
              isPullUp ? "释放展开图文详情" : "上拉展开图文详情"
            }}</i>
          </div>
          <span v-if="!showPageB" style="display: inline-block; width: 100%; height: 4.5rem;"></span>
          <div id="shopInfo" ref="goodinfo" class="section" :class="{ goodTop: goodTop == true, bottomMargin: isMarginBottom }" v-if="showPageB">
            <p style="" class="title-text">商品详情</p>
            <div id="tabs">
              <div ref="goodPage" id="goodPage">
                <div>
                  <div id="goods_content" v-html="goodDetail.content"></div>
                  <p v-if="fun.isTextEmpty(goodDetail.content)" style="color: #666;">暂无该商品详情 ~</p>
                  <div class="like-list" v-if="!fun.isTextEmpty(goods_info.show_push)">
                    <div class="box06">
                      <div class="img">
                        <img src="../../assets/images/goods/like@2x.png" />
                      </div>
                      <h3 class="like">猜您喜欢</h3>
                    </div>
                    <div class="like-box">
                      <div class="box" v-for="item in goods_info.show_push" :key="item.id" @click="pushGoodGoto(item)">
                        <div class="goods-img">
                          <img :src="item.thumb" style="width: 100%; height: 100%;" />
                        </div>
                        <ul class="goods-info">
                          <li class="name" style=" -webkit-box-orient: vertical;">
                            {{ item.title | escapeTitle }}
                          </li>
                          <li class="pay">
                            <div class="left left1" v-if="goods_info.vip_level_status && goods_info.vip_level_status.status == 1">
                              <small style="color: red;">{{ $i18n.t("money") }}</small>
                              <span>{{ goods_info.vip_level_status.word }}</span>
                            </div>
                            <div class="left" v-else>
                              <small>{{ $i18n.t("money") }}</small>
                              {{ item.price }}
                            </div>
                            <div class="right" v-if="item.price != item.market_price">
                              <span v-show="parseInt(item.market_price)"
                                ><small>{{ $i18n.t("money") }}</small
                                >{{ item.market_price }}</span
                              >
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div class="cloud">
                      <div class="img"><img src="../../assets/images/cloud.png" /></div>
                      <h4>{{ $i18n.t("没有更多了") }}</h4>
                    </div>
                  </div>

                  <div class="live_list_div section" v-if="is_room == 1 && !fun.isTextEmpty(recordsList)">
                    <c-live :recordsList="recordsList" :showtitle="true"></c-live>
                    <span class="live_more_btn" v-if="showMoreLive" @click.stop="getLiveList(true)">{{ $i18n.t("加载更多") }}</span>
                    <span style="display: inline-block; width: 100%; height: 25rem; background-color: #f5f5f5; padding: 1.5rem 0;"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部菜单 -->
      <div class="goods_foot" :style="{ width: this.fun.getPhoneEnv() == 3 ? '375px' : '' }">
        <ul class="foot_a">
          <li>
            <i class="iconfont icon-collect-active" @click="onFavorite(favorite)" v-if="favorite"></i>
            <i class="iconfont icon-goods_collect" @click="onFavorite(favorite)" v-if="!favorite"></i>
            <span>{{ favorite ? "已收藏" : "未收藏" }}</span>
          </li>
        </ul>
        <ul class="foot_a">
          <li>
            <i class="iconfont icon-goods_kefu" @click="show1 = true"></i>
            <span>客服</span>
          </li>
        </ul>
        <button type="button" @click="order">立即预定</button>
      </div>
      <!-- 海报 -->
      <yz-goodsposter v-model="posterShow" :posterData="posterImg" :goodstype="true"></yz-goodsposter>
      <!-- 评价 -->

      <template v-if="showComment">
        <van-popup v-model="showComment" position="right" duration="0" :style="{ height: '100%', width: '100%' }">
          <van-nav-bar title="全部评价">
            <template #left>
              <span>
                <van-icon name="arrow-left" size="18" @click.native="CloseComment" color="#333" />
              </span>
            </template>
          </van-nav-bar>
          <!-- 商品评价 -->
          <c-commentlist v-on:clickMore="getCommentData" :list="third_content" :noMoreComment="noMoreComment" :isCup="isCup" v-if="showComment"></c-commentlist>
        </van-popup>
      </template>

      <van-popup v-model="show1" position="center" round style="width: 80%;">
        <div class="pop-content">
          <div class="pop-top">
            <div class="left" v-if="!fun.isTextEmpty(cservice)">
              <div class="wrap">
                <a :href="cservice">
                  <div class="image"><img src="../../assets/images/kf_online_contect@2x.png" /></div>
                </a>
                <div>在线联系</div>
              </div>
            </div>
            <div style="display: flex; align-items: center;" v-if="!fun.isTextEmpty(cservice) && !fun.isTextEmpty(service_mobile)">
              <div class="line"></div>
            </div>
            <div class="right" v-if="!fun.isTextEmpty(service_mobile)">
              <div class="wrap">
                <div class="image">
                  <a :href="`tel:${service_mobile}`"><img src="../../assets/images/kf_tel_contect@2x.png"/></a>
                </div>
                <div style="margin-top: 0.5rem;">{{ service_mobile }}</div>
              </div>
            </div>
          </div>
          <div class="pop-bottom" v-if="!fun.isTextEmpty(service_QRcode)">
            <div class="image">
              <img :src="service_QRcode" style="width: 100%; height: 100%;" />
            </div>
          </div>
          <i class="iconfont icon-close11" @click="show1 = false"></i>
        </div>
      </van-popup>
    </div>
  </transition>
</template>

<script>
import controller from "./hotel_controller";
export default controller;
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

#original-del {
  color: #8c8c8c;

  .original-price {
    font-size: 12px;
    margin-left: 12px;
    color: #8c8c8c;
    font-weight: 400 !important;
  }
}

.pcStyle {
  #hoid {
    width: 375px !important;
  }

  #cart {
    right: 50% !important;
    margin-right: -186px;
  }

  #member {
    right: 50% !important;
    margin-right: -150px;
  }

  .pcStyle_activity {
    .yd-popup-show {
      width: 375px !important;
      right: 50%;
      margin-right: -187.5px;
    }
  }

  .pcStyle_mint {
    width: 375px !important;
    box-sizing: border-box !important;

    #chooser_img {
      width: 5.81rem !important;
    }

    .right {
      margin-left: 8rem !important;
    }
  }

  .pcStyle_width {
    width: 375px !important;
  }

  .pcStyle_ydT {
    width: 375px;
    left: 50% !important;
    margin-left: -187.5px;
  }

  .pcStyle_ydC {
    width: 375px;
    margin: 0 auto;
  }

  #foot {
    width: 375px !important;
  }
}

.price-num1 {
  background: #f15353;
  color: white;
  padding: 0.2rem 0.5rem;
  border-top-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.fee {
  display: flex;

  i {
    font-size: 1.5rem !important;
    color: #666 !important;
  }
}

#comment {
  margin-top: 0.75rem;
  background: #fff;

  .evaTop {
    padding: 0 0.75rem;
    height: 2.375rem;
    line-height: 2.375rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .evaTo {
      display: flex;
      align-items: center;
    }
  }

  .ecaBottom {
    .evaLoop {
      text-align: left;

      .evaLoopmain {
        display: flex;
        flex-wrap: wrap;
        padding: 0.875rem 0.625rem;
        width: 200px;
        height: 6.25rem;
        overflow: hidden;
        margin: 0.875rem;
        margin-top: 0.5rem;
        -moz-box-shadow: 0 3px 15px #e6e6e6;
        -webkit-box-shadow: 0 3px 15px #e6e6e6;
        box-shadow: 0 3px 15px #e6e6e6;
        border-radius: 6px;

        img {
          width: 1.875rem;
          height: 1.875rem;
          border-radius: 100%;
          margin-right: 0.5rem;
        }

        .user {
          flex: 8;

          .username {
            width: 5rem;
            overflow: hidden; /* 超出部分隐藏 */
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /* 规定段落中的文本不进行换行 */
          }
        }

        .text {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-height: 1.25rem;
        }
      }

      .projects {
        height: 5rem;

        img {
          width: 2rem;
          height: 2rem;
          border-radius: 100%;
          margin-right: 0.5rem;
        }
      }
    }
  }
}

.projects1 {
  display: flex;
  text-align: left;
  padding: 0 1rem;
  margin-bottom: 0.5rem;

  img {
    width: 5rem;
    height: 5rem;
    border-radius: 15px;
    margin-right: 0.5rem;
  }

  .user {
    flex: 1;
  }

  .text {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-height: 1.25rem;
  }
}

.goods_foot {
  background: #fff;
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 3.0625rem;

  .foot_a {
    width: 25%;

    li {
      // padding: 0.25rem 0;
      border-top: solid 0.0625rem #ebebeb;

      i {
        font-size: 1.375rem;
        color: #666;
      }

      .icon-collect-active {
        color: #f7ba2a;
      }

      span {
        display: block;
        font-size: 12px;
        color: #666;
      }
    }
  }

  button {
    width: 50%;
    background: #f15353;
    color: #fff;
    font-size: 16px;
    border: none;
  }
}

.pop-content {
  width: 100%;
  padding: 3.1875rem 0;
  text-align: center;
  border-radius: 1.1875rem;
  background: #fff;

  .pop-top {
    display: flex;
    align-items: unset;
    justify-content: center;

    .left {
      width: 50%;
      display: flex;
      justify-content: center;

      .wrap {
        display: flex;
        flex-direction: column;
        align-items: center;

        .image {
          width: 2.625rem;
          height: 2.625rem;
          margin-bottom: 0.5rem;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .line {
      width: 1px;
      height: 1.625rem;
      background-color: #999;
    }

    .right {
      width: 50%;
      display: flex;
      justify-content: center;

      .wrap {
        display: flex;
        flex-direction: column;
        align-items: center;

        .image {
          width: 2.625rem;
          height: 2.625rem;
          margin-bottom: 0.5rem;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  .pop-bottom {
    margin-top: 1rem;
    width: 100%;
    display: flex;
    justify-content: center;

    .image {
      width: 50%;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .icon-close11 {
    position: absolute;
    right: 1rem;
    top: 1rem;
    font-size: 18px;
  }
}
</style>
