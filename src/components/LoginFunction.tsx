import { doc, getDocs, setDoc, collection } from 'firebase/firestore'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {db} from './firebase'


type props = {
    changeUser(id : number) : any,
    setRegister(register : boolean) : any,
    userInformation : {name : string, category: string, username : string, password : string, id : number},
}

type userdataType = {
    name : string,
    username : string,
    password : string,
    category : string,
    id : number,
}

export default function Login(props: props) {
    const userscollectionRef = collection(db, "users");
    const [errorMessage, setErrorMessage] = React.useState("")
    const [userData, setUserData] : [userData: userdataType, setUserData: any] = React.useState(props.userInformation)
    const nav = useNavigate();

    async function verify() {
        var valid = false;
        const data = await getDocs(userscollectionRef);
        console.log(userData.username);
        // Checks the database for existing account
        data.forEach(doc => {
            if (userData.username == doc.data().username && userData.password == doc.data().password) {
                userData.id = parseInt(doc.id);
                valid = true;
                setErrorMessage("")
                submit();
                // console.log(valid, dbName, dbId, dbCategory, dbUsername, dbPassword)
            }
        });
        if (valid == false) {
            setErrorMessage("Please enter a valid username and password");
        }
    };

    function submit() {
        props.changeUser(userData.id);
        nav("/dashboard");
    }

    return(<div>
        <form name="login" onSubmit={e => {
            e.preventDefault();
            verify();
        }}>
        <div style={{backgroundImage: "linear-gradient(.25turn, #daa520, white, #191970)", display: 'flex',  justifyContent:'center', alignItems:'center', height: '70vh'}}>
            <fieldset style= {{backgroundColor: 'white', width: 300, textAlign: 'center', borderRadius: 8}} >
            <h1 style={{color: "#191970", textAlign: "center", fontWeight: 'bold'}}> Login </h1>
            <h1 style={{fontSize: 20, textAlign: 'center', color: 'red'}}>{errorMessage}</h1>

            

            <h1 className = {'txtFill'}>
                <input className = {'txtInput'} type="text" placeholder="Username" id = "username" onChange={e=>setUserData({...userData, username : e.target.value})}/>
            </h1>
            <h1 className = {'txtFill'}>
                <input className = {'txtInput'} type="password" placeholder="Password" id="password" onChange={e=>setUserData({...userData, password : e.target.value})}/>
            </h1>
            <button className = {"btn"} style = {{float: 'left'}}>Login</button>
            <Link to="/register">
                <button className = {"btn"} style = {{float: 'right'}} onClick={()=>props.setRegister(true)}>Register</button>
            </Link>
            
            </fieldset>
        </div>
    </form>
    
    </div>)
}