<!-- 抢团插件：抢团列表 -->
<template>
  <div>
    <div class="group_into">
      <h2>以下小伙伴抢团中，可直接参与</h2>
      <div class="more">
        <span @click="showGroupMore()">查看更多</span>
        <i class="fa fa-angle-right"></i>
      </div>
      <div class="into_bg_color" @touchmove.stop>
        <van-swipe :style="` height:${list.length > 0 ? (list[0].length > 0 ? '120px' : '60px') : 'auto'} `" vertical :autoplay="2000" :show-indicators="false">
          <van-swipe-item v-for="(teamItem, itemIndex) in list" :key="itemIndex">
            <div class="into_user" v-for="userItem in teamItem" :key="userItem.id">
              <div class="user">
                <img :src="userItem.avatar" />
              </div>
              <ul class="time">
                <li class="time_a">
                  <div>{{ userItem.nickname }}</div>
                  <div>还差{{ userItem.surplus_member }}人成团</div>
                </li>
                <li class="time_b">
                  <div>
                    剩余<span>
                      <van-count-down :time="fun.getTimeDifference(userItem.end_time)" format="DD天HH时mm分ss秒" @finish="hideIdexbb"></van-count-down>
                    </span>
                  </div>
                  <div>{{ num }}人团</div>
                </li>
              </ul>
              <button @click="clickAdd(userItem.leader_id)" v-if="userItem.is_oneself == 0" type="button">去参团</button>
              <button @click="clickAdd(userItem.leader_id)" v-else type="button">邀请好友</button>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
    <van-popup v-model="show2" position="center" round get-container="#appMain" :style="{ width: this.fun.getPhoneEnv() == 3 ? '375px' : '88%' }">
      <div class="open_group">
        <p>以下小伙伴抢团中，可直接参与</p>
        <div class="icon_close" @click="show2 = false">
          <i class="iconfont icon-close11"></i>
        </div>
        <div class="setMaxH">
          <div class="into_bg_color" v-if="!fun.isTextEmpty(list)">
            <div v-for="(item, index) in list" :key="index">
              <div class="into_user" v-for="userItem in item" :key="userItem.id" @click.stop="clickAdd(userItem.leader_id)">
                <div class="user">
                  <img :src="userItem.avatar" />
                </div>
                <ul class="time">
                  <li class="time_a">
                    <div>{{ userItem.nickname }}</div>
                    <div>还差{{ userItem.surplus_member }}人成团</div>
                  </li>
                  <li class="time_b">
                    <div>
                      剩余<span v-if="userItem.end_time">
                        <van-count-down :time="fun.getTimeDifference(userItem.end_time)" format="DD天HH时mm分ss秒" @finish="hideIdexbb"></van-count-down>
                      </span>
                    </div>
                    <div>{{ num }}人团</div>
                  </li>
                </ul>
                <button @click.stop="clickAdd(userItem.leader_id)" v-if="userItem.is_oneself == 0" type="button">加入该团</button>
                <button @click.stop="clickAdd(userItem.leader_id)" v-else type="button">邀请好友</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    team: {
      type: Array,
      default: () => []
    },
    num: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      list: [],
      show2: false
    };
  },

  // activated: {},

  components: {},

  // computed: {},

  mounted() {
    this.init();
  },

  methods: {
    init() {
      const teamData = this.team;
      const teams = [];
      let startIndex = 0;
      let loopCount = Math.ceil(teamData.length / 2);
      for (let index = 0; index < loopCount; index++) {
        teams.push(teamData.slice(startIndex, startIndex + 2));
        startIndex += 2;
      }
      this.list = teams;
    },
    //显示去参团列表弹层
    showGroupMore() {
      if (this.list.length == 0) {
        Toast("抱歉，暂无更多可参与的团");
        return;
      }
      this.show2 = true;
    },
    hideIdexbb() {
      let nowTimes = Math.round(new Date() / 1000); //获取当前时间戳
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].end_time <= nowTimes) {
          if (i == 0) {
            this.list.shift(); //删除并返回数组的第一个元素
            return this.list;
          } else if (i == length - 1) {
            this.list.pop(); //删除并返回数组的最后一个元素
            return this.list;
          } else {
            this.list.splice(i, 1); //删除下标为i的元素
            return this.list;
          }
        }
      }
    },
    //加入该团按钮
    clickAdd(oid) {
      this.$router.push(this.fun.getUrl("grabGroup_detail", { id: oid }));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.group_into {
  background: #fff;
  margin: 0.625rem 0;
  padding: 0.875rem;
  position: relative;

  h2 {
    font-weight: normal;
    font-size: 15px;
    margin-bottom: 0.625rem;
    text-align: left;
  }

  .more {
    position: absolute;
    top: 0.875rem;
    right: 0.875rem;
    display: flex;
    color: #8c8c8c;
    font-size: 12px;

    .fa {
      font-size: 1rem;
      margin-left: 0.375rem;
    }
  }

  .into_bg_color {
    background-color: #f5f5f5;
    border-radius: 0.125rem;
    padding: 0.375rem;
  }

  .into_user {
    display: flex;
    align-items: center;
    background: #fff;
    padding: 0.5rem;
    margin-bottom: 10px;

    .user {
      width: 2.25rem;
      height: 2.25rem;
      background: #f2f2f2;
      border-radius: 2rem;
      overflow: hidden;
      flex-shrink: 0;

      img {
        width: 100%;
      }
    }

    .time {
      width: 14.3125rem;
      text-align: left;

      li {
        margin: 0 0.625rem;
        display: flex;
        justify-content: space-between;
      }

      .time_a {
        font-size: 0.75rem;
      }

      .time_b {
        font-size: 0.75rem;
        color: #8c8c8c;

        span {
          color: #f15353;
          display: inline-block;

          .van-count-down {
            font-size: 0.75rem;
            color: #f15353;
          }
        }
      }
    }

    button {
      border: none;
      background: #ff6000;
      color: #fff;
      width: 3.875rem;
      height: 1.625rem;
      border-radius: 1rem;
      font-size: 12px;
    }
  }
}

.open_group {
  background: #fff;
  padding: 0.625rem;
  border-radius: 0.5rem;

  p {
    font-size: 14px;
    margin-bottom: 0.625rem;
  }

  .icon_close {
    position: absolute;
    top: 0.25rem;
    right: 0;
    width: 2.5rem;
    height: 2.5rem;

    .iconfont {
      line-height: 2.5rem;
      font-size: 0.875rem;
      color: #999;
    }
  }

  .setMaxH {
    max-height: 12rem;
    overflow: scroll;

    .into_bg_color {
      background-color: #f5f5f5;
      border-radius: 0.125rem;
      padding: 0.375rem;
    }

    .into_user {
      display: flex;
      align-items: center;
      background: #fff;
      padding: 0.5rem;

      .user {
        width: 2.25rem;
        height: 2.25rem;
        background: #f2f2f2;
        border-radius: 2rem;
        overflow: hidden;

        img {
          width: 100%;
        }
      }

      .time {
        width: 11.5rem;
        text-align: left;

        li {
          margin: 0 0.625rem;
          display: flex;
          justify-content: space-between;
        }

        .time_a {
          font-size: 0.75rem;
        }

        .time_b {
          font-size: 0.75rem;
          color: #8c8c8c;

          span {
            color: #f15353;
          }
        }
      }

      button {
        border: none;
        background: #ff6000;
        color: #fff;
        width: 3.875rem;
        height: 1.625rem;
        border-radius: 1rem;
        font-size: 12px;
      }
    }
  }
}
</style>
