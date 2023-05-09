import TopNavBar from '@/components/Navbar';
import { useState, useEffect } from "react"

export default function UserPage({ isDisplayingFaculty }) {
    const [currentUser, setUser] = useState({});
    const [users, setUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState('');

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

    useEffect(() => {
        fetchUsers()
        const user = JSON.parse(window.sessionStorage.getItem("currentUser"))
        if (user) {
            setUser(user)
        } else {
            window.location.replace("/")
        }
    }, [])

    return (
        <>
            <TopNavBar onSearch={(search) => {
                console.log('Searching...' + search)
                setSearchTerm(search)
            }}/>
            {isDisplayingFaculty ?
                <ul>
                    {
                        users.filter(user => {
                            return user.account === 'teacher' &&
                            (user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        }).map(user => {
                            return <li className="course"  key={user.username}>
                                    <div className="align-left pad-start">
                                        <h5><small className='text-muted'>Name</small>: {user.name ? user.name : "Faculty" }</h5>
                                        <h5><small className='text-muted'>Username</small>: {currentUser.username === user.username ? user.username : ("*".repeat(user.username.length - 3) + user.username.substring(user.username.length - 3))}</h5>
                                        <h5><small className='text-muted'>Password</small>: {currentUser.username === user.username ? user.password : ("*".repeat(user.password.length - 3) + user.password.substring(user.password.length - 3))}</h5>
                                        <h5><small className='text-muted'>Role</small>: Faculty</h5>
                                        <h5><small className='text-muted'>Department</small>: {user.department ? user.department : "Unset"}</h5>
                                        <h5><small className='text-muted'>School</small>: {user.school ? user.school : "Unset"}</h5>
                                        <h5><small className='text-muted'>Description</small>: {user.description ? user.description : "Unset"}</h5>
                                        <h5><small className='text-muted'>Account Created</small>: {user.createdAt ? user.createdAt  : new Date("2023-05-1").toDateString() }</h5>
                                    </div>
                                </li>
                        })
                    }
                </ul> : <ul>
                    {
                        users.filter(
                            user => user.account === 'student' &&
                            (user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        ).map(user => {
                            return  <li className="course" key={user.username}>
                            <div className="align-left pad-start">
                                <h5><small className='text-muted'>Name</small>: {user.name ? user.name : "Student" }</h5>
                                <h5><small className='text-muted'>Username</small>: {currentUser.username === user.username ? user.username : ("*".repeat(user.username.length - 3) + user.username.substring(user.username.length - 3))}</h5>
                                <h5><small className='text-muted'>Password</small>: {currentUser.username === user.username ? user.password : ("*".repeat(user.password.length - 3) + user.password.substring(user.password.length - 3))}</h5>
                                <h5><small className='text-muted'>Role</small>: Student</h5>
                                <h5><small className='text-muted'>Account Created</small>: {user.createdAt ? user.createdAt  : new Date("2023-05-1").toDateString() }</h5>
                            </div>
                        </li>
                        })
                    }
                </ul>
            }
        </>
    )
}
