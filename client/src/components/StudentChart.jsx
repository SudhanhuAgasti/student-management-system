import { Bar } from "react-chartjs-2";
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 BarElement,
 Title,
 Tooltip,
 Legend
} from "chart.js";

ChartJS.register(
 CategoryScale,
 LinearScale,
 BarElement,
 Title,
 Tooltip,
 Legend
);

function StudentChart({students,attendance,fees}){

 const data = {
  labels:["Students","Attendance","Fees Records"],
  datasets:[
   {
    label:"System Statistics",
    data:[students,attendance,fees],
   }
  ]
 };

 const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
   legend: { position: 'bottom' }
  }
 };

 return(
  <div className="w-full h-full min-h-[300px]">
   <Bar data={data} options={options}/>
  </div>
 )
}

export default StudentChart;