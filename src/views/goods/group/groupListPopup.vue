<template>
  <div id="group_listBox">
    <template v-if="item.allTeamData">
      <van-swipe class="my-swipe" :autoplay="3000" :touchable="false" :show-indicators="false" :vertical="true" style="height: 2rem;">
        <template v-for="(datas, ind) in item.allTeamData">
          <van-swipe-item :key="ind">
            <div class="allteam" @click.stop="getAllTeam(item)">
              <div class="allLeft">
                <div class="teamNo" v-if="datas.has_one_leader">{{ datas.has_one_leader.username }}</div>
                <span class="teamTwo" v-if="datas.has_one_level">已开团，差{{ datas.has_one_level.member_num - datas.has_many_success_member_count }}人</span>
              </div>
              <div class="allRight">
                <van-icon name="arrow"></van-icon>
              </div>
            </div>
          </van-swipe-item>
        </template>
      </van-swipe>
    </template>
    <van-popup v-model="show" get-container="#group_listBox" position="center" round :style="{ width: this.fun.getPhoneEnv() == 3 ? '375px' : '88%' }">
      <div class="open_group">
        <p>以下小伙伴拼团中，可直接参与</p>
        <div class="icon_close" @click.stop="show = false">
          <i class="iconfont icon-close11"></i>
        </div>
        <div class="setMaxH">
          <group-list-cell
            v-for="(item, index) in earliestData"
            :key="index"
            :thumb="item.has_one_leader.avatar_image"
            :username="item.has_one_leader.username"
            :num="item.has_one_level.member_num"
            :lack="item.has_one_level.member_num - item.has_many_success_member_count"
            :isLeader="item.leader_id == uid ? true : false"
            :time="fun.getTimeDifference(item.end_time)"
            v-on:finish="finishTwo(index)"
            v-on:click="clickAdd($event, item.id, item)"
          ></group-list-cell>
          <span v-if="page < total_page" @click="getMoreData(item)">点击加载更多</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import groupListCell from "components/goods/children/plugin/groupListCell";
// import { Toast } from "vant";
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      earliestData: [],
      show: false,
      uid: window.localStorage.getItem("uid"),
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  components: { groupListCell },
  computed: {},
  mounted() {},
  methods: {
    getAllTeam(item) {
      let _url = "plugin.fight-groups.frontend.controllers.fight-groups-goods.all-team";
      $http
        .get(_url, { id: item.id }, "加载中")
        .then(
          response => {
            if (response.result === 1) {
              this.isLoadMore = true;
              this.total_page = response.data.last_page;
              if (!this.total_page) {
                this.total_page = 0;
              }
              this.earliestData = response.data.data;
              this.isLoading = false;
              this.show = true;
              // this.initShare();
            } else {
              this.isLoading = false;
            }
          },
          response => {}
        )
        .then(v => {});
    },
    getMoreData(item) {
      this.isLoadMore = false; // 防止多次请求分页数据
      let json = {};
      json.id = item.id;
      let _url = "plugin.fight-groups.frontend.controllers.fight-groups-goods.all-team";

      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;

        $http
          .get(_url, json, "加载中")
          .then(res => {
            this.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.data;
              this.total_page = res.data.last_page;
              this.earliestData = this.earliestData.concat(nextPageData); //数组拼接
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    //加入该团按钮
    clickAdd(event, _id, item) {
      if (event.tag == "share") {
        let sharetitle = item.has_one_group.desc_title;
        let desc = item.has_one_group.desc_content;
        this.shareWeixin(item.id, sharetitle, desc);
        return;
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
    shareWeixin(_id, title, desc) {
      //不是微信端 不访问
      if (this.fun.getTyep() == 5) {
        return;
      } else if (this.fun.getTyep() == 7 || this.fun.isCPS()) {
        this.appShare(_id, title, desc);
        return;
      }
      let that = this;
      this.fun.wxShare(
        "",
        {},
        {
          title: title,
          link: that.fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/group_detail/" + _id + "?i=" + that.fun.getKeyByI() + "&mid=" + that.fun.getKeyByMid(),
          description: desc
        }
      );
      this.$dialog.alert({ message: "请点击右上角微信分享" });
    },
    //app获取分享数据
    appSharesinit() {
      $http.post("member.member.wxJsSdkConfig", { url: document.location.href }).then(
        response => {
          if (response.result == 1) {
            this.appShare(response.data, _id, title, desc);
          }
        },
        response => {
          console.log(response);
        }
      );
    },
    //app分享设置
    appShare(_id, Retitle, Redesc) {
      let uid = window.localStorage.getItem("uid");
      let _title,
        _imgUrl,
        _desc = "";
      let _link = that.fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/group_detail/" + _id + "?i=" + that.fun.getKeyByI() + "&mid=" + that.fun.getKeyByMid();
      _link = this.fun.isMid(_link, uid);
      // 拼团插件二开 邀请弹窗分享 #73729
      _title = Retitle ? Retitle : this.goods_info.share_title;
      _imgUrl = this.goodsInfo.thumb;
      _desc = Redesc ? Redesc : this.goods_info.share_content;

      let json = {
        title: _title, // 分享标题
        desc: _desc, // 分享描述
        link: _link, // 分享链接
        imgUrl: _imgUrl // 分享图标
      };
      if (this.fun.isCPS()) {
        if (this.fun.isIosOrAndroid() === "ios") {
          shareByH5IOS({ body: "shareByH5IOS", json: JSON.stringify(json) });
        } else {
          shareByH5Android(JSON.stringify(json));
        }
      } else {
        YDB.Share(_title, _desc, _imgUrl, _link, "Sharesback");
      }
    },
    joinGroup(_id) {
      let that = this;
      let goods = [];
      goods.push(this.item.goods_id);
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
                      goodsId: that.item.goods_id,
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
              if (that.item.store_id) {
                _json.store_id = that.item.store_id;
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
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.allteam {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding: 0 0.38rem;
  background-color: #f8f8f8;

  .allLeft {
    flex: 1;
    display: flex;
    overflow: hidden;
    align-items: center;

    .teamNo {
      color: #f15353;
      max-width: 55%;

      /* overflow: hidden; */

      /* text-overflow: ellipsis; */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 0.35rem;
    }

    .teamTwo {
      flex: 1;
    }
  }

  .allRight {
    display: flex;
    align-items: center;
    justify-content: center;
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
  }
}
</style>
