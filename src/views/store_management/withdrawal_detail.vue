<template>
  <div class="withdrawal-detail">
    <c-title :hide="false" text="提现记录"></c-title>
    <div class="top-box">
      <p class="amount">{{$i18n.t('money')}}<span class="num">{{recordData.amounts ? recordData.amounts : 0}}</span></p>
      <div :class="['status', colorClass(status)]">{{recordData.status_name ? recordData.status_name : '待审核'}}</div>
    </div>
    <ul class="center-box">
      <li>
        <span class="title">收入类型</span>
        <span class="text">{{recordData.type_name}}</span>
      </li>
      <li>
        <span class="title">提现编号</span>
        <span class="text">{{recordData.withdraw_sn}}</span>
      </li>
      <li>
        <span class="title">提现方式</span>
        <span class="text">{{recordData.pay_way_name}}</span>
      </li>
      <li>
        <span class="title">提现时间</span>
        <span class="text">{{recordData.created_at}}</span>
      </li>
      <li>
        <span class="title">申请金额</span>
        <span class="text">{{$i18n.t('money')}}{{recordData.amounts}}</span>
      </li>
      <li>
        <span class="title">手续费</span>
        <span class="text">{{$i18n.t('money')}}{{recordData.poundage}}</span>
      </li>
    </ul>

    <van-cell v-if="recordData.type !== 'balance'" class="income" title="收入信息" is-link @click="showPopup=true"></van-cell>

    <div class="bottom-btns">
      <!-- 余额 -->
      <template v-if="recordData.type == 'balance'">
        <div class="btn submit" v-if="status == 0" @click="clickButton(1,1)">通过</div>
        <div class="btn submit" v-if="status == 0" @click="clickButton(1,3)">驳回</div>
        <div class="btn submit" v-if="status == 0" @click="clickButton(1,-1)">无效</div>
      </template>
       <!-- 收入 -->
      <template v-if="recordData.type !== 'balance'">
        <div class="btn submit" v-if="status == 0" @click="clickButton(1,1)">提交审核</div>
      </template>
      <div class="btn weChat-pay" v-if="status == 1" @click="clickButton(2)">{{recordData.payment_button_name}}</div>
      <div class="btn offline-pay" v-if="status == 4 || status == 1" @click="clickButton(7)">线下确认打款</div>
      <div class="btn reject-pay" v-if="  status == 1" @click="clickButton(6)">驳回</div>
      <div class="btn re-pay" v-if="status == 4" @click="clickButton(5)">重新打款</div>
      <div class="btn re-examine" v-if="status == -1" @click="clickButton(3)">重新审核</div>
    </div>

    <van-popup v-model="showPopup" class="record-detail-popup" position="bottom">
      <van-row class="th">
        <van-col span="4">收入id</van-col>
        <van-col span="5">金额</van-col>
        <van-col span="9">收入时间</van-col>
        <van-col span="6" style="text-align: right;padding-right:0.5rem" @click="closePopup">
          <van-icon class="close-icon" name="cross"></van-icon>
        </van-col>
      </van-row>
      <div class="srcoll-box">
        <van-checkbox-group v-model="batchIncomes" ref="checkboxGroup">
          <van-row class="tr" v-for="(item, index) in incomes" :key="item.id">
            <div @click="toggleItem(item.id)">
              <van-col span="5" style="display:flex;justify-content: space-evenly;">
                <van-checkbox class="checkbox" v-if="isOperation" :name="item.id" :ref="'checkbox'+item.id" @click.stop></van-checkbox>
                <span>{{item.id}}</span>
              </van-col>
              <van-col span="5">{{item.amount}}</van-col>
              <van-col span="9">{{item.created_at}}</van-col>
            </div>
            <van-col span="5" :style="{color: item.auditStatus? '#29BA9C' : '#9f9e9e'}">
              <span @click.stop="showSheet(index)">{{item.auditStatus?item.auditStatusText:item.pay_status_name}}</span>
              <van-icon v-if="status==0 && !item.auditStatus" name="arrow"></van-icon>
            </van-col>
          </van-row>
        </van-checkbox-group>
      </div>

      <div class="empty-placeholder"  v-if="isOperation"></div>
      <div :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '', 'all-handler']"  v-if="isOperation">
        <div class="check-all">
          <van-checkbox v-model="allCheck" @change="toggleAll">
            <template #icon="props">
              <i :class="['iconfont', 'icon-all_select_active', props.checked ? 'activeIcon' : '']"></i>
            </template>
            <span>全选</span>
          </van-checkbox>
        </div>
        <div class="btns">
          <div class="btn" @click="clickBatchBotton(statusActions[0])">通过</div>
          <div class="btn" @click="clickBatchBotton(statusActions[1])">驳回</div>
          <div class="btn" @click="clickBatchBotton(statusActions[2])">无效</div>
        </div>
        <div class="complete" @click="closePopup">完成</div>
      </div>

    </van-popup>

    <van-action-sheet v-model="isShowSheet" :actions="statusActions" @select="changeStatus" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: '',
      status: '',
      recordData: {},
      incomes: [],
      showPopup: false,

      allCheck: false,
      isOperation: false,
      isShowSheet: false,
      statusActions: [
        {status: 1, name: "通过"},
        {status: 3, name: "驳回"},
        {status: -1, name: "无效"},
      ],
      batchIncomes: [], // 批量操作的收入id
    };
  },

  activated () {
    this.id = this.$route.params.id;
    if (!this.id) {
      this.$router.go(-1);
    }
    this.getData();
  },

  methods: {
    getData () {
      $http.post("plugin.shop-assistant.frontend.withdraw.withdraw-detail", {id: this.id}, "loading")
        .then((response) => {
          if (response.result !== 1) {
            return this.$toast(response.msg);
          }
          this.recordData = response.data;
          this.status = response.data.status;
          this.incomes = response.data.type_data ? response.data.type_data.incomes : [];
          if (this.status == 0 || this.status == -1) {
            this.isOperation = true;
          } else {
            this.isOperation = false;
          }
        });
    },

    closePopup () {
      this.showPopup = false;
    },

    showSheet (index) {
      if (this.status == 0) {
        this.setIndex = index;
        this.isShowSheet = true;
      }
    },
    changeStatus (event) {
      this.isShowSheet = false;
      this.incomes[this.setIndex].auditStatus = event.status;
      this.incomes[this.setIndex].auditStatusText = event.name;
    },

    // 全选
    toggleAll () {
      this.$refs.checkboxGroup.toggleAll(this.allCheck);
    },
    toggleItem (id) {
      let el = this.$refs['checkbox'+id][0];
      el && el.toggle();
    },

    clickBatchBotton (event) {
      if (this.batchIncomes.length <= 0) {
        return this.$toast("请选择需要修改的记录");
      }
      this.incomes.forEach((ele, index) => {
        let id = ele.id * 1;
        if (this.batchIncomes.includes(id)) {
          this.$set(this.incomes[index], 'auditStatus', event.status);
          this.$set(this.incomes[index], 'auditStatusText', event.name);
        }
      });
    },

    clickButton (type, opt) {
      let json = {
        id: this.id,
        submit_operation: type
      };
      let tips = '';
      if (type == 1) {
        // 审核
        if (this.recordData.type == "balance") {
          json.status = opt;
        } else {
          // 收入审核，默认操作全部记录
          json.audit = {};
          this.incomes.forEach((item) => {
            if (item.auditStatus) {
              json.audit[item.id] = item.auditStatus;
            } else {
              json.audit[item.id] = this.statusActions[0].status;
            }
          });
        }
      } else if (type == 2) {
        tips = "是否需要" + this.recordData.payment_button_name;
        // 打款
      } else if (type == 3) {
        // 重新审核
        tips = "将重新审核记录,确认是否执行该操作!";
      } else if (type == 5) {
        // 重新打款
        tips = "重新打款一次，确认是否执行该操作!";
      } else if (type == 6) {
        // 审核驳回
        tips = "驳回后，需要会员重新申请提现（仅驳回审核通过提现）";
      } else if (type == 7) {
        // 线下确认打款
        tips = "本打款方式需要线下打款，系统只是完成流程!";
      }
      this.submitOperation(json, tips);
    },

    submitOperation (data, tip) {
      let that = this;
      let fun = () => {
        $http.post("plugin.shop-assistant.frontend.withdraw.examine", {...data}, "loading")
          .then((response) => {
            that.$toast(response.msg);
            if (response.result == 1) {
              that.status = '';
              that.recordData = {};
              that.incomes = [];
              that.showPopup = false;
              that.getData();
            }
          });
      };
      if (tip) {
        this.$dialog.confirm({message: tip})
          .then(() => {fun();})
          .catch (() => {
            this.$toast("您取消了操作");
          });
      } else {
        fun();
      }
    },
  },

  computed: {
    colorClass (status) {
      return (status) => {
        switch (parseInt(status)) {
        case -1:
          return 'grey';
        case 0:
          return 'red';
        case 1:
          return 'yellow';
        case 2:
          return 'green';
        case 3:
          return 'orange ';
        case 4:
          return 'blue';
        }
      };
    },
  },

  components: {},
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.withdrawal-detail {
  position: relative;
  min-height: 100vh;
  .top-box {
    padding: 2rem 0;
    background-color: #ffffff;
    .amount {
      font-weight: bold;
      .num {
        font-size: 1.875rem;
        color: #323232;
      }
    }
    .status {
      display: inline-block;
      margin-top: 1.18rem;
      color: #ffffff;
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      border-radius: 0.13rem;
      background-color: #f15353;
    }
    .red {
      background-color: #f15353;
    }
    .yellow {
      background-color: #f7c124;
    }
    .blue {
      background-color: #28b2fa;
    }
    .green {
      background-color: #74b23d;
    }
    .orange {
      background-color: #f2852e;
    }
    .grey {
      background-color: #a6a6a6;
    }
  }
  .center-box {
    margin-top: 0.625rem;
    padding: 0 0.98rem;
    background-color: #ffffff;
    li {
      display: flex;
      justify-content: space-between;
      padding: 0.625rem 0;
      font-size: 0.875rem;
      .title {
        white-space: nowrap;
        color: #6b6b6b;
      }
      .text {
        padding-left: 1rem;
        white-space: pre-wrap;
        word-break: break-all;
        color: #303030;
      }
    }
  }
  .income {
    margin-top: 0.625rem;
    text-align: left;
  }
  .bottom-btns {
    position: absolute;
    bottom: 1rem;
    left: 0;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    .btn {
      flex: 1;
      margin-right: 0.5rem;
      color: #ffffff;
      border-radius: 3rem;
      background-color: #f15353;
      padding: 0.8rem;
      white-space: nowrap;
      text-align: center;
    }
    .weChat-pay {
      background-color: #f2852e;
    }
    .reject-pay {
      color: #f15353;
      border: solid 0.063rem #f15353;
      background-color: transparent !important;
    }
    .re-pay {
      color: #f2852e;
      border: solid 0.063rem #f2852e;
      background-color: transparent !important;
    }
  }
  .record-detail-popup {
    height: calc(100% - 44px);
    padding: 1.5rem 0.2rem;
    font-size: 0.85rem;
    overflow: hidden;
    .th {
      color: #646464;
      margin-bottom: 1rem;
    }
    .tr {
      position: relative;
      // height: 2.5rem;
      // line-height: 2.5rem;
      padding: 0.5rem 0;
      white-space: pre-wrap;
      word-break: break-all;
      overflow: hidden;
    }
    .tr::after{
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      height: 1px;
      width: 100%;
      transform: translateX(-50%);
      background-color: #ececec;
    }
    .srcoll-box {
      height: 90%;
      overflow-y: auto;
      /deep/ .checkbox {
        min-width: 1.5rem;
        .van-checkbox__icon {
          .van-icon {
            border: none;
            color: #fff;
            background: #c4c4c4;
          }
        }
        .van-checkbox__icon--checked {
          .van-icon {
            background-color: #f15353 !important;
          }
        }
      }

    }


  .empty-placeholder {
    width: 100%;
    height: 3.2rem;
  }
  .all-handler {
    width: 100%;
    height: 3.2rem;
    padding: 0.65rem;
    background: #fff;
    border-top: 0.0625rem solid #e1e1e1;
    position: fixed;
    bottom: 0;
    z-index: 99;
    display: flex;
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    .check-all {
      display: flex;
      .icon-all_select_active {
        font-size: 1.2rem;
        color: #c4c4c4;
      }
      .activeIcon {
        color: #f15353;
      }
    }
    .btns {
      flex: 1;
      display: flex;
      font-size: 0.8rem;
      justify-content: space-evenly;
      .btn {
        color: #f15353;
        padding: 0.2rem 0.8rem;
        border: 1px solid #f15353;
        border-radius: 0.825rem;
      }
    }
    .btn-active {
      color: #ffffff !important;
      background-color: #f15353;
    }
    .complete {
      margin-right: 1rem;
      color: #f15353;
    }
  }

    .close-icon {
      font-size: 1rem;
    }
  }
}
</style>