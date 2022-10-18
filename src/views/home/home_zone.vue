<template>
  <div id="area-select">
    <c-title :hide="false" text="区域选择"></c-title>
    <div class="search-box">
      <div class="search">
        <i
          class="iconfont icon-sousuo1"
          style="font-size: 1rem; color: #999;"
        ></i>
        <input type="text" placeholder="请输入城市名"/>
      </div>
    </div>
    <div class="current-area">当前区域：广州市-白云区</div>
    <h1>已开放城市</h1>
    <div class="city-list">
      <div class="current-city">
        <div v-for="(item, index) in province" :key='index'>
          <div class="tbs" @click="toggle($event, index)">
            <div class="li2">
              <div class="icon">
                <i
                  class="iconfont icon-icon_location"
                  style="font-size: 1rem; color: #ff9800;"
                ></i>
              </div>
              <div class="name">广东省</div>
            </div>
            <div class="li4">
              <span>选择城市</span>
              <i
                class="fa"
                :class="{
                  'fa-angle-down': sort == index,
                  'fa-angle-right': sort != index
                }"
              ></i>
            </div>
          </div>
          <transition name="fade">
            <div class="tbs3" v-show="sort == index">
              <div
                v-for="(val, i) in item.item1"
                :key='i'
                style="line-height: 1.875rem; border-bottom: 0.0625rem;"
              >
                <div class="tbs1" @click="toggle1($event, i)">
                  <div class="li2">
                    <div class="name"><span>广州市</span></div>
                  </div>
                  <div class="li4">
                    <i
                      class="fa"
                      :class="{
                        'fa-angle-down': sort1 == i,
                        'fa-angle-right': sort1 != i
                      }"
                    ></i>
                  </div>
                </div>
                <transition name="fade">
                  <div class="tbs3-1" v-show="sort1 == i">
                    <button type="button">白云区</button>
                    <button type="button">珠海区</button>
                    <button type="button">番禹区</button>
                    <button type="button">天河区</button>
                  </div>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import home_zone_controller from "./home_zone_controller";

export default home_zone_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  #area-select {
    // .search-box{
    //     background-color: #fff;
    //     height:45px;
    //     padding:0 14px;
    //     margin-bottom:10px;
    //     padding-top:9px;
    //     .search{
    //         display: flex;
    //         border:solid 1px #ebebeb;
    //         height:28px;
    //         line-height: 28px;
    //         border-radius: 14px;
    //         padding:0 10px;
    //         background-color: #fafafa;
    //     }
    //     input{
    //         line-height: 28px;
    //         border:none;
    //         color:#333;
    //         margin-left:6px;
    //     }
    // }
    // text-align: left;
    // .current-area {
    //     background-color: #fff;
    //     line-height: 45px;
    //     padding: 0 14px;
    //     color: #333;
    //     font-size: 14px;
    // }
    // h1 {
    //     line-height: 30px;
    //     padding: 0 14px;
    //     color: #999;
    // }
    .city-list {
      position: relative;

      .left,
      .other-area {
        i {
          position: absolute;
          left: 0.875rem;
        }
      }

      .current-city {
        background-color: #fafafa;

        .level-pro {
          background-color: #fff;
          display: flex;
          justify-content: space-between;
          line-height: 2.5rem;
          padding: 0 0.875rem 0 2.25rem;
          font-size: 14px;
          color: #333;
          border-bottom: solid 0.0625rem #ebebeb;

          .right {
            span {
              color: #999;
            }

            i {
              color: #999;
              font-size: 18px;
              margin-left: 0.375rem;
            }
          }
        }

        .level-city {
          display: flex;
          justify-content: space-between;
          background-color: #fafafa;
          line-height: 2.5rem;
          padding: 0 0.875rem 0 2.25rem;
          font-size: 14px;
          border-bottom: solid 0.0625rem #ebebeb;

          i {
            color: #999;
            font-size: 18px;
          }
        }

        .level-area {
          padding: 0.625rem 0.875rem 1.25rem 0.875rem;
          border-bottom: solid 0.0625rem #ebebeb;

          button {
            width: 32%;
            margin-right: 1%;
            height: 1.875rem;
            border: solid 0.0625rem #ebebeb;
            border-radius: 0.25rem;
            margin-top: 0.75rem;
            background-color: #fff;
          }

          button:nth-child(3n) {
            margin: 0;
          }
        }
      }

      .other-area {
        background-color: #fff;
        line-height: 2.5rem;
        border-bottom: solid 0.0625rem #ebebeb;
        padding: 0 0.875rem 0 2.25rem;
        font-size: 14px;
      }
    }

    .tbs {
      position: relative;
      display: flex;
      justify-content: space-between;
      border-bottom: #e8e8e8 0.0625rem solid;
      height: 2.8125rem;
      line-height: 2.8125rem;
      float: left;
      width: 100%;
      background: #fff;
      font-size: 14px;
      padding: 0 0.875rem;

      .left {
        font-size: 12px;
        box-sizing: border-box;
        width: 50%;
        text-align: left;
        height: 2.8125rem;
        line-height: 2.8125rem;
        float: left;

        img {
          width: 30%;
          float: left;
        }
      }

      .right {
        width: 50%;
        text-align: right;
      }

      a {
        color: #000;
      }

      .relation {
        color: #666;
      }

      .id,
      .level {
        font-size: 14px;
        line-height: 2.8125rem;
      }

      .fa.fa-search {
        color: #999;
        font-size: 1.25rem;
      }

      i {
        font-size: 24px;
      }

      .img {
        margin: 0.625rem 0;
      }

      .li1 {
        width: 3.125rem;
        height: 3.125rem; // margin-top:10px;
        // margin-left:10px;
        float: left;
        line-height: 3.125rem;
        background: #ccc;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .li2 {
        width: 50%;
        display: flex;
        float: left;
        position: relative;

        p {
          margin-top: 0.4375rem;
          margin-left: 0.625rem;
          text-align: left;
        }

        .name {
          position: absolute;
          left: 1.625rem;
        }
      }

      .li3 {
        flex: 30%;
        width: 30%;

        span {
          border: #b1a6a6 solid 0.0625rem;
          padding: 0.3125rem 1.25rem;
          border-radius: 0.4375rem;
          display: none;
        }
      }

      .li4 {
        // flex: 5%;
        // width: 5%;
        float: right;
        text-align: right;

        i {
          color: #999;
          font-size: 18px;
        }

        span {
          color: #999;
          margin-right: 0.375rem;
        }
      }
    }

    .tbs3 {
      .left {
        width: 46%;
        text-align: left;
        height: 2.8125rem;
        display: inline-block;
        line-height: 2.8125rem;

        img {
          width: 30%;
        }
      }

      .left1 {
        width: 100%;
        text-align: left;
        height: 2.8125rem;
        padding-left: 0.8125rem;
        display: inline-block;
        line-height: 2.8125rem;

        img {
          width: 30%;
        }
      }

      .right {
        width: 46%;
        display: inline-block;
        text-align: right;
        height: 2.8125rem;
        line-height: 2.8125rem;
      }
    }

    .tbs1 {
      display: flex;
      justify-content: space-between;
      border-bottom: #e8e8e8 0.0625rem solid;
      padding: 0 0.875rem;
      float: left;
      width: 100%;
      background: #fafafa;
      line-height: 2.8125rem;
      font-size: 14px;

      .left {
        font-size: 12px;
        box-sizing: border-box;
        width: 50%;
        text-align: left;
        height: 2.8125rem;
        line-height: 2.8125rem;
        float: left;

        img {
          width: 30%;
          float: left;
        }
      }

      .right {
        width: 50%;
        text-align: right;
      }

      a {
        color: #000;
      }

      .relation {
        color: #666;
      }

      .id,
      .level {
        font-size: 14px;
        line-height: 2.8125rem;
      }

      .fa.fa-search {
        color: #999;
        font-size: 1.25rem;
      }

      i {
        font-size: 24px;
      }

      .img {
        margin: 0.625rem 0;
      }

      .li1 {
        width: 3.125rem;
        height: 3.125rem; // margin-top:10px;
        // margin-left:10px;
        float: left;
        line-height: 3.125rem;
        background: #ccc;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .li2 {
        width: 50%;
        display: flex;
        float: left;
        position: relative;

        p {
          margin-top: 0.4375rem;
          margin-left: 0.625rem;
          text-align: left;
        }

        .name {
          position: absolute;
          left: 1.625rem;
        }
      }

      .li3 {
        flex: 30%;
        width: 30%;

        span {
          border: #b1a6a6 solid 0.0625rem;
          padding: 0.3125rem 1.25rem;
          border-radius: 0.4375rem;
          display: none;
        }
      }

      .li4 {
        // flex: 5%;
        // width: 5%;
        float: right;
        text-align: right;

        i {
          color: #999;
          font-size: 18px;
        }
      }
    }

    .tbs3-1 {
      padding: 0 0.875rem 1.25rem 0.875rem;
      border-bottom: solid 0.0625rem #ebebeb;

      .left {
        width: 46%;
        text-align: left;
        height: 2.8125rem;
        display: inline-block;
        line-height: 2.8125rem;

        img {
          width: 30%;
        }
      }

      .left1 {
        width: 100%;
        text-align: left;
        height: 2.8125rem;
        padding-left: 0.8125rem;
        display: inline-block;
        line-height: 2.8125rem;

        img {
          width: 30%;
        }
      }

      .right {
        width: 46%;
        display: inline-block;
        text-align: right;
        height: 2.8125rem;
        line-height: 2.8125rem;
      }

      button {
        width: 32%;
        margin-right: 1%;
        height: 1.875rem;
        border: none;
        border-radius: 0.25rem;
        margin-top: 0.75rem;
        background-color: #ebebeb;
        color: #333;
      }

      button:nth-child(3n) {
        margin: 0;
      }
    }
  }

  .fade-enter-active {
    transition: 0.5s;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
    height: 0;
  }

  .choose {
    border: 0.0625rem solid red;
  }
</style>
