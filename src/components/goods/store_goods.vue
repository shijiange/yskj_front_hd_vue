<template>
  <transition name="fade2">
    <div id="goods" v-show="showGood" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <div id="navTab" :class="{ hoet: hoet }">
        <a class="nav1" :class="{ current: currentClass == 0 }" @click.stop="jump(0)">商品</a>
        <a class="nav1" :class="{ current: currentClass == 1 }" @click.stop="jump(1)">评价</a>
        <a class="nav1" :class="{ current: currentClass == 2 }" @click.stop="jump(2)">详情</a>
        <a class="nav1" :class="{ current: currentClass == 3 }" @click.stop="jump(3)" v-if="is_room == 1 && !fun.isTextEmpty(recordsList)">直播</a>
      </div>
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
      <div ref="onePage" id="onePage" style="overflow: hidden; min-height: 100vh;">
        <div style="-webkit-overflow-scrolling: touch; min-height: 101vh;" id="main">
          <viewer :images="[goodsInfo.thumb_url]" class="section" style="position: relative;">
            <c-myswipe
              v-if="goodsInfo.thumb_url"
              :style="{ height: this.fun.getPhoneEnv() == 3 ? '375px' : '100vw' }"
              :pagination-visible="true"
              :slides="goodsInfo.thumb_url"
              :repeating="true"
              :auto="0"
            >
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
              <div v-if="!goodsInfo.thumb_url || goodsInfo.thumb_url == null || goodsInfo.thumb_url.length <= 0">
                <img :src="goodsInfo.thumb" width="100%" />
              </div>
              <div v-for="(ithumb, index) in goodsInfo.thumb_url" :key="index">
                <template v-if="ithumb">
                  <img :src="ithumb" width="100%" />
                </template>
                <!--<template v-if="!ithumb">-->
                <!--<img src="../../assets/images/img_default.png">-->
                <!--</template>-->
              </div>
            </c-myswipe>
          </viewer>
          <float-order v-if="showGood" :broadcast_data="goods_plugin.broadcast_data"></float-order>
          <div v-if="!goodsInfo.thumb_url" style="width: 100%; height: 23rem; position: relative;">
            <img :src="goodsInfo.thumb" style="width: 100%; height: 100%;" />
            <float-order v-if="showGood" :broadcast_data="goods_plugin.broadcast_data"></float-order>
          </div>

          <!-- 限时购 -->
          <div class="rob-time" v-if="isBuy && (isTime || isBegTime)">
            <!-- <div class="img">
          <img src="../../assets/images/rob-time.png"
               width="16%;" />
        </div> -->
            <ul class="price">
              <li class="text">{{ limitedTimeCustomName }}</li>
              <!-- <li class="none-line"><small>{{$i18n.t('money')}}</small><b>3.2</b>&nbsp;/天</li>
          <li class="middle-line"><small>{{$i18n.t('money')}}</small><b>3.2</b>&nbsp;/天</li> -->
            </ul>
            <div class="time" v-if="!isBegTime" style="display: flex; align-items: center; justify-content: flex-end;">
              <span class="text">距结束余：</span>
              <van-count-down :time="endTimeStr">
                <template #default="timeData">
                  <div style="display: flex; text-align: center;">
                    <span class="block" style="background: #fff; color: #000; padding: 0 0.125rem; min-width: 1.4rem; border-radius: 0.125rem;">{{ timeData.days }}</span>
                    <span class="colon" style="margin: 0 0.1rem;">天</span>
                    <span class="block" style="background: #fff; color: #000; padding: 0 0.125rem; min-width: 1.4rem; border-radius: 0.125rem;">{{ timeData.hours }}</span>
                    <span class="colon" style="margin: 0 0.1rem;">:</span>
                    <span class="block" style="background: #fff; color: #000; padding: 0 0.125rem; min-width: 1.4rem; border-radius: 0.125rem;">{{ timeData.minutes }}</span>
                    <span class="colon" style="margin: 0 0.1rem;">:</span>
                    <span class="block" style="background: #fff; color: #000; padding: 0 0.125rem; min-width: 1.4rem; border-radius: 0.125rem;">{{ timeData.seconds }}</span>
                  </div>
                </template>
              </van-count-down>
            </div>
            <div class="time" v-if="isBuy && isBegTime" style="display: flex; align-items: center; justify-content: flex-end;">
              <span class="text">距开始还剩：</span>
              <van-count-down :time="begTimeStr">
                <template #default="timeData">
                  <div style="display: flex; text-align: center;">
                    <span class="block" style="background: #fff; color: #000; padding: 0 0.125rem; min-width: 1.4rem; border-radius: 0.125rem;">{{ timeData.days }}</span>
                    <span class="colon" style="margin: 0 0.1rem;">天</span>
                    <span class="block" style="background: #fff; color: #000; padding: 0 0.125rem; min-width: 1.4rem; border-radius: 0.125rem;">{{ timeData.hours }}</span>
                    <span class="colon" style="margin: 0 0.1rem;">:</span>
                    <span class="block" style="background: #fff; color: #000; padding: 0 0.125rem; min-width: 1.4rem; border-radius: 0.125rem;">{{ timeData.minutes }}</span>
                    <span class="colon" style="margin: 0 0.1rem;">:</span>
                    <span class="block" style="background: #fff; color: #000; padding: 0 0.125rem; min-width: 1.4rem; border-radius: 0.125rem;">{{ timeData.seconds }}</span>
                  </div>
                </template>
              </van-count-down>
            </div>
          </div>

          <div id="goodsInfo_box">
            <van-row id="nameInfo">
              <!-- 天天兑价 -->
              <div class="DpBox" v-if="isGoodsLove">
                <div class="daydayPrice">
                  天天兑价
                  <span> {{ $i18n.t("money") }}{{ goods_love_cash + "+" + goods_love_deduction + goods_love_name }} </span>
                </div>
              </div>
              <van-col id="price" class="price_sum" v-if="!isGoodsLove" style="flex: 1;">
                <div class="show_price_box" v-if="goods_plugin.goods_show && goods_plugin.goods_show.store_goods_detail_style == 1">
                  <div class="show_price">
                    {{ fun.getPrice() }}：{{ $i18n.t("money")
                    }}{{ goodsInfo.has_option == 1 ? (goodsInfo.min_price == goodsInfo.max_price ? goodsInfo.max_price : goodsInfo.min_price + "-" + goodsInfo.max_price) : goodsInfo.price
                    }}<em v-if="isRent">/天</em>
                  </div>
                  <div class="show_price" v-for="(item, i) in goods_plugin.goods_show.data" :key="i">
                    <p class="other_price" :class="[i % 2 == 0 ? 'red_white' : 'white_red']">{{ item.name }}：{{ item.value }}</p>
                  </div>
                </div>
                <template v-if="!goods_plugin.goods_show || goods_plugin.goods_show.store_goods_detail_style != 1">
                  {{ $i18n.t("money") }}
                  <span id="price-num" class="price-num1" v-if="goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1" style="font-size: 14px; font-weight: 500;">
                    {{ goodsInfo.vip_level_status.word }}
                  </span>
                  <span id="price-num" class="sum" v-else>{{
                    goodsInfo.has_option == 1 ? (goodsInfo.min_price == goodsInfo.max_price ? goodsInfo.min_price : goodsInfo.min_price + "-" + goodsInfo.max_price) : goodsInfo.price
                  }}</span>
                  <del id="original-del" v-if="parseInt(goodsInfo.market_price) && goodsInfo.market_price != goodsInfo.price"
                    ><span class="original-price">{{ fun.getMarketPrice() }}:{{ goodsInfo.market_price }}</span>
                    <em v-if="isRent">/天</em>
                  </del>
                </template>
              </van-col>
              <!-- 天天兑价 -->
              <van-col :span="24" id="price" v-if="isGoodsLove">
                {{ $i18n.t("money")
                }}<span
                  id="price-num"
                  style="font-weight: 600;"
                  v-if="goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1"
                  :class="[goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1 ? 'pricePower' : '']"
                  >{{ goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1 ? goodsInfo.vip_level_status.word : goodsInfo.price }}</span
                >
                <span id="price-num" v-else
                  >{{ goodsInfo.has_option == 1 ? (goodsInfo.min_price == goodsInfo.max_price ? goodsInfo.max_price : goodsInfo.min_price + "-" + goodsInfo.max_price) : goodsInfo.price
                  }}<em v-if="isRent">/天</em></span
                >
                <del id="original-del" v-if="parseInt(goodsInfo.market_price) && goodsInfo.market_price != goodsInfo.price"
                  ><span class="original-price">{{ fun.getMarketPrice() }}:{{ goodsInfo.market_price }}</span>
                  <em v-if="isRent">/天</em>
                </del>
              </van-col>
              <van-col>
                <i class="iconfont icon-erweima" @click="postShow"></i>
              </van-col>
              <van-col>
                <div id="share" @click="isShowSharePopup()">
                  <i class="iconfont icon-fenxiang" aria-hidden="true"></i>
                </div>
              </van-col>
              <van-col>
                <div class="share_text" @click="isShowSharePopup()">分享</div>
              </van-col>
            </van-row>
            <van-row class="info-box">
              <van-col :span="24" id="titleBox">
                <van-col :span="19" class="title">
                  <h1 style="-webkit-box-orient: vertical;">{{ goodsInfo.title | escapeTitle }}</h1>
                </van-col>
                <van-col :span="5" class="coupon" v-if="isCup"
                  ><span @click="gotoCoupon" v-if="goodsInfo.availability && goodsInfo.availability == 1 ? true : false"> 领券 <i class="fa fa-angle-right"></i></span
                ></van-col>
              </van-col>

              <van-col :span="24" id="price" class="price_box" v-if="goods_plugin.love_shoppin_gift && (!goodsInfo.vip_level_status || goodsInfo.vip_level_status.status == 0)">
                <span style="text-align: left; width: 100%;">{{ goods_plugin.love_shoppin_gift }}</span>
              </van-col>
              <van-row id="stockcontainer" type="flex" justify="space-between">
                <van-col :span="8"> 库存:{{ goodsInfo.stock }}</van-col>
                <van-col :span="8" v-if="goodsInfo.is_month_sales == 1" style="text-align: center;"> 月销量:{{ goodsInfo.month_sales ? goodsInfo.month_sales : 0 }}</van-col>
                <van-col :span="8" class="sale">{{ goodsInfo.is_month_sales == 1 ? "总销量" : "销量" }}:{{ salesCount }}</van-col>
              </van-row>
              <van-col :span="24" v-if="is_o2o & (!isBuy || (isBuy && !isBegTime))" style="position: relative; padding: 0 0.75rem;">
                <div id="select" v-if="o2oCount > 0 && goods_info.has_option !== 1">
                  <div id="left" @click="updateCart1(goodsInfo.id, -1, 'good')" v-if="o2oCount > 0">
                    -
                  </div>
                  <!-- <span style="width:1.25rem;font-size:20px;">{{ o2oCount }}</span> -->
                  <input
                    type="number"
                    style="width: 1.25rem; font-size: 20px; flex: 2; text-align: center;"
                    v-model.lazy="o2oCount"
                    @focus="clickCount(o2oCount)"
                    @change="changeCount(o2oCount, goodsInfo.id, 'good')"
                    @click.stop
                  />
                  <div id="right" @click="addCart1(goodsInfo)">+</div>
                </div>

                <div class="spec_btn" :style="{ bottom: isGoodsLove ? '2.3rem' : '0.3rem' }" v-if="o2oCount >= 0 && goods_info.has_option === 1">
                  <span
                    class="goods-num"
                    :class="goodsCarts[goods_info.id] ? 'show' : 'hide'"
                    v-if="goodsCarts[goods_info.id] && (!goods_info.vip_level_status || goods_info.vip_level_status.status == 0)"
                    >{{ goodsCartsTotal[goods_info.id].total }}</span
                  >
                  <button style="width: 5.85rem; height: 2.1rem;" @click="addGood" v-if="(!goods_info.vip_level_status || goods_info.vip_level_status.status == 0) && !reserve_goods">选规格</button>
                </div>
                <div v-if="o2oCount <= 0 && goods_info.has_option !== 1 && !reserve_goods">
                  <div v-if="!isBuy || (isBuy && !isBegTime)">
                    <van-button type="danger" style="height: 2.25rem; padding: 0 15px; float: right; background-color: #f15353;" @click="addCart1(goodsInfo)" v-if="showDis && !toker"
                      >加入购物车
                    </van-button>
                    <!--拓客卡-->
                    <van-button type="danger" style="height: 2.25rem; padding: 0 15px; float: right; background-color: #f15353;" @click="toBuy(goodsInfo)" v-if="toker">立即买</van-button>
                  </div>
                </div>
              </van-col>
            </van-row>
          </div>
          <div @click="gotoMemberGradeList(goodsInfo.member_discount.display_page)">
            <van-row style="background: #f5f5f5;">
              <van-col :span="24" id="memberBox" style="padding: 0.3rem 0;" v-if="openVip == '1'">
                <van-col :span="5" class="img"><img src="../../assets/images/goods/member@2x.png" alt=""/></van-col>
                <van-col :span="14" class="vipBox" v-if="goodsInfo.member_discount && goodsInfo.member_discount.discount_value">
                  <div style="font-size: 12px;">
                    {{ goodsInfo.member_discount.level_name }}专享价{{ $i18n.t("money")
                    }}{{ goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1 ? "暂无权限" : goodsInfo.member_discount.discount_value }}<span v-if="isRent">/天</span>
                  </div>
                  <div
                    style="font-size: 12px; margin-top: 0.3rem; color: #a77b00;"
                    v-if="goodsInfo.member_discount.next_level_price != goodsInfo.member_discount.discount_value && goodsInfo.member_discount.next_level_price > 0.0"
                  >
                    加入{{ goodsInfo.member_discount.next_level_name }}专享价{{ $i18n.t("money")
                    }}{{ goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1 ? "暂无权限" : goodsInfo.member_discount.next_level_price }}<span v-if="isRent">/天</span>
                  </div>
                </van-col>
                <van-col :span="5" v-if="goodsInfo.member_discount.display_page == '1'" class="sale">
                  <div class="vipBox_btn">
                    立即开通
                    <i class="icon-member_look iconfont"></i>
                  </div>
                </van-col>
              </van-col>
            </van-row>
          </div>

          <!-- //门店购物车 -->
          <!-- <div id="foot1" v-if="is_o2o">
          <div style="background: url(//static-o2o.360buyimg.com/daojia/new/images/minicart/cart.png) 10px 5px no-repeat;width:80px;top: -13px;height: 58px;background-position: 10px -70px;background-size: 50px 125px;margin-bottom:15px;"@click="goShowCart">
              <i style=" position: absolute;top: 5px;left: 55px;padding: 0 5px;height: 15px;line-height: 15px;overflow: hidden;text-align: center;color: #fff;background-color: #ff5d5c;border-radius: 7px;font-size: 10px">{{goodsCount}}</i>
          </div>

          <div id="balance" style="position: absolute;z-index: 40;right: 0;width: 115px;text-align: center;color: #fff;line-height: 48px;background-color: #47b34f"  @click="o2oGotoOrder">
              去结算
          </div>
      </div> -->
          <div id="store-position">
            <div class="store-box" v-if="is_o2o" @click="gotoList">
              <div class="store-name">
                <i class="iconfont icon-dianpu"></i><span>{{ o2oName }}</span>
              </div>
              <div style="color: #8c8c8c;" class="flexName">进入门店</div>
            </div>

            <div class="contact-box" v-if="is_o2o">
              <div class="contact">
                <a :href="o2oPhone"><i class="iconfont icon-dianhua1"></i><span>联系商家</span></a>
              </div>
              <div style="cursor: pointer;">
                <a @click="show1 = true"> <i class="iconfont icon-service_shop"></i> <span>客服</span></a>
              </div>
              <div class="position" @click="goToAdress">
                <i class="iconfont icon-dingwei"></i>
              </div>
            </div>
          </div>

          <div class="act-box">
            <ul class="fee" v-if="goods_plugin.fee">
              <li>
                <span>{{ goods_plugin.fee.name }}</span>
              </li>
              <li style="margin-left: 0.5rem; color: #f15353;">
                <span>{{ $i18n.t("money") }}{{ goods_plugin.fee.money }}</span>
              </li>
            </ul>
            <ul class="act" @click="activityShowFun" v-if="activitySwitch && (!goodsInfo.vip_level_status || goodsInfo.vip_level_status.status == 0)">
              <li class="act1" style="color: #999;">活动</li>
              <li class="act2">
                <span>{{ firstActivityBtn }}</span>
              </li>
              <li class="act3">
                <span>{{ firstActivityCon }}</span>
              </li>
              <i class="fa fa-angle-right"></i>
            </ul>
            <!-- 自购省 -->
            <ul class="act" @click="gotohuiyuan" v-if="goods_plugin.selfbuy_discount" style="height: auto; align-items: center;">
              <li class="act1" style="color: #999;">自购省</li>
              <li class="act2" style="height: auto;">
                <div v-if="goods_plugin.selfbuy_discount.this_level_discount_price.show == 1">
                  {{ goods_plugin.selfbuy_discount.this_level_discount_price.content }}
                </div>
                <div v-if="goods_plugin.selfbuy_discount.next_level_discount_price.show == 1">
                  {{ goods_plugin.selfbuy_discount.next_level_discount_price.content }}
                </div>
              </li>
              <li class="act3"><span></span></li>
              <i class="fa fa-angle-right" v-if="goods_plugin.selfbuy_discount && goods_plugin.selfbuy_discount.link_to_level_page && goods_plugin.selfbuy_discount.link_to_level_page.show == 1"></i>
            </ul>
            <ul class="act" @click="showParameter = true">
              <li class="act1" style="color: #999;">参数</li>
              <li class="act2">商品参数详情</li>
              <li class="act3"><span></span></li>
              <i class="fa fa-angle-right"></i>
            </ul>
            <ul class="iconBox" v-if="labelList.length > 0">
              <li v-for="(item, pindex) in labelList" :key="pindex"><img v-if="item.pic" :src="item.pic" alt="" />{{ item.name }}</li>
            </ul>
          </div>
          <!-- 微贴 start -->
          <invitation :goods_plugin="goods_info_store"></invitation>
          <!-- 微贴 end -->
          <c-comment
            class="section"
            :commentInfo="commentLimit ? commentLimit.data : []"
            :tatal="commentLimit ? commentLimit.total : 0"
            :rate="favorable_rate"
            :num="commentLimit ? commentLimit.total : 0"
            :goods_id="this.$route.params.id"
            :isCup="this.isCup"
            v-on:RouterTo="FromTo"
          ></c-comment>
          <div class="pullUp" v-if="!showPageB">
            <img src="../../assets/images/goods/pull_up@2x.png" alt="" id="imgs" :class="[isPullUp ? 'rotateImg' : 'normalImg']" /><i id="loadMore">{{
              isPullUp ? "释放展开图文详情" : "上拉展开图文详情"
            }}</i>
          </div>
          <span v-if="!showPageB" style="display: inline-block; width: 100%; height: 1.5rem;"></span>
          <div id="shopInfo" ref="goodinfo" class="section" :class="{ goodTop: goodTop == true, bottomMargin: isMarginBottom }" v-if="showPageB">
            <p style="" class="title-text">{{ !toker ? "商品详情" : active == 0 ? "套餐详情" : "商品详情" }}</p>
            <div id="tabs">
              <div ref="goodPage" id="goodPage">
                <div>
                  <van-tabs v-model="active" v-if="toker">
                    <van-tab title="套餐内容"></van-tab>
                    <van-tab title="商品详情"></van-tab>
                  </van-tabs>
                  <div v-if="active == '0' && toker">
                    <div class="meal">
                      <div style="font-size: 0.88rem;">
                        <span>核销日期：</span>
                        <span v-if="effective_time == 0">永久有效</span>
                        <span v-if="effective_time > 0 && effective_day.length > 0">
                          购买后{{ effective_time }}天内有效
                          <span v-for="(iten, ind) in effective_day" :key="ind">（限{{ ind == effective_day.length ? iten : iten + "," }}使用)</span>
                        </span>
                        <span v-if="effective_day.length == 0">不可使用</span>
                      </div>
                      <div class="timer">
                        <template v-for="(item, ind) in time_interval">
                          <span :key="ind">核销时间段：{{ item.start }}-{{ item.end }}</span>
                        </template>
                      </div>
                      <template v-if="once_list.length > 0">
                        <div class="onece">
                          一次性消费项
                        </div>
                        <div class="onelis" v-for="item in once_list" :key="item.id">
                          <div class="oneleft">
                            <img :src="item.full_img_url" alt="" />
                          </div>
                          <div class="oneright">
                            <div class="rightTitle">{{ item.name }}</div>
                            <div class="rightBottom">
                              <span>数量：{{ item.quantity }}</span>
                              <span style="margin-left: 1rem;">单价￥{{ item.price }}</span>
                              <span style="margin-left: 1rem;">总价￥{{ item.price * item.quantity }}</span>
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-if="many_list.length > 0">
                        <div class="onece">
                          多次性消费项
                        </div>
                        <div class="onelis" v-for="item in many_list" :key="item.id">
                          <div class="oneleft">
                            <img :src="item.full_img_url" alt="" />
                          </div>
                          <div class="oneright">
                            <div class="rightTitle">{{ item.name }}</div>
                            <div class="rightBottom">
                              <!-- <div class="ddLeft"> -->
                              <span>数量：{{ item.quantity }}</span>
                              <span style="margin-left: 1rem;">单价￥{{ item.price }}</span>
                              <span style="margin-left: 1rem;">总价￥{{ item.price * item.quantity }}</span>
                              <!-- </div> -->
                              <!-- <div class="ddRight"> -->
                              <!-- <span style="marginLeft:1rem;">一次使用{{item.single_consumption}}张以上</span> -->
                              <!-- </div> -->
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                  <div id="goods_content" v-html="goodDetail.content" @click="handleHtml($event)" v-if="toker && active == '1'"></div>
                  <div id="goods_content" v-html="goodDetail.content" @click="handleHtml($event)" v-if="!toker"></div>
                  <p v-if="fun.isTextEmpty(goodDetail.content)" style="color: #666;">暂无该商品详情 ~</p>
                  <!--价格说明-->
                  <div class="price-desc" v-if="goods_info.is_price_desc">
                    <p class="price-desc-title ">{{ goods_info.price_desc_title }}</p>
                    <div id="a_content" v-html="goods_info.explain"></div>
                  </div>
                  <div class="like-list" v-if="fun.isTextEmpty(goodDetail.show_push) ? false : true">
                    <div class="box06">
                      <div class="img">
                        <img src="../../assets/images/goods/like@2x.png" />
                      </div>
                      <h3 class="like">猜您喜欢</h3>
                    </div>
                    <div class="like-box">
                      <div class="box" v-for="item in goodDetail.show_push" :key="item.id" @click="pushGoodGoto(item)">
                        <div class="goods-img">
                          <img :src="item.thumb" style="width: 100%; height: 100%;" />
                        </div>
                        <ul class="goods-info">
                          <li class="name" style=" -webkit-box-orient: vertical;">
                            {{ item.title | escapeTitle }}
                          </li>
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
      <div style="height: 24px;"></div>

      <van-popup v-model="popupSpecs2" :style="{ overflow: 'visible' }" position="bottom" class="mint-popup-4" closeOnClickModal="true">
        <div class="specifications">
          <div class="shopimg">
            <div id="chooser_img">
              <img :src="popThumb" />
            </div>
            <div class="right">
              <div class="price">
                {{ $i18n.t("money") }}
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
                <input type="text" disabled="false" class="shownum" v-model="goodsCount" />
                <div class="rightnav" @click="addGoods">+</div>
              </div>
            </van-col>
          </van-row>
          <van-button size="small" id="btsmall" type="danger" v-show="popStock >= 1" @click="buyNowNew">确认 </van-button>
          <van-button type="danger" color="#999999" size="small" disabled id="btsmall" v-show="popStock <= 0">
            确认
          </van-button>
        </div>
      </van-popup>
      <van-popup v-model="activityShow" position="bottom" style="height: 60%;">
        <van-nav-bar title="活动">
          <template #right>
            <i class="iconfont icon-close11" style="color: #666; size: 1.25rem;" @click="activityShow = false"></i>
          </template>
        </van-nav-bar>
        <div style="clear: both;">
          <van-cell-group style="border-width: 0;">
            <div v-for="(item, i) in activityItem.sale" :key="i" style=" text-align: left; padding: 0 0.875rem;">
              <van-cell style="padding: 0.625rem 0;">
                <template #title style="">
                  <span class="custom-title" style=" border-radius: 0.1875rem; border: 0.0625rem solid #f15353; color: #f15353; padding: 0.125rem 0.625rem; font-size: 12px;">{{ item.name }}</span>
                </template>
                <template #right-icon>
                  <span slot="right" v-if="item.type == 'string'" style="color: #333; font-size: 13px; font-weight: 500; text-align: right;">{{ item.value }}</span>
                  <span slot="right" v-if="item.type == 'array'" style="color: #333; font-size: 13px; font-weight: 500; text-align: right;">
                    <span>
                      <span v-for="(value, i) in item.value" :key="i">{{ value }}<br /></span>
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

      <van-calendar v-model="showCalendar" :show-confirm="false" :formatter="formatter" @confirm="onConfirmCalendar" />
      <!-- 选规格 -->
      <van-popup v-model="show2" position="center" round class="spec_popup" style="">
        <div class="spec_box">
          <h3 id="h3_class">
            {{ popTitle }}
            <i @click.stop="close" class="iconfont icon-close11"></i>
          </h3>
          <div style="height: 2.5rem;"></div>
          <div class="spec_box_content" :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '' }">
            <div class="spec_a">
              <div class="choose-calendar" @click="tapReserve" v-if="reserve_goods">
                <span>{{ calendar_data ? `已选择日期${calendar_data}` : "请选择日期" }}</span
                ><span style="margin-left: 15px;" v-if="calendar_data">剩余：{{ arrjson.number }}</span>
              </div>
              <div v-for="(spec, i) in goodsInfo.has_many_specs" :key="i">
                <h5>{{ spec.title }}</h5>
                <ul class="option">
                  <li @click.stop="selectSpecs1(item, item.id)" v-for="(item, i) in spec.specitem" :key="i" :class="specid.indexOf(item.id) >= 0 ? 'cur' : ''">
                    {{ item.title }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div style="height: 3.4375rem;"></div>
          <div class="add_car">
            <ul class="car_btn">
              <li class="left">
                <div class="good-price">
                  <span>{{ $i18n.t("money") }}</span
                  >{{ popPrice }}<span style="margin-left: 0.3rem;">库存：{{ popStock }}</span>
                </div>
                <div class="vip-price" v-if="isMultiSpecs">
                  <van-loading class="m-l-w6" size="16" color="#fdbc2e" v-show="specsVIPPrc == 0" />
                  <span class="m-l-w6" v-show="specsVIPPrc">&nbsp;会员价: {{ $i18n.t("money") }}{{ specsVIPPrc }} </span>
                </div>
              </li>
              <li class="right">
                <span v-show="!popNum && popStock >= 1 && !toker && !reserve_goods" @click.stop="submitAction1">加入购物车</span>
                <span v-show="popStock <= 0" style="background: #999;">库存不足</span>
                <!-- 拓客卡 -->
                <span @click.stop="toBuy(goodsInfo)" v-show="!popNum && popStock >= 1 && toker && !reserve_goods">立即买</span>
                <!-- 门店预约 -->
                <span v-show="reserve_goods && popStock >= 1 && arrjson.is_reserve" @click="confirmTap">确认预约</span>
                <span v-show="reserve_goods && popStock >= 1 && !arrjson.is_reserve" style="background: #999;">确认预约</span>
              </li>
              <div class="Box" v-show="popNum >= 1">
                <!--popCard是从购物车里筛选的  传入的是购物车id-->
                <i class="iconfont icon-store_reduceLine" @click.stop="updateCart1(popCard.id, -1)"></i>
                <label class="show">{{ popNum }}</label>
                <i class="iconfont icon-store_plus" @click.stop="updateCart1(popCard.id, 1)"></i>
              </div>
            </ul>
          </div>
        </div>
      </van-popup>
      <!--  -->

      <van-popup v-model="showParameter" position="bottom" style="height: 60%;">
        <van-nav-bar title="商品参数" class="pcStyle_ydT">
          <template #right>
            <i class="iconfont icon-close11" style="color: #666; size: 1.25rem;" @click="showParameter = false"></i>
          </template>
        </van-nav-bar>
        <div style="clear: both;" class="pcStyle_ydC">
          <ul class="parameterClass">
            <li v-for="(items, index) in goodsInfo.has_many_params" :key="index">
              <span class="leftb">{{ items.title }}</span>
              <span class="rightb">{{ items.value }}</span>
            </li>
            <p class="notext" v-if="fun.isTextEmpty(goodsInfo.has_many_params)"><br />抱歉，暂无该商品参数 ~</p>
          </ul>
        </div>
      </van-popup>

      <template v-if="showComment">
        <van-popup v-model="showComment" position="right" duration="0" style="height: 100%; width: 100%;">
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

      <!-- 未添加商品  --底部购物车 -->
      <div class="Go_settle" v-show="carts.length === 0 && showDis && !notLogin && !toker && !reserve_goods">
        <i class="iconfont" @click="trggleCart"></i>
        <p>购物车是空的</p>
        <button type="button" @click.stop="goodsOrder(goodsCarts)">
          <template v-if="!isBuy || (isBuy && !isBegTime)">
            请选择商品
          </template>
          <template v-else>
            活动未开始
          </template>
        </button>
      </div>
      <!-- 已添加商品 -- 底部购物车 -->
      <div class="Go_settle complete" v-show="carts.length > 0 && showDis && !notLogin && !reserve_goods">
        <span class="number" v-show="!this.showCart">{{ cartsNum }}</span>
        <i :style="minicartStyle" class="iconfont" @click="trggleCart"></i>
        <p :style="leftPrice">
          <span>{{ $i18n.t("money") }}</span
          >{{ cartsTotal }}
        </p>
        <button @click.stop="goodsOrder(goodsCarts)" type="button">
          去结算
        </button>
      </div>
      <!-- 预约商品 -->
      <div class="reserveBtn set-pc-style" v-show="reserve_goods" @click="tapReserve">立即预约</div>

      <van-popup v-model="showCart" position="bottom" style="width: 100%; max-height: 60%;">
        <div class="top">
          <!--<van-checkbox v-model="checked"-->
          <!--&gt;全选<span class="select">(已选{{ cartsNum }}件) </span>-->
          <!--</van-checkbox>-->
          <div style="display: flex;">
            <i class="cartIcon" @click="trggleCart"></i>
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
              <div class="goods" v-for="(item, index) in carts" @click.stop="goToGoodsO2O(item)" :key="index">
                <!--<van-checkbox v-model="checked"></van-checkbox>-->
                <div class="goods_img">
                  <img :src="item.goods.thumb" />
                </div>
                <ul class="goodsName">
                  <li class="name">
                    <div class="install-tag" v-if="item.live_install && item.live_install.open_state == 1">安装</div>
                    <div class="goods-names">{{ item.goods.title }}</div>
                    <span v-if="item.option_str">({{ item.option_str }})</span>
                  </li>
                  <li class="price">{{ $i18n.t("money") }}{{ item.goods.price }}</li>
                </ul>
                <div class="addBtn">
                  <i class="iconfont icon-store_reduceLine" @click.stop="updateCart1(item.id, -1)"></i>
                  <input type="number" v-model.lazy="item.total" @focus="clickCount(item.total)" @blur="changeCount(item.total, item.id)" @click.stop />
                  <i class="iconfont icon-store_plus" @click.stop="updateCart1(item.id, 1)"></i>
                </div>
              </div>
            </div>
            <div style="height: 3.5rem;"></div>
          </div>
        </div>
      </van-popup>

      <yz-goodsposter v-model="posterShow" :posterData="posterImg" :goodstype="true"></yz-goodsposter>

      <!-- 过期 -->
      <van-popup v-model="show8" position="center" round style="width: 80%;">
        <div style="background-color: #fff; border-radius: 10px;">
          <p class="tips">
            该商家已过期，去看看其他的吧
          </p>
          <p style="text-align: center; line-height: 2.5rem;">
            <van-button type="primary" @click.stop.native="goTOHome" style="height: 1.8rem; width: 80px; border-radius: 4px;">我知道了 </van-button>
          </p>
        </div>
      </van-popup>

      <!--联系客服-->
      <d-connect-customer-service :show="show1" :tel="service_mobile" :online="cservice" :qrcode="service_QRcode" @closed="show1 = false"></d-connect-customer-service>

      <!-- 商品详情页图片放大start -->
      <van-image-preview v-model="showBigImg" :images="bigImages"></van-image-preview>
      <!-- 商品详情页图片放大 end -->

      <!-- 分享弹窗 -->
      <van-popup v-model="showShare" round closeable>
        <div class="sharr-title">分享</div>
        <div class="share-list" @click="showShare = false">
          <div class="share-list-chile" v-if="this.fun.getTyep() != 5" @click="shareWeixin()">
            <div class="share-list-icon"><i class="iconfont icon-fx_haoyou"></i></div>
            分享好友
          </div>
          <div class="share-list-chile" @click="postShow()">
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
import goods from "./store_good_controller";

export default goods;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/css/goods.scss";

.calendar_data {
  color: #666;
}

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

#goods {
  .tips {
    line-height: 3.5rem;
  }

  #code_box {
    img {
      width: 85%;
    }
  }

  .reserveBtn {
    background-color: rgb(241, 83, 83);
    width: 100%;
    height: 3.125rem;
    position: fixed;
    bottom: 0;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .Go_settle {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 3.125rem;
    background: #666;
    display: flex;
    justify-content: space-between;
    z-index: 3000;

    .iconfont {
      background: url(../../assets/images/store_car1.png) no-repeat center;
      background-size: 4rem;
      width: 4rem;
      height: 4rem;
      line-height: 4rem;
      color: #aaa;
      font-size: 4rem;
      position: absolute;
      left: 0.625rem;
      bottom: -0.1rem;
      transition: transform 0.4s ease-out 0s;
    }

    p {
      font-size: 16px;
      color: #aaa;
      padding-left: 5rem;
      line-height: 3.125rem;
    }

    button {
      width: 6.875rem;
      background: rgba(255, 255, 255, 0.1);
      color: #aaa;
      font-size: 16px;
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
      color: #f15353;
    }

    .iconfont {
      background: url(../../assets/images/store_car2.png) no-repeat center;
      background-size: 4rem;
      width: 4rem;
      height: 4rem;
      line-height: 4rem;
      color: #aaa;
      font-size: 4rem;
      //position: absolute;
      //left: 0.625rem;
      //bottom: -0.1rem;
      transition: transform 0.4s ease-out 0s;
    }

    p {
      color: #fff;
      transition: transform 0.4s ease-out 0s;
    }

    button {
      width: 6.875rem;
      background: #f15353;
      color: #fff;
      font-size: 16px;
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

    .cartIcon {
      display: block;
      background: url(../../assets/images/store_car2.png) no-repeat center;
      background-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      line-height: 2.5rem;
      color: #aaa;
      font-size: 2.5rem;
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
            display: flex;
            align-items: center;

            .goods-names {
              font-size: 15px;
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .install-tag {
              background: #ff6b1b;
              font-size: 10px;
              color: #fff;
              padding: 0 5px;
              border-radius: 2px;
              margin-right: 4px;
            }
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

  #goodsInfo_box {
    padding: 0.875rem 0;
    background: #fff;

    #nameInfo {
      display: flex;
      flex-wrap: wrap;
      padding: 0 0.75rem;

      .DpBox {
        width: 100%;
        margin-bottom: 0.25rem;

        .daydayPrice {
          display: block;
          height: 2rem;
          line-height: 2rem;
          background: #ffe000;
          padding-left: 0.5rem;
          overflow: hidden;
          color: #333;
          font-weight: bold;
          float: left;
          clear: both;

          span {
            background: #f2efef;
            height: 100%;
            padding-right: 0.5rem;
            display: inline-block;
            color: #333;
          }
        }
      }

      #price {
        flex: 1;
      }

      #tilie {
        flex: 3;
        font-size: 16px;
        text-align: left;
        line-height: 1.5rem;
        max-height: 3rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-weight: bold;
      }

      .iconfont {
        font-size: 18px;
        color: #666;
        margin-left: 1rem;
        line-height: 1.5rem;
      }
    }

    .price_sum {
      font-weight: bold;

      .sum {
        font-weight: bold;
      }

      .price-num1 {
        background: #f15353;
        color: white;
        padding: 0.2rem 0.5rem;
        border-top-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
      }
    }

    #stockcontainer {
      padding: 0 0.75rem;
    }

    .van-button {
      line-height: 2.25rem;
      border-radius: 0.25rem;
      margin: 0;
    }
  }

  #store-position {
    .contact-box {
      .position {
        .iconfont {
          font-size: 20px;
          padding-left: 10px;
          border-left: solid 1px #ebebeb;
        }
      }
    }
  }

  .minicart-content {
    .a3b {
      .a3v {
        width: 2rem;
        height: 2rem;
        background-position: center -4.8rem;
        top: 1.8rem;
        right: 4.8125rem;
      }

      .a3w {
        width: 2rem;
        height: 2rem;
        top: 1.8rem;
        background-position: center 0.2rem;
      }

      input {
        height: 2rem;
        top: 1.8rem;
        border-bottom: solid 0.0625rem #d9d9d9;
      }
    }
  }
}

.a37 {
  top: 0.3rem;
}

.spec_btn {
  float: right;
}

.spec_btn .goods-num {
  position: absolute;
  z-index: 10;
  border-radius: 0.6rem;
  padding: 0 0.3125rem;
  top: -12px;
  right: -9px;
  background: #fff;
  color: #f15353;
}

.spec_btn button {
  width: 3.25rem;
  height: 1.4375rem;
  border-radius: 1rem;
  color: #fff;
  background-color: #ff5d5c;
  padding: 0.3rem;
  font-size: 12px;
}

.spec_box {
  position: relative;
  background: #fff;
  width: 20.625rem;
  height: 24.375rem;
  border-radius: 0.625rem;
}

.spec_box_content {
  background: #fff;
  height: 17.375rem;
  overflow-y: scroll;
  position: absolute;
  top: 2.5rem;
}

.spec_box h3 {
  border-radius: 0.625rem 0.625rem 0 0;
  width: 100%;
  background-color: #fff;
  line-height: 2.75rem;
  border-bottom: solid 0.0625rem #ebebeb;
  font-size: 16px;
  color: #333;
  margin-left: 0;
  position: absolute;
  top: 0;
}

.spec_box h3 i {
  position: absolute;
  right: 0.875rem;
  line-height: 2.75rem;
  color: #999;
  font-size: 18px;
}

.spec_a {
  margin-top: 0.625rem;

  /* background: #fff; */

  /* height: 17.375rem; */

  /* overflow-y: scroll; */

  /* position: absolute; */

  /* top: 2.5rem; */
}

.spec_a h5 {
  display: block;
  line-height: 2.5rem;
  text-align: left;
  padding-left: 1.25rem;
}

.choose-calendar {
  // width: 100%;
  padding: 10px;
  margin-left: 0.8rem;
  box-sizing: border-box;
  background-color: #ffd9d8;
  border-radius: 3px;
  color: #ee2e2b;
  padding-left: 0.5rem;

  span {
    font-weight: bold;
  }
}

.option {
  display: flex;
  padding: 0 1.25rem;
  flex-wrap: wrap;
}

.option .cur {
  border: solid 0.0625rem #ff5d5c;
  background: #faf0f0;
}

.option li {
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

.skuClass {
  width: 100%;
  height: 1.5rem;
  line-height: 1.5rem;
  background-color: #fff;
  position: fixed;
  bottom: 3.4375rem;
  padding: 0 0.875rem;
  color: #f15353;
  font-size: 0.875rem;
  display: flex;
  justify-content: space-between;
}

.add_car {
  width: 100%;
  height: 3.4375rem;
  line-height: 3.4375rem;
  background-color: #fff;
  border-top: solid 0.0625rem #ebebeb;
  position: absolute;
  bottom: 0;
  border-radius: 0 0 0.625rem 0.625rem;
  overflow: hidden;
}

.car_btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.875rem;
  height: 100%;
}

.car_btn .left {
  color: #f15353;
  font-size: 16px;
  text-align: left;
  flex: 0 0 13rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  .good-price {
    line-height: 1.25rem;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .vip-price {
    width: 100%;
    line-height: 1rem;
    font-size: 12px;
    color: #fdbc2e;
  }
}

.car_btn .left span {
  font-size: 12px;
}

.car_btn .right span {
  display: block;
  width: 5.5625rem;
  height: 1.875rem;
  line-height: 1.875rem;
  border-radius: 1rem;
  background: #f15353;
  color: #fff;
  font-size: 14px;
}

.spec_btn button {
  width: 5.25rem;
  height: 1.5rem;
}

.spec_btn .goods-num {
  top: -2px;
  right: 6px;
}

.minicart-content {
  max-height: 28.75rem;
}

.option {
  padding: 0 1.25rem;
}

.car_btn {
  padding: 0 0.875rem;
}

.Box {
  position: absolute;
  right: 0;
  bottom: 2.625rem;
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

.Box span {
  position: absolute;
  right: 3.25rem;
  box-sizing: content-box;
  padding: 0.375rem;
  text-indent: -6249.9375rem;
  background-image: url("//static-o2o.360buyimg.com/daojia/new/images/icon/addNumSprite.png");
  background-repeat: no-repeat;
  -webkit-background-size: 400% 100%;
  background-size: 400% 100%;
  width: 1.5rem;
  height: 1.5rem;
  vertical-align: top;
  border: 0 none;
  -webkit-background-origin: content-box;
  background-origin: content-box;
}

.zx .Box span {
  background-color: transparent;
}

.Box .hide {
  display: none;
}

.Box .show {
  display: inline-block;
}

.Box span.add {
  background-position: 0 0;
  right: 0;
}

.Box span.reduce {
  background-position: -2.625rem 0;
}

.Box span.linksMark {
  background-position: -4.625rem 0;
  padding-right: 0.625rem;
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
  }
}

.pcStyle {
  #hoid,
  .Go_settle {
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

  #foot {
    width: 375px !important;
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

/*
    拓客卡套餐区域
  */
.meal {
  padding: 1.25rem 0.75rem 3.66rem 0.75rem;
  text-align: left;
  background-color: #fff;
  font-size: 0.88rem;

  .timer {
    margin-top: 0.6rem;
  }

  .onece {
    height: 1.88rem;
    background-color: #feebeb;
    border-radius: 0.47rem 0.47rem 0 0;
    text-align: center;
    line-height: 1.88rem;
    font-size: 0.81rem;
    margin-top: 0.91rem;
  }

  .onelis {
    border: 1px solid #e3e3e3;
    border-top: 0;
    height: 5.03rem;
    padding: 0.75rem 0.78rem 0.69rem 0.78rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .oneleft {
      width: 3.59rem;
      height: 3.59rem;
      background-color: #f5f5f5;
      overflow: hidden;

      img {
        width: 100%;
        height: 100% !important;
      }
    }

    .oneright {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 0.5rem;

      .rightTitle {
        font-size: 0.81rem;
        color: #333;
        text-align: left;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }

      .rightBottom {
        font-size: 0.75rem;
        color: #999;
        display: flex;
        align-items: center;

        .ddLeft {
          flex: 1;
        }
      }
    }
  }
}

/* 价格说明 */

.price-desc {
  background-color: #fff;
  padding: 0.8rem;
  margin: 10px;
  border-radius: 10px;

  .price-desc-title {
    text-align: left;
    color: #1f1f1f;
    font-weight: bold;
    margin-bottom: 0.8rem;
  }
}
</style>
