<!-- 广告列表 -->
<template>
  <div id="Advertising-adList">
    <c-title :hide="false" text="广告列表"></c-title>
    <div class="main">
      <div class="list" v-for="(item, index) in list" :key="item.id" @click.stop="gotoADPlay(item.id, index)">
        <div class="list-img">
          <img :src="item.has_one_advertising_apply && item.has_one_advertising_apply.video_cover" alt="" />
        </div>
        <div class="list-right">
          <div class="list-title">{{ item.has_one_advertising_apply && item.has_one_advertising_apply.title }}</div>
          <div class="list-member">
            <div class="member-img">
              <img :src="item.has_one_member && item.has_one_member.avatar_image" alt="" />
            </div>
            <div class="member-name">{{ item.has_one_member && item.has_one_member.nickname }}</div>
          </div>
        </div>
      </div>
      <yz-blank :datas="list" text="暂无广告可播放" :isBtn="true" btnText="返回"></yz-blank>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
import yzBlank from "components/ui_components/yz_blank";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      list: [],
      tag: "all", //从什么页面进入的，聚合页||直播间||发现视频

      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },

  activated() {
    this.getData();
  },

  components: { yzBlank },

  computed: {},

  methods: {
    getData() {
      let json = {};
      if (this.$route.params.tag != "all") {
        json.put_in_type = this.$route.params.tag == "video" ? "2" : "1"; //投放类型:1-直播间，2-短视频
        json.put_in_id = this.$route.params.id; //投放短视频/直播间ID
      }
      $http
        .get("plugin.ad-serving.frontend.advertising.index.getList", json, "")
        .then(response => {
          if (response.result === 1) {
            this.list = response.data.list.data;
            this.isLoadMore = true;
            this.total_page = response.data.list.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            Toast(response.msg);
            if (this.fun.isTextEmpty(response.data)) {
              this.$router.go(-1);
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        let json = {};
        if (this.$route.params.tag != "all") {
          json.put_in_type = this.$route.params.tag == "video" ? "2" : "1"; //投放类型:1-直播间，2-短视频
          json.put_in_id = this.$route.params.id; //投放短视频/直播间ID
        }
        json.page = that.page;
        $http
          .get("plugin.ad-serving.frontend.advertising.index.getList", json, "加载中")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.list.data;
              that.list = that.list.concat(nextPageData); //进行数组拼接
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
    gotoADPlay(id, index) {
      let page = Math.ceil((index + 1) / 15);
      this.$router.push(this.fun.getUrl("advertisingPlayPage", { tag: this.$route.params.tag, id: this.$route.params.id, aid: id, page: page }));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#Advertising-adList {
  .main {
    padding: 0.875rem;
    background: #fff;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .list {
      display: flex;
      padding-bottom: 0.875rem;

      .list-img {
        width: 4.375rem;
        height: 5.188rem;
        background-color: #fff;
        border-radius: 0.313rem;
        overflow: hidden;
        flex-shrink: 0;
        position: relative;
      }

      .list-img::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        border: 1px solid #a6a6a6;
        width: 200%;
        height: 200%;
        -webkit-transform: scale(0.5);
        transform: scale(0.5);
        -webkit-transform-origin: left top;
        transform-origin: left top;
      }

      .list-right {
        flex: 1;
        margin-left: 0.75rem;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        justify-content: space-between;
        text-align: left;

        .list-title {
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          color: #1e1e1e;
          font-size: 15px;
        }

        .list-member {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #202020;
          overflow: hidden;

          .member-img {
            width: 1.25rem;
            height: 1.281rem;
            overflow: hidden;
            border-radius: 50%;
            margin-right: 0.25rem;
            background-color: #c5c5c5;
            flex-shrink: 0;
          }

          .member-name {
            flex: 1;
            overflow: hidden; /* 超出部分隐藏 */
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /* 规定段落中的文本不进行换行 */
          }
        }
      }
    }
  }
}
</style>
