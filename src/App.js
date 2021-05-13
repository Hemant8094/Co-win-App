import {useState,useEffect} from "react"
import './App.css';
import Dropdown from "./Dropdown"
import Loading from "./loading"
import  Centervac from "./Centervac"
import  Certificate from "./Certificate"
import { distance, getLocation } from "./latRequest";


function App() {

  const [datas,setData] = useState([])
  const [citys,setCity] = useState([])
  const [centers,setCenters] = useState([])
  const [centerid,setCentersid] = useState(0)
  const [selectedDate, setDate] = useState('');
  const [loading,setLoading] = useState(false)
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
      if(_centers.sessions.length){
        setCenters(_centers.sessions)
        setLoading(false)
      }else{
        alert("No centers available here")

      }
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
  const loadingfun = ()=>{
    setLoading(!loading)
  }
  const dowloadPdf = (id)=>{
      fetch("https://cdn-api.co-vin.in/api/v2/registration/certificate/public/download?beneficiary_reference_id="+id)
      .then(res =>res.json())
      .then(data=>console.log(data))
      .catch(()=>alert("Pdf not genreted"))
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
      <div style  ={{paddingTop:"15px"}}>
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
        <button className ="menu"onClick={() => {
          getCenters(centerid, selectedDate)
          loadingfun()
        }
          } >Go</button>    
      </div>
      <div>
        {loading ? <Loading/>:<Centervac onclick ={getCenters} id = {centerid} centerArray ={centers}/>}
        
      </div>
      <Certificate Download = {dowloadPdf}/> 
    </div>
    
      
    
  )
}

export default App;
