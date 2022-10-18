<template>
  <div class="page">
    <c-title text="星拼乐"></c-title>
    <div class="header">
      <div class="header_content">
        <!--                <div class="title">群活码</div> -->
        <div class="inputWrapper">
          <div class="input">
            <i class="iconfont icon-all_search_2"></i>
            <form action="javascript:void 0;">
              <input type="search" v-model="searchText" @keyup.13="onSearch" placeholder="搜索商品" />
            </form>
          </div>
        </div>
        <div class="explain" @click="explainFlag = true">活动说明</div>
      </div>
      <div class="brand">
        <van-swipe class="my-swipe" :autoplay="3000" v-if="slide.length > 0" indicator-color="white">
          <van-swipe-item v-for="(item, key) in slide" :key="key">
            <a :href="item.thumb_link" v-if="item.thumb_link">
              <img :src="item.thumb" alt="" />
            </a>
            <img v-else :src="item.thumb" alt="" />
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>

    <div class="items" v-if="listData.length > 0">
      <div class="item" v-for="(item, key) in listData" :key="key">
        <div class="face">
          <img :src="item.thumb" alt="" />
        </div>
        <div class="container">
          <div class="name">
            {{ item.title }}
          </div>
          <div class="money">
            <span class="c1">￥</span>
            <span class="c2">{{ item.min_price }}</span>
            <span class="c3" v-if="market_price">￥{{ item.market_price }}</span>
          </div>
          <div class="num">
            <i class="iconfont icon-fx_haoyou"></i>
            <span class="text">{{ item.limit_num }}人</span>
          </div>
        </div>
        <div class="btn" @click="gotoStarMusicGoodsDetails(item.goods_id)">去参团 <i class="iconfont icon-member_right"></i></div>
      </div>
    </div>

    <van-overlay :show="explainFlag" @click="explainFlag = false" :lock-scroll="false">
      <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
        <transition name="van-slide-up">
          <div class="explainWrapper" v-show="explainFlag" @click.stop>
            <div class="header">
              <div class="title">说明</div>
              <i class="iconfont icon-guanbi" @click="explainFlag = false"></i>
            </div>
            <div class="content" v-if="share.explain" v-html="share.explain"></div>
          </div>
        </transition>
      </div>
    </van-overlay>

    <div class="float">
      <div class="btn" @click="gotoStarMusicOpenGroup">
        <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/star_music_open_group.png" alt="" />
      </div>
      <div class="btn" @click="gotoStarMusicMy">
        <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/star_music_my.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import starMusicController from "./star_music_index_controller";

export default starMusicController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: #f2f2f2;
  min-height: 100vh;
  padding-bottom: 3.0625rem;
}

.header {
  .header_content {
    height: 3.263rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 1.344rem;
    padding-right: 1.469rem;
    background: #fff;

    .inputWrapper {
      padding-right: 1.469rem;
      flex: 1;

      .input {
        height: 2.125rem;
        background-color: #eff0f1;
        border-radius: 1.063rem;
        text-align: left;
        display: flex;
        align-content: center;

        i {
          padding-top: 0.531rem;
          padding-left: 1.125rem;
          color: #666;
          display: flex;
          align-content: center;
        }

        form {
          flex: 1;
          display: flex;
          align-items: center;
          padding-right: 0.531rem;

          input {
            flex: 1;
            margin-left: 0.531rem;
            font-size: 0.875rem;
            font-weight: normal;
            font-stretch: normal;
            line-height: 1.5rem;
            letter-spacing: 0.044rem;
            color: #666;
            border: none;

            &::-webkit-input-placeholder {
              color: #666;
            }
          }
        }
      }
    }
  }

  .brand {
    width: 100%;
    height: 10rem;

    .my-swipe .van-swipe-item {
      height: 10rem;
      color: #fff;
      font-size: 20px;
      line-height: 150px;
      text-align: center;

      img {
        width: 100%;
        height: 10rem;
        background-color: #fff;
      }
    }
  }
}

.items {
  padding: 0.938rem;

  .item {
    height: 8.406rem;
    background-color: #fff;
    padding: 0.875rem 0.8rem 1.25rem 0.563rem;
    display: flex;
    position: relative;
    margin-bottom: 0.636rem;
    border-radius: 0.625rem;

    .face {
      width: 6.281rem;
      height: 6.281rem;
      background-color: #999;
      border-radius: 0.313rem;

      img {
        width: 6.281rem;
        height: 6.281rem;
        border-radius: 0.313rem;
      }
    }

    .container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-left: 0.413rem;
      text-align: left;

      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        font-size: 0.875rem;
        color: #000;
      }

      .money {
        .c1 {
          font-size: 0.75rem;
          color: #f14e4e;
        }

        .c2 {
          font-size: 1rem;
          color: #ff2c29;
        }

        .c3 {
          margin-left: 0.8rem;
          font-size: 0.75rem;
          color: #999;
        }
      }

      .num {
        font-size: 0.75rem;
        color: #f14e4e;

        .text {
          margin-left: 0.4rem;
        }
      }
    }

    .btn {
      position: absolute;
      bottom: 0.938rem;
      right: 0.625rem;
      width: 4.063rem;
      height: 1.5rem;
      background-color: #f14e4e;
      border-radius: 0.125rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
  }
}

.explainWrapper {
  width: 21.25rem;
  max-height: 22.625rem;
  background-color: #fff;
  border-radius: 1.531rem;
  padding-bottom: 3rem;
  transition: 0.3s;
  padding-top: 0.5rem;

  .header {
    height: 2.596rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .title {
      font-size: 1rem;
      letter-spacing: 0.05rem;
      color: #000;
    }

    .icon-guanbi {
      position: absolute;
      top: 0.875rem;
      right: 1.25rem;
      color: #000;
    }
  }

  .content {
    max-height: 11rem;
    padding-top: 0.562rem;
    font-size: 0.875rem;
    letter-spacing: 0.066rem;
    color: #666;
    padding-left: 1.049rem;
    padding-right: 1.469rem;
    text-align: left;
    line-height: 1.5rem;
    overflow-y: scroll;

    /deep/ img {
      max-width: 100% !important;
    }
  }
}

.float {
  position: fixed;
  bottom: 5rem;
  left: 50%;
  transform: translateX(-10rem);

  .btn {
    width: 2.813rem;
    height: 2.813rem;
    margin-top: 0.5rem;

    img {
      width: 2.813rem;
      height: 2.813rem;
    }
  }
}
</style>
