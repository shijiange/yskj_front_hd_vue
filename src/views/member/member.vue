<template>
  <div>
    <div id="member-all" v-show="template" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <!--{{ $i18n.t("home.输入关键词搜索") }}<button @click="switch1">切换</button>-->

      <!--旧装修修改部分 start-->
      <div v-if="!isDecorate">
        <template v-for="(item, index) in designer">
          <component
            :key="index"
            v-if="item.params && member_order.order"
            :is="item.temp"
            :datas="item"
            :isClick="isMemberGrade"
            :Params="item.params"
            :Order="item.data"
            :member_item="member_item"
            :all="designer.length"
            :index="index"
            :member_order="member_order"
            :notShow="notShow"
            @openQrCode="openQrCode"
          >
          </component>
        </template>
      </div>
      <!--旧装修修改部分 end-->

      <!--新装修页面-->
      <div v-if="isDecorate">
        <template v-for="(item, index) in components">
          <component
            :key="index"
            :is="item.component_key"
            :isBottom="isBottom"
            :lastIndex="lastIndex"
            :btnFlag="btnFlag"
            :id="item.id"
            :datas="item.remote_data"
            :index="index"
            :component_key="item.component_key"
            :isClick="isMemberGrade"
            :member_item="member_item"
            :all="components.length"
            :member_order="member_order"
            :page_id="page_id"
            :notShow="notShow"
            @openQrCode="openQrCode"
            :fatherTitle="fatherTitle"
          >
          </component>
        </template>
      </div>
      <!--新装修页面end-->

      <!--底部版权部分 template == '03'是装修-->
      <section v-show="template == '03'">
        <div class="home" v-if="showDiy">
          <template v-for="(item, index) in showDiy">
            <component :key="index" :is="item.temp" :datas="item" :home="true" :index="index" :all="designer.length - 1" :tag="345"> </component>
          </template>
          <!-- <div style="height: 3.3125rem;"></div> -->
        </div>
        <van-button type="primary" style="margin: 0.875rem auto; width: 90%;" size="large" color="#f15353" @click="outInfo()" v-if="(fun.getTyep() != 1 && fun.getTyep() != 2) || wechat_login_mode"
          >{{ $i18n.t("member.退出登录") }}
        </van-button>
        <!-- 版权图片 -->
        <img :src="copyrightImg" alt="" v-if="!fun.isTextEmpty(copyrightImg)" class="copyrightImg" />
        <!-- 版权图片 end -->
        <div class="copyright">©{{ copyright }}&nbsp;</div>
        <div class="copyright">
          <template v-if="fun.isApp()">
            <router-link :to="fun.getUrl('userAgreement', {}, { show: 'agreement' })">用户协议</router-link>
            和
            <router-link :to="fun.getUrl('userAgreement', {}, { show: 'privacy' })">隐私政策</router-link>
          </template>
        </div>
        <div v-if="fun.isIphoneX()" style="height: 34px;"></div>
        <div style="height: 1rem; clear: both;"></div>
      </section>
      <!--底部版权部分end-->

      <!--不启用装修的部分-->
      <div id="member" style="position: relative;" v-show="template != '03'">

        <div class="background-box">
          <header class="member-header">
            <div class="header-avatar" @click="seeAvatarImg(uid)">
              <img :src="avatar || emptyImage"/>
            </div>
            <div class="user-info">
              <div class="user-name-box">
                <div class="user-name-left">
                  <p class="user-name van-ellipsis">{{nickname}}</p>
                  <img   src="../../assets/images/micro_communities/home_autograph@2x.png" @click="introductionInp"  style="width:20px;height:auto;"/>
                </div>
                <i @click="toSetting" class="iconfont icon-massage_set"></i>
              </div>
              <div class="user-info-id">
                <p class="user-id" v-if="show_member_id != 1">ID:{{ uid }}</p>
                <p class="user-id" v-if="isGeneralize && isshowInvit">{{ $i18n.t("member.邀请码") }}：{{ inviteCode }}</p>
                <div class="copy-btn" v-if="isGeneralize && isshowInvit" v-clipboard:copy="inviteCode" v-clipboard:success="onCopy"
                     v-clipboard:error="onError">复制
                </div>
              </div>
              <div class="user-level">
                <div class="user-level-name" v-if="level_name" @click="gotoMemberGrade">
                  <img class="level-icon" src="../../assets/images/member/level-icon.png" alt="">
                  <span>{{ level_name }}</span>
                  <i class="fa fa-angle-right" v-if=isMemberGrade></i>
                </div>
                <div class="user-level-time" v-if="validity_value">{{validity_value}}到期</div>
              </div>
            </div>
          </header>

          <U_memberYs v-if="!isDecorate && pluginsList.is_open && pluginsList.is_open.is_open_ys_system && pluginsList.is_open.is_open_ys_system == 1"></U_memberYs>

          <div class="order-list">
            <van-tabs v-model="order_active" color="#ffc11e" title-active-color="#ffc11e" :before-change="clickOrderTab">
              <van-tab :title="order.title" v-for="order in order_list" :key="order.name">
                <div class="order_item">
                  <div class="order_pub" v-for="(item, index) in order.list" :key="index" @click="toOrderList(order.name,item)">
                    <div class="badge" v-if="item.total && item.total!= 0">{{item.total && item.total > 99 ? '99+' : item.total}}</div>
                    <i class="iconfont" :class="[item.class]"></i>
                    <span>{{item.status_name}}</span>
                  </div>
                </div>
              </van-tab>
            </van-tabs>
          </div>
        </div>

        <div class="asset-box">
          <div class="asset-left-box">
            <ul>
              <li v-if="member_item.consume_coupon_show && member_item.consume_coupon_show.is_show == 1">
                <router-link :to="fun.getUrl('CardIndex')">
                  <span>{{ member_item.consume_coupon_show.amount }}</span>
                  <span class="mr">{{ member_item.consume_coupon_show.text }}</span>
                </router-link>
              </li>
              <li v-if="integral_show && integral_show.is_show == 1">
                <router-link :to="fun.getUrl('Integral_love')">
                  <span>{{ integral_show.data }}</span>
                  <span class="mr">{{ integral_show.text }}</span>
                </router-link>
              </li>
              <li v-if="love_obj.unable_love_show == 1">
                <router-link :to="fun.getUrl('love_index')">
                  <span>{{ love_obj.unable_data }}</span>
                  <span class="mr">{{ love_obj.unable_text }}</span>
                </router-link>
              </li>
              <li v-if="love_obj.usable_love_show == 1">
                <router-link :to="fun.getUrl('love_index')">
                  <span>{{ love_obj.usable_data }}</span>
                  <span class="mr">{{ love_obj.usable_text }}</span>
                </router-link>
              </li>
              <li v-if="credit.is_show == 1">
                <router-link :to="fun.getUrl('balance')">
                  <span><small>{{ $i18n.t("money") }}</small>{{ credit.data }}</span>
                  <span class="mr">{{ credit.text }}</span>
                </router-link>
              </li>
              <li v-if="integral.is_show == 1">
                <router-link :to="fun.getUrl('integral_v2')">
                  <span>{{ integral.data }}</span>
                  <span class="mr">{{ integral.text }}</span>
                </router-link>
              </li>
              <li v-if="coupon && coupon.is_show == 1">
                <router-link :to="fun.getUrl('coupon', { selected: '1' })">
                  <span>{{ coupon.data }}</span>
                  <span class="mr">{{ coupon.text }}</span>
                </router-link>
              </li>
            </ul>
          </div>
          <div class="asset-line"></div>
          <div class="asset-right-box" @click="gotoExtension">
            <i class="iconfont icon-fontclass-shouru"></i>
            <span>我的收入</span>
          </div>
        </div>

        <!--默认模板01-->
        <template v-if="template === '01'">
          <div class="plugins-box">
            <div class="plugin-header" v-if="pluginsList.plugin_head && pluginsList.plugin_head.length > 0">
              <div class="plugin-header-item" v-for="item in pluginsList.plugin_head" :key="item.class" @click="pluginGoto(item)">
                <i class="iconfont" :class="[item.class]"></i><span>{{item.title}} {{item.value > 999 ? "999+" : item.value}}</span>
              </div>
            </div>
            <div class="plugin-items">
              <swiper style="width: 100%;" :options="swiperOption" ref="mySwiper">
                <swiper-slide v-for="(page, idx) in plugin_handle_list" :key="idx" class="plugin-items-box">
                  <div class="plugin-items-icon" v-for="icon in page" :key="icon.name" @click="pluginGoto(icon)">
                    <i class="iconfont" :class="icon.class"></i>
                    <span>{{icon.title}}</span>
                  </div>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
              </swiper>
            </div>
          </div>

          <div class="tabs-box" v-if="plugins_data.nav && plugins_data.nav.length > 0">
            <van-tabs sticky v-model="plugin_active" @click="handlePlugin" color="#ffc11e" title-active-color="#ffc11e" background="#f5f5f5">
              <van-tab :title="plugin.name" :name="plugin.code" v-for="plugin in plugins_data.nav" :key="plugin.code">
                <U_goods ref="UGoods" v-if="plugin.code==='recommend_goods' && goodsData.list" @setLoadMore="setLoadMore" :id="1" :datas="goodsData" :tabcontrol="true" :plugin_active="plugin_active" :fatherTitle="fatherTitle"></U_goods>
                <U_goodsrush ref="limitUGoods" v-if="plugin.code==='limitBuy_goods' && limitData.list" @setLoadMore="setLoadMore" :id="1" :datas="limitData" :tabcontrol="true" :plugin_active="plugin_active"></U_goodsrush>
                <fight_group v-if="plugin.code==='fight-groups'" :list="groupList"></fight_group>
                <U_article ref="U_article" v-if="plugin.code==='article' && articleData.list" @setLoadMore="setLoadMore" :id="1" :datas="articleData" :tabcontrol="true" :plugin_active="plugin_active"></U_article>
                <U_shortvideo ref="U_shortvideo" v-if="plugin.code==='video-share' && videoData.list" @setLoadMore="setLoadMore" :id="1" :datas="videoData" :tabcontrol="true"></U_shortvideo>
                <U_community ref="U_community" v-if="plugin.code==='micro-communities' && communityData.list" @setLoadMore="setLoadMore" :id="1" :datas="communityData" :tabcontrol="true"></U_community>
                <U_stores ref="U_stores" v-if="plugin.code==='store-cashier'" @setLoadMore="setLoadMore" :id="1" :datas="storeData" :tabcontrol="true" :plugin_active="plugin_active"></U_stores>
                <U_livestreaming v-if="plugin.code==='room' && liveData.list" :id="1" :datas="liveData" :tabcontrol="true"></U_livestreaming>
              </van-tab>
            </van-tabs>
            <U_backup :btnFlag="btnFlag" :id="1" :datas="btnData"></U_backup>
            <i v-if="service" class="iconfont icon-member_kefu service-box" :style="{left:  fun.getPhoneEnv() == 3 ? '61%' : buttonClientWidth}" @click="openService"></i>

            <d-connect-customer-service
              :show="showPopup"
              :tel="service.service_mobile"
              :online="service.cservice"
              :qrcode="service.service_QRcode"
              @closed="showPopup=false"
            ></d-connect-customer-service>
          </div>
        </template>
        <!--默认模板01end-->

        <!-- 模板二 -->
        <div id="tool" v-if="template === '02'">
          <div class="title">
            <div class="spare"></div>
            <h3>{{ $i18n.t("member.实用工具") }}</h3>
          </div>

          <ul class="tool-box">
            <li>
              <router-link :to="fun.getUrl('collection', { selected: '1' })">
                <i class="iconfont icon-fontclass-1"></i>
                <div>{{ $i18n.t("member.收藏") }}</div>
              </router-link>
            </li>
            <li>
              <router-link :to="fun.getUrl('footprint', { selected: '1' })">
                <i class="iconfont icon-fontclass-zuji2"></i>
                <div>{{ $i18n.t("member.足迹") }}</div>
              </router-link>
            </li>
            <li>
              <router-link :to="fun.getUrl('address', { selected: '1' })">
                <i class="iconfont icon-fontclass-dizhi"></i>
                <div>{{ $i18n.t("member.地址管理") }}</div>
              </router-link>
            </li>
            <li>
              <router-link :to="fun.getUrl('info', { item: member_item })">
                <i class="iconfont icon-fontclass-shezhi"></i>
                <div>{{ $i18n.t("member.设置") }}</div>
              </router-link>
            </li>

            <li v-for="(item, i) in pluginsList.tool" :key="i" v-if="pluginsList.tool && notShow.indexOf(item.url) < 0">
              <router-link :to="fun.getUrl(item.url)">
                <!-- <i class="iconfont bankCard" :class="item.class"></i> -->
                <i class="iconfont" :class="item.class"></i>
                <div>{{ item.title }}</div>
              </router-link>
            </li>

            <li v-if="fun.isApp()">
              <router-link :to="fun.getUrl('message', { selected: '1' })">
                <i class="iconfont icon-icon"></i>
                <div>{{ $i18n.t("member.消息通知") }}</div>
              </router-link>
            </li>
          </ul>
        </div>
        <div id="templet_box" v-if="template === '02'">
          <div class="extension_plate" v-if="(store_set && store_set.is_open_cashier == 1) || is_stroeWithdraw || (pluginsList.merchant && pluginsList.merchant.length > 0)">
            <h1>
              <div class="spare"></div>
              {{ $i18n.t("member.商家管理") }}
            </h1>
            <ul class="box">
              <li v-if="pluginsList.merchant && notShow.indexOf(item.url) < 0" v-for="(item, i) in pluginsList.merchant" :key="i" @click="pluginGoto(item)">
                <i class="iconfont" :class="item.class"></i>
                <span>{{ item.title }}</span>
              </li>
            </ul>
          </div>

          <div class="extension_plate">
            <h1>
              <div class="spare"></div>
              {{ $i18n.t("member.营销互动") }}
            </h1>
            <ul class="box">
              <li v-if="relation_switch" @click="openQrCode('block')">
                <i class="iconfont icon-fontclass-erweima" style="width: 1.7rem;"></i>
                <span>{{ $i18n.t("member.二维码") }}</span>
              </li>

              <li>
                <router-link :to="fun.getUrl('myEvaluation', { selected: '1' })">
                  <i class="iconfont icon-fontclass-pinglun" style="width: 1.7rem;"></i>
                  <span>{{ $i18n.t("member.评论") }}</span>
                </router-link>
              </li>
              <li>
                <router-link :to="fun.getUrl('myRelationship', { selected: '1' })">
                  <i class="iconfont icon-fontclass-kehu" style="width: 1.7rem;"></i>
                  <span>{{ member_agent }}</span>
                </router-link>
              </li>
              <li>
                <router-link :to="fun.getUrl('coupon', { selected: '1' })">
                  <i class="iconfont icon-fontclass-youhuiquan" style="width: 1.7rem;"></i>
                  <span>{{ $i18n.t("member.优惠券") }}</span>
                </router-link>
              </li>

              <li v-if="pluginsList.market && notShow.indexOf(item.url) < 0 && notShow.indexOf(item.name) < 0" v-for="(item, i) in pluginsList.market" :key="i" @click="pluginGoto(item)">
                <i class="iconfont" :class="item.class"></i>
                <span>{{ item.title }}</span>
                <div class="Badge" v-show="item.total > 0">{{ item.total > 99 ? "99+" : item.total }}</div>
              </li>
            </ul>
          </div>

          <div class="extension_plate">
            <h1>
              <div class="spare"></div>
              {{ $i18n.t("member.资产权益") }}
            </h1>
            <ul class="box">
              <li v-if="pluginsList.asset_equity && notShow.indexOf(item.url) < 0" v-for="(item, i) in pluginsList.asset_equity" :key="i" @click="pluginGoto(item)">
                <i class="iconfont" :class="item.class"></i>
                <span>{{ item.title }}</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- 模板二end -->

        <!--退出登录 微信端不显示退出登录按钮-->
        <van-button type="primary" style="margin: 0.875rem auto; width: 90%;" size="large" color="#f15353" @click="outInfo()" v-if="(fun.getTyep() != 1 && fun.getTyep() != 2) || wechat_login_mode"
          >{{ $i18n.t("member.退出登录") }}
        </van-button>

        <!-- 版权图片 -->
        <img :src="copyrightImg" v-if="!fun.isTextEmpty(copyrightImg)" alt="" class="copyrightImg" />
        <!-- 版权图片 end-->
        <div class="copyright">©{{ copyright }}&nbsp;</div>
        <div class="copyright">
          <template v-if="fun.isApp()">
            <router-link style="color: #3b73ef;" :to="fun.getUrl('userAgreement', {}, { show: 'agreement' })">用户协议 </router-link>
            和
            <router-link style="color: #3b73ef;" :to="fun.getUrl('userAgreement', {}, { show: 'privacy' })">隐私政策 </router-link>
          </template>
        </div>
        <div v-if="fun.isIphoneX()" style="height: 34px;"></div>
        <div style="height: 1rem; clear: both;"></div>
      </div>
      <!--不启用装修的部分end-->

      <!--海报部分-->
      <yz-goodsposter v-model="posterShow" :posterData="poster_Data" :defaultImg="poster" :width="`18.875rem`" v-on:finish="uploadImageM"></yz-goodsposter>
      <!--海报部分end-->

      <!--弹窗广告部分-->
      <div class="cover">
        <div class="mask" v-show="advertising.is_default === 1">
          <div
            class="modal-mask"
            v-if="advertising.datas && advertising.datas.background_over && popShow"
            :style="{ backgroundColor: `rgba(0, 0, 0, ${advertising.datas.background_over / 100})` }"
          ></div>
          <div class="mask-blank">
            <div class="pop" v-if="popShow" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
              <div class="pop-image">
                <img :src="advertising.image" @click="turnTo" />
                <div class="minLink" v-if="advertising.url_type == 2" @click.stop v-html="advertising.html"></div>
                <div class="icon_close">
                  <i class="iconfont icon-close11" @click="closePop"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--弹窗广告部分end-->


      <van-popup v-model="mainCommentShow" position="bottom">
        <div class="replyMainComment">
          <div class="left">
            <van-field v-model="maincomment"  rows="1" autosize type="textarea" placeholder="请填写你的新昵称" />
          </div>
          <div class="right" @click="subMainBtn">发送</div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import member from "./membercontroller";

export default member;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
/* @import "../../assets/css/member.scss"; */

/* 弹窗广告 */
.minLink {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.cover .mask-blank .pop {
  width: 65%;
  position: fixed;
  z-index: 8888;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.cover .mask-blank .pop.pcStyle {
  width: 270px;
}

.cover .mask-blank .pop .pop-image {
  position: relative;
}

.cover .mask-blank .pop .pop-image img {
  width: 100%;
  height: 100%;
}

.cover .mask-blank .pop .pop-image .icon_close {
  top: 0;
  right: 0;
  position: absolute;
  background-color: #333;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -0.75rem;
  margin-right: -0.75rem;
  border-radius: 50%;
}

.cover .mask-blank .pop .pop-image .icon_close {
  color: #fff;
}

.poster-popup-class {
  background-color: transparent !important;
}

.modal-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
}

/* 弹窗广告 */

.copyright {
  color: #a7a7a7;
  margin: 0.625rem 0;
}

.copyrightImg {
  // 版权图标
  display: block;
  margin: 1rem auto;
  max-width: 100%;
}

/* 会员信息 */
.background-box {
  padding-top: 10px;
  color: #382c0a;
  background-color: #fff;
  background-image: linear-gradient(#ffc11e, #f5f5f5);
}

.member-header {
  display: flex;
  padding: 10px;
}

.header-avatar {
  flex: 0 0 4rem;
  margin-right: 8px;

  img {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
  }
}

.user-info {
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.user-name-box,
.user-info-id,
.user-level,.user-name-left {
  display: flex;
  align-items: center;
}

.user-name-box {
  justify-content: space-between;

  .user-name {
    width: 90%;
    font-size: 16px;
    font-weight: bold;
    text-align: left;
  }

  .icon-massage_set {
    width: 15%;
    font-size: 20px;
    color: #7f5c02;
  }
}

.user-id {
  font-size: 12px;
  margin-right: 0.5rem;
}

.copy-btn {
  font-size: 12px;
  color: #af820d;
  border: solid 0.0625rem #ebebeb;
  background-color: #fff;
  border-radius: 2rem;
  padding: 0 0.375rem;
}

.user-level-name {
  display: flex;
  padding: 3px 7px;
  font-size: 12px;
  align-items: center;
  background-color: #a36705;
  border-radius: 15px;
  color: #fff;

  .level-icon {
    width: 14px;
    height: 14px;
    margin-right: 3px;
  }

  .fa-angle-right {
    font-size: 16px;
    margin-left: 3px;
  }
}

.user-level-time {
  font-size: 12px;
  margin-left: 5px;
  color: #af820d;
}

/* 订单列表 */
.order-list {
  margin: 10px;
  padding: 10px;
  border-radius: 15px;
  background-color: #fff;

  .order_item {
    display: flex;
    padding-top: 5px;
    border-top: 1px solid #f3f3f3;
  }

  .order_pub {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-top: 0.125rem;
    text-align: center;
    color: #000;
    position: relative;
    font-size: 12px;

    i {
      font-size: 24px;
      color: #000;
      display: inline-block;
      font-weight: bold;
    }

    .badge {
      position: absolute;
      left: 56%;
      top: 0.125rem;
      color: #fff;
      border-radius: 0.625rem;
      background-color: #f15353;
      line-height: 0.875rem;
      font-size: 12px;
      padding: 0 0.3125rem;
      border: solid 1px #f15353;
    }
  }
}

/* 资产信息 */
.asset-box {
  display: flex;
  margin: 10px;
  padding: 10px;
  border-radius: 15px;
  background-color: #fff;
}

.asset-left-box {
  width: 80%;

  ul {
    display: flex;
    overflow-x: scroll;
    padding: 5px;

    li a {
      display: flex;
      flex-direction: column;
    }

    span {
      word-break: keep-all;
      margin: 0 10px;
      line-height: 28px;
      font-weight: bold;
    }

    .mr {
      margin-top: 3px;
      font-size: 13px;
      line-height: 12px;
      font-weight: normal;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.asset-line {
  width: 2px;
  background-color: #d4d4d4;
  background-image: radial-gradient(#d4d4d4 5%, #fff 80%, #fff 15%);
}

.asset-right-box {
  width: 19%;
  display: flex;
  flex-direction: column;
  font-size: 12px;

  .icon-fontclass-shouru {
    font-size: 26px;
    color: #f15353;
  }
}

/* 插件数据 */
.plugins-box {
  margin: 10px;
  background-color: #fff;
  border-radius: 15px;
}

.plugin-header {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0;
  margin-bottom: 10px;
  border-bottom: 1px solid #f3f3f3;

  .plugin-header-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 33.33%;
    margin-bottom: 5px;
  }
}

.plugin-items-box {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.plugin-items-icon {
  display: flex;
  flex-direction: column;
  width: 20%;
  margin-bottom: 10px;
  font-size: 12px;

  .iconfont {
    display: inline-block;
    margin: 0 auto 5px auto;
    width: 2.5rem;
    height: 2.5rem;
  }
}

.tabs-box {
  background: #f5f5f5;
  min-height: 101vh;
}

.service-box {
  position: fixed;
  top: 500px;
  z-index: 6;
  width: 50px !important;
  height: 50px !important;
  background-size: 50px !important;
}

  .replyMainComment {
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      padding-top: 0.8rem;
      padding-bottom: 0.8rem;
      padding-left: 1rem;
      -webkit-box-align: center;
      -webkit-align-items: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: justify;
      -webkit-justify-content: space-between;
      -ms-flex-pack: justify;
      justify-content: space-between;
      .left {
        width: 18.13rem;
        background-color: #f5f5f5;
        padding: 0.2rem;
        .van-cell{
          padding:5px;
        }
      }

      .right {
        width: 3rem;
        height: 1.88rem;
        font-size: 0.94rem;
        line-height: 1.88rem;
        color: #333;
      }
  }
</style>
