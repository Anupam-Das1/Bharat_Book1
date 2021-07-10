import React,{useState,useContext,useReducer} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
const Reset=()=>{ 
    const history=useHistory() 
    const [email,setEmail]=useState("") 
    const PostData=()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email",classes:"#ff7043 deep-orange lighten-1" })
            return
        }
        fetch("/reset-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                email:email,
            })
        }).then(res=>res.json())
        .then(data=>{ 
            console.log(data)
            if(data.error){
                M.toast({html: data.error,classes:"#ff7043 deep-orange lighten-1"})
            }
            else{
                M.toast({html:data.message,classes:"#009688 teal"})
                history.push('/signin')
            }
        }).catch(err=>{
            console.log(err)
        }) 
    }
    return(
        <div className="mycard">
            <div className="card auth-card input-field">
            <h2>BharatBook</h2>
                <input 
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
             
                />
                
                <button className="btn waves-effect waves-light " 
                   onClick={()=>PostData()}
                >
                    Reser Passward  
                </button>
            </div>
        </div>
    )
}

export default Reset