<template>
  <div id="make_appointment">
    <c-title v-if="!showProjects" :hide="false" :text="'预约'"></c-title>
    <div class="top_main">
      <div class="goods">
        <div class="img">
          <img :src="project.project_thumb" alt=""/>
        </div>
        <div class="info">
          {{project.project_title}}
        </div>
      </div>
      <div class="cell">
        <van-cell title="预约门店" @click="getStore" is-link :value="AStore.store_name || '选择门店'"/>
        <van-cell title="预约时间" @click="toTime" is-link :value="start_time"/>
        <van-cell v-if="chooseTechnician.name" :title="'预约'+appointmentLang.worker" :value="chooseTechnician.name"/>
      </div>
    </div>
    <div class="bottom_main">
      <p class="title">您的姓名</p>
      <input type="text" v-model="applyModel.customer_name" placeholder="填写预约人的姓名"/>
      <p class="title">您的电话</p>
      <input type="number" v-model="applyModel.customer_tel" placeholder="填写预约人的电话"/>
      <p class="title">备注</p>
      <input type="text" v-model="applyModel.remark" placeholder="填写备注"/>
    </div>
    <div id="submitBtn">
      <span class="btn" @click="makeAppointment">预 约</span>
    </div>

    <template v-if="showProjects">
      <van-popup v-model="showProjects" position="right" style="height: 100%; width: 100%;">
        <van-nav-bar title="预约时间">
          <template #left>
            <span>
              <van-icon name="arrow-left" size="18" @click.native="showProjects=false" color='#333' />
            </span>
          </template>
          <template #right>
            <p slot="right" style="color: #f4a82e;" @click="Sure">确定</p>
          </template>
        </van-nav-bar>
        <!-- <div style="height: 50px"></div> -->

        <div id="appointment_time">

          <c-calendar ref="calendar"
                      :events="calendarEvents"
                      @select="selectedDay"
                      @monthChanged="monthChanged">
          </c-calendar>

          <div class="main" v-if="isRest || times.length <= 0">
            <p class="tips">暂无可预约时间</p>
          </div>

          <van-collapse v-model="activeNames" v-if="!isRest && work_date && times.length > 0">
            <van-collapse-item title="请选择时间" name="1" :value="start_time">
              <div class="box-warp">
                <p class="time-item" :class="{'active': start_time === time}" v-for="(time, index) in times"
                   @click="selectedTime(time)" :key="index">{{time}}</p>
              </div>
            </van-collapse-item>
          </van-collapse>

          <div class="main" v-if="!isRest && start_time">
            <p class="tips" v-if="technician.length <= 0">暂无{{appointmentLang.worker}}可预约</p>
            <p class="tips" v-else>选择{{appointmentLang.worker}}</p>
            <div class="technician-list">
              <van-radio-group v-model="result" checked-color="#f4a82e">
                <template v-for="item in technician">
                  <van-radio :name="item.id" v-if="item.status != 1" @click="clickTechnician(item)" :key="item.id">
                    <div class="technician-item">
                      <div class="pic">
                        <img :src="item.thumb" alt="">
                      </div>
                      <div class="technician-right">
                        <div class="top">
                          <p>{{item.name}}</p>
                          <div class="star">
                            <van-rate size="14" v-model="item.score" readonly />
                          </div>
                        </div>
                        <div class="describe1 text-over" style="-webkit-box-orient: vertical;"><span
                          class="blue">简介</span><span
                          class="gray">{{item.description || '暂无'}}</span></div>
                      </div>
                    </div>
                  </van-radio>
                  <div class="technician-item" v-if="item.status == 1" :key="item.id">
                    <p class="number">已约</p>
                    <div class="pic">
                      <img :src="item.thumb" alt="">
                    </div>
                    <div class="technician-right">
                      <div class="top">
                        <p>{{item.name}}</p>
                        <div class="star">
                          <van-rate size="14" v-model="item.score" readonly />
                        </div>
                      </div>
                      <div class="describe1 text-over" style="-webkit-box-orient: vertical;"><span
                        class="blue">简介</span><span
                        class="gray">{{item.description || '暂无'}}</span></div>
                    </div>
                  </div>
                </template>
              </van-radio-group>

            </div>
          </div>

        </div>

      </van-popup>
    </template>

    <template v-if="show1">
      <van-popup
        v-model="show1"
        position="right"
        closeable
        close-icon="close"
        :style="{ width: '100%',height: '100%' }"
      >
        <div class="header">选择门店</div>
        <div style="margin: 0.5rem 1rem; height: 90%; overflow-y: scroll;">
          <div class="project_list" v-for="item in store" :key="item.id" @click="chooseStore(item)">
            <div style="width: 5rem; height: 5rem;">
              <img :src="item.thumb" alt="">
            </div>

            <div class="list_title">
              <div class="list_title_top">
                <span class="title">{{item.store_name}}</span>
                <span class="distance-num">{{item.distance}}{{item.unit}}</span>
              </div>
              <div class="list_title_bottom">
                <span class="time">营业时间:{{item.business_hours_start}}-{{item.business_hours_end}}</span>
                <div>
                  <i style="color: #ccc;" class="iconfont icon-order_locate"></i>
                  <span class="distance">{{item.address}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-popup>
    </template>
  </div>
</template>

<script>
import make_appointment_controller from "./make_appointment_controller";

export default make_appointment_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #make_appointment {
    text-align: left;
    color: #000;
  }

  #make_appointment .top_main {
    background: #fff;
    padding-top: 0.625rem;
    margin-bottom: 0.938rem;
  }

  #make_appointment .top_main .goods {
    display: flex;
    width: 90%;
    margin: 0 5% 0.875rem;
    padding: 0.825rem;
    box-shadow: 0 0 18px 0 rgba(169, 169, 169, 0.24);
    border-radius: 5px;
  }

  #make_appointment .top_main .goods .img {
    width: 4.625rem;
    height: 4.625rem;
    margin-right: 0.6rem;
    border-radius: 0.156rem;
    overflow: hidden;
  }

  #make_appointment .top_main .goods .img img {
    width: 100%;
    height: 100%;
  }

  #make_appointment .top_main .goods .info {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    line-height: 1.125rem;
    max-height: 4.5rem;
    font-size: 0.875rem;
    padding: 0.5rem;
  }

  #make_appointment .top_main > > > .cell .van-cell__title {
    font-weight: bold;
  }

  #make_appointment .bottom_main {
    padding: 0 0.78rem;
    background: #fff;
    padding-bottom: 0.875rem;
  }

  #make_appointment .bottom_main .title {
    height: 2.5rem;
    line-height: 2.5rem;
    font-weight: bold;
  }

  #make_appointment .bottom_main input {
    background: #f7f7f7;
    border-radius: 0.375rem;
    height: 2.5rem;
    line-height: 2.5rem;
    width: 100%;
    border: none;
    padding: 0.625rem;
  }

  #make_appointment #submitBtn {
    background: #fff;
    width: 100%;
    height: 3.719rem;
    line-height: 3.719rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #make_appointment #submitBtn .btn {
    width: 90%;
    height: 2.5rem;
    background-color: #f4a82e;
    border-radius: 1.25rem;
    line-height: 2.5rem;
    text-align: center;
    font-size: 1rem;
    font-weight: bold;
    display: block;
    color: #fff;
  }

  .project_list {
    display: flex;
    display: -webkit-flex;
    background: #fff;
    padding: 1rem 0.5rem;
    border-bottom: 1px #f2f2f2 solid;
  }

  .project_list img {
    width: 5rem;
    height: 5rem;
    border-radius: 5px;
  }

  .list_title {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    padding: 0 0.5rem;
    justify-content: space-between;
    text-align: left;
    line-height: 1.5rem;
  }

  .list_title .title {
    font-size: 14px;
    width: 10rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #000;
  }

  .list_title span {
    font-size: 0.8rem;
    color: #ccc;
    align-content: space-between;
  }

  .list_title div {
    align-content: space-between;
  }

  .list_title_top {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
  }

  .distance-num {
    width: 4rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .distance {
    color: #ccc;

    /* overflow: hidden; */

    /* text-overflow: ellipsis; */

    /* display: -webkit-box; */

    /* -webkit-box-orient: vertical; */

    /* -webkit-line-clamp: 1; */
  }

  .list_title_bottom div {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
  }

  .list_title_bottom .time {
    color: #666;
  }

  .blue {
    display: inline-block;
    padding: 0 0.1rem;
    border-radius: 2.5px;
    background-color: #6eabff;
    color: #fff;
  }

  .tag {
    display: inline-block;
    border-radius: 12px;
    border: solid 0.5px #f4a82e;
    padding: 0.1rem 0.3rem;
    color: #f4a82e;
    font-size: 12px;
  }

  .header {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin: 1rem;
  }

  #appointment_time {
    background: #fff;
    text-align: left;

    .main {
      padding: 1rem;
    }

    .tips {
      text-align: left;
      font-weight: bold;
      font-size: 15px;
    }

    .times {
      display: flex;
      margin-top: 1rem;

      span {
        position: relative;
        display: inline-block;
        background-color: #fe753e;
        border-radius: 5px;
        color: #fff;
        padding: 0.8rem 1rem;
        font-size: 14px;
        margin-right: 0.5rem;
      }

      em {
        position: absolute;
        right: 0;
        top: 0;
        background-color: #fff;
        border-radius: 0 5px 0 5px;
        opacity: 0.57;
        font-size: 10px;
        color: #999;
        padding: 0.2rem;
      }

      .checked {
        background-color: #e1e1e1;
      }
    }

    .blue {
      display: inline-block;
      padding: 0 0.1rem;
      border-radius: 2.5px;
      background-color: #6eabff;
      color: #fff;
      margin-right: 0.3rem;
    }

    .technician-list {
      background-color: #fff;
      padding: 1rem 0;
    }

    .tag {
      display: inline-block;
      border-radius: 12px;
      border: solid 0.5px #f4a82e;
      padding: 0.1rem 0.3rem;
      color: #f4a82e;
      font-size: 12px;
    }

    .technician-item {
      display: flex;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f2f2f7;

      .number {
        font-size: 14px;
        color: #999;
        line-height: 4rem;
        flex: 0 0 2rem;
      }

      .pic {
        width: 3rem;
        height: 3rem;
        flex: 0 0 3rem;
        margin: 0.5rem;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .technician-right {
        padding: 0.3rem;
        display: flex;
        flex-direction: column;

        .gray {
          flex: 1;
        }

        .address {
          color: #ccc;
        }
      }

      .top {
        display: flex;

        p {
          font-weight: bold;
          line-height: 1.3rem;
          margin-right: 0.5rem;
        }

        .star {
          flex: 1;
          text-align: right;
        }
      }

      .gray {
        font-size: 12px;
        color: #b0b0b0;
        text-align: left;
      }

      .describe1 {
        font-size: 12px;
        color: #ccc;
        text-align: left;
        padding-top: 0.3rem;
        width: 15rem;
      }
    }

    .box-warp {
      display: flex;
      flex-wrap: wrap;

      .time-item {
        width: 4rem;
        height: 2.5rem;
        line-height: 2.5rem;
        text-align: center;
        background-color: #fffaf1;
        border-radius: 0.5rem;
        color: #333;
        margin: 0.5rem;
      }

      .active {
        background-color: #f49f19;
        color: #fff;
      }

      .disabled {
        background-color: #e1e1e1;
        color: #fff;
      }
    }

    .text-over {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
    }
  }
</style>
