<template>
  <div>
    <c-title :hide="false" :text="'应用市场'"> </c-title>
    <div style="height: 10px;"></div>

    <!--<p class="site-name" v-if="domain">域名：{{domain}}</p>-->
    <div class="after-sale-container" v-if="service_show==1">
      <div class="order-item after-sale">
        <div class="domain-name">域名：{{ current_domain }}</div>
        <div class="server-time">
          <div class="time-text">剩余售后服务时长 {{ remaining_time }}天</div>
          <div class="time-see" @click="getServiceDetails">查看></div>
        </div>
        <!-- <div class="see-more" v-if="false">查看更多></div> -->
      </div>
    </div>

    <div class="order-list">
      <div class="order-item" v-for="item in projectList" :key="item.id">
        <div class="head">
          <p style="font-weight: bold;">订单号：{{ item.order_sn }}</p>
          <p style="color: #8c8c8c;">{{ item.create_time }}</p>
        </div>
        <div style="text-align: left; margin: 5px 0;" v-if="item.has_market_product && item.has_market_product.domain">当前域名：{{ item.has_market_product.domain }}</div>
        <div class="content" v-for="good in item.has_many_order_goods" :key="good.id">
          <div class="left">
            <img :src="good.thumb" alt="" />
          </div>
          <div class="right">
            <p class="title van-multi-ellipsis--l2">{{ good.title }}</p>
            <div class="check-box">
              <p class="price">{{ $i18n.t("money") }}{{ good.price }}</p>
              <p class="check" @click="toShow(good, item)">查看插件></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="allLoad && projectList.length > 0">没有更多了~</div>

    <div class="blank" v-if="projectList.length <= 0">
      <img src="../../../assets/images/blank.png" />
      <span>暂无数据</span>
    </div>

    <van-popup v-model="PopupShow" round closeable position="bottom">
      <p class="popup-title">插件列表</p>
      <div class="popup-box">
        <p class="popup-item van-hairline--bottom" v-for="(item, index) in showList" :key="index">{{ item }}</p>
      </div>
    </van-popup>

    <!-- 后面取消了
      <van-popup v-model="domianShow" round closeable position="bottom">
      <p class="popup-title">域名</p>

      <div class="popup-box">
        <div class="order-item after-sale popup-after-sale-item" v-for="item in 5">
          <div class="domain-name">域名：dev123.yunzmail.com</div>
          <div class="server-time">
            <div class="time-text">剩余售后服务时长 30天</div>
            <div class="time-see">查看></div>
          </div>
        </div>
      </div>
    </van-popup> -->

    <van-popup v-model="serviceDetailsShow" round closeable position="center" :lock-scroll="false" style="min-width: 90%;">
      <p class="popup-title">售后服务时长明细</p>
      <div class="popup-box" ref="serviceContent" style="padding: 0 1rem; overflow: hidden;">
        <div>
          <div class="popup-service-item" v-for="item in service_listData" :key="item.id">
            <div class="service-info">
              <div class="service-desc">{{ item.type_name }}</div>
              <div class="service-num">{{ item.change_value }}</div>
            </div>
            <div class="service-time">{{ item.created_at }}</div>
          </div>
          <div v-if="service_allLoad && service_listData.length > 0" style="height: 2rem; display: flex; align-items: center; justify-content: center;">没有更多了~</div>
          <div v-if="service_listData.length == 0" style="height: 2rem; display: flex; align-items: center; justify-content: center;">暂无数据~</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import application_market_controller from "./application_market_controller";

export default application_market_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.site-name {
  padding: 1rem;
  text-align: left;
}

.order-list {
  margin: 0 1rem 1rem 1rem;
}

.order-item {
  padding: 0.5rem;
  background: #fff;
  border-radius: 10px;
  margin-bottom: 0.5rem;

  .head {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
  }
}

.after-sale-container {
  padding: 0 1rem;
}

.after-sale {
  text-align: left;

  .domain-name {
    color: #7c7c7c;
    font-size: 14px;
  }

  .server-time {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;

    .time-text {
      color: #7c7c7c;
      font-size: 14px;
    }

    .time-see {
      color: #f14e4e;
      font-size: 13px;
    }
  }

  .see-more {
    margin-top: 1rem;
    font-size: 13px;
    text-align: center;
    color: #f14e4e;
  }
}

.popup-after-sale-item {
  padding: 0.5rem 1rem 1rem;
  border-bottom: 1px solid #ececec;
}

.popup-service-item {
  display: flex;
  flex-direction: column;
  padding: 0.4rem 0.2rem 0.6rem;
  text-align: left;
  border-bottom: 1px solid #ececec;

  .service-info {
    display: flex;
    justify-content: space-between;
    color: #101010;
    font-size: 14px;
  }

  .service-time {
    margin-top: 5px;
    color: #101010;
    font-size: 12px;
  }
}

.content {
  display: flex;
  margin-top: 10px;

  .left {
    width: 4rem;
    height: 4rem;

    img {
      width: 4rem;
      height: 4rem;
    }
  }

  .right {
    flex: 1;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 5px;

    .check-box {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .check {
        color: #f14e4e;
      }
    }
  }
}

.popup-title {
  padding: 1rem;
  font-size: 18px;
  font-weight: bold;
}

.popup-box {
  height: 15rem;
  overflow-y: scroll;

  .popup-item {
    padding: 0.5rem;
  }
}
</style>
