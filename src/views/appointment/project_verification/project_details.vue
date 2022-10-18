<template>
  <div id="store_verification">
    <c-title :text='projectName + "详情"'></c-title>
    <van-swipe :autoplay="3000" stop-propagation touchable style="height: 12rem;">
      <van-swipe-item v-for="(item, index) in projectList" :key="index">
        <img :src="item" style="height: 12rem; width: 100%;" />
      </van-swipe-item>
    </van-swipe>
    <div class="title">
      <span class="left">{{ project.title }}</span>
      <div class="rigth">
        <i class="iconfont icon-fenxiang"></i>
        <span @click="share">分享</span>
      </div>
    </div>
    <!-- <div class="service">
      <div class="top">
        <span class="line"></span>
        <span class="service_store">服务商户</span>
      </div>
      <span class="service_deatil">购买{{projectName}}套餐后，即可至服务商户核销使用！</span>
    </div>
    <div style="display: flex; overflow-x: scroll;">
      <span class="service_deatil">购买项目套餐后，即可至服务商户核销使用！</span>
    </div> -->
    <div  class="scroll-box">
      <div
        class="store"
        v-for="(item, index) in store.slice(0, 5)"
        :key="index"
        :style="{ width: store.length < 2 ? '100%' : '80%', 'margin-right': store.length < 2 ? '0' : '1rem' }"
        @click="btnStore(item)"
      >
        <div class="top">
          <img :src="item.thumb" alt="" />
          <div class="right">
            <span class="store_name">{{ item.store_name }}</span>
            <div class="store_detail">
              <div class="date"><span>营业时间:</span><span>{{ item.business_hours_start }}-{{ item.business_hours_end }}</span></div>
            </div>
          </div>
          <div class="icon_img">
            <span class="distance">{{ item.store_distance }}{{ item.store_distance_unit }}</span>
            <i class="iconfont icon-zx_map_local" style="font-size: 18px;"></i>
          </div>
        </div>
        <div class="location">
          <i class="iconfont icon-order_locate"></i>
          <span class="address_name">{{ item.full_address || "全国" }}</span>
        </div>
      </div>
      <div class="more_store" @click="btnMoreStore" v-if="isShow">
        <span>更多商户....</span>
      </div>
    </div>

    <div class="goods-list">

    </div>
    <div class="service">
      <div class="top">
        <span class="line"></span>
        <span class="service_store">限时团购</span>
      </div>
      <div class="package_products" v-for="item in goods" :key="item.id" @click="btnGoodsDeatil(item.id)">
        <div><img :src="item.thumb" alt="" /></div>
        <div class="right">
          <div class="right_top" >
            <span class="package_detail">{{ item.title }}</span>
          </div>
          <div class="sales_volume">销量: {{ item.show_sales }}</div>
          <div class="price">
            <span class="new_price">￥{{ item.price }}</span>
            <span class="old_price">原价:￥{{ item.market_price }}</span>
            <span class="buy-btn">抢购</span>
          </div>
        </div>
      </div>
    </div>

    <div class="project-content">
      <div class="content-title">项目详情</div>
      <div id="a_content" v-html="project.content"></div>
    </div>

    <serviceCard></serviceCard>
    <yz-wechat-share-img v-model="showWechatshar"></yz-wechat-share-img>
  </div>
</template>

<script>
import project_details_controller from "./project_details_controller";

export default project_details_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
}

#store_verification {
  .location {
    display: flex;
    background: #fff;
    padding: 0 0 0.79rem 1rem;
    align-items: center;

    .address_name {
      margin: 0 0.46rem 0 0.46rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
    }
  }

  .title {
    display: flex;
    padding: 1rem 0.82rem;
    background: #fff;

    .left {
      flex: 4;
      text-align: left;
      color: #333;
      font-size: 14px;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-right: 1.7rem;
    }

    .rigth {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-around;
      color: #5f5f5f;
      font-size: 14px;
    }
  }

  .service {
    display: flex;
    flex-direction: column;
    text-align: left;
    background: #fff;
    margin: 0.5rem 0;
    padding: 1rem;

    .top {
      margin-bottom: 0.64rem;
      display: flex;
      align-items: center;

      .line {
        width: 0.2rem;
        height: 0.8rem;
        display: block;
        background-color: #ce811d;
        border-radius: 0.07rem;
        margin-right: 0.5rem;
      }

      .service_store {
        color: #202020;
        font-size: 15px;
        font-weight: bold;
      }
    }

    .service_deatil {
      color: #575757;
      font-size: 12px;
    }
  }

  .scroll-box {
    display: flex;
    padding: 0.625rem 0;
    overflow-x: scroll;
  }

  .store {
    background: #fff;
    margin-right: 1rem;
    border-radius: 0.54rem;
    min-width: 80%;
    max-width: 80%;
    overflow: hidden;

    .top {
      display: flex;
      text-align: left;
      padding: 1rem 0.82rem;

      img {
        width: 3rem;
        height: 3rem;
        border-radius: 0.14rem;
        margin: 0 0.5rem 0 0;
      }

      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .store_name {
          color: #202020;
          font-size: 14px;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        .store_detail {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 9rem;
          .date {
            color: #666;
            font-size: 13px;
            display: flex;
            // flex-direction: column;
          }

          .distance {
            color: #ce811d;
            display: flex;
            height: 100%;
            align-items: flex-end;
          }

          i {
            font-size: 30px;
            color: #ce811d;
          }
        }
      }

      .icon_img {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: rgb(206, 129, 29);
        font-size: 13px;
        width: 6rem;
        i {
          font-size: 30px;
          color: #ce811d;
          margin-top: 5px;
        }
      }
    }

    .bottom {
      text-align: left;
      padding: 0 0.82rem 1rem 0.82rem;
    }
  }

  .more_store {
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    // height: 7.5rem;
    span {
      width: 16rem;
    }
  }

  .package_products {
    background: #fff;
    display: flex;
    // border-bottom: 1px solid #e7e0e0;
    padding: 1rem 0;

    img {
      width: 5rem;
      height: 5rem;
      border-radius: 0.14rem;
      margin-right: 0.5rem;
    }

    .right {
      display: flex;
      flex-direction: column;
      text-align: left;
      // padding: 0 0.82rem;
      justify-content: space-between;
      width: 100%;

      .right_top {
        display: flex;

        .package_detail {
          flex: 4;
          color: #202020;
          font-size: 14px;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .cart {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;

          .van-icon {
            font-size: 24px;
            color: #ce811d;
            font-weight: bold;
          }
        }
      }

      .sales_volume {
        color: #999999;
        font-size: 12px;
      }
      .price {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        .new_price {
          color: #f14e4e;
          font-size: 14px;
          font-weight: bold;
        }

        .old_price {
          color: #8b8b8b;
          text-decoration: line-through;
          font-size: 12px;
        }

        .buy-btn {
          font-size: 12px;
          color: #ffffff;
          padding: 0.3rem 1rem;
          background-color: #f14e4e;
          border-radius: 0.188rem;
        }
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

  .project-content {
    background: #fff;
    margin-top: 0.5rem;
    padding: 1rem;

    .content-title {
      position: relative;
      color: #b7b7b7;
      margin-bottom: 0.8rem;
      &::before{
        content: "";
        position: absolute;
        top: 50%;
        left: 3rem;
        width: 3rem;
        height: 1px;
        background-color: #b7b7b7;
      }
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        right: 3rem;
        width: 3rem;
        height: 1px;
        background-color: #b7b7b7;
      }
    }
  }
}
</style>
