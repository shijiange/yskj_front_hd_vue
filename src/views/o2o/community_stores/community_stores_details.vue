<template>
  <div class="communityStoreDetail">
    <c-title :hide="false" :text="store_title"></c-title>
    <div class="top">
      <div class="location" @click="tolocation">
        <i class="iconfont icon-dingwei"></i>
        <span class="title">{{ address || "未定位" }}</span>
      </div>
      <div class="text" @click="show = true">社区介绍</div>
    </div>
    <div class="search-box">
      <form @submit.prevent action="#">
        <input type="search" placeholder="搜索门店" @keypress="enterSearch" v-model.trim="search" />
      </form>
      <i class="iconfont icon-all_search_2" @click.stop="searchStore"></i>
    </div>
    <div class="banner" v-if="communityStoreDetail.slideshow_url && communityStoreDetail.slideshow_url.length > 0">
      <van-swipe indicator-color="white" loop :autoplay="5000">
        <van-swipe-item v-for="(item, key) in communityStoreDetail.slideshow_url" :key="key">
          <img :src="item" alt="" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="main-box">
      <div class="storeTitle">
        <i class="iconfont icon-mendian"></i>
        <span class="text">所属门店</span>
      </div>
      <d-list @load="getDetails" :finished="!isLoadMore" :loading="loading" :showStatusText="false">
        <div class="storeListBoxCommunityStore" v-if="storeList.length > 0">
          <c-storeList :stores="storeList" :noText="true" :listStyle="openTemplate"></c-storeList>
        </div>
      </d-list>
      <div v-if="storeList.length === 0">
        <van-empty description="暂无数据" />
      </div>
    </div>
    <van-popup v-model="show" closeable position="bottom" :style="{ height: '65%' }">
      <div class="introduceTitle">社区介绍</div>
      <div class="detail">
        <div class="box">
          <div class="icon-box">
            <div class="icon"></div>
            <div class="iconTitle">社区地址</div>
          </div>
          <div class="addr">{{ communityStoreDetail.address_name + communityStoreDetail.address || "无" }}</div>
        </div>
        <div class="box">
          <div class="icon-box">
            <div class="icon"></div>
            <div class="iconTitle">活动说明</div>
          </div>
          <div id="a_content" class="explain" v-html="communityStoreDetail.explain"></div>
          <div class="explain" v-if="!communityStoreDetail.explain">无</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import community_stores_details_controller from "./community_stores_details_controller";

export default community_stores_details_controller;
</script>
<style>
#a_content img {
  max-width: 100%;
  height: auto;
  display: inline-block;
}
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
.communityStoreDetail {
  line-height: 1.5rem;
  background-color: #fff;
}

.top {
  padding: 0.5rem;
  height: 2.75rem;
  background-color: #fff;
  display: flex;
  align-items: center;

  .location {
    align-items: center;
    width: 75%;
    display: flex;

    .iconfont {
      color: #313131;
      padding: 0 0.15rem;
    }

    .title {
      font-size: 13px;
      height: 1.81rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      line-height: 1.81rem;
    }
  }

  .text {
    width: 25%;
    margin-right: 1rem;
    font-size: 13px;
    font-weight: bold;
    text-align: right;
  }
}

.search-box {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: 0 auto 0.5rem auto;
  padding: 0 0.625rem;
  background-color: #eff0f1;
  height: 30px;
  line-height: 30px;
  border-radius: 0.875rem;

  form {
    flex: 1;
  }

  input {
    width: 95%;
    line-height: 28px;
    border: none;
    color: #333;
  }

  i {
    //   position: absolute;
    //   right: 1rem;
    flex: 0 0 1.5rem;
  }
}

.banner {
  width: 100%;
  height: 10.63rem;
  background: #868686;

  img {
    width: 100%;
    height: 10.63rem;
  }
}

.storeTitle {
  text-align: left;
  height: 3rem;
  display: flex;
  align-items: center;
  padding: 0 0.9rem;

  .iconfont {
    font-size: 1.22rem;
    color: #3d3d3d;
    padding: 0 0.2rem 0 0;
  }

  .text {
    color: #202020;
    font-size: 15px;
  }
}

.introduceTitle {
  color: #202020;
  font-size: 16px;
  padding: 1rem 0 0.5rem 0;
}

.detail {
  padding: 1rem;
  height: 88%;
  overflow-y: scroll;
}

.box {
  text-align: left;
  color: #202020;
  font-size: 15px;
  padding-bottom: 2.07rem;

  .icon-box {
    display: flex;
    align-items: center;
    padding-bottom: 0.89rem;

    .icon {
      width: 0.21rem;
      height: 1.07rem;
      background-color: #f26646;
    }

    .iconTitle {
      padding-left: 0.46rem;
    }
  }

  .explain {
    padding: 0 0.68rem;
    font-size: 15px;
  }

  .addr {
    padding-left: 0.68rem;
    font-size: 14px;
  }
}

#a_content {
  overflow-y: visible !important;
}
</style>
