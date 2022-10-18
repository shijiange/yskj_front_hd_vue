<template>
  <div id="store_verification">
    <c-title :text="projectName + '列表'"></c-title>
    <div class="search_box">
      <ul class="search">
        <li class="left" @click.stop="tolocation">
          <i class="iconfont icon-order_locate"></i>
          <span class="address_name">{{ address || "全国" }}</span>
          <van-icon name="arrow-down" class="down" />
        </li>
        <li class="right" @click="btnSearch">
          <i class="iconfont icon-sousuo"></i>
          <input class="search_input" type="search" v-model="searchVal" :placeholder="'搜索' + projectName" />
        </li>
      </ul>
    </div>
    <!-- 轮播 -->
    <van-swipe touchable indicator-color="rgba(255,255,255,0)" centeredSlides="true">
      <div v-for="item in carousels" :key="item.id">
        <a :href="item.link ? item.link : 'javascript:;'">
          <van-swipe-item>
            <div class="store">
              <div class="top">
                <img :src="item.thumb" alt="" />
              </div>
            </div>
          </van-swipe-item>
        </a>
      </div>
    </van-swipe>

    <!-- 分类 -->
    <div class="project_type">
      <c-ment :datas="fun.chunk(project_category_list, 10)" :url="'CategoryProjectList'"></c-ment>
      <!--<div class="detail" v-for="item in project_category_list" :key="item.id" @click="btnCategory(item.id)">-->
        <!--<div><img :src="item.thumb" alt="" /></div>-->
        <!--<span class="short_video">{{ item.name }}</span>-->
      <!--</div>-->
    </div>

    <!-- 推荐 -->
    <div class="recommed_project" v-if="projects.length > 0">
      <div class="title">
        <span class="line"></span>
        <span class="recommed_project_name">推荐{{ projectName }}</span>
      </div>
      <div class="detail">
        <div class="more_project" v-for="item in projects" :key="item.id" @click="btnDetail(item.id)">
          <img :src="item.thumb" alt="" />
          <div class="about">
            <span class="distance"><i class="iconfont icon-order_locate"></i> {{ item.store_distance }}{{ item.store_distance_unit }}</span>
            <span class="date"><i class="iconfont icon-fontclass-qixian"></i> {{ item.period }}</span>
          </div>
          <span class="name">{{ item.title }}</span>
        </div>
      </div>
    </div>

    <!-- 附近 -->
    <div class="nearby_project">
      <div class="title" v-if="projects.length > 0">
        <span class="line"></span>
        <span class="neary_project">附近{{ projectName }}</span>
      </div>
      <nearbyProjectCard :btnDetail="btnDetail" :nearyData="nearyData" :finished="finished" :loading="loading" :getNearyData="getNearyData"></nearbyProjectCard>
    </div>

    <serviceCard></serviceCard>
  </div>
</template>

<script>
import project_list_controller from "./project_list_controller";

export default project_list_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.store {
  background: #fff;

  .top {
    display: flex;
    text-align: left;
    padding: 0.5rem 0.82rem;

    img {
      width: 100%;
      height: 8.5rem;
      border-radius: 0 0 0.47rem 0.47rem;
    }
  }
}

.project_type {
  background: #fff;
  display: flex;
  flex-wrap: wrap;
  padding-left: 0.6rem;

  .detail {
    width: 15%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0.5rem;

    img {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
    }

    .short_video {
      margin-top: 0.3rem;
      font-size: 12px;
    }
  }
}

.recommed_project {
  text-align: left;
  padding: 0 0.5rem 1rem 0.5rem;
  background: #fff;

  .title {
    display: flex;
    padding: 1rem 0;
    align-items: center;

    .line {
      width: 0.14rem;
      height: 0.93rem;
      background-color: #ce811d;
      border-radius: 0.07rem;
      margin-right: 0.5rem;
    }

    .recommed_project_name {
      font-weight: bold;
    }
  }

  .detail {
    width: 100%;
    display: flex;
    overflow: hidden;
    overflow-x: scroll;

    .more_project {
      display: flex;
      flex-direction: column;
      width: 15.36rem;
      background-color: #fff;
      box-shadow: 0 0.04rem 0.46rem 0 #eaeaea;
      border-radius: 0.71rem;
      margin: 0.2rem 0.75rem 0.2rem 0.2rem;

      img {
        width: 15.36rem;
        height: 7.29rem;
        margin: 0;
        border-radius: 0.54rem;
      }

      .about {
        color: #ce811d;
        margin: 0.52rem 5rem 0.52rem 0.79rem;
        display: flex;
        justify-content: space-between;
      }

      .name {
        margin: 0 0.79rem 0.75rem 0.79rem;
        color: #333;
        font-weight: bold;
        font-size: 14px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
  }
}

.nearby_project {
  text-align: left;

  .title {
    display: flex;
    background: #fff;
    padding-left: 0.5rem;
    align-items: center;

    .line {
      width: 0.14rem;
      height: 0.93rem;
      background-color: #ce811d;
      border-radius: 0.07rem;
      margin-right: 0.5rem;
      display: block;
    }

    .neary_project {
      font-weight: bold;
    }
  }
}

.suspension {
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 10%;
  transform: translateX(10rem);
  right: 50%;

  img {
    width: 2.5rem;
    height: 2.5rem;
    margin-bottom: 1.21rem;
  }
}

.search_box {
  width: 100%;
  padding: 0.5rem 0;
  background: #fff;

  .search {
    width: 100%;
    height: 1.75rem;
    line-height: 2.75rem;
    display: flex;
    align-items: center;
    padding: 0.875rem;
    background: #fff;

    .left {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;

      .icon-order_locate {
        position: relative;
        color: #303030;
      }

      .address_name {
        display: block;
        margin-left: 0.25rem;
        max-width: 6.28rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #333;
      }

      .down {
        margin-right: 0.5rem;
      }
    }

    .right {
      width: 12rem;
      height: 2.14rem;
      background: #f5f5f5;
      display: flex;
      line-height: 1.875rem;
      border-radius: 0.94rem;
      padding: 0 0.625rem;
      font-size: 14px;
      justify-content: center;
      align-items: center;

      .icon-sousuo {
        color: #999;
        margin-right: 0.3rem;
        font-size: 20px;
      }

      .search_input {
        border: none;
        width: 100%;
      }
    }
  }
}
</style>
