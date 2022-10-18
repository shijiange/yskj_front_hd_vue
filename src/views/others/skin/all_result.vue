<!-- 测肤完整报告 -->
<template>
  <div id="skin_all_result">
    <c-title :hide="false" :text="'测肤结果'"></c-title>
    <div class="m-result main-bg">
      <div class="m-result-top ">
        <div class="m-r-t-left">
          <img :src="memberInfo.avatar_image" alt="" />
          <div class="name">{{ memberInfo.nickname }}的测肤报告</div>
        </div>
        <div
          class="m-r-t-right"
          :style="{
            backgroundImage: 'url(' + (seal ? seal : require('../../../assets/images/skin/watermark.png')) + ')'
          }"
        ></div>
      </div>
      <div class="m-result-center">
        <div class="m-result-left">
          <van-circle v-model="currentRate" :rate="composite_score" size="100px" stroke-width="100" layer-color="#f8f8f8" color="#fe5a73" :text="composite_score"
            ><template #default>
              <div class="score-box">{{ composite_score }}</div>
            </template></van-circle
          >
          <div class="m-result-l-title">综合评分</div>
        </div>
        <div class="m-result-right">
          <div class="m-r-r-chilid" v-if="!fun.isTextEmpty(reportDetail.skinType)">
            {{ reportDetail.skinType.target_name }}
            <div class="r-chilid-text">{{ reportDetail.skinType.value_desc }}</div>
          </div>
          <div class="m-r-r-chilid" v-if="!fun.isTextEmpty(reportDetail.skinColor)">
            {{ reportDetail.skinColor.target_name }}
            <div class="r-chilid-text">{{ reportDetail.skinColor.value_desc }}</div>
          </div>
          <div class="m-r-r-chilid" v-if="!fun.isTextEmpty(reportDetail.skinAge)">
            {{ reportDetail.skinAge.target_name }}
            <div class="r-chilid-text">{{ reportDetail.skinAge.value }}岁</div>
          </div>
        </div>
      </div>
      <div class="m-result-bottom">
        <div class="m-r-b-l">您已击败{{ beat }}%的用户</div>
      </div>
      <div class="m-result-rank">NO:{{ $route.params.id }}</div>
    </div>

    <div class="skin-question main-bg">
      <div v-for="(item, i) in reportDetail" :key="i">
        <div class="skin-title">
          {{ item.target_name }}
          <div class="num-box" v-if="!fun.isTextEmpty(item.value_num)">{{ item.value_num }}个</div>
        </div>
        <div class="skin-index">
          <div class="skin-index-list" v-if="item.type_id != 4">
            <skin-circle :datas="item"></skin-circle>
          </div>
          <div v-if="item.type_id == 4 && !fun.isTextEmpty(item.explain_img)">
            <img :src="item.explain_img" alt="" style="width: 4rem;" />
          </div>
        </div>
        <div class="skin-description" v-if="!fun.isTextEmpty(item.explain)" v-html="item.explain"></div>
      </div>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import skinCircle from "./skin_circle";
import { Toast } from "vant";

export default {
  data() {
    return {
      seal: null,
      currentRate: 0,
      beat: null,
      composite_score: null,
      reportDetail: {},
      memberInfo: {}
    };
  },

  mounted() {
    this.getData();
  },

  components: { cTitle, skinCircle },

  computed: {},
  methods: {
    getData() {
      $http.get("plugin.skin-check.api.skin-check.complete-report", { report_id: this.$route.params.id }, "...").then(
        response => {
          if (response.result === 1) {
            this.seal = response.data.seal;
            this.beat = response.data.beat;
            this.reportDetail = response.data.report.reportDetail;
            this.memberInfo = response.data.report.member;
            this.composite_score = response.data.report.composite_score;
            this.fun.wxShare(
              "",
              {},
              {
                link: `${this.fun.getSiteRoot()}/addons/yun_shop/?menu#/skin/Share/${this.$route.params.id}?i=${this.fun.getKeyByI()}`
              }
            );
          } else {
            Toast(response.msg);
          }
        },
        response => {}
      );
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#skin_all_result {
  padding: 20px 0.875rem 70px;
  background: -moz-linear-gradient(top, #ffbec8 0%, #fff 25%);
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #ffbec8), color-stop(25%, #fff));
  background: -webkit-linear-gradient(top, #ffbec8 0%, #fff 25%);
  background: -o-linear-gradient(top, #ffbec8 0%, #fff 25%);
  background: -ms-linear-gradient(top, #ffbec8 0%, #fff 25%);
  background: linear-gradient(to bottom, #ffbec8 0%, #fff 25%);

  .main-bg {
    margin-bottom: 1rem;
    background-color: #fff;
    box-shadow: 0 1px 3px 0 #ffbec8;
    border-radius: 0.625rem;
    padding: 0 0.875rem;
  }

  .m-result {
    width: 100%;
    padding: 0.75rem 1rem;
    display: flex;
    flex-direction: column;

    .m-result-top,
    .m-result-center,
    .m-result-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .m-r-t-left {
        flex: 1;
        display: flex;
        line-height: 2.5rem;
        overflow: hidden;

        img {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 100%;
          overflow: hidden;
          margin: 0;
        }

        .name {
          text-align: left;
          flex: 1;
          margin-left: 0.5rem;
          font-size: 1rem;
          font-weight: bold;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }
      }

      .m-r-t-right {
        width: 3.625rem;
        height: 3.625rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #bf1818;
        font-size: 0.875rem;
        line-height: 1rem;
        font-weight: bold;
        padding: 0.625rem;
        // background: url(../../../assets/images/skin/watermark.png);
        background-size: 100% 100%;
        // transform: rotate(-30deg);
      }

      .m-result-right {
        display: flex;
        flex-direction: column;

        .m-r-r-chilid {
          width: 8.75rem;
          height: 2.25rem;
          line-height: 2.25rem;
          background-color: #fff1f3;
          border-radius: 2rem;
          overflow: hidden;
          display: flex;
          margin-bottom: 0.375rem;
          padding: 0 1rem;
          font-size: 0.75rem;
          flex-shrink: 0;

          .r-chilid-text {
            text-align: left;
            font-size: 1rem;
            color: #333;
            font-weight: bold;
            margin-left: 0.5rem;
            overflow: hidden; /* 超出部分隐藏 */
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /* 规定段落中的文本不进行换行 */
            flex: 1;
          }
        }
      }

      .m-r-b-r {
        width: 6.25rem;
        height: 1.875rem;
        line-height: 1.875rem;
        color: #fff;
        background-color: #fe5a73;
        font-size: 0.75rem;
        border-radius: 1rem;
      }
    }

    .m-result-center {
      margin: 1rem 0;

      .m-result-l-title {
        color: #666;
        font-size: 0.75rem;
      }

      .m-result-left {
        margin: 0 1rem;

        /deep/.van-circle__text {
          font-size: 2rem;
          color: #fe5a73;
          font-weight: bold;
          position: relative;
        }

        /deep/.van-circle__text::before {
          position: absolute;
          content: "分";
          display: block;
          right: 12px;
          top: -5px;
          font-size: 1rem;
          font-weight: 400;
        }
      }
    }

    .m-result-rank {
      text-align: right;
      color: #666;
      font-size: 0.75rem;
      margin-top: 1.125rem;
    }
  }

  .score-box {
    font-size: 30px;
    color: #fe5a73;
    font-weight: 700;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    padding: 0 4px;
    top: 50%;
    left: 50%;
    position: absolute;
    letter-spacing: -1px;

    &::before {
      position: absolute;
      content: "分";
      display: block;
      right: -8px;
      top: 0;
      font-size: 14px;
      font-weight: 400;
    }
  }

  .skin-title {
    height: 3rem;
    line-height: 3rem;
    color: #333;
    font-size: 1rem;
    text-align: left;
    font-weight: bold;
    display: flex;
    align-items: center;

    .num-box {
      border: 1px solid #fe9d56;
      color: #fe9d56;
      padding: 0 0.875rem;
      height: 1.375rem;
      line-height: 1.375rem;
      border-radius: 1rem;
      font-weight: 400;
      font-size: 0.875rem;
      margin-left: 0.875rem;
    }
  }

  .skin-question {
    padding: 0 0.875rem 0.875rem;

    .skin-index {
      .skin-index-list {
        display: flex;
        align-items: center;

        .skin-list-name {
          width: 5rem;
          text-align: left;
          margin-right: 0.5rem;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }
      }
    }

    .skin-description {
      font-size: 0.75rem;
      line-height: 1.125rem;
      color: #666;
      text-align: left;
      margin-bottom: 0.875rem;
    }
  }
}
</style>
