<template>
  <div class="page">
    <div class="header">
      <div class="header_content">
        <!--                <div class="title">群活码</div> -->
        <div class="inputWrapper">
          <div class="input">
            <i class="iconfont icon-all_search_2"></i>
            <form action="javascript:void 0;">
              <input type="search" v-model="searchText" @keyup.13="gotoGroupCodeSearch" placeholder="请输入活码名称" />
            </form>
          </div>
        </div>
      </div>
      <div class="brand">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(item, key) in bannerList" :key="key">
            <a v-if="item.url != ''" :href="item.url">
              <img :src="item.img" alt="" />
            </a>
            <img v-else :src="item.img" alt="" />
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>

    <div class="ranking">
      <div class="ranking_head">
        <span class="ranking_title">排行榜</span>
        <i class="iconfont icon-qhm_listtitle"></i>
        <span class="ranking_more" @click="gotoRanking">更多</span>
        <icon class="iconfont icon-advertise-next"></icon>
      </div>
      <div class="ranking_content">
        <div class="ranking_item" v-for="(item, key) in rankingList" :key="key" @click="gotoGroupCodeLabel(item)">
          <div class="ranking_wrapper">
            <div class="gold_medal">
              <i class="iconfont icon-qhm_listbg"></i>
              <span class="num">{{ key + 1 }}</span>
            </div>
            <div>
              <img v-if="item.member_id != 0" class="ranking_face" :src="item.has_one_member ? item.has_one_member.avatar_image : ''" />
              <img v-else :src="shop_log" class="ranking_face" alt="" />
            </div>
            <span>{{ item.code_name }}</span>
          </div>
          <i class="iconfont icon-jiahao ranking_item_addCode"></i>
        </div>
      </div>
    </div>

    <div class="recommend">
      <div class="recommend_head">
        <span class="recommend_title">推荐</span>
        <i class="iconfont icon-qhm_recommend"></i>
        <!-- <span class="ranking_more">更多</span>
                <icon class="iconfont icon-advertise-next"></icon> -->
      </div>
      <c-list-item :listData="recommendList" :shop_log="shop_log"></c-list-item>
    </div>

    <c-add></c-add>
  </div>
</template>

<script>
import groupCodeController from "./group_code_index_controller";

export default groupCodeController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: #fff;
  min-height: 100vh;
  padding-bottom: 3.0625rem;
}

.header {
  height: 15rem;
  position: relative;

  .header_content {
    padding-top: 1rem;
    height: 10rem;
    background-image: linear-gradient(150deg, #33d39d 1%, #59d4ab 100%), linear-gradient(#ea803f, #ea803f);
    background-blend-mode: normal, normal;
    // .title{
    //     font-size: 1.125rem;
    //     font-weight: normal;
    //     font-stretch: normal;
    //     line-height: 1.5rem;
    //     letter-spacing: 0.056rem;
    //     color: #fff;
    // }
    .inputWrapper {
      padding-left: 1.344rem;
      padding-right: 1.469rem;

      .input {
        height: 2.125rem;
        background-color: rgba(255, 255, 255, 0.6);
        border-radius: 1.063rem;
        text-align: left;
        display: flex;
        align-content: center;

        i {
          padding-top: 0.531rem;
          padding-left: 1.125rem;
          color: #fff;
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
            color: #fff;
            border: none;

            &::-webkit-input-placeholder {
              color: #fff;
            }
          }
        }
      }
    }
  }

  .brand {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 10rem;

    .my-swipe .van-swipe-item {
      padding: 0 0.781rem;
      height: 10rem;
      color: #fff;
      font-size: 20px;
      line-height: 150px;
      text-align: center;

      img {
        width: 21.875rem;
        height: 10rem;
        background-color: #fff;
        border-radius: 0.469rem;
      }
    }
  }
}

.ranking {
  margin-top: 1.219rem;

  .ranking_head {
    display: flex;
    padding-left: 0.813rem;
    padding-right: 1.313rem;
    align-content: flex-end;

    .ranking_title {
      font-size: 1rem;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0.05rem;
      color: #060606;
    }

    .icon-qhm_listtitle {
      margin-left: 0.594rem;
      color: #ff8a00;
    }

    .ranking_more {
      flex: 1;
      text-align: right;
      font-size: 0.75rem;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0.038rem;
      color: #999;
    }

    .icon-advertise-next {
      margin-left: 0.144rem;
      color: #999;
    }
  }

  .ranking_content {
    display: grid;
    width: 21.563rem;
    margin-top: 1.25rem;
    height: 8.938rem;
    padding-left: 0.969rem;
    padding-right: 1.063rem;
    grid-template-columns: repeat(3, 6.875rem);
    grid-column-gap: 0.406rem;

    .ranking_item {
      position: relative;

      .ranking_wrapper {
        position: relative;
        width: 6.875rem;
        height: 7.969rem;
        background: #fff;
        box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.05);
        border-radius: 0.469rem;

        .gold_medal {
          position: absolute;
          top: -0.05rem;
          left: 0.531rem;

          .icon-qhm_listbg {
            color: #ffa800;
            width: 0.906rem;
            height: 1.313rem;
          }

          .num {
            position: absolute;
            top: -0.45rem;
            left: 0.261rem;
            color: #fff;
            font-size: 0.75rem;
          }
        }

        .ranking_face {
          margin-top: 1.238rem;
          width: 3.75rem;
          height: 3.75rem;
          border-radius: 50%;
        }

        span {
          margin-top: 0.375rem;
          font-size: 0.875rem;
          font-weight: normal;
          font-stretch: normal;
          line-height: 1.5rem;
          letter-spacing: 0.044rem;
          color: #333;
        }
      }

      .ranking_item_addCode {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background-color: #00b075;
      }
    }
  }
}

.recommend {
  margin-top: 1.313rem;

  .recommend_head {
    display: flex;
    padding-left: 0.813rem;
    padding-right: 1.313rem;
    align-items: center;

    .recommend_title {
      font-size: 1rem;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0.05rem;
      color: #060606;
    }

    .icon-qhm_recommend {
      transform: translateY(-0.09rem);
      margin-left: 0.594rem;
      color: #fd3489;
    }

    .ranking_more {
      flex: 1;
      text-align: right;
      font-size: 0.75rem;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0.038rem;
      color: #999;
    }

    .icon-advertise-next {
      margin-left: 0.144rem;
      color: #999;
    }
  }
}
</style>
