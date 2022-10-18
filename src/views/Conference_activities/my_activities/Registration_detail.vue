<template>
  <div id="Registration-detail">
    <c-title :hide="false" text="报名详情"></c-title>
    <div class="detail-content">
      <div class="top">
        <div class="left-image">
          <img :src="has_one_activity.thumb" />
        </div>
        <div class="right-info">
          <p class="title">{{ has_one_activity.title }}</p>
          <p class="address">{{ city.substr(0, 2) }}|{{ has_one_activity.address }}</p>
          <p class="status">
            <span class="people">人数:{{ detail.number }}人</span><span v-if="has_one_order.price > 0">实付:{{ $i18n.t("money") }}{{ has_one_order.price }}</span
            ><span v-if="has_one_order.price <= 0">免费</span>
          </p>
        </div>
        <div class="time">
          <i class="iconfont icon-record_time"></i><span>{{ timestampToTime(has_one_activity.start_time) }}</span
          ><span>至{{ timestampToTime(has_one_activity.end_time) }}</span>
        </div>
      </div>
      <diyform :datas="datas" :payStatus="payStatus" :form_data_id="!fun.isTextEmpty(form_data_id) ? form_data_id : ''" :type="type"></diyform>
    </div>
  </div>
</template>
<script>
import Registration_detailcontroller from "./Registration_detailcontroller";
export default Registration_detailcontroller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#Registration-detail {
  .detail-content {
    .top {
      padding: 0.5rem 0.8rem;
      display: flex;
      flex-wrap: wrap;
      background-color: #fff;

      .left-image {
        width: 8rem;
        height: 6rem;
        display: flex;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .right-info {
        margin-left: 0.5rem;
        display: flex;
        align-items: baseline;
        flex-direction: column;
        flex: 1;
        justify-content: space-between;

        .address {
          text-align: right;
          width: 100%;
          color: #999;
          margin-bottom: 5px;
        }

        .title {
          margin-bottom: 5px;
          text-align: left;
          display: -webkit-box;
          overflow: hidden;
          white-space: normal;
          text-overflow: ellipsis;
          word-wrap: break-word;
          -webkit-line-clamp: 2;

          /* autoprefixer: off */
          -webkit-box-orient: vertical;
        }

        .status {
          display: flex;
          justify-content: space-between;
          width: 100%;

          .people {
            margin-right: 10px;
            color: #f15353;
          }
        }
      }

      .time {
        margin-top: 5px;
        color: #999;
        display: flex;
        align-items: center;
      }
    }

    .bottom {
      margin-top: 1rem;
      background-color: #fff;
      padding-bottom: 10px;

      .yd-cell-item {
        padding: 0 0.8rem !important;
        border-bottom: solid 1px #ccc;

        .yd-cell-left {
          display: flex;
          align-items: center;

          b {
            color: #f15353;
          }
        }
      }

      .piture {
        padding: 0 0.8rem;

        p {
          text-align: left;
          margin-bottom: 5px;
          display: flex;
          align-items: center;

          b {
            color: #f15353;
          }
        }

        .piture-image {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          font-size: 0;

          div:nth-child(4n) {
            margin-right: 0;
          }

          div {
            width: 22.5%;
            margin-top: 1rem;
            margin-right: 3.33%;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
