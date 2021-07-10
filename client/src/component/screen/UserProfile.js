import React,{useEffect,useState,useContext} from 'react'
import {userContext} from '../../App'
import {useParams} from'react-router-dom'
const Profile=()=>{
    const [userProfile,setProfile] = useState(null)
    const {state,dispatch} = useContext(userContext)
    const {userid} = useParams()
    const [showFollow,setShowFollow]=useState(state?!state.following.includes(userid):true)

    console.log(userid)
     useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            } 
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result)  
            setProfile(result)
        })
    },[]) 

    const followUser=()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data) 
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data]
                    }
                    //user:data
                }
            })
            setShowFollow(false)
        })
    }

    const unfollowUser=()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data) 
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollower=prevState.user.followers.filter(item=>item != data._id)
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                    //user:data
                }
            })
            setShowFollow(true)
            
        })
    }

    return(
        <> 
        {userProfile? 
        
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom: "1px solid grey"
            }}>
                <div>
                    <img style={{width: "160px",height:"160px",borderRadius:"80px"}} 
                        src={userProfile.user.pic}
                        //src="https://images.unsplash.com/photo-1623672655540-03b814e0b50f?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"

                    />
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <h5>{userProfile.user.email}</h5>
                    <div style={{
                            display:"flex",
                            justifyContent:"space-between",
                            width:"108%",
                            
                        }}>
                        <h6>
                            {userProfile.posts.length} Posts
                        </h6>
                        <h6>
                            {userProfile.user.followers.length} Followers
                        </h6>
                        <h6>
                            {userProfile.user.following.length} Followings
                        </h6>
                        {showFollow?
                        <button 
                        style={{margin:"10px"}}
                        className="btn waves-effect waves-light " 
                        onClick={()=>followUser()}
                        >
                                follow  
                        </button>
                        :
                        <button style={{margin:"10px"}} className="btn waves-effect waves-light " 
                        onClick={()=>unfollowUser()}
                        >
                                unfollow  
                        </button>
                        }
                    </div>
                    
                </div>
            </div>

            <div className="gallery">

                    { 
                        userProfile.posts.map(
                            item=>{
                            return(
                                <img  
                                    className="item"
                                    src={item.photo}
                                    alt={item.title}
                                    key={item._id}
                                />
                            )
                        }
                        )
                    } 

                    

            </div>
        </div>
        
        :<h2>loading..........</h2>}
        
        </>
    )
}

export default Profile 