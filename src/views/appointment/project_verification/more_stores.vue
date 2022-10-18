<template>
  <div id="store_verification">
    <c-title text='适用商户'></c-title>
    <div class="top">
      <div class="project_description" :style="{'background-image':(name?'':'linear-gradient(90deg, #ffebd2 0%, #fbc889 100%)')}">
        <img :src="project.thumb ? project.thumb : project.project_thumb" alt="" />
        <div class="middle">
          <span class="project_name" :style="{color:(name?'#333333':'#874e02')}" >{{ project.title ? project.title : project.project_title }}</span>
          <div class="num" v-if="name">
            <span>总次数：{{ project.total_count ? project.total_count : "" }}</span>
            <span>已使用：{{ project.used_count ? project.used_count : "" }}</span>
          </div>
          <span class="verification_name" v-if="name" :style="{ color: project.near_ending === 1 ? '#f14e4e' : '#3486d3' }">完成时间：{{ project.end_time ? project.end_time : "" }}</span>
        </div>
        <div class="rigth" v-if="name">
          <div>
            <span class="num">{{ project.rest_count ? project.rest_count : "0" }}</span
            >次
          </div>
          <span class="verification_num">未使用</span>
        </div>
      </div>
      <div class="write_off_use"><span class="use_detail" v-if="name" @click="btnUsere(project)">核销使用</span></div>
    </div>
    <div class="write_off_stores">
      <div class="top">
        <span class="line"></span>
        <span class="service_store">该{{ projectName }}附近可核销商户</span>
      </div>
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="getStoreList">
        <van-cell v-for="(item, key) in storeList" :key="key">
          <div class="store" style="display: flex; margin-bottom: 1.3rem;" @click="btnStore(item)">
            <div><img :src="item.thumb" alt="" /></div>
            <div class="store_detail">
              <span class="store_name">{{ item.store_name }}</span>
              <span class="date">营业时间:{{ item.business_hours_start }}-{{ item.business_hours_end }}</span>
              <div class="address">
                <div class="location">
                  <i class="iconfont icon-order_locate"></i>
                  <span class="address_name">{{ item.full_address }}</span>
                </div>
                <span>{{ item.store_distance }}{{ item.store_distance_unit }}</span>
              </div>
            </div>
          </div>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import more_stores_controller from "./more_stores_controller";

export default more_stores_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.top {
  background: #fff;
  padding-top: 0.5rem;

  .project_description {
    padding: 0.71rem 0.79rem;
    margin: 0.5rem 1rem 1rem 1rem;
    display: flex;
    align-items: center;
    border-radius: 0.54rem 0.54rem 0.71rem 0.54rem;

    img {
      width: 4.71rem;
      height: 4.71rem;
      border-radius: 0.36rem;
      margin: 0;
    }

    .middle {
      .project_name {
        font-size: 16px;
        margin: 0 0 0 0.61rem;
        text-align: left;
        font-weight: bold;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }

      .num {
        display: flex;
        margin: 0.3rem 0 0.3rem 0.61rem;
        color: #ce811d;
        justify-content: space-between;
      }

      .verification_name {
        display: flex;
        color: #f14e4e;
        margin: 0 0 0 0.61rem;
        font-size: 12px;
        text-align: left;
      }
    }

    .rigth {
      display: flex;
      flex-direction: column;

      .num {
        color: #ce811d;
        font-size: 26px;
      }

      .verification_num {
        color: #ce811d;
        width: 4.43rem;
      }
    }
  }

  .write_off_use {
    display: flex;
    justify-content: center;

    .use_detail {
      width: 80%;
      display: block;
      color: #fff;
      padding: 0.6rem 0;
      margin-bottom: 1rem;
      background-color: #ce811d;
      border-radius: 0.21rem;
    }
  }
}

.write_off_stores {
  display: flex;
  flex-direction: column;
  text-align: left;
  background: #fff;
  margin: 1rem 0;
  padding: 1rem;

  .van-cell {
    padding-left: 0;
    padding-bottom: 0;
  }

  .top {
    margin-bottom: 0.64rem;
    display: flex;
    align-items: center;

    .line {
      width: 0.2rem;
      height: 1.07rem;
      display: block;
      background-color: #ce811d;
      border-radius: 0.07rem;
      margin-right: 0.5rem;
    }

    .service_store {
      color: #202020;
      font-size: 18px;
    }
  }

  .store {
    display: flex;

    img {
      width: 5rem;
      height: 5rem;
      border-radius: 0.36rem;
      margin: 0;
    }

    .store_detail {
      width: 100%;
      display: flex;
      flex-direction: column;
      text-align: left;
      justify-content: space-between;
      margin-left: 1rem;

      .store_name {
        font-size: 16px;
        color: #202020;
        font-weight: bold;
      }

      .date {
        color: #666;
      }

      .address {
        display: flex;
        justify-content: space-between;

        .location {
          display: flex;
          width: 10rem;
          color: #ce811d;

          .address_name {
            // display: -webkit-box;
            // -webkit-box-orient: vertical;
            // -webkit-line-clamp: 1;
            // overflow: hidden;
            // word-break: break-all;
          }
        }
      }
    }
  }
}
</style>
