<template>
  <transition name="fade2">
    <div id="goods" v-show="showGood" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <U_backup :btnFlag="btnFlag" :id="1" :datas="btnData"></U_backup>
      <!-- 顶部导航标签 start -->
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
      <div id="cart" :class="{ hoet: hoet }" v-if="goods_type != 'hotelGoods' && isFavoriteIcon">
        <div id="back" v-if="!favorite" @click="onFavorite(favorite)">
          <i class="iconfont icon-bc_like_normal"></i>
        </div>
        <div id="back" v-if="favorite" @click="onFavorite(favorite)">
          <i class="iconfont icon-bc_like" style="color: #ff9601;"></i>
        </div>
      </div>
      <div id="cart" :class="{ hoet: hoet }" v-else>
        <div id="back" @click="gotoUrl('home')">
          <i class="iconfont icon-ai-home"></i>
        </div>
      </div>
      <div id="member" @click="gotoMember" :class="{ hoet: hoet }">
        <div id="back">
          <!-- <i class="fa fa-user"></i> -->
          <i class="iconfont icon-wode-wode"></i>
        </div>
      </div>
      <!-- 顶部导航标签 end -->

      <!-- 新抽奖悬浮按钮 -->
      <div class="luck-draw-btn" v-if="!fun.isTextEmpty(luck_draw) && luck_draw.number > 0">
        <img class="luck-draw-btn-img" :src="luck_draw.luck_img_url" alt="" @click.stop="gotoLuckDraw" />
      </div>
      <!-- 新抽奖悬浮按钮 end -->

      <div ref="onePage" id="onePage" style="overflow: hidden; min-height: 100vh;">
        <div style="-webkit-overflow-scrolling: touch; min-height: 101vh;" id="main">
          <!-- 轮播图组件 商品视频、商品图片
            @props {thumb_url} 商品图片
            @props {thumb} 其他图片
            @props {goods_video} 商品视频
            @props {video_image} 视频封面
          -->
          <goodSwipe :thumb_url="goodsInfo.thumb_url || []" :thumb="goodsInfo.thumb" :goods_video="goodsInfo.goods_video" :video_image="goodsInfo.video_image"></goodSwipe>

          <!-- 订单飘窗放在viewer标签里面 会把飘窗的会员头像放大预览 #59819 -->
          <float-order v-if="showGood" :broadcast_data="goods_plugin.broadcast_data || []" :goods_type="goods_type" :pluginName="goods_info.love_plugin_name"></float-order>

          <!-- 限时购、显示活动倒计时
            注意倒计时结束是否需要触发方法,改变底部商品导航组件<goodsAction>一些按钮的状态
            Methob {begTimeBtn} 活动开始 倒计时结束触发
            Methob {timeEnd} 活动结束 倒计时结束触发
          -->
          <countDown :loaging="showGood" :goods_type="goods_type" :goods_info="goods_info" v-on:timeEnd="timeEnd" v-on:begTimeBtn="begTimeBtn"></countDown>

          <!--
            内容：主要：（商品价格、标题、库存、销售、分享、海报、优惠券按钮）、其他（...）
            插件区别：1.酒店无需显示库存、销量，不显示优惠券按钮
                      2.拼团不显示价格(最低价在组件<countDown>里显示)，没有优惠券，库存不是商品库存(后台设置的活动库存)
          -->
          <priceTitleRepertorySales
            :loaging="showGood"
            :wx_video_link="wx_video_link"
            :goods_info="goods_info"
            :goods_type="goods_type"
            :isRent="isRent"
            v-on:shareWeixin="shareWeixin"
            :fatherTitle="fatherTitle"
          ></priceTitleRepertorySales>

          <!-- 会员折扣 显示条件：isShow_memberDiscount-->
          <memberDiscount :loaging="showGood" :goodsInfo="goodsInfo" v-if="isShow_memberDiscount"></memberDiscount>

          <groupWork v-if="showGood && goods_type == 'groupWorkGood'" :goods_info="goods_info"></groupWork>

          <!-- 玩法步骤
               @props {stepConfig} Object
                -- stepConfig.title: 标题
                -- stepConfig.list 玩法介绍，数组类型
          -->
          <goodStep :stepConfig="stepConfig" :goods_type="goods_type" v-if="Object.keys(stepConfig).length != 0"></goodStep>

          <!-- 拼团记录 -->
          <participateHistory v-if="goods_info.is_show_custom_number" :countText="goods_info.join_number_custom_text" :totalText="goods_info.winning_number_custom_text"></participateHistory>

          <!-- 抢团结果流程 -->
          <template v-if="goods_type == 'grab_group'">
            <grabGroupResult :goods_info="goods_info" v-if="goods_info.goods && goods_info.goods.transport_reward > 0"></grabGroupResult>
          </template>

          <!-- 抢团插件： 团长奖励 -->
          <div class="member-reward" v-if="goodsInfo.is_profit == 1">
            <div class="member-reward-btn">团长奖励</div>
            交易成功团长可获得
            <div class="member-reward-price">{{ $i18n.t("money") }} {{ goodsInfo.profit }}</div>
          </div>

          <!-- 一口价插件入口 跳转router-name:fixedPrice -->
          <fixedPrice v-if="hasActivity" :plugindata="goods_plugin.pack_fixed_price"></fixedPrice>

          <div class="member-box" v-if="isShowCellNumber && !isRent && isGoods && goodsInfo.has_option != 1 && goodsInfo.is_added == 1" @click="buyNow">
            <span class="optiondiv" v-if="goodsCount > 0"
              >已选 <em style="padding-left: 0.625rem; color: #333;">{{ goodsCount + goodsInfo.sku }}</em>
            </span>
            <span class="optiondiv" v-else>请选择商品数量</span>
            <i class="fa fa-angle-right"></i>
          </div>

          <!-- "应用插件"插件
            点击显示插件列表弹窗
          -->
          <prdocutMarket v-if="prdocut_market.plugin && prdocut_market.plugin.length > 0" :prdocut_market="prdocut_market"></prdocutMarket>

          <!-- 拼团插件：拼团奖励 -->
          <div class="explain" v-if="goods_info.is_lottery">
            <h2 class="title">
              {{ goods_info.lottery_title }}
            </h2>
            <div class="content" style="text-align: left;" v-html="goods_info.lottery_desc"></div>
          </div>

          <!--拼团插件 开团列表 -->
          <groupList
            :goods_info="goods_info"
            v-on:shareWeixin="shareWeixin"
            ref="groupList"
            v-if="(goods_type == 'groupWorkGood' && !this.fun.isTextEmpty(goods_info.alliance)) || !this.fun.isTextEmpty(goods_info.display_team)"
          ></groupList>

          <!-- 抢团插件 开团列表（含弹窗） -->
          <snatchRegimentList :team="team" :num="goodsInfo.limit_num" v-if="!this.fun.isTextEmpty(team)"></snatchRegimentList>

          <!-- 门店信息 (门店信息,进入门店聚合页,地图导航等)
              @props {storeId} 门店id
              @props {storeName} 门店名称
              @props {mobile} 门店联系电话
              @props {longitude/latitude} 经纬度
           -->
          <o2oModel
            v-if="$route.params.store_id && goods_info.store"
            :storeId="this.$route.params.store_id"
            :storeName="goods_info.store.store.store_name"
            :mobile="goods_info.store.store.mobile"
            :longitude="goods_info.store.store.longitude"
            :latitude="goods_info.store.store.latitude"
            v-on:showCustomer="showCustomer"
          ></o2oModel>

          <!-- 珍惠拼
              @props {member_count} 参与人数
              @props {my_win_count} 当前会员拼中次数
              @props {is_pearl} 0没有珍珠，1有珍珠
              @props {is_integral} 消费积分插件是否开启0没有珍珠，1有珍珠
              @props {love_plugin_name} 爱心值插件自定义名称
          -->
          <zhpGroup
            v-if="goods_type == 'zhpGroup'"
            :member_count="goods_info.member_count"
            :my_win_count="goods_info.my_win_count"
            :is_pearl="goods_info.is_pearl"
            :is_integral="goods_info.is_integral"
            :integral_name="goods_info.love_plugin_name"
            :description="goods_info.description"
            :group_id="goods_info.group_id"
            :love_plugin_name="goods_info.love_plugin_name"
            :love_status="goods_info.love_status"
            :my_surplus_count="goods_info.my_surplus_count"
          ></zhpGroup>

          <!-- 活动、参数、自购省、服务标签
              备注: 1.门店插件只显示门店信息
           -->
          <selfParameterServicetag :loaging="showGood" :goods_type="goods_type" :goods_info="goods_info"></selfParameterServicetag>

          <!-- 项目核销 -->
          <projectCard v-if="goods_type === 'store_projects_goods'" :id="this.$route.params.id"></projectCard>

          <!-- 运费插件 -->
          <c-freightpricing :datas="freight_pricing" v-if="freight_pricing.is_explain == 1"></c-freightpricing>

          <!-- 预约商品相关项目 -->
          <appointmentPlugin v-if="goods_type === 'appointment_goods'"></appointmentPlugin>

          <!-- 微贴 start -->
          <invitation :goods_plugin="goods_info" v-if="showGood"></invitation>
          <!-- 微贴 end -->

          <!-- 评论组件 -->
          <c-comment class="section" :commentInfo="commentLimit" :num="totalComment" :rate="favorable_rate" :goods_id="this.$route.params.id" v-on:RouterTo="FromTo"></c-comment>

          <!-- 厂家管理 -->
          <producerM v-if="goods_type == 'managementGoods' && goods_info.producer_info" :producer_info="producer_info"></producerM>

          <!-- 商品品牌  后台商品发布/编辑里设置 -->
          <div v-if="isShow_brand && !this.fun.isTextEmpty(goodsInfo.has_one_brand)">
            <div class="brand" @click="toBrandDetail(goodsInfo.has_one_brand.id)">
              <ul class="logo">
                <li>
                  <img :src="goodsInfo.has_one_brand.logo" alt class="logo_img" />
                  <span>{{ goodsInfo.has_one_brand.name }}</span>
                </li>
                <li class="return">品牌介绍</li>
              </ul>
            </div>
          </div>

          <!-- 供应商入口  -->
          <supplierModel
            v-if="!this.fun.isTextEmpty(supplierData) && supplierData.is_open == 1 && goods_type == 'supplierGoods'"
            :supplierData="supplierData"
            :count="goodsInfo.supplier_goods_count"
          ></supplierModel>

          <div class="pullUp" v-if="!showPageB" style="">
            <img src="../../assets/images/goods/pull_up@2x.png" alt="" id="imgs" :class="[isPullUp ? 'rotateImg' : 'normalImg']" /><i id="loadMore">{{
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

                  <!-- 猜你喜欢
                      开启方式：商品发布/编辑，营销挂件的推广商品选择
                  -->
                  <guessLike
                    :list="goodDetail.show_push"
                    :word="goodsInfo.vip_level_status && goodsInfo.vip_level_status.word"
                    :status="goodsInfo.vip_level_status"
                    v-if="goodDetail.show_push && !fun.isTextEmpty(goodDetail.show_push)"
                  ></guessLike>

                  <!-- 直播列表 -->
                  <div class="live_list_div section" v-if="is_room == 1 && !fun.isTextEmpty(recordsList)">
                    <c-live :recordsList="recordsList" :showtitle="true"></c-live>
                    <span class="live_more_btn" v-if="showMoreLive" @click.stop="getLiveList(true)">{{ $i18n.t("加载更多") }}</span>
                    <span style="display: inline-block; width: 100%; min-height: 25rem; background-color: #f5f5f5; padding: 1.5rem 0;"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 商品规格弹窗 、无规格修改购买数量-->
      <goodSpecs v-model="popupSpecs" ref="goodSku" :goods_info="goods_info" :goodsInfo="goodsInfo" v-on:closeSpecsPopup="close_yz_specs_popup" :isRent="isRent" :goods_plugin="goods_plugin">
        <div class="slot_style" v-if="goods_type == 'grab_group'">
          <!-- 抢团插件 显示该团几人团 -->
          <span style="background-color: rgb(241, 78, 78); color: rgb(255, 255, 255);">{{ goodsInfo.limit_num }}人团</span>
        </div>

        <div class="shopinfo noVantRadio" style="margin: 0;" v-if="goods_type == 'newRetailSalesGood' && this.$route.params.mode == 2 && !this.fun.isTextEmpty(goodsInfo.detail)">
          <!-- 新零售插件 -->
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
      </goodSpecs>

      <template v-if="showComment">
        <van-popup v-model="showComment" position="bottom" :style="{ height: '100%', width: '100%' }">
          <van-nav-bar title="全部评价" class="pcStyle_ydT">
            <template #left>
              <span>
                <van-icon name="arrow-left" size="18" @click.native="CloseComment" color="#333" />
              </span>
            </template>
          </van-nav-bar>
          <!-- 商品评价 -->
          <c-commentlist v-on:clickMore="getCommentData" :list="third_content" :noMoreComment="noMoreComment" v-if="showComment"></c-commentlist>
        </van-popup>
      </template>

      <!-- 商品底部导航
         组件内变量 actionArr 可配置需要显示的按钮(可参考已有)
         注意: 禁用按钮显影条件isDisabled和文字isDisabledText  不在变量actionArr内配置,需另外
       -->
      <goodsAction
        ref="goodsAction"
        :loaging="showGood"
        :goods_info="goods_info"
        :goods_plugin="goods_plugin"
        :goods_type="goods_type"
        :isRent="isRent"
        :isGoods="isGoods"
        :isBuy="isBuy"
        :isTime="isTime"
        :isBegTime="isBegTime"
        :endTimeStr="endTimeStr"
        :begTimeStr="begTimeStr"
        :favoriteStatus="favorite"
        v-on:showGroupList="showGroupList"
        v-on:popupModeshowChild="popupModeshowChild"
        v-on:changeFavorite="changeFavorite"
        v-on:deactivatedShowGood="deactivatedShowGood"
        :cservice="cservice"
        :service_mobile="service_mobile"
        :service_QRcode="service_QRcode"
        :supplierDataId="supplierData.id"
        :fatherTitle="fatherTitle"
      ></goodsAction>

      <div style="height: 0;" v-if="this.fun.isTextEmpty(goodsInfo.show_push) ? false : true"></div>
      <div style="height: 3.125rem;" v-if="this.fun.isTextEmpty(goodsInfo.show_push)"></div>

      <div v-if="isRent">
        <div class="but" v-if="isRentBuyShow" @click="toRentBuy(goods_plugin.lease_toy.immed_goods_id)">
          <button>立即<br />购买</button>
        </div>
      </div>

      <!-- 商品详情页图片放大start -->
      <van-image-preview v-model="showBigImg" :images="bigImages"></van-image-preview>
      <!-- 商品详情页图片放大 end -->
    </div>
  </transition>
</template>

<script>
import goods from "./goods_controller";

export default goods;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/css/goods.scss";

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

.explain {
  margin-top: 0.625rem;
  background: #fff;
  padding: 0.875rem;

  h2 {
    font-weight: normal;
    font-size: 15px;
    margin-bottom: 0.625rem;
    text-align: left;
  }

  .content {
    text-align: center;
    background: #fafafa;
    display: flex;
    padding: 0.375rem;
  }
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

.member-reward {
  display: flex;
  align-items: center;
  padding: 0 0.875rem;
  height: 2.5rem;
  line-height: 2.5rem;
  background: #fff;
  margin-top: 0.625rem;
  font-size: 0.75rem;

  .member-reward-btn {
    height: 1.5rem;
    line-height: 1.5rem;
    background-color: rgba(255, 93, 0, 0.1);
    border-radius: 0.75rem;
    padding: 0 0.5rem;
    margin-right: 0.625rem;
    color: #ff6000;
  }

  .member-reward-price {
    color: #ff2c29;
    margin-left: 0.5rem;
  }
}
</style>
