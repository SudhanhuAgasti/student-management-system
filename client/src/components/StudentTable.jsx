import { useEffect, useState } from "react";
import API from "../services/api";

function StudentTable(){

 const [students,setStudents] = useState([]);

 useEffect(()=>{
  API.get("/students")
  .then(res => setStudents(res.data))
 },[])

 return(

 <div className="bg-white p-6 rounded-lg shadow">

 <h2 className="text-xl font-bold mb-4">
  Students List
 </h2>

 <table className="w-full border">

 <thead className="bg-gray-200">
  <tr>
   <th className="p-2">Name</th>
   <th className="p-2">Phone</th>
   <th className="p-2">Course</th>
  </tr>
 </thead>

 <tbody>

 {students.map((s)=>(
  <tr key={s._id} className="text-center border-t">

   <td className="p-2">{s.name}</td>
   <td className="p-2">{s.phone}</td>
   <td className="p-2">{s.course}</td>

  </tr>
 ))}

 </tbody>

 </table>

 </div>

 )

}

export default StudentTable;