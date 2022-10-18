<template>
  <div id="search_project">
    <c-title text='项目列表'></c-title>
    <div class="search_box">
      <van-search v-model="value" placeholder="项目" clearable @search="btnSearch" />
    </div>
    <d-list :loading="upgradeCodeLoading" :finished="upgradeCodeFinished" @load="getNearyData()">
      <div class="top" v-for="item in projectList" style="padding: 1.07rem; background: #fff;" :key="item.id" @click="btnDetail(item.id)">
        <img :src="item.thumb" alt="" />
        <div class="project">
          <span class="project_name">{{ item.title }}</span>
          <div class="detail">
            <div class="top">
              <span class="num">{{ item.total_sell_count }}</span>
              <span class="num_name">次</span>
            </div>
            <span class="bottom">累计销售</span>
          </div>
        </div>
        <div class="classification">
          <div class="left">{{ item.category_name }}</div>
          <div class="right">
            <span class="other store_num"><i class="iconfont  icon-fontclass-tuanduifenxiaoshang"></i>{{ item.store_count }}家</span>
            <span class="other distance"><i class="iconfont icon-order_locate"></i>{{ item.store_distance }}{{ item.store_distance_unit }}</span>
            <span class="other day"><i class="iconfont icon-fontclass-qixian"></i>{{ item.period }}</span>
          </div>
        </div>
        <span class="line" v-if="item.description"></span>
        <span class="project_brief">
          {{item.description}}
        </span>
      </div>
    </d-list>
  </div>
</template>

<script>
import search_project_controller from "./search_project_controller";

export default search_project_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#search_project {
  .search_box {
    background: #fff;
  }

  .top {
    background: #fff;
    margin-bottom: 0.5rem;

    img {
      width: 100%;
      height: 10.71rem;
      border-radius: 0.54rem;
    }

    .project {
      display: flex;
      text-align: left;
      justify-content: space-between;
      margin-top: 0.3rem;

      .project_name {
        flex: 4;
        font-size: 16px;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        height: 100%;
      }

      .detail {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .top {
          display: flex;
          align-items: center;
          padding: 0;

          .num {
            color: #ce811d;
            font-size: 16px;
          }

          .bottom {
            color: #9f9f9f;
          }
        }
      }
    }

    .classification {
      display: flex;
      justify-content: space-between;
      margin: 0.8rem 0;

      .left {
        color: #f14e4e;
      }

      .right {
        .other {
          margin-left: 1rem;
          color: #ce811d;
        }
      }
    }

    .line {
      display: block;
      width: 100%;
      height: 0.03rem;
      background-color: #f5f5f5;
      margin: 0.75rem 0;
    }

    .project_brief {
      display: flex;
      text-align: left;
    }
  }

  .search_box input {
    width: 100%;
  }
}

.search_box input {
  max-width: 100%;
}
</style>
