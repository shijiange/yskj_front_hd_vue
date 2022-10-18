//* 聚合圈子所需可复用请求
import HTTP from "../../../../fun/http";
export async function postOperation(postId, circleId, operationType) {
  return await HTTP.post("plugin.circle.frontend.circle-invitation.set-invitation-review", {
    invitation_id: postId,
    circle_id: circleId,
    invitation_type: operationType
  });
}

export function quitCircle(circleId) {
  return $http.post("plugin.circle.frontend.circle.quit-circle", {
    circle_id: circleId
  });
}

export function joinFreeCircle(circleId) {
  return $http.post("plugin.circle.frontend.circle.add-circle", {
    circle_id: circleId
  });
}

export function joinPayCircle(memberId, payMethod, payName) {
  return $http.post("plugin.circle.frontend.circle-pay.index", {
    member_id: memberId,
    pay_method: payMethod,
    pay_name: payName
  });
}

export async function getSet() {
  let result = await $http.get("plugin.circle.frontend.circle.get-set").then(
    function(response) {
      if (response.result == 1) {
        return response.data;
      }
      return response;
    },
    function(response) {
      // error callback
    }
  );
  return result;
}

export async function saveEditMemberInfo(memberInfo) {
  return await $http.post("plugin.circle.frontend.circle-member.edit-member-info", memberInfo);
}

export default {
  postOperation,
  quitCircle,
  joinFreeCircle,
  joinPayCircle,
  getSet,
  saveEditMemberInfo
};
