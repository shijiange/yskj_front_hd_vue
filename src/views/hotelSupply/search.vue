<template>
  <div id="hotel_search">
    <c-title :hide="false" :text="'酒店搜索页'"></c-title>
    <div id="content">
      <div class="search_box">
<!--        <div class="left">-->
<!--          请选择时间-->
<!--          <div class="start_time">住03月5日</div>-->
<!--          <div class="end_time">离03月5日</div>-->
<!--        </div>-->
        <div class="right">
          <div class="box">
            <i class="iconfont icon-sousuo1"></i>
            <input
              type="text"
              placeholder="关键字/位置/品牌/酒店名"
              v-model="search_value"
            />
          </div>
          <div @click="gotoSearchBtn" class="search" >搜索</div>
        </div>
      </div>
      <div class='sort'>
            <div class="child" @click="typeSelectBtn">
              <div class="grid-content" :class="{'active':typeBol}">
                <span style="margin-right: 0.2rem;">类型</span>
                <i class='fa' :class="{'fa-angle-down':typeBol}"></i>
                <i class='fa' :class="{'fa-angle-up':!typeBol}"></i>
              </div>
            </div>
            <div class="typeSelectContent" v-if="!typeBol">
              <div class="top">酒店类型</div>
              <div class="bottom">
                <ul>
                  <li v-for="(item,index) in typeList" :key="index" :class="{'sel':index==selIndex}" @click="selBtn(item.id,index)">{{item.name}}</li>
                </ul>
              </div>
            </div>
<!--        <div class="child">-->
<!--          <div class="grid-content"  :class="{active:sort.tab===1,up:sort.select==='1_1',down:sort.select==='1_2'}" @click='selectBtn(1)'-->
<!--               >类型-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="child">-->
<!--          <div class="grid-content" :class="{active:sort.tab===2,up:sort.select==='2_1',down:sort.select==='2_2'}" @click='selectBtn(2)'>-->
<!--            价格-->
<!--          </div>-->
<!--        </div>-->
        <div class="child">
          <div class="grid-content" @click='selectBtn(3)'>
            <div class="left" :class="{active:sort.tab===3}">距离</div>
            <div class="right">
              <i class="fa fa-angle-up" :class="{active:sort.select==='3_1'}"></i>
              <i class="fa fa-angle-down" :class="{active:sort.select==='3_2'}"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="hotel_list">
        <ul class="list">
          <li  v-for="(item,index) in hotelList" :key="index" @click="hotelBtn(item.hotel_id)">
            <div class="imgContent">
              <img :src="item.logourl" alt=""/>
            </div>
            <div class="bottom">
              <div class="left">
                <div class="name">{{item.name}}</div>
                <div class="address">{{item.provice}}.{{item.city}}</div>
              </div>
              <div class="right">
                <div class="distance">距离:{{item.distance/1000+'km'}}</div>
                <div class="manfang">{{item.is_manfang==1?'满房':'有房'}}</div>
              </div>
            </div>
            <div class="hotelType">
              {{item.level_name}}
            </div>
          </li>
          <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem 0;" v-if="hotelList&&fun.isTextEmpty(hotelList)"/>
        </ul>
      </div>
    </div>
    <van-popup v-model="show" position="bottom">
      <div class="dateSelector">
        <van-tabs v-model="active">
          <van-tab title="请选择入住时间">
            <van-datetime-picker
              v-model="currentDate"
              type="date"
              :min-date="minDate"
              :max-date="maxDate"
            />
          </van-tab>
          <van-tab title="请选择离开时间">
            <van-datetime-picker
              v-model="currentDate_2"
              type="date"
              :min-date="minDate_2"
              :max-date="maxDate_2"
            />
          </van-tab>
        </van-tabs>
      </div>
    </van-popup>
  </div>
</template>

<script>
import controller from "./search_controller";
export default controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #hotel_search {
    #content {
      background: #fff;

      .search_box {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: solid 0.0625rem #ebebeb;
        position: fixed;
        top: 2.4rem;
        background: #fff;
        z-index: 10;

        .left {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding-left: 0.4rem;
        }

        .right {
          margin-left: 2rem;
          padding: 0.375rem 0.9375rem 0.375rem 0.4rem;
          display: flex;
          align-content: center;
          justify-content: flex-end;

          .box {
            display: flex;

            /* width: 18.75rem; */
            width: 16rem;
            height: 1.875rem;
            border-radius: 0.375rem;
            background: #f5f5f5;
            padding: 0 0.625rem;

            i {
              font-size: 1rem;
              color: #999;
              line-height: 1.875rem;
              margin-right: 0.625rem;
            }

            input {
              /* width: 15rem; */
              border: none;
              font-size: 15px;
            }

            margin-right: 0.4rem;
          }

          .search {
            font-size: 15px;
            line-height: 1.875rem;
            height: 1.875rem;
            width: 4rem;
          }
        }
      }

      .sort {
        position: fixed;
        line-height: 2.25rem;
        border-bottom: solid 0.0625rem #d9d9d9;
        font-size: 12px;
        color: #333;
        display: flex;
        width: 100%;
        top: 5.04rem;
        background: #fff;
        z-index: 10;

        .child {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;

          .grid-content {
            display: flex;
            align-items: center;
            justify-content: center;

            .left {
              margin-right: 0.2rem;
            }

            .left.active {
              color: #ff2c29;
            }

            .right {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding-bottom: 0.3rem;

              i {
                height: 0.5rem;
              }

              i.active {
                color: #ff2c29;
              }
            }
          }

          .grid-content.up::after {
            /* background-position: -10.625rem -0.9375rem; */
          }

          .grid-content.down::after {
            /* background-position: -10.625rem 0; */
          }

          .active.up,
          .active.down {
            color: #f15353;
          }

          .grid-content::after {
            /* content: "";
             display: inline-block;
             width: 0.5rem;
             height: 0.625rem;
             background: url(../../assets/images/jd-sprites.png) no-repeat;
             background-size: 12.5rem 12.5rem;
             background-position: -10.625rem -1.875rem;
             margin-left: 0.25rem; */
          }

          i {
            color: #555;
          }
        }

        .typeSelectContent {
          border-top: 1px solid #eee;
          background: #fff;
          position: absolute;
          bottom: -5rem;
          left: 0;
          right: 0;
          height: 5rem;
          padding-left: 0.4rem;
          padding-right: 0.4rem;
          padding-top: 0.4rem;
          display: flex;

          .top {
            line-height: 2rem;
            font-size: 0.75rem;
            text-align: left;
            height: 2rem;
            padding-left: 0.6rem;
          }

          .bottom {
            flex: 1;

            ul {
              display: flex;
              flex-wrap: wrap;

              li {
                line-height: 2rem;
                height: 2rem;
                background-color: #fff;
                color: #333;
                text-align: center;
                border-radius: 0.6rem;
                border: 1px solid #eee;
                padding: 0 0.4rem;
                margin-left: 0.6rem;
                margin-bottom: 0.4rem;
              }

              li.sel {
                color: #fff;
                border: 1px solid #ff2e2e;
                background-color: #ff2e2e;
              }
            }
          }
        }
      }

      .hotel_list {
        width: 22.1875rem;
        margin: 0 auto;
        border-radius: 0.375rem;
        background: #fff;
        padding: 6rem 0.75rem 0.75rem 0.75rem;

        .hotel {
          text-align: left;
          height: 2rem;
          line-height: 2rem;
          font-size: 1rem;
        }

        .list {
          width: 100%;

          li {
            border-radius: 0.4rem;
            position: relative;
            margin-bottom: 1rem;

            .imgContent {
              width: 100%;
              height: 10rem;

              img {
                height: 100%;
                width: 100%;
              }
            }

            .bottom {
              position: absolute;
              left: 0;
              bottom: 0;
              right: 0;
              height: 3.5rem;
              display: flex;
              background-color: rgba(0, 0, 0, 0.6);
              color: #fff;
              justify-content: space-between;
              text-align: left;
              padding-top: 0.2rem;

              .left {
                padding-left: 0.8rem;

                .name {
                  line-height: 1.5rem;
                  font-size: 0.8rem;
                }

                .address {
                  line-height: 1.5rem;
                  font-size: 0.8rem;
                }
              }

              .right {
                padding-right: 0.8rem;

                .distance {
                  line-height: 1.5rem;
                  height: 1.5rem;
                }

                .manfang {
                  width: 4rem;
                  text-align: center;
                  line-height: 1.5rem;
                  height: 1.5rem;
                  color: #fff;
                  background-color: rgba(255, 0, 0, 0.6);
                  border-radius: 1rem;
                  margin: 0 auto;
                }
              }
            }

            .hotelType {
              position: absolute;
              top: 0.5rem;
              left: 0.5rem;
              padding-left: 0.5rem;
              padding-right: 0.5rem;
              text-align: center;
              line-height: 1.5rem;
              height: 1.5rem;
              color: #fff;
              background-color: rgba(0, 0, 0, 0.6);
              border-radius: 1rem;
            }
          }
        }
      }
    }
  }
</style>
