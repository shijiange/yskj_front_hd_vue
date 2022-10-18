<template>
  <div id="detail">
    <c-title :hide="false" :text="plugin_name"></c-title>
    <!-- 定位 -->
    <div class="loaction">
      <i class="iconfont icon-bc_locate"></i>
      <div class="adress">
        <div class="userDetail">
          <span style="font-size: 0.94rem; margin-right: 0.5rem;" class="nickname">{{ info.nickname }}</span>
          <div class="memberPhone">
            {{ info.mobile }}
            <i class="iconfont icon-service_m"></i>
          </div>
        </div>
        <div class="userAdress">{{ info.address }}</div>
      </div>
      <div class="loc" @click.stop="goToAdress(info.latitude, info.longitude, info.address)">
        <span>{{ info.distance }}</span>
        <div class="line">|</div>
        <i class="iconfont icon-fontclass-daohang"></i>
      </div>
    </div>
    <!-- 定位end -->
    <!-- 门店信息 -->
    <div class="storeUser">
      <div class="storeleft">
        <div class="storeNmae">
          <i class="iconfont icon-dianpu1" style="color: #f15354;"></i>
          <span>{{ info.store_name }}</span>
        </div>
        <div class="storeAdress">
          <i class="iconfont icon-zx_map_locate1" style="color: #ff6b1b;"></i>
          <span>{{ info.store_address }}</span>
        </div>
      </div>
      <div class="storeRight" @click.stop="goToAdress(info.store_latitude, info.store_longitude, info.store_address)">
        <i class="iconfont icon-fontclass-weizhi"></i>
      </div>
    </div>
    <!-- 门店信息end -->
    <!-- 订单信息 -->
    <div class="orderDetail">
      <div class="detailTxt">
        <div class="txt">
          订单号: <span style="color: #000;">{{ info.order_sn }}</span>
        </div>
        <span style="color: #f15354; font-size: 1rem;">{{ info.state_name }}</span>
      </div>
      <div class="detailTxt">
        <span class="txt">订单类型：</span>
        <div style="display: flex;">
          {{ info.order_type_name }}
          <div class="pay-btn price" @click.stop="clickBotton(info.pay_code_button, info.order_id)" v-if="info.pay_code_button">{{ info.pay_code_button.name }}</div>
        </div>
      </div>
      <div class="detailTxt">
        <span class="txt">预约安装时间：</span><span>{{ info.reserve_time }}</span>
      </div>
      <div class="detailTxt">
        <span class="txt">服务费：</span><span class="price">{{ $i18n.t("money") }}{{ info.service_amount }}</span>
      </div>
      <div class="detailTxt">
        <span class="txt">买家留言：</span><span>{{ info.install_comment }}</span>
      </div>
    </div>
    <!-- 订单信息end -->
    <!-- 安装商品 -->
    <div class="installShop">
      <div class="shopTitle">安装商品</div>
      <div class="shopList" v-for="(item, index) in info.goods_list" :key="index">
        <div class="shoplis">
          <div class="imgbox">
            <img :src="item.thumb" alt="" />
          </div>
          <div class="shoptxt">{{ item.title }}</div>
        </div>
        <div class="total">数量：x{{ item.total }}</div>
      </div>
      <div class="severPrice">
        <div>
          安装服务费：<span style="color: #f15354;">{{ $i18n.t("money") }}{{ info.service_amount }}</span>
        </div>
        <div>
          订单实付金额：<span style="color: #f15354;">{{ $i18n.t("money") }}{{ info.price }}</span>
        </div>
      </div>
    </div>
    <!-- 安装商品end -->
    <!-- 待取货---接单时间 -->
    <div class="timebox">
      <div class="orderTime" v-if="info.worker_time">
        <span>接单时间</span>
        <span>{{ info.worker_time }}</span>
      </div>
      <div class="orderTime" v-if="info.take_time">
        <span>取货时间</span>
        <span>{{ info.take_time }}</span>
      </div>
      <div class="orderTime" v-if="info.install_start_time">
        <span>上门时间</span>
        <span>{{ info.install_start_time }}</span>
      </div>
      <div class="orderTime" v-if="info.finish_time">
        <span>完成时间</span>
        <span>{{ info.finish_time }}</span>
      </div>
    </div>
    <!-- 接单时间end -->
    <!-- 完成图片 -->
    <div class="imagebox">
      <div class="img" v-for="(item, index) in info.finish_image" :key="index" @click="imgPreview(info.finish_image)">
        <img :src="item" alt="" />
      </div>
    </div>
    <!-- 完成图片end -->
    <!-- 售后 -->
    <template v-if="!fun.isTextEmpty(info.refund_orders)">
      <div class="afterSale" v-for="item in info.refund_orders" :key="item.refund_id">
        <div class="saleTitle">
          <span>申请时间：{{ item.refund_time }}</span>
          <div class="saleStatus" v-for="botton in item.button_group" :key="botton.code" @click.stop="clickBotton(botton, item.refund_id)">{{ botton.name }}</div>
        </div>
        <div class="shopList">
          <div class="shoplis">
            <div class="imgbox">
              <img :src="item.thumb" alt="" />
            </div>
            <div class="shoptxt">{{ item.title }}</div>
          </div>
        </div>
        <div style="text-align: left; margin-bottom: 0.78rem;">售后原因</div>
        <div style="text-align: left;">{{ item.refund_reason }}</div>
        <div class="imagebox" style="padding: 0;">
          <div class="img" v-for="(imgs, index) in item.refund_image" :key="index" @click="imgPreview(item.refund_image)">
            <img :src="imgs" alt="" />
          </div>
        </div>
      </div>
    </template>
    <!-- 售后end -->
    <div style="width: 100%; height: 6rem;"></div>

    <div class="posBtn set-pc-styleLeft">
      <div class="btn" @click.stop="clickBotton(btn, info.order_id)" v-for="btn in info.button_group" :key="btn.code">{{ btn.name }}</div>
    </div>
    <van-popup v-model="codeShow" :style="{}" round="true">
      <div class="codeBox">
        <van-icon name="cross" @click="codeShow = false" />
        <div>{{ codetext }}</div>
        <div class="codeIn">
          <img :src="codeImg" alt="" />
        </div>
      </div>
    </van-popup>
    <van-popup v-model="finishImgPop" position="bottom" round="true" closeable>
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
import detail_controller from "./detail_controller";

export default detail_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#detail {
  // 定位
  .loaction {
    width: 100%;
    height: 3.81rem;
    background-color: #fff;
    display: flex;
    padding: 0 0.875rem;
    align-items: center;

    .icon-bc_locate {
      font-size: 1.3rem;
    }

    .adress {
      text-align: left;
      flex: 1;
      overflow: hidden;

      .userDetail {
        display: flex;
        align-items: center;
        font-size: 0.81rem;
        color: #333;

        .nickname {
          max-width: 8rem;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }

        i {
          color: #ff6b1b;
        }

        .memberPhone {
          margin-right: 0.5rem;
        }
      }

      .userAdress {
        font-size: 0.69rem;
        color: #333;
      }
    }

    .loc {
      display: flex;
      align-items: center;

      span {
        font-size: 0.69rem;
        color: #ff6b1b;
      }

      .line {
        margin-left: 0.41rem;
        margin-right: 0.44rem;
        color: #ff6b1b;
      }

      .icon-fontclass-daohang {
        color: #ff6b1b;
      }
    }
  }
  // 定位end
  // 门店信息
  .storeUser {
    margin-top: 0.63rem;
    padding-left: 0.94rem;
    padding-right: 0.91rem;
    width: 100%;
    height: 3.81rem;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    .storeRight {
      color: #ff6b1b;
    }

    .storeleft {
      display: flex;
      flex-direction: column;

      i {
        margin-right: 0.5rem;
      }

      .storeNmae {
        display: flex;
        justify-content: flex-start;
      }

      .storeAdress {
        display: flex;
        justify-content: flex-start;
      }
    }
  }
  // end
  // 订单信息
  .orderDetail {
    margin-top: 0.63rem;
    background-color: #fff;
    padding-top: 0.8rem;
    padding-left: 0.94rem;
    padding-right: 0.63rem;
    padding-bottom: 0.88rem;
    box-sizing: border-box;

    .detailTxt {
      text-align: left;
      font-size: 0.88rem;
      margin-bottom: 0.7rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .txt {
        color: #999;
      }

      .pay-btn {
        height: 1.25rem;
        line-height: 1.25rem;
        font-size: 12px;
        padding: 0 0.5rem;
        border: 1px solid #f15354;
        border-radius: 4px;
        margin-left: 0.75rem;
        font-weight: bold;
      }

      .price {
        color: #f15354;
      }
    }

    .detailTxt:last-child {
      margin-bottom: 0;
    }
  }
  // 订单信息end
  // 安装商品
  .installShop {
    margin-top: 0.63rem;
    background-color: #fff;
    padding: 0.78rem 0.88rem 0.94rem 0.94rem;
    box-sizing: border-box;

    .shopTitle {
      text-align: left;
      font-size: 0.94rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #f2f2f2;
    }
    // .shopList:last-child{
    //   border-bottom: 1px solid #f2f2f2;
    // }
    .shopList {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.66rem 0 0 0;
      margin-bottom: 0.94rem;

      .shoplis {
        width: 80%;
        display: flex;
        align-items: center;

        .imgbox {
          width: 2.5rem;
          height: 2.5rem;
          background-color: #c3c3c3;
          margin-right: 0.47rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .shoptxt {
          flex: 1;
          font-size: 0.88rem;
          text-align: left;
        }
      }

      .total {
        color: #202020;
        font-size: 0.69rem;
      }
    }

    .severPrice {
      text-align: right;
      border-top: 1px solid #f2f2f2;
      padding-top: 0.91rem;
      overflow: hidden;
      font-size: 0.94rem;
    }
  }
  // 抢单按钮
  .posBtn {
    width: 100%;
    height: 2.75rem;
    position: fixed;
    bottom: 0.91rem;

    .btn {
      width: 21.56rem;
      height: 2.75rem;
      background-color: #f15354;
      border-radius: 0.31rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      margin: 0 auto;
    }
  }
  // 待取货---接单时间
  .timebox {
    padding: 1rem 1rem;
    background: #fff;
    margin-top: 0.63rem;

    .orderTime:last-child {
      margin-bottom: 0;
    }

    .orderTime {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.6rem;

      span {
        font-size: 0.94rem;
        color: #333;
      }
    }
  }
  // 完成图片
  .imagebox {
    background: #fff;
    padding: 0.94rem 0.94rem;
    padding-top: 0;
    display: flex;
    flex-wrap: wrap;

    .img {
      width: 4.59rem;
      height: 4.59rem;
      background-color: #929292;
      border-radius: 0.31rem;
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;

      img {
        width: 4.59rem;
        height: 4.59rem;
        background-color: #929292;
        border-radius: 0.31rem;
      }
    }
  }
  // 售后
  .afterSale {
    margin-top: 0.63rem;
    background: #fff;
    padding: 0.78rem 0.88rem 0.94rem 0.94rem;

    .saleTitle {
      padding-bottom: 0.63rem;
      border-bottom: 1px solid #f2f2f2;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .saleStatus {
        padding: 0.31rem 0.47rem;
        border: solid 0.03rem #f15354;
        border-radius: 0.13rem;
        font-size: 0.63rem;
        color: #f15354;
      }
    }

    .shopList {
      display: flex;
      align-items: center;
      padding: 0.66rem 0 0 0;

      .shoplis {
        display: flex;
        align-items: center;
        margin-bottom: 0.94rem;

        .imgbox {
          width: 2.5rem;
          height: 2.5rem;
          background-color: #c3c3c3;
          margin-right: 0.47rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .shoptxt {
          flex: 1;
          font-size: 0.88rem;
          text-align: left;
        }
      }

      .total {
        color: #202020;
        font-size: 0.69rem;
      }
    }
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
