import * as Services from '../services/index';
const IndexModel = {
  namespace: 'indexModel',

  state: {
    name: '12355',
  },

  effects: {
    *query({ payload }, { call, put }) {
      const { data } = yield call(Services.fakeChartData, payload);
      yield put({
        type: 'save',
        payload: { name: data.offlineChartData.length },
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/dashboard/index') {
          // dispatch({
          //   type: 'query',
          //   payload: {
          //       name: '12'
          //   },
          // });
        }
      });
    },
  },
};

export default IndexModel;
