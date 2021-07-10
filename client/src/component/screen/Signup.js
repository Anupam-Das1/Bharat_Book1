import React,{useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
const Signup=()=>{
    const history=useHistory()
    const [name,setName]=useState("")
    const [password,setPassword]=useState("")
    const [image,setImage]=useState("")
    const [email,setEmail]=useState("")
    const [url,setUrl] = useState(undefined)
    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[url])
    const uploadPic=()=>{
        const data=new FormData()
        data.append("file",image)
        data.append("upload_preset","social-media")
        data.append("cloud_name","dzwl9sobf")
        fetch("	https://api.cloudinary.com/v1_1/dzwl9sobf/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url) 
        })
        .catch(err=>{
            console.log(err) 
        })
    }
    const uploadFields=()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email",classes:"#ff7043 deep-orange lighten-1" })
            return
        }
        fetch("/signup",{
            method:"post", 
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:name,
                password:password,
                email:email,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
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
    const PostData=()=>{
        if(image){
            uploadPic()
        }
        else{
            uploadFields()
        }
    
    }
    return(
        <div className="mycard">
            <div className="card auth-card">
                <h2>BharatBook</h2>
                <input 
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />
                <input 
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <input 
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <div className="file-field input-field">
                <div className="btn">
                    <span>Upload Image</span>
                    <input 
                    type="file" 
                    onChange={(e)=>setImage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder="Upload one or more files"/>
                </div>
                </div>
                <button className="btn waves-effect waves-light " 
                    onClick={()=>PostData()}
                >
                    Signup 
                </button>
                <h5>
                    <Link to="/Signin">Already have an account ?</Link>
                </h5>
            </div>
        </div>
    )
}

export default Signup