<template>
  <div class="float" v-if="list && list.length > 0">
    <van-swipe class="swiperContainer" @change="onChangeFloat" vertical :autoplay="2000" :show-indicators="false">
      <template v-for="(item, index) in list">
        <van-swipe-item class="swiperItem" :key="index">
          <div class="wrapper">
            <div class="image">
              <img :src="item.avatar_image" />
            </div>
            <template v-if="goods_type == 'zhpGroup'">
              <div class="text" v-if="item.type == 1">
                <span>恭喜{{ item.nickname }}拼中</span>
              </div>
              <div class="text" v-else>
                <span
                  >恭喜{{ item.nickname }}获得<template v-if="Number(item.numerical) > 0">{{ item.numerical }}{{ pluginName }}</template
                  ><template v-if="Number(item.credit) > 0">, {{ item.credit }}{{ item.credit_plugin_name }}</template></span
                >
              </div>
            </template>
            <template v-else>
              <div class="text">
                <span>{{ item.content }}</span>
              </div>
            </template>
          </div>
        </van-swipe-item>
        <!-- <van-swipe-item class="swiperItem" :key="index"></van-swipe-item> -->
      </template>
    </van-swipe>
  </div>
</template>

<script>
export default {
  props: {
    broadcast_data: {
      default: () => []
    },
    goods_type: {
      type: String,
      default: ""
    },
    pluginName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      list: [],
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  created() {
    // console.log('sssssssss',this.broadcast_data);
    this.list = this.broadcast_data;
    if (this.goods_type == "zhpGroup") {
      this.zhpGroupList();
    }
  },
  methods: {
    zhpGroupList() {
      $http
        .post("plugin.zhp-group-lottery.frontend.goods.get-window-list", { activity_id: this.$route.params.id }, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.list = response.data.data;
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onChangeFloat(index) {
      if (index == this.list.length - 5) {
        this.getMoreFloatData();
      }
    },
    getMoreFloatData() {
      if (!this.isLoadMore) {
        return;
      }
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        $http
          .get("plugin.zhp-group-lottery.frontend.goods.get-window-list", { activity_id: this.$route.params.id, page: that.page }, "加载中")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.data;
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
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.float {
  position: absolute;
  top: 5.875rem;
  left: 50%;
  transform: translateX(-60%);
}

.swiperContainer {
  width: 17.031rem;
  height: 2rem;
}

.swiperContainer .swiperItem {
  width: 17.031rem;
  height: 2rem;
  display: flex;
  align-items: center;
}

.wrapper {
  max-width: 17.031rem;
  height: 1.25rem;
  display: flex;
  padding-right: 0.5rem;
  padding-left: 0.1rem;
  align-items: center;
  background-color: #000;
  border-radius: 0.609rem;
  opacity: 0.7;
  overflow: hidden;
}

.wrapper .image {
  width: 1.063rem;
  height: 1.063rem;
  display: flex;
  align-items: center;
  border-radius: 50%;
}

.wrapper .image img {
  width: 1.063rem;
  height: 1.063rem;
  border-radius: 50%;
}

.wrapper .text {
  font-size: 0.75rem;
  text-align: left;
  max-width: 15.5rem;
  padding-left: 0.5rem;
  color: #fff;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}
</style>
