import { doc, getDocs, setDoc, collection } from 'firebase/firestore'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {db} from './firebase'


type props = {
    changeUser(id : number) : any,
    setRegister(register : boolean) : any,
    userInformation : {name : string, category: string, username : string, password : string, id : number},
    // setUserInformation(userInfo: userInformation): any
    //users : {name : string, category: string, username : string, password : string, id : number}[],
}

type userdataType = {
    name : string,
    username : string,
    password : string,
    category : string,
    id : number,
}

export default function Register(props: props) {
    const userscollectionRef = collection(db, "users");
    const [errorMessage, setErrorMessage] = React.useState("")
    const [userData, setUserData] : [userData: userdataType, setUserData: any] = React.useState(props.userInformation)
    const nav = useNavigate();
    var newId = 0;

    async function verify(testName: string, testUsername : string, testPassword : string) {
        var valid = true;
        const data = await getDocs(userscollectionRef);
        newId = data.size + 1;
        userData.name = testName;
        userData.username = testUsername;
        userData.password = testPassword;
        // Checks the database for preexisting account
        data.forEach(doc => {
            if (testUsername == doc.data().username && testPassword == doc.data().password) {
                valid = false;
                setErrorMessage("Account under this username already exists");
            }
        });

        // Checks for null/empty
        if (userData.name === "" || userData.username === "" || userData.password === "") {
            valid = false;
            setErrorMessage("Credentials cannot be empty, null or just whitespace");
        }

        if (valid) {
            setErrorMessage("");
            submit();
        }
    };

    async function createUser(newUserRef: any, newName : string, newUsername : string, newPassword: string, newCategory : string ) {
        await setDoc(newUserRef, { name: newName, username: newUsername, password: newPassword, category: newCategory });
    };

    function submit() {
        var newUserRef = doc(db, "users", newId.toString());
        createUser(newUserRef, userData.name, userData.username, userData.password, userData.category);
        props.changeUser(newId);
        // props.setUserInformation(newId);
        nav("/dashboard");
    }

    return(
    <form name="login" onSubmit={e => {
        e.preventDefault();
        verify(userData.name, userData.username, userData.password);
        console.log(userData.name)
    }}>
    <div style={{backgroundImage: "linear-gradient(.25turn, #191970, white, #daa520)", display: 'flex',  justifyContent:'center', alignItems:'center', height: '70vh'}}>
        <fieldset style= {{backgroundColor: 'white', width: 300, textAlign: 'center', borderRadius: 8}} >
        {/* <legend style={{color: "black", fontWeight: 'bold', fontSize: 30}}>Member LogIn</legend> */}
        <h1 style={{color: "#191970", textAlign: "center", fontWeight: 'bold'}}> Register </h1>
        <h1 style={{fontSize: 20, textAlign: 'center', color: 'red'}}>{errorMessage}</h1>

        <h1 className = {'txtFill'}>
            <select className = {'txtInput'} id="category" onChange={e=>setUserData({...userData, category : e.target.value})}>Category:
                <option value="Student" defaultValue={"Student"}>Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Organizer">Organizer</option>
            </select>
        </h1>

        <h1 className = {'txtFill'}>
            <input className = {'txtInput'} type="text" placeholder="Name" id = "name" onChange={e=>setUserData({...userData, name : e.target.value})}/>
        </h1>

        <h1 className = {'txtFill'}>
            <input className = {'txtInput'} type="text" placeholder="Username" id = "username" onChange={e=>setUserData({...userData, username : e.target.value})}/>
        </h1>


        <h1 className = {'txtFill'}>
            <input className = {'txtInput'} type="password" placeholder="Password" id="password" onChange={e=>setUserData({...userData, password : e.target.value})}/>
        </h1>
        
        <button className = {"btn"} style = {{float: 'left'}} type="submit">Submit</button>

        <Link to="/login">
            <button className = {"btn"} style = {{float: 'right'}} type="submit" onClick={()=>props.setRegister(false)}>Return to Login</button>
        </Link>
        </fieldset>
    </div>
</form>)
}