import { useState, useEffect } from "react"
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginPage({ onRedirect }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [currentUser, setCurrentUser] = useState({});
    const [users, setUsers] = useState([])
    // Generate JSX code for error message
    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="error">{errorMessages.message}</div>
        );

    // Create Form To Accept Input
    const renderForm = () => {
        return <>
            <div className="card">
                <div className="card-body">
                <h5 class="card-title">Grand Course Scheduler</h5>
                    <form onSubmit={handleSubmit}>
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
                        <button type="submit" className="btn btn-dark pad-top" onSubmit={(e) => handleSubmit(e)}>
                            Login
                        </button>
                    
                    </form>
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
            onRedirect(currentUser)
            console.log("Redirecting...")
            window.location.replace("/courses")
        }
    }, [isSubmitted])

    useEffect(() => {
      fetchUsers()
      window.sessionStorage.setItem("currentUser",null);
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

    //On submit function
    const handleSubmit = (event) => {
        //Avoid Default Submit (occurs on reloading of the page)
        event.preventDefault();
        setCurrentUser(users.find((user) => user.username === username))

        try {

            //Check if the username matches a username in the database

            //If it does then continue to check the password
            if (currentUser) {
                //if password is correct submit
                if (currentUser.password === password) {
                    setIsSubmitted(true);
                    window.sessionStorage.setItem('currentUser', JSON.stringify(currentUser))
                    onRedirect(currentUser)
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

