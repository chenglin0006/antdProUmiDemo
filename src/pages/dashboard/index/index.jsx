import { connect } from 'umi';

const IndexPage = ({ dispatch, name, loading }) => {
  return (
    <div
      onClick={() => {
        dispatch({
          type: 'indexModel/query',
          payload: {
            name: '123123',
          },
        });
      }}
    >
      点击试试 {loading ? 'true' : 'false'} {name}
    </div>
  );
};

function mapStateToProps(state) {
  const { name } = state.indexModel;
  return {
    name,
    loading: state.loading.models.indexModel,
  };
}

export default connect(mapStateToProps)(IndexPage);
