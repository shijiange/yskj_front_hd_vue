<template>
  <div class="shared_partner">
    <c-title text="共享合伙人"></c-title>
    <div class="info-box">
      <header class="member-header">
        <div class="member-img">
          <img :src="member.avatar || emptyImage" />
        </div>
        <div class="member-info">
          <div class="nickname">{{ member.nickname }}</div>
          <div class="member-id">会员ID:{{ member.member_id }}</div>
          <div class="member-level" @click="toMembergradelist">
            <div class="member-level-name">
              <img class="level-icon" src="../../../assets/images/member/level-icon.png" alt />
              <span>{{ member.level_name }}</span>
              <i class="fa fa-angle-right"></i>
            </div>
            <div class="member-level-time" v-if="member.expire_date">{{ member.expire_date }}</div>
          </div>
        </div>
        <div style="font-size: .75rem;color: #2f2f2f;" @click="showExplain">分成说明</div>
      </header>
      <div class="profit">
        <div class="title">
          <div class="line"></div>
          <div class="text">共享合伙人收益</div>
        </div>
        <div class="content">
          <div class="content-item">
            <div class="amount">
              <span>{{ $i18n.t("money") }}</span
              >{{ member.total_money || "0.00" }}
            </div>
            <div>累计分成金额</div>
          </div>
          <div class="content-item">
            <div class="amount">
              <span>{{ $i18n.t("money") }}</span
              >{{ member.money || "0.00" }}
            </div>
            <div>上期分成金额</div>
          </div>
          <div class="content-item">
            <div class="amount">{{ member.total_count || "0" }}</div>
            <div>累计分成次数</div>
          </div>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="operation">
        <div class="sort">
          <div @click="order_by">分成金额{{ calendarShow }}</div>
          <div @click="order_by">
            <div class="arrow arrow-up" :style="{ 'border-bottom': active ? '6px solid #ff5a5a' : '6px solid #818181' }"></div>
            <div class="arrow arrow-down" :style="{ 'border-top': !active ? '6px solid #ff5a5a' : '6px solid #818181' }"></div>
          </div>
        </div>
        <van-popover v-model="statusShow" trigger="click" :actions="actions" @select="onSelect">
          <template #reference>
            <div class="date select">
              <div class="select-text">{{ statusText || "请选择状态" }}</div>
              <van-icon name="close" @click.stop="onSelect({ text: '', value: '' })" />
            </div>
          </template>
        </van-popover>
        <div @click="calendarShowFun" class="date">
          <van-icon name="calendar-o" />
          <div class="text">{{ date || "请选择日期" }}</div>
          <van-icon name="close" @click.stop="delDate" />
        </div>
      </div>
      <div class="list-item" v-for="(item, i) in listData" :key="i">
        <div class="list-item-info">
          <div class="title">
            <div class="price">
              <span style="font-size: 10px;">{{ $i18n.t("money") }}</span
              >{{ item.money }}
            </div>
            <div class="status">{{ item.status == "1" ? "已分成" : item.status == "0" ? "待领取" : "未达标" }}</div>
          </div>
          <div class="time">{{ item.created_at }}</div>
        </div>
        <div class="btn receive" @click="receive(item.id, i)" v-if="item.status == 0">领取</div>
        <div class="btn" @click="showDetailed(item.id)">明细</div>
      </div>
    </div>
    <yz-blank text="暂无数据" :isBtn="false" v-if="listData.length == 0 && !loading"></yz-blank>
    <div style="display: flex;justify-content: center;align-items: center;" v-show="loading">
      <van-loading size="1.5rem">加载中...</van-loading>
    </div>

    <van-overlay :show="detailed">
      <div class="detailed-box">
        <div>
          <div class="detailed">
            <div class="title">分成明细</div>
            <div class="detailed-item">
              <div class="label">分成时间：</div>
              <div class="content">{{ detailedData.created_at }}</div>
            </div>
            <div class="detailed-item">
              <div class="label">分成时会员等级：</div>
              <div class="content">{{ detailedData.level_name }}</div>
            </div>
            <div class="detailed-item">
              <div class="label">分成金额：</div>
              <div class="content price">{{ detailedData.money }}元</div>
            </div>
            <div class="detailed-item">
              <div class="label">当期分成池总数：</div>
              <div class="content">{{ detailedData.total_money }}元</div>
            </div>
            <div class="detailed-item">
              <div class="label">当期等级总人数：</div>
              <div class="content">{{ detailedData.level_count }}人</div>
            </div>
            <div class="detailed-item">
              <div class="label">当期分成比列：</div>
              <div class="content">{{ detailedData.ratio }}%</div>
            </div>
            <div class="detailed-item">
              <div class="label">当期分成总金额：</div>
              <div class="content price">{{ detailedData.level_money }}元</div>
            </div>
            <div class="detailed-item">
              <div class="label">分成状态：</div>
              <div class="content status">{{ detailedData.status == "1" ? "已分成" : detailedData.status == "0" ? "待领取" : "未达标" }}</div>
            </div>
            <div class="detailed-item" v-if="detailedData.status == 2">
              <div class="label">备注：</div>
              <div class="content">{{ detailedData.remark }}</div>
            </div>
          </div>
          <div class="close-overlay">
            <van-icon name="close" size="1.6rem" color="#fff" @click="detailed = false" />
          </div>
        </div>
      </div>
    </van-overlay>
    <div class="overlay" v-show="explain">
      <div>
        <div class="detailed">
          <div class="title">分成说明</div>
          <div class="explain_html">
            <div v-html="description"></div>
          </div>
        </div>
        <div class="close-overlay">
          <van-icon name="close" size="1.6rem" color="#fff" @click="explain = false" />
        </div>
      </div>
    </div>
    <van-overlay :show="show">
      <div style="position: relative;height: 100vh;width: 100vw;">
        <div style="position: absolute;width: 100%;bottom: 0;left: 0;">
          <van-datetime-picker v-model="currentDate" @confirm="confirmDate" @cancel="calendarShowFun" type="date" :title="'选择年月日'" :min-date="minDate" :max-date="maxDate" />
        </div>
      </div>
    </van-overlay>
    <van-overlay :show="tipsShow">
      <div class="detailed-box">
        <div>
          <div class="detailed">
            <template v-if="tipsInfo.status == 1">
              <div class="title">领取成功</div>
              <div class="tips">恭喜您已经领取奖励</div>
              <div class="btn" @click.stop="tipsShow = false">确定</div>
            </template>
            <template v-else>
              <div class="title">领取提示</div>
              <div class="tips">当前页面不支持领取，请点击查看详情</div>
              <div class="btn" @click.stop="watchDetailed(tipsInfo.jump_url)">查看详情</div>
            </template>
          </div>
          <div class="close-overlay" v-if="tipsInfo.status != 1">
            <van-icon name="close" size="1.6rem" color="#fff" @click="tipsShow = false" />
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
var date = new Date();
// var toDay = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
import { scrollMixin } from "utils/mixin";
import yzBlank from "components/ui_components/yz_blank";
import { Toast } from "vant";
export default {
  components: { yzBlank },
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      loading: false,
      tipsShow: false,
      tipsInfo: {},
      actions: [
        { text: "已完成", value: "1" },
        { text: "待领取", value: "0" },
        { text: "未达标", value: "2" }
      ],
      member: {},
      listData: [],
      statusShow: false,
      active: "",
      date: "",
      show: false,
      currentDate: date,
      maxDate: date,
      minDate: new Date("2020-02-18"),
      detailed: false,
      detailedData: {},
      explain: false,
      description: "",
      statusText: "",
      statusValue: "",
      page: 1,
      total_page: 0,
      isLoadMore: true
    };
  },
  created() {
    this.getstatistics();
    this.getData();
  },
  methods: {
    initPage() {
      this.listData = [];
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
    },
    getstatistics() {
      $http.get("plugin.share-partner.frontend.dividend.get-statistics").then(({ result, data, msg }) => {
        if (result == 1) this.member = data || {};
        else Toast(msg);
      });
    },
    getDataJson(page) {
      this.loading = true;
      let json = { page };
      if (this.statusValue != "") json.status = this.statusValue;
      if (this.date != "") json.time = this.date;
      json.order_by = this.active ? "asc" : "desc";
      return json;
    },
    getData() {
      this.initPage();
      let json = this.getDataJson(1);
      $http.post("plugin.share-partner.frontend.dividend.get-list", json).then(({ result, data, msg }) => {
        this.isLoadMore = true;
        this.loading = false;
        if (result == 1) {
          this.isLoadMore = true;
          this.total_page = data.last_page || 0;
          this.listData = data.data;
        } else Toast(msg);
      });
    },
    getMoreData() {
      this.isLoadMore = false;
      if (this.page >= this.total_page) return false;
      else {
        let page = this.page + 1;
        let json = this.getDataJson(page);
        $http.get("plugin.share-partner.frontend.dividend.get-list", json).then(({ result, data, msg }) => {
          this.isLoadMore = true;
          this.loading = false;
          if (result === 1) {
            this.page = page;
            let myData = data.data;
            this.listData = this.listData.concat(myData); //数组拼接
          } else {
            Toast(msg);
            this.isLoadMore = false;
          }
        });
      }
    },
    toMembergradelist() {
      if (this.member.level && this.member.level.is_open == 1) {
        this.$router.push(this.fun.getUrl("MemberGradeList"));
      }
    },
    showExplain() {
      //分成说明
      this.explain = true;
      $http.post("plugin.share-partner.frontend.dividend.get-description", {}, "正在加载中...").then(({ result, data, msg }) => {
        if (result == 1) this.description = data.description;
        else {
          this.explain = false;
          Toast(msg);
        }
      });
    },
    calendarShowFun() {
      this.show = !this.show;
    },
    confirmDate(date) {
      this.show = false;
      let data = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      this.date = data;
      this.getData();
    },
    showDetailed(id) {
      $http.get("plugin.share-partner.frontend.dividend.get-detail", { id }).then(({ result, data, msg }) => {
        if (result == 1) this.detailedData = data;
        else {
          Toast(msg);
          this.detailed = false;
        }
      });
      this.detailed = true;
    },
    delDate() {
      this.date = "";
      this.getData();
    },
    onSelect({ value, text }) {
      this.statusText = text;
      this.statusValue = value;
      this.getData();
    },
    order_by() {
      this.active = !this.active;
      this.getData();
    },
    watchDetailed(jump_url) {
      // console.log(jump_url,this.fun.getUrl(jump_url));
      window.location.href = jump_url;
    },
    receive(id, i) {
      $http.post("plugin.share-partner.frontend.dividend.draw", { dividend_id: id }, "加载中...").then(({ result, msg, data }) => {
        if (result == 1) {
          this.tipsInfo = data;
          this.tipsShow = true;
          if (data.status == 1) this.$set(this.listData[i], "status", 1);
        } else Toast(msg);
      });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.explain_html {
  margin-top: 10px;
  max-height: 60vh;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.shared_partner {
  text-align: left;
}
.info-box {
  padding-top: 10px;
  color: #382c0a;
  background-color: #fff;
  background-image: linear-gradient(#ffc11e, #f5f5f5);
  .member-header {
    display: flex;
    align-items: center;
    padding: 10px;
    .member-img {
      flex: 0 0 4rem;
      margin-right: 8px;

      img {
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
      }
    }
    .member-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .nickname {
        font-size: 1rem;
        color: #382c0a;
        line-height: 1.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .member-id {
        font-size: 0.75rem;
        color: #625123;
        line-height: 1.5rem;
      }
      .member-level {
        display: flex;
        align-items: center;
        .member-level-name {
          display: flex;
          padding: 3px 7px;
          font-size: 12px;
          align-items: center;
          background-color: #a36705;
          border-radius: 15px;
          color: #fff;

          .level-icon {
            width: 14px;
            height: 14px;
            margin-right: 3px;
          }

          .fa-angle-right {
            font-size: 16px;
            margin-left: 3px;
          }
        }
        .member-level-time {
          font-size: 12px;
          margin-left: 5px;
          color: #af820d;
        }
      }
    }
  }
  .profit {
    width: 22.19rem;
    background-color: #fff;
    border-radius: 0.63rem;
    margin: 0 auto;
    padding: 1rem;
    .title {
      display: flex;
      color: #3a3a3a;
      align-items: center;
      margin-bottom: 1rem;
      .line {
        width: 0.13rem;
        height: 0.94rem;
        background-color: #ffc11e;
        margin-right: 0.5rem;
      }
    }
    .content {
      display: flex;
      align-items: center;
      justify-content: space-around;
      font-size: 0.8rem;
      color: #5d5d5d;
      line-height: 1.5rem;
      text-align: center;
      .amount {
        color: #cb5701;
        font-weight: 600;
      }
    }
  }
}
.list {
  padding: 1rem;
  .operation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .sort {
      display: flex;
      align-items: center;
      .arrow {
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        margin-left: 4px;
      }
      .arrow-down {
        margin-top: 2px;
      }
    }

    /deep/ .el-popper {
      width: 6rem;
    }

    .date {
      background-color: #fff;
      display: flex;
      width: 8rem;
      height: 1.75rem;
      border: 1px solid #dcdfe6;
      align-items: center;
      border-radius: 4px;
      padding: 0 0.4rem;
      font-size: 0.8rem;
      .text {
        flex: 1;
        font-size: 0.8rem;
        margin: 0 0.4rem;
        color: #1f1f1f;
      }
    }

    .select {
      width: 6rem;
      padding: 0 0.6rem;
      font-size: 0.6rem;
      .select-text {
        flex: 1;
      }
    }
  }
  .list-item {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 0.31rem;
    margin: 0.8rem 0;
    padding: 0.6rem;
    color: #fff;
    .list-item-info {
      flex: 1;
      .title {
        display: flex;
        line-height: 1.5rem;
        font-size: 0.69rem;
        align-items: center;
        .price {
          color: #ff5a5a;
          margin-right: 0.5rem;
          font-size: 15px;
        }
        .status {
          width: 2.8rem;
          padding: 0.1rem;
          background-color: #eaf4fc;
          border-radius: 0.13rem;
          font-size: 0.7rem;
          color: #3793f3;
          line-height: 1rem;
          text-align: center;
        }
      }
      .time {
        color: #6b6b6b;
        font-size: 0.7rem;
        margin-top: 0.2rem;
      }
    }
    .btn {
      width: 3.44rem;
      height: 1.44rem;
      background-color: #ff5a5a;
      border-radius: 0.66rem;
      line-height: 1.44rem;
      text-align: center;
      margin-left: 0.8rem;
    }
    .receive {
      background-color: #ff8814;
    }
  }
}

.detailed-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}
.detailed {
  width: 15.63rem;
  background-color: #ffffff;
  border-radius: 0.31rem;
  color: #6d6d6d;
  font-size: 0.75rem;
  padding: 0.2rem 0.81rem.81rem;
  .title {
    height: 2.66rem;
    line-height: 2.66rem;
    border-bottom: #f2f2f2 1px solid;
    font-size: 1rem;
    color: #161615;
    text-align: center;
  }
  .tips {
    padding: 1rem 0.5rem;
  }
  .btn {
    width: 4rem;
    height: 1.6rem;
    line-height: 1.6rem;
    text-align: center;
    margin: 0 auto;
    color: #fff;
    background-color: #5ab79c;
    border-radius: 0.3rem;
  }
  .detailed-item {
    display: flex;
    margin: 0.6rem 0;
  }
  .label {
    flex: 1;
    white-space: nowrap;
  }
  .content {
    font-size: 0.75rem;
    font-weight: normal;
  }

  .price {
    color: #ff5a5a;
  }

  .status {
    color: #3793f3;
  }
}
.close-overlay {
  width: 100%;
  margin-top: 1.8rem;
  text-align: center;
}
</style>
