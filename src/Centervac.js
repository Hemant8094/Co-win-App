function Centervac(props){
   const centers = ()=>{
     return   props.centerArray.map((center)=>{
            return <div className="card" key = {Math.random()}>
                <div>
                    <span style={{fontSize: 'x-large'}}>{center.name}</span>
                    <span className="vaccine-name">{center.vaccine}</span>
                </div>
                <div className="section">vaccine available for {center.available_capacity} people above {center.min_age_limit} age</div>
                <div className ="address">In The {center.address}</div>
                <div style={{marginTop:'32px'}}>{center?.slots?.map(x => <span key = {Math.random()} className="slot">{x}</span>)}</div>
            </div>
        })
   }

    return(
        <div>
            {centers()}
        </div>
    )
}

export default Centervac