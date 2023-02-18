import "./App.css";
import dataApi from "./api/dataApi";
import { useEffect, useState, useRef } from "react";
import LineChart from "./components/LineChart";
import Box from "@mui/material/Box";

function App() {
  const [data, setData] = useState([]);
  const accData = useRef([]).current; // 後端資料
  const accFetchTime = useRef([]).current; // 進來的時間
  accData.push(data);
  accFetchTime.push(new Date());
  // 超過10分鐘，移出前面資料
  if (accData.length >= 61) {
    accData.shift();
    accFetchTime.shift();
  }

  const toKyoData = accData.map((data) => data.tokyo);
  const londonData = accData.map((data) => data.london);
  const maxNumber = accData.length > 1 ? Math.max(...toKyoData.slice(1)) : 100;
  // 圖表y軸最大值
  const options = {
    responsive: true,
    scales: {
      y: {
        max: maxNumber + 20,
        min: 0,
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  //useEffect
  useEffect(() => {
    async function fetchData() {
      const result = await dataApi();
      // 將新資料加入
      setData(result);
    }
    fetchData();
    const timer = setInterval(() => {
      fetchData();
    }, 10000);
    return () => {
      clearInterval(timer);
    };
  }, [setData]);

  const chartData = {
    labels: accFetchTime.map((item) => String(item).slice(16, 25)),
    datasets: [
      {
        label: "Tokyo 溫度",
        data: toKyoData,
      },
      {
        label: "London 溫度",
        data: londonData,
      },
    ],
  };

  let tokyoAverage = 0;
  let lonDonAverage = 0;
  if (accData.length >= 4) {
    tokyoAverage = (toKyoData.slice(-3).reduce((a, b) => a + b) / 3).toFixed(2);
    lonDonAverage = (londonData.slice(-3).reduce((a, b) => a + b) / 3).toFixed(
      2
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="progress">
          <Box sx={{ width: 500 }}>
            <h2>Tokyo最近3筆平均溫度: {tokyoAverage} &#176;C</h2>
          </Box>
          <Box sx={{ width: 500 }}>
            <h2>London最近3筆平均溫度: {lonDonAverage} &#176;C</h2>
          </Box>
        </div>
        <div style={{ width: 800 }} className="chart">
          <LineChart chartData={chartData} options={options} />
        </div>
      </header>
    </div>
  );
}

export default App;
