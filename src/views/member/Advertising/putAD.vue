<!-- 广告投放 -->
<template>
  <div id="Advertising-putAD">
    <c-title :hide="false" text="投放广告"></c-title>
    <van-cell-group>
      <van-field v-model="reward_total" type="digit" label="奖励人数" placeholder="请输入奖励人数" :border="false" />
      <van-field v-model="reward_amount_total" type="number" label="奖励总数" placeholder="请输入奖励总额" :border="false" :error-message="`最低奖励金额${configInfo.min_amount}元`" />
      <van-cell value="奖励方式" :border="false" class="diy-cell-style1">
        <template #extra>
          <van-radio-group v-model="reward_type" direction="horizontal">
            <van-radio name="1" checked-color="#ee0a24">固定金额</van-radio>
            <van-radio name="2" checked-color="#ee0a24">随机金额</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
    </van-cell-group>

    <div class="select-ADput">
      <div class="titel-border">
        <div class="border-r"></div>
        广告列表
      </div>

      <div class="list">
        <div class="list-child" :class="{ 'select-class': advertising_apply_id == item.id }" @click="selectAdID(item.id, item.video_time)" v-for="item in list" :key="item.id">
          <div class="ad-imgs">
            <img :src="item.video_cover" alt="" />
            <i class="iconfont icon-all_select_active" v-show="advertising_apply_id == item.id"></i>
          </div>
          <div class="ad-titles">{{ item.title }}</div>
          <div class="ad-times">{{ item.video_time }}s</div>
        </div>
      </div>
      <yz-blank :datas="list" text="暂无广告可选择,请先发布广告再进行投放！"></yz-blank>
    </div>

    <div class="submit-btns set-pc-styleLeft" @click.stop="submitPut">
      <div class="btn-box">提交</div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import yzBlank from "components/ui_components/yz_blank";
export default {
  data() {
    return {
      configInfo: {},
      reward_total: null,
      reward_amount_total: null,
      reward_type: "1",
      list: [],
      videoTime: 0,
      advertising_apply_id: null
    };
  },

  created() {
    this.getData();
  },

  components: { yzBlank },

  computed: {},

  methods: {
    getData() {
      $http
        .get("plugin.ad-serving.frontend.advertising.index.getPutInAdvertisingData", {}, "")
        .then(response => {
          if (response.result === 1) {
            this.configInfo = response.data.config;
            this.list = response.data.list;
            if (Number(this.configInfo.min_amount) < 0.01) this.configInfo.min_amount = 0.01;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    selectAdID(id, time) {
      this.advertising_apply_id = id;
      this.videoTime = time;
    },
    submitPut() {
      if (Number(this.reward_total) < 1) {
        Toast("请填写奖励人数");
        return;
      }
      if (Number(this.reward_amount_total) < Number(this.configInfo.min_amount)) {
        Toast(`最低奖励金额${this.configInfo.min_amount}元`);
        return;
      }
      if (!this.advertising_apply_id) {
        Toast("请选择广告");
        return;
      }
      if (Number(this.videoTime) > Number(this.configInfo.video_limit)) {
        Toast(`视频时长最高为${this.configInfo.video_limit}秒`);
        return;
      }
      let json = {
        reward_total: this.reward_total,
        reward_amount_total: this.reward_amount_total,
        reward_type: this.reward_type,
        put_in_type: this.$route.params.tag == "video" ? "2" : "1", //投放类型1-直播间，2-短视频
        put_in_id: this.$route.params.id,
        advertising_apply_id: this.advertising_apply_id
      };
      $http
        .get("plugin.ad-serving.frontend.advertising.index.putInAdvertisingAction", json, "")
        .then(response => {
          Toast(response.msg);
          if (response.result === 1) {
            this.$router.go(-1);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#Advertising-putAD {
  padding: 0 0 100px;

  .diy-cell-style1 {
    .van-cell__value {
      width: 6.2em;
      flex: none;
    }
  }

  .select-ADput {
    margin-top: 0.875rem;
    background: #fff;
    padding: 0.875rem;

    .titel-border {
      height: 1.125rem;
      line-height: 1.125rem;
      font-size: 16px;
      color: #333;
      margin-bottom: 0.875rem;
      display: flex;
      align-items: center;

      .border-r {
        height: 0.875rem;
        width: 3px;
        background: #f14e4e;
        margin-right: 0.375rem;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    }

    .list {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      justify-items: center;

      .list-child {
        width: 7rem;
        padding: 0.375rem;
        display: flex;
        flex-direction: column;
        border: 1px solid #fff;
        border-radius: 0.313rem;

        .ad-imgs {
          width: 6.25rem;
          height: 7.813rem;
          background-color: #b1b1b1;
          border-radius: 0.313rem;
          overflow: hidden;
          position: relative;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .icon-all_select_active {
            position: absolute;
            top: 0.375rem;
            right: 0.375rem;
            color: #f14e4e;
          }
        }

        .ad-titles {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          font-size: 12px;
          line-height: 0.938rem;
          margin: 0.5rem 0;
        }

        .ad-times {
          color: #ef3532;
          font-size: 12px;
        }
      }

      .select-class {
        border-color: #ef3532;
      }
    }
  }

  .submit-btns {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0.75rem 1.5rem;
    background: #fff;

    .btn-box {
      width: 100%;
      height: 2.5rem;
      line-height: 2.5rem;
      background-color: #ef3532;
      border-radius: 1.25rem;
      text-align: center;
      color: #fff;
      font-size: 15px;
    }
  }
}
</style>
