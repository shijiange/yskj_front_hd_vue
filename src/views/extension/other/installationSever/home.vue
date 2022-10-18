<template>
  <div id="home">
    <c-title :hide="false" :text="plugin_name"></c-title>

    <van-tabs v-model="activeName" @click="handleClick" swipe-threshold="4" sticky :ellipsis="false" swipeable>
      <van-tab :title="items.name" v-for="(items, ind) in titleArr" :key="ind">
        <div class="location" v-if="routeName == 'installationSeverHome'">
          <div class="leftIcon">
            <i class="iconfont icon-zx_map_locate2"></i>
            {{ location.address ? location.address : "正在获取定位..." }}
          </div>
          <i class="iconfont icon-member_right" @click.stop="showLocation = true"></i>
        </div>
        <ul class="content" v-if="dataList[ind] && !fun.isTextEmpty(dataList[ind].list)">
          <li v-for="(item, index) in dataList[ind].list" :key="index" @click.stop="gotoDetail(item.order_id)">
            <!-- 抢单内容 -->
            <div class="grab">
              <div class="allOrderIds">
                <span style="color: #999;">订单号：{{ item.order_sn }}</span>
                <span>{{ item.state_name }}</span>
              </div>
              <div class="masterUser" v-if="routeName == 'installationSeverHome'">
                <div class="masterLeft">
                  <div class="imgbox"><img :src="item.avatar" alt="" /></div>
                  <div class="userDetail">
                    <span style="font-size: 0.94rem;">{{ item.nickname }}</span>
                    <div class="memberPhone">
                      <template v-if="activeName != 0">
                        <a :href="`tel:${item.mobile}`">
                          {{ item.mobile || "---" }}
                          <i class="iconfont icon-service_m"></i>
                        </a>
                      </template>
                      <template v-else>{{ item.mobile || "---" }} <i class="iconfont icon-service_m"></i></template>
                    </div>
                  </div>
                </div>
                <div class="masterRight">{{ item.distance }}</div>
              </div>
              <div class="locationGrab" v-if="routeName == 'installationSeverHome'">
                <div class="locationLeft">
                  <i class="iconfont icon-icon_location"></i>
                  <span class="locationName">{{ item.address }}</span>
                </div>
                <i v-if="Number(item.latitude)" class="iconfont icon-zx_map_local" @click.stop="goToAdress(item.latitude, item.longitude, item.address)"></i>
              </div>
              <div class="shopBox">
                <div class="shopTitle">预约安装时间：{{ item.reserve_time }}</div>
                <template v-if="routeName == 'installationSeverHome'">
                  <div class="shoplist">
                    <!-- 师傅端 -->
                    <div style="display: flex; align-items: center;">
                      <div class="image">
                        <img :src="item.goods_list && item.goods_list[0].thumb ? item.goods_list[0].thumb : ''" alt="" />
                      </div>
                      <span style="margin-left: 0.5rem; font-size: 0.81rem;">共{{ item.goods_count }}件</span>
                    </div>
                    <span style="font-size: 0.75rem;"> 服务费：{{ $i18n.t("money") }}{{ item.service_amount }} </span>
                  </div>
                </template>
                <template v-else>
                  <!-- 客户端 -->
                  <div class="shoplist" v-for="good in item.goods_list" :key="good.goods_id">
                    <!-- 师傅端 -->
                    <div style="display: flex; align-items: center; flex: 1;">
                      <div class="image">
                        <img :src="good.thumb" alt="" />
                      </div>
                      <span style="margin-left: 0.5rem; font-size: 0.81rem;" class="good-title">{{ good.title }}</span>
                    </div>
                    <span style="font-size: 0.75rem;"> 数量：x{{ good.total }} </span>
                  </div>
                </template>
              </div>
              <!-- 订单按钮 -->
              <div class="allOrder">
                <div class="allItem" @click.stop="clickBotton(bottons, item.order_id)" :class="{ rob: bottons.code == 'workerChoose' }" v-for="bottons in item.button_group" :key="bottons.code">
                  {{ bottons.name }}
                </div>
              </div>
            </div>
          </li>
        </ul>
        <template v-if="routeName != 'installationSeverHome' || !fun.isTextEmpty(location.point)">
          <yz-blank :datas="dataList[ind].list" text="暂无数据"></yz-blank>
        </template>
      </van-tab>
    </van-tabs>

    <!-- end -->
    <van-popup v-model="codeShow" :style="{}" :round="true">
      <div class="codeBox">
        <van-icon name="cross" @click="codeShow = false" />
        <div>{{ codetext }}</div>
        <div class="codeIn">
          <img :src="codeImg" alt="" />
        </div>
      </div>
    </van-popup>
    <van-popup v-model="finishImgPop" position="bottom" :round="true" closeable>
      <div class="finishImgPop-box">
        <div class="finishImgPop-title">请上传安装完成图片</div>
        <yz_uploader v-model="fileList1"></yz_uploader>
        <div class="finishImgPop-btn" @click.stop="finishInstall">完成</div>
      </div>
    </van-popup>
    <location v-model="showLocation" v-on:confirm="confirmLocation"></location>
  </div>
</template>
<script>
import home_controller from "./home_controller";

export default home_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.content {
  li {
    margin-bottom: 0.875rem;
  }
}

.grab {
  background-color: #fff;
  padding-top: 0.69rem;
  padding-left: 0.94rem;
  padding-right: 1rem;
  padding-bottom: 0.72rem;

  .orderIds {
    font-size: 0.69rem;
    color: #999;
    text-align: left;
    margin-bottom: 0.97rem;
  }

  .allOrderIds {
    font-size: 0.69rem;
    margin-bottom: 0.97rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #f15354;
  }

  .masterUser {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .masterLeft {
      display: flex;

      .imgbox {
        width: 2.06rem;
        height: 2.06rem;
        background-color: #fac337;
        border-radius: 100%;
        margin-right: 0.56rem;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .userDetail {
        text-align: left;

        .icon-service_m {
          color: #ff6b1b;
        }

        .memberPhone {
          font-size: 0.75rem;
          color: #333;
        }
      }
    }

    .masterRight {
      font-size: 0.75rem;
      color: #999;
    }
  }

  .locationGrab {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
    margin-bottom: 0.91rem;

    .locationLeft {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;

      .icon-icon_location {
        color: #ff6b1b;
      }

      .locationName {
        font-size: 0.81rem;
      }
    }

    .icon-zx_map_local {
      color: #ff6b1b;
      padding-left: 0.875rem;
      text-align: right;
    }
  }

  .shopBox {
    background-color: #f5f5f5;
    border-radius: 0.31rem;
    // height: 5.19rem;
    width: 100%;
    padding: 0.53rem 0.5rem 0.5rem 0.5rem;

    .shopTitle {
      font-size: 0.81rem;
      color: #ff6b1b;
      text-align: left;
      margin-bottom: 0.5rem;
    }

    .shoplist {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .image {
        width: 2.81rem;
        height: 2.81rem;
        background-color: #c3c3c3;
        border-radius: 0.375rem;
        overflow: hidden;
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .good-title {
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        margin-right: 0.5rem;
      }
    }
  }
  // 抢单大厅
  .rob {
    width: 90%;
    height: 2.19rem !important;
    background-color: #f15354;
    border-radius: 0.31rem;
    font-size: 0.94rem;
    color: #fff;
    margin: 0 auto !important;
    line-height: 2.19rem;
  }

  .allOrder {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 1.13rem;

    .allItem {
      padding: 0 0.5rem;
      height: 1.88rem;
      background-color: #f15354;
      border-radius: 0.31rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      margin-right: 0.63rem;
    }

    .allItem:last-child {
      margin-right: 0;
    }
  }
}

.location {
  line-height: 1.375rem;
  padding: 0.5rem 0;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f2f2f2;
  color: #666;
  font-size: 0.81rem;
  padding-left: 0.94rem;
  box-sizing: border-box;

  .icon-member_right {
    padding: 0.25rem 0.875rem 0.25rem 0.375rem;
    color: #797979;
  }
}

.codeBox {
  width: 15rem;
  height: 15rem;
  background-color: #fff;
  border-radius: 0.31rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  i {
    position: absolute;
    top: 0.875rem;
    right: 0.875rem;
    font-size: 20px;
  }

  .codeIn {
    width: 12rem;
    height: 12rem;
    background-color: #929292;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}

.finishImgPop-box {
  .finishImgPop-title {
    height: 3.5rem;
    line-height: 3.5rem;
    font-size: 16px;
  }

  .finishImgPop-btn {
    width: 90%;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    background-color: #f15354;
    color: #fff;
    margin: 0.875rem auto;
    border-radius: 0.375rem;
    font-size: 20px;
  }
}
</style>
