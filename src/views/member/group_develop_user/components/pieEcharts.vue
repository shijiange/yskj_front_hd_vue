<template>
    <div class="pieWrapper">
        <div class="top">
            <div :id="id" style="height: 150px; width: 12rem;"></div>
            <div class="desc">
                <div class="desc-item item1" :class="{large:descFlag==true}">在群人数 <span class="num">{{total_in_count}}</span> </div>
                <div class="desc-item item2" :class="{large:descFlag==true}">退群人数 <span class="num">{{total_withdraw_count}}</span> </div>
            </div>
        </div>
        <div class="bot">
            <div class="progress">
                <div class="progress-bar"><div class="progress-value" style="background: #78d7bc;" :style="{width:`${progressValue1}%`}"></div></div>
                <div class="progress-text">
                    在群企业员工人数 <span class="num">{{total_in_employee_count}}</span>
                </div>
            </div>
            <div class="progress">
                <div class="progress-bar"><div class="progress-value" style="background: #ffa818;" :style="{width:`${progressValue2}%`}"></div></div>
                <div class="progress-text">
                    在群外部客户人数 <span class="num">{{total_in_customer_count}}</span>
                </div>
            </div>
        </div>


    </div>

</template>


<script>
import echarts from 'utils/echarts';

export default {
  props:['id','total_in_count','total_withdraw_count','total_in_employee_count','total_in_customer_count'],
  data() {
    return {
      descFlag:false,
      progressValue1:0,
      progressValue2:0,

    };
  },
  mounted(){
    setTimeout(()=>{
      this.setEcharts();
      this.progressValue1=(this.total_in_employee_count/(this.total_in_employee_count+this.total_in_customer_count))*100;
      this.progressValue2=(this.total_in_customer_count/(this.total_in_employee_count+this.total_in_customer_count))*100;
      this.descFlag=true;
    },1000);
  },
  methods:{
    setEcharts(){
      console.log("执行");
      let $echartsDOM = document.getElementById(this.id);
      let myEcharts = echarts.init($echartsDOM);
      console.log(myEcharts);
      let option = {


        series: [
          {
            type: 'pie',
            radius: ['60%', '100%'],
            silent:true,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {value: this.total_in_count, name: '在群人数',itemStyle:{color:'rgb(24,144,255)'}},
              {value: this.total_withdraw_count, name: '退群人数',itemStyle:{color:'rgb(65,198,76)'}},
            ]
          }
        ]
      };


      myEcharts.setOption(option);
    }
  }
};


</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .pieWrapper {
    .top {
      display: flex;
      align-items: flex-end;
      padding-top: 1.5rem;

      .desc {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;

        .desc-item {
          display: flex;
          align-items: center;
          height: 1.5rem;
          font-size: 0.85rem;
          color: #333;

          .num {
            margin-left: 0.2rem;
            color: #f14e4e;
          }

          &::before {
            content: '';
            display: block;
            width: 0.1rem;
            height: 0.1rem;
            margin-right: 0.6rem;
            border-radius: 50%;
            transition: 0.3s;
          }

          &.item1::before {
            background: rgb(24, 144, 255);
          }

          &.item2::before {
            background: rgb(65, 198, 76);
          }

          &.large::before {
            width: 1rem;
            height: 1rem;
          }
        }
      }
    }

    .bot {
      padding-top: 2rem;

      .progress {
        margin-bottom: 1rem;

        .progress-bar {
          position: relative;
          width: 100%;
          height: 1rem;
          background: #e8e8e8;
          border-radius: 1.5rem;

          .progress-value {
            position: absolute;
            left: 0;
            top: 0;
            height: 1rem;
            width: 0;
            border-radius: 1.5rem;
            transition: 1s;
          }
        }

        .progress-text {
          padding-top: 0.3rem;
          font-size: 0.8rem;
          text-align: left;
          color: #333;

          .num {
            margin-left: 0.2rem;
            color: #f14e4e;
          }
        }
      }
    }
  }
</style>