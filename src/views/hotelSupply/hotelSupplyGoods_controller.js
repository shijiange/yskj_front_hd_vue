import { Toast } from 'vant';
import cTitle from "components/title";
import datePicker from "components/hotelSupply/date_picker";

export default {
  data() {
    return {
      hotel_id:'',
      id:'',
      goods_info:'',
      end:'',
      start:'',
      night_day: "",
      show1: false, //入店时间弹窗
      show2: false, //离店时间弹窗
    };
  },

  activated() {
    this.hotel_id = this.$route.params.hotel_id;
    this.id = this.$route.params.id;
    this.getData();
    this.getInitTime();
  },
  created() {

  },
  mounted() {

  },
  methods: {
    getInitTime() {
      this.getTime();
    },
    getTime() {
      let now = new Date();
      let next = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      //this.start=`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
      //this.end=`${next.getFullYear()}-${next.getMonth()+1}-${next.getDate()}`;

      this.start = `${now.getFullYear()}-${
        now.getMonth() + 1 < 10
          ? `0${now.getMonth() + 1}`
          : `${now.getMonth() + 1}`
      }-${now.getDate() < 10 ? `0${now.getDate()}` : `${now.getDate()}`}`;
      this.end = `${next.getFullYear()}-${
        next.getMonth() + 1 < 10
          ? `0${next.getMonth() + 1}`
          : `${next.getMonth() + 1}`
      }-${next.getDate() < 10 ? `0${next.getDate()}` : `${next.getDate()}`}`;
    },
    goBack() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    },
    gotoService() {
      if (this.fun.isTextEmpty(this.goods_info.cservice)) {
        Toast("请设置客服");
      }
      window.location.href = this.goods_info.cservice;
    },
    gotoMember() {
      this.$router.push(this.fun.getUrl("member", {}));
    },
    gotoHome() {
      this.$router.push(this.fun.getUrl("home", {}));
    },
    dateInit(date){
      if(date){
        return date.split('/').reverse().join('-');
      }else {
        return '';
      }
    },
    getData() {
      let json = {
        hotel_id:this.hotel_id,
        sid: this.id
      };
      $http
        .post("plugin.hotel-supply.frontend.home.fang-xing", json)
        .then(res => {
          if (res.result == 1) {
            this.goods_info = res.data;
            if(this.goods_info&&this.goods_info.nextPrice){
              let nextPriceArr=[];
              let nextPrice=this.goods_info.nextPrice;
              for(let k in nextPrice){
                nextPriceArr.push({
                  id:nextPrice[k].id,
                  sid:nextPrice[k].sid,
                  cid:nextPrice[k].cid,
                  is_manfang:nextPrice[k].is_manfang,
                  vprice:nextPrice[k].vprice,
                  date:this.dateInit(nextPrice[k].date)
                });
              }
              this.goods_info.nextPriceArr = nextPriceArr.reverse();
              if(this.goods_info.nextPriceArr&&this.goods_info.nextPriceArr.length>0){
                let minPrice = this.goods_info.nextPriceArr[0].vprice;
                // let minTiem = this.goods_info.nextPriceArr[this.goods_info.nextPriceArr.length-1].date;
                // let maxTiem = this.goods_info.nextPriceArr[0].date;
                for (let i=1;i<this.goods_info.nextPriceArr.length;i++){
                  let vprice=this.goods_info.nextPriceArr[i].vprice;
                  if(vprice<minPrice){
                    minPrice = vprice;
                  }
                }
                this.goods_info.nextPriceArr.sort(function(a,b){
                  return new Date(a.date) -new Date(b.date);
                });
                console.log( this.goods_info.nextPriceArr);
                this.start = this.goods_info.nextPriceArr[0].date;
                this.end = this.getTomorrow(this.goods_info.nextPriceArr[0].date);
                console.log( this.start);
                console.log(this.end);
                this.getDays(this.start, this.end);
                this.goods_info.minPrice = minPrice;
                // this.goods_info.minTiem = minTiem;
                // this.goods_info.maxTiem = maxTiem;
                // this.end = minTiem;
                // this.start = maxTiem;
              }
            }
          }else{
            this.$dialog.alert({message:res.msg});
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getTomorrow(date){
      if(date){
        let curDate = new Date(date);
        var nextDate = new Date(curDate.getTime() + 24*60*60*1000); //后一天
        let year = nextDate.getFullYear();
        let month = nextDate.getMonth().toString().length==1?"0"+(nextDate.getMonth()+1):(nextDate.getMonth()+1);
        let day = nextDate.getDate().toString().length==1?"0"+nextDate.getDate():nextDate.getDate();
        return year+"-"+month+"-"+day;
      }
    },
    ordertBtn() {
      let Bol =true;
      let nextPriceArr = this.goods_info.nextPriceArr;
      let start = this.start;
      let end =  this.end;
      if(!end){
        this.$dialog.alert({message:'请填写离店日期'});
        return;
      }
      nextPriceArr.forEach((item)=>{
        if(start == item.date){
          Bol= false;
        }
      });
      if(Bol){
        this.$dialog.alert({message:'入住日期没有住房，请重新选择入住日期'});
        return;
      }
      let arr=[start];
      let startTime = this.getDate(start);
      let endTime = this.getDate(end);
      while((endTime.getTime()-startTime.getTime())>=0){
        let year = startTime.getFullYear();
        let month = startTime.getMonth().toString().length==1?"0"+startTime.getMonth().toString():startTime.getMonth();
        let day = startTime.getDate().toString().length==1?"0"+startTime.getDate():startTime.getDate();
        if((year+"-"+month+"-"+day)==start){
          console.log(arr);
        }else{
          arr.push(year+"-"+month+"-"+day);
        }
        startTime.setDate(startTime.getDate()+1);
      }
      arr.pop();
      let picArr = [];
      for(let j = 0;j<arr.length;j++){
        let item = arr[j];
        let bol=false;
        let index='';
        for(let i=0;i<nextPriceArr.length;i++){
          if(item == nextPriceArr[i].date){
            bol = true;
            index = i;
          }
        }
        if(bol){
          if(nextPriceArr[index].is_manfang ==1){
            this.$dialog.alert({message:'日期'+nextPriceArr[index].date+'已经满房，请重新选择日期'});
            return;
          }else{
            picArr.push({
              date:nextPriceArr[index].date,
              price:nextPriceArr[index].vprice
            });
          }
        }else{
          this.$dialog.alert({message:'入店至离店期间包含没有住房的日期，请重新选择日期'});
          return;
        }
      }
      if(picArr.length>0){
        let minprice = picArr[0].price;
        for(let i=0;i<picArr.length;i++){
          if(picArr[i].price<minprice){
            minprice = picArr[i].price;
          }
        }
        this.goods_info.minPrice = minprice;
      }
      if(picArr.length==0){
        this.$dialog.alert({message:'请重新选择日期'});
        return;
      }
      this.$router.push(this.fun.getUrl('HotelSupplyGoodsOrder',{hotel_id:this.hotel_id,sid:this.id,date_price:JSON.stringify(picArr),start:this.start,end:this.end}));
    },
    itemClick(index) {

    },
    acceptTime(type, date) {
      if (type == "离店") {
        this.end = date;
      } else if (type == "入住") {
        this.start = date;
      }
      this.checkDate(type);
    },
    checkDate(type) {
      //入住日期不能为空
      //离店日期不能小于住店日期
      //离店日期不能和住店日期同一天
      let start = new Date(this.start).getTime();
      let end = new Date(this.end).getTime();
      if (this.fun.isTextEmpty(this.start)) {
        this.$notify({
          message: "请先选择入住日期",
          duration: 1000,
          background: "#1989fa"
        });
        this.end = "";
        return;
      } else {
        if (start == end) {
          this.$notify({
            message: "入住和离店日期不能为同一天",
            duration: 1000,
            background: "#1989fa"
          });
          this.end = "";
          return;
        }
        if (start > end) {
          this.$notify({
            message: "离店日期需要大于入店日期",
            duration: 1000,
            background: "#1989fa"
          });
          this.end = "";
          return;
        }
        //关闭弹窗
        if (type == "离店") {
          //计算多少晚
          this.getDays(this.start, this.end);
          this.show2 = false;
        } else if (type == "入住") {
          this.getDays(this.start, this.end);
          this.show1 = false;
        }
      }
    },
    getDate(datestr){
      var temp = datestr.split("-");
      var date = new Date(temp[0],temp[1],temp[2]);
      return date;
    },
    //时间日期
    getDays(strDateStart, strDateEnd) {
      let strSeparator = "-"; //日期分隔符
      let oDate1, oDate2, iDays;
      oDate1 = strDateStart.split(strSeparator);
      oDate2 = strDateEnd.split(strSeparator);
      let strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
      let strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
      iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数
      console.log(iDays);
      this.night_day = iDays;
    },
    close(type) {
      if (type == "离店") {
        this.show2 = false;
      } else if (type == "入住") {
        this.show1 = false;
      }
    }
  },
  components: { cTitle,datePicker}
};
