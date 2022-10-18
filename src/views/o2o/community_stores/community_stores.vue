<template>
  <div class="communityStore">
    <c-title :hide="false" :text="store_title"></c-title>
    <div class="location-search">
      <div class="location" @click="tolocation">
        <i class="iconfont icon-dingwei"></i>
        <span class="title">{{ address || "未定位" }}</span>
      </div>
      <div class="search-box">
        <form @submit.prevent action="#">
          <input type="search" placeholder="搜索社区" @keypress="enterSearch" v-model.trim="search"/>
        </form>
        <i class="iconfont icon-all_search_2" @click.stop="searchStore"></i>
      </div>
    </div>
    <d-list @load="getCommunityStoreListByPosition" :finished="!isLoadMore" :loading="loading" :showStatusText="false">
      <div class="communityStore-box">
        <div class="communityStore-text" @click="chooseCommunityStore(item)" v-for="(item, i) in communityStoreList" :key="i">
          <div class="img">
            <img :src="item.logo_url"/>
          </div>
          <div class="text">
            <div class="communityStore-title">
              {{ item.name }}
            </div>
            <div class="text-bottom">
              <div class="left">{{item.distance + ""+ item.unit}}</div>
              <div class="sign">|</div>
              <div class="right">
                <i class="iconfont icon-fontclass-weizhi"></i>
                <div class="text">{{ item.province_name + "" + item.city_name + "" + item.district_name + "" +
                  item.street_name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </d-list>
    <div class="communityStore-box" v-if="communityStoreList <= 0">
      <van-empty description="暂无数据" />
    </div>
  </div>
</template>
<script>
import community_stores_controller from "./community_stores_controller";

export default community_stores_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .communityStore {
    background-color: #f2f2f2;

    .location-search {
      display: flex;
      height: 45px;
      line-height: 45px;
      padding-left: 0.96rem;
      padding-right: 1.07rem;
      align-items: center;

      .location {
        width: 40%;
        display: flex;
        font-size: 13px;
        line-height: 1.5rem;
        color: #333;
        margin-right: 0.5rem;

        .title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .search-box {
        position: relative;
        display: flex;
        justify-content: space-between;
        width: 90%;
        margin: 0 auto;
        padding: 0 0.625rem;
        background-color: #fff;
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
          flex: 0 0 1.5rem;
        }
      }
    }

    .communityStore-box {
      line-height: 1.71rem;
      padding: 0 1.07rem;
    }

    .communityStore-text {
      background-color: #fff;
      border-radius: 0.31rem;
      height: 7.5rem;
      display: flex;
      align-items: center;
      text-align: left;
      padding: 0.68rem 0 0.68rem 0.71rem;
      margin-bottom: 0.68rem;

      .img {
        min-width: 6.14rem;
        height: 6.14rem;
        background-color: #eee;
        border-radius: 0.31rem;
        margin-right: 0.64rem;

        img {
          width: 6.14rem;
          height: 6.14rem;
        }
      }

      .text {
        display: flex;
        flex: 1;
        flex-direction: column;
        height: 6.14rem;
        position: relative;

        .communityStore-title {
          color: #202020;
          padding-right: 1.2rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .text-bottom {
          display: flex;
          font-size: 12px;
          position: absolute;
          bottom: -0.5rem;
          max-width: 100%;
          padding-right: 1.18rem;

          .left {
            color: #f53939;
            font-size: 12px;
            text-align: left;
            flex: 0;
          }

          .sign {
            color: #a5a5a5;
            height: 0.64rem;
            padding: 0 0.54rem 0.3rem;
            flex: 0;
          }

          .right {
            display: flex;
            flex: 1;
            overflow: hidden;

            .iconfont {
              font-size: 12px;
              color: #6f6f6f;
              padding-right: 0.32rem;
            }

            .text {
              display: block;
              color: #666;
              height: 1.37rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 13px;
            }
          }
        }
      }
    }
  }
</style>
