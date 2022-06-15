import { request } from 'umi';
export async function fakeChartData() {
  return request('/apis/fake_analysis_chart_data');
}
