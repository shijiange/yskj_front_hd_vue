<template>
  <div id="home_page">
    <c-title :hide="false" text="酒店详情"></c-title>
    <div id="content">
      <div class="position" v-if="data_info">
        <div class="name">
          <h1 style="-webkit-box-orient: vertical;">
            {{data_info.name}}
          </h1>
        </div>
        <ul class="content_a">
          <li class="distance">
            <i class="iconfont icon-service_n"></i>
            <p>
              {{data_info.address}}
            </p>
            <div class="right"
                 @click="goToAdress(data_info.longitude,data_info.latitude)">
              <span>地图</span>
              <i class="fa fa-angle-right"></i>
            </div>
          </li>
          <li class="phone">
            <i class="iconfont icon-service_m"></i>
            <a :href="phone">{{data_info.tel}}</a>
          </li>
          <!-- 酒店详情/设施 -->
          <li class="hotel_detail">
            <span>酒店设施</span>
            <div class="right">
              <span>{{data_info.other_name}}</span>
            </div>
          </li>
        </ul>
       <div class="content_c">
         <div class="top">入住登记订单信息</div>
         <div class="li">
           <div class="left">登记人姓名:</div>
           <div class="right">{{info.user_name}}</div>
         </div>
         <div class="li">
           <div class="left">联系方式:</div>
           <div class="right">{{info.tel}}</div>
         </div>
         <div class="li">
           <div class="left">入住日期:</div>
           <div class="right">{{info.start_at}}</div>
         </div>
         <div class="li">
           <div class="left">离开日期:</div>
           <div class="right">{{info.end_at}}</div>
         </div>
          <div class="li">
            <div class="left">预订状态:</div>
            <div class="right">{{info.status_name}}</div>
          </div>
       </div>
      </div>
    </div>
  </div>
</template>

<script>
import controller from "./hotelOrder_controller";
export default controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #home_page {
    #content {
      .position {
        position: relative;
        top: 0;

        .name {
          width: 100%;
          background: #fff;
          border-radius: 0;
          margin: 0 auto;
          padding: 0.75rem 0.875rem;
          display: flex;
          justify-content: space-between;

          h1 {
            font-size: 18px;
            text-align: left;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;

            span {
              font-weight: normal;
              color: #8c8c8c;
              font-size: 14px;
              margin-left: 0.625rem;
            }
          }
        }

        .content_a {
          padding: 0 0.875rem;
          background: #fff;
          margin-top: 0.625rem;

          .distance {
            padding: 0.625rem 0;
            display: flex;
            position: relative;

            i {
              font-size: 1rem;
              color: #666;
              margin-right: 0.375rem;
            }

            p {
              font-size: 14px;
              text-align: left;
              width: 16.875rem;

              span {
                color: #8c8c8c;
                margin-left: 0.625rem;
                font-size: 12px;
              }
            }

            .right {
              position: absolute;
              right: 0;
              display: flex;
              font-size: 14px;
              color: #60a9f3;
              align-items: center;

              .fa {
                font-size: 1rem;
                color: #60a9f3;
                margin-left: 0.375rem;
              }
            }
          }

          .phone {
            display: flex;
            padding: 0.625rem 0;

            i {
              font-size: 1rem;
              color: #666;
              margin-right: 0.375rem;
            }

            span {
              font-size: 16px;
            }
          }

          .hotel_detail {
            height: 2.75rem;
            line-height: 2.75rem;
            display: flex;
            justify-content: space-between;
            border-top: solid 0.0625rem #ebebeb;
            font-size: 16px;

            .right {
              right: 0;
              display: flex;
              font-size: 12px;
              color: #60a9f3;
              align-items: center;

              .fa {
                font-size: 1rem;
                color: #60a9f3;
                margin-left: 0.375rem;
              }
            }
          }
        }

        .content_c {
          background: #fff;
          margin-top: 1.5rem;
          text-align: left;
          padding-left: 1rem;
          padding-right: 1rem;

          .top {
            height: 2rem;
            line-height: 2rem;
            font-size: 14px;
          }

          .li {
            border-bottom: 1px solid #eee;
            line-height: 2rem;
            height: 2rem;
            font-size: 14px;
            display: flex;

            .right {
              padding-left: 0.4rem;
            }
          }
        }
      }
    }
  }
</style>
