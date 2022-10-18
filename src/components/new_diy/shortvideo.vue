<template>
  <div class="U000026-template1" style="position: relative;" :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <!--短视频静态-->
    <div class="shortvideo" v-if="datas.preview_color">
      <div class="list" v-if="Number(datas.get_number) > 0 && datas.get_style == 1">
        <c-video :id="id" :showLoading="showLoading" :isLoadMore="isLoadMore" :isDiy="true" @loadMore="loadMore" @getMore="getMoreData" :list="list"></c-video>
      </div>

      <div class="list" v-if="datas.list.length > 0 && datas.get_style == 2">
        <c-video :id="id" :showLoading="showLoading" :isDiy="true" more-text-hidden @loadMore="loadMore" :list="datas.list" :fatherTitleFather="fatherTitle"></c-video>
      </div>
    </div>
  </div>
</template>

<script>
import cVideo from "components/video_waterfall";
import emptyImage from "../../assets/images/new_diy/banner.png";
// import { Toast } from "vant";
// 自定义样式
const css = function() {
  if (this.datas.preview_color) {
    const { preview_color } = this.datas;

    return `
        .component-${this.id} .shortvideo .list{
            background-color: ${preview_color};
        }
    `;
  }
};

export default {
  props: ["page_id", "id", "datas", "index", "component_key", "tabcontrol","fatherTitle"],
  data() {
    return {
      emptyImage,
      list: [],
      showLoading: false,
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  mounted() {
    if (Number(this.datas.get_number) > 0 && this.datas.get_style == 1) {
      this.getData(this.datas.list);
    } else {
      this.isLoadMore = false;
    }
  },
  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    }
  },
  components: { cVideo },

  methods: {
    loadMore() {
      this.showLoading = true;
      this.total_page <= 1 || this.page >= this.total_page || this.list.length >= this.datas.get_number ? (this.isLoadMore = false) : (this.isLoadMore = true);
    },
    getData(data) {
      this.list = [];
      this.page = 1;
      this.isLoadMore = true;
      this.showLoading = false;
      this.total_page = data.last_page;
      if (this.total_page <= 1) {
        this.isLoadMore = false;
        this.showLoading = true;
      }
      this.list = data.data;
      if (this.list.length > this.datas.get_number) {
        this.list.splice(this.datas.get_number, this.list.length - this.datas.get_number);
        this.isLoadMore = false;
      }
    },
    // 获取更多数据
    getMoreData() {
      this.isLoadMore = false;
      if (this.page >= this.total_page || this.list.length > this.datas.get_number) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          page: this.page,
          decorate_id: this.page_id || this.$store.state.temp.item.id,
          component_id: this.id,
          component_key: this.component_key
        };
        if (this.tabcontrol) {
          json.component_info = JSON.stringify({ list_key: this.index });
        }
        $http.get("home-page.get-decorate-page", json, "loading").then(
          response => {
            this.isLoadMore = true;
            if (response.result === 1) {
              if (this.tabcontrol) {
                let data = response.data[0].remote_data.list;
                this.list = this.list.concat(data.data); //数组拼接
                if (this.list.length > this.datas.get_number) {
                  this.list.splice(this.datas.get_number, this.list.length - this.datas.get_number);
                  this.isLoadMore = false;
                }
              } else {
                this.list = this.list.concat(response.data.data); //数组拼接
                if (this.list.length > this.datas.get_number) {
                  this.list.splice(this.datas.get_number, this.list.length - this.datas.get_number);
                  this.isLoadMore = false;
                }
              }
              this.$emit("setLoadMore", this.isLoadMore);
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          },
          function(response) {
            console.error(response);
          }
        );
      }
    },
    // 会员中心用的
    loadMoreMemberData() {
      this.isLoadMore = false;
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          page: this.page
        };
        $http.get("plugin.video-share.frontend.video.getList", json, "loading").then(
          response => {
            if (response.result === 1) {
              let data = response.data.list;
              this.list = this.list.concat(data.data); //数组拼接
              if (this.page < this.total_page) {
                this.isLoadMore = true;
              }
              this.$emit("setLoadMore", this.isLoadMore);
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              this.allLoaded = true;
            }
          },
          function(response) {
            console.error(response);
            // error callback
          }
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// 默认
.component-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  text-align: left;
}

.shortvideo {
  width: 100%;

  .list {
    width: 100%;

    /* padding: 10px 12px; */
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .list_child {
      width: 50%;
      margin: 0;
      display: flex;
      flex-direction: column;
      background: #fff;
      border-radius: 5px;
      overflow: hidden;

      .video_box {
        width: 100%;
        height: 225px;
        line-height: 225px;
        text-align: center;
        background: #e3e4e4;

        img {
          width: 100%;
          max-height: 100%;
        }

        i {
          font-size: 16px;
        }
      }

      .bottom_box {
        padding: 10px;

        .title {
          font-size: 14px;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .other {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .user_info {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .user_Avatar {
              width: 18px;
              height: 18px;
              border-radius: 100%;
              margin-right: 6px;
            }

            .user_name {
              width: 60px;
              color: #8c8c8c;
              font-size: 11px;
              overflow: hidden; /* 超出部分隐藏 */
              text-overflow: ellipsis; /* 超出部分显示省略号 */
              white-space: nowrap; /* 规定段落中的文本不进行换行 */
            }
          }
        }
      }
    }
  }
}
</style>
