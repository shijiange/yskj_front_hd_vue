<template>
  <div>
    <c-title :hide="false" :text="'我的'+appointmentLang.project" :url="'AppointmentMine'">
    </c-title>
    <van-tabs v-model="num" title-active-color="#f49f19" @click="selectTab" color="#f49f19">
      <van-tab title="可预约" name="0">
        <div class="blank"  v-if="projectList.length<=0">
          <img src="../../../assets/images/blank.png">
          <span>还没有记录哦</span>
        </div>
        <div class="project_list" v-for="item in projectList" :key="item.id">
          <div style="width: 5rem; height: 5rem; align-self: center;">
            <img :src="item.project_thumb" alt="">
          </div>

          <div class="list_title">
            <span class="title">{{item.project_title}}</span>
            <span>已预约{{item.used_count}}次&nbsp;&nbsp;可预约{{item.rest_count}}次</span>
            <span v-if="item.project_period_desc">截止使用日期：{{item.project_period_desc}}</span>
            <div class="list_button">
              <span class="list_pre" @click="toAppointment(item)">预约</span>
              <span class="list_cancle" @click="createQrc(item)">核销</span>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="已完成" name="1">
        <div class="blank"  v-if="projectList.length<=0">
          <img src="../../../assets/images/blank.png">
          <span>还没有记录哦</span>
        </div>

        <div class="project_list" v-for="item in projectList" :key="item.id">
          <div style="width: 5rem; height: 5rem;">
            <img :src="item.project_thumb" alt="">
          </div>

          <div class="list_title">
            <span class="title">{{item.project_title}}</span>
            <span>已预约{{item.used_count}}次</span>
            <span v-if="item.project_period_desc">{{item.project_period_desc}}</span>
          </div>
        </div>

      </van-tab>
    </van-tabs>

    <div class="qrcode" v-show="show">
      <i class="close" @click="show=false"></i>
      <canvas id="qrccode-canvas"></canvas>
      <div style="height: 1.875rem;">请核销员扫码</div>

    </div>
  </div>
</template>

<script>
import pproject_controller from "./project_controller";

export default pproject_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .pop-img {
    width: 14rem;
    height: 14rem;
    background-color: #fff;
    border-radius: 1.219rem;

    p {
      font-weight: bold;
      font-size: 16px;
      margin: 1rem 0;
    }

    .code {
      width: 9.313rem;
      height: 9.219rem;
      margin: 1rem auto;

      img {
        width: 9.313rem;
        height: 9.219rem;
      }
    }
  }

  .project_box {
    padding: 0 0.5rem;
    background: #fff;
  }

  .project_list {
    border-bottom: 1px solid #f5f5f5;
    display: flex;
    display: -webkit-flex;
    background: #fff;
    padding: 0.5rem;
  }

  .project_list img {
    width: 5rem;
    height: 5rem;
    border-radius: 5px;
  }

  .list_title {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    padding: 0.5rem;
    justify-content: space-between;
    text-align: left;
    line-height: 1.5rem;
  }

  .list_title .title {
    font-size: 1rem;
    color: #000;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .list_title span {
    font-size: 12px;
    color: #ccc;
  }

  .list_button span {
    color: #fff;
    padding: 0.1rem 1rem;
    border-radius: 1rem;
    font-size: 14px;
  }

  .list_pre {
    background: #f49f19;
    margin-right: 1rem;
  }

  .list_cancle {
    background: #8c96f8;
  }

  .show {
    display: block;
  }

  .hidden {
    display: none;
  }

  .qrcode {
    margin: 0 auto;
    position: fixed;
    z-index: 1000;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    width: 200px;
    padding-top: 0.5rem;
    border-radius: 20px;

    .close {
      width: 1.2rem;
      height: 1.2rem;
      position: absolute;
      top: -0.2rem;
      right: -0.2rem;
      background: url("../../../assets/images/close_iocn.png");
      background-size: 100%;
    }
  }
</style>
