//* 聚合圈子所需可复用方法
import { Dialog, Toast } from "vant";
import _request from "./_request";

export function quitCircle(circleId) {
  return new Promise((reslove, reject) => {
    Dialog.confirm({
      title: "确定要退出圈子吗？",
      message: "付费圈子退出后再次入圈需缴费",
      beforeClose(action, done) {
        if (action === "cancel") {
          done();
          reject();
          return;
        }
        let quitLoading = Toast.loading();
        _request.quitCircle(circleId).then(({ data: response, result, msg }) => {
          done();
          quitLoading.clear();
          if (result == 0) {
            reject();
            Toast(msg);
            return;
          }
          Toast("退出成功");
          reslove();
        });
      }
    });
  });
}

export function joinFreeCircle(circleId) {
  const joinLoading = Toast.loading();
  return new Promise((resolve, reject) => {
    return _request.joinFreeCircle(circleId).then(res => {
      joinLoading.clear();
      if (res.result == 1) {
        resolve(res);
      } else {
        reject(res);
      }
    });
  });
}

export function joinPayCircle() {
  return new Promise((resolve, reject) => {
    return _request.joinPayCircle().then(res => console.log(res));
  });
}

export default {
  quitCircle,
  joinFreeCircle,
  joinPayCircle
};
