<template>
  <div id="microShop_main">
    <div class="m_header">
      <span class="iconfont icon-left" @click="goBack"></span>
      <img :src="shop_logo" alt="" /> {{ shop_name }}
    </div>

    <div class="home">
      <div
        class="top1"
        :style="{
          backgroundImage: 'url(' + bgImg + ')',
          backgroundSize: 'cover'
        }"
      >
        <div class="content1">
          <div class="picture1">
            <img v-if="userImg" :src="userImg" alt="用户头像" />
            <img
              v-else
              src="../../../../assets/images/photo-mr.jpg"
              alt="用户头像"
            />
          </div>
          <div class="name1">
            <span>{{ username }}</span>
            <br />{{ signName }}
          </div>
        </div>
      </div>

      <div class="ment" v-if="isCategory">
        <c-ment :datas="category" :shop_id="shop_id"></c-ment>
      </div>

      <van-swipe
        :autoplay="3000"
        indicator-color="white"
        v-if="bannerData.length > 0"
        :width="fun.getPhoneEnv() == 3 ? 375 : clientWidths"
      >
        <van-swipe-item v-for="(item, i) in bannerData" :key="i">
          <div @click="tohref(item.link)" v-if="item.thumb">
            <img :src="item.thumb" alt="" width="100%" />
          </div>
          <img
            v-if="!item.thumb"
            src="../../../../assets/images/img_default.png"
          />
        </van-swipe-item>
      </van-swipe>
      <!--<div class="my-swipe" v-if="bannerData.length > 0">-->
      <!--<swipe style="height: 9.375rem;">-->
      <!--<swipe-item v-for="item in bannerData">-->
      <!--<template v-if='item.thumb'>-->
      <!--<img :src="item.thumb" width="100%">-->
      <!--</template>-->
      <!--<template v-if='!item.thumb'>-->
      <!--<img src="../../../../assets/images/img_default.png">-->
      <!--</template>-->
      <!--</swipe-item>-->
      <!--</swipe>-->
      <!--</div>-->

      <div class="my-swipe" v-if="false">
        <swipe style="height: 9.375rem;">
          <swipe-item v-for="(item, i) in ads" :key="i">
            <template v-if="item.thumb">
              <img :src="item.thumb" width="100%" />
            </template>
            <template v-if="!item.thumb">
              <img src="../../../../assets/images/img_default.png" />
            </template>
          </swipe-item>
        </swipe>
      </div>

      <div class="goodsList" v-if="goodsListData">
        <c-goodsList
          :goods="goodsListData"
          :num="6"
          text="商品列表"
        ></c-goodsList>
      </div>
    </div>

    <!-- 回归顶部按钮 -->
    <div v-if="amout" class="goTop" @click="goTop">
      <i class="iconfont icon-up"></i>
    </div>
    <div :style="{height: fun.isIphoneX() ? '5.125rem' : '3.125rem'}"></div>

    <!-- 页面底部的导航栏 -->
    <div
      class="footer"
      :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '100%',height: fun.isIphoneX() ? '5.125rem' : '3.125rem'}"
    >
      <ul>
        <router-link :to="fun.getUrl('home')">
          <li class="na">
            <i class="fa fa-home"></i>
            <p>首页</p>
          </li>
        </router-link>

        <router-link
          :to="fun.getUrl('micro_shop_share_category', { fromHome: 1 })"
        >
          <li class="na">
            <i class="fa fa-th-large"></i>
            <p>分类</p>
          </li>
        </router-link>

        <!--判断用户是否已经开店， 如果有的话显示个人中心  没有的话显示我要开店-->
        <!--<router-link :to="fun.getUrl('microShop_apply')" v-if="!havedShop">
					<li>
						<div class="openMyShop">我要
							<br />开店</div>
					</li>
				</router-link>-->
        <router-link :to="fun.getUrl('microShop_ShopKeeperCenter')">
          <li>
            <div class="openMyShop">
              <span>店主</span>
              <p>中心</p>
            </div>
          </li>
        </router-link>

        <router-link :to="fun.getUrl('cart')">
          <li class="na righ">
            <i class="fa fa-cart-plus"></i>
            <p>购物车</p>
          </li>
        </router-link>

        <router-link :to="fun.getUrl('member')">
          <li class="na righ">
            <i class="fa fa-user"></i>
            <p>我的</p>
          </li>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>
import home1 from "./home_controller";
export default home1;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
* {
  box-sizing: border-box;
}

#microShop_main {
  padding-bottom: 1.25rem;

  .m_header {
    width: 100%;
    height: 2.5rem;
    line-height: 2.5rem;
    background: #fff;
    border-bottom: 0.0625rem solid #ccc;
    display: block;
    margin: 0 auto;

    img {
      display: inline-block;
      width: 1.875rem;
      height: 1.875rem;
      border-radius: 50%;
      vertical-align: middle;
    }

    span {
      float: left;
      padding-left: 0.3125rem;
      font-size: 20px;
    }
  }

  .ad {
    min-height: 8.125rem;
    width: 100%;
    margin: 0.9375rem 0;
    background: #fff;
  }

  .ment {
    padding-top: 0.625rem;
  }

  .backEndGoods {
    padding: 0.9375rem 0;
    background: #fff;

    li {
      width: 28%;
      margin-left: 0.9375rem;
      float: left;

      .goodname {
        height: 2.5rem;
        line-height: 1.25rem;
        font-size: 14px;
        color: black;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        word-break: break-all;
        display: block;
        font-style: normal;
      }

      div {
        width: 100%;
        height: 6.25rem;
        border: 0.0625rem solid black;

        img {
          width: 100%;
          max-height: 6.25rem;
        }
      }

      p {
        line-height: 1.3125rem;
        margin-top: 0.625rem;
        text-align: left;

        b {
          color: #f15353;
          font-size: 14px;
          float: left;
          -webkit-text-size-adjust: none;
        }

        del {
          font-size: 12px;
          -webkit-text-size-adjust: none;
          display: inline-block;
          margin-left: 0.125rem;
          position: relative;
          top: -0.125rem;
          color: #3b3b3b;
          transform: translateY(-0.0625rem);
        }
      }
    }
  }

  .backEndGoods::after {
    content: "";
    display: block;
    clear: both;
  }

  .goTop {
    width: 1.875rem;
    height: 1.875rem;
    border-radius: 0.9375rem;
    position: fixed;
    bottom: 5rem;
    right: 0.625rem;
    z-index: 40;

    /* color: #20a0ff; */
    font-size: 24px;

    /* background-image: url(../../../../assets/images/top.png); */
    background-repeat: no-repeat;
    background-size: 1.875rem 1.25rem;
    background-position: 0 0.3125rem;
    background-color: #000;
    opacity: 0.25;

    i {
      font-size: 1.6875rem;
      color: #fff;
    }
  }

  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 3.125rem;
    background: #fff;
    box-sizing: border-box;
    z-index: 100;

    ul {
      box-sizing: border-box;
      width: 100%;
      height: 3.125rem;
      padding: 0.5rem;

      li {
        width: 20%;
        float: left;
        font-size: 12px;
        color: #828282;

        i {
          font-size: 1.25rem;
        }
      }

      .openMyShop {
        width: 3.4375rem;
        height: 3.4375rem;
        background: #f15353;
        border-radius: 50%;
        line-height: 1.25rem;
        padding-top: 0.5rem;
        box-sizing: border-box;
        text-align: center;
        color: #fff;
        box-shadow: 0 0 0 0.375rem #e6e6e6;
        position: relative;
        bottom: 1.125rem;
        font-size: 14px;
        z-index: 100;
        margin: 0 auto;
      }
    }
  }

  header {
    height: 2.875rem;
    background: #fff;
    padding: 0.4375rem;
    box-sizing: border-box;
    width: 100%;
    z-index: 99;

    .attention {
      .iconfont {
        float: left;
        line-height: 2rem;
        font-size: 1.875rem;
      }

      img {
        float: left;
        height: 1.625rem;
        width: 1.625rem;
        vertical-align: middle;
        transform: translateY(3px);
      }

      .text {
        float: left;
        margin-left: 0.1875rem;

        p {
          color: #333;
          font-size: 16px;
          margin: 0;
          text-align: left;
          line-height: 2rem;

          span {
            color: #f15353;
          }
        }
      }

      button {
        background: #48a3f1;
        border: 0;
        border-radius: 0.25rem;
        height: 1.625rem;
        float: right;
        margin: 0.1875rem 0;

        a {
          color: #fff;
        }
      }
    }
  }

  header.amout {
    position: fixed;
    top: 0;
  }

  .m-swipe {
    position: relative;
    z-index: 2;

    .c-swipe {
      overflow: hidden;
      text-align: center;
      position: relative;
      width: 100%;

      .c-swipe-item {
        text-align: center;
        overflow: hidden;
        position: relative;
        width: 100%;

        img {
          width: 100%;
          height: 8.125rem !important;
        }
      }
    }

    .c-swipe::after {
      content: "";
      display: block;
      clear: both;
    }

    img {
      width: 100%;
      height: 8.125rem;
    }
  }

  .isfollow {
    top: 2.8125rem;
  }

  .search {
    float: right;
    width: 40%;
    margin-right: 0.9375rem;

    img {
      width: 10%;
      float: left;
      max-height: 2.5rem;
    }

    .search-form-box {
      width: 100%;
      color: #989191;
      background: #f3f5f7;
      border-radius: 0.9375rem;
      height: 1.875rem;
      line-height: 1.875rem;
      text-align: left;
      padding-left: 0.625rem;
      font-size: 14px;
      margin-right: 0.9375rem;
    }
  }

  .top1 {
    padding: 0.9375rem;
    height: 7.6875rem;
    background: #f15353;
    position: relative;

    .content1 {
      position: absolute;
      height: 3.125rem;
      text-align: left;
      left: 0.9375rem;
      display: flex;
      top: 3.3125rem;
      flex-flow: row;

      .picture1 {
        float: left;
        width: 3.125rem;
        height: 3.125rem;
        margin-right: 0.9375rem;

        img {
          width: 3.125rem;
          height: 3.125rem;
          border-radius: 50%;
          vertical-align: middle;
        }
      }

      .name1 {
        flex: 1;
        color: #fff;
        font-size: 12px;
        float: left;
        line-height: 1.25rem;
        padding-top: 0.3125rem;

        span {
          font-size: 16px;
        }

        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        word-break: break-all;
      }
    }
  }
}
</style>
