<!-- 益生 等级进度条与益生用户信息 -->
<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>
    <div class="html-box">
      <div class="ys_member">
        <div class="progress-panel">
          <div class="steps">
            <div class="step" :style="{ width: (100 / level_list.length).toFixed(2) + '%' }" :class="{ 'active-step': index <= currentLevel }" v-for="(item, index) in level_list" :key="index">
              <div class="line"></div>
              <div class="icon">
                <img v-if="index > currentLevel" :src="require('@/assets/images/deposit_group/deposit_group_current_state.png')" alt="" />
                <img v-else :src="require('@/assets/images/deposit_group/deposit_group_last_stage.png')" alt="" />
              </div>
            </div>
          </div>
          <div class="next-level" v-if="info.next_condition">{{ info.next_condition }}</div>
        </div>
        <!-- 二期对接 -->
        <!-- info.account_info 数据为空时是数组，不为空则为对象 -->
        <div class="ys-member-info" v-if="info.account_info && Object.prototype.isPrototypeOf(info.account_info) && Object.keys(info.account_info).length !== 0">
          <div class="title">我的账户</div>
          <div class="list">
            <div class="cell" @click.stop="goUrl('Integral_love')">
              <div class="cell-size-13">{{ info.account_info.point }}<em></em></div>
              <div class="cell-size-10">冻结{{ info.account_info.frozen_point }}</div>
              <div class="cell-size-11">{{ optionName.integral }}</div>
            </div>
            <div class="cell" @click.stop="goUrl('love_index')">
              <div class="cell-size-13">{{ info.account_info.redPocket }}<em></em></div>
              <div class="cell-size-10">冻结{{ info.account_info.frozen_redPocket }}</div>
              <div class="cell-size-11">{{ optionName.love }}</div>
            </div>
            <div class="cell" @click.stop="goUrl('balance')">
              <div class="cell-size-13">
                <em style="font-size:12px;">{{ $i18n.t("money") }}</em
                >{{ info.account_info.money }}<em></em>
              </div>
              <div class="cell-size-10">
                冻结<em style="font-size:10px;">{{ $i18n.t("money") }}</em
                >{{ info.account_info.frozen_money }}
              </div>
              <div class="cell-size-11">{{ optionName.balance }}</div>
            </div>
            <div class="cell" @click.stop="goUrl('integral_v2')">
              <div class="cell-size-13">{{ info.account_info.flower }}<em></em></div>
              <div class="cell-size-10">冻结{{ info.account_info.frozen_flower }}</div>
              <div class="cell-size-11">{{ optionName.point }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 自定义样式
const css = function() {
  if (this.datas && this.datas.preview_color) {
    const { preview_color } = this.datas;

    return `
      .component-${this.id} .html-box {
          background-color: ${preview_color.color};
          background-image: url(${preview_color.isColor == 2 ? preview_color.image : ""});
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
      }
  `;
  }
};
export default {
  props: ["id", "datas"],
  data() {
    return {
      level_list: [],
      info: {},
      currentLevel: 0,
      optionName: {}
    };
  },

  created() {
    this.getData();
    try {
      let { point, balance, love, integral } = JSON.parse(localStorage.getItem("yz_basic_info")) || {};
      this.optionName.point = point;
      this.optionName.balance = balance;
      this.optionName.love = love;
      this.optionName.integral = integral;
    } catch (err) {
      // 错误处理
    }
  },

  components: {},

  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    }
  },

  mounted() {},

  methods: {
    goUrl(str) {
      this.$router.push(this.fun.getUrl(str));
    },
    getData() {
      $http
        .get("plugin.ys-system.frontend.member-info.index", {})
        .then(response => {
          if (response.result === 1) {
            this.level_list = response.data.level_list;
            this.info = response.data;
            this.currentLevel = this.level_list.findIndex(item => {
              return item.member_current_level == 1;
            });
          } else {
            this.$toast(response.msg);
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
.html-box {
  padding: 10px;
}
.ys_member {
  padding: 10px;
  border-radius: 15px;
  background-color: #fff;
  .progress-panel {
    padding: 10px;
    background: rgba($color: #ffc11e, $alpha: 0.1);
    border-radius: 3px;
    .steps {
      display: flex;
      margin: 10px 0 16px;
      .step {
        position: relative;
        .line {
          width: 100%;
          height: 10px;
          border-radius: 5px;
          background-color: #fec400;
          opacity: 0.2;
        }
        .icon {
          position: absolute;
          right: -5px;
          top: 50%;
          transform: translateY(-50%);
          height: 1.25rem;
          z-index: 2;
          img {
            height: 100%;
            object-fit: contain;
          }
        }
      }
      .active-step {
        .line {
          opacity: 1;
        }
        .icon {
          height: 1.875rem;
        }
      }
    }
    .next-level {
      text-align: left;
      font-size: 12px;
    }
  }
  .ys-member-info {
    .title {
      line-height: 30px;
      text-align: left;
      margin-top: 5px;
    }
    .list {
      display: flex;
      width: 100%;
      // overflow-x: scroll;
      .cell {
        flex: 1;
        flex-shrink: 0;
        font-weight: 600;
        line-height: 18px;
        .cell-size-13 {
          font-size: 14px;
          color: #403f3f;
        }
        .cell-size-10 {
          font-size: 10px;
          color: #757272;
        }
        .cell-size-11 {
          font-size: 11px;
          color: #323232;
        }
        em {
          font-size: 12px;
        }
      }
    }
    .van-swipe {
      padding-bottom: 10px;
      /deep/.van-swipe__indicators {
        bottom: 0px;
        .van-swipe__indicator {
          width: 14px;
          height: 4px;
          border-radius: 6px;
          background-color: #757272;
        }
      }
    }
    // .list::-webkit-scrollbar {
    //   /*滚动条整体样式*/
    //   width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    //   height: 10px;
    // }
    // .list::-webkit-scrollbar-thumb {
    //   /*滚动条里面小方块*/
    //   border-radius: 10px;
    //   background-color: #f15353;
    // }
    // .list::-webkit-scrollbar-track {
    //   /*滚动条里面轨道*/
    //   box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    //   background: #ededed;
    //   border-radius: 10px;
    // }
  }
}
</style>
