<template>
  <div id="distribution">
    <c-title :hide="false" :text="name"></c-title>
    <div id="search" @click="tosearch">
      <div id="soso">
        <i class="iconfont icon-sousuo1"></i>
        搜索活动标题
      </div>
    </div>
    <c-myswipe
      :style="{ height: fun.getPhoneEnv() == 3 ? '182px' : '12rem' }"
      :pagination-visible="true"
      :slides="rotation"
      :repeating="true"
      :auto="5000"
      class="banner banner_pcStyle"
      v-if="is_rotation==1"
    >
      <div v-for="(ithumb, index) in rotation" :key="index" @click="goBanner(index)">
        <template v-if="ithumb">
          <img :src="ithumb.img" style="width: 100%; height: 100%;" />
        </template>
      </div>
    </c-myswipe>
    <div class="hot">
      <div class="title">
        <div class="img" style="">
          <img
            src="../../../assets/images/dl_recomend@2x.png"
            alt=""
          />
        </div>
        热门推荐
      </div>
      <div class="adv">
        <div class="adv-li" v-if="advert_one.img" @click="gotoDiy(advert_one.link)">
          <img
            :src="advert_one.img"
            alt=""
            style="width: 100%; height: 100%;"
          />
        </div>
        <div class="adv-li" v-if="advert_two.img" @click="gotoDiy(advert_two.link)">
          <img
            :src="advert_two.img"
            alt=""
            style="width: 100%; height: 100%;"
          />
        </div>
        <div class="adv-li" v-if="advert_three.img" @click="gotoDiy(advert_three.link)">
          <img
            :src="advert_three.img"
            alt=""
            style="width: 100%; height: 100%;"
          />
        </div>
      </div>
      <div class="adv-banner" v-if="advert_four.img" @click="gotoDiy(advert_four.link)">
        <img
          :src="advert_four.img"
          alt=""
        />
      </div>
    </div>
    <div class="new">
      <div class="title">
        <div class="img">
          <img
            src="../../../assets/images/new_active@2x.png"
            alt=""
          />
        </div>
        最新活动
      </div>
      <div class="list">
        <div class="list-li" v-for="(item,index) in activity_list" :key="index" @click="gotoDetail(index)">
          <div class="img">
            <img :src="item.cover" alt="">
          </div>
          <div class="content">
              <div class="content-word">
                {{item.title}}
              </div>
              <div class="price">
                {{item.join_num?item.join_num:0}} 人参与
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import index_controller from "./index_controller";

export default index_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#distribution {
  background: #fff;
  min-height: 100vh;

  #search {
    background: #fff;
    padding: 0.375rem 1.25rem;

    #soso {
      width: 100%;
      height: 1.75rem;
      line-height: 1.75rem;
      background: #f5f5f5;
      padding: 0 0.625rem;
      text-align: left;
      border-radius: 1rem;
      color: #8c8c8c;
      margin-top: 0.5rem;

      i {
        color: #999;
        line-height: 1.75rem;
        margin-right: 0.375rem;
        font-size: 16px;
      }

      i.style1 {
        float: right;
      }
    }
  }

  .banner {
    margin: 0 0.5rem;
    border-radius: 0.5rem;
  }

  .hot {
    margin: 0 0.5rem;

    .title {
      font-size: 1rem;
      font-weight: 600;
      text-align: left;
      line-height: 2rem;
      padding: 0.5rem 0;

      .img {
        line-height: 2rem;
        float: left;
        padding-right: 0.5rem;

        img {
          width: 1rem;
          height: 1.25rem;
          margin-top: 0.375rem;
        }
      }
    }

    .adv {
      display: flex;
      margin: 0.35rem 0;

      .adv-li {
        flex: 1;
        margin-right: 0.35rem;
        height: 5rem;
        border-radius: 0.5rem;

        img {
          border-radius: 0.5rem;
        }
      }

      .adv-li:last-child {
        margin-right: 0;
      }
    }

    .adv-banner {
      border-radius: 0.5rem;
      height: 6rem;
      margin: 0.5rem 0;

      img {
        width: 100%;
        height: 100%;
        border-radius: 0.5rem;
      }
    }
  }

  .new {
    margin: 0 0.5rem;

    .title {
      font-size: 1rem;
      font-weight: 600;
      text-align: left;
      line-height: 2rem;
      padding: 0.5rem 0;

      .img {
        line-height: 2rem;
        float: left;
        padding-right: 0.5rem;

        img {
          width: 1.25rem;
          height: 1.25rem;
          margin-top: 0.375rem;
        }
      }
    }

    .list {
      margin-bottom: 0.5rem;

      .list-li {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        margin-bottom: 0.5rem;
        width: 100%;

        .img {
          flex: 0 0 7rem;
          height: 7rem;
          margin-right: 0.5rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .content {
          flex: 1;
          text-align: left;
          position: relative;
          height: 7rem;

          .content-word {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
          }

          .price {
            display: inline-block;
            background: #fca830;
            // #ff7554
            background: linear-gradient(to right, #fca830 0%, #ff7554 100%);
            border-top-right-radius: 1rem;
            border-bottom-right-radius: 1rem;
            color: #fff;
            padding: 0.25rem 0.5rem;
            position: absolute;
            bottom: 0;
          }
        }
      }
    }
  }
}
</style>
