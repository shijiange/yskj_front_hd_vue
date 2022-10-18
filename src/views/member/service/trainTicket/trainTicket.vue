<template>
  <div id="trainTicket" :class="'trainTicket' + $store.state.service.lang">
    <c-title :hide="false" :text="language.title"></c-title>

    <div id="sosoall" :class="{ onbts: loding }">
      <div class="tip">
        <span class="left">{{ language.start }}</span>
        <span class="right">{{ language.end }}</span>
      </div>
      <div class="search-city">
        <div class="city-item-input" @click="selectCity('from')" id="go">{{ language.readonly }}</div>
        <!-- <i class="icon iconfont icon-fanzhuan" @click="cityChanges"></i> -->
        <img src="../../../../assets/images/life-train01.png"/>
        <div class="city-item-input" @click="selectCity('to')" id="to">{{ language.readonlyto }}</div>
      </div>
      <div class="search-date">
        <img src="../../../../assets/images/life-date.png"/>
        <!--<el-date-picker v-model="dataModel" @change='dataOnChange' type="date" :placeholder="language.startDate" :picker-options="pickerOptions0">-->
        <!--</el-date-picker>-->
        <van-button
          plain
          type="primary"
          @click="seleStartTime"
          style="color: #1f2d3d; border: 1px solid #bfcbd9; margin-right: 4rem; margin-top: 0.2rem; min-width: 12rem;"
        >{{ startTime }}
        </van-button
        >
      </div>
      <button class="buttons" @click="submit">{{ language.startSearch }}</button>
    </div>

    <van-popup v-model="popupSpecs" class="mint-popup-3" position="right" closeOnClickModal='true' modal='false'
               style="z-index: 2004;">

      <div class="city-info">
        <van-nav-bar
          left-arrow
          title="城市"
          fixed
          @click-left="popCityClose"
          :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"
        />
        <div>
          <div class="input">
            <i class="iconfont icon-sousuo1"></i>
            <input type="text" placeholder="城市首字母" v-model="sokey"/>
          </div>
          <div style="height: 2.5rem;"></div>

          <!-- <mt-tab-container v-model="selected"> -->
          <div v-show="selected == 1">
            <!-- <mt-tab-container-item id="1"> -->
            <!-- right fixed -->
            <ul class="innerRig">
              <li :key="i" class="letter" v-for="(item, i) in allCitys" @click="goSoso(item.key)">{{ item.key }}</li>
            </ul>
            <!-- left inner -->
            <div class="content">
              <div :key="i" class="list" v-for="(item, i) in searchData">
                <p class="title">{{ item.key }}</p>
                <ul>
                  <li :key="i" v-for="(city, i) in item.data" @click="chooseCity($event, city)">{{ city.name }}</li>
                </ul>
              </div>
            </div>
            <!-- </mt-tab-container-item> -->
          </div>

          <!-- <mt-tab-container v-model="selected"> -->
          <div v-show="selected==1">
            <!-- <mt-tab-container-item id="1"> -->
            <!-- right fixed -->
            <ul class="innerRig">
              <li :key='i' class="letter" v-for="(item,i) in allCitys" @click="goSoso(item.key)">{{item.key}}</li>

            </ul>
            <!-- left inner -->
            <div class="content">
              <div :key='i' class="list" v-for="(item,i) in searchData">
                <p class="title">{{item.key}}</p>
                <ul>
                  <li :key='i' v-for="(city,i) in item.data" @click="chooseCity($event,city)">{{city.name}}</li>
                </ul>
              </div>
            </div>
            <!-- </mt-tab-container-item> -->
          </div>

          <!-- </mt-tab-container> -->
        </div>
      </div>

    </van-popup>
    <van-popup v-model="dateshow_1" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="value1"
        type="date"
        :min-date="minDate"
        @confirm="confirmbtn"
        @cancel="cancelbtn"
      />
    </van-popup>
  </div>
</template>

<script>
import trainTicket_controller from "./trainTicket_controller";

export default trainTicket_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .trainTicketch {
    height: 100vh;

    .city-info {
      overflow-y: scroll;
      width: 100vw;
      height: 100vh;
      background: #fff;
    }

    .input {
      margin-top: 2.5rem;
      padding: 0.625rem 5%;
      position: fixed;
      z-index: 999;
      background: #fff;
      width: 100%;
      border-bottom: solid 1px #ebebeb;

      i {
        position: absolute;
        left: 2.75rem;
        line-height: 1.875rem;
      }

      input {
        background-color: #fafafa;
        width: 90%;
        height: 1.875rem;
        border-radius: 0.3125rem;
        padding-left: 1.875rem;
        border: 0;
        outline: 0;
        // background: url(../../../../assets/images/search.png) no-repeat 0.5rem 0.625rem #fff;
      }
    }

    .mint-header {
      background: none;
      color: #666;
    }

    .is-fixed .mint-header-title {
      font-weight: bold;
    }

    .mint-header.is-fixed {
      border-bottom: 0.0625rem solid #e8e8e8;
      background: #fff;
      z-index: 99;
    }

    .is-right a {
      font-size: 12px;
    }

    .innerRig {
      position: fixed;
      width: 2.5rem;
      z-index: 99;
      right: 0;
      top: 5.625rem;
      bottom: 0;
      padding-top: 0.3125rem;
      padding-bottom: 0.3125rem;
      margin-top: 0;
      margin-bottom: 0;
      display: flex;
      flex-direction: column;
      color: #8c8c8c;
      background: none;
      font-size: 12px;

      li {
        line-height: 1.5rem;
      }
    }

    .content {
      margin-top: 3.125rem;
      padding-top: 0.625rem;
      text-align: left;

      .location {
        padding: 0 0.9375rem;

        .title {
          color: #666;
          font-size: 12px;
          line-height: 1.875rem;
        }

        div {
          width: 30%;
          height: 1.875rem;
          background: #fff;
          font-size: 16px;
          color: #333;
          line-height: 1.875rem;
          text-align: center;
          border-radius: 0.25rem;
        }
      }

      .list {
        .title {
          background: #fafafa;
          color: #333;
          font-size: 14px;
          line-height: 1.5rem;
          height: 1.5rem;
          padding-left: 0.875rem;
        }

        ul {
          padding-left: 1rem;
          background: #fff;

          li {
            width: 100%;
            height: 2.25rem;
            line-height: 2.25rem;
            border-bottom: 0.0625rem solid #ebebeb;
            color: #333;
            font-size: 14px;
          }

          li:last-child {
            border: 0;
          }
        }
      }
    }

    .title {
      font-size: 22px;
      color: #1bba9e;
      height: 2.8125rem;
      line-height: 2.8125rem;
    }

    .line {
      width: 100%;
      height: 0.625rem;
      background: #eee;
      padding: 0;
    }

    #sosoall.onbts {
      .buttons {
        background: #ccc;
      }
    }

    #sosoall {
      background-color: #fff;
      margin-top: 0.625rem;
      width: 100%;
      box-sizing: border-box;
      padding: 0.75rem 1.25rem;
      height: 37.5rem;

      .buttons {
        width: 100%;
        height: 2.875rem;
        line-height: 2.875rem;
        border-radius: 0.25rem;
        font-weight: 400;
        vertical-align: middle;
        white-space: nowrap;
        background-color: #f15353;
        border: none;
        display: block;
        font-size: 16px;
        color: #fff;
        margin-top: 1.25rem;
      }

      .search-date {
        height: 3.125rem;
        line-height: 3.125rem;
        border-bottom: solid 0.0625rem #ebebeb;
        display: -ms-flexbox;
        display: flex;
        justify-content: flex-start;

        i {
          font-size: 32px;
          color: #ccc;
          flex: 1;
        }

        img {
          width: 1.75rem;
          height: 1.75rem;
          margin-top: 0.625rem;
        }
      }
    }

    #swipes {
      height: 6.875rem;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .tip {
      width: 100;
      height: 1.875rem;
      line-height: 1.875rem;
      color: #8c8c8c;

      .left {
        float: left;
      }

      .right {
        float: right;
      }
    }

    .search-city {
      border-bottom: solid 0.0625rem #ebebeb;
      display: flex;
      align-items: center;
      width: 100%;
      padding-bottom: 0.625rem;

      i {
        font-size: 32px;
        color: #ccc;
        flex: 1;
      }

      img {
        width: 2rem;
      }

      .city-item-input {
        flex: 3;
        overflow: hidden;
        line-height: 2rem;
        font-size: 18px;
        text-align: left;
      }

      .city-item-input:nth-child(3) {
        text-align: right;
      }
    }
  }

  .trainTicketwei {
    height: 100vh;
    background: #fff;

    .title {
      font-size: 22px;
      color: #1bba9e;
      height: 2.8125rem;
      line-height: 2.8125rem;
    }

    .line {
      width: 100%;
      height: 0.625rem;
      background: #eee;
      padding: 0;
    }

    #sosoall {
      width: 100%;
      box-sizing: border-box;
      padding: 0.9375rem;

      .buttons {
        border-radius: 0.2rem;
        font-weight: 400;
        vertical-align: middle;
        white-space: nowrap;
        background-color: #ff9914;
        border-color: #ff9914;
        display: block;
        font-size: 18px;
        color: #fff;
        padding: 0.5rem;
        margin-top: 1.5625rem;
      }

      .search-date {
        margin: 0.9375rem 0;
        display: -ms-flexbox;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;

        i {
          font-size: 32px;
          color: #ccc;
          flex: 1;
        }
      }
    }

    #swipes {
      height: 6.875rem;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .tip {
      width: 100;
      height: 1.875rem;
      line-height: 1.875rem;
      color: #f15353;

      .left {
        float: right;
      }

      .right {
        float: left;
      }
    }

    .search-city {
      display: -ms-flexbox;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      width: 100%;
      padding: 0.9375rem 0;

      i {
        font-size: 32px;
        color: #ccc;
        flex: 1;
      }

      .city-item-input {
        flex: 3;
        border-bottom: 0.0625rem solid #ccc;
        overflow: hidden;
        line-height: 2rem;
        font-size: 18px;
        text-align: right;
      }

      .city-item-input:nth-child(3) {
        text-align: left;
      }
    }
  }

  .van-nav-bar,
  /deep/ .van-nav-bar__content {
    height: 40px;
  }

  /deep/ .van-nav-bar__title {
    font-weight: 700;
    font-size: 14px;
    color: #666;
  }

  /deep/ .van-nav-bar .van-icon {
    color: #666;
  }

  /deep/ .van-nav-bar__left {
    padding: 0 0 0 10px;
  }

  .pcStyle {
    width: 375px;
    margin: 0 auto;
    left: 50%;
    margin-left: -187.5px;
  }
</style>