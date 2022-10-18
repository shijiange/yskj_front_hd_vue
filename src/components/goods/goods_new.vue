<template>
  <transition name="fade2">
    <div id="goods" v-show="showGood" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <U_backup :btnFlag="btnFlag" :id="1" :datas="btnData"></U_backup>
      <U_backup :btnFlag="true" :id="2" :datas="btnData2" :poster="1" @poster="postShow()" v-if="!this.$route.query.is_retail"></U_backup>
      <!-- 顶部导航标签 start -->
      <div id="navTab" :class="{ hoet: hoet }">
        <a class="nav1" :class="{ current: currentClass == 0 }" @click.stop="jump(0)">{{isTimeAppiont?`${appointmentLang.service}`:'商品'}}</a>
        <!--<a class="nav1" :class="{ current: currentClass == 3 }" @click.stop="jump(3)" v-if="is_room == 1 && !fun.isTextEmpty(recordsList)">直播</a> 顺序变了不好处理先隐藏-->
        <a class="nav1" :class="{ current: currentClass == 1 }" @click.stop="jump(1)">评价</a>
        <a class="nav1" :class="{ current: currentClass == 2 }" @click.stop="jump(2)">详情</a>
      </div>
      <div id="hoid" @click="goto" :class="{ hoet: hoet }">
        <div class="back">
          <i class="iconfont icon-member-left"></i>
        </div>
      </div>
      <div id="member" @click="gotoMember" :class="{ hoet: hoet }" v-if="is_member_enter">
        <div class="back">
          <i class="iconfont icon-wode-wode"></i>
        </div>
      </div>
      <div class="cart" :class="{ hoet: hoet }" v-if="goods_type == 'hotelGoods' || goods_type == 'group_goods' || goods_type == 'zhpGroup' || isTimeAppiont">
        <div class="back" @click="gotoUrl('home')">
          <i class="iconfont icon-ai-home"></i>
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
          <goodSwipe @setShowBigImg="setShowBigImg" :child_showBigImg="child_showBigImg" :thumb_url="goodsInfo.thumb_url || []" :thumb="goodsInfo.thumb" :goods_video="goodsInfo.goods_video" :video_image="goodsInfo.video_image"></goodSwipe>

          <!-- 订单飘窗放在viewer标签里面 会把飘窗的会员头像放大预览 #59819 -->
          <float-order v-if="showGood" :broadcast_data="goods_plugin.broadcast_data || []" :goods_type="goods_type" :pluginName="goods_info.integral_name"></float-order>

          <!-- 限时购、显示活动倒计时
            注意倒计时结束是否需要触发方法,改变底部商品导航组件<goodsAction>一些按钮的状态
            Methob {begTimeBtn} 活动开始 倒计时结束触发
            Methob {timeEnd} 活动结束 倒计时结束触发
          -->
          <countDown :loaging="showGood" :goods_type="goods_type" :goods_info="goods_info" v-on:timeEnd="timeEnd" v-on:begTimeBtn="begTimeBtn"></countDown>

          <!--
            内容：主要：（商品价格、标题、库存、销售、分享、海报、优惠券按钮、会员折扣、爱心值奖励 ）、其他（...）
            插件区别：1.酒店无需显示库存、销量，不显示优惠券按钮
                      2.拼团不显示价格(最低价在组件<countDown>里显示)，没有优惠券，库存不是商品库存(后台设置的活动库存)
          -->
          <priceTitleRepertorySales
            :loading="showGood"
            :btnFlag="btnFlag"
            :wx_video_link="wx_video_link"
            :goods_info="goods_info"
            :goods_type="goods_type"
            :isRent="isRent"
            ref="priceTitleRepertorySales"
            :favorite="favorite"
            @onFavorite="onFavorite"
            v-on:shareWeixin="shareWeixin"
            :fatherTitle="fatherTitle"
          ></priceTitleRepertorySales>

          <!--0.1元新拼团-->
          <groupWork v-if="showGood && goods_type == 'groupWorkGood'" :goods_info="goods_info"></groupWork>

          <!-- 玩法步骤
               @props {stepConfig} Object
                -- stepConfig.title: 标题
                -- stepConfig.list 玩法介绍，数组类型
          -->
          <goodStep :stepConfig="stepConfig" :goods_type="goods_type" v-if="Object.keys(stepConfig).length != 0"></goodStep>
          <!-- 小猪欢欢二期 拼团人数 -->
          <groupTotal :goods_info="goods_info"
            v-if="goods_info.fight_groups_number_show == '1'"></groupTotal>
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

          <!-- 拼团插件：拼团奖励 -->
          <div class="explain" v-if="goods_info.is_lottery">
            <h2 class="title">
              {{ goods_info.lottery_title }}
            </h2>
            <div class="content" style="text-align: left; overflow: hidden;" v-html="goods_info.lottery_desc"></div>
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
          <timeAppointment v-on:postActionChild='getTimeAppointment' :plugin="goods_plugin.reserve_simple_goods" v-if="isTimeAppiont"></timeAppointment>
          <!-- 一口价插件入口 跳转router-name:fixedPrice
               活动、参数、自购省、服务标签、应用市场
              备注: 1.门店插件只显示门店信息-->
          <selfParameterServicetag
            :hasActivity="hasActivity"
            :prdocut_market="prdocut_market"
            :plugindata="goods_plugin.pack_fixed_price"
            :loading="showGood"
            :goods_type="goods_type"
            :goods_info="goods_info"
          ></selfParameterServicetag>

          <!--群活码-->
          <div class="group-code" v-if="goods_plugin.group_code && goods_plugin.group_code.goods_entrance == 1">
            <div class="group-code-face" v-if="goods_plugin.group_code.code_logo">
              <img :src="goods_plugin.group_code.code_logo" alt="" />
            </div>
            <div class="group-code-content">
              <div class="group-code-name">{{ goods_plugin.group_code.code_title }}邀请您添加专属福利群！</div>
              <div class="group-code-desc">{{ goods_plugin.group_code.citation_copy }}</div>
            </div>
            <div class="group-code-button" @click="toGroupCode">去加群</div>
          </div>

          <!-- 项目核销 -->
          <projectCard v-if="goods_type === 'store_projects_goods'" :id="this.$route.params.id"></projectCard>

          <!-- 运费插件 -->
          <c-freightpricing :datas="freight_pricing" v-if="freight_pricing.is_explain == 1"></c-freightpricing>

          <!-- 预约商品相关项目 -->
          <appointmentPlugin v-if="goods_type === 'appointment_goods'"></appointmentPlugin>

          <!-- 厂家管理 -->
          <producerM v-if="goods_type == 'managementGoods' && goods_info.producer_info" :producer_info="producer_info"></producerM>

          <!--微贴和直播-->
          <invitationAndLive
            class="invitationAndLive"
            :goods_info="goods_info"
            :min_micro="min_micro"
            :recordsList="recordsList"
            :tabList="tabList"
            v-if="showGood && tabList.length > 0"
          ></invitationAndLive>

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

          <!-- 精选口碑 评论组件 -->
          <c-comment class="section"
            :commentInfo="commentLimit"
            :num="totalComment"
            :rate="favorable_rate"
            :is_show_default_praise="is_show_default_praise"
            :goods_id="this.$route.params.id"
            v-on:RouterTo="FromTo"
          ></c-comment>

          <!-- 猜你喜欢 开启方式：商品发布/编辑，营销挂件的推广商品选择 -->
          <guessLike
            :list="goodDetail.show_push"
            :word="goodsInfo.vip_level_status && goodsInfo.vip_level_status.word"
            :status="goodsInfo.vip_level_status"
            v-if="showGood && goodDetail.show_push && goodDetail.show_push.length > 0"
          ></guessLike>

          <!-- 供应商入口  -->
          <supplierModel
            v-if="!this.fun.isTextEmpty(supplierData) && supplierData.is_open == 1 && goods_type == 'supplierGoods'"
            :supplierData="supplierData"
            :count="goodsInfo.supplier_goods_count"
          ></supplierModel>

          <div class="good-item-box" v-if="goodsInfo.has_many_params && goodsInfo.has_many_params.length > 0">
            <div class="goods-param">
              <div class="goods-param-title">
                商品参数
              </div>
              <div class="goods-param-content">
                <div class="con" v-for="(items, i) in goodsInfo.has_many_params" :key="i" v-if="i < 6 || showParameter">
                  <div class="con-left">{{ items.title }}</div>
                  <div class="con-right">{{ items.value }}</div>
                </div>
              </div>

              <div class="goods-foot" @click="showParameter = !showParameter" v-if="goodsInfo.has_many_params.length > 6">
                <div class="goods-foot-title">
                  {{ showParameter ? "收起" : "展开" }}
                </div>
                <div class="top" v-if="showParameter"><i style="font-size: 10px;" class="iconfont icon-member-left"></i></div>
                <div class="down" v-if="!showParameter"><i style="font-size: 10px;" class="iconfont icon-member-left"></i></div>
              </div>
            </div>
          </div>

          <!-- 规格信息 -->
          <div class="spec_box" v-if="goodsInfo.spec_info && goodsInfo.spec_info.length > 0">
            <template v-for="(item,ind) in goodsInfo.spec_info">
              <div class="spec_list" :key="ind">
                <div class="spec_left">
                  <img :src="item.info_img_src" alt="">
                </div>
                <div class="spec_conten" >
                  <div class="spec_conten_lis" v-for="(datas,index) in item.content" :key="index">
                    {{datas.content}}
                  </div>
                </div>
                <div class="spec_right">
                  <div class="spec_right_btn" @click="pushCart(item)">购物车+</div>
                </div>
              </div>
            </template>
          </div>
          <div class="payIntro" v-if="goods_plugin.paid_content && goods_plugin.paid_content.display_set == 'before'">
            <template v-if="!goods_plugin.paid_content.editor">
              <div style="" class="title-text">{{goods_plugin.paid_content.title}}</div>
              <div class="txt">
                <i class="iconfont icon-customform_list_2"></i>
                {{goods_plugin.paid_content.remind}}</div>
            </template>
            <template v-else>
              <div v-html="goods_plugin.paid_content.editor"></div>
            </template>
            
          </div>
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
                </div>
                <div class="payIntro" v-if="goods_plugin.paid_content && goods_plugin.paid_content.display_set == 'after'">
                  <template v-if="!goods_plugin.paid_content.editor">
                    <div style="" class="title-text">{{goods_plugin.paid_content.title}}</div>
                    <div class="txt">
                      <i class="iconfont icon-customform_list_2"></i>
                      {{goods_plugin.paid_content.remind}}</div>
                  </template>
                  <template v-else>
                    <div v-html="goods_plugin.paid_content.editor"></div>
                  </template>
                  
                </div>
                <!--价格说明-->
                <div class="price-desc" v-if="goodsInfo.is_price_desc">
                  <p class="price-desc-title ">{{goodsInfo.price_desc_title}}</p>
                  <div id="a_content" v-html="goodsInfo.explain"></div>
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

        <div id="newRetail-noVantRadio" class="shopinfo" style="margin: 0;" v-if="goods_type == 'newRetailSalesGood' && this.$route.params.mode == 2 && !this.fun.isTextEmpty(goodsInfo.detail)">
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

      <!-- <template v-if="showComment">
        <van-popup v-model="showComment" position="bottom" :style="{ height: '100%', width: '100%' }">
          <van-nav-bar title="全部评价" class="pcStyle_ydT">
            <template #left>
              <span>
                <van-icon name="arrow-left" size="18" @click.native="CloseComment" color="#333" />
              </span>
            </template>
          </van-nav-bar> -->
      <!-- 商品评价 -->
      <!-- <c-commentlist v-on:clickMore="getCommentData" :list="third_content" :noMoreComment="noMoreComment" v-if="showComment"></c-commentlist>
        </van-popup>
      </template> -->

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

      <div style="height: 50px;"></div>

      <div v-if="isRent">
        <div class="but" v-if="isRentBuyShow" @click="toRentBuy(goods_plugin.lease_toy.immed_goods_id)">
          <button>立即<br />购买</button>
        </div>
      </div>

      <!-- 商品详情页图片放大start -->
      <van-image-preview v-model="showBigImg" :images="bigImages" :start-position="imgStart"></van-image-preview>
      <!-- 商品详情页图片放大 end -->
    </div>
  </transition>
</template>

<script>
import goods_new_controller from "./goods_new_controller";
export default goods_new_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
/* 顶部导航 */
#hoid {
  padding: 0.3125rem;
  width: 1.6rem;
  position: fixed;
  z-index: 2;
  height: 2.25rem;
}

#hoid.hoet {
  background: rgba(253, 253, 253, 1);
  width: 100%;
  color: #1f1f1f;
}

#member {
  padding: 0.3125rem;
  width: 1.6rem;
  position: fixed;
  z-index: 2;
  box-sizing: content-box;
  right: 0;
}

.cart {
  padding: 0.3125rem;
  width: 1.6rem;
  position: fixed;
  z-index: 2;
  box-sizing: content-box;
  right: 2rem;
}

.back {
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 100%;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.4);
  text-indent: 0;
  line-height: 1.7rem;
  overflow: hidden;
}

.hoet .back {
  transition: 0.1s;
  background-color: rgba(237, 237, 237, 0);
  color: #1f1f1f;
}

#navTab {
  position: fixed;
  z-index: 999;
  width: 14rem;
  left: 50%;
  margin-left: -7rem;
  display: none;
  background: #fdfdfd;

  a {
    padding: 0 0.8rem;
    height: 2.25rem;
    line-height: 2.25rem;
  }

  .current {
    color: #1f1f1f;
    font-weight: bold;
    border-bottom: 0.1875rem solid #f15353;
  }
}

#navTab.hoet {
  display: flex;
  justify-content: space-around;
}

.pcStyle {
  #hoid {
    width: 375px !important;
  }

  .cart {
    right: 50% !important;
    margin-right: -150px;
  }

  #member {
    right: 50% !important;
    margin-right: -186px;
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

/* 顶部导航end */

/* 抢团插件 */
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

/* 抢团插件end */

/* 品牌 */
.brand {
  background-color: #fff;
  padding: 0 0.6rem;
  border-radius: 10px;
  margin: 10px;
  height: 3.125rem;

  .logo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;

    li:first-child {
      display: flex;
      align-items: center;

      .logo_img {
        width: 35px;
        height: 35px;
        border-radius: 5px;
      }
    }

    span {
      font-size: 0.875rem;
      color: #333;
      font-weight: bold;
      text-align: left;
      padding-left: 0.75rem;
      width: 12.5rem;
      overflow: hidden; /* 超出部分隐藏 */
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /* 规定段落中的文本不进行换行 */
    }

    .return {
      width: 5rem;
      height: 1.5625rem;
      line-height: 1.5625rem;
      text-align: center;
      color: #fff;
      border-radius: 2rem;
      background: #ff9600;
    }
  }
}

/* 品牌end */

/* 拼团奖励 */
.explain {
  margin-top: 0.625rem;
  background: #fff;
  padding: 0.875rem;
  overflow: hidden;

  h2 {
    font-weight: normal;
    font-size: 15px;
    margin-bottom: 0.625rem;
    text-align: left;
  }

  .content {
    width: 100%;
    text-align: center;
    background: #fafafa;
    // display: flex;
    padding: 0.375rem;
  }
  /deep/ .content img{
    width: 100% !important;
    height: auto !important;
  }
}

/* 拼团奖励end */

/* 群活码 */
.group-code {
  display: flex;
  align-items: center;
  text-align: left;
  background-color: #fff;
  padding: 0.6rem;
  border-radius: 10px;
  margin: 10px;

  .group-code-face {
    width: 2.5rem;
    height: 2.5rem;

    img {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
    }
  }

  .group-code-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 2rem;
    padding-right: 1rem;
    padding-left: 0.5rem;
    line-height: 1.125rem;

    .group-code-name {
      font-size: 13px;
      font-weight: bold;
      color: #353535;
    }

    .group-code-desc {
      font-size: 10px;
      color: #6c6c6c;
    }
  }

  .group-code-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.75rem;
    height: 1.5rem;
    line-height: 1.5rem;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    background-color: #ff9600;
    border-radius: 0.75rem;
  }
}

/* 群活码end */

/* 商品详情 */
.pullUp {
  display: flex;
  height: 3.125rem;
  line-height: 3.125rem;
  justify-content: center;
  align-items: center;
  color: #666;
  background: #fff;
  margin: 0.75rem 0 -2.625rem;

  #imgs {
    width: 1rem;
    height: 1rem !important;
    margin: 0 0.5rem 0 0;
  }

  .rotateImg {
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    transition: transform 0.5s;
  }

  .normalImg {
    transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    transition: transform 0.5s;
  }
}

#shopInfo {
  // height: 80vh;
  #tabs {
    #goods_content {
      padding: 0.6rem;
      margin-bottom: 0.625rem;
      background: #fff;

      img {
        max-width: 100%;
      }

      /deep/em {
        font-style: italic;
      }
    }
  }

  

}
.title-text {
  display: block; /* 设置为块级元素会独占一行形成上下居中的效果 */
  position: relative; /* 定位横线（当横线的父元素） */
  color: #999; /* 居中文字的颜色 */
  text-align: center;
  font-weight: 400;
  padding: 0.875rem 5rem;
  background: #fff;
}

.title-text::before,
.title-text::after {
  content: "";
  position: absolute; /* 定位背景横线的位置 */
  top: 50%;
  background: #ccced0; /* 背景横线颜色 */
  width: 20%; /* 单侧横线的长度 */
  height: 1px;
}

.title-text::before {
  left: 15%; /* 调整背景横线的左右距离 */
}

.title-text::after {
  right: 15%;
}

/* 商品详情end */

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

/* 价格说明 */

/* 商品参数 */
.goods-param {
  padding: 1rem 0.8rem;

  .goods-param-title {
    text-align: left;
    color: #1f1f1f;
    font-weight: bold;
    margin-bottom: 0.8rem;
  }

  .goods-param-content {
    .con {
      display: flex;
      justify-content: space-between;
      align-items: stretch;

      .con-left {
        width: 5rem;
        min-height: 1.875rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f3f3f3;
        margin: 0.1rem;
      }

      .con-right {
        width: 16rem;
        padding: 0.5rem;
        min-height: 1.875rem;
        margin: 0.1rem;
        text-align: left;
        background-color: #f9f9fb;
      }
    }
  }

  .goods-foot {
    margin-top: 1rem;
    font-size: 10px;
    display: flex;
    justify-content: center;

    .down {
      margin-left: 5px;
      transform: rotate(-90deg);
    }

    .top {
      margin-left: 5px;
      transform: rotate(90deg);
    }
  }
}

#newRetail-noVantRadio {
  text-align: left;
  padding: 0 0.625rem;
  margin: 0 0 1.5rem 0;
  max-height: 50vh;
  overflow: scroll;

  dl dt {
    margin-bottom: 0.3125rem;
    color: #666;
  }

  dl dd {
    margin-bottom: 0.3125rem;
  }

  padding: 0 1.25rem;

  .van-radio-group {
    display: flex;
    flex-wrap: wrap;

    .van-radio {
      margin-right: 0.3125rem;
      margin-bottom: 0.3125rem;
      background: #fff;
      border: 1px solid #fb4a4a;
      text-align: center;
      box-sizing: border-box;
      border-radius: 0.25rem;
      color: #fb4a4a;
      /deep/.van-icon {
        display: none;
      }
    }

    /deep/.vantRadioshow {
      background-color: rgb(241, 83, 83);
      border-color: rgb(241, 83, 83);
      // box-shadow: rgb(241, 83, 83) -1px 0px 0px 0px;
      .van-radio__label {
        color: #fff !important;
      }
    }

    /deep/.van-radio__label {
      color: inherit;
      line-height: 20px;
      padding: 2px 8px;
      margin-left: 0;
    }
  }
}

.pcStyle_ydC {
  width: 375px;
  height: 85%;
  overflow-y: scroll;
  margin: 0 auto;

  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}

.item {
  margin: 0 1rem;
  text-align: left;

  .item-title {
    color: #f14e4e;
    margin: 0.625rem 0;
    font-weight: bold;
  }

  .item-content {
    color: #3a3a3a;
    font-size: 15px;
  }
}

/* 商品参数end */

/* 租赁立即购买 */
.but {
  z-index: 98;
  position: fixed;
  top: 350px;
  right: 50%;
  transform: translateX(11rem);
  font-size: 12px;

  button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f15353;
    box-shadow: 0 0 0.375rem 0 rgba(171, 32, 32, 1);
    border: none;
    text-align: center;
    color: #fff;
  }
}

/* 租赁立即购买end */

/* 抽奖按钮 */
.luck-draw-btn {
  position: fixed;
  top: 400px;
  right: 50%;
  transform: translateX(11rem);
  width: 40px;
  height: 40px;
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

/* 抽奖按钮end */

/* 每个盒子样式 */
.good-item-box {
  background: #fff;
  border-radius: 10px;
  margin: 10px;
}
// 规格信息
.spec_box{
  margin-top: 0.63rem;
  margin-bottom: 0.63rem;
  padding: 0 0.63rem;
  .spec_list:last-child{
    margin-bottom: 0;
  }
  .spec_list{
    background: #fff;
    border-radius: 0.63rem;
    padding: 0.63rem;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.6rem;
    .spec_right{
      display: flex;
      align-items: flex-end;
      .spec_right_btn{
        padding: 0.22rem;
        background-color: #f14e4e;
        border-radius: 0.63rem;
        font-size: 0.63rem;
        color: #ffffff;
        padding-left: 0.62rem;
        padding-right: 0.42rem;
      }
    }
    .spec_conten{
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      flex: 1;
      .spec_conten_lis{
        text-align: left;
      }
    }
    .spec_left{
      width: 6.88rem;
      height: 6.88rem;
      background-color: #cacaca;
      border-radius: 0.31rem;
      margin-right: 0.63rem;
      img{
        width: 6.88rem;
        height: 6.88rem;
        border-radius: 0.31rem;
      }
    }
  }
}
// 付费内容
.payIntro{
  margin: 0 10px;
  margin-bottom: 0.5rem;
  border-radius: 10px;
  background: #fff;
  padding-bottom: 2rem;
  .txt{
    color: #999999;
    padding: 0 1.5rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  .title-text{
    border-radius: 10px;
    padding-top: 0.7rem;
  }
}
</style>
