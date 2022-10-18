<template>
  <div :id="id" style="height: 14.31rem;"></div>
</template>

<script>
import echarts from "utils/echarts";

export default {
  props: {
    id: {
      type: String
    },
    history: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      eChartData: [],
      defaultData: [
        {date: "", total: 0, people_total: 0},
        {date: "", total: 0, people_total: 0},
        {date: "", total: 0, people_total: 0},
      ],
    };
  },
  watch: {
    history() {
      this.setECharts();
    }
  },
  mounted () {
    this.setECharts();
  },
  methods: {
    setECharts() {
      this.initData();
      let myECharts = echarts.init(document.getElementById(this.id));
      let option = this.initOptions();
      // 指定数据集
      option.dataset.dimensions = ["date", "total", "people_total"];
      option.dataset.source = this.eChartData;
      myECharts.setOption(option);
    },

    initData () {
      if (this.history && this.history.length > 0) {
        this.eChartData = this.history;
      } else {
        let curDate = new Date();
        let preDate = new Date(curDate.getTime() - 24*60*60*1000); //前一天
        let nextDate = new Date(curDate.getTime() + 24*60*60*1000); //后一天
        this.defaultData[0].date = this.fun.dateFormat("mm-dd", preDate);
        this.defaultData[1].date = this.fun.dateFormat("mm-dd", curDate);
        this.defaultData[2].date = this.fun.dateFormat("mm-dd", nextDate);
        this.eChartData = this.defaultData;
      }
    },

    initOptions () {
      let option = {
        title: {
          text: "历史数据",
          top: "6%",
          left: "5%",
          textStyle: {
            color: "#0a0a14",
            fontWeight: "bold"
          },
        },
        legend: {
          type: "plain",
          orient: 'horizontal',
          top: "6%",
          right: "5%",
        },
        grid: {
          top: "25%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true
        },
        toolbox: {
          feature: {
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: {
          type: "category",
          axisTick: { show: false },
          axisLine: { onZero: false, lineStyle: { color: "rgb(208,208,208)", width: 2 } },
          axisLabel: { color: "rgb(108,108,108)" }
        },
        yAxis: [
          {
            type: "value",
            minInterval: 1,
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { lineStyle: { type: "dashed" } },
          }
        ],
        dataset: {},
        series: [
          {
            name: "次数",
            type: 'line',
            symbol:'circle',
            symbolSize:8,
            barWidth:25,
            color: '#34c758',
          },
          {
            name: "人数",
            type: 'line',
            symbol:'circle',
            symbolSize:8,
            barWidth:25,
            color: '#ff9502',
          }
        ]
      };
      return option;
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped></style>
