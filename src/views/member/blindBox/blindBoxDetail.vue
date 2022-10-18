<template>
  <div class="page" :style="{ '--themeColor': activity.background_color, background: activity.background_color }">
    <c-title :hide="false" :text="'盲盒'"> </c-title>
    <div class="head" :class="{ headMr: activity.top_img_src == '' }" style="font-size: 0;">
      <img :src="activity.top_img_src" alt="" style="font-size: 0;" />
      <div class="isTitle" v-if="activity.title_show == 1">{{ activity.activity_name }}</div>
    </div>
    <div class="postionBtn">
      <div class="posBtn themeDiyBackground" @click="gotoOrderList">我的订单</div>
      <div class="posBtn themeDiyBackground" style="margin-top: 0.813rem;" @click="contactShow = true">联系商家</div>
    </div>
    <div class="contenBox themeDiyBackground" v-if="networkLoading">
      <div class="countDown">
        <template v-if="activity.activity_start > currentTime">
          <span class="countDownText themeDiyColor">开始倒计时</span>
          <van-count-down :time="(activity.activity_start - currentTime) * 1000" class="countDownText themeDiyColor" format="DD天HH时mm分ss秒"></van-count-down>
        </template>
        <template v-else-if="activity.activity_end > currentTime">
          <span class="countDownText themeDiyColor">结束倒计时</span>
          <van-count-down :time="(activity.activity_end - currentTime) * 1000" class="countDownText themeDiyColor" format="DD天HH时mm分ss秒"></van-count-down>
        </template>
        <template v-else>
          <span class="countDownText themeDiyColor">活动已结束</span>
        </template>
      </div>
      <div class="poster">
        <div class="posterBox themeDiyBorder">
          <i class="iconfont icon-fontclass-tishi themeDiyColor"></i>
          <div class="text themeDiyColor" @click="getPoster">海报</div>
        </div>
      </div>

      <div class="poster_pay" v-if="luckdrawCountDown > 0 && activity.activity_type == 0 && !isBlindBoxTapPay" @click="seeTips">
        <div class="posterBox themeDiyBorder">
          <i class="iconfont icon-fontclass-tishi1 themeDiyColor"></i>
          <div class="text themeDiyColor">提示</div>
        </div>
        <div class="num" v-if="activity.tips - activity.tips_count > 0">{{ activity.tips - activity.tips_count }}</div>
      </div>

      <div :class="[gifShow ? 'blindBoxGif' : 'blindBox']"></div>
      <div class="blindBoxTap disabled" v-if="currentTime < activity.activity_start">活动未开始</div>

      <div class="blindBoxTap" style="color: #fff;" v-else-if="isBlindBoxTap && currentTime < activity.activity_end" :class="{ disabled: luckdrawCountDown <= 0 }" @click="startLuckDraw">
        {{ activity.activity_type == 0 ? "抽取盲盒" : "免费抽取" }}<span style="letter-spacing: 0;" v-if="luckdrawCountDown > 0">({{ luckdrawCountDown }}S)</span>
      </div>

      <div class="blindBoxTap disabled" v-else-if="currentTime > activity.activity_end">活动已结束</div>

      <!-- <div class="blindBoxTap" v-if="isAddress" @click="gotoOrder">
        填写地址
      </div> -->

      <!-- <div class="payBox" v-if="isBlindBoxTapPay">
        <div class="blindBoxTapPay" @click="gotoOrder">立即购买￥{{ activity.price }}</div>
      </div>
      <div class="txtPay" v-if="isBlindBoxTapPay" @click="onceMore">再抽一次</div> -->

      <div class="invitePlan" v-if="isInvitePlan">
        <div class="invitePlanBox" v-if="assist.status != 1" @click="shareWeixin">
          <div style="font-size: 0.9rem; color: #fff;">再邀请{{ assist.invitation - assist.assist_log_count }}位好友</div>
          <div style="font-size: 0.9rem; color: #fff;">可免费抽取</div>
        </div>
        <div class="invitePlanBox" style="font-size: 1.263rem; padding-bottom: 0.3rem; color: #fff;" v-else @click="freePrize">免费抽取</div>
        <div class="inviteTime" v-if="assist.status != 1">
          <van-count-down :time="(assist.expire - currentTime) * 1000" class="inviteTimeR" format="HH时mm分ss秒" @finish="timeEnd"></van-count-down>
          后消失
        </div>
      </div>

      <div class="planDetail" v-if="isInvitePlan">
        <div class="isPlan">
          <div class="circle" style="width: 0.188rem; height: 0.188rem;"></div>
          <div class="circle" style="width: 0.313rem; height: 0.313rem; margin-left: 0; margin-right: 0.438rem;"></div>
          <div class="circle" style="width: 0.406rem; height: 0.406rem; margin-left: 0; margin-right: 0.438rem;"></div>
          好友进度{{ assist.assist_log_count }}/{{ assist.invitation }}人
          <div class="circle" style="width: 0.406rem; height: 0.406rem;"></div>
          <div class="circle" style="width: 0.313rem; height: 0.313rem; margin-left: 0; margin-right: 0.438rem;"></div>
          <div class="circle" style="width: 0.188rem; height: 0.188rem; margin-left: 0; margin-right: 0.438rem;"></div>
        </div>
        <div class="isPlanConten">
          <div class="fans">
            <template v-if="assist.assist_log.length > 0">
              <div class="fansUser" v-for="item in assist.assist_log" :key="item.member_id">
                <img :src="item.member.avatar_image" alt="" />
                <div class="fansName" style="flex: 1;">{{ item.member.nickname }}</div>
              </div>
            </template>
            <div class="planNot" v-else>暂无好友助力~</div>
          </div>
        </div>
      </div>

      <div class="maybeIcon">
        <div class="circle" style="width: 0.188rem; height: 0.188rem;"></div>
        <div class="circle" style="width: 0.313rem; height: 0.313rem; margin-left: 0; margin-right: 0.438rem;"></div>
        <div class="circle" style="width: 0.406rem; height: 0.406rem; margin-left: 0; margin-right: 0.438rem;"></div>
        可能抽中的盲盒
        <div class="circle" style="width: 0.406rem; height: 0.406rem;"></div>
        <div class="circle" style="width: 0.313rem; height: 0.313rem; margin-left: 0; margin-right: 0.438rem;"></div>
        <div class="circle" style="width: 0.188rem; height: 0.188rem; margin-left: 0; margin-right: 0.438rem;"></div>
      </div>
      <div class="shopBox">
        <template v-if="activity.pattern == 0">
          <div class="shoplist" v-for="item in goods" :key="item.goods_id" @click="openGoodsDetailsPopup(item)">
            <div class="shopImg">
              <img :src="item.goods.thumb_src" alt="" />
            </div>
            <div class="shopBottom">
              <div class="shopTxt">{{ item.goods.title }}</div>
              <div class="price">￥{{ item.goods.price }}</div>
            </div>
          </div>
        </template>

        <template v-if="activity.pattern == 1">
          <div class="shoplist" v-for="item in goods" :key="item.goods_id" @click="seeCombinationGoods(item)">
            <div class="shopImg">
              <img :src="item.thumb_src" alt="" />
            </div>
            <div class="shopBottom" v-if="item.combination">
              <div class="shopTxt">{{ item.combination.combination_name }}</div>
              <div class="price">￥{{ item.combination.price }}</div>
            </div>
          </div>
        </template>
      </div>
      <!-- <div class="tapMore">查看更多<i class="iconfont icon-member-bottom"></i></div> -->

      <div class="rule">
        <div class="ruleBox">
          <div class="circle" style="width: 0.188rem; height: 0.188rem;"></div>
          <div class="circle" style="width: 0.313rem; height: 0.313rem; margin-left: 0; margin-right: 0.438rem;"></div>
          <div class="circle" style="width: 0.406rem; height: 0.406rem; margin-left: 0; margin-right: 0.438rem;"></div>
          活动规则
          <div class="circle" style="width: 0.406rem; height: 0.406rem;"></div>
          <div class="circle" style="width: 0.313rem; height: 0.313rem; margin-left: 0; margin-right: 0.438rem;"></div>
          <div class="circle" style="width: 0.188rem; height: 0.188rem; margin-left: 0; margin-right: 0.438rem;"></div>
        </div>
        <div class="ruleTxt">
          <div v-html="activity.activity_rule"></div>
        </div>
      </div>
    </div>

    <!-- 多商品弹窗 -->
    <van-overlay :show="multiplePopupInfo.show" @click="multiplePopupInfo.show = false">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-fade">
          <div class="popupWrapper" v-show="multiplePopupInfo.show">
            <div class="multipleWrapper themeDiyBackground">
              <div class="desc">包含以下商品</div>
              <div class="goodsWrapper" @touchmove.stop>
                <div class="goodsItem" v-for="item in multiplePopupInfo.info.combination_goods" :key="item.id" @click="openGoodsDetailsPopup(item)">
                  <div class="goods_img">
                    <img :src="item.goods.thumb_src" alt="" />
                  </div>
                  <div class="content">
                    <div class="name">{{ item.goods.title }}</div>
                    <div class="price">{{ item.goods.price }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="close">
              <i class="iconfont icon-adsystem_icon_cancle" @click="multiplePopupInfo.show = false"></i>
            </div>
          </div>
        </transition>
      </div>
    </van-overlay>

    <!-- 单商品抽中/可不能抽中弹窗 -->
    <van-overlay :show="singlePopupInfo.show" @click="singlePopupInfo.show = false">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-fade">
          <div class="popupWrapper" v-show="singlePopupInfo.show" @click.stop>
            <div class="singleWrapper themeDiyBackground">
              <div class="name">{{ singlePopupInfo.title }}</div>
              <div class="thumb" v-if="singlePopupInfo.info && singlePopupInfo.info.pattern == 0">
                <img :src="singlePopupInfo.info.goods.thumb_src" alt="" />
              </div>
              <div class="thumb" v-if="singlePopupInfo.info && singlePopupInfo.info.pattern == 1">
                <img :src="singlePopupInfo.info.combination.combination_img_src" alt="" />
              </div>
            </div>
            <div class="close">
              <i class="iconfont icon-adsystem_icon_cancle" @click="singlePopupInfo.show = false"></i>
            </div>
          </div>
        </transition>
      </div>
    </van-overlay>

    <!-- 联系二维码弹窗 -->
    <van-overlay :show="contactShow" @click="contactShow = false">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-fade">
          <div class="popupWrapper" v-show="contactShow" @click.stop>
            <div class="contactWrapper themeDiyBackground">
              <div class="thumb">
                <img :src="activity.cservice_code_src" alt="" />
              </div>
              <div class="tips">长按识别二维码联系我们</div>
              <div class="btnPhone">
                <a :href="`tel:${activity.cservice_phone}`">
                  <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/blindBoxContact.png" alt="" />
                </a>
              </div>
            </div>
            <div class="close">
              <i class="iconfont icon-adsystem_icon_cancle" @click="contactShow = false"></i>
            </div>
          </div>
        </transition>
      </div>
    </van-overlay>

    <van-overlay :show="seePrizeShow" @click="onceMore">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%; perspective: 25.313rem;">
        <div class="popupWrapper seePrizeWrapper" v-if="seePrizeShow" @click.stop :class="{ active: seePrizeAnimation }">
          <!-- <img class="imgs" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/blindBoxLuck.png" alt="" /> -->
          <template v-if="isBlindBoxTapPay">
            <div class="btn" @click="gotoOrder">立即支付￥{{ activity.price }}</div>
            <div class="text" @click="onceMore">再抽一次</div>
          </template>

          <div class="addAddress" v-if="isAddress" @click="gotoOrder">
            填写地址
          </div>
        </div>
      </div>
    </van-overlay>

    <van-overlay :show="posterPopupInfo.show" @click="posterPopupInfo.show = false">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-fade">
          <div class="popupWrapper" v-show="posterPopupInfo.show" @click.stop>
            <div class="posterWrapper">
              <img :src="posterPopupInfo.src" alt="" />
            </div>
            <div class="close">
              <i class="iconfont icon-adsystem_icon_cancle" @click="posterPopupInfo.show = false"></i>
            </div>
          </div>
        </transition>
      </div>
    </van-overlay>

    <!-- <van-overlay :show="blindBoxInfo.show" z-index="99" @click="blindBoxInfo.show = false">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-fade">
          <div class="blindBoxInfo" v-if="blindBoxInfo.show">
            <div class="blindBoxInfoWrapper" v-if="blindBoxInfo.pattern == 1">
              <div class="name">恭喜你抽中了</div>
              <div class="thumb">
                <img :src="blindBoxInfo.combination.combination_img_src" alt="" />
              </div>
              <div class="desc">包含以下商品</div>
              <div class="goodsWrapper" @touchmove.stop>
                <div class="goods_img" v-for="item in blindBoxInfo.goods" :key="item.id">
                  <img :src="item.thumb_src" alt="" />
                </div>
              </div>
            </div>

            <div class="singleWrapper" v-if="blindBoxInfo.pattern == 0">
              <div class="name">恭喜你抽中了</div>
              <div class="thumb" v-if="blindBoxInfo.goods">
                <img :src="blindBoxInfo.goods[0].thumb_src" alt="" />
              </div>
            </div>

            <div class="close">
              <i class="iconfont icon-adsystem_icon_cancle" @click="blindBoxInfo.show = false"></i>
            </div>
          </div>
        </transition>
      </div>
    </van-overlay> -->

    <van-popup v-model="goodsDetailsPopupInfo.show" position="bottom" :style="{ maxHeight: '80%' }">
      <goods-details :goodsDetail="goodsDetailsPopupInfo.info"></goods-details>
    </van-popup>

    <yz-wechat-share-img v-model="showWechatshar"></yz-wechat-share-img>
  </div>
</template>

<script>
import blindBoxDetail from "./blindBoxDetail_controller";
export default blindBoxDetail;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  min-height: 100vh;
}

.themeDiyBackground {
  background-color: var(--themeColor) !important;
  transition: 0.5s;
}

.themeDiyColor {
  color: var(--themeColor) !important;
  transition: 0.5s;
}

.themeDiyBorder {
  border-color: var(--themeColor) !important;
  transition: 0.5s;
}

.head {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  img {
    width: 100%;
    object-fit: contain;
  }

  &.headMr {
    height: 8.75rem;
    background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/blindHead.png");
    background-size: 100% 100%;
    background-color: #7f88d9;
  }
}

.isTitle {
  position: absolute;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  text-shadow: 4px 4px 0 #fda610, 4px -4px 0 #fda610, -4px -4px 0 #fda610, -4px 4px 0 #fda610, 4px 3px 0 #fda610, 4px -3px 0 #fda610, -4px -3px 0 #fda610, -4px 3px 0 #fda610, 4px 2px 0 #fda610,
    4px -2px 0 #fda610, -4px -2px 0 #fda610, -4px 2px 0 #fda610, 4px 1px 0 #fda610, 4px -1px 0 #fda610, -4px -1px 0 #fda610, -4px 1px 0 #fda610, 4px 0 0 #fda610, 4px 0 0 #fda610, -4px 0 0 #fda610,
    -4px 0 0 #fda610, 3px 4px 0 #fda610, 3px -4px 0 #fda610, -3px -4px 0 #fda610, -3px 4px 0 #fda610, 3px 3px 0 #fda610, 3px -3px 0 #fda610, -3px -3px 0 #fda610, -3px 3px 0 #fda610, 3px 2px 0 #fda610,
    3px -2px 0 #fda610, -3px -2px 0 #fda610, -3px 2px 0 #fda610, 3px 1px 0 #fda610, 3px -1px 0 #fda610, -3px -1px 0 #fda610, -3px 1px 0 #fda610, 3px 0 0 #fda610, 3px 0 0 #fda610, -3px 0 0 #fda610,
    -3px 0 0 #fda610, 2px 4px 0 #fda610, 2px -4px 0 #fda610, -2px -4px 0 #fda610, -2px 4px 0 #fda610, 2px 3px 0 #fda610, 2px -3px 0 #fda610, -2px -3px 0 #fda610, -2px 3px 0 #fda610, 2px 2px 0 #fda610,
    2px -2px 0 #fda610, -2px -2px 0 #fda610, -2px 2px 0 #fda610, 2px 1px 0 #fda610, 2px -1px 0 #fda610, -2px -1px 0 #fda610, -2px 1px 0 #fda610, 2px 0 0 #fda610, 2px 0 0 #fda610, -2px 0 0 #fda610,
    -2px 0 0 #fda610, 1px 4px 0 #fda610, 1px -4px 0 #fda610, -1px -4px 0 #fda610, -1px 4px 0 #fda610, 1px 3px 0 #fda610, 1px -3px 0 #fda610, -1px -3px 0 #fda610, -1px 3px 0 #fda610, 1px 2px 0 #fda610,
    1px -2px 0 #fda610, -1px -2px 0 #fda610, -1px 2px 0 #fda610, 1px 1px 0 #fda610, 1px -1px 0 #fda610, -1px -1px 0 #fda610, -1px 1px 0 #fda610, 1px 0 0 #fda610, 1px 0 0 #fda610, -1px 0 0 #fda610,
    -1px 0 0 #fda610, 0 4px 0 #fda610, 0 -4px 0 #fda610, 0 -4px 0 #fda610, 0 4px 0 #fda610, 0 3px 0 #fda610, 0 -3px 0 #fda610, 0 -3px 0 #fda610, 0 3px 0 #fda610, 0 2px 0 #fda610, 0 -2px 0 #fda610,
    0 -2px 0 #fda610, 0 2px 0 #fda610, 0 1px 0 #fda610, 0 -1px 0 #fda610, 0 -1px 0 #fda610, 0 1px 0 #fda610, 0 0 0 #fda610, 0 0 0 #fda610, 0 0 0 #fda610, 0 0 0 #fda610, 0 0 0 #fda610;
}

.postionBtn {
  position: absolute;
  right: 0;
  top: 2.844rem;

  .posBtn {
    border-radius: 0.609rem 0 0 0.609rem;
    font-size: 0.625rem;
    color: #fff;
    padding: 0.3rem 0.43rem 0.3rem 0.5rem;
  }
}

.contenBox {
  overflow: hidden;
  padding: 1.5rem 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .poster {
    position: absolute;
    top: 21.625rem;
    right: 1rem;
    width: 1.813rem;
    height: 2.594rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    box-shadow: 0 0 0.125rem 0 rgba(98, 98, 98, 0.64);
    border-radius: 0.125rem;

    .posterBox {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 1.563rem;
      height: 2.344rem;
      border-radius: 0.125rem;
      border: solid 0.031rem #8183d9;
      text-size-adjust: none;

      .iconfont {
        margin-top: 0.2rem;
        font-size: 0.9rem;
        height: 1.063rem;
        color: #8183d9;
      }

      .text {
        font-size: 0.625rem;
        color: #8183d9;
      }
    }
  }

  .poster_pay {
    position: absolute;
    top: 17.625rem;
    right: 1rem;
    width: 1.813rem;
    height: 2.594rem;
    background-color: #fff;
    box-shadow: 0 0 0.125rem 0 rgba(98, 98, 98, 0.64);
    border-radius: 0.125rem;
    display: flex;
    justify-content: center;
    align-items: center;

    .posterBox {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 1.563rem;
      height: 2.344rem;
      border-radius: 0.125rem;
      border: solid 0.031rem #8183d9;
      text-size-adjust: none;

      .iconfont {
        margin-top: 0.2rem;
        font-size: 0.9rem;
        height: 1.063rem;
        color: #8183d9;
      }

      .text {
        font-size: 0.625rem;
        color: #8183d9;
      }
    }

    .num {
      position: absolute;
      top: -0.3rem;
      right: -32%;
      height: 0.906rem;
      line-height: 0.906rem;
      padding: 0.01rem 0.3rem;
      font-size: 0.625rem;
      color: #fff;
      background-color: #ef1b76;
      border-radius: 0.5rem;
    }
  }

  .countDown {
    width: 14.781rem;
    height: 1.906rem;
    background-blend-mode: normal, normal;
    box-shadow: inset 0 0.156rem 0.625rem 0 rgba(88, 12, 84, 0.35);
    border-radius: 0.953rem;
    background-color: #fff;

    /* margin: 0 auto; */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem 0.594rem;
    margin: 0 auto;

    .countDownText {
      line-height: 1.563rem;
      color: #ffca10;
      font-size: 0.875rem;
      font-style: italic;
      font-weight: 600;
    }

    /* border: solid 3rpx #6a32cc; */
  }

  .blindBox {
    width: 16.875rem;
    height: 16.875rem;
    background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/blindBoxJT.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin: 0 auto;
    margin-top: 1.562rem;
    margin-bottom: 1.562rem;
  }

  .blindBoxGif {
    width: 16.875rem;
    height: 16.875rem;
    background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/blindBoxGif.gif");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin: 0 auto;
    margin-top: 1.562rem;
    margin-bottom: 1.562rem;
    transition: 0.3s;
  }

  .blindBoxTap {
    width: 12rem;
    height: 3.125rem;
    background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/blindBtn.png");
    background-size: 100% 100%;
    line-height: 3.125rem;
    text-align: center;
    color: #f14b08;
    font-weight: 600;
    font-size: 1.063rem;
    margin: 0 auto;

    &.disabled {
      filter: grayscale(100%);
    }
  }

  .payBox {
    display: flex;
    align-items: center;
    justify-content: space-around;

    .blindBoxTapPay {
      width: 12rem;
      height: 3.125rem;
      background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/blindBtn.png");
      background-size: 100% 100%;
      line-height: 3.125rem;
      text-align: center;
      color: #f14b08;
      font-weight: 600;
      font-size: 1.063rem;
    }
  }

  .txtPay {
    color: #fff;
  }

  .invitePlan {
    font-size: 0.7rem;

    .invitePlanBox {
      width: 12rem;
      height: 3.825rem;
      background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/blindBtn.png");
      background-size: 100% 100%;
      color: #f14b08;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .inviteTime {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.813rem;
      color: #fff;

      .inviteTimeR {
        color: #f14b08;
        font-size: 0.813rem;
      }
    }
  }

  .planDetail {
    margin: 0 1rem;
    margin-top: 1.75rem;

    .isPlan {
      margin: 0 auto;
      margin-top: 2.219rem;
      width: 14.875rem;
      height: 2.188rem;
      text-align: center;
      font-size: 1.125rem;
      line-height: 2rem;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 600;

      .circle {
        border-radius: 50%;
        background-color: #fff;
        margin: 0 0.438rem;
      }
    }

    .isPlanConten {
      margin: 0 1rem;
      display: flex;
      align-items: center;
      padding: 1.938rem 0.813rem;
      background-color: #fff;
      border-radius: 0.25rem;

      .fans {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .fansUser {
          width: 20%;
          height: 3.688rem;
          text-align: center;
          margin-bottom: 0.9rem;

          img {
            width: 2.5rem;
            height: 2.5rem;
            background-color: #929292;
            border: solid 0.05rem #ffd45b;
            border-radius: 100%;
          }

          .fansName {
            font-size: 0.625rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-left: 0.48rem;
            text-align: center;
          }
        }

        .planNot {
          text-align: center;
          font-size: 1rem;
          width: 100%;
        }
      }
    }
  }

  .maybeIcon {
    margin: 0 auto;
    margin-top: 2.219rem;
    width: 14.875rem;
    height: 2.188rem;
    text-align: center;
    font-size: 1.125rem;
    line-height: 2rem;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;

    .circle {
      border-radius: 50%;
      background-color: #fff;
      margin: 0 0.438rem;
    }
  }

  .shopBox {
    padding: 0 0.875rem 0 0.875rem;
    margin-top: 1.156rem;
    display: flex;
    flex-wrap: wrap;

    .shoplist {
      width: 6.781rem;
      height: 10rem;
      background-color: #fff;
      border-radius: 0.625rem;
      padding: 0.438rem 0.469rem;
      box-sizing: border-box;
      margin-right: 3%;
      margin-bottom: 0.625rem;

      &:last-child {
        margin-bottom: 0;
      }

      &:nth-child(3n) {
        margin-right: 0;
      }

      .shopImg {
        width: 5.844rem;
        height: 5.844rem;
        background-color: #fff;
        border-radius: 0.625rem;

        img {
          width: 5.844rem;
          height: 5.844rem;
          border-radius: 0.625rem;
        }
      }

      .shopBottom {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        text-align: left;

        .shopTxt {
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.688rem;
          color: #333;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          margin-top: 0.3rem;
        }

        .price {
          font-size: 0.75rem;
          color: #f15353;
          margin-top: 0.15rem;
        }
      }
    }
  }

  .tapMore {
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 0.625rem;
    margin-top: 1.281rem;
  }

  .rule {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin-top: 1.71rem;

    .ruleBox {
      margin: 0 auto;
      margin-top: 2.219rem;
      width: 14.875rem;
      height: 2.188rem;
      text-align: center;
      font-size: 1.125rem;
      line-height: 2rem;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 600;

      .circle {
        border-radius: 50%;
        background-color: #fff;
        margin: 0 0.438rem;
      }
    }

    .ruleTxt {
      width: 21.563rem;
      height: 13.688rem;
      background-color: #fff;
      box-shadow: 0 0.156rem 0.313rem 0 rgba(100, 16, 195, 0.3);
      border-radius: 0.313rem;
      padding: 1.625rem 0.94rem 0 0.906rem;
      box-sizing: border-box;
      overflow-y: scroll;
      text-align: left;

      /deep/img {
        max-width: 100%;
        height: auto;
        object-fit: contain;
      }
    }

    .ruleLine {
      width: 18.813rem;
      height: 0.15rem;
      box-shadow: 0 0.156rem 0.313rem 0 rgba(100, 16, 195, 0.3);
      border-radius: 0 0 0.25rem 0.25rem;
      background-color: #fff;
    }
  }
}

.popupWrapper {
  .close {
    height: 4rem;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    .icon-adsystem_icon_cancle {
      font-size: 3rem;
      color: #fff;
      width: 3rem;
      height: 3rem;
    }
  }
}

.multipleWrapper {
  width: 18.906rem;
  height: 18.688rem;
  border-radius: 0.5rem;

  .desc {
    padding-top: 1.45rem;
    padding-bottom: 0.906rem;
    font-size: 0.938rem;
    color: #fff;
  }

  .goodsWrapper {
    width: 16.031rem;
    height: 13.6rem;
    margin: 0 auto;
    padding: 0 0.1rem;
    border-radius: 0.625rem;
    overflow: scroll;

    .goodsItem {
      display: flex;
      align-items: center;
      width: 100%;
      height: 4.188rem;
      margin-bottom: 0.6rem;
      background-color: #fff;
      border-radius: 0.313rem;

      .goods_img {
        height: 3.125rem;
        padding: 0 0.5rem;
        border-radius: 0.125rem;

        img {
          width: 3.125rem;
          height: 3.125rem;
        }
      }

      .content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 3.125rem;
        padding-right: 1.3rem;
        text-align: left;

        .name {
          font-size: 0.75rem;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .price {
          font-size: 0.75rem;
          color: #f14e4e;
        }
      }
    }
  }
}

.blindBoxInfoWrapper {
  width: 13.031rem;
  height: 20.313rem;
  background: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/blindToast2.png);
  background-size: 100% 100%;

  .name {
    padding-top: 1.081rem;
    font-size: 1.25rem;
    color: #fff;
  }

  .thumb {
    margin: 0.894rem auto 0;
    width: 8.938rem;
    height: 8.938rem;
    background-color: #fff;
    border-radius: 0.625rem;

    img {
      width: 8.938rem;
      height: 8.938rem;
    }
  }

  .desc {
    margin-top: 0.963rem;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
    color: #fff;
  }

  .goodsWrapper {
    display: flex;
    align-items: center;
    margin: 0 auto;
    padding: 0 0.1rem;
    width: 10.688rem;
    height: 3.75rem;
    background-color: #fff;
    border-radius: 0.625rem;
    overflow: scroll;

    .goods_img {
      width: 3.125rem;
      height: 3.125rem;
      margin-right: 0.3rem;
      background-color: #d4d4d4;
      border-radius: 0.313rem;
      border: solid 0.063rem #6881e1;

      img {
        width: 3rem;
        height: 3rem;
        border-radius: 0.313rem;
      }
    }
  }
}

.singleWrapper {
  width: 13.031rem;
  height: 15rem;
  border-radius: 0.5rem;
  background-size: 100% 100%;

  .name {
    padding-top: 1.081rem;
    font-size: 1.25rem;
    color: #fff;
  }

  .thumb {
    margin: 0.894rem auto 0;
    width: 8.938rem;
    height: 8.938rem;
    background-color: #fff;
    border-radius: 0.625rem;

    img {
      width: 8.938rem;
      height: 8.938rem;
      border-radius: 0.625rem;
    }
  }
}

.contactWrapper {
  padding-top: 1.219rem;
  width: 13.031rem;
  height: 15rem;
  border-radius: 0.5rem;
  background-size: 100% 100%;

  .thumb {
    margin: 0.894rem auto 0;
    width: 7.188rem;
    height: 7.188rem;
    background-color: #fff;
    border-radius: 0.625rem;

    img {
      width: 7.188rem;
      height: 7.188rem;
    }
  }

  .tips {
    margin-top: 0.563rem;
    font-size: 0.875rem;
    color: #fff;
  }

  .btnPhone {
    margin: 0 auto;
    margin-top: 0.563rem;
    width: 10.063rem;
    height: 1.875rem;

    img {
      width: 10.063rem;
      height: 1.875rem;
    }
  }
}

.seePrizeWrapper {
  width: 18.125rem;
  height: 26.094rem;
  background: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/blindBoxSee.png);
  background-size: 100% 100%;
  transform: rotateY(100deg) translateZ(0) scale(0);
  transform-origin: 9rem;
  transition: 1s;

  &.active {
    transform: rotateY(360deg) translateZ(0) scale(1);
  }

  // .imgs {
  //   position: absolute;
  //   left: 50%;
  //   bottom: 4.25rem;
  //   transform: translateX(-50%);
  //   width: 10.625rem;
  // }
  .btn {
    position: absolute;
    left: 50%;
    bottom: 2.55rem;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 12.344rem;
    height: 1.875rem;
    font-size: 0.938rem;
    font-weight: bold;
    letter-spacing: 0.141rem;
    color: #fff;
    background-image: linear-gradient(#d72c11, #d72c11), linear-gradient(#48246e, #48246e);
    background-blend-mode: normal, normal;
    border-radius: 0.938rem;
  }

  .text {
    position: absolute;
    left: 50%;
    bottom: 1.2rem;
    transform: translateX(-50%);
    color: #fff;
  }

  .addAddress {
    position: absolute;
    left: 50%;
    bottom: 1.55rem;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 12.344rem;
    height: 1.875rem;
    font-size: 0.938rem;
    font-weight: bold;
    letter-spacing: 0.141rem;
    color: #fff;
    background-image: linear-gradient(#d72c11, #d72c11), linear-gradient(#48246e, #48246e);
    background-blend-mode: normal, normal;
    border-radius: 0.938rem;
  }
}

.posterWrapper {
  width: 18.125rem;
  height: 26.094rem;

  img {
    max-height: 100%;
    max-width: 100%;
  }
}
</style>
