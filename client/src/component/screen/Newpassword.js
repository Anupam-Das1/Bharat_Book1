import React,{useState,useContext,useReducer} from 'react'
import {Link,useHistory,useParams} from 'react-router-dom'
import M from 'materialize-css'
const Signin=()=>{ 
    const history=useHistory() 
    const [password,setPassword]=useState("")
    const {token} = useParams()
    console.log(token)
    const PostData=()=>{
        
        fetch("/new-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                password:password,
                token
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
                    type="password"
                    placeholder="enter new password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light " 
                   onClick={()=>PostData()}
                >
                    Update Password 
                </button>
            
            </div>
        </div>
    )
}

export default Signin