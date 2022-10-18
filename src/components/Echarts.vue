<template>
  <div class="echarts" :id="id"></div>
</template>

<script>
// import echarts from 'echarts';
import echarts from 'utils/echarts';

export default {
  props: ["id", "text", "XData", "YData", "right"],
  data() {
    return {};
  },
  mounted() {
    let $echartsDOM = document.getElementById(this.id);
    let myEcharts = echarts.init($echartsDOM);
    let option = {
      title: {
        text: this.text,
        textStyle: {
          color: "#0094ff",
          fontSize: 12
        }
      },
      tooltip: {
        trigger: "axis"
      },
      grid: {
        left: "3%",
        right: this.right || "4%",
        bottom: "3%",
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: this.XData || [
          "周一",
          "周二",
          "周三",
          "周四",
          "周五",
          "周六",
          "周日"
        ]
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          type: "line",
          areaStyle: {},
          data: this.YData
        }
      ]
    };
    myEcharts.setOption(option);
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped></style>
