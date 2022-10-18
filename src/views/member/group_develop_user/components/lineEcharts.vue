<template>
  <div :id="id" style="height: 220px; width: 22rem;"></div>
</template>

<script>
import echarts from "utils/echarts";

export default {
  props: ["id", "charts"],
  data() {
    return {};
  },
  mounted() {
    setTimeout(() => {
      this.setEcharts();
    }, 100);
  },
  watch: {
    charts() {
      this.setEcharts();
    }
  },
  methods: {
    setEcharts() {
      console.log("执行", this.charts);
      let $echartsDOM = document.getElementById(this.id);
      let myEcharts = echarts.init($echartsDOM);
      console.log(myEcharts);
      let option = {
        tooltip: {
          trigger: "axis"
        },
        grid: {
          top: "15%",
          left: "0%",
          right: "0%",
          bottom: "0%",
          containLabel: true
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: {
          axisTick: { show: false },
          axisLine: { onZero: false, lineStyle: { color: "rgb(208,208,208)", width: 2 } },
          axisLabel: { color: "rgb(108,108,108)" },
          type: "category"
          //  data: this.charts.x || ['05-16', '05-17', '05-18', '05-19']
        },
        yAxis: [
          {
            type: "value",
            splitNumber: 3,
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { lineStyle: { type: "dashed" } },
            min: 4
          }
        ],
        series: [
          // {
          //   name: '入群人数',
          //   type: 'line',
          //   symbol:'circle',
          //   symbolSize:8,
          //   color: 'rgb(24,144,255)',
          //   data: this.charts.y_in || [220, 182, 191, 234]
          // },
          // {
          //   name: '退群人数',
          //   type: 'line',
          //   symbol:'circle',
          //   symbolSize:8,
          //   color: 'rgb(65,198,76)',
          //   data: this.charts.y_withdraw || [120, 132, 101, 134]
          // },
          // {
          //   name: '新会员人数',
          //   type: 'line',
          //   symbol:'circle',
          //   symbolSize:8,
          //   color: 'rgb(255,168,24)',
          //   data: this.charts.y_new_member || [150, 232, 201, 154]
          // }
        ]
      };

      let { x, y } = this.charts;
      option.xAxis.data = x;
      for (let i = 0; i < y.length; i++) {
        let obj = {
          name: y[i].name,
          type: "line",
          symbol: "circle",
          symbolSize: 8,
          color: y[i].color,
          data: y[i].data
        };
        option.series.push(obj);
      }
      myEcharts.setOption(option);
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped></style>
