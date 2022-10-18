<template>
  <div id="pastLog">
    <c-title :hide="false" :text="'往日' + gxz_name + '数量'"></c-title>
    <div class="timeSelect">
      <div class="start" style="margin-right: 0.53rem;" @click="show = true">
        <div>起始时间</div>
        <div class="startOn">{{ start_time }}</div>
      </div>
      <div class="start" @click="show1 = true">
        <div>终止时间</div>
        <div class="startOn">{{ end_time }}</div>
      </div>
      <div class="btn" @click="serach">
        <i class="iconfont icon-fontclass-jiantou"></i>
      </div>
    </div>
    <div class="list" v-for="(item, ind) in list" :key="ind">
      <div class="left">
        <span class="leftTxt">{{gxz_name}}数量</span>
        <span class="gxz">{{ item.commission_gxz }}</span>
      </div>
      <div class="left">{{ item.created_at }}</div>
    </div>
    <yz-blank :datas="list"></yz-blank>
    <van-popup v-model="show" position="bottom" :style="{ height: '50%' }" :close-on-click-overlay="false">
      <van-datetime-picker v-model="currentDate" type="date" title="选择年月" :formatter="formatter" @cancel="btnCancel" @confirm="btnFinished" />
    </van-popup>
    <van-popup v-model="show1" position="bottom" :style="{ height: '50%' }" :close-on-click-overlay="false">
      <van-datetime-picker v-model="currentDate" type="date" title="选择年月" :formatter="formatter" @cancel="btnCancel" @confirm="btnFinished1" />
    </van-popup>
  </div>
</template>
<script>
import { scrollMixin } from "utils/mixin";
import yzBlank from "components/ui_components/yz_blank";
import { Toast } from "vant";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      gxz_name: "",
      list: [],
      start_time: "",
      end_time: "",
      show1: false,
      show: false,
      currentDate: new Date(),
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  components: { yzBlank },
  activated() {
    this.getData();
  },
  methods: {
    serach() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.getData();
    },
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      } else if (type === "day") {
        return `${val}日`;
      }
      return val;
    },
    btnFinished(e) {
      this.start_time = this.formatDate(e);
      this.show = false;
    },
    btnFinished1(e) {
      this.end_time = this.formatDate(e);
      this.show1 = false;
    },
    btnCancel() {
      this.show = false;
      this.show1 = false;
    },
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    getData() {
      $http
        .post("plugin.zhp-group-lottery.frontend.contribution.get-old-today-contribution", { start_time: this.start_time, end_time: this.end_time, page: this.page }, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.gxz_name = response.data.gxz_name;
            this.fun.setWXTitle(this.gxz_name);
            this.list = response.data.data;
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
          } else {
            Toast(response.msg);
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
        $http
          .get("plugin.zhp-group-lottery.frontend.contribution.get-old-today-contribution", { start_time: this.start_time, end_time: this.end_time, page: that.page }, "加载中")
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
<style lang="scss" scoped>
.list {
  padding: 0 0.94rem;
  display: flex;
  flex-direction: column;
  height: 3.91rem;
  background-color: #fff;
  justify-content: center;
  border-bottom: 1px solid #f6f6f6;

  .left {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: #9f9f9f;

    .leftTxt {
      font-size: 0.88rem;
      color: #222;
    }

    .gxz {
      font-size: 0.94rem;
      color: #f15353;
    }
  }
}

.timeSelect {
  padding: 0.75rem 0.88rem;
  display: flex;
  align-items: center;

  .btn {
    width: 1.72rem;
    height: 1.72rem;
    background-color: #010101;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    margin-left: 0.66rem;
    flex-shrink: 0;

    i {
      font-size: 1.3rem;
      transform: rotate(90deg);
    }
  }

  .start {
    width: 9.38rem;
    height: 3.47rem;
    background-color: #fff;
    box-shadow: 0 0.03rem 0.75rem 0 rgba(210, 210, 210, 0.46);
    border-radius: 0.31rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-left: 0.97rem;
    color: #959595;
    font-size: 0.75rem;

    .startOn {
      color: #333;
      font-size: 0.94rem;
    }
  }
}
</style>
