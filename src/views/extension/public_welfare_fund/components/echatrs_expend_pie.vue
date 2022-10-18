<template>
  <div>
    <div id="echats-income-pie" style="height: 250px; width: 21rem;"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  props: ["expend"],
  data() {
    return {
      eChartData: [],
      defaultData: [
        { name: "剩余可支出", amount: 0 },
        { name: "支出总额", amount: 0 },
        { name: "收入总额", amount: 0 }
      ]
    };
  },
  watch: {
    expend(newVal) {
      this.initPieEcharts();
    }
  },
  mounted() {
    this.initPieEcharts();
  },
  methods: {
    initPieEcharts() {
      if (this.expend && this.expend.length > 0) {
        this.eChartData = this.expend;
      } else {
        this.eChartData = this.defaultData;
      }
      let data = this.eChartData;
      let $echartsDOM = document.getElementById("echats-income-pie");
      let myEcharts = echarts.init($echartsDOM);
      let option = {
        color: ["#005BFF", "#7466FF"],
        title: {
          x: 50,
          y: "70%",
          text: "",
          textStyle: {
            //主标题的属性
            fontSize: 12, //大小
            fontWeight: 400 //
          }
        },
        legend: {
          type: "plain",
          orient: "vertical",
          x: 20,
          y: "80%",
          formatter: function(a) {
            let target = data.find(item => item.name == a);
            return `${a}：${target.amount}元`;
          }
        },
        series: [
          {
            type: "pie",
            radius: ["50%", "60%"],
            center: ["50%", "38%"],
            labelLine: {
              normal: {
                length: 5
              }
            },
            label: {
              position: "outer",
              alignTo: "edge",
              margin: 10,
              formatter: function(a, b, c) {
                return a.name + a.percent + "%";
              }
            },
            data: []
          }
        ]
      };
      option.title.text = "收入总额：" + this.eChartData[2].amount + "元";
      option.series[0].data = this.eChartData.slice(0, 2).map(item => {
        return {
          name: item.name,
          value: item.amount
        };
      });
      myEcharts.setOption(option);
    }
  },
  components: {}
};
</script>

<style scoped lang="less"></style>
