<!-- 测试分享页进入 -->
<template>
  <div id="skin_share">
    <c-title :hide="false" :text="'测肤结果'"></c-title>
    <div class="m-result main-bg">
      <div class="m-result-top ">
        <div class="m-r-t-left" v-if="info.report && info.report.member">
          <img :src="info.report.member.avatar_image" alt="" />
          <div class="name">{{ info.report.member.nickname }}</div>
        </div>
      </div>
      <div class="m-result-center">
        <div class="m-result-left" v-if="info.report">
          <van-circle v-model="currentRate" :rate="info.report.composite_score" size="100px" stroke-width="100" layer-color="#f8f8f8" color="#fe5a73" :text="info.report.composite_score"
            ><template #default>
              <div class="score-box">{{ info.report.composite_score }}</div>
            </template></van-circle
          >
          <div class="m-result-l-title">综合评分</div>
        </div>
        <div class="m-result-right">
          <div class="m-r-r-chilid" v-for="item in info.report_detail" :key="item.id">
            {{ item.target.target_name }}
            <div class="r-chilid-text">{{ item.value_desc ? item.value_desc : item.value + "岁" }}</div>
          </div>
        </div>
      </div>
      <div class="skin-title" v-if="!fun.isTextEmpty(info.question)">主要问题</div>
      <div class="skin-question-chlid">
        <div class="small-btn" v-for="(item, i) in info.question" :key="i">{{ item }}</div>
      </div>
    </div>
    <router-link :to="fun.getUrl('skinHome', {})" class="share-btn" tag="div">我要测肤</router-link>
  </div>
</template>

<script>
import cTitle from "components/title";

export default {
  data() {
    return {
      currentRate: 0,
      info: {}
    };
  },

  components: { cTitle },

  computed: {},

  mounted() {
    this.getData();
  },

  methods: {
    getData() {
      $http.get("plugin.skin-check.api.skin-check.share-data", { report_id: this.$route.params.id }, "...").then(
        response => {
          if (response.result === 1) {
            this.info = response.data;
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
#skin_share {
  padding: 10px 0.875rem 0;

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
          flex: 1;
          margin-left: 0.5rem;
          font-size: 1rem;
          font-weight: bold;
          text-align: left;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }
      }

      .m-r-t-right {
        width: 5.875rem;
        height: 2rem;
        line-height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #fe5a73;
        color: #fe5a73;
        font-size: 0.875rem;
        border-radius: 3rem;

        i {
          font-size: 1.5rem;
        }
      }

      .m-result-right {
        display: flex;
        flex-direction: column;

        .m-r-r-chilid {
          // width: 8.75rem;
          height: 2.25rem;
          line-height: 2.25rem;
          background-color: #fff1f3;
          border-radius: 2rem;
          overflow: hidden;
          display: flex;
          margin-bottom: 0.375rem;
          padding: 0 1rem;
          font-size: 0.75rem;

          .r-chilid-text {
            font-size: 1rem;
            color: #333;
            font-weight: bold;
            margin-left: 0.5rem;
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

  .m-result-left {
    margin: 0 1rem;
    width: 6.25rem;
    height: 6.25rem;

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

  .main-bg {
    margin-bottom: 1rem;
    background-color: #fff;
    box-shadow: 0 1px 3px 0 #ffbec8;
    border-radius: 0.625rem;
    padding: 0.875rem;

    .skin-title {
      height: 3rem;
      line-height: 3rem;
      color: #000;
      font-size: 1rem;
      text-align: left;
      font-weight: bold;
    }

    .skin-question-chlid {
      display: flex;
      flex-wrap: wrap;

      .small-btn {
        padding: 0 0.875rem;
        height: 1.5rem;
        line-height: 1.5rem;
        background-color: #fff1e6;
        border-radius: 1rem;
        border: solid 1px #fe9d56;
        color: #fe9d56;
        font-size: 0.75rem;
        margin: 0 0.625rem 0.625rem 0;
      }
    }
  }

  .share-btn {
    width: 80%;
    height: 2.5rem;
    line-height: 2.5rem;
    color: #fff;
    background-color: #fe5a73;
    border-radius: 1.25rem;
    margin: 0 auto;
  }
}
</style>
