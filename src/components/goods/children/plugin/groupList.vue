<!-- 拼团开团列表组件 -->
<template>
  <div>
    <div class="group_into">
      <h2>以下小伙伴拼团中，可直接参与</h2>
      <div class="more">
        <span @click="showGroupMore()">查看更多</span>
        <i class="fa fa-angle-right"></i>
      </div>

      <template v-if="goods_type == 'groupWorkGood'">
        <!-- 0.1元新拼团 -->
        <van-swipe v-if="earliestData" ref="groupSwipe" :autoplay="2500" style="height: 50px;" vertical :show-indicators="false">
          <van-swipe-item v-for="item in earliestData" :key="item.id">
            <group-list-cell
              ref="groupSwipe"
              :thumb="item.avatar_image"
              :username="item.nickname"
              :num="item.person"
              :lack="item.disparity"
              :isLeader="item.uid == uid ? true : false"
              :time="fun.getTimeDifference(item.end_time)"
              v-on:finish="finishOne"
              v-on:click="clickAdd($event, item.id)"
            ></group-list-cell>
          </van-swipe-item>
        </van-swipe>
      </template>
      <template v-else>
        <van-swipe v-if="teamInfo && teamInfo.listData" ref="groupSwipe" :autoplay="2500" style="height: 50px;" vertical :show-indicators="false">
          <van-swipe-item v-for="item in teamInfo.listData" :key="item.id">
            <group-list-cell
              :thumb="item.has_one_leader && item.has_one_leader.avatar_image"
              :username="item.has_one_leader && item.has_one_leader.username"
              :num="item.has_one_level.member_num"
              :lack="item.has_one_level.member_num - item.has_many_success_member_count"
              :isLeader="item.leader_id == uid ? true : false"
              :time="fun.getTimeDifference(item.end_time)"
              v-on:finish="finishTwo(index)"
              v-on:click="clickAdd($event, item.id)"
            ></group-list-cell>
          </van-swipe-item>
        </van-swipe>
      </template>
    </div>
    <van-popup v-model="show2" get-container="#appMain" position="center" round :style="{ width: this.fun.getPhoneEnv() == 3 ? '375px' : '88%' }">
      <div class="open_group">
        <p>以下小伙伴拼团中，可直接参与</p>
        <div class="icon_close" @click="show2 = false">
          <i class="iconfont icon-close11"></i>
        </div>
        <div class="setMaxH">
          <template v-if="goods_type == 'groupWorkGood'">
            <group-list-cell
              v-for="(item, index) in earliestData"
              :key="index"
              :thumb="item.avatar_image"
              :username="item.nickname"
              :num="item.person"
              :lack="item.disparity"
              :isLeader="item.uid == uid ? true : false"
              :time="fun.getTimeDifference(item.end_time)"
              v-on:finish="finishTwo(index)"
              v-on:click="clickAdd($event, item.id)"
            ></group-list-cell>
          </template>
          <template v-else>
            <group-list-cell
              v-for="(item, index) in teamInfo.listData"
              :key="index"
              :thumb="item.has_one_leader && item.has_one_leader.avatar_image"
              :username="item.has_one_leader && item.has_one_leader.username"
              :num="item.has_one_level.member_num"
              :lack="item.has_one_level.member_num - item.has_many_success_member_count"
              :isLeader="item.leader_id == uid ? true : false"
              :time="fun.getTimeDifference(item.end_time)"
              v-on:finish="finishTwo(index)"
              v-on:click="clickAdd($event, item.id)"
            ></group-list-cell>
          </template>
          <div class="moreTeam" style="line-height: 2.5rem;" @click="getMoreTeamList" v-if="teamInfo.total > teamInfo.listData.length">加载更多</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
import groupListCell from "./groupListCell";
export default {
  inject: ["goods_type"],
  props: {
    goods_info: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      uid: window.localStorage.getItem("uid"),
      earliestData: {},
      fight_groups: null,
      show2: false,
      teamInfo: { newword: false, totalPage: 0, count: 0, page: 1, listData: [] } //开团列表信息
    };
  },
  activated() {
    setTimeout(() => {
      // 解决点击跳转拼团详情页返回之后，轮播不自动滚动
      this.$refs.groupSwipe.resize();
    }, 1000);
  },
  mounted() {
    this.show2 = false;
    if (this.goods_type == "groupWorkGood") {
      this.earliestData = this.goods_info.alliance;
      return;
    }
    // this.earliestData = this.goods_info.display_team;
    if (this.goods_info.status == "1") {
      this.getTeamList();
    }
  },
  components: { groupListCell },
  computed: {
    goodsInfo() {
      return this.goods_info.goods_info;
    }
  },
  methods: {
    //显示去参团列表弹层
    showGroupMore() {
      //价格权限
      if (this.goodsInfo.vip_level_status && this.goodsInfo.vip_level_status.status == 1) {
        Toast(this.goodsInfo.vip_level_status.tips);
        return false;
      }
      let activityStatus = ["0", "1", "2"]; //activityStatus当前活动状态，顺序为未开始，进行中，已结束
      let list = this.teamInfo.listData;
      if (this.goods_type == "groupWorkGood") {
        list = this.earliestData;
        activityStatus = ["1", "2", "3"];
      }
      if (this.goods_info.status == activityStatus[1]) {
        //活动已开启
        if (list.length == 0) {
          Toast({
            message: "暂无更多可参与的团",
            duration: 1000
          });
          return;
        }
        this.show2 = true;
      } else if (this.goods_info.status == activityStatus[0]) {
        Toast({
          message: "活动未开始",
          duration: 1000
        });
        return;
      } else if (this.goods_info.status == activityStatus[2]) {
        Toast({
          message: "活动已结束",
          duration: 1000
        });
        return;
      }
    },
    getTeamList() {
      let json = {};
      this.fight_groups = this.$route.query.fight_groups !== undefined ? this.$route.query.fight_groups : "";
      if (!this.fun.isTextEmpty(this.fight_groups)) {
        //不为空则从订单详情页进入
        json.id = this.$route.params.id && this.$route.params.id != 0 ? this.$route.params.id : this.goods_info.id;
        json.fight_groups_goods_id = this.fight_groups;
      } else {
        json.id = this.$route.params.id;
      }
      let _url = "plugin.fight-groups.frontend.controllers.fight-groups-goods.all-team";
      if (this.$route.params.store_id && Number(this.$route.params.store_id) != 0) {
        json.store_id = this.$route.params.store_id;
        _url = "plugin.fight-groups.frontend.store.frontend-fight-groups-goods.all-team";
      }
      $http.get(_url, json, "加载中").then(
        response => {
          if (response.result === 1) {
            this.teamInfo.totalPage = response.data.last_page;
            this.teamInfo.total = response.data.total;
            this.teamInfo.listData = response.data.data;
            if (!this.teamInfo.totalPage) {
              this.teamInfo.totalPage = 0;
            }
          } else {
            Toast(response.msg);
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    getMoreTeamList() {
      let json = {};
      if (!this.fun.isTextEmpty(this.fight_groups)) {
        //不为空则从订单详情页进入
        json.id = this.$route.params.id && this.$route.params.id != 0 ? this.$route.params.id : this.goods_info.id;
        json.fight_groups_goods_id = this.fight_groups;
      } else {
        json.id = this.$route.params.id;
      }
      let _url = "plugin.fight-groups.frontend.controllers.fight-groups-goods.all-team";
      if (this.$route.params.store_id && Number(this.$route.params.store_id) != 0) {
        json.store_id = this.$route.params.store_id;
        _url = "plugin.fight-groups.frontend.store.frontend-fight-groups-goods.all-team";
      }
      this.teamInfo.page++;
      json.page = this.teamInfo.page;
      $http.get(_url, json, "加载中").then(
        response => {
          if (response.result === 1) {
            var nextPageData = response.data.data;

            this.teamInfo.listData = this.teamInfo.listData.concat(nextPageData);
            console.log(this.teamInfo);
          } else {
            Toast(response.msg);
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    },
    finishOne() {
      if (this.goods_type == "groupWorkGood" && this.earliestData.length > 0) {
        this.earliestData.shift();
        return;
      } else if (this.teamInfo.listData.length > 1) {
        this.earliestData = this.teamInfo.listData[this.teamInfo.listData.length - 2];
      }
    },
    //加入该团按钮
    clickAdd(event, _id) {
      if (event.tag == "share") {
        this.$emit("shareWeixin"); //点击分享按钮
        return;
      }
      if (this.goodsInfo.vip_level_status && this.goodsInfo.vip_level_status.status == 1) {
        Toast(this.goodsInfo.vip_level_status.tips); //价格权限
        return false;
      }
      if (event.tag == "add") {
        //点击参团
        if (this.goods_type == "groupWorkGood") {
          this.$router.push(this.fun.getUrl("groupWorkDetail", { aid: _id, id: this.$route.params.id }));
          return;
        }

        this.joinGroup(_id);
      }
    },
    joinGroup(_id) {
      let that = this;
      let goods = [];
      goods.push(that.goods_info.goods_id);
      let jsons = {
        goods_ids: JSON.stringify(goods)
      };
      $http.get("from.div-from.isDisplay", jsons, "加载中").then(
        function(response) {
          if (response.result === 1) {
            if (response.data.status && !response.data.member_status) {
              that.$dialog
                .confirm({ message: "购买跨境商品,请补充您的个人信息" })
                .then(() => {
                  that.$router.push(
                    that.fun.getUrl("myinfo", {
                      tag: "",
                      goodsId: that.goods_info.goods_id,
                      optionsId: optionsId,
                      total: that.goodsCount
                    })
                  );
                })
                .catch(() => {});
            } else {
              let _json = {
                id: _id
              };
              if (that.$route.params.store_id) {
                _json.store_id = that.$route.params.store_id;
              }
              that.$router.push(that.fun.getUrl("GroupDetail", _json));
            }
          } else {
            console.log(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    finishTwo(index) {
      //删除下标为i的元素
      if (this.goods_type == "groupWorkGood") {
        this.earliestData.splice(index, 1);
      } else {
        this.teamInfo.listData.splice(index, 1); //删除下标为i的元素
      }
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
    max-height: 14rem;
    overflow: scroll;
  }
}
</style>
