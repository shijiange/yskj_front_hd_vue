<template>
  <div id="mine">
    <div class="header">
      <p class="font">我的</p>
      <div class="member">
        <div class="img-box">
          <img :src="mine.avatar" alt="">
        </div>
        <div class="right">
          <p class="name">{{mine.nickname}}</p>
          <p class="title">{{mine.level_name}}</p>
        </div>
      </div>
    </div>
    <ul class="list">
      <li @click="gotoUrl('ClientProject')">
        <div class="content">
          <div class="left">
            <img class="icon" src="../../assets/images/xiangmu@2x.png" alt="">
            <span>我的{{appointmentLang.project}}</span>
          </div>
        </div>
        <i class="iconfont icon-advertise-next"></i>
      </li>
      <li @click="gotoUrl('ClientAppointment')">
        <div class="content">
          <div class="left">
            <img class="icon" src="../../assets/images/yuyue@2x.png" alt="">
            <span>我的预约</span>
          </div>
        </div>
        <i class="iconfont icon-advertise-next"></i>
      </li>
      <li @click="gotoUrl('AppointmentProject',{name: 'store'})" v-if="mine.is_boss == 1">
        <div class="content">
          <div class="left">
            <img class="icon" src="../../assets/images/yuyue2@2x.png" alt="">
            <span>门店预约</span>
          </div>
        </div>
        <i class="iconfont icon-advertise-next"></i>
      </li>
      <li @click="gotoUrl('AppointmentProject')" v-if="mine.is_worker == 1">
        <div class="content">
          <div class="left">
            <img class="icon" src="../../assets/images/yuyue3@2x.png" alt="">
            <span>{{appointmentLang.worker}}预约</span>
          </div>
        </div>
        <i class="iconfont icon-advertise-next"></i>
      </li>
      <li @click="gotoUrl('StoresTechnician', {store_id: mine.store_id})" v-if="mine.is_boss == 1">
        <div class="content">
          <div class="left">
            <img class="icon" src="../../assets/images/shop_jishi@2x.png" alt="">
            <span>门店{{appointmentLang.worker}}</span>
          </div>
        </div>
        <i class="iconfont icon-advertise-next"></i>
      </li>
      <li @click="gotoUrl('extension')" v-if="mine.is_boss == 1">
        <div class="content">
          <div class="left">
            <img class="icon" src="../../assets/images/tixian@2x.png" alt="">
            <span>提现</span>
          </div>
        </div>
        <i class="iconfont icon-advertise-next"></i>
      </li>
      <li @click="gotoUrl('TechnicianWork', {worker_id: mine.worker_id})" v-if="mine.is_worker == 1 && mine.worker_time_type != 1">
        <div class="content">
          <div class="left">
            <img class="icon" src="../../assets/images/shijian@2x.png" alt="">
            <span>工作时间</span>
          </div>
        </div>
        <i class="iconfont icon-advertise-next"></i>
      </li>
    </ul>

    <div class="appointment-bottom" :style="{width: fun.getPhoneEnv() == 3 ? '375px': ''}">
      <div class="item">
        <router-link :to="fun.getUrl('Appointment')">
          <img src="../../assets/images/index-normal@2x.png" alt="">
          <p>首页</p>
        </router-link>
      </div>
      <div class="item">
        <router-link :to="fun.getUrl('ProjectList')">
        <img src="../../assets/images/project-normal@2x.png" alt="">
        <p>{{appointmentLang.project}}</p>
        </router-link>
      </div>
      <div class="item active">
        <router-link :to="fun.getUrl('AppointmentMine')">
        <img src="../../assets/images/my-active@2x.png" alt="">
        <p>我的</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import mine_controller from "./mine_controller";

export default mine_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .appointment-bottom {
    position: fixed;
    bottom: 0;
    display: flex;
    background-color: #fff;
    text-align: center;
    width: 100%;
    padding: 0.3rem 0;

    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      color: #ccc;

      img {
        width: 1.5rem;
        height: 1.5rem;
      }
    }

    .active {
      color: #f49f19;
    }
  }

  #mine {
    text-align: left;

    .header {
      padding: 1rem;
      background-color: #fff;
    }

    .font {
      font-size: 18px;
      font-weight: bold;
    }

    .member {
      display: flex;
      margin: 1rem 0 0 1rem;
    }

    .img-box {
      width: 3rem;
      height: 3rem;
      margin-right: 1rem;

      img {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .name {
        font-size: 18px;
        font-weight: bold;
      }

      .title {
        color: #f49f19;
      }
    }

    .list {
      margin-top: 0.5rem;
      padding: 0.5rem 1rem;
      background-color: #fff;

      li {
        display: flex;
        padding: 0.5rem 0;
        font-size: 16px;
      }
    }

    .content {
      flex: 1;
      display: flex;

      .left {
        width: 12rem;
        display: flex;
      }

      .icon {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 0.5rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      span {
        line-height: 1.5rem;
        flex: 1;
      }
    }

    .icon-advertise-next {
      align-self: center;
    }
  }
</style>
