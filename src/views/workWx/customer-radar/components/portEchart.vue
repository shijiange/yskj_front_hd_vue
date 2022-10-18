<template>
  <div>
    <div :id="barId" style="height: 16.31rem;"></div>
    <div :id="pieId" style="height: 15.31rem;"></div>
  </div>
</template>

<script>
import echarts from "utils/echarts";

export default {
  props: {
    barId: {
      type: String
    },
    pieId: {
      type: String
    },
    port: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      eChartData: [],
      defaultData: [
        { name: "Wap", people: 0, total: 0 },
        { name: "公众号", people: 0, total: 0 },
        { name: "小程序", people: 0, total: 0 },
        { name: "APP", people: 0, total: 0 },
        { name: "PC", people: 0, total: 0 }
      ]
    };
  },

  watch: {
    port(newVal) {
      this.setECharts();
    }
  },
  mounted() {
    this.setECharts();
  },
  methods: {
    setECharts() {
      this.initData();
      this.initBarECHarts();
      this.initPieECharts();
    },

    initData() {
      if (this.port && this.port.length > 0) {
        this.eChartData = this.port;
      } else {
        this.eChartData = this.defaultData;
      }
    },

    initBarECHarts() {
      let myECharts = echarts.init(document.getElementById(this.barId));
      let option = {
        title: {
          top: "6%",
          left: "5%",
          text: "端口访问",
          subtext: "{b_title|访问次数}",
          textStyle: {
            color: "#0a0a14",
            fontWeight: "bold"
          },
          subtextStyle: {
            rich: {
              b_title: {
                color: "#a7b7c7",
                fontSize: 14,
                fontWeight: "bold",
                padding: [3, 4, 5, 125]
              }
            }
          }
        },
        grid: {
          top: "35%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        xAxis: {
          axisTick: { show: false },
          axisLine: { onZero: false, lineStyle: { color: "rgb(208,208,208)", width: 1 } },
          axisLabel: { interval: 0, color: "rgb(108,108,108)" },
          type: "category"
        },
        yAxis: [
          {
            type: "value",
            min: 3,
            minInterval: 1,
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { lineStyle: { type: "dashed" } }
          }
        ],
        dataset: {},
        series: [
          {
            type: "bar",
            symbol: "circle",
            symbolSize: 8,
            barWidth: 20,
            itemStyle: { color: "rgb(24,144,255)" }
          }
        ]
      };
      // 指定数据集
      option.dataset.dimensions = ["name", "total"];
      option.dataset.source = this.eChartData;
      myECharts.setOption(option);
    },

    initPieECharts() {
      let myECharts = echarts.init(document.getElementById(this.pieId));
      let option = {
        title: {
          bottom: "3%",
          right: "20%",
          text: "访问人数",
          textStyle: {
            color: "#a7b7c7",
            fontSize: 14,
            fontWeight: "bold"
          }
        },
        legend: {
          type: "plain",
          orient: "vertical",
          x: "5%",
          y: "center"
        },
        series: [
          {
            type: "pie",
            center: ["70%", "50%"],
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            minAngle: 15, //最小角度
            startAngle: 270, //起始角度
            label: {
              show: false,
              position: "center",
              formatter: "{style1|{b}}\n{style2|{c} 人}",
              rich: {
                style1: {
                  fontSize: 12,
                  fontWeight: "bold"
                },
                style2: {
                  fontSize: 10,
                  color: "#999"
                }
              },
              emphasis: {
                show: true
              }
            },
            labelLine: {
              show: false
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "12",
                fontWeight: "bold"
              }
            },
            data: []
          }
        ]
      };
      let itemColors = {
        Wap: "#f17953",
        公众号: "#5d76e4",
        小程序: "#33c6fd",
        APP: "#fdb43a",
        PC: "#51c186"
      };
      option.series[0].data = this.eChartData.map(item => {
        return {
          name: item.name,
          value: item.people,
          itemStyle: {
            color: itemColors[item.name]
          }
        };
      });
      option.legend.formatter = function(name) {
        let data = option.series[0].data;
        let v = data.find(item => item.name == name);
        return `${name}: ${v.value}`;
      };
      myECharts.setOption(option);
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped></style>
