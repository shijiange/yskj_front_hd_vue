<template>
  <div>
    <div id="echats-income" style="height: 250px; width: 21rem;"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  props: ["income"],
  data() {
    return {
      eChartData: [],
      defaultData: [
        { date: "", amount: 0, count: 0 },
        { date: "", amount: 0, count: 0 },
        { date: "", amount: 0, count: 0 }
      ]
    };
  },

  watch: {
    income(newVal) {
      if (newVal && newVal.length > 0) {
        this.eChartData = newVal;
      } else {
        this.eChartData = this.defaultData;
      }
      console.log(newVal);
      console.log("更新了");
      this.initEcharts();
    }
  },

  mounted() {
    let curDate = new Date();
    let preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000); //前一天
    let nextDate = new Date(curDate.getTime() + 24 * 60 * 60 * 1000); //后一天
    this.defaultData[0].date = this.fun.dateFormat("mm-dd", preDate);
    this.defaultData[1].date = this.fun.dateFormat("mm-dd", curDate);
    this.defaultData[2].date = this.fun.dateFormat("mm-dd", nextDate);
    this.eChartData = this.defaultData;

    this.initEcharts();
  },

  methods: {
    initEcharts() {
      if (!document.getElementById("echats-income")) {
        return;
      }
      let $echartsDOM = document.getElementById("echats-income");
      let myEcharts = echarts.init($echartsDOM);
      let totals = this.eChartData.map(item => item.count);
      let maxCount = Math.max(...totals) || 50;
      let option = {
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["金额", "笔数"]
        },
        xAxis: [
          {
            type: "category"
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "金额",
            min: 0
            // max: maxMoney,
            // interval: intervalMoney
          },
          {
            type: "value",
            name: "笔数",
            min: 0,
            max: maxCount,
            axisLabel: {
              formatter: function(value, index) {
                return Math.floor(value);
              }
            }
          }
        ],
        dataset: {},
        series: [
          {
            name: "金额",
            type: "bar",
            color: "#3b84f2",
            barWidth: 20
          },
          {
            name: "笔数",
            type: "line",
            yAxisIndex: 1,
            color: "#ffc11e"
          }
        ]
      };
      option.dataset.dimensions = ["date", "amount", "count"];
      option.dataset.source = this.eChartData;
      myEcharts.setOption(option);
    }
  },
  components: {}
};
</script>

<style scoped lang="less"></style>
