import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const GenderPieChart = ({ maleCount, femaleCount }) => {
  const data = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [maleCount, femaleCount],
        backgroundColor: ["#42A5F5", "#FF6384"],
        hoverBackgroundColor: ["#64B5F6", "#FF9FBB"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '70%', // Makes the center of the pie chart empty
    plugins: {
      legend: {
        position: 'top',
      },
    },
    maintainAspectRatio: false, // Allows for manual width and height
  };

  return (
    <div style={{ width: '350px', height: '200px' }}> {/* Set specific width and height */}
      <Pie data={data} options={options} />
    </div>
  );
};

export default GenderPieChart;
