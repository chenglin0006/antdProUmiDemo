import { EllipsisOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import { Button, Col, Dropdown, Menu, Row } from 'antd';
import { Suspense, useState } from 'react';
import { useModel, useRequest } from 'umi';
import IntroduceRow from './components/IntroduceRow';
import OfflineData from './components/OfflineData';
import PageLoading from './components/PageLoading';
import ProportionSales from './components/ProportionSales';
import SalesCard from './components/SalesCard';
import TopSearch from './components/TopSearch';
import { fakeChartData } from './service';
import styles from './style.less';
import { getTimeDistance } from './utils/utils';

const Analysis = () => {
  const [salesType, setSalesType] = useState('all');
  const [currentTabKey, setCurrentTabKey] = useState('');
  const [rangePickerValue, setRangePickerValue] = useState(getTimeDistance('year'));
  const { loading, data } = useRequest(fakeChartData);
  const { count, addCount, substractCount } = useModel('product', (model) => ({
    count: model.count,
    addCount: model.addCount,
    substractCount: model.substractCount,
  }));

  const {
    data: data2,
    run,
    loading: loading2,
  } = useRequest(fakeChartData, {
    manual: true,
    onSuccess: (result, param) => {
      //请求之后的回调，获取结果
      //第一个参数用来获取异步结果，第二个参数以数组的形式获取传入的p0和p1
      console.log(result, param);
    },
  });

  const selectDate = (type) => {
    setRangePickerValue(getTimeDistance(type));
  };

  const handleRangePickerChange = (value) => {
    setRangePickerValue(value);
  };

  const isActive = (type) => {
    if (!rangePickerValue) {
      return '';
    }

    const value = getTimeDistance(type);

    if (!value) {
      return '';
    }

    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }

    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }

    return '';
  };

  let salesPieData;

  if (salesType === 'all') {
    salesPieData = data?.salesTypeData;
  } else {
    salesPieData = salesType === 'online' ? data?.salesTypeDataOnline : data?.salesTypeDataOffline;
  }

  const menu = (
    <Menu>
      <Menu.Item>操作一</Menu.Item>
      <Menu.Item>操作二</Menu.Item>
    </Menu>
  );
  const dropdownGroup = (
    <span className={styles.iconGroup}>
      <Dropdown overlay={menu} placement="bottomRight">
        <EllipsisOutlined />
      </Dropdown>
    </span>
  );

  const handleChangeSalesType = (e) => {
    setSalesType(e.target.value);
  };

  const handleTabChange = (key) => {
    setCurrentTabKey(key);
  };

  console.log('data2', data2);
  const activeKey = currentTabKey || (data2?.offlineData[0] && data2?.offlineData[0].name) || '';

  return (
    <GridContent>
      <>
        <div>123123-{count}</div>
        <div>
          <Button type="primary" onClick={() => addCount(1)} style={{ marginRight: '10px' }}>
            数量+1
          </Button>
          <Button type="primary" onClick={() => substractCount(1)}>
            数量-1
          </Button>
          <Button loading={loading2} onClick={run}>
            test-{data2?.offlineChartData?.length}
          </Button>
          <div>{REACT_APP_ENV}</div>
        </div>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow loading={loading} visitData={data?.visitData || []} />
        </Suspense>

        <Suspense fallback={null}>
          <SalesCard
            rangePickerValue={rangePickerValue}
            salesData={data?.salesData || []}
            isActive={isActive}
            handleRangePickerChange={handleRangePickerChange}
            loading={loading}
            selectDate={selectDate}
          />
        </Suspense>

        <Row
          gutter={24}
          style={{
            marginTop: 24,
          }}
        >
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <TopSearch
                loading={loading}
                visitData2={data?.visitData2 || []}
                searchData={data?.searchData || []}
                dropdownGroup={dropdownGroup}
              />
            </Suspense>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <ProportionSales
                dropdownGroup={dropdownGroup}
                salesType={salesType}
                loading={loading}
                salesPieData={salesPieData || []}
                handleChangeSalesType={handleChangeSalesType}
              />
            </Suspense>
          </Col>
        </Row>

        <Suspense fallback={null}>
          <OfflineData
            activeKey={activeKey}
            loading={loading}
            offlineData={data?.offlineData || []}
            offlineChartData={data?.offlineChartData || []}
            handleTabChange={handleTabChange}
          />
        </Suspense>
      </>
    </GridContent>
  );
};

export default Analysis;
