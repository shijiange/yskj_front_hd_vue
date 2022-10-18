<template>
  <div id="trafficIndex" :class="'trafficIndex'+$store.state.service.lang">
    <c-title :hide="false" :text='language.title' tolink='trafficRecord' :totext='language.fineRecord'></c-title>

    <ul class="content">
      <!--缴费城市-->
      <li>
        <label>{{language.payCity}}</label>
        <div class="traffic"><span id="chooseCity"></span>
          <router-link :to="fun.getUrl('trafficCity')">
            <i class="iconfont icon-right" v-if="$store.state.service.lang=='ch'"></i>
            <i class="iconfont icon-left" v-if="$store.state.service.lang=='wei'"></i>
          </router-link>
        </div>
      </li>
      <!--交通罚款-->
      <li class="nobot">
        <label>{{language.trafficFine}}</label>
        <div class="traffic other">
          {{finebill}}<i class="iconfont icon-down" @click="popfinebill"></i>
        </div>
        <van-popup
          v-model="popupVisible"
          position="bottom">
          <van-picker :columns="slots" @change="onValuesChange"/>
        </van-popup>
      </li>
      <!--车牌号-->
      <li>
        <label class="hasright">{{licensePlate}}<i class="iconfont icon-down" @click="poplicensePlate"></i></label>
        <input type="text" class="traffic" placeholder="请输入车牌号"/>
        <van-popup
          v-model="popupVisible2"
          position="bottom">
          <van-picker :columns="slots2" @change="onValuesChange2"/>
        </van-popup>
      </li>
      <!--车辆类型-->
      <li>
        <label>{{language.vehicleType}}</label>
        <div class="traffic other">
          {{vehicleType}} <i class="iconfont icon-down" @click="popVehicleType"></i>
        </div>
        <van-popup
          v-model="popupVisible3"
          position="bottom">
          <van-picker :columns="slots3" @change="onValuesChange3"/>
        </van-popup>
      </li>
      <!--车架号-->
      <li>
        <label>{{language.trafficNum}}</label>
        <input type="text" class="traffic" placeholder="请输入车架号后6位"/>
      </li>
      <!--发动机号-->
      <li class="nobot">
        <label>{{language.engineNum}}</label>
        <input type="text" class="traffic" placeholder="请输入发动机号"/>
      </li>
      <!--违章单号-->
      <li>
        <label>{{language.violationNum}}</label>
        <input type="text" class="traffic" placeholder="请输入违章单号"/>
      </li>
      <!--罚金-->
      <li>
        <label>{{language.fine}}</label>
        <div class="traffic">

        </div>
      </li>
      <!--滞纳金-->
      <li class="nobot">
        <label>{{language.lateFee}}</label>
        <div class="traffic">

        </div>
      </li>

    </ul>

    <router-link :to="fun.getUrl('trafficConfirmOrder')">
      <div class="btn">
        <button>{{language.btn}}</button>
      </div>
    </router-link>


  </div>
</template>

<script>
import trafficIndex_controller from "./trafficIndex_controller";

export default trafficIndex_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  * {
    box-sizing: border-box;
  }

  .trafficIndexch {
    .content {
      li {
        padding: 0 0.875rem;
        background: #fff;
        height: 2.8125rem;
        line-height: 2.8125rem;
        font-size: 16px;
        display: flex;
        flex-flow: row;
        border-bottom: 0.0625rem solid #e2e2e2;

        label {
          width: 6.25rem;
          text-align: left;
          line-height: 2.8125rem;

          i {
            font-size: 25px;
            vertical-align: middle;
            color: #c9c9c9;
          }
        }

        input {
          border: 0;
          outline: 0;
        }

        .traffic {
          flex: 1;
          padding-left: 0.625rem;
          text-align: left;
          line-height: 2.6875rem;
          color: #8c8c8c;

          i {
            float: right;
            font-size: 25px;
            color: #c9c9c9;
          }
        }

        .other {
          color: #333;
        }

        .hasright {
          border-right: 0.0625rem solid #ebebeb;
        }
      }

      .nobot {
        border-bottom: 0;
        margin-bottom: 0.625rem;
      }
    }

    .btn {
      padding: 0 0.9375rem;

      button {
        width: 100%;
        height: 2.875rem;
        border-radius: 0.375rem;
        font-weight: 400;
        vertical-align: middle;
        white-space: nowrap;
        background-color: #f15353;
        display: block;
        font-size: 16px;
        color: #fff;
        margin-top: 1.25rem;
        border: 0;
        outline: 0;
        padding: 0.375rem 0;
      }
    }
  }

  .trafficIndexwei {
    .content {
      li {
        padding: 0 0.9375rem;
        background: #fff;
        height: 2.8125rem;
        line-height: 2.8125rem;
        display: flex;
        flex-flow: row;
        border-bottom: 0.0625rem solid #e2e2e2;

        label {
          width: 5rem;
          text-align: right;
          line-height: 2.8125rem;
          order: 2;

          i {
            font-size: 25px;
            vertical-align: middle;
          }
        }

        input {
          border: 0;
          outline: 0;
        }

        .traffic {
          order: 1;
          flex: 1;
          padding-right: 0.625rem;
          text-align: right;
          line-height: 2.6875rem;
          color: #a5a5a5;

          i {
            float: left;
            font-size: 25px;
            color: #a5a5a5;
          }
        }

        .other {
          color: #333;
        }

        .hasright {
          border-left: 0.0625rem solid #e2e2e2;
        }
      }

      .nobot {
        border-bottom: 0;
        margin-bottom: 0.625rem;
      }
    }

    .btn {
      padding: 0 0.9375rem;

      button {
        width: 100%;
        height: 2.875rem;
        line-height: 2.875rem;
        border-radius: 0.375rem;
        font-weight: 400;
        vertical-align: middle;
        white-space: nowrap;
        background-color: #ff9914;
        display: block;
        font-size: 16px;
        color: #fff;
        margin-top: 1.25rem;
        border: 0;
        outline: 0;
        padding: 0.375rem 0;
      }
    }
  }
</style>