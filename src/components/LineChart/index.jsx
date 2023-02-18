import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function LineChart(props) {
  const { chartData } = props;
  return <Line data={chartData} options={props.options} />;
}

export default LineChart;
