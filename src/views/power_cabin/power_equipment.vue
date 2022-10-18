<template>
  <div id="power_equipment">
    <c-title :hide="false"
             text='我的设备'></c-title>
    <van-tabs v-model="active"
              @click="onClick"
              id="tab">
      <van-tab title="设备"
               name="0"></van-tab>
      <!-- <van-tab title="检测设备"
               name="1"></van-tab> -->
    </van-tabs>
    <div class="content">
      <div class="all">设备总数:{{total}}</div>
      <div class="block"
           v-for="(item,index) in datas"
           :key="index">
        <div class="title"
             @click="expand(item)">
          {{item.equipment_no}}
        </div>
        <div class="other"
             v-if="item.checked">
          <div v-if="item.info.device_data"><span>设备状态:</span><span style="color: #ff2c29;">{{item.info.device_data.device_status}}</span></div>
          <div v-if="item.info.device_data"><span>设备信号强度:</span><span style="color: #ff2c29;">{{item.info.device_data.device_wifi}}</span></div>
          <div v-if="item.info.device_data"><span> 设备网络类型:</span><span style="color: #ff2c29;">{{item.info.device_data.network}}</span></div>
        </div>
        <div class="qr_code">
          <div class="btn_one"
               @click="scan(item)">
            查看二维码
          </div>
          <div class="btn_two"
               @click="toRecord(item.id)">
            核销记录
          </div>
          <div class="btn-three"
               @click="Delete(item.id)">
            删除设备
          </div>
        </div>
        <div class="line"
             style="height: 0.3125rem; background-color: #f5f7fa; margin: 0 -0.75rem;">

        </div>
      </div>
    </div>
    <div class="bind_wrap"
         :class="[fun.getPhoneEnv() == 3 ? 'pc' : '']">
      <div class="bind_btn"
           @click="toBind">绑定设备</div>
    </div>

    <van-popup v-model="show"
               :style="{ height: '50%',width:'80%' }"
               class="pop"
               style="display: flex; align-items: center;"
               v-if="show">
      <div class="qr_code">
        <img :src="qr_code">
        <p style="color: #999;">长按保存二维码</p>
      </div>
    </van-popup>
  </div>
</template>

<script>
import power_equipment_controller from './power_equipment_controller';
export default power_equipment_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#power_equipment {
  height: 100vh;
  background-color: #fff;

  .content {
    background-color: #fff;
    padding-bottom: 2.5rem;

    .all {
      height: 2.1875rem;
      background-color: #f4f4f4;
      display: flex;
      align-items: center;
      width: 100%;
      padding-left: 1rem;
    }

    .block {
      padding: 0 0.75rem;
      margin-bottom: 0.3125rem;

      .title {
        padding: 1.125rem 0;
        padding-left: 0.5rem;
        border-bottom: solid 1px #f5f7fa;
        display: flex;
        justify-content: space-between;

        .connect {
          color: #ff2c29;
          font-size: 12px;
        }
      }

      .other {
        border-bottom: solid 1px #f5f7fa;
        text-align: left;
        padding: 0.5rem 0;

        div:first-child {
          margin-top: 0;
        }

        div {
          padding-left: 0.5rem;
          margin-top: 0.5rem;
        }
      }

      .qr_code {
        padding: 0.75rem;
        padding-right: 0.25rem;
        display: flex;
        justify-content: flex-end;

        .btn_one {
          width: 6.0625rem;
          height: 1.8125rem;
          background-color: #ff2c29;
          border-radius: 0.9375rem;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          margin-right: 1.3125rem;
        }

        .btn_two {
          width: 5.25rem;
          height: 1.8125rem;
          border-radius: 0.9375rem;
          border: solid 0.0625rem #ff2c29;
          color: #ff2c29;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1.3125rem;
        }

        .btn-three {
          width: 5.25rem;
          height: 1.8125rem;
          border-radius: 0.9375rem;
          border: solid 0.0625rem #ff2c29;
          color: #ff2c29;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }

  .bind_wrap {
    position: fixed;
    bottom: 0.25rem;
    width: 100%;

    .bind_btn {
      width: 18.75rem;
      height: 2.5rem;
      background-color: #ff2c29;
      border-radius: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 16px;
      margin: 0 auto;
    }
  }
}

.pc {
  position: absolute;
  width: 375px !important;
}

.pop {
  border-radius: 0.75rem;

  .qr_code {
    margin: 0 auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
