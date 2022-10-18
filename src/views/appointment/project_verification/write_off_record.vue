<template>
  <div id="store_verification">
    <c-title text='使用记录'></c-title>
    <div class="top_line">
      <div class="detail_val">
        <van-cell-group>
          <van-field v-model="project_name" :placeholder="projectName + '名称'" />
          <van-field v-model="store_name" placeholder="商户名称" />
          <div class="select_type" @click="showSelect = true">
            <span>{{select_use_type ? select_use_type : '全部'}}</span>
            <van-icon name="arrow-down" ></van-icon>
          </div>
          <div class="search"><span class="name" @click="btnSearch">搜索</span></div>
        </van-cell-group>
      </div>
      <div class="date">
        <div class="date_detail">
          <van-cell title="选择日期区间" :value="date" @click="showPopup"></van-cell><span style="width: 100%;">{{ start_date_show || '起始时间'}} - {{ end_date_show || '终止时间'}}</span>
          <van-icon name="arrow" @click="showPopup" v-if="!start_date_show || !end_date_show"/>
          <van-icon name="cross" v-if="start_date_show || end_date_show" @click="btnDelTime"/>
        </div>
        <van-popup v-model="popupShow" position="bottom" :style="{ height: '50%' }" :close-on-click-overlay="false">
          <van-datetime-picker v-model="currentDate" type="date" title="选择年月" :formatter="formatter" @cancel="btnCancel" @confirm="btnFinished" />
        </van-popup>
      </div>
    </div>
    <d-list :loading="upgradeCodeLoading" :finished="upgradeCodeFinished" @load="getWriteOff()" v-if="!show">
      <div class="bottom_line" v-for="item in WriteOffRecordData" style="background: #fff; margin-bottom: 0.8rem;" :key="item.id">
        <div class="top">
          <span class="date">{{ item.created_at }}</span>
          <span class="name">{{ item.store_name }}</span>
        </div>
        <div class="bottom">
          <div class="img_row"><img :src="item.project_thumb" alt="" /></div>
          <div class="middle">
            <span class="project_name">{{ item.project_title }}</span>
            <div class="num">
              <span>总次数：{{ item.total_count }}</span>
              <span>未使用次数：{{ item.total_rest_count }}</span>
            </div>
            <span class="verification_name" v-if="item.use_type_h5 == 1">核销员：{{ item.worker_nickname }}</span>
            <span class="verification_name" v-if="item.use_type_h5 == 2">受赠者：{{ item.transfer_nickname }}</span>
          </div>
          <div class="rigth">
            <span class="num">{{ item.used_count }}</span>
            <span class="verification_num">{{item.use_type_desc ? item.use_type_desc : '核销使用'}}</span>
          </div>
        </div>
      </div>
    </d-list>
    <serviceCard></serviceCard>

    <van-action-sheet v-model="showSelect" :actions="actions" @select="onSelectType" />
  </div>
</template>

<script>
import write_off_record_controller from "./write_off_record_controller";

export default write_off_record_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#store_verification {
  .top_line {
    .van-cell-group {
      display: flex;
      align-items: center;
      flex-flow: wrap;
      padding-left: 1.07rem;

      .van-cell {
        border: solid 0.04rem #d5d5d5;
        border-radius: 0.14rem;
        margin: 1.61rem 0.71rem 1.61rem 0;
        // flex: 5;
        line-height: normal;
        width: 7rem;
        height: 2.14rem;
        display: flex;
        align-items: center;
      }

      .search {
        // flex: 3;
        margin-right: 1.07rem;
        margin-bottom: 0.7rem;

        .name {
          background-color: #ce811d;
          color: #fff;
          padding: 0.4rem 0.75rem;
          border-radius: 0.14rem;
        }
      }
    }

    .date {
      .date_detail {
        display: flex;
        align-items: center;
        background: #fff;
        margin-bottom: 0.8rem;

        .van-cell {
          font-size: 20px;
          width: 70%;
        }
      }

      .van-cell__title {
        font-size: 14px;
        display: flex;
      }

      .van-cell__value {
        font-size: 14px;
        display: contents;
      }

      .van-icon {
        margin-right: 1.07rem;
      }
    }

    .select_type {
      border: solid 0.04rem #d5d5d5;
      border-radius: 0.14rem;
      margin: 1.61rem 0.71rem 1.61rem 0;
      width: 5.5rem;
      line-height: normal;
      height: 2.14rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .bottom_line {
    background: #fff;
    margin-bottom: 1rem;

    .top {
      display: flex;
      justify-content: space-between;
      padding: 1.11rem 1.11rem 0 1.11rem;

      .date {
        font-size: 14px;
        color: #737373;
      }

      .name {
        font-size: 15px;
        color: #333;
      }
    }

    .bottom {
      padding: 1.07rem 1.11rem;
      display: flex;
      // justify-content: space-between;
      img {
        width: 4.71rem;
        height: 4.71rem;
        border-radius: 0.36rem;
        margin: 0;
      }

      .middle {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;

        .project_name {
          color: #333;
          font-size: 14px;
          margin: 0 0 0 0.61rem;
          text-align: left;
          font-weight: bold;
          word-break: break-all;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .num {
          display: flex;
          margin: 0 0 0 0.61rem;
          color: #ce811d;
          justify-content: space-between;
          width: 100%;
          font-size: 12px;
        }

        .verification_name {
          // display: flex;
          width: 10rem;
          font-size: 12px;
          text-align: left;
          color: #333;
          margin: 0 0 0 0.61rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .rigth {
        display: flex;
        flex-direction: column;
        text-align: right;
        justify-content: flex-start;
        align-items: center;
        margin-left: 1.5rem;

        .num {
          color: #ce811d;
          font-size: 26px;
          width: 4.17rem;
          display: flex;
          justify-content: center;
        }

        .verification_num {
          width: 4.17rem;
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }

  .suspension {
    display: flex;
    flex-direction: column;
    position: fixed;
    bottom: 10%;
    transform: translateX(10rem);
    right: 50%;

    img {
      width: 2.5rem;
      height: 2.5rem;
      margin-bottom: 1.21rem;
    }
  }
}
</style>
