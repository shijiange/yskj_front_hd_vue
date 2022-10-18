<template>
  <div id="cloudOrderList">
    <c-title :hide="false" :text="'提货中心'"> </c-title>
    <div class="box">
      <div class="tabnav">
        <van-tabs v-model="active" @change="acr">
          <van-tab title="全部" name="1"></van-tab>
          <van-tab title="待发货" name="2"></van-tab>
          <van-tab title="待收货" name="3"></van-tab>
          <van-tab title="已完成" name="4"></van-tab>
        </van-tabs>
      </div>
      <div class="list" @click="tapDetail(item.id)" v-for="(item, index) in info" :key="index">
        <div class="top">
          <div class="top_left">
            <span>订单号：{{ item.order_sn }}</span>
            <div class="Status" v-if="item.dispatch_type_id == '8'">自提</div>
          </div>
          <div class="Status_o">{{ item.status_name }}</div>
        </div>
        <div v-for="(list, ind) in item.has_many_order_goods" :key="ind">
          <div class="centen">
            <div class="centen_left">
              <img :src="list.thumb" alt="" />
            </div>
            <div class="centen_right">
              <span>{{ list.title }}</span>
              <p>规格：{{ list.goods_option_title ? `${list.goods_option_title}，` : '' }}x{{ list.total }}</p>
            </div>
          </div>
          <div class="address">
            <p>
              <span v-if="item.dispatch_type_id == '8'">送货点：</span>{{ item.address.realname }}
              {{ item.address.mobile }}
            </p>
            <span>{{ item.address.address }}</span>
          </div>
        </div>
        <div class="hxBtn">
          <span
            :class="`btn_${lis.value}`"
            v-for="(lis, indd) in item.button_models"
            :key="indd"
            @click.stop="operation(lis, item)"
            >{{ lis.name }}</span
          >
          <!-- <span class="btn_a">确认核销</span> -->
          <!-- <span class="btn_a">删除订单</span> -->
        </div>
      </div>
    </div>
    <div class="qrcode">
      <van-popup v-model="showQrcode" position="right" modal="false">
        <div>
          <img :src="qrcode" style="width: 100%;" />
          <div style="height: 1.875rem;">请核销员扫码</div>
        </div>
      </van-popup>
    </div>

    <van-dialog
      @touchmove.native="stopmove"
      @mousemove.native="stopmove"
      v-model="dialogVisible"
      :showConfirmButton="false"
      style="hei"
    >
      <div class="title">确认发货</div>
      <van-tabs v-model="activeName">
        <van-tab name="first" title="快递配送"></van-tab>
        <van-tab name="second" v-if="isShowDri" title="司机配送"></van-tab>
      </van-tabs>
      <div>
      <!-- <mt-tab-container v-model="activeName"> -->
        <div v-show="activeName=='first'">
        <!-- <mt-tab-container-item id="first"> -->
          <section style="width: 100%; text-align: left; padding-bottom: 2.5rem; padding-top: 0.625rem;">
            <div style="width: 100%;" v-if="addresseeInfo && jurisdiction_set != 1">
              <div class="addressee">
                收件人信息:
              </div>
              <div>
                <div class="user_name">
                  <span>{{ addresseeInfo.realname }}</span>
                  <span>({{ addresseeInfo.mobile }})</span>
                </div>
                <div class="user_city">
                  {{ addresseeInfo.address }}
                </div>
              </div>
            </div>
            <div class="select_company">
              <div style="font-weight: bold; font-size: 15px;">快递公司:</div>
              <div class="company_right">
                <van-button plain type="primary" @click="seleRegional">
                  {{ regional }}
                </van-button>
              </div>
            </div>
            <div class="input_number">
              <div style="font-weight: bold; font-size: 15px;">快递单号:</div>
              <div class="number_right">
                <van-cell-group>
                  <van-field v-model="numberName" placeholder="请输入快递单号" />
                </van-cell-group>
              </div>
            </div>
          </section>
        <!-- </mt-tab-container-item> -->
        </div>
        <div v-show="activeName=='second'">
        <!-- <mt-tab-container-item id="second"> -->
          <section style="width: 100%; text-align: left; padding-bottom: 2.5rem; padding-top: 0.625rem;">
            <div style="width: 100%;" v-if="addresseeInfo">
              <div class="addressee">
                收件人信息:
              </div>
              <div>
                <div class="user_name">
                  <span>{{ addresseeInfo.realname }}</span>
                  <span>({{ addresseeInfo.mobile }})</span>
                </div>
                <div class="user_city">
                  {{ addresseeInfo.address }}
                </div>
              </div>
            </div>
            <div class="select_company" style="justify-content: flex-start;">
              <div style="font-weight: bold; font-size: 15px; width: 5rem;">
                配送司机:
              </div>
              <div class="company_right" style="text-align: left; margin-left: 0.5rem;">
                <van-button style="text-align: left;" plain type="primary" @click="driverSeleRegional">
                  {{ driverRegional }}
                </van-button>
              </div>
            </div>
            <div class="select_company" style="justify-content: flex-start;">
              <div style="font-weight: bold; font-size: 15px; width: 5rem;">
                车牌号:
              </div>
              <div class="company_right" style="text-align: left; margin-left: 0.5rem;">
                {{ driverNumber }}
              </div>
            </div>
          </section>
        <!-- </mt-tab-container-item> -->
        </div>
      <!-- </mt-tab-container> -->
      </div>
      <div class="store_foot">
        <van-button type="default" class="btn_a" @click="sendCancel">取 消</van-button>
        <van-button type="primary" class="btn_b" @click="sendGoogs">确 定</van-button>
      </div>
    </van-dialog>
    <van-popup v-model="dateshow_1" position="bottom" :overlay="true">
      <van-picker
        @touchmove.native="stoppao"
        @mousemove.native="stoppao"
        :columns="columns"
        @change="onChange"
        @cancel="onCancelbtn"
        @confirm="onConfirmbtn"
        show-toolbar
      />
    </van-popup>
    <van-popup v-model="driverDateshow_1" position="bottom" :overlay="true">
      <van-picker
        @touchmove.native="stoppao"
        @mousemove.native="stoppao"
        :columns="driverColumns"
        @change="onDriverChange"
        @cancel="onDriverCancelbtn"
        @confirm="onDriverConfirmbtn"
        show-toolbar
      />
    </van-popup>
    <!-- 配送站的确认核销按钮 -->
    <van-popup v-model="showWriteOff" position="center" :overlay="true" round>
      <img :src="writeOffQR" style="width: 11.25rem; height: 11.25rem; margin: 1rem;" />
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 1rem; color: #f15353;">
        请核销员扫码
      </div>
    </van-popup>
  </div>
</template>

<script>
import cloudOrderList_controller from './cloudOrderList_controller';

export default cloudOrderList_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.list {
  margin: 0.844rem 0.906rem 0.625rem 0.969rem;
  // height: 15rem;
  background: #fff;
  border-radius: 0.625rem;
  padding: 0.656rem 0.625rem 0.875rem 0.625rem;

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .top_left {
      display: flex;
      align-items: center;

      span {
        font-size: 0.75rem;
        color: #666;
      }

      .Status {
        background-color: #fcbc07;
        border-radius: 0.313rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.688rem;
        color: #fff;
        padding: 0.219rem 0.469rem 0.188rem 0.438rem;
        margin-left: 0.719rem;
      }
    }

    .Status_o {
      color: #f14e4e;
      font-size: 0.75rem;
    }
  }

  .centen {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;

    .centen_left {
      width: 4.375rem;
      height: 4.375rem;
      background-color: #666;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .centen_right {
      flex: 1;
      text-align: left;
      margin-left: 0.656rem;

      span {
        font-size: 0.875rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      p {
        font-size: 0.75rem;
        color: #666;
      }
    }
  }

  .address {
    margin-top: 1.063rem;
    text-align: left;

    p {
      font-size: 0.813rem;
      color: #909090;
    }

    span {
      color: #909090;
      font-size: 0.813rem;
    }
  }

  .hxBtn span:nth-child(n + 1) {
    margin-left: 0.625rem;
  }

  .hxBtn {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.219rem;

    .btn_13 {
      width: 4.688rem;
      height: 1.438rem;
      border-radius: 0.719rem;
      border: solid 0.031rem #f14e4e;
      font-size: 0.813rem;
      color: #f14e4e;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn_5 {
      width: 4.688rem;
      height: 1.438rem;
      border-radius: 0.719rem;
      border: solid 0.031rem #f14e4e;
      font-size: 0.813rem;
      color: #f14e4e;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn_50 {
      width: 4.688rem;
      height: 1.438rem;
      border-radius: 0.719rem;
      border: solid 0.031rem #f14e4e;
      font-size: 0.813rem;
      color: #f14e4e;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn_12 {
      width: 4.688rem;
      height: 1.438rem;
      border-radius: 0.719rem;
      border: solid 0.031rem #f14e4e;
      font-size: 0.813rem;
      color: #f14e4e;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn_8 {
      width: 4.688rem;
      height: 1.438rem;
      border-radius: 0.719rem;
      border: solid 0.031rem #f14e4e;
      font-size: 0.813rem;
      color: #f14e4e;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn_41 {
      width: 4.688rem;
      height: 1.438rem;
      border-radius: 0.719rem;
      border: solid 0.031rem #f14e4e;
      font-size: 0.813rem;
      color: #f14e4e;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn_3 {
      width: 4.688rem;
      height: 1.438rem;
      border-radius: 0.719rem;
      border: solid 0.031rem #f14e4e;
      font-size: 0.813rem;
      color: #f14e4e;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn_9 {
      width: 4.688rem;
      height: 1.438rem;
      border-radius: 0.719rem;
      border: solid 0.031rem #f14e4e;
      font-size: 0.813rem;
      color: #f14e4e;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn_1 {
      width: 4.688rem;
      height: 1.438rem;
      background-color: #f14e4e;
      border-radius: 0.719rem;
      font-size: 0.813rem;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 0.625rem;
    }

    .btn_package_deliver {
      width: 4.688rem;
      height: 1.438rem;
      background-color: #f14e4e;
      border-radius: 0.719rem;
      font-size: 0.813rem;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 0.625rem;
    }
  }
}
</style>
