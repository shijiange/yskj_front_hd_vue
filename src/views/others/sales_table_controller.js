import { Toast } from 'vant';
export default {
  data() {
    return {
      banners: [],
      plugin_name:'',
      amounts: '',
      arr: [],
      background: [
        {
          thumb: require('../../assets/images/color_zero.png'),
          color: '#d58e02'
        },
        {
          thumb: require('../../assets/images/color_one.png'),
          color: '#259820'
        },
        {
          thumb: require('../../assets/images/color_two.png'),
          color: '#00616e'
        },
        {
          thumb: require('../../assets/images/color_three.png'),
          color: '#00616e'
        },
        {
          thumb: require('../../assets/images/color_four.png'),
          color: '#744095'
        },
        {
          thumb: require('../../assets/images/color_five.png'),
          color: '#d91077'
        },
        {
          thumb: require('../../assets/images/color_six.png'),
          color: '#ff8d4c'
        },
        {
          thumb: require('../../assets/images/color_seven.png'),
          color: '#e90003'
        },
        {
          thumb: require('../../assets/images/color_eight.png'),
          color: '#9f4c9a'
        },
        {
          thumb: require('../../assets/images/color_nine.png'),
          color: '#fc4e93'
        },
        {
          thumb: require('../../assets/images/color_ten.png'),
          color: '#c34228'
        },
        {
          thumb: require('../../assets/images/color_eleven.png'),
          color: '#81bb49'
        },
        {
          thumb: require('../../assets/images/color_twelve.png'),
          color: '#5c81e0'
        },
        {
          thumb: require('../../assets/images/color_thirteen.png'),
          color: '#e0b500'
        },
        {
          thumb: require('../../assets/images/color_fourteen.png'),
          color: '#811805'
        },
        {
          thumb: require('../../assets/images/color_fifteen.png'),
          color: '#1e646f'
        }
      ]
    };
  },
  created() {},
  activated() {
    window.scrollTo(0, 0);
    this.getData();
  },
  methods: {
    bannerTo(item) {
      if (item.link.length > 0) {
        window.location.href = item.link;
      }
    },
    getData() {
      $http
        .get('plugin.sales-report.Frontend.controllers.list.index', {}, '加载中')
        .then(
          response => {
            if (response.result === 1) {
              this.banners = response.data.banners;
              this.amounts = response.data.amounts;
              this.plugin_name=response.data.plugin_name;
              this.fun.setWXTitle( this.plugin_name);
              response.data.pools.forEach((item, index) => {
                item.today_total = item.today;
                item.total = item.amount;
              });
              this.arr = response.data.levels.concat(response.data.pools);
              let a = Math.ceil(this.arr.length / 16);
              if (a >= 2) {
                for (let i = 1; i < a; i++) {
                  this.background = this.background.concat(this.background);
                }
              }
            } else {
              Toast(response.msg);
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    }
  }
};
