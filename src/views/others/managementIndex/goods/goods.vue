<template>
  <transition name="fade2">
    <div id="goods" v-show="showGood" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <div id="navTab" :class="{ hoet: hoet }">
        <a class="nav1" :class="{ current: currentClass == 0 }" @click.stop="jump(0)">商品</a>
        <a class="nav1" :class="{ current: currentClass == 1 }" @click.stop="jump(1)">评价</a>
        <a class="nav1" :class="{ current: currentClass == 2 }" @click.stop="jump(2)">详情</a>
        <a class="nav1" :class="{ current: currentClass == 3 }" @click.stop="jump(3)" v-if="is_room == 1 && !fun.isTextEmpty(recordsList)">直播</a>
      </div>
      <div id="hoid" @click="goto" :class="{ hoet: hoet }" v-if="isCup">
        <div id="back">
          <i class="iconfont icon-member-left"></i>
        </div>
      </div>
      <div id="cart" v-if="!is_o2o" :class="{ hoet: hoet }">
        <div id="back" v-if="!favorite" @click="onFavorite(favorite)">
          <i class="iconfont icon-bc_like_normal"></i>
        </div>
        <div id="back" v-if="favorite" @click="onFavorite(favorite)">
          <i class="iconfont icon-bc_like" style="color: #ff9601;"></i>
        </div>
      </div>
      <div id="member" @click="gotoMember" :class="{ hoet: hoet }" v-if="isCup">
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
              <div v-if="!goodsInfo.thumb_url || goodsInfo.thumb_url == null">
                <img :src="goodsInfo.thumb" width="100%" />
              </div>
              <div v-for="(ithumb, index) in goodsInfo.thumb_url" :key="index">
                <template v-if="ithumb">
                  <img :src="ithumb" width="100%" />
                </template>
                <!--<template v-if='!ithumb'>-->
                <!--<img src="../../../../assets/images/img_default.png" width="100%">-->
                <!--</template>-->
              </div>
            </c-myswipe>
          </viewer>
          <float-order :broadcast_data="goods_info.broadcast_data"></float-order>
          <div class="rob-time" v-if="isBuy && (isTime || isBegTime)">
            <!-- <div class="img">
          <img src="../../../../assets/images/rob-time.png"
               width="16%;" />
        </div> -->
            <ul class="price">
              <li class="text">限 时 购</li>
              <!-- <li class="none-line"><small>{{$i18n.t('money')}}</small><b>3.2</b>&nbsp;/天</li>
          <li class="middle-line"><small>{{$i18n.t('money')}}</small><b>3.2</b>&nbsp;/天</li> -->
            </ul>
            <div class="time" v-if="!isBegTime">
              <span class="text">距离结束还有:</span>
              <van-count-down :time="fun.getTimeDifference(fun.getTimestamp(endTimeStr))" class="bottom_time" format="DD天HH时mm分ss秒">
                <template #default="timeData">
                  <em style="padding: 0.25rem 0.125rem; border-radius: 0.125rem;">{{ timeData.days < 10 ? `0${timeData.days}` : timeData.days }} </em>天
                  <em style="padding: 0.25rem 0.125rem; border-radius: 0.125rem;">{{ timeData.hours < 10 ? `0${timeData.hours}` : timeData.hours }} </em>
                  <b>:</b>
                  <em style="padding: 0.25rem 0.125rem; border-radius: 0.125rem;">{{ timeData.minutes < 10 ? `0${timeData.minutes}` : timeData.minutes }} </em>
                  <b>:</b>
                  <em style="padding: 0.25rem 0.125rem; border-radius: 0.125rem;">{{ timeData.seconds < 10 ? `0${timeData.seconds}` : timeData.seconds }} </em>
                </template>
              </van-count-down>
            </div>
            <div class="time" v-if="isBuy && isBegTime">
              <span class="text">距开始还剩：</span>
              <van-count-down :time="fun.getTimeDifference(fun.getTimestamp(begTimeStr))" class="bottom_time" format="DD天HH时mm分ss秒">
                <template #default="timeData">
                  <em style="padding: 0.25rem 0.125rem; border-radius: 0.125rem;">{{ timeData.days < 10 ? `0${timeData.days}` : timeData.days }} </em>天
                  <em style="padding: 0.25rem 0.125rem; border-radius: 0.125rem;">{{ timeData.hours < 10 ? `0${timeData.hours}` : timeData.hours }} </em>
                  <b>:</b>
                  <em style="padding: 0.25rem 0.125rem; border-radius: 0.125rem;">{{ timeData.minutes < 10 ? `0${timeData.minutes}` : timeData.minutes }} </em>
                  <b>:</b>
                  <em style="padding: 0.25rem 0.125rem; border-radius: 0.125rem;">{{ timeData.seconds < 10 ? `0${timeData.seconds}` : timeData.seconds }} </em>
                </template>
              </van-count-down>
            </div>
          </div>
          <van-row>
            <!--<el-row>-->
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
                    <span v-if="fun.getPrice() && !goodsInfo.coupon" style="margin-right: 5px;">{{ fun.getPrice() }}</span
                    ><span v-if="goodsInfo.coupon">券后价</span>{{ $i18n.t("money") }}
                    <span id="price-num" class="price-num1" v-if="goodsInfo.vip_level_status && goodsInfo.vip_level_status.status == 1" style="font-size: 14px; font-weight: 500;">
                      {{ goodsInfo.vip_level_status.word }}
                    </span>
                    <span id="price-num" v-else-if="goodsInfo.coupon">{{ goodsInfo.coupon.deduct_price }}</span>
                    <span id="price-num" v-else
                      >{{ goodsInfo.has_option == 1 ? (goodsInfo.min_price == goodsInfo.max_price ? goodsInfo.max_price : goodsInfo.min_price + "-" + goodsInfo.max_price) : goodsInfo.price
                      }}<em v-if="isRent">/天</em></span
                    >
                    <del id="original-del" v-if="parseInt(goodsInfo.market_price)"
                      ><span class="original-price">{{ fun.getMarketPrice() }}:{{ $i18n.t("money") }}{{ goodsInfo.market_price }}</span></del
                    >
                  </van-col>
                  <!-- 天天兑价 -->
                  <van-col :span="24" id="price" v-if="isGoodsLove">
                    <template>
                      <span v-if="fun.getPrice() && !goodsInfo.coupon" style="margin-right: 5px;">{{ fun.getPrice() }}</span
                      ><span v-if="goodsInfo.coupon">券后价</span>{{ $i18n.t("money")
                      }}<span
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

                    <del id="original-del" v-if="parseInt(goodsInfo.market_price)"
                      ><span class="original-price">{{ fun.getMarketPrice() }}:{{ $i18n.t("money") }}{{ goodsInfo.market_price }}</span
                      ><em v-if="isRent">/天</em></del
                    >
                  </van-col>
                </h2>
                <i class="iconfont icon-erweima" @click="postShow()"></i>
                <i class="iconfont icon-fenxiang" @click="shareWeixin()"></i>
                <div class="share_text" @click="shareWeixin()">分享</div>
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
              <van-col :span="12" class="sale"> {{ isRent ? "租赁次数" : "销量" }}:{{ parseInt(goodsInfo.show_sales) + parseInt(goodsInfo.virtual_sales) }} </van-col>
            </van-col>
          </van-row>
          <!-- vant 1.x版本不支持在row col 添加click事件 -->
          <div @click="gotoMemberGradeList(goodsInfo.member_discount.display_page)">
            <van-row style="background: #f5f5f5;">
              <van-col :span="24" id="memberBox" style="padding: 0.3rem 0;" v-if="openVip == '1'">
                <van-col :span="5" class="img">
                  <img src="../../../../assets/images/goods/member@2x.png" alt="" />
                </van-col>
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

          <div class="member-box" v-if="!is_o2o && !isRent && isGoods && goodsInfo.has_option != 1 && goodsInfo.is_added == 1" @click="buyNow">
            <span id="optiondiv" v-if="goodsCount > 0"
              >已选 <em style="padding-left: 0.625rem; color: #333;">{{ goodsCount + goodsInfo.sku }}</em></span
            >
            <span id="optiondiv" v-else>请选择商品数量</span>
            <i class="fa fa-angle-right"></i>
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
              <li class="act3"><span></span></li>
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
          <!-- 运费插件 -->
          <c-freightpricing :datas="freight_pricing" v-if="freight_pricing.is_explain == 1"></c-freightpricing>

          <div id="comment" v-if="goods_type === 'appointment_goods'">
            <!-- 预约商品相关项目 -->
            <div class="evaTop">
              <div class="evaTitle">相关{{ appointmentLang.project }}</div>
              <div class="evaTo" style="color: #ed0606;" @click="gotoProjects()">更多&nbsp;<i class="fa fa-angle-right" style="font-size: 20px;"></i></div>
            </div>
            <div class="ecaBottom" v-if="!fun.isTextEmpty(projects)">
              <van-swipe :loop="false" :width="215" class="evaLoop" :show-indicators="false">
                <van-swipe-item v-for="item in projects.slice(0, 5)" :key="item.project_id">
                  <div class="evaLoopmain projects" @click="goProjectDetails(item.project_id)">
                    <img :src="item.thumb" alt="" />
                    <div class="user">
                      <div class="text" style="-webkit-box-orient: vertical;">{{ item.project_title }}</div>
                    </div>
                    <div style="color: #999;">{{ item.service_count }}次</div>
                  </div>
                </van-swipe-item>
              </van-swipe>
            </div>
            <div v-if="fun.isTextEmpty(projects)" style="padding: 0.875rem; color: #999;">抱歉，暂无相关{{ appointmentLang.project }} ~</div>
          </div>

          <c-comment
            class="section"
            :commentInfo="commentLimit ? commentLimit.data : []"
            :tatal="commentLimit ? commentLimit.total : 0"
            :rate="favorable_rate"
            :goods_id="this.$route.params.id"
            :isCup="this.isCup"
            v-on:RouterTo="FromTo"
          ></c-comment>
          <div id="management" v-if="goods_info.producer_info">
            <div style="display: flex;">
              <div class="mana_o">
                <img :src="goods_info.producer_info.logo_url" alt="" />
              </div>
              <div class="nameMana">
                <div class="nameMana_a">{{ goods_info.producer_info.producer_name }}</div>
                <div class="nameMana_b">
                  热销<em>{{ goods_info.producer_info.sell_total }}</em
                  >件
                </div>
              </div>
            </div>
            <div class="tapMana" @click="tapManage(goods_info.producer_info.id)">进入店铺</div>
          </div>
          <div v-if="!this.fun.isTextEmpty(goodsInfo.has_one_brand)">
            <div class="brand" @click="toBrandDetail(goodsInfo.has_one_brand.id)" v-if="isCup">
              <ul class="logo">
                <li>
                  <img :src="goodsInfo.has_one_brand.logo" alt="" class="logo_img" />
                  <span>{{ goodsInfo.has_one_brand.name }}</span>
                </li>
                <li class="return">品牌介绍</li>
              </ul>
            </div>
          </div>
          <div class="pullUp" v-if="!showPageB" style="">
            <img src="../../../../assets/images/goods/pull_up@2x.png" alt="" id="imgs" :class="[isPullUp ? 'rotateImg' : 'normalImg']" /><i id="loadMore">{{
              isPullUp ? "释放展开图文详情" : "上拉展开图文详情"
            }}</i>
          </div>
          <span v-if="!showPageB" style="display: inline-block; width: 100%; height: 1.5rem;"></span>
          <div id="shopInfo" ref="goodinfo" class="section" :class="{ goodTop: goodTop == true, bottomMargin: isMarginBottom }" v-if="showPageB">
            <p style="" class="title-text">商品详情</p>
            <div id="tabs">
              <div ref="goodPage" id="goodPage">
                <div>
                  <div id="goods_content" v-html="goodDetail.content"></div>
                  <p v-if="fun.isTextEmpty(goodDetail.content)" style="color: #666;">暂无该商品详情 ~</p>
                  <div class="like-list" v-if="fun.isTextEmpty(goodDetail.show_push) ? false : true">
                    <div class="box06">
                      <div class="img">
                        <img src="../../../../assets/images/goods/like@2x.png" />
                      </div>
                      <h3 class="like">猜您喜欢</h3>
                    </div>
                    <div class="like-box">
                      <div class="box" v-for="item in goodDetail.show_push" :key="item.id" @click="pushGoodGoto(item)">
                        <div class="goods-img">
                          <img :src="item.thumb" style="width: 100%; height: 100%;" />
                        </div>
                        <ul class="goods-info">
                          <li class="name" style="-webkit-box-orient: vertical;">
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
                      <div class="img"><img src="../../../../assets/images/cloud.png" /></div>
                      <h4>{{ $i18n.t("没有更多了") }}</h4>
                    </div>
                  </div>

                  <div class="live_list_div section" v-if="is_room == 1 && !fun.isTextEmpty(recordsList)">
                    <c-live :recordsList="recordsList" :showtitle="true"></c-live>
                    <span class="live_more_btn" v-if="showMoreLive" @click.stop="getLiveList(true)">{{ $i18n.t("加载更多") }}</span>
                    <span
                      style="
                        display: inline-block;
                        width: 100%;
                        height: 25rem;
                        background-color: #f5f5f5;
                        padding: 1.5rem 0;
"
                    ></span>
                  </div>
                  <span
                    style="
                      display: inline-block;
                      width: 100%;
                      height: 3rem;
                      background-color: #f5f5f5;
                      padding: 1.5rem 0;
"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <van-popup v-model="popupSpecs" :style="{ overflow: 'visible' }" position="bottom" class="mint-popup-4 pcStyle_mint" closeOnClickModal="true">
        <div class="specifications">
          <div class="icon_close" @click="popupSpecs = false">
            <i class="iconfont icon-close11"></i>
          </div>
          <div class="shopimg">
            <div id="chooser_img" @click="showSkuImages_Methob">
              <img :src="popThumb == null || popThumb == '' || popThumb == undefined ? goodsInfo.thumb : popThumb" />
            </div>
            <div class="right">
              <div class="price">
                {{ $i18n.t("money") }}
                <span id="option_price">{{ popPrice }}</span>
                <span v-if="isRent">/天</span>
              </div>
              <div class="option">库存{{ popStock }}{{ goodsInfo.sku }}</div>
              <div class="option">{{ goodsDescription }}</div>
            </div>
          </div>

          <div class="shopinfo noVantRadio">
            <dl v-for="(specs, i) in goodsInfo.has_many_specs" :key="i">
              <dt>{{ specs.title }}</dt>
              <dd>
                <van-radio-group v-model="specs.description" checked-color="#f15353" @change="selectSpecs">
                  <van-radio :class="{ vantRadioshow: specs.description == specitem }" :disabled="specitem.c" v-for="(specitem, i) in specs.specitem" :name="specitem" :key="i">
                    {{ specitem.title }}
                  </van-radio>
                </van-radio-group>
              </dd>
            </dl>
          </div>
          <div v-if="!isRent">
            <van-row>
              <van-col :span="12" id="num"> 购买数量： </van-col>
              <van-col :span="11">
                <div class="num">
                  <div class="leftnav" @click="reduceGoods">-</div>
                  <!-- <input type="text" disabled=false class="shownum" v-model='goodsCount'> -->
                  <input type="number" class="shownum" v-model.lazy="goodsCount" />
                  <div class="rightnav" @click="addGoods">+</div>
                  <!-- <input type="number" class="shownum" v-model.lazy='goodsCount'> -->
                </div>
              </van-col>
            </van-row>
          </div>
          <van-button type="danger" size="small" id="btsmall" @click="submitAction" v-show="popStock >= 1">
            确认
          </van-button>
          <van-button type="danger" color="#999999" size="small" disabled id="btsmall" v-show="popStock <= 0">
            确认
          </van-button>
        </div>
      </van-popup>
      <van-popup :style="{ overflow: 'visible' }" v-model="popupSpecs2" position="bottom" class="mint-popup-4 pcStyle_mint" closeOnClickModal="true">
        <div class="specifications">
          <div class="shopimg">
            <div id="chooser_img" @click="showSkuImages_Methob">
              <img :src="popThumb" />
            </div>
            <div class="right">
              <div class="price">
                {{ $i18n.t("money") }}
                <span id="option_price">{{ popPrice }}</span>
                <span v-if="isRent">/天</span>
              </div>
              <div class="option">库存{{ popStock }}{{ goodsInfo.sku }}</div>
              <div class="option">{{ goodsDescription }}</div>
            </div>
          </div>

          <div v-if="!isRent">
            <van-row>
              <van-col :span="12" id="num"> 购买数量： </van-col>
              <van-col :span="11">
                <div class="num">
                  <div class="leftnav" @click="reduceGoods">-</div>
                  <!-- <input type="text" disabled=false class="shownum" v-model='goodsCount'> -->
                  <input type="number" class="shownum" v-model.lazy="goodsCount" />
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
          <van-button size="small" id="btsmall" type="danger" v-show="popStock >= 1" @click="buyNowNew">
            确认
          </van-button>
          <van-button type="danger" color="#999999" size="small" disabled id="btsmall" v-show="popStock <= 0">
            确认
          </van-button>
        </div>
      </van-popup>
      <!-- 评价 -->
      <van-popup v-model="popupVisible" position="right"> </van-popup>

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
      <van-popup v-model="showParameter" position="bottom" :style="{ height: '60%' }">
        <van-nav-bar title="商品参数" class="pcStyle_ydT">
          <template #right>
            <i class="iconfont icon-close11" style="color: #666; size: 1.25rem;" @click="showParameter = false"></i>
          </template>
        </van-nav-bar>
        <div style="clear: both; margin-top: 2.8125rem;" class="pcStyle_ydC">
          <ul class="parameterClass">
            <li v-for="(items, i) in goodsInfo.has_many_params" :key="i">
              <span class="leftb">{{ items.title }}</span>
              <span class="rightb">{{ items.value }}</span>
            </li>
            <p class="notext" v-if="fun.isTextEmpty(goodsInfo.has_many_params)"><br />抱歉，暂无该商品参数 ~</p>
          </ul>
        </div>
      </van-popup>
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
      <van-popup v-model="showProjects" position="right" duration="0" :style="{ height: '100%', width: '100%' }">
        <van-nav-bar :title="'全部相关' + appointmentLang.project" class="pcStyle_ydT">
          <template #left>
            <span>
              <van-icon name="arrow-left" size="18" @click.native="showProjects = false" color="#333" />
            </span>
          </template>
        </van-nav-bar>
        <!-- <div style="height: 50px"></div> -->
        <!-- 全部相关项目 -->
        <div class="projects1" v-for="item in projects" :key="item.project_id" @click="goProjectDetails(item.project_id)">
          <img :src="item.thumb" alt="" />
          <div class="user">
            <div class="text" style="-webkit-box-orient: vertical;">{{ item.project_title }}</div>
            <div style="color: #999; line-height: 2rem; text-align: right;">{{ item.service_count }}次</div>
          </div>
        </div>
      </van-popup>
      <div v-if="isCup">
        <div v-if="isRent">
          <div class="but" v-if="isRentBuyShow" @click="toRentBuy(goodsInfo.lease_toy.immed_goods_id)">
            <button>立即<br />购买</button>
          </div>
        </div>
      </div>
      <div id="foot">
        <div class="addfav" @click="gotoCart" v-if="isCup">
          <template>
            <ul>
              <li>
                <i class="iconfont icon-info_store"></i>
              </li>
              <li>首页</li>
            </ul>
          </template>
        </div>
        <div v-if="isCup" class="addfav">
          <div type="info" v-if="!is_o2o">
            <template>
              <!-- <i class="fa fa-cart-plus active" @click="gotoCart1()"></i> -->
              <ul>
                <li>
                  <i class="iconfont icon-goods_car active" @click="gotoCart1()"></i>
                </li>
                <li>购物车</li>
              </ul>
            </template>
          </div>
        </div>
        <div class="addfav" v-if="!is_o2o && !isMiniApp">
          <a @click="show1 = true">
            <ul>
              <li>
                <i class="iconfont icon-goods_kefu" style="font-size: 1.375rem;"></i>
              </li>
              <li>客服</li>
            </ul>
          </a>
        </div>
        <div class="cservice" v-if="!is_o2o && isMiniApp">
          <a @click="this.fun.gotoMiniAppCs">
            <ul>
              <li><i class="iconfont icon-goods_kefu"></i></li>
              <li>客服</li>
            </ul>
          </a>
        </div>
        <div :class="{ cart: true, cell: true, nocar: !isGoods || !isAddCart }" @click="addCart" v-if="isCup && !isBegTime && nocart && !isPendingOrder">
          加入购物车
        </div>
        <div v-if="!isRent" class="buy cell">
          <div :class="{ nocar: !isGoods }" v-if="!is_o2o" @click="buyNow">
            <block v-if="!isBuy"> 立即购买 </block>
            <block v-if="isBuy && !isBegTime"> 立即购买 </block>
            <div class="time" style="line-height: 1rem;" v-if="isBuy && isBegTime">
              <div class="text" style="padding-top: 0.5rem;">距开始还剩</div>
              <van-count-down :time="fun.getTimeDifference(fun.getTimestamp(begTimeStr))" class="bottom_time1" format="DD天HH时mm分ss秒">
                <template #default="timeData">
                  <em>{{ timeData.days < 10 ? `0${timeData.days}` : timeData.days }}</em
                  >天
                  <em>{{ timeData.hours < 10 ? `0${timeData.hours}` : timeData.hours }} </em>
                  <b>:</b>
                  <em>{{ timeData.minutes < 10 ? `0${timeData.minutes}` : timeData.minutes }} </em>
                  <b>:</b>
                  <em>{{ timeData.seconds < 10 ? `0${timeData.seconds}` : timeData.seconds }} </em>
                </template>
              </van-count-down>
            </div>
          </div>
        </div>

        <div v-if="isRent && !isCup" class="buy cell">
          <div :class="{ nocar: !isGoods }" v-if="!is_o2o" @click="buyNow">立即租</div>
        </div>
      </div>
      <!-- <div :class="{bottomMargin:isMarginBottom}"></div> -->
      <!--      <div style="height:3.125rem;"></div>-->
      <div style="height: 0;" v-if="this.fun.isTextEmpty(goodsInfo.show_push) ? false : true"></div>
      <div style="height: 3.125rem;" v-if="this.fun.isTextEmpty(goodsInfo.show_push)"></div>
      <van-popup v-model="show1" position="center" round style="width: 80%;">
        <div class="pop-content">
          <div class="pop-top">
            <div class="left" v-if="!fun.isTextEmpty(cservice)">
              <div class="wrap">
                <a :href="cservice">
                  <div class="image"><img src="../../../../assets/images/kf_online_contect@2x.png" /></div>
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
                  <a :href="`tel:${service_mobile}`"><img src="../../../../assets/images/kf_tel_contect@2x.png"/></a>
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
      <van-image-preview v-model="showSkuImages" :images="skuImages" @change="onChangeSkuImagesIndex" @close="onCloseSkuImages" :start-position="activeSkuIndex" :loop="false">
        <template v-slot:index></template>
        <template v-slot:cover>
          <div class="sku_price">
            <!-- <p style="margin-bottom:8px;">【{{ goodsInfo.has_many_options[activeSkuIndex].title }}】</p> -->
            <p v-if="goodsInfo.has_option == 1">{{ $i18n.t("money") }}{{ goodsInfo.has_many_options[activeSkuIndex].product_price }}</p>
            <p v-if="goodsInfo.has_option != 1">{{ $i18n.t("money") }}{{ goodsInfo.price }}</p>
          </div>
        </template>
      </van-image-preview>
      <yz-goodsposter v-model="posterShow" :posterData="posterImg" :goodstype="true"></yz-goodsposter>
    </div>
  </transition>
</template>

<script>
import goods from "./goods_controller";

export default goods;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../../../assets/css/cgoods.scss";

.bottom_time1 {
  color: #fff;
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
  width: 6.1563rem;
  height: 1.25rem;
  background-color: #ffe6e3;
  border-radius: 0.125rem;
  color: #ff3203;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.75rem;
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
</style>
