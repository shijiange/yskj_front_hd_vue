<template>
  <div id="all">
    <template v-if="$store.state.isWatchDiypage == 1">

      <!--旧弹窗广告和全屏广告-->
      <div class="cover" v-if="!isDecorate">
        <div v-show="advertisement.rule === 0 && advertisement.switch && fullShow"
             class="fullScreen">
          <div class="full-image">
            <img :src="advertisement.image"/>
            <span class="close"><span class="skip" @click="close">跳过</span>{{ advertisement.time }}</span>
          </div>
        </div>
        <div class="mask"
             v-show="advertisement.Midswitch">
          <div class="mask-blank">
            <div class="pop"
                 v-if="advertisement.Midrule === 0 && advertisement.Midswitch && popShow">
              <div class="pop-image">
                <img :src="advertisement.Midimage"
                     @click="turnTo"/>
                <div class="icon_close">
                  <i class="iconfont icon-close11"
                     @click="closePop"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--旧弹窗广告和全屏广告end-->

      <!--新弹窗广告和全屏广告-->
      <div class="cover">
        <div v-show="fullShow" class="fullScreen">
          <div class="full-image">
            <img :src="full_screen.image" @click="turnFullTo" />
            <span class="close"><span class="skip" @click.stop="close">跳过</span>{{ full_screen.show_time }}</span>
          </div>
        </div>
        <div class="mask" v-show="advertising.is_default === 1">
          <div class="modal-mask" v-if="advertising.datas && advertising.datas.background_over && popShow"
               :style="{backgroundColor: `rgba(0, 0, 0, ${advertising.datas.background_over/100})`}"></div>
          <div class="mask-blank">
            <div class="pop" v-if="popShow" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
              <div class="pop-image">
                <img :src="advertising.image" @click="turnTo2"/>
                <div class="minLink" v-if="advertising.url_type == 2" @click.stop v-html="advertising.html"></div>
                <div class="icon_close">
                  <i class="iconfont icon-close11" @click="closePop"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--新弹窗广告和全屏广告end-->

      <div :class="{ scroll: true }" v-show="!fullShow">

        <!--关注公众号-->
        <header style="position: fixed; top: 0;" v-if="isfollow">
          <!--用户进入商城，判断是否关注公众号-->
          <div class="attention">
            <img :src="follow_mode.logo"/>
            <!--用户分享时显示用户头像，不是分享进入页面显示商城logo-->
            <div class="text">
              <p>
                <span style="display: inline-block; overflow: hidden; color: #fff;">来自</span>
                <span
                  style="display: inline-block; max-width: 11.5rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ follow_mode.text }}</span>
                <span style="display: inline-block; overflow: hidden; color: #fff;">的推荐</span>
              </p>
              <!--用户分享时显示用户名；不是分享进入页面时，显示商城名-->
              <p>关注公众号，享专属服务</p>
            </div>
            <button><a @click="toatten"> 立即关注</a></button>
            <!--跳转至后台设置页面-->
          </div>
        </header>
        <div style="height: 2.875rem;" v-if="isfollow"></div>
        <van-popup v-model="posterShow" closeOnClickModal="true" style="padding: 0; background: none;">
          <!--关注公众号弹窗-->
          <div style="width: 100%; height: 100%; overflow: hidden;" class="code_box">
            <div style="width: 100%;">
              <img
                :src="follow_mode.follow_img"
                v-if="follow_mode.follow_img"
                style="width: 100%; border-radius: 0.375rem;"
              />
            </div>
            <!-- 关闭图标 -->
            <div
              class="icon_close"
              @click="posterShow = false"
              style="border-radius: 50%; width: 2.5rem; height: 2.5rem; border: solid 1px #ccc; margin: 0 auto; margin-top: 0.75rem;"
            >
              <i class="iconfont icon-close11" style=" line-height: 2.5rem; font-size: 1.125rem; color: #fff;"></i>
            </div>
            <!-- 关闭图标end -->
          </div>
        </van-popup>
        <!--关注公众号end-->

        <!--默认首页-->
        <div class="home" v-if="home_default">
          <div class="search" :class="{mout: amout, isfollow }"
               id="d1"
               :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '100%' }">
            <div class="search-form-box"
                 @click="tosearch">
              <i class="iconfont icon-sousuo1"></i>
              {{ $i18n.t("home.输入关键词搜索") }}
            </div>
          </div>

          <div id="home">
            <div class="banner" v-if="home_default.ads.length>0">
              <c-myswipe :pagination-visible="true"
                         :slides="home_default.ads"
                         :repeating="true"
                         :auto="3000"
                         v-if="home_default"
                         :style="{ height: fun.getPhoneEnv() == 3 ? '9.875rem' : '38vw' }">
                <div v-for="(slide, index) in home_default.ads"
                     :key="index"
                     @click="bannerClick(slide)"
                     :style="{ height: fun.getPhoneEnv() == 3 ? '9.875rem' : '38vw' }">
                  <img width="100%"
                       height="100%"
                       :src="slide.thumb"/>
                </div>

                <div :style="{ height: fun.getPhoneEnv() == 3 ? '9.875rem' : '38vw' }"
                     v-if="this.fun.isTextEmpty(home_default.ads)">
                  <img style="width: 100%; height: 100%;"
                       src="../../assets/images/loading.jpg"/>
                </div>
              </c-myswipe>
            </div>

            <!-- <div style="clear: both;"></div> -->

            <div id="function-area">
              <div class="ment"
                   v-if="home_default">
                <c-ment :datas="fun.chunk(home_default.category, 10)"></c-ment>
              </div>
            </div>

            <div id="goods-image"
                 v-if="!this.fun.isTextEmpty(home_default.advs)">
              <div class="top">
                <ul class="left" v-if="home_default.advs[0] && home_default.advs[0].img">
                  <li @click="gotoAdvs(home_default.advs[0].link)">
                    <img :src="
                        home_default.advs[0]
                          ? home_default.advs[0].img
                          : require('../../assets/images/loading.jpg')
                      "
                         alt=""
                         style="width: 100%; height: 100%;"/>
                  </li>
                </ul>
                <ul class="right" v-if="(home_default.advs[1] && home_default.advs[1].img) || (home_default.advs[2] && home_default.advs[2].img)">
                  <li v-if="home_default.advs[1] && home_default.advs[1].img" @click="gotoAdvs(home_default.advs[1].link)">
                    <img :src="
                        home_default.advs[1]
                          ? home_default.advs[1].img
                          : require('../../assets/images/loading.jpg')
                      "
                         alt=""
                         style="width: 100%; height: 100%;"/>
                  </li>

                  <li v-if="home_default.advs[2] && home_default.advs[2].img" @click="gotoAdvs(home_default.advs[2].link)">
                    <img :src="
                        home_default.advs[2]
                          ? home_default.advs[2].img
                          : require('../../assets/images/loading.jpg')
                      "
                         alt=""
                         style="width: 100%; height: 100%;"/>
                  </li>
                </ul>
              </div>
              <div class="bottom_img">

                <ul>
                  <li v-if="home_default.advs[3] && home_default.advs[3].img" @click="gotoAdvs(home_default.advs[3].link)">
                    <img :src="
                        home_default.advs[3]
                          ? home_default.advs[3].img
                          : require('../../assets/images/loading.jpg')
                      "
                         alt=""
                         style="width: 100%; height: 100%;"/>
                  </li>

                  <li v-if="home_default.advs[4] && home_default.advs[4].img" @click="gotoAdvs(home_default.advs[4].link)">
                    <img :src="
                        home_default.advs[4]
                          ? home_default.advs[4].img
                          : require('../../assets/images/loading.jpg')
                      "
                         alt=""
                         style="width: 100%; height: 100%;"/>
                  </li>

                  <li v-if="home_default.advs[5] && home_default.advs[5].img" @click="gotoAdvs(home_default.advs[5].link)">
                    <img :src="
                        home_default.advs[5]
                          ? home_default.advs[5].img
                          : require('../../assets/images/loading.jpg')
                      "
                         alt=""
                         style="width: 100%; height: 100%;"/>
                  </li>

                </ul>
              </div>



            </div>

            <div id="brand-box"
                 v-if="!this.fun.isTextEmpty(home_default.brand)">
              <div class="title">
                <i class="iconfont icon-fontclass-xingpinle"></i>
                <div class="title-text">{{ $i18n.t("home.品牌优选") }}</div>
                <div class="more" @click="$router.push(fun.getUrl('brand'))">更多</div>
                <i class="fa fa-angle-right"></i>
                <!-- <div class="img">
                  <img src="../../assets/images/member-logo.png"/>
                </div>
                <h1>{{ $i18n.t("home.品牌优选") }}</h1> -->
              </div>
              <ul>
                <template v-for="(item, i) in home_default.brand">
                  <li :key="i" v-if="i<8"
                      @click="gotoBrand(item)">
                    <div class="img"><img :src="item.logo"/></div>
                    <span class="overflow">{{ item.name }}</span>
                  </li>
                </template>
              </ul>
            </div>

            <div id="limit-time"
                 v-if="!this.fun.isTextEmpty(home_default.time_goods)">
              <div class="title-box">
                <i class="iconfont icon-fontclass-xianshi"></i>
                <div class="title-text">{{ $i18n.t("home.限时优惠") }}</div>
                <div class="more"  @click="$router.push(fun.getUrl('limitedTimeGoods'))">更多</div>
                <i class="fa fa-angle-right"></i>

              </div>
              <div class="goods-box">
                <div class="adv_img" v-if="home_default.advs[6] && home_default.advs[6].img" @click="gotoAdvs(home_default.advs[6].link)">
                  <img :src="
                        home_default.advs[6]
                          ? home_default.advs[6].img
                          : require('../../assets/images/loading.jpg')
                      "
                         alt=""
                         style="width: 100%; height: 100%;"/>
                </div>
                <div class="goods"
                     v-for="(item, i) in home_default.time_goods"
                     :key="i"
                     @click="gotoTimeGood(item.id)">
                  <div class="goods-cover">
                    <img :src="item.thumb" style="width: 100%; height: 100%;"/>
                    <div class="goods-time">
                      <van-count-down
                        :time="fun.getTimeDifference(fun.getTimestamp(item.has_one_goods_limit_buy.end_time))"
                        class="bottom_time" format="DD天HH时mm分ss秒">
                        <template #default="timeData">
                          <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.days <10 ?
                            `0${timeData.days}` :timeData.days}}</em>{{ $i18n.t("天") }}
                          <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.hours <10 ?
                            `0${timeData.hours}` :timeData.hours}}</em><b>:</b>
                          <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.minutes <10 ?
                            `0${timeData.minutes}` :timeData.minutes}}</em><b>:</b>
                          <em style="padding: 0.125rem; border-radius: 0.125rem;">{{ timeData.seconds <10 ?
                            `0${timeData.seconds}` :timeData.seconds}}</em>
                        </template>
                      </van-count-down>
                    </div>
                  </div>
                  <div class="goods-name overflow">{{ item.title }}</div>
                  <div class="goods-price">{{ $i18n.t("money")}}{{
                        item.vip_level_status && item.vip_level_status.status == 1
                          ? item.vip_level_status.word
                          : item.price
                      }}</div>

      
                </div>
              </div>
            </div>

            <div id="pop-recommend" v-if="!this.fun.isTextEmpty(home_default.goods)">
              <div class="title-box">
                <i class="iconfont icon-fontclass-tuijian1"></i>
                <div class="title-text">{{ $i18n.t("home.人气推荐") }}</div>
              
              </div>

              <div class="goodsList" v-if="home_default && home_default.goods">
                <c-goodsList
                  :goods="home_default.goods.data"
                  :last_page="home_default.goods.last_page"
                  :isDefault="1"
                  :text="$i18n.t('home.推荐商品')"
                  bgColor="#ffffff"
                ></c-goodsList>
              </div>
            </div>
          </div>
        </div>
        <!--默认首页end-->

        <!--旧装修页面-->
        <div class="temp" v-if="old_decorate && !isDecorate">
          <!--旧装修的顶部导航-->
          <div
            class="search_nav"
            v-if="sliderNav && sliderNav.isshow ? sliderNav.isshow : false"
            :style="{
              width: fun.getPhoneEnv() == 3 ? '375px' : '',
              'background-color': sliderNav.params.bgcolor,
              opacity: sliderNav.params.bgalpha,
              border: sliderNav.params.showborder == 1 ? '1px solid' + sliderNav.params.bordercolor : 'none',
              top: isfollow ? `2.75rem` : `0px`
            }"
          >
            <div class="search_box3" @click="tosearch">
              <input
                type="text"
                :title="$i18n.t('搜索')"
                readonly="readonly"
                :placeholder="sliderNav.params.searchword"
              />
              <i class="iconfont icon-sousuo1"></i>
            </div>
            <div class="nav_box" style="height: 2.75rem;">
              <ul class="nav">
                <li v-for="(item, i) in sliderNav.menus" @click="gotoAdvs(item.url)" :key="i">
                  <span :style="{ color: sliderNav.params.textcolor }">
                    {{ item.title }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div style="height: 5.5rem;" v-if="sliderNav && sliderNav.isshow ? sliderNav.isshow : false"></div>
          <!--旧装修的顶部导航end-->

          <div class="home" v-if="old_decorate.pageinfo">
            <!-- 旧装修的浮动按钮 -->
            <template v-if="old_decorate.pageinfo.temp == 'topbar'">
              <div
                class="fe-floatico"
                v-if="old_decorate.pageinfo.params.floatico == 1"
                :style="{
                  position: 'fixed',
                  width: old_decorate.pageinfo.params.floatwidth,
                  top: old_decorate.pageinfo.params.floattop
                }"
                :class="{
                  'fe-floatico-right': old_decorate.pageinfo.params.floatstyle == 'right'
                }"
              >
                <a v-if="isMiniApp" @click="this.fun.gotoMiniAppCs">
                  <img :src="old_decorate.pageinfo.params.floatimg" style="height: 100%; width: 100%;"
                  /></a>
                <a v-if="!isMiniApp" :href="old_decorate.pageinfo.params.floathref"
                ><img :src="old_decorate.pageinfo.params.floatimg" style="height: 100%; width: 100%;"
                /></a>
              </div>
            </template>
            <!-- 旧装修的浮动按钮end -->

            <!-- 旧装修的数据 -->
            <div class="home" v-if="old_decorate.data && !isInDiy">
              <template v-for="(item, index) in old_decorate.data">
                <component :key="index"
                           :is="item.temp"
                           :datas="item"
                           :home="true"
                           :tag="123"
                           :index="index"
                           :all="old_decorate.data.length"
                >
                </component>
              </template>
              <div style="height: 3.3125rem;"></div>
              <div v-if="fun.isIphoneX()" style="height: 34px;"></div>
            </div>
            <!-- 旧装修的数据end -->
          </div>
        </div>
        <!--旧装修页面end-->

        <!--新装修页面-->
        <div v-if="isDecorate && !fullShow && showPage">
          <top_navigation v-if="top_info.group_title" :id="id" :datas="top_info" :isfollow="isfollow"></top_navigation>
          <template v-for="(item, index) in components">
            <component :key="index" :is="item.component_key" :isBottom="isBottom" :lastIndex="lastIndex"
                       :btnFlag="btnFlag" :id="item.id" :page_id="page_id" :component_key="item.component_key"
                       :datas="item.remote_data" :index="index" @refresh="refreshComponent" :ref="item.component_key" :fatherTitle="fatherTitle"></component>
          </template>
        </div>
        <!--新装修页面end-->

        <U_foot :id="id+'1'" v-if="(bottom_info || home_default) && $store.state.temp.item.is_decorate" :foot_type="bottom_info.foot_type" :diydatas="bottom_info"></U_foot>
      </div>

    </template>

    <!-- 没有等级浏览权限 -->
    <template v-if="$store.state.isWatchDiypage == 0">
      <div class="noPowerShow">
        <div class="warnTestBox">暂无浏览权限！</div>
      </div>
    </template>
    <!-- 没有等级浏览权限end -->

    <!--新人奖-->
    <van-popup v-model="showNewcomerAward" :close-on-click-overlay="false" class="newcomerAward_popup">
      <newcomerAward :data="newcomerAward_data" @cloneNewcomerAward='cloneNewcomerAward'></newcomerAward>
    </van-popup>
    <!--新人奖end-->
  </div>
</template>

<script>
import home from "./home_controller";

export default home;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../assets/css/index.scss'; //弹窗样式

  .scroll {
    position: static;
  }

  .minLink {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .fibben-scroll {
    position: fixed;
    z-index: 2001;
  }

  .cover .fullScreen {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
  }

  .cover .fullScreen .full-image {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .cover .fullScreen .full-image img {
    width: 100%;
    height: 100%;
  }

  .cover .fullScreen .full-image .close {
    position: absolute;
    right: 1rem;
    top: 1rem;
    color: #fff;
    font-size: 16px;
  }

  .cover .fullScreen .full-image .close .skip {
    margin-right: 0.5rem;
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

  .newcomerAward_popup {
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
</style>
