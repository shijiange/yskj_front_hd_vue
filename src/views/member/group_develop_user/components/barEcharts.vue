<template>
  <div :id="id" style="height: 220px; width: 22rem;"></div>
</template>


<script>
// import echarts from 'echarts';
import echarts from 'utils/echarts';

export default {
  props:['id','total_join_scene_normal_count','total_join_scene_link_count','total_join_scene_qr_count'],
  data() {
    return {
    };
  },
  mounted(){
    setTimeout(()=>{
      this.setEcharts();
    },100);
  },
  methods:{
    setEcharts(){
      console.log("执行");
      let $echartsDOM = document.getElementById(this.id);
      let myEcharts = echarts.init($echartsDOM);
      console.log(myEcharts);
      let option = {
              
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top:'15%',
          left: '0%',
          right: '0%',
          bottom: '0%',
          containLabel: true
        },
        toolbox: {
          feature: {
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        xAxis: {
          axisTick:{show:false},
          axisLine:{onZero:false,lineStyle:{color:'rgb(208,208,208)',width:1}},
          axisLabel:{color:'rgb(108,108,108)'},
          type: 'category',
          data: ['直接邀请', '邀请链接', '扫群二维码']
        },
        yAxis: [{
          type: 'value',
          splitNumber:3,
          axisLine:{show:false},
          axisTick:{show:false},
          splitLine:{lineStyle:{type:'dashed'}}
        }],
        series: [
          {
            type: 'bar',
            symbol:'circle',
            symbolSize:8,
            barWidth:25,
            label:{show:true},
            itemStyle:{color:'rgb(24,144,255)'},
            data: [this.total_join_scene_normal_count, this.total_join_scene_link_count, this.total_join_scene_qr_count]
          }
        ]
      };


      myEcharts.setOption(option);
    }
  }
};


</script>

<style lang="scss" rel="stylesheet/scss" scoped></style>