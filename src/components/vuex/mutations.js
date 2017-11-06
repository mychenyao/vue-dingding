export let mutations = {
    increment(state, name) {
        state.name = name
    },
    revisePOSITION(state, value) {
        state.revisePosition = value;
    },
    changeComment(state, name) {
        state.masterInfo = name;
    },
    changeOrder(state, name) {
        state.orderDetails = name;
    },
    yuDatetime(state, date) {
        state.yuDate = date;
    },
    addPosition(state, data) {
        state.previPosition = data;
    },
    changePath(state, data) {
        state.path = data;
    },
    changePaths(state,data){
      state.paths=data;
    }

}
