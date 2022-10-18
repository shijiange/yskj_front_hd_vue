<template>
  <div id="work_time">
    <c-title :hide="false" :text="'添加工作时间'">
    </c-title>

    <c-calendar ref="calendar"
                :events="calendarEvents"
                @select="selectedDay"
                @monthChanged="monthChanged">
    </c-calendar>

    <div class="main">
      <div class="items" @click="getStore">
        <p class="title">工作门店</p>
        <div class="gray"><span style="flex: 1;">{{chooseStore.store_name || "请选择门店"}}</span><i
          class="iconfont icon-advertise-next"></i></div>
      </div>

      <div class="items" v-if="chooseStore.id && from !== 'technician'">
        <p class="title">工作时间（默认）</p>
        <div class="gray times" @click="addDefaultTime" v-if="default_time.length > 0"><span
          v-for="(date, index) in default_time" :key="index">{{date.work_hour_start}}-{{date.work_hour_end}}</span>
        </div>
        <div v-else class="gray times" @click="addDefaultTime"><span>添加工作时间</span></div>
      </div>

      <div class="items" v-if="chooseStore.id">
        <div class="title-box">
          <p class="title">{{today}}</p>
          <van-switch v-model="isRest" :loading="isChange" style="align-self: center;" active-color="#15af00" inactive-color="#787878" size="22" @change="changeDayStatus" />
          <p class="mr"><span class="add" v-if="isRest" @click="changeDayStatus('rest')">正常上班</span></p>
          <p class="mr"><span class="rest" v-if="!isRest" @click="changeDayStatus()">休息</span></p>
          <p><span class="edit" @click="addTime">添加工作时间</span></p>
        </div>

        <div class="time-box">
          <div class="time-item" v-for="item in day_time" :key="item.id">
            <p class="left" style="align-self: center;">{{item.work_hour_start}}-{{item.work_hour_end}}</p>
            <div class="right">
              <van-switch v-model="item.status" :loading="isChange" active-color="#15af00" inactive-color="#787878" size="22" @change="changeStatus(item,$event)" />
              <p class="mr"><span class="add" @click="changeStatus(item,'rest')" v-if="item.status">正常上班</span></p>
              <p class="mr"><span class="rest" @click="changeStatus(item,)" v-if="!item.status">休息</span></p>
              <p style="align-self: center;"><span class="edit" @click="editTime(item)">编辑</span></p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <van-popup v-model="showDefault" round>
      <div class="popTime">
        <p class="time_title">添加工作时间</p>
        <p class="tips">如：08:30-10:00</p>
        <div class="pop-time-box">
          <div class="time" v-for="(date, i) in default_time" :key="i"><span>{{date.work_hour_start}}-{{date.work_hour_end}}</span><img
            @click="deleteTime(date)" class="close" src="../../../assets/images/close-orange.png" alt=""></div>
          <div class="time" @click="editTime"><span>添加</span></div>
        </div>
        <div class="button">
          <div class="cancle" @click="showDefault = false">取消</div>
        </div>
      </div>
    </van-popup>

    <van-popup v-model="showDay" round>
      <div class="popTime">
        <p class="time_title">添加工作时间</p>
        <p class="tips">如：08:30-10:00</p>
        <div class="pop-time-box">
          <div class="time" v-for="(date, i) in day_time" :key="i">
            <span>{{date.work_hour_start}}-{{date.work_hour_end}}</span></div>
          <div class="time" @click="editTime"><span>添加</span></div>
        </div>
        <div class="button">
          <div class="cancle" @click="showDay = false">取消</div>
        </div>
      </div>
    </van-popup>

    <van-popup v-model="show1" round>
      <div class="popTime">
        <p class="time_title">编辑工作时间</p>
        <p class="tips">如：08:30-10:00</p>
        <div class="time"><span @click="chooseTime('start', choose_start)">{{choose_start || "00:00"}}</span> - <span
          @click="chooseTime('end',choose_end)">{{choose_end || "00:00"}}</span></div>
        <div class="button">
          <div class="cancle" @click="clearTime">取消</div>
          <div class="submit" @click="submitTime">提交</div>
        </div>
      </div>
    </van-popup>

    <van-popup
      v-model="showTime"
      position="bottom"
    >
      <van-datetime-picker
        v-model="currentTime"
        type="time"
        @confirm="confirmTime"
        @cancel="showTime = false"
      />
    </van-popup>

    <van-popup
      v-model="showStore"
      round
    >
      <ul class="store_list">
        <p style="text-align: center; font-size: 16px; font-weight: bold; padding: 0.5rem;">选择门店</p>
        <li v-for="(item,index) in store" :key="index" @click="choose(item)">
          {{item.store_name}}
        </li>
      </ul>
    </van-popup>

  </div>
</template>

<script>
import add_work_time_controller from "./add_work_time_controller";

export default add_work_time_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #work_time {
    background: #fff;

    .popTime {
      width: 18.125rem;
      min-height: 17.313rem;

      .time_title {
        font-size: 18px;
        font-weight: bold;
        color: #000;
        padding-top: 1.5rem;
      }

      .tips {
        color: #ccc;
        margin: 0.5rem;
      }

      .time {
        width: 13.563rem;
        height: 2.188rem;
        line-height: 2.188rem;
        font-size: 16px;
        background-color: #fff2e6;
        border-radius: 1.094rem;
        color: #f4a82e;
        margin: 3rem auto;
      }

      .button {
        display: flex;
        color: #fff;
        margin-bottom: 1rem;
      }

      .cancle {
        width: 6.25rem;
        height: 1.875rem;
        line-height: 1.875rem;
        background-color: #ccc;
        border-radius: 0.938rem;
        flex: 1;
        margin: 0 1rem;
      }

      .submit {
        width: 6.25rem;
        height: 1.875rem;
        line-height: 1.875rem;
        background-color: #f4a82e;
        border-radius: 0.938rem;
        flex: 1;
        margin: 0 1rem;
      }

      .pop-time-box {
        display: flex;
        flex-wrap: wrap;
        margin: 1rem auto;
        max-height: 13rem;
        overflow-y: scroll;

        .time {
          position: relative;
          width: 7.813rem;
          height: 2.188rem;
          line-height: 2.188rem;
          font-size: 16px;
          background-color: #fff2e6;
          border-radius: 1.094rem;
          color: #f4a82e;
          margin: 1rem 0.5rem;
        }

        .close {
          position: absolute;
          right: -5px;
          top: -5px;
          width: 1rem;
          height: 1rem;
          line-height: 1rem;
          background-color: #f4a82e;
          color: #fff;
          border-radius: 50%;
        }
      }

      .pop-time-box::-webkit-scrollbar {
        display: none;
      }
    }

    .main {
      padding: 1rem;
      text-align: left;
    }

    .items {
      margin-bottom: 1rem;
    }

    .title {
      font-weight: bold;
      font-size: 15px;
    }

    .gray {
      display: flex;
      background-color: #f7f7f7;
      border-radius: 5px;
      padding: 0.5rem;
      margin-top: 0.7rem;
    }

    .times {
      flex-wrap: wrap;

      span {
        margin-right: 0.8rem;
      }
    }

    .title-box {
      display: flex;
      align-self: center;

      .title {
        flex: 1;
        line-height: 1.7rem;
      }

      p {
        align-self: center;
      }
    }

    .rest {
      /* background-color: #787878; */
      border-radius: 10px;
      color: #787878;
      padding: 0.2rem 0.8rem;
      font-size: 12px;
    }

    .add {
      /* background-color: #15af00; */
      border-radius: 10px;
      color: #15af00;
      padding: 0.2rem 0.8rem;
      font-size: 12px;
    }

    .mr {
      margin-right: 0.5rem;
      align-self: center;
    }

    .time-item {
      display: flex;
      margin-top: 0.5rem;
      padding: 1rem 0.5rem;
      box-shadow: 0 0 9px 0 rgba(169, 169, 169, 0.24);
      border-radius: 3px;
    }

    .left {
      flex: 1;
    }

    .right {
      display: flex;
    }

    .edit {
      background-color: #f4a82e;
      border-radius: 10px;
      color: #fff;
      padding: 0.2rem 0.8rem;
      font-size: 12px;
    }

    .store_list {
      width: 16rem;
      max-height: 21rem;
      overflow-y: scroll;
      margin: 0.5rem;

      li {
        text-align: left;
        display: flex;
        padding: 0.59rem 1.16rem 0.63rem 0.63rem;
        border-bottom: 1px solid #f2f2f7;
      }
    }
  }
</style>
