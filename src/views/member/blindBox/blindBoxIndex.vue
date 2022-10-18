<template>
  <div class="page">
    <c-title :hide="false" :text="'首页'"> </c-title>
    <div class="searchBox">
      <div class="search">
        <i class="iconfont icon-all_search_2"></i>
        <form action="javascript:void 0;">
          <input type="text" @keyup.13="getData" v-model="searchText" placeholder="搜索盲盒活动" />
        </form>
      </div>
    </div>
    <div class="banner" v-if="slide.length > 0">
      <van-swipe indicator-color="white" loop :autoplay="5000">
        <van-swipe-item v-for="(item, key) in slide" :key="key">
          <a v-if="item.url != ''" :href="item.url">
            <img :src="item.img_src" alt="" />
          </a>
          <img v-else :src="item.img_src" alt="" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <van-tabs v-model="activity_type" @change="changeTabs" title-active-color="#f14e4e">
      <van-tab title="全部"></van-tab>
      <van-tab title="进行中"></van-tab>
      <van-tab title="未开始"></van-tab>
      <van-tab title="已结束"></van-tab>
    </van-tabs>
    <div class="listItems">
      <div class="listItem" v-for="item in listData" :key="item.id" @click="gotoDetails(item.id)">
        <div class="image">
          <img :src="item.activity_img_src" alt="" />
        </div>
        <div class="name">{{ item.activity_name }}</div>
        <div class="price">￥{{ item.price }}</div>
        <div class="num">
          <i class="iconfont icon-fontclass-renshu1"></i>
          <span>{{ item.join_log_count }}人参与</span>
        </div>
      </div>
    </div>
    <div class="order" @click="gotoOrderList">
      <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/blindBoxOrder.png" alt="" />
    </div>
  </div>
</template>

<script>
import blindBoxIndex from "./blindBoxIndex_controller";
export default blindBoxIndex;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  min-height: 100vh;
}

.searchBox {
  background: #fff;
  overflow: hidden;

  .search {
    height: 1.88rem;
    border-radius: 0.94rem;
    background-color: #eff0f1;
    margin: 0.75rem 0.94rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 0.69rem;

    i {
      color: #999;
    }

    input {
      border: none;
      margin-left: 0.41rem;
    }
  }
}

.banner {
  width: 100%;
  height: 10.94rem;
  background: #999;

  img {
    width: 100%;
    height: 10.94rem;
  }
}

.listItems {
  padding: 0.938rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 0.625rem;
  grid-row-gap: 0.625rem;

  .listItem {
    width: 100%;
    height: 14.75rem;
    text-align: left;
    background-color: #fff;
    box-shadow: 0 0.031rem 0.309rem 0.003rem rgba(218, 218, 218, 0.82);
    border-radius: 0.625rem;
    overflow: hidden;

    .image {
      width: 100%;
      height: 10.469rem;
      background-color: #bebebe;
      border-radius: 0.625rem 0.625rem 0 0;

      img {
        width: 100%;
        height: 10.469rem;
      }
    }

    .name {
      padding-left: 0.438rem;
      margin-top: 0.3rem;
      width: 100%;
      font-size: 0.813rem;
      font-weight: bold;
      color: #202020;
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .price {
      padding-left: 0.438rem;
      margin-top: 0.5rem;
      font-size: 0.813rem;
      font-weight: bold;
      color: #f14e4e;
    }

    .num {
      padding-left: 0.438rem;
      margin-top: 0.1rem;
      font-size: 0.625rem;
      font-weight: bold;
      color: #999;

      .iconfont {
        font-size: 0.625rem;
      }
    }
  }
}

.order {
  position: fixed;
  right: 1.094rem;
  bottom: 6.375rem;
  width: 3rem;
  height: 3rem;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
