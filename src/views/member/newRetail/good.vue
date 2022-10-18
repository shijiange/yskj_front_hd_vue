<template>
  <transition>
    <div id="goods" v-if="showGood" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <div id="navTab" :class="{ hoet: hoet }">
        <a class="nav1" :class="{ current: currentClass == 0 }" @click.stop="jump(0)">商品</a>
        <a class="nav1" :class="{ current: currentClass == 1 }" @click.stop="jump(1)">评价</a>
        <a class="nav1" :class="{ current: currentClass == 2 }" @click.stop="jump(2)">详情</a>
      </div>
      <div id="hoid" @click="goto" :class="{ hoet: hoet }" v-if="isCup">
        <div id="back">
          <i class="iconfont icon-member-left"></i>
        </div>
      </div>
      <!-- <div id="cart" v-if="!is_o2o" :class="{ hoet: hoet }">
        <div id="back" v-if="!favorite" @click="onFavorite(favorite)">
          <i class="iconfont icon-bc_like_normal"></i>
        </div>
        <div id="back" v-if="favorite" @click="onFavorite(favorite)">
          <i class="iconfont icon-bc_like" style="color: #ff9601;"></i>
        </div>
      </div> -->
      <div id="member" @click="gotoMember" :class="{ hoet: hoet }" v-if="isCup" style="right: 0;">
        <div id="back">
          <!-- <i class="fa fa-user"></i> -->
          <i class="iconfont icon-wode-wode"></i>
        </div>
      </div>
      <div ref="onePage" id="onePage" style="overflow: hidden; min-height: 100vh;">
        <div style="-webkit-overflow-scrolling: touch; min-height: 101vh;" id="main">
          <viewer :images="goodsInfo.thumb_url" class="section" style="position: relative;">
            <c-myswipe :style="{ height: fun.getPhoneEnv() == 3 ? '375px' : '100vw' }" :pagination-visible="true" :slides="goodsInfo.thumb_url" :repeating="true" :auto="0" class="banner_pcStyle">
              <div v-if="!fun.isTextEmpty(goodsInfo.goods_video)">
                <video
                  id="goods_vedio"
                  style="width: 100%; height: 100%; object-fit: scale-down;"
                  :poster="goodsInfo.video_image"
                  :src="goodsInfo.goods_video"
                  controls
                  webkit-playsinline="true"
                  playsinline="true"
                  x5-playsinline="true"
                  x-webkit-airplay="true"
                  x5-video-ignore-metadata="true"
                  width="100%"
                  height="100%"
                >
                  <source :src="goodsInfo.goods_video" />
                </video>
              </div>
              <!-- 供应商其他图片为空的时候返回的是空数组 -->
              <div v-if="!goodsInfo.thumb_url || goodsInfo.thumb_url == null || goodsInfo.thumb_url.length == 0">
                <img :src="goodsInfo.thumb" width="100%" />
              </div>
              <div v-for="(ithumb, index) in goodsInfo.thumb_url" :key="index">
                <template v-if="ithumb">
                  <img :src="ithumb" width="100%" />
                </template>
              </div>
            </c-myswipe>
          </viewer>
          <div class="rob-time" v-if="isBuy && (isTime || isBegTime)">
            <ul class="price">
              <li class="text">限 时 购</li>
            </ul>
            <div class="time" v-if="!isBegTime">
              <span class="text">距离结束还有:</span>
              <van-count-down :time="fun.getTimeDifference(fun.getTimestamp(endTimeStr))" class="bottom_time" format="DD 天 HH 时 mm 分 ss 秒">
                <template #default="timeData">
                  <em style="padding: 0.15rem 0.125rem; border-radius: 0.125rem;">{{ timeData.days }} </em> <span style="margin: 0 0.125rem;">天</span>
                  <em style="padding: 0.15rem 0.125rem; border-radius: 0.125rem;">{{ timeData.hours }} </em>
                  <b>:</b>
                  <em style="padding: 0.15rem 0.125rem; border-radius: 0.125rem;">{{ timeData.minutes }} </em>
                  <b>:</b>
                  <em style="padding: 0.15rem 0.125rem; border-radius: 0.125rem;">{{ Number(timeData.seconds) < 10 ? `0${timeData.seconds}` : timeData.seconds }} </em>
                </template>
              </van-count-down>
            </div>
            <div class="time" v-if="isBuy && isBegTime">
              <span class="text">距开始还剩：</span>
              <van-count-down :time="begTimeStr" format="DD 天 HH 时 mm 分 ss 秒" class="bottom_time" @finish="begTimeBtn">
                <template #default="timeData">
                  <em style="padding: 0.15rem 0.125rem; border-radius: 0.125rem;">{{ timeData.days }} </em> <span style="margin: 0 0.125rem;">天</span>
                  <em style="padding: 0.15rem 0.125rem; border-radius: 0.125rem;">{{ timeData.hours }} </em>
                  <b>:</b>
                  <em style="padding: 0.15rem 0.125rem; border-radius: 0.125rem;">{{ timeData.minutes }} </em>
                  <b>:</b>
                  <em style="padding: 0.15rem 0.125rem; border-radius: 0.125rem;">{{ Number(timeData.seconds) < 10 ? `0${timeData.seconds}` : timeData.seconds }} </em>
                </template>
              </van-count-down>
            </div>
          </div>
          <van-row>
            <div class="info-box">
              <div class="title-box">
                <!-- 天天兑价 -->
                <div class="DpBox" v-if="isGoodsLove">
                  <div class="daydayPrice">
                    天天兑价
                    <span>{{ $i18n.t("money") }}{{ goods_love_cash + "+" + goods_love_deduction + goods_love_name }}</span>
                  </div>
                </div>
                <h2>
                  <van-col :span="24" id="price" v-if="!isGoodsLove">
                    <div class="point-good" v-if="goodsInfo.point_goods">
                      <!-- goodsInfo.point_goods积分商城   ==>  积分全抵扣  不显示其他价格或者爱心值-->
                      <span id="price-num" class="point-good-price"
                        >{{
                          goodsInfo.has_option == 1
                            ? goodsInfo.point_goods.min_point == goodsInfo.point_goods.max_point
                              ? goodsInfo.point_goods.min_point
                              : goodsInfo.point_goods.min_point + "-" + goodsInfo.point_goods.max_point
                            : goodsInfo.point_goods.min_point
                        }}
                        <span class="point-text" style="font-size: 12px;">{{ integral }}</span
                        ><em v-if="isRent">/天</em>
                      </span>
                    </div>
                    <div class="show_price_box" v-else-if="goodsInfo.goods_show && goodsInfo.goods_show.goods_detail_style == 1">
                      <div class="show_price">
                        {{ fun.getPrice() }}：{{ $i18n.t("money")
                        }}{{ goodsInfo.has_option == 1 ? (goodsInfo.min_price == goodsInfo.max_price ? goodsInfo.max_price : goodsInfo.min_price + "-" + goodsInfo.max_price) : goodsInfo.price
                        }}<em v-if="isRent">/天</em>
                      </div>
                      <div class="show_price" v-for="(item, i) in goodsInfo.goods_show.data" :key="i">
                        <p class="other_price" :class="[i % 2 == 0 ? 'red_white' : 'white_red']">{{ item.name }}：{{ item.value }}</p>
                      </div>
                    </div>
                    <template v-else-if="!goodsInfo.goods_show || goodsInfo.goods_show.goods_detail_style != 1">
                      <span v-if="fun.getPrice() && !goodsInfo.coupon" style="margin-right: 5px;">
                        {{ fun.getPrice() }}
                      </span>
                      <span v-if="goodsInfo.coupon">券后价</span>{{ $i18n.t("money") }}
                      <span id="price-num" class="price-num1" v-if="goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1" style="font-size: 14px; font-weight: 500;">
                        {{ goodsInfo.vip_level_status.word }}
                      </span>
                      <span id="price-num" v-else-if="goodsInfo.coupon">{{ goodsInfo.coupon.deduct_price }}</span>
                      <span id="price-num" v-else
                        >{{ goodsInfo.has_option == 1 ? (goodsInfo.min_price == goodsInfo.max_price ? goodsInfo.max_price : goodsInfo.min_price + "-" + goodsInfo.max_price) : goodsInfo.price
                        }}<em v-if="isRent">/天</em>
                      </span>
                      <del id="original-del" v-if="parseInt(goodsInfo.market_price) && goodsInfo.market_price != goodsInfo.price"
                        ><span class="original-price">{{ fun.getMarketPrice() }}:{{ $i18n.t("money") }}{{ goodsInfo.market_price }}</span></del
                      >
                    </template>
                  </van-col>
                  <!-- 天天兑价 -->
                  <van-col :span="24" id="price" v-if="isGoodsLove">
                    <template>
                      <span v-if="fun.getPrice() && !goodsInfo.coupon" style="margin-right: 5px;">
                        {{ fun.getPrice() }}
                      </span>
                      <span v-if="goodsInfo.coupon">券后价</span>{{ $i18n.t("money") }}
                      <span
                        id="price-num"
                        v-if="goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1"
                        :class="[goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1 ? 'pricePower' : '']"
                        >{{ goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1 ? goodsInfo.vip_level_status.word : goodsInfo.price }}<em v-if="isRent">/天</em></span
                      >
                      <span id="price-num" v-else-if="goodsInfo.coupon">{{ goodsInfo.coupon.deduct_price }}</span>
                      <span id="price-num" v-else
                        >{{ goodsInfo.has_option == 1 ? (goodsInfo.min_price == goodsInfo.max_price ? goodsInfo.max_price : goodsInfo.min_price + "-" + goodsInfo.max_price) : goodsInfo.price
                        }}<em v-if="isRent">/天</em></span
                      >
                    </template>

                    <del id="original-del" v-if="parseInt(goodsInfo.market_price) && goodsInfo.market_price != goodsInfo.price">
                      <span class="original-price">{{ fun.getMarketPrice() }}:{{ $i18n.t("money") }}{{ goodsInfo.market_price }}</span
                      ><em v-if="isRent">/天</em>
                    </del>
                  </van-col>
                </h2>
                <i class="iconfont icon-erweima" @click="postShow()"></i>
                <i class="iconfont icon-fenxiang" @click="isShowSharePopup()"></i>
                <div class="share_text" @click="isShowSharePopup()">分享</div>
              </div>
              <div style="display: flex;">
                <div class="goods-dicount" v-if="goodsInfo.coupon && goodsInfo.coupon.coupon_method == 1">优惠券{{ $i18n.t("money") }}:{{ goodsInfo.coupon.deduct }}</div>
                <div class="goods-dicount" v-if="goodsInfo.coupon && goodsInfo.coupon.coupon_method == 2">折扣:{{ goodsInfo.coupon.discount }}折</div>
                <div class="pub-price" v-if="goodsInfo.team_sales_first">推广赚{{ $i18n.t("money") }}{{ goodsInfo.team_sales_first }}</div>
              </div>
              <van-col :span="24" id="titleBox">
                <van-col :span="19" class="title"
                  ><h1 style="-webkit-box-orient: vertical;">{{ goodsInfo.title | escapeTitle }}</h1></van-col
                >
                <van-col :span="5" class="coupon" v-if="isCup"
                  ><span @click="gotoCoupon" v-if="goodsInfo.availability && goodsInfo.availability == 1 ? true : false"> 领券 <i class="fa fa-angle-right"></i></span
                ></van-col>
              </van-col>
            </div>
          </van-row>
          <van-row v-if="goodsInfo.love_shoppin_gift">
            <van-col :span="24" id="price" class="price_box" v-if="goodsInfo.love_shoppin_gift">
              <span style="text-align: left; width: 100%;">{{ goodsInfo.love_shoppin_gift }}</span>
            </van-col>
          </van-row>
          <van-row>
            <van-col :span="24" id="stockcontainer">
              <van-col :span="12"> 库存:{{ goodsInfo.stock }} </van-col>
              <van-col :span="12" class="sale"> {{ isRent ? "租赁次数" : "销量" }}:{{ parseInt(goodsInfo.show_sales) + parseInt(goodsInfo.virtual_sales || 0) }} </van-col>
            </van-col>
          </van-row>
          <!-- vant 1.x版本不支持在row col 添加click事件 -->
          <div @click="gotoMemberGradeList(goodsInfo.member_discount.display_page)">
            <van-row style="background: #f5f5f5;">
              <van-col :span="24" id="memberBox" style="padding: 0.3rem 0;" v-if="openVip == '1'">
                <van-col :span="5" class="img"> <img src="../../../assets/images/goods/member@2x.png" alt="" /> </van-col>
                <van-col :span="14" class="vipBox" v-if="goodsInfo.member_discount && goodsInfo.member_discount.discount_value">
                  <div style="font-size: 12px;">{{ goodsInfo.member_discount.level_name }}专享价{{ $i18n.t("money") }}{{ goodsInfo.member_discount.discount_value }}<span v-if="isRent">/天</span></div>
                  <div
                    style="font-size: 12px; margin-top: 0.3rem; color: #a77b00;"
                    v-if="goodsInfo.member_discount.next_level_price != goodsInfo.member_discount.discount_value && goodsInfo.member_discount.next_level_price > 0.0"
                  >
                    加入{{ goodsInfo.member_discount.next_level_name }}专享价{{ $i18n.t("money") }}{{ goodsInfo.member_discount.next_level_price }}<span v-if="isRent">/天</span>
                  </div>
                </van-col>
                <van-col :span="5" class="sale" v-if="goodsInfo.member_discount.display_page == '1'">
                  <div class="vipBox_btn">
                    立即开通
                    <i class="icon-member_look iconfont"></i>
                  </div>
                </van-col>
              </van-col>
            </van-row>
          </div>

          <div class="act-box">
            <ul class="fee" v-if="goodsInfo.fee">
              <li>
                <span>{{ goodsInfo.fee.name }}</span>
              </li>
              <li style="margin-left: 0.5rem; color: #f15353;">
                <span>{{ $i18n.t("money") }}{{ goodsInfo.fee.money }}</span>
              </li>
            </ul>
            <ul class="act" @click="activityShowFun" v-if="activitySwitch">
              <li class="act1" style="color: #999;">活动</li>
              <li class="act2">
                <span>{{ firstActivityBtn }}</span>
              </li>
              <li class="act3">
                <span>{{ firstActivityCon }}</span>
              </li>
              <i class="fa fa-angle-right"></i>
            </ul>
            <ul class="act" @click="showParameter = true">
              <li class="act1" style="color: #999;">参数</li>
              <li class="act2">商品参数详情</li>
              <li class="act3">
                <span></span>
              </li>
              <i class="fa fa-angle-right"></i>
            </ul>
            <ul class="iconBox" v-if="!fun.isTextEmpty(labelList) && labelList.is_label == '1'">
              <li v-if="!fun.isTextEmpty(labelList.label_pic_1)"><img :src="labelList.label_pic_1" alt="" />{{ labelList.paperwork_1 }}</li>
              <li v-if="!fun.isTextEmpty(labelList.label_pic_2)"><img :src="labelList.label_pic_2" alt="" />{{ labelList.paperwork_2 }}</li>
              <li v-if="!fun.isTextEmpty(labelList.label_pic_3)"><img :src="labelList.label_pic_3" alt="" />{{ labelList.paperwork_3 }}</li>
              <li v-if="!fun.isTextEmpty(labelList.label_pic_4)"><img :src="labelList.label_pic_4" alt="" />{{ labelList.paperwork_4 }}</li>
              <li v-if="!fun.isTextEmpty(labelList.label_pic_5)"><img :src="labelList.label_pic_5" alt="" />{{ labelList.paperwork_5 }}</li>
              <li v-if="!fun.isTextEmpty(labelList.label_pic_6)"><img :src="labelList.label_pic_6" alt="" />{{ labelList.paperwork_6 }}</li>
            </ul>
          </div>

          <c-comment
            class="section"
            :commentInfo="commentLimit ? commentLimit.data : []"
            :tatal="commentLimit ? commentLimit.total : 0"
            :rate="favorable_rate"
            :goods_id="this.$route.params.id"
            :isCup="isCup"
            v-on:RouterTo="FromTo"
          ></c-comment>
          <div v-if="!this.fun.isTextEmpty(goodsInfo.has_one_brand)">
            <div class="brand" @click="toBrandDetail(goodsInfo.has_one_brand.id)" v-if="isCup">
              <ul class="logo">
                <li>
                  <img :src="goodsInfo.has_one_brand.logo" alt class="logo_img" />
                  <span>{{ goodsInfo.has_one_brand.name }}</span>
                </li>
                <li class="return">品牌介绍</li>
              </ul>
            </div>
          </div>

          <!-- 供应商入口 -->
          <div class="supplier-box" @click="gotoSupplier()" v-if="!this.fun.isTextEmpty(supplierData) && supplierData.is_open == 1 && goods_type == 'supplierGoods'">
            <div style="flex: 1; display: flex;">
              <div class="user-img">
                <img :src="supplierData.logo ? supplierData.logo : require('../../../assets/images/loading.jpg')" style="height: 100%;" />
              </div>
              <ul class="user-name">
                <li>{{ this.fun.isTextEmpty(supplierData.store_name) ? supplierData.username : supplierData.store_name }}</li>
                <li>
                  在售商品：
                  <span>{{ goodsInfo.supplier_goods_count }}</span>
                </li>
              </ul>
            </div>

            <div class="user-btn">
              <span>进店逛逛</span>
              <i class="fa fa-angle-right"></i>
            </div>
          </div>

          <div class="pullUp" v-if="!showPageB" style="">
            <img src="../../../assets/images/goods/pull_up@2x.png" alt="" id="imgs" :class="[isPullUp ? 'rotateImg' : 'normalImg']" /><i id="loadMore">{{
              isPullUp ? "释放展开图文详情" : "上拉展开图文详情"
            }}</i>
          </div>
          <span v-if="!showPageB" style="display: inline-block; width: 100%; height: 1.5rem;"></span>
          <div id="shopInfo" ref="goodinfo" class="section" :class="{ goodTop: goodTop == true, bottomMargin: isMarginBottom }" v-if="showPageB">
            <p style="" class="title-text">商品详情</p>
            <div id="tabs">
              <div ref="goodPage" id="goodPage">
                <div>
                  <div id="goods_content" v-html="goodDetail.content" @click="handleHtml($event)"></div>
                  <p v-if="fun.isTextEmpty(goodDetail.content)" style="color: #666;">暂无该商品详情 ~</p>
                  <div class="like-list" v-if="fun.isTextEmpty(goodDetail.show_push) ? false : true">
                    <div class="box06">
                      <div class="img">
                        <img src="../../../assets/images/goods/like@2x.png" />
                      </div>
                      <h3 class="like">猜您喜欢</h3>
                    </div>
                    <div class="like-box">
                      <div class="box" v-for="item in goodDetail.show_push" :key="item.id" @click="pushGoodGoto(item)">
                        <div class="goods-img">
                          <img :src="item.thumb" style="width: 100%; height: 100%;" />
                        </div>
                        <ul class="goods-info">
                          <li class="name" style="-webkit-box-orient: vertical;">{{ item.title | escapeTitle }}</li>
                          <li class="pay">
                            <div class="left left1" v-if="goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1">
                              <small style="color: red;">{{ $i18n.t("money") }}</small>
                              <span>{{ goodsInfo.vip_level_status.word }}</span>
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
                      <div class="img"><img src="../../../assets/images/cloud.png" /></div>
                      <h4>{{ $i18n.t("没有更多了") }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="foot">
        <div class="addfav" @click.stop="gotoHome">
          <template>
            <ul>
              <li>
                <i class="iconfont icon-info_store"></i>
              </li>
              <li>首页</li>
            </ul>
          </template>
        </div>
        <div :class="{ cart: true, cell: true }" v-if="this.$route.params.mode == 2" @click.stop="gotoBuy(1)">代理销售</div>
        <div class="buy cell" :style="{ flex: this.$route.params.mode == 2 ? '3' : '7' }" @click.stop="gotoBuy(2)">立即购买</div>
      </div>

      <!-- 规格弹窗组件 -->
      <yz-specs :goodsInfo="goodsInfo" ref="goodSku" v-model="popupSpecs" v-on:closeSpecsPopup="close_yz_specs_popup">
        <div class="shopinfo noVantRadio" style="margin: 0;" v-if="this.$route.params.mode == 2">
          <dl>
            <dt>等级套餐</dt>
            <dd>
              <van-radio-group v-model="levelModel" checked-color="#f15353">
                <van-radio
                  @click="clickLevelModel(levelchild)"
                  :class="{ vantRadioshow: levelchild.level_id == levelModel }"
                  v-for="(levelchild, i) in goodsInfo.detail"
                  :name="levelchild.level_id"
                  :key="i"
                  checked-color="#f14e4e"
                >
                  {{ levelchild.level_name }}
                </van-radio>
              </van-radio-group>
            </dd>
          </dl>
        </div>
      </yz-specs>

      <van-popup v-model="activityShow" position="bottom" :style="{ height: '60%' }">
        <van-nav-bar title="活动" class="pcStyle_ydT">
          <template #right>
            <i class="iconfont icon-close11" style="color: #666; size: 1.25rem;" @click="activityShow = false"></i>
          </template>
        </van-nav-bar>

        <div style="clear: both;" class="pcStyle_ydC">
          <van-cell-group style="border-width: 0;">
            <div v-for="(item, i) in activityArr" :key="i" style=" text-align: left; padding: 0 0.875rem;">
              <van-cell style="padding: 0.625rem 0;">
                <template #title style>
                  <span class="custom-title" style=" border-radius: 0.1875rem; border: 0.0625rem solid #f15353; color: #f15353; padding: 0.125rem 0.625rem; font-size: 12px;">{{ item.name }}</span>
                </template>
                <template #right-icon>
                  <span slot="right" v-if="item.type == 'string'" style="color: #333; font-size: 13px; font-weight: 500; text-align: right;">{{ item.value }}</span>
                  <span slot="right" v-if="item.type == 'array'" style="color: #333; font-size: 13px; font-weight: 500; text-align: right;">
                    <span>
                      <span v-for="(value, i) in item.value" :key="i">
                        {{ value }}
                        <br />
                      </span>
                    </span>
                  </span>
                </template>
              </van-cell>
              <div v-if="item.desc" style="text-align: left; margin-top: 5px; color: rgb(241, 83, 83);">
                {{ item.desc }}
              </div>
            </div>
          </van-cell-group>
        </div>
      </van-popup>
      <van-popup v-model="showParameter" position="bottom" :style="{ height: '60%' }">
        <van-nav-bar title="商品参数" class="pcStyle_ydT">
          <template #right>
            <i class="iconfont icon-close11" style="color: #666; size: 1.25rem;" @click="showParameter = false"></i>
          </template>
        </van-nav-bar>
        <div style="clear: both;" class="pcStyle_ydC">
          <ul class="parameterClass">
            <li v-for="(items, i) in goodsInfo.has_many_params" :key="i">
              <span class="leftb">{{ items.title }}</span>
              <span class="rightb">{{ items.value }}</span>
            </li>
            <p class="notext" v-if="fun.isTextEmpty(goodsInfo.has_many_params)"><br />抱歉，暂无该商品参数 ~</p>
          </ul>
        </div>
      </van-popup>
      <template v-if="showComment">
        <van-popup v-model="showComment" position="right" duration="0" :style="{ height: '100%', width: '100%' }">
          <van-nav-bar title="全部评价" class="pcStyle_ydT">
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
      <!-- 商品详情页图片放大start -->
      <van-image-preview v-model="showBigImg" :images="bigImages"></van-image-preview>
      <!-- 商品详情页图片放大 end -->
      <yz-goodsposter v-model="posterShow" :defaultImg="posterImg"></yz-goodsposter>

      <!-- 分享弹窗 -->
      <van-popup v-model="showShare" round closeable>
        <div class="sharr-title">分享</div>
        <div class="share-list">
          <div class="share-list-chile" v-if="this.fun.getTyep() != 5" @click.stop="shareWeixin()">
            <div class="share-list-icon"><i class="iconfont icon-fx_haoyou"></i></div>
            分享好友
          </div>
          <div class="share-list-chile" @click.stop="postShow()">
            <div class="share-list-icon color2"><i class="iconfont icon-erweima"></i></div>
            分享海报
          </div>
          <div class="share-list-chile" v-if="wx_video_link == 1" @click.stop="getVideoLink()">
            <div class="share-list-icon color3"><i class="iconfont icon-ht_operation_copyline"></i></div>
            视频号链接
          </div>
        </div>
      </van-popup>
      <!-- 视频号复制弹窗 -->
      <van-popup v-model="showVideoLink" round closeable>
        <div class="video-link-copy">
          <div class="video-link-copy-btn" v-if="!fun.isTextEmpty(article_url)" @click.stop v-clipboard:copy="article_url" v-clipboard:success="onCopy">一键复制</div>
          <div class="video-link-copy-text">复制链接，<br />视频号发布视频粘贴扩展链接</div>
          <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/goods/videolink.png" alt="" class="video-link-copy-img" />
        </div>
      </van-popup>
    </div>
  </transition>
</template>

<script>
import goods from "./goods_controller";

export default goods;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../../assets/css/goods.scss";

.sharr-title {
  height: 3rem;
  line-height: 3.5rem;
}

.share-list {
  width: 16rem;
  display: flex;
  flex-wrap: wrap;
  padding: 0 1rem 1rem;
  justify-content: space-between;

  .share-list-chile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 1rem 1.5rem;
    font-size: 12px;

    .share-list-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: #fac337;
      line-height: 2.5rem;
      overflow: hidden;
      margin-bottom: 0.5rem;

      i {
        color: #fff;
        font-size: 20px;
      }
    }

    .color2 {
      background: #ff9329;
    }

    .color3 {
      background: #2aa7fb;
    }
  }
}

.video-link-copy {
  width: 15rem;
  padding: 3rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .video-link-copy-btn {
    height: 2rem;
    line-height: 2rem;
    padding: 0 1.5rem;
    color: #fff;
    border-radius: 1rem;
    background: #f15353;
  }

  .video-link-copy-text {
    font-size: 12px;
    padding: 0.875rem 0;
  }

  .video-link-copy-img {
    width: 90%;
  }
}

#management {
  margin: 1rem 0;
  height: 4.75rem;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.19rem 0.94rem 0.94rem 1.06rem;

  .mana_o {
    width: 2.5rem;
    height: 2.5rem;
    background-color: #f5c041;
    border-radius: 50%;
    margin-right: 0.69rem;

    img {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
    }
  }

  .nameMana {
    display: flex;
    flex-direction: column;

    .nameMana_a {
      font-size: 1.06rem;
      color: #333;
      text-align: left;
      margin-bottom: 0.5rem;
    }

    .nameMana_b {
      font-size: 0.75rem;
      text-align: left;
      color: #333;

      em {
        color: #f14e4e;
      }
    }
  }

  .tapMana {
    width: 4.69rem;
    height: 1.69rem;
    background-color: #f14e4e;
    border-radius: 0.84rem;
    font-size: 0.75rem;
    color: #fff;
    text-align: center;
    line-height: 1.69rem;
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

  .banner_pcStyle {
    height: 375px !important;
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

.goods-dicount {
  height: 1.5rem;
  background-color: #ffe6e3;
  border-radius: 0.125rem;
  color: #ff3203;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.75rem;
  padding: 0 0.5rem;
}

.pub-price {
  width: 6.1563rem;
  height: 1.25rem;
  border-radius: 0.125rem;
  border: solid 0.0625rem #f15353;
  color: #f15353;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.7188rem;
}
// 一口价
.optional {
  margin-top: 0.4688rem;
  padding: 0 0.75rem;
  width: 100%;
  height: 2.1875rem;
  line-height: 2.1875rem;
  background-color: #fff5ed;

  .three-count {
    float: left;
    font-size: 0.9375rem;
    color: #202020;
  }

  .go-group {
    float: right;
    font-size: 0.8125rem;
    color: #de272a;
    vertical-align: middle;
  }

  .icon-arrow {
    font-size: 700;
    color: #999;
    vertical-align: middle;
  }
}

.popup-title {
  padding: 1rem;
  font-size: 18px;
  font-weight: bold;
}

.popup-box {
  height: 15rem;
  overflow-y: scroll;

  .popup-item {
    padding: 0.5rem;
  }
}

.point-good-price {
  color: #ff9500;

  .point-text {
    background: #ff9500;
    color: #fff;
    padding: 2px 4px;
    border-radius: 5px;
    vertical-align: middle;
  }
}

.show_price_box {
  display: flex;
  flex-direction: column;
  font-size: 13px;

  .show_price {
    margin-bottom: 3px;
  }

  .other_price {
    display: inline-block;
    padding: 1px 4px;
  }

  .red_white {
    color: #fff;
    background: #ff2c29;
  }

  .white_red {
    color: #ff2c29;
    border: solid #ff2c29 1px;
    background: #fff;
  }
}

.luck-draw-btn {
  position: fixed;
  bottom: 5rem;
  right: 50%;
  transform: translateX(11rem);
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
  background: #bfcbd9;
  z-index: 9;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.slot_title-style {
  line-height: 20px;
  padding: 0 0.625rem;
  text-align: left;
  margin-bottom: 0.3125rem;
  color: #666;
}

.slot_style {
  display: flex;
  padding: 0 0.625rem;
  margin: 0.875rem 0;

  span {
    height: 1.625rem;
    line-height: 1.625rem;
    display: inline-block;
    border: 1px solid #fb4a4a;
    border-radius: 0.25rem;
    color: #fb4a4a;
    padding: 0 0.5rem;
  }
}
</style>
