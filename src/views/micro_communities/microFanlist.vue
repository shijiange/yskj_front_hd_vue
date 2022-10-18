<!-- 微社区关注、粉丝列表 -->
<template>
  <div id="microFanlist">
    <c-title :hide="false" text="关注与粉丝"></c-title>
    <div style="z-index: 9999;">
      <van-tabs v-model="activeName" @change="getList" style="background: #f9f5f5;" sticky>
        <van-tab title="关注">
          <div class="list">
            <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
              <ul v-if="activeName == 0">
                <li v-for="(item, index) in attentionList" :key="item.user_id" @click.stop="toMember(item.has_one_follow_user.uid)">
                  <div class="left-box">
                    <img :src="(item.has_one_follow_user && item.has_one_follow_user.avatar) || 'https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/img_404.png'" alt="" />
                    <p class="title">{{ (item.has_one_follow_user && item.has_one_follow_user.nickname) || "---" }}</p>
                  </div>
                  <div class="right-box">
                    <span class="btn" v-if="is_own == 1" @click.stop="cancelLook(item.has_one_follow_user.uid, index)" style="background-color: #999;">已关注</span>
                  </div>
                </li>
              </ul>
            </van-pull-refresh>
          </div>
        </van-tab>
        <van-tab title="粉丝">
          <div class="list">
            <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
              <ul v-if="activeName == 1">
                <li v-for="(item, indexs) in fanList" :key="item.user_id" @click.stop="toMember(item.has_one_fans.uid)">
                  <div class="left-box">
                    <img :src="(item.has_one_fans && item.has_one_fans.avatar) || 'https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/img_404.png'" alt="" />
                    <p class="title">{{ (item.has_one_fans && item.has_one_fans.nickname) || "---" }}</p>
                  </div>
                  <div class="right-box" v-if="is_own == 1">
                    <span v-if="item.is_mutual == 1" style="background-color: #cacaca" class="btn">已关注</span>
                    <span v-else class="btn" @click.stop="lookUser(item.has_one_fans.uid)">关注</span>
                    <img src="../../assets/images/micro_communities/more_gray.png" alt="" @click.stop="showDelete(item.has_one_fans.uid, indexs)" />
                  </div>
                </li>
              </ul>
            </van-pull-refresh>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <van-popup v-model="isdelete"><span id="unsubID" @click="deleteFan">移除粉丝</span><span id="unsubID" @click="isdelete = false">取消</span></van-popup>
  </div>
</template>

<script>
import { scrollMixin } from "../../utils/mixin"; //引入加载更多
import cTitle from "components/title";
import { Toast } from "vant";

export default {
  mixins: [scrollMixin],
  data() {
    return {
      activeName: 0,
      attentionList: [],
      fanList: [],
      isdelete: false,
      avtiveUid: null, //当前点击移除的粉丝id
      avtiveIndex: null,
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
      isLoading: false,

      is_own: ""
    };
  },
  activated() {
    this.is_own = this.$route.query.is_own;
    this.getList();
  },
  components: { cTitle },
  methods: {
    toMember(_id) {
      this.$router.push(this.fun.getUrl("microhomepage", {}, { micuid: _id }));
    },
    getList() {
      let that = this;
      this.list = [];
      let json = {};
      if (this.activeName == 1) {
        json.userType = 1; //粉丝
        json.page = 1;
        json.member = that.$route.query.uid;
      } else {
        json.userType = 2; //关注
        json.page = 1;
        json.member = that.$route.query.uid;
      }
      $http
        .get("plugin.micro-communities.api.user.getFollowFans", json, ".")
        .then(response => {
          if (response.result == 1) {
            that.isLoadMore = true;
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            if (that.activeName == 1) {
              //粉丝
              that.fanList = response.data.data;
            } else {
              //关注
              that.attentionList = response.data.data;
            }
            that.isLoading = false;
          } else {
            console.log(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    cancelLook(_uid, index) {
      this.$dialog
        .confirm({ message: "确定取消关注对方?" })
        .then(() => {
          $http.post("plugin.micro-communities.api.user.delFollow", { uid: _uid }, ".").then(response => {
            if (response.result == 1) {
              this.attentionList.splice(index, 1);
              Toast(response.msg);
            } else {
              Toast(response.msg);
            }
          });
        })
        .catch(() => {});
    },
    lookUser(_uid) {
      $http
        .post(
          "plugin.micro-communities.api.user.addFollow",
          {
            user_id: _uid
          },
          "."
        )
        .then(response => {
          if (response.result == 1) {
            Toast(response.msg);
          } else {
            Toast(response.msg);
          }
        });
    },
    deleteFan() {
      this.$dialog
        .confirm({ message: "对方将不再关注你，且不会收到通知，你也不会被推荐给对方" })
        .then(() => {
          $http
            .post(
              "plugin.micro-communities.api.user.delFans",
              {
                fid: this.avtiveUid
              },
              "."
            )
            .then(response => {
              if (response.result == 1) {
                this.fanList.splice(this.avtiveIndex, 1);
                Toast(response.msg);
                this.isdelete = false;
              } else {
                this.isdelete = false;
                Toast(response.msg);
              }
            });
        })
        .catch(() => {});
    },
    showDelete(_id, ind) {
      this.isdelete = true;
      this.avtiveUid = _id;
      this.avtiveIndex = ind;
    },
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        let json = [];
        if (that.activeName == 1) {
          json.userType = 1; //粉丝
          json.page = that.page;
          json.member = that.$route.query.uid;
        } else {
          json.userType = 2; //关注
          json.page = that.page;
          json.member = that.$route.query.uid;
        }
        $http
          .get("plugin.micro-communities.api.user.getFollowFans", json, ".")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.data;
              if (that.activeName == 1) {
                //粉丝
                that.fanList = that.fanList.concat(nextPageData); //进行数组拼接
              } else {
                //关注
                that.attentionList = that.attentionList.concat(nextPageData); //进行数组拼接
              }
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    //下拉刷新
    loadTop() {
      //console.log('触发下拉');
      this.initPageData();
      this.getList();
      // this.$refs.loadmore.onTopLoaded();
    },
    // 初始化数据
    initPageData() {
      this.list = [];
      this.isLoadMore = true;
      this.total_page = 0;
      this.page = 1;
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#microFanlist {
  .list {
    padding: 0 0.8rem;
    background: #fff;

    ul {
      li {
        padding: 0.625rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 15px;

        .left-box {
          display: flex;
          align-items: center;
          flex: 1;

          img {
            width: 3.125rem;
            height: 3.125rem;
            border-radius: 100%;
            overflow: hidden;
            margin-right: 0.8rem;
          }

          .title {
            flex: 1;
            width: 3rem;
            text-align: left;
            overflow: hidden; /* 超出部分隐藏 */
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /* 规定段落中的文本不进行换行 */
          }
        }

        .right-box {
          .btn {
            width: 5.625rem;
            height: 2rem;
            line-height: 2rem;
            display: inline-block;
            background: red;
            border-radius: 3px;
            color: #fff;
          }

          img {
            width: 1.125rem;
            margin-left: 1rem;
          }
        }
      }
    }
  }

  #unsubID {
    display: inline-block;
    width: 18rem;
    height: 3.8rem;
    line-height: 3.8rem;
    text-align: left;
    text-indent: 1.8rem;
    font-size: 16px;
  }
}
</style>
