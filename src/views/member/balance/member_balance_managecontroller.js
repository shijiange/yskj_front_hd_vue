import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  data() {
    return {
      data: [],
      goods_length: 0,
      pay_status: '0',
      renew_status:'0',
      is_show:false,
      showCallFisrt: false,
      showCallTwo: false,
      phone1: null,
      phone2: null
    };
  },
  methods: {
    initData() {
      $http.get("plugin.supplier.frontend.insurance.index",{},"").then(res => {
        if (res.result == 1) {
          for (let i = 0;i < res.data.list.length;i++) {
            res.data.list[i].edit_active = false;
          }
          this.data = res.data.list;
          this.goods_length = res.data.list.length;
          //是否开启支付按钮
          this.pay_status = res.data.set.ins_pay_status;
          //是否开启续保按钮
          this.renew_status = res.data.set.ins_renew_status;
          //联系电话
          this.phone1 = res.data.set.ins_phone_1;
          this.phone2 = res.data.set.ins_phone_2;
        } else {
          // 判断权限
          if (res.data.url) {
            this.$notify(res.msg);
            window.location.href = res.data.url;
            return 0;
          }
          Toast(res.msg);
        }
      });
    },
    contInsurance(index){
      let that = this;
      this.$dialog.confirm({
        title: "提示",
        message: '确认续保吗?',
      }).then(() => {
        // on confirm
        that.$router.push(that.fun.getUrl("edit_balance_manage", {
          id: that.data[index].id,type:'contInsurance'
        }));
      }).catch(() => {
        // on cancel
        that.$notify({
          background: '#edf2fc',
          message: '已取消续保',
          color: '#909399'
        });
      });


    },
    showPhonePopup(){
      this.showCallFisrt = false;
      this.showCallTwo = true;
    },
    showHidden(){
      this.showCallTwo = false;
    },
    // 跳转到保单详情
    goTodetail(id) {
      this.$router.push(
        this.fun.getUrl("balance_manageDetail", {
          id: id
        })
      );
    },
    //跳转到表单添加
    goToAddbalance(){
      this.$router.push(
        this.fun.getUrl("add_balance_manage",{})
      );
    },
    moreEvent(index) {
      if (this.data[index].edit_active == false) {
        this.emptyEditActive();
        this.data[index].edit_active = true;
      }else {
        this.emptyEditActive();
      }
    },
    emptyEditActive() {
      for (let i = 0;i < this.data.length;i++) {
        this.data[i].edit_active = false;
      }
    },
    commodityDelete(index) {
      let that = this;
      this.emptyEditActive();
      this.$dialog.confirm({
        title: "提示",
        message: '此操作将永久删除该保单, 是否继续?',
      }).then(() => {
        // on confirm
        let json = {id: this.data[index].id};
        let urls = 'plugin.supplier.frontend.insurance.insurance-del';
        $http.post(urls, json).then(function (response) {
          if (response.result == 1) {
            that.$notify({
              background: '#f0f9eb',
              message: '保单删除成功',
              color: '#67c23a'
            });
            that.data.splice(index, 1);
            that.goods_length = Number(that.goods_length) - 1;
          } else {
            // that.$message.error(response.msg)
            that.$notify(response.msg);
          }
        }, function (response) {});
      }).catch(() => {
        // on cancel
        this.$notify({
          background: '#edf2fc',
          message: '已取消删除',
          color: '#909399'
        });
      });
    },
    //商品编辑
    editJumpEvent(index,_status) {
      console.log("sakdfjskdj",_status);
      if(_status != 1){
        this.$router.push(this.fun.getUrl("edit_balance_manage", {
          id: this.data[index].id,type:'edit'
        }));
      }else{
        this.showCallFisrt = true;
      }
    },
    gotoPay(_id,_supplier_id){
      this.$router.push(this.fun.getUrl("policyPay", {
        id: _id,supplier_id:_supplier_id
      }));
    },
    lastTime(lastT) {
      if(!lastT){
        return null;
      }
      var timestamp = Date.parse(new Date())/1000;
      let total = (lastT - timestamp);
      let dataTotal = parseInt(total / (24*60*60));
      if(dataTotal){
        return dataTotal + '天后到期';//计算整数天数
      }else{
        return "已到期";
      }
    },
  },
  filters: {
    TimeFilter: function(value) {
      if(!value){
        return null;
      }
      // return new Date(parseInt(value) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
      let date = new Date(value * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
      let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
      let m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
      let s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
      return Y+M+D+h+m+s;
    },
  },
  activated() {
    this.initData();
  },
  components: {
    cTitle
  }
};
