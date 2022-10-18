import cTitle from 'components/title';
import echarts from 'utils/echarts';
// import { Toast } from 'vant';
export default {
  data() {
    return {
      total: '',
      month: '',
      today: '',
      date: [],
      price: [],
      recent: ''
    };
  },

  activated() {},

  mounted() {
    this.getPerformance();
  },
  methods: {
    getPerformance() {
      $http.get('finance.OrderAll').then((res) => {
        if (res.result == 1) {
          this.total = res.data.all;
          this.month = res.data.month;
          this.today = res.data.today;
          this.recent = res.data.recent;
          //   console.log(this.recent)
          for (var value in this.recent) {
            this.date.push(this.recent[value].date);
            this.price.push(this.recent[value].price);
          }
          let $echartsDOM = document.getElementById('echarts-dom');
          let myEcharts = echarts.init($echartsDOM);
          let option = {
            title:{
              text:'最近7天营业额(万元)',
              textStyle:{
                fontSize:14,
                color:'#FF5511'
              }
            },
            xAxis: {
              type: 'category',
              // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              data: this.date,
              boundaryGap: false,
              axisLabel: {
                fontSize: 14,
                fontFamily: 'Arial',
                interval: 0,
                rotate: 30
              }
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                fontFamily: 'Arial',

              }
            },
            series: [{
              // data: [820, 932, 901, 934, 1290, 1330, 1320],
              data: this.price,
              type: 'line',
              hoverAnimatio: true
            }]
          };

          myEcharts.setOption(option);
        }
      });
    }
  },
  components: {
    cTitle}
};
