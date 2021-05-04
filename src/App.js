import {useState,useEffect} from "react"
import './App.css';
import Dropdown from "./Dropdown"

function App() {

  const [datas,setData] = useState([])
  const [citys,setCity] = useState([])
  useEffect(()=>{
    fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states")
      .then(res => res.json())
      .then(data => setData(data.states.map(x =>({name: x.state_name, id: x.state_id}))))
  })
  
  

  const getDistrict =(id)=>{
   return fetch("https://cdn-api.co-vin.in/api/v2/admin/location/districts/"+id)
    .then(res => res.json())
    .then(citys => setCity(citys.districts.map(x =>({name: x.district_name, id: x.district_id}))))
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Cowin Resources
        </h1>
      </header>
      <Dropdown stateArray = {datas} 
                onChange = {getDistrict}
                placeholder = "State"/>
      <Dropdown stateArray = {citys} 
            onChange = {(id) => console.log(id)}
            placeholder = "District"/>          
    </div>
  );
}

export default App;
