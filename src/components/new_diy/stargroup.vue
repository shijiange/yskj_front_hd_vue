<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <div>
      <div id="tab">

        <ul class="tab_list" v-if="datas.list && datas.list.length > 0">
          <van-tabs v-model="active"
                    swipeable
                    @change="onClick"
                    :background="datas.tab_bgcolor"
                    :title-active-color="datas.tab_color_active"
                    :color="datas.tab_color_active"
                    :title-inactive-color="datas.tab_color"
                    id="tab">
            <van-tab title="全部参团" name="0"></van-tab>
            <van-tab title="积分参团" name="1"></van-tab>
          </van-tabs>

          <div v-if="joinListData.length>0" class="join_list">

            <div class="join_item" v-for="item in joinListData" :key="item.leader_id">
              <div class="name">
                <div class="c1">团长：{{item.nickname}}</div>
                <div class="c2">活动名称：{{item.activity_name}}</div>
              </div>
              <!-- <div class="join_container">
                <div class="join_face">
                  <template v-for="(item1,key1) in item.team">
                    <div class="face" v-if="key1<5" :key="key1">
                      <img :src="item1.avatar" alt="">
                    </div>
                  </template>
                </div>
              </div> -->
              <!-- <div class="desc">
                <div class="c2 text" style="display: flex; align-items: center;">距结束:
                  <van-count-down :time="(item.end_time-currentTime)*1000">
                    <template #default="timeData">
                      <div style="display: flex; text-align: center; color: #f15353; font-size: 12px;">
                        <span class="block">{{timeData.days}}</span>
                        <span class="colon" style="margin: 0 0.1rem;">天</span>
                        <span class="block">{{ timeData.hours }}</span>
                        <span class="colon" style="margin: 0 0.1rem;">:</span>
                        <span class="block">{{ timeData.minutes }}</span>
                        <span class="colon" style="margin: 0 0.1rem;">:</span>
                        <span class="block">{{ timeData.seconds }}</span>
                      </div>
                    </template>
                  </van-count-down>
                </div>
                <div class="btn" @click="gotoGroupDetails(item.leader_id)">立即参团</div>
              </div> -->
              <div class="join_container">
                <div class="join_face">
                  <template v-for="(item1,key1) in item.team">
                    <div class="face" v-if="key1<4" :key="key1">
                      <img :src="item1.avatar" alt="">
                    </div>
                  </template>
                </div>
                <div class="time_box">
                  <div class="time" style="font-size: 16px; font-weight: bold;">还差<span class="font-color">{{item.surplus_num}}人</span>拼成
                  </div>
                  <div class="c2 text" style="display: flex; align-items: center; font-size: 12px;">距结束:
                    <van-count-down :time="(item.end_time-currentTime)*1000">
                      <template #default="timeData">
                        <div style="display: flex; text-align: center; color: #f15353; font-size: 12px;">
                          <span class="block">{{timeData.days}}</span>
                          <span class="colon" style="margin: 0 0.1rem;">天</span>
                          <span class="block">{{ timeData.hours }}</span>
                          <span class="colon" style="margin: 0 0.1rem;">:</span>
                          <span class="block">{{ timeData.minutes }}</span>
                          <span class="colon" style="margin: 0 0.1rem;">:</span>
                          <span class="block">{{ timeData.seconds }}</span>
                        </div>
                      </template>
                    </van-count-down>
                  </div>
                </div>
                <div class="btn" @click="gotoGroupDetails(item.leader_id)">立即参团</div>
              </div>
            </div>

            <div :style="{backgroundColor: datas.preview_color}">
              <div class="loadMore"
                   style="height: 3rem; display: flex; align-items: center; justify-content: center;"
                   v-if="isLoadMore"
                   @click="getMoreData">
                {{ $i18n.t("加载更多") }}
              </div>
              <div class="loadMore" v-if="lastIndex == index && allLoaded">
                {{ $i18n.t("没有更多了") }}~~
              </div>
            </div>
          </div>

          <template v-if="joinListData.length<=0">
            <div :style="{backgroundColor: datas.tab_bg_color}" style="padding: 10px 15px; text-align: center;">
              {{show_text}}
            </div>
          </template>

        </ul>

        <!-- <div v-if="datas.list.length <= 1 && datas.list[0] && !datas.list[0].list_id"
             style="padding: 100px 15px; text-align: center;" :style="{backgroundColor: datas.tab_bg_color}">
          暂无团
        </div> -->

      </div>
    </div>
  </div>
</template>

<script>

// 自定义样式
const css = function() {
  const {
    tab_bg_color,
    tab_color,
    tab_active_color,
    group_once_bg,
    group_once_color,
    preview_color
  } = this.datas;

  return `
        .component-${this.id}  .nav-bgimage{
            background-color: ${tab_bg_color};
            color: ${tab_color};
        }

        .component-${this.id}  .nav-bgimage .nav-selected{
            color: ${tab_active_color};
            border-bottom: 2px solid ${tab_active_color};
		}
		.component-${this.id} .join_item .btn{
			background-color: ${group_once_bg};
            color: ${group_once_color};
		}
		.component-${this.id} .join_list{
			background-color: ${preview_color};
		}
    `;
};
import { Toast } from "vant";

export default {
  data() {
    return {

      active: "0",
      show_text: "没有数据",
      show_page: true,
      isLast: false,

      currentTime: parseInt(new Date().getTime() / 1000),
      joinListData: [],

      tabIndexActivityId: 0,

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数

      group_number: 100,//不设置最多显示100条

      activeIds: []  //所有活动的ID
    };
  },
  props: ["isBottom", "lastIndex", "index", "page_id", "id", "datas", "component_key"],
  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    }
  },
  mounted() {
    // console.log(this.datas);
    if (this.lastIndex == this.index) {
      this.isLast = true;
    }
    this.group_number = this.datas.group_number ? this.datas.group_number : 100;
    if (this.datas.list.length > 0) {
      //this.tabIndexActivityId = this.datas.list[0].activity_id;
      this.datas.list.forEach(element => {
        this.activeIds.push(element.activity_id);
      });
      this.getData();
      //this.datas.list[0].activity_id
    }

  },
  watch: {
    isBottom: function(newVal, oldVal) {
      if (newVal && this.lastIndex == this.index && this.isLoadMore) {
        this.getMoreData();
      }
    }
  },
  methods: {
    initData() {
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
      this.allLoaded = false;
    },
    // 功能数据
    handleDatas(old_data) {
      // 如果有配置项的话
      if (old_data) {
        const datas = {};
        Object.keys(old_data).map(key => {
          datas[key] = old_data[key].value;
        });
        return datas;
      } else {
        return this.component.remote_data || {};
      }
    },
    onClick(index, title) {
      //  this.tabIndexActivityId = this.datas.list[index].activity_id;
      this.getData();
    },
    getData() {
      this.initData();
      $http.post("plugin.decorate.admin.decorate-common.searchOpenList", {
        show_num: 15,
        type: this.active,
        activity_id: this.activeIds
      }, "loading").then(res => {
        if (res.result != 1) {
          return Toast(res.msg);
        }
        this.total_page = res.data.last_page;
        if (!this.total_page) {
          this.total_page = 0;
        }
        if (res.data.data.length > this.group_number) {
          res.data.data.splice(this.group_number, res.data.data.length - this.group_number);
          this.isLoadMore = false;
          this.allLoaded = true;
        }
        if (res.data.data.length < 15 || res.data.last_page == this.page) {
          this.isLoadMore = false;
          this.allLoaded = true;
        }
        this.joinListData = res.data.data;
      });

    },
    //加载更多数据
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page || this.joinListData.length >= this.datas.group_number) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .post("plugin.decorate.admin.decorate-common.searchOpenList", {
            show_num: 15,
            type: this.active,
            activity_id: this.activeIds,
            page: this.page
          }, "loading").then(res => {
            this.isLoadMore = true;
            if (res.result === 1) {
              this.arrIndex = this.arrIndex + 1;
              var nextPageData = res.data.data;
              this.joinListData = this.joinListData.concat(nextPageData);

              if (this.joinListData.length > this.group_number) {
                this.joinListData.splice(this.group_number, this.joinListData.length - this.group_number);
                this.isLoadMore = false;
                this.allLoaded = true;
              }
              if (res.data.data.length < 15 || res.data.last_page == this.page) {
                this.isLoadMore = false;
                this.allLoaded = true;
              }
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          });
      }
    },

    gotoGroupDetails(id) {
      this.$router.push(this.fun.getUrl("starMusicGroupDetails", { id }));
    }
  }
};
</script>

<style lang="scss" scoped>
  // 默认
  * {
    list-style-type: none;
  }

  .component-wrapper {
    width: 100%;
  }

  .tab_list {
    /* min-height: 100vh; */
    background: #fff;
  }

  .join_list {
    padding-top: 0.906rem;

    .join_item {
      width: 100%;
      height: 6.875rem;
      background-color: inherit;
      border-radius: 0.313rem;
      padding: 0.875rem 0.719rem 0.306rem 0.719rem;
      display: flex;
      flex-direction: column;
      border-top: 0.7rem solid #f2f2f2;

      &:first-child {
        border-top: none;
      }

      .name {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        border-bottom: solid 1px #eee;
        padding-bottom: 10px;
        color: #666;
      }

      .join_container {
        margin-top: 5px;
        display: flex;
        align-items: center;
        flex: 1;

        .join_face {
          flex: 1;
          display: flex;
          align-items: center;
          width: 116px;

          .face {
            margin-left: -0.2rem;
            width: 1.875rem;
            height: 1.875rem;
            background-color: #f2f2f2;
            border-radius: 50%;

            img {
              width: 1.875rem;
              height: 1.875rem;
              background-color: #f2f2f2;
              border-radius: 50%;
            }
          }
        }

        .time_box {
          text-align: right;
        }

        .btn {
          font-size: 0.75rem;
          width: 4.375rem;
          height: 1.888rem;
          border-radius: 0.125rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 0.5rem;
        }
      }
    }
  }
</style>
