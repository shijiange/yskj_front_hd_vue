<template>
  <div id="packages-container">
    <c-title :hide="false" text="多包裹发货"></c-title>
    <div class="top-title">
      共有<i class="num">{{ packagesList.count }}</i
      >个包裹
    </div>
    <ul class="packpage-list">
      <li class="item" v-for="(item, index) in packagesList.data" :key="index" @click="toLogistics(item)">
        <div class="expressage">
          <span>{{ item.company_name }}</span>
          <i>{{ item.express_sn }}</i>
        </div>
        <div style="display:flex;">
          <div class="img-box">
            <img :src="item.thumb" alt="" />
            <!-- 图片的遮盖层 -->
            <span class="mark">共{{ item.count }}件</span>
          </div>
          <div class="logistics">
            <p class="status">{{ item.status_name }}</p>
            <p class="city">{{ item.last_express_context }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import multiple_packages_controller from "./multiple_packages_controller";
export default multiple_packages_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#packages-container {
  .top-title {
    width: 23.4375rem;
    height: 3rem;
    line-height: 3rem;
    text-align: left;
    padding-left: 1rem;
    font-size: 1rem;
    color: #0c0d0e;
    background-color: #fff;

    .num {
      color: #f69f9f;
    }
  }

  .packpage-list {
    .item {
      margin: 0.625rem 0.9375rem 0 0.9375rem;
      padding: 0.75rem;
      width: 21.5625rem;
      // height: 7.75rem;
      border-radius: 0.625rem;
      background-color: #fff;
      overflow: hidden; //解决共用外边距
    }

    .expressage {
      text-align: left;

      span {
        margin-right: 0.625rem;
      }
    }

    .img-box {
      // float: left;
      margin-top: 1.2188rem;
      width: 4.0938rem;
      height: 4.0938rem;
      border-radius: 0.3125rem;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }

      .mark {
        position: relative;
        display: inline-block;
        top: -1.1rem;
        width: 100%;
        height: 1.0313rem;
        line-height: 1.0313rem;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.6);
      }
    }

    .logistics {
      margin-top: 1.2188rem;
      margin-left: 0.9375rem;
      // float: left;
      text-align: left;
      flex: 1;
    }

    .status {
      color: #f79f9f;
      font-size: 0.9688rem;
    }

    .city {
      width: 14rem;
      font-size: 0.8438rem;
      margin-top: 1.2rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
