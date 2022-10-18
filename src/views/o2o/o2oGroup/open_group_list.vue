<!-- 开团列表 -->
<template>
  <div id="open_group_list">
    <van-nav-bar class="self-nav-style topmost-style" title="开团列表" right-text="筛选" left-arrow @click-left="onClickLeft" @click-right="onClickRight" placeholder fixed />
    <div class="list">
      <div class="list-child" v-for="(item, i) in list" :key="item.id">
        <div class="top-box">
          <div class="Numbering">编号：{{ item.id }}</div>
          <div class="status-name">{{ item.status_message }}</div>
        </div>
        <div class="member-info">
          <img :src="item.avatar" alt="" class="avtor" />
          <div class="member-name">{{ item.nickname }}</div>
        </div>
        <div class="activity-time">起止时间：{{ fun.timestampToTime(item.start_time) }} 至 {{ fun.timestampToTime(item.end_time) }}</div>
        <div class="grouping">
          <div class="buy-info" @click.stop="toDetail(item.id)">
            <div class="buy-img" v-for="(imgs, imgindex) in item.has_many_team_member" :key="imgindex">
              <img :src="imgs.has_one_member.avatar_image" alt="" />
            </div>
            {{ item.member_num }}人团 还差<em style="color: #f14e4e;">{{ item.member_num - item.has_many_success_member_count }}</em
            >人 <i class="iconfont icon-member_right"></i>
          </div>
          <div class="group-countDown" v-if="Number(item.end_time * 1000) > new Date().getTime()">
            剩余：<van-count-down :time="Number(item.end_time * 1000) - new Date().getTime()" format="DD 天 HH 时 mm 分 ss 秒" />
          </div>
        </div>
        <div class="operate-box">
          <div class="operate-child " v-if="item.status != 3" @click.stop="copyUrl(item.url)">
            <i class="iconfont icon-share"></i>
            拼团链接
          </div>
          <div class="operate-child line" @click.stop="changeEndTime(item.id, item.end_time)" v-if="item.status == 0 || item.status == 1">
            <i class="iconfont icon-seller-time"></i>
            修改时间
          </div>
          <div class="operate-child line" v-if="item.status == 0 || item.status == 1" @click="virtualTeam(item.id, i)">
            <i class="iconfont icon-fontclass-kehu"></i>
            虚拟成团
          </div>
        </div>
      </div>
    </div>
    <yz-blank :datas="list" text="暂无拼团数据" :isBtn="false"></yz-blank>
    <van-popup v-model="showFilter" position="right" :style="{ width: '70%', height: '100%' }">
      <div class="filter-box">
        <van-search v-model="leader_name" shape="round" background="#fff" placeholder="搜索团长昵称" />
        <div class="condition-name">层级</div>
        <div class="condition-list">
          <div class="condition-child " :class="[member_num == item.member_num ? 'active-filter' : '']" v-for="item in levels" :key="item.id" @click="setMember_num(item.member_num)">
            {{ item.member_num }}人团
          </div>
        </div>
        <div class="condition-name">拼团状态</div>
        <div class="condition-list">
          <div class="condition-child" :class="[status === item.id ? 'active-filter' : '']" v-for="item in statuslist" :key="item.id" @click="setStatus(item.id)">
            {{ item.name }}
          </div>
        </div>

        <div class="filter-submit-box">
          <div class="filter-btn" @click="showFilter = false">取消</div>
          <div class="filter-btn ok-bg" @click="getData(true)">确定</div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="showDatetime" position="bottom">
      <van-datetime-picker v-model="currentDate" type="datetime" title="选择完整时间" :formatter="formatter" @confirm="confirmTime" />
    </van-popup>
  </div>
</template>

<script>
import { Dialog, Toast } from "vant";
import yzBlank from "components/ui_components/yz_blank";
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      list: [],
      levels: [], //活动层级
      statuslist: [
        {
          id: 0,
          name: "提交"
        },
        {
          id: 1,
          name: "拼团中"
        },
        {
          id: 2,
          name: "成功"
        },
        {
          id: 3,
          name: "失败"
        }
      ],
      currentDate: new Date(),
      showFilter: false,
      showDatetime: false,
      time: 30 * 60 * 60 * 1000,
      leader_name: "",
      member_num: "",
      status: "",
      changeTimeID: null,

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },

  activated() {
    this.getData();
  },

  components: { yzBlank },

  computed: {},

  mounted() {},

  methods: {
    onClickLeft() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    },
    onClickRight() {
      this.showFilter = !this.showFilter;
    },
    changeEndTime(id, time) {
      this.changeTimeID = id;
      // let aaa = time.replace(new RegExp(/\./gm), "-");
      // console.log("ssssssssssssssss", time, aaa, new Date(), aaa.replace(/\s+/g, "T"), new Date(aaa.replace(/\s+/g, "T")));
      this.currentDate = new Date(time * 1000);
      this.showDatetime = true;
    },
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      } else if (type === "day") {
        return `${val}日`;
      } else if (type === "hour") {
        return `${val}时`;
      } else if (type === "minute") {
        return `${val}分`;
      }
      return val;
    },
    setMember_num(member_num) {
      if (this.member_num == member_num) {
        this.member_num = "";
        return;
      }
      this.member_num = member_num;
    },
    setStatus(n) {
      if (this.status === n) {
        this.status = "";
        return;
      }
      this.status = n;
    },
    toDetail(id) {
      this.$router.push(this.fun.getUrl("openGroupDetail", { id: id }));
    },
    copyUrl(url) {
      this.$copyText(url).then(
        function(e) {
          console.log(e);
          Toast("复制成功");
        },
        function(e) {
          console.log(e);
          Toast("复制失败");
        }
      );
    },
    getData(tag) {
      let json = {
        id: this.$route.params.id,
        store_id: this.$route.params.store_id,
        page: this.page,
        leader_name: this.leader_name,
        member_num: this.member_num,
        status: this.status
      };
      $http
        .get("plugin.fight-groups.frontend.store.team-store.search", json, "")
        .then(response => {
          if (response.result === 1) {
            this.list = response.data.data;
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            if (!tag) {
              this.getLevels();
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getLevels() {
      $http
        .get("plugin.fight-groups.frontend.store.team-store.get-levels", { id: this.$route.params.id }, "")
        .then(response => {
          if (response.result === 1) {
            this.levels = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    confirmTime(e) {
      console.log(e);
      $http
        .get("plugin.fight-groups.frontend.store.team-store.change-end-time", { id: this.changeTimeID, end_time: this.fun.getTimestamp(e) }, "")
        .then(response => {
          if (response.result === 1) {
            Toast(response.msg);
            this.getData(true);
            this.showDatetime = false;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    virtualTeam(_id, i) {
      let that = this;
      Dialog.confirm({
        title: "提示",
        message: "是否虚拟成团"
      })
        .then(() => {
          //虚拟成团
          $http
            .get("plugin.fight-groups.frontend.store.team-store.virtual-team", { team_id: _id }, "")
            .then(response => {
              Toast(response.msg);
              if (response.result === 1) {
                // that.$set(that.list[i], 'status', 2)
                that.getData();
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (that.active == "1") {
        return;
      }
      if (this.page >= this.total_page) {
        return;
      } else {
        let _json = {
          id: that.$route.params.id,
          store_id: that.$route.params.store_id,
          leader_name: that.leader_name,
          member_num: that.member_num,
          status: that.status
        };
        this.page = this.page + 1;
        _json.page = this.page;
        $http.get("plugin.fight-groups.frontend.store.team-store.search", _json, "加载中").then(
          response => {
            that.isLoadMore = true;
            if (response.result === 1) {
              let myData = response.data.data;
              that.list = that.list.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#open_group_list {
  background: #f5f5f5;
  padding-bottom: 80px;

  .topmost-style {
    /deep/.van-nav-bar {
      z-index: 9999;
    }
  }

  .self-nav-style {
    /deep/.van-nav-bar .van-icon,
    /deep/.van-nav-bar__text {
      color: #000;
    }
  }

  .list {
    .list-child {
      padding: 0 0.938rem;
      background: #fff;
      margin-bottom: 0.625rem;

      .top-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 2.375rem;
        line-height: 2.375rem;

        .Numbering {
          color: #333;
        }

        .status-name {
          font-size: 0.75rem;
          color: #f14e4e;
        }
      }

      .member-info {
        display: flex;
        align-items: center;

        .avtor {
          width: 1.656rem;
          height: 1.656rem;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 0.625rem;
        }

        .member-name {
          flex: 1;
          text-align: left;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }
      }

      .activity-time {
        font-size: 0.75rem;
        text-align: left;
        padding: 0.625rem 0;
        color: #666;
        position: relative;
      }

      .grouping {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 10px;
        padding: 0.625rem 0;
        position: relative;

        .buy-info {
          display: flex;
          align-items: center;

          .buy-img {
            margin: 0 0.5rem;

            img {
              width: 1.438rem;
              height: 1.438rem;
              border-radius: 50%;
              overflow: hidden;
              margin-left: -0.5rem;
            }
          }
        }

        .group-countDown {
          display: flex;
        }

        .van-count-down {
          font-size: 10px;
          color: #f14e4e;
        }
      }

      .activity-time::after,
      .grouping::after {
        height: 1px;
        position: absolute;
        z-index: 0;
        bottom: 0;
        left: 0;
        content: "";
        width: 100%;
        background-image: linear-gradient(0deg, #ececec 50%, transparent 0);
      }

      .operate-box {
        display: flex;
        align-items: center;
        padding: 0.625rem 0;

        .operate-child {
          flex: 1;
          text-align: center;
          font-size: 0.75rem;
          height: 1.125rem;
          line-height: 1.125rem;
          color: #888;
          display: flex;
          align-items: center;
          justify-content: center;

          i {
            font-size: 1rem;
            color: #8b8b8b;
            margin-right: 0.125rem;
          }

          .icon-share {
            font-size: 0.75rem;
            margin-right: 0.25rem;
          }
        }

        .line {
          border-left: 1px solid #c8c8c8;
        }
      }
    }
  }

  .filter-box {
    padding-top: 50px;
    color: #666;
    height: 100%;
    position: relative;

    .condition-name {
      font-size: 0.75rem;
      height: 3rem;
      line-height: 3rem;
      text-align: left;
      padding: 0 0.875rem;
    }

    .condition-list {
      display: flex;
      flex-wrap: wrap;

      .condition-child {
        width: 3.75rem;
        height: 1.688rem;
        line-height: 1.688rem;
        background-color: #fff;
        border: solid 0.063rem #dcdcdc;
        margin: 0 0 0.875rem 0.875rem;
        font-size: 0.75rem;
      }

      .active-filter {
        background-color: rgba($color: #f14e4e, $alpha: 0.1);
        border: solid 0.063rem #f14e4e;
        color: #f14e4e;
      }
    }

    .filter-submit-box {
      position: absolute;
      bottom: 1rem;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: space-around;

      .filter-btn {
        width: 5.625rem;
        height: 2.125rem;
        line-height: 2.125rem;
        color: #f14e4e;
        background-color: #fff;
        border: solid 1px #f14e4e;
      }

      .ok-bg {
        background-color: #f14e4e;
        color: #fff;
      }
    }
  }
}
</style>
