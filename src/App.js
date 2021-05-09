import {useState,useEffect} from "react"
import './App.css';
import Dropdown from "./Dropdown"
import  Centervac from "./Centervac"
import { distance, getLocation } from "./latRequest";


function App() {

  const [datas,setData] = useState([])
  const [citys,setCity] = useState([])
  const [centers,setCenters] = useState([])
  const [centerid,setCentersid] = useState(0)
  const [selectedDate, setDate] = useState('');
  useEffect(()=>{
    fetch("https://cdn-api.co-vin.in/api/v2/admin/location/states")
      .then(res => res.json())
      .then(data => setData(data.states.map(x =>({name: x.state_name, id: x.state_id}))))
  }, [])
  
  

  const getDistrict =(id)=>{
   return fetch("https://cdn-api.co-vin.in/api/v2/admin/location/districts/"+id)
    .then(res => res.json())
    .then(citys => {
      return(
        setCity(citys.districts.map(x =>({name: x.district_name, id: x.district_id})))
      )
      
    })
  }
  const getCenters =(id,date) =>{
    // console.log(id + " asdfgh "+date)
    // fetch("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=523&date=05-05-2021")
    fetch("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id="+id+"&date="+date)
    .then(res => res.json())
    .then(_centers => {
      setCenters(_centers.sessions)
      // return getLocation()
      // .then(loc => {
      //   if (loc) {
      //     _centers.sessions.forEach(x => {
      //       x.distance = distance(loc.coords.latitude, loc.coords.longitude, x.lat, x.long);
      //     })
      //     _centers.sessions.sort((a,b) => a.distance - b.distance);
  
      //     setCenters(_centers.sessions);
      //   }
      // })
    })
    .catch((e)=> {
      console.log(e)
      
    })
  }
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Co-win Resources
        </h1>
      </header>
      {/* <input  placeholder = "DD-MM-YYYY" type="date" onChange={(e)=> {
            console.log(e.target.value);
            // setValue(e.target.value)
            }}/> */}
      <div>
        <Dropdown stateArray = {datas} 
                  onChange = {getDistrict}
                  placeholder = "State"/>
        <Dropdown stateArray = {citys} 
              onChange = {(id) => setCentersid(id)}
              placeholder = "District"/> 
        
        <input  className="menu" type="date" onChange={(e)=> {
          const date = new Date(e.target.value);
          const dateFormat = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
          setDate(dateFormat);
        }}/>
        <button className ="menu"onClick={() => getCenters(centerid, selectedDate)} >Go</button>    
      </div>
      <div>
        <Centervac onclick ={getCenters} id = {centerid} centerArray ={centers}/>
      </div>
    </div>
  );
}

export default App;
