import {useState, useEffect} from "react"

export default function LoginPage({ onRedirect}) {
    const [errorMessages,setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [currentUser, setCurrentUser] = useState({});

    // Generate JSX code for error message
    const renderErrorMessage = (name) =>
    name === errorMessages.name && (
    <div className="error">{errorMessages.message}</div>
    );

    // Create Form To Accept Input
    const renderForm = () => {
        return <>
        <div className="form">
        <form onSubmit = {handleSubmit}>
            <div className="input-container">
            <label>Username </label>
            <input type="text" name="username" required />
            {renderErrorMessage("username")}
            </div>
            <div className="input-container">
            <label>Password </label>
            <input type="password" name="password" required />
            {renderErrorMessage("password")}
            </div>
            <button onclick = {handleSubmit}>
                Submit 
            </button>
        </form>
        </div>
        </>
    };

    //Once Login Is Confirmed Send User To Courses Pages
    useEffect(() => {
        if(isSubmitted === true){
            window.location.replace("/courses")
            onRedirect()
        }
    },[isSubmitted])

    //Test User Login Info (Will Be Moved To External Source Later)
    //account type determines user level of authority
    const userList = [
        {
            username: "jsmith69",
            password: "12345",
            account: "student"
        },
        {
            username: "bdole88",
            password: "f4nny",
            account: "teacher"
        },
        {
            username: "hli16",
            password: "lewisM@S",
            account: "teacher"
        }
    ];

    const errorList = {
        username: "Error, invalid username",
        password: "Error, invalid password"
    }

    //On submit function
    const handleSubmit = (event) => {
        //Avoid Default Submit (occurs on reloading of the page)
        event.preventDefault();

        var {username, password} = document.forms[0];
        try {
       
        //Check if the username matches a username in the database
        setCurrentUser(userList.find((user) => user.username === username.value ))

        //If it does then continue to check the password
        if (currentUser){
            //if password is correct submit
            if(currentUser.password === password.value) {
                setIsSubmitted(true);
            //Otherwise set an error message
            }else{
                setErrorMessages({name: "password" , message: errorList.password});
            }
        //If username does not match a username in the database, 
        }else{
            setErrorMessages({name: "username", message: errorList.password});
        }
    } catch(e) {
            
    }
    };

    //Return Message To Show That User Is Logged In
    return <>
        <div className = "login">
            <div className="login-form">
                <div className="title"> Sign In</div>
                {isSubmitted ? <div> User is successfully logged in </div> : <>{renderForm()}</>}
            </div>
        </div>
    </>
}

