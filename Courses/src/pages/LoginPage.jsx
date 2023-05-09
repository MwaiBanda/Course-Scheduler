import { useState, useEffect } from "react"
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginPage() {
    const [user, setUser] = useState({});
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessages, setErrorMessages] = useState({});
    const [isSigningIn, setIsSigningIn] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const [users, setUsers] = useState([])
    // Generate JSX code for error message
    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="error">{errorMessages.message}</div>
        );
        async function postUsers(data, onCompletion) {
            try {
                await fetch("https://groupbackend.onrender.com/users",
                    {
                        method: "POST",
                        mode: "cors", // no-cors, *cors, same-origin
                        referrerPolicy: "no-referrer",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    }
                )
                onCompletion()
            } catch (e) {
                console.log(e);
            }
        }
    // Create Form To Accept Input
    const renderForm = () => {
        return <>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Grand Course Scheduler</h5>
                    <form>
                        {!isSigningIn ? <div className="input-container">
                            <label>Name </label>
                            <input
                                className="form-control"
                                type="text"
                                name="name"
                                value={name}
                                onChange={e => {
                                    setName(e.target.value)
                                }}
                                required
                            />
                            {isSubmitted ? renderErrorMessage(username) : <></>}
                        </div> : <></>}
                        <div className="input-container">
                            <label>Username </label>
                            <input
                                className="form-control"
                                type="text"
                                name="username"
                                value={username}
                                onChange={e => {
                                    setUsername(e.target.value)
                                    setCurrentUser(users.find((user) => user.username === e.target.value))
                                }}
                                required
                            />
                            {isSubmitted ? renderErrorMessage(username) : <></>}
                        </div>
                        <div className="input-container">
                            <label>Password </label>
                            <input
                                className="form-control "
                                type="password"
                                name="password"
                                required
                                value={password}
                                onChange={e => { setPassword(e.target.value) }}
                            />
                            {isSubmitted ? renderErrorMessage(password) : <></>}
                        </div>
                        {!isSigningIn ? <div className="input-container">
                        <label>Role </label>
                        <select className="form-select form-select-sm" aria-label=".form-select-sm example" onChange={e => setRole(e.target.value)}>
                            <option selected>Select account type</option>
                            <option value="1">Student</option>
                            <option value="2">Teacher</option>
                        </select>
                        </div> : <></>}

                    </form>
                    <button type="" className="btn btn-dark pad-top" onClick={(e) => handleLogin(e)}>
                        Login
                    </button>
                    <button type="" className="btn btn-dark pad-top mar-start" onClick={(e) => handleSignIn(e)}>
                        Register
                    </button>
                </div>

            </div>
        </>
    };

    // function to fetch users
    async function fetchUsers() {
        try {
            const res = await fetch("https://groupbackend.onrender.com/users", {
                method: "GET",
                mode: "cors",
                referrerPolicy: "no-referrer",
            })

            const remoteUsers = await res.json();
            console.log(remoteUsers)
            if (remoteUsers.length > 0) {
                setUsers(JSON.parse(JSON.stringify(remoteUsers)))
            }
        } catch (e) {
            console.log(e);
        }
    }
    //Once Login Is Confirmed Send User To Courses Pages
    useEffect(() => {
        if (isSubmitted === true) {
            console.log("Redirecting...")
            window.location.replace("/courses")
        }
    }, [isSubmitted])

    useEffect(() => {
        fetchUsers()
        window.sessionStorage.setItem("currentUser", null);
    }, [])

    //Test User Login Info (Will Be Moved To External Source Later)
    //account type determines user level of authority
    // const userList = [
    //     {
    //         username: "jsmith69",
    //         password: "12345",
    //         account: "student"
    //     },
    //     {
    //         username: "bdole88",
    //         password: "f4nny",
    //         account: "teacher"
    //     },
    //     {
    //         username: "hli16",
    //         password: "lewisM@S",
    //         account: "teacher"
    //     }
    // ];

    const errorList = {
        username: "Error, invalid username",
        password: "Error, invalid password"
    }
    const handleSignIn = (event) => {
        event.preventDefault()
        if (isSigningIn) {
            setIsSigningIn(false)
        } else if (name.length > 0 && username.length > 0  && password.length > 0){
            const newUser = {
                name: name,
                password: password,
                username: username,
                account: (parseInt(role) === 1 ? "student" : "teacher"),
            }
            window.sessionStorage.setItem('currentUser', JSON.stringify(newUser))
            const updated = [...users, newUser]
            postUsers(updated, () => {
                setIsSubmitted(true);
            })
        } else if (name.length < 1 || username.length < 1  || password.length < 1) {
            alert('All inputs are required')
        }
    }
    //On submit function
    const handleLogin = (event) => {
        //Avoid Default Submit (occurs on reloading of the page)
        event.preventDefault();
        if (!isSigningIn ) {
            setIsSigningIn(true)
        } else if (username.length > 0 && password.length > 0 ) {
            setCurrentUser(users.find((user) => user.username === username))

            try {

                //Check if the username matches a username in the database

                //If it does then continue to check the password
                if (currentUser) {
                    //if password is correct submit
                    if (currentUser.password === password) {
                        setIsSubmitted(true);
                        window.sessionStorage.setItem('currentUser', JSON.stringify(currentUser))
                        //Otherwise set an error message
                    } else {
                        setErrorMessages({ name: "password", message: errorList.password });
                    }
                    //If username does not match a username in the database, 
                } else {
                    setErrorMessages({ name: "username", message: errorList.password });
                }
            } catch (e) {

            }
        } else if (username.length < 1 || password.length < 1 ) {
            alert('All inputs are required')
        } 
    };

    //Return Message To Show That User Is Logged In
    return <>
        <div className="login">
            <div className="login-form">
                {renderForm()}
            </div>
        </div>
    </>
}

