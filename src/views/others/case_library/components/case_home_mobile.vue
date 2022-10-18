<template>
  <div id="case-home-mobile" v-if="view_show">
    <div>
      <template>
        <van-swipe :autoplay="4000" indicator-color="white" :width="fun.getPhoneEnv() == 3 ? 375 : '100%'">
          <van-swipe-item v-for="(slide, index) in banner" :key="index" v-if="slide.img_src">
            <a :href="slide.url || '#'" style="height: 9.125rem;">
              <img style="width: 100%; height: 9.125rem;" :src="slide.img_src || emptyImage" />
            </a>
          </van-swipe-item>
        </van-swipe>
        <div v-if="banner.length <= 0" style="width: 100%; height: 9.125rem; line-height: 9.125rem; background: #fff;">
          ~~暂无轮播图~~
        </div>
      </template>
    </div>
    <div class="slide" v-if="newCase.length > 0">
      <van-notice-bar :scrollable="false">
        <van-swipe vertical class="notice-swipe" :autoplay="3000" :show-indicators="false">
          <van-swipe-item v-for="(item, index) in newCase" :key="index">
            <div class="li">
              <div class="button">最新发布</div>
              <div class="name">{{ item.case_name }}</div>
              <div class="time" v-if="item.created_at">{{ item.created_at.split(' ')[0] }}</div>
              <div class="detail" @click="gotoCaseDetail(item.id)">详情</div>
            </div>
          </van-swipe-item>
        </van-swipe>
      </van-notice-bar>
    </div>
    <div class="nav">
      <div class="li" @click="gotoOther('new')">
        <div class="img">
          <img src="../../../../assets/images/case-nav1.png" alt="" />
        </div>
        <div class="title">最新案例</div>
      </div>
      <div class="li" @click="gotoOther('category')">
        <div class="img">
          <img src="../../../../assets/images/case-nav2.png" alt="" />
        </div>
        <div class="title">全部分类</div>
      </div>
      <div class="li" @click="gotoOther('ranking')">
        <div class="img">
          <img src="../../../../assets/images/case-nav3.png" alt="" />
        </div>
        <div class="title">排行榜</div>
      </div>
      <div class="li" @click="gotoOther('area')">
        <div class="img">
          <img src="../../../../assets/images/case-nav4.png" alt="" />
        </div>
        <div class="title">区域案例</div>
      </div>
    </div>
    <div class="hot">
      <div class="top" v-if="special.length > 0">
        <div class="img">
          <img src="../../../../assets/images/case-hot.png" alt="" />
        </div>
        <div class="title">热门专题</div>
        <div class="more" @click="gotoOther('subjectList')">更多></div>
      </div>
      <div class="img-one">
        <div v-for="(item, index) in special" :key="index" @click="gotoSpecial(item.id)">
          <img :src="item.special_banner_src || emptyImage" alt="" />
        </div>
      </div>
      <div class="img-two">
        <van-swipe :autoplay="4000" indicator-color="white" :width="fun.getPhoneEnv() == 3 ? 375 : '100%'">
          <van-swipe-item v-if="ad1 && ad1.length !==0">
            <a :href="ad1.url || '#'" style="height: 5.3125rem;">
              <img style="width: 100%; height: 5.3125rem;" :src="ad1.mobile_img || emptyImage" />
            </a>
          </van-swipe-item>
          <van-swipe-item v-if="ad2 && ad2.length !==0">
            <a :href="ad2.url || '#'" style="height: 5.3125rem;">
              <img style="width: 100%; height: 5.3125rem;" :src="ad2.mobile_img || emptyImage" />
            </a>
          </van-swipe-item>
        </van-swipe>
        <div v-if="(!ad1 && !ad2) || (ad1.length ===0 && ad2.length ===0)" style="width: 100%; height: 5.3125rem; line-height: 5.3125rem; background: #fff;">
          ~~暂无广告图~~
        </div>
      </div>
    </div>
    <div class="hot-case">
      <div class="top">
        <div class="img">
          <img src="../../../../assets/images/case-new.png" alt="" />
        </div>
        <div class="title">热门案例</div>
      </div>
      <div class="category">
        <div
          class="li"
          v-for="(item, index) in hotCategory"
          :key="index"
          @click="changeCategory(item.id)"
          :class="{ 'li-selected': category_index == item.id }"
        >
          <div class="name">{{ item.category_name }}</div>
          <div class="hr"></div>
        </div>
      </div>
      <caseMobile :datas="hotCasesList"></caseMobile>
      <div style="width: 100%; height: 40px; line-height: 40px; text-align: center;" v-if="!isLoadMore">
        {{ $i18n.t('没有更多了') }}~
      </div>
      <div style="height: 2.5rem;"></div>
    </div>

    <serviceTemplate></serviceTemplate>
    <cFoot v-if="$store.state.temp.item.menustyle && !$store.state.temp.item.menus.page_info"></cFoot>
    <U_foot
          v-if="
              ($store.state.temp.item.is_decorate === 1 ||
                $store.state.temp.item.menus === '' ||
                ($store.state.temp.item.menus && $store.state.temp.item.menus.page_info))
          "
        ></U_foot>
  </div>
</template>

<script>
import case_home_mobile_controller from './case_home_mobile_controller';
export default case_home_mobile_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$orange: #ff5c00;
$text-color: #202020;

#case-home-mobile {
  .slide {
    margin: 0.3125rem 0.9375rem;
    background: #fff;
    line-height: 1.125rem;
    height: 2.03125rem;
    border-radius: 0.3125px;

    .li {
      display: flex;
      font-size: 0.75rem;
      width: 100%;

      .button {
        border-radius: 2px;
        padding: 0.1875px 0;
        background: $orange;
        color: #fff;
        width: 3.5rem;
        text-align: center;
      }

      .name {
        width: 7.5rem;
        font-size: 0.8125rem;
        color: #333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin: 0 0.5rem;
      }

      .time {
        font-size: 0.75rem;
        color: #999;
        flex: 1;
      }

      .detail {
        width: 3rem;
        color: $orange;
        text-align: right;
      }
    }

    .van-notice-bar__content.van-ellipsis {
      // max-width: 100%;
      width: 100%;
    }

    .van-notice-bar {
      background: #fff;
      color: #333;
    }
  }

  .nav {
    display: flex;
    justify-content: space-between;

    .li {
      text-align: center;
      width: 4.78rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 1.1875rem 0.9375rem;

      .img {
        width: 38px;
        height: 38px;
        text-align: center;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .title {
        color: #202020;
        padding-top: 0.5rem;
        font-weight: 700;
        font-size: 0.75rem;
      }
    }
  }

  .hot {
    border-top-left-radius: 1.25rem;
    border-top-right-radius: 1.25rem;
    background: #fff;
    width: 100%;
    padding: 0 0.9375rem;

    .top {
      padding: 1.25rem 0 0.9375rem 0;
      display: flex;
      line-height: 1.5rem;

      .img {
        width: 0.9375rem;
        height: 1.25rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .title {
        color: $text-color;
        font-size: 1.0625rem;
        font-weight: 700;
        flex: 1;
        text-align: left;
        margin-left: 0.4275rem;
      }

      .more {
        color: #666;
        font-size: 12px;
      }
    }

    .img-one {
      display: flex;
      overflow: auto;

      div {
        min-width: 10.157rem;
        width: 10.157rem;
        height: 5.3125rem;
        border-radius: 5px;
        margin-right: 0.5rem;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }
      }
    }
    // 去除滚动条
    .img-one::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }

    .img-two {
      margin-top: 1.375rem;
      width: 100%;
      height: 5.3125rem;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .hot-case {
    background: #fff;
    width: 100%;

    .top {
      padding: 1.25rem 0.9375rem 0.9375rem 0.9375rem;
      display: flex;
      line-height: 1.5rem;

      .img {
        width: 0.9375rem;
        height: 1.25rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .title {
        color: $text-color;
        font-size: 1.0625rem;
        font-weight: 700;
        flex: 1;
        text-align: left;
        margin-left: 0.4275rem;
      }
    }

    .category {
      display: flex;
      padding: 0 0.9375rem;
      overflow: auto;
      width: 100%;

      .li {
        flex: 1;
        // min-width: 5rem;
        margin-right: 2rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        white-space: nowrap;

        .name {
          font-size: 0.875rem;
          color: #999;
          font-weight: 700;
        }

        .hr {
          background: transparent;
          width: 1.25rem;
          height: 3px;
          margin-top: 0.468rem;
          border-radius: 1.5px;
          text-align: center;
        }
      }

      .li-selected {
        .name {
          color: $orange;
        }

        .hr {
          background: $orange;
        }
      }
    }
  }

  .service {
    position: fixed;
    right: 1.05rem;
    bottom: 5.75rem;
    width: 2.1875rem;
    height: 2.1875rem;
    line-height: 2.1875rem;
    font-size: 12px;
    border-radius: 50%;
    text-align: center;
    color: #fff;
    background: #f15353;
  }

  .van-popup--center {
    border-radius: 0.625rem;

    .mobile {
      width: 14.34rem;
      height: 13.875rem;
      border-radius: 0.625rem;
      padding: 1rem;

      .close {
        // padding-top:1rem;
        text-align: right;
      }

      .number {
        text-align: center;
        padding-top: 0.5rem;
        color: $text-color;
      }

      .img {
        text-align: center;
        margin-top: 1.75rem;

        img {
          width: 6.5625rem;
          height: 6.5625rem;
        }
      }
    }
  }
}

.notice-swipe {
  height: 1.125rem;
  line-height: 1.125rem;
}
</style>
