<!-- 拼团列表组件 -->
<template>
  <div id="groupListCell">
    <div class="into_user">
      <div class="user">
        <img :src="thumb" />
      </div>

      <ul class="time">
        <li class="time_a">{{ username }} 开{{ num }}人团</li>
        <li class="time_b">
          剩余<span style="display: inline-block;"> <van-count-down class="vanCount" :time="time" format="DD天HH时mm分ss秒" @finish="finished"></van-count-down></span>,仅差<span>{{ lack }}</span
          >人
        </li>
      </ul>
      <button type="button" @click.stop="clickAdd('add')" v-if="!isLeader">加入该团</button>
      <button type="button" @click.stop="clickAdd('share')" v-else>邀请好友</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    thumb: {
      type: String,
      default: ""
    },
    username: {
      type: String,
      default: ""
    },
    num: {
      type: [String, Number],
      default: ""
    },
    time: {
      type: [String, Number],
      default: ""
    },
    isLeader: {
      type: Boolean,
      default: false
    },
    lack: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {};
  },

  activated() {},

  components: {},

  computed: {},

  mounted() {},

  methods: {
    finished() {
      this.$emit("finish");
    },
    clickAdd(e) {
      let data = {
        tag: e
      };
      this.$emit("click", data);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#groupListCell {
  margin: 0.5rem 0;

  .into_user {
    display: flex;
    align-items: center;

    .user {
      width: 2.25rem;
      height: 2.25rem;
      background: #f2f2f2;
      border-radius: 2rem;
      overflow: hidden;
      margin-right: 0.625rem;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .time {
      width: 14.3125rem;
      text-align: left;

      .time_a {
        font-size: 14px;
      }

      .time_b {
        font-size: 12px;
        color: #8c8c8c;

        span {
          color: #f15353;
        }

        .vanCount {
          color: #f15353;
          font-size: 12px;
        }
      }
    }

    button {
      border: none;
      background: #f15353;
      color: #fff;
      width: 4.5rem;
      height: 1.625rem;
      border-radius: 0.25rem;
      font-size: 12px;
    }
  }
}
</style>
