<template>
    <div id="shareholderCenter">
        <div class="m_header">
           <span class="iconfont icon-left"></span>
           股东中心
       </div>
       <div class="share_holder">
            <p><span>一级股东</span> <span>分红比例:1%</span></p>
            <ul class="today_bonus">
               <li v-for="(item,i) in ratioDatas" :key='i' :class="item.name">
                   <span>{{item.money}}</span> <br>
                   <b>{{item.data}}</b>
               </li>
               <li class="line"><div class="careat"></div></li>
           </ul>
       </div>
       <div class="shareholder-order">
            <div class="input">
                <input type="text" @focus="beginSearch" v-model="searchVal" placeholder="搜索订单编号">
            </div>

            <ul class="ratioNav">
              <li @click="changeType(0)" :class="{selected:salaryAll}">全部</li>
              <li @click="changeType(1)" :class="{selected:salaryed}">已结算</li>
              <li @click="changeType(2)" :class="{selected:salaring}">未结算</li>
            </ul>

            <ul class='rationList'>
                <li v-for="(elem,i) in rationData" :key='i'>
                    <div class="left">
                        <span>订单号：{{elem.id}}</span>
                        <p>订单完成时间：{{elem.time}}</p>
                    </div>
                    <div class="right">
                        <img :src="elem.img">
                        分红+{{elem.salary}}
                    </div>
                </li>
            </ul>
       </div>
       <!-- //搜索弹窗 -->
       <div class="modal" :class="{serchActive:showSearch}">
            <div class="input">
                <i class="fa fa-angle-left" style="font-size: 26px;" @click="goBack"></i>
                <!--<i class="el-icon-arrow-left" @click="goBack"></i>-->
                <input  v-model="searchVal" type="search" name="" @keyup.enter="searching" placeholder="搜索订单编号">
            </div>
            <div class="modal-dialog">
                <h1>时间</h1>
                <div class="select-time">
                    <div class="block">
                        <!--<el-date-picker-->
                          <!--v-model="value1"-->
                          <!--type="date"-->
                          <!--placeholder="选择起始日期"-->
                          <!--:picker-options="pickerOptions0">-->
                        <!--</el-date-picker>-->
                        <van-button plain type="primary" style="border-radius: 5px; color: #1f2d3d; border: 1px solid #bfcbd9; min-height: 1rem; min-width: 4rem;" @click="seleStartTime">{{startTime}}</van-button>
                    </div>
                     <span>~</span>
                    <div class="block">
                        <!--<el-date-picker-->
                           <!--v-model="value2"-->
                           <!--align="right"-->
                           <!--type="date"-->
                           <!--placeholder="选择终结日期"-->
                           <!--:picker-options="pickerOptions1">-->
                        <!--</el-date-picker>-->
                        <van-button plain type="primary" style="border-radius: 5px; color: #1f2d3d; border: 1px solid #bfcbd9; min-height: 1rem; min-width: 4rem;"  @click="seleEndTime">{{endTiem}}</van-button>
                    </div>
                </div>
                <button type="button" @click="searching"  class="submit">确定</button>

            </div>
       </div>
        <van-popup v-model="dateshow_1" position="bottom" :overlay="true">
            <van-datetime-picker
                    v-model="value1"
                    type="date"
                    :max-date="maxDate"
                    @confirm="confirmbtn"
                    @cancel="cancelbtn"
            />
        </van-popup>
        <van-popup v-model="dateshow_2" position="bottom" :overlay="true">
            <van-datetime-picker
                    v-model="value2"
                    type="date"
                    :max-date="maxDate"
                    @confirm="confirmbtn_1"
                    @cancel="cancelbtn_1"
            />
        </van-popup>
    </div>
</template>

<script>
export default{
  data(){
    return{
      startTime:'选择起始日期',
      endTiem:'选择终结日期',
      dateshow_1:false,
      dateshow_2:false,
      maxDate: new Date(),
      ratioDatas:[
        {money:"00.00",data:"今日",name:"data"},
        {money:"00.00",data:"昨日",name:"data"},
        {money:"00.00",data:"本周",name:"data"},
        {money:"100.00",data:"本月累计分红",name:"mounth"}
      ],
      rationType:0,
      rationData:[
        {id:"111123456789",time:"2017-02-02",img:"",salary:'5.00'},
        {id:"111123456789",time:"2017-02-02",img:"",salary:'5.00'},
        {id:"111123456789",time:"2017-02-02",img:"",salary:'5.00'},
        {id:"111123456789",time:"2017-02-02",img:"",salary:'5.00'}
      ],
      isActive:true,
      val:"",
      salaryAll:true,
      salaryed:false,
      salaring:false,
      // 弹窗
      searchVal:"",
      searchValue:"",
      showSearch:true,
      // 时间
      // pickerOptions0: {
      //   disabledDate(time) {
      //     return time.getTime() < Date.now() - 8.64e7;
      //   }
      // },
      // pickerOptions1: {
      //     shortcuts: [{
      //         text: '今天',
      //         onClick(picker) {
      //             picker.$emit('pick', new Date());
      //         }
      //     }, {
      //     text: '昨天',
      //     onClick(picker) {
      //         const date = new Date();
      //         date.setTime(date.getTime() - 3600 * 1000 * 24);
      //         picker.$emit('pick', date);
      //     }
      //     }, {
      //     text: '一周前',
      //     onClick(picker) {
      //         const date = new Date();
      //         date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      //         picker.$emit('pick', date);
      //     }
      //     }]
      // },
      value1: '',
      value2: '',
    };
  },
  methods:{

    changeType(a,b){
      this.rationType=a;

      switch(this.rationType){
      case 0:{
        // console.log('请求全部分红数据中....');
        this.salaryAll=true,
        this.salaryed=false,
        this.salaring=false,
        this.rationData=[
          {id:"000123456789",time:"2017-02-02",img:"",salary:'5.00'},
          {id:"000456789",time:"2017-02-02",img:"",salary:'5.00'},
          {id:"000456789",time:"2017-02-02",img:"",salary:'5.00'},
          {id:"000456789",time:"2017-02-02",img:"",salary:'5.00'}
        ];
        break;
      }
      case 1:{
        // console.log('请求已结算分红数据中....');
        this.salaryAll=false,
        this.salaryed=true,
        this.salaring=false,
        this.rationData=[
          {id:"111123456789",time:"2017-02-02",img:"",salary:'5.00'},
          {id:"111123456789",time:"2017-02-02",img:"",salary:'5.00'},
          {id:"111123456789",time:"2017-02-02",img:"",salary:'5.00'},
          {id:"111123456789",time:"2017-02-02",img:"",salary:'5.00'}];
        break;
      }
      case 2:{
        // console.log('请求未结算分红数据中....');
        this.salaryAll=false,
        this.salaryed=false,
        this.salaring=true,
        this.rationData=[
          {id:"22223456789",time:"2017-02-02",img:"",salary:'5.00'},
          {id:"22223456789",time:"2017-02-02",img:"",salary:'5.00'},
          {id:"22223456789",time:"2017-02-02",img:"",salary:'5.00'},
          {id:"22223456789",time:"2017-02-02",img:"",salary:'5.00'}];
        break;
      }
      }
    },

    goBack(){
      this.showSearch=!this.showSearch;
    },

    // 处理子组件传来的搜索框获取焦点的函数
    beginSearch(isSupport){

      // 判断是否是从供应商页面的搜索
      this.isSupport=isSupport;

      // 处理搜索弹窗的隐现
      this.showSearch=!this.showSearch;

      // 清空上次的值
      this.searchVal="";
    },
    searching(){
      //传递搜索的值
      this.searchValue=this.searchVal;

      // console.log("");
      // console.log("根据不同的方式(是否是搜索供应商)开始向服务器请求搜索的数据.......");
      // console.log("获取到数据更新merchantsList并进行消息传递.......");
      // console.log("");

      //隐藏搜索弹窗
      this.showSearch=!this.showSearch;
    },
    //时间戳转日期
    format:function (shijianchuo){
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth()+1;
      var d = time.getDate();
      return y+'年'+m+'月'+d+'日';
    },
    confirmbtn:function (val) {
      this.dateshow_1=false;
      var time = new Date(val).getTime();
      this.startTime=this.format(time);
    },
    cancelbtn:function () {
      this.dateshow_1=false;
    },
    confirmbtn_1:function (val) {
      this.dateshow_2=false;
      var time = new Date(val).getTime();
      this.endTiem=this.format(time);

    },
    cancelbtn_1:function () {
      this.dateshow_2=false;
    },
    seleStartTime:function () {
      this.dateshow_1=true;
    },
    seleEndTime:function () {
      this.dateshow_2=true;
    }

  }
};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
p { margin: 0; padding: 0; }

#shareholderCenter {
  .m_header {
    width: 100%;
    height: 2.8125rem;
    line-height: 2.8125rem;
    font-size: 15px;
    font-weight: bold;
    background: #fff;

    span {
      display: inline-block;
      width: 1rem;
      height: 1.5rem;
      float: left;
      margin-left: 0.625rem;
      font-size: 30px;
    }
  }

  .share_holder {
    p {
      padding: 0 0.625rem;
      height: 2.8125rem;
      line-height: 2.8125rem;
      background: #f15353;
      color: #fff;

      span:first-child {
        float: left;
      }

      span:last-child {
        float: right;
      }
    }

    .today_bonus {
      width: 100%;
      height: 5.125rem;
      margin-top: 0.625rem;
      background: #fff;
      padding: 1.25rem 0;
      box-sizing: border-box;
      position: relative;
      border-top: 0.0625rem solid #ccc;
      border-bottom: 0.0625rem solid #ccc;

      li.line {
        position: absolute;
        width: 0.0625rem;
        height: 5rem;
        background: #ccc;
        top: 0;
        right: 32%;

        .careat {
          width: 0.5rem;
          height: 0.5rem;
          border: 0.0625rem solid #ccc;
          border-left: 0;
          border-bottom: 0;
          -webkit-transform: rotate(45deg);
          -moz-transform: rotate(45deg);
          -ms-transform: rotate(45deg);
          -o-transform: rotate(45deg);
          transform: rotate(45deg);
          background: #fff;
          position: absolute;
          top: 2.3125rem;
          right: -0.25rem;
        }
      }

      li {
        height: 2.75rem;
        text-align: center;
        float: left;

        span {
          font-size: 17px;
          line-height: 1.625rem;
        }

        b {
          font-size: 11px;
          color: 3333;
        }
      }

      li.data {
        width: 22%;

        span {
          color: #ffa800;
        }
      }

      li:first-child,
      li:nth-child(2) {
        border-right: 0.0625rem solid #ccc;
      }

      li.mounth {
        width: 32%;

        span {
          color: #fc6a70;
        }
      }
    }
  }

  .shareholder-order {
    background: #fff;
    margin-top: 0.625rem;

    .input {
      input {
        margin: 0.625rem 5%;
        width: 80%;
        height: 1.875rem;
        border-radius: 0.375rem;
        border: 0;
        outline: 0;
        padding-left: 1.875rem;
        background: url(../../../../assets/images/search.png) no-repeat 0.625rem 0.5rem #f2f2f2;
      }
    }

    .ratioNav {
      padding: 0;
      margin: 0;
      height: 2.5rem;
      width: 100%;
      background: #fff;
      border-bottom: 0.0625rem solid #cdcdcd;
      border-top: 0.0625rem solid #cdcdcd;

      li {
        float: left;
        width: 33%;
        text-align: center;
        line-height: 2.5rem;
        font-size: 14px;
        color: #666;
        border-bottom: 0.125rem solid transparent;
      }

      .selected {
        color: #f15353 !important;
        border-bottom: 0.125rem solid #f15353;
      }
    }

    .rationList {
      padding: 0;
      margin: 0;

      li {
        height: 3.4375rem;
        padding: 0.625rem;
        border-bottom: 0.0625rem solid #f3f3f3;

        .left {
          width: 60%;
          float: left;
          text-align: left;
          padding-left: 1.375rem;
          box-sizing: border-box;

          span {
            font-size: 14px;
            font-weight: 400;
            color: #333;
          }

          p {
            font-size: 12px;
            color: #999;
          }
        }

        .right {
          line-height: 3.4375rem;
          float: left;
          width: 40%;
          color: #20b86a;
        }
      }
    }
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: #f3f5f7;

    .input {
      display: flex;
      height: 2.8125rem;
      background: #fff;
      box-sizing: border-box;
      margin: 0 0.625rem;

      i {
        font-size: 16px;
        line-height: 2.8125rem;
        padding-left: 0.25rem;
      }

      input {
        margin: 0.625rem 5%;
        width: 80%;
        height: 1.875rem;
        border-radius: 0.375rem;
        border: 0;
        outline: 0;
        padding-left: 1.875rem;
        background: url(../../../../assets/images/search.png) no-repeat 0.625rem 0.5rem #f2f2f2;
      }
    }

    .modal-dialog {
      h1 {
        font-size: 16px;
        color: #666;
        line-height: 3.4375rem;
        font-weight: normal;
        text-align: left;
        padding-left: 1.5625rem;
      }

      .select-time {
        text-align: center;

        .block {
          width: 38%;
          display: inline-block;
        }

        .el-input {
          width: 100%;
        }

        span {
          font-size: 22px;
          font-weight: 400;
        }
      }

      .submit {
        width: 20.3125rem;
        height: 2.5rem;
        border-radius: 0.375rem;
        background-color: #f15353;
        text-align: center;
        line-height: 2.5rem;
        color: #fff;
        border: 0;
        outline: 0;
        font-size: 14px;
        font-weight: bold;
        margin-top: 1.25rem;
      }
    }
  }

  .serchActive {
    display: none !important;
  }
}

</style>