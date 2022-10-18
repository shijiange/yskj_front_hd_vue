<template>
  <div id="power_cabin">
    <c-title :hide="false"
             text='能量舱'></c-title>
    <div class="avator">
      <div class="left">
        <img :src="member.avatar_image">
      </div>
      <div class="right">
        <div>
          {{member.nickname}}
        </div>
      </div>
    </div>
    <div class="line">

    </div>
    <div class="content">
      <div class="member-card" @click="toMember">
        <div class="title">
          会员卡
        </div>
        <div class="card">
          <i class="iconfont icon-energetank_vipcard"></i>
        </div>
        <i class="iconfont icon-advertise-next"></i>
      </div>
      <!-- <div class="check-record" >
        <div class="title">
          检测记录
        </div>
        <div class="card">
          <i class="iconfont icon-energetank_record"></i>
        </div>
        <i class="iconfont icon-advertise-next"></i>
      </div> -->
    </div>
  </div>
</template>

<script>
import power_cabin_controller from './power_cabin_controller';
export default power_cabin_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#power_cabin {
  height: 100vh;
  background-color: #fff;

  .avator {
    padding-left: 1.375rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    display: flex;

    .left {
      box-sizing: border-box;
      width: 4rem;
      height: 4rem;
      border-radius: 50%;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .right {
      flex: 1;
      margin-left: 1rem;
      flex-direction: column;
      align-items: baseline;
      justify-content: center;
      display: flex;
    }
  }

  .line {
    height: 0.625rem;
    background-color: #f5f7fa;
  }

  .content {
    padding-top: 1.25rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    display: flex;
    background-color: #fff;

    .member-card {
      position: relative;
      width: 47.5%;
      margin-right: 5%;
      box-sizing: border-box;
      background-image: url(../../assets/images/energetank_bg1@2x.png);
      height: 6.25rem;
      border-radius: 0.625rem;
      background-size: cover;
      padding-left: 1rem;

      .title {
        padding-top: 1rem;
        color: #fff;
        font-size: 18px;
        text-align: left;
      }

      .card {
        margin-top: 1.625rem;
        text-align: left;

        i {
          font-size: 22px;
          color: #fff;
        }
      }

      .icon-advertise-next {
        font-size: 22px;
        color: #fff;
        bottom: 0.5rem;
        right: 0.5rem;
        position: absolute;
      }
    }

    .check-record {
      position: relative;
      width: 47.5%;
      box-sizing: border-box;
      background-image: url(../../assets/images/energetank_bg2@2x.png);
      height: 6.25rem;
      border-radius: 0.625rem;
      background-size: cover;
      padding-left: 1rem;

      .title {
        padding-top: 1rem;
        color: #fff;
        font-size: 18px;
        text-align: left;
      }

      .card {
        margin-top: 1.625rem;
        text-align: left;

        i {
          font-size: 22px;
          color: #fff;
        }
      }

      .icon-advertise-next {
        font-size: 22px;
        color: #fff;
        bottom: 0.5rem;
        right: 0.5rem;
        position: absolute;
      }
    }
  }
}
</style>
