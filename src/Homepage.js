import Dropdown from "./Dropdown"
import  Certificate from "./Certificate"
import Loading from "./loading"
import  Centervac from "./Centervac"

import {useState,useEffect} from "react"
function Homepage(){
  const [datas,setData] = useState([])
  const [citys,setCity] = useState([])
  const [centers,setCenters] = useState([])
  const [centerid,setCentersid] = useState(0)
  const [selectedDate, setDate] = useState('');
  const [loading,setLoading] = useState(false)
  const [centersByPin,setPin] = useState([])
  const [centerPin,setCenterPin] = useState("")
  const [pdf,setPdf] = useState("")
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
  const getCenters =(id,date,pin) =>{
    if(date===""){
      alert("please select date")
    }else if(id !== 0 && pin===""){

      fetch("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id="+id+"&date="+date)
      .then(res => res.json())
      .then(_centers => {
        if(_centers.sessions.length){
          setCenters(_centers.sessions)
          setLoading(false)
        }else{
          alert("No centers available here")
          setLoading(false)
  
        }
      })
      .catch((e)=> {
        console.log(e)
        
      })
    }
    else{
      
      fetch("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode="+pin+"&date="+date)
      .then(res=>res.json())
      .then(byPin => {
        console.log(byPin.centers)
        if(byPin.centers.length){
          setPin(byPin.centers)
          setLoading(false)
        }else{
          alert("No centers available here")
          setLoading(false)
  
        }
        
      })
    }
  
  }
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiI1N2I2NjA2Ni1mNzg1LTQ0MDItOWE5ZS1kNjdmN2U0MTdhZmUiLCJ1c2VyX3R5cGUiOiJCRU5FRklDSUFSWSIsInVzZXJfaWQiOiI1N2I2NjA2Ni1mNzg1LTQ0MDItOWE5ZS1kNjdmN2U0MTdhZmUiLCJtb2JpbGVfbnVtYmVyIjo5OTE2Nzg5ODczLCJiZW5lZmljaWFyeV9yZWZlcmVuY2VfaWQiOjI3NDM1NTAyMDI3NjgwLCJ0eG5JZCI6Ijc3NmNkN2JjLTIyZjAtNDIzYS1iMmY3LTg3YzJlYTBlNGVlNCIsImlhdCI6MTYyMTQyODc5MCwiZXhwIjoxNjIxNDI5NjkwfQ.VQX5dYVumWsV9N37Lnx1F-jGoChIywyCRs1dtI3XEYo"
    const loadingfun = (bool)=>{
  
    setLoading(bool)
  }
  const dowloadPdf = (id)=>{
      fetch("https://cdn-api.co-vin.in/api/v2/registration/certificate/public/download?beneficiary_reference_id="+id,
      {
        method:"GET",
        headers:{
          "Accept": "application/pdf",
          'Authorization': `Bearer ${token}` ,
        }
      })
      .then(res =>res.text())
      .then(data=>{
          if(data===null) alert("not")
          else setPdf(data)
      })
      
  }
  console.log(pdf)
  const renderCenters =()=>{
    if(loading){
      return <Loading/>
    }else if(centerPin === "" && !loading ){
      return <Centervac centerArray ={centers}/>
    }else {
      return  <Centervac centerArray ={centersByPin}/>
    }
  }
    
   
  return<>
  <div style  ={{paddingTop:"15px", position:"relative", width:"100% "}}>
    <Dropdown stateArray = {datas} 
              onChange = {getDistrict}
              placeholder = "States"/>
    <Dropdown stateArray = {citys} 
          onChange = {(id) => setCentersid(id)}
          placeholder = "District"/>
           
    <div style = {{padding:"10px"}}>OR</div>
  <input 
    type = "number" 
    className = "pinInput" 
    placeholder = "Postal Code"
    onChange = {(e)=>{
        setCenterPin(e.target.value)
    }}/>
    <div style = {{marginLeft:"15px"}}>
      <input  className="menu" type="date" onChange={(e)=> {
        const date = new Date(e.target.value);
        const dateFormat = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
        setDate(dateFormat);
      }}/>
    { 
    
    citys.length || centerPin ? <button className ="menu"onClick={() => {
    getCenters(centerid, selectedDate,centerPin)
    
    selectedDate!=="" ? loadingfun(true):loadingfun(false)
    }
  } >Go</button>  : <button className ="menu" 
  
  >Go</button>  
  
      }
    </div>
  <div style = {{display:"flex",justifyContent:"center"}}>
    
    {renderCenters()}
    
  </div>
  <div style={{display:"flex",justifyContent:"center"}}>

  <Certificate Download = {dowloadPdf}/>   
  </div>
  </div>
  </>
}
export default Homepage