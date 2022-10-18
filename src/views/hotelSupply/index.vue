<template>
  <div id="hotel_home">
    <c-title :hide="false" text="酒店首页"></c-title>
    <div id="content">
      <div style="overflow: hidden; background: #f8f8f8; height: 12.5rem;">
        <img :src="frontendData.thumb" style="width: 100%;" @click="goPagebtn(frontendData.url)"/>
      </div>
      <div class="position">
        <div class="search">
          <ul class="box">
            <li class="city">
              <span class="city_cur">{{ location.city }}</span>
              <div class="current" @click="routerGo('1')">
                <i class="iconfont icon-location"></i>
                <span>当前位置</span>
              </div>
            </li>
            <li class="nearby" @click="gotoSearch">
              <span>我的附近</span>
              <input
                type="text"
                :placeholder="
                  '搜索关键字/位置/品牌/查找酒店'
                "
                disabled
              />
              <i class="fa fa-angle-right"></i>
            </li>
          </ul>
          <button type="button" @click="gotoSearch">
            查找酒店
          </button>
        </div>
        <div class="hotel_list">
          <div class="hotel">酒店甄选</div>
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
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import controller from "./index_controller";
export default controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #hotel_home {
    #content {
      .position {
        z-index: 10;
        position: relative;
        top: -3.125rem;
      }

      .search {
        width: 22.1875rem;
        margin: 0 auto 1rem;
        border-radius: 0.375rem;
        background: #fff;
        padding: 0 0.75rem 0.75rem 0.75rem;

        .box {
          li {
            height: 3.125rem;
            border-bottom: solid 0.0625rem #ebebeb;
            display: flex;
          }

          .city {
            position: relative;
            justify-content: space-between;

            .city_cur {
              font-size: 18px;
              line-height: 3.125rem;
              font-weight: bold;
            }

            .current {
              position: absolute;
              right: 0;
              padding: 0.25rem 0;

              i {
                font-size: 1.5rem;
                color: #337ef9;
                line-height: 1.5rem;
              }

              span {
                font-size: 12px;
                color: #337ef9;
                display: block;
              }
            }
          }

          .nearby {
            line-height: 3.125rem;
            position: relative;
            font-size: 16px;

            .nearby_b {
              color: #8c8c8c;
            }

            input {
              width: 13.75rem;
              border: none;
              margin-left: 1.25rem;
              font-size: 16px;
            }

            .fa {
              position: absolute;
              right: 0;
              font-size: 1.125rem;
              color: #c9c9c9;
              line-height: 3.125rem;
            }
          }
        }

        button {
          margin-top: 0.75rem;
          width: 100%;
          height: 2.875rem;
          font-size: 18px;
          color: #fff;
          background: #f15353;
          border: none;
          border-radius: 0.375rem;
        }
      }

      .hotel_list {
        width: 22.1875rem;
        margin: 0 auto;
        border-radius: 0.375rem;
        background: #fff;
        padding: 0 0.75rem 0.75rem 0.75rem;

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
