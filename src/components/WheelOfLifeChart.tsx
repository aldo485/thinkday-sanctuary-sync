import { useRef } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler);

interface WheelOfLifeChartProps {
  categories: string[];
  scores: number[];
  size?: number;
}

const WheelOfLifeChart = ({ categories, scores, size = 300 }: WheelOfLifeChartProps) => {
  const chartRef = useRef<ChartJS<'radar'>>(null);

  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Current Satisfaction',
        data: scores,
        backgroundColor: 'hsl(var(--sanctuary-gold) / 0.2)',
        borderColor: 'hsl(var(--sanctuary-gold))',
        borderWidth: 3,
        pointBackgroundColor: 'hsl(var(--sanctuary-gold))',
        pointBorderColor: 'hsl(var(--background))',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 10,
        stepSize: 2,
        grid: {
          color: 'hsl(var(--border))',
        },
        angleLines: {
          color: 'hsl(var(--border))',
        },
        pointLabels: {
          color: 'hsl(var(--foreground))',
        },
        ticks: {
          color: 'hsl(var(--muted-foreground))',
          stepSize: 2,
          backdropColor: 'transparent',
        },
      },
    },
  };

  return (
    <div style={{ width: size, height: size }} className="sanctuary-glow">
      <Radar ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default WheelOfLifeChart;