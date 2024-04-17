import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);

const RiskChart = ({ data, options }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && data) {
      const newChart = new Chart(ref.current, {
        type: "bar",
        data: data,
        options: options,
      });

      return () => {
        newChart.destroy();
      };
    }
  }, [data, options]);

  return <canvas className={`riskchart`} ref={ref}></canvas>;
};

export default RiskChart;
