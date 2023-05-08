import { useState, useEffect } from "react"
import TopNavBar from '@/components/Navbar';

export default function CoursesPage({ isEnrolling }) {
    const [user, serUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [courseToEdit, setCourseToEdit] = useState({});
    const [courseToDelete, setCourseToDelete] = useState({});
    const [courseName, setCourseName] = useState('');
    const [subjectArea, setSubjectArea] = useState('');
    const [description, setDescription] = useState('');
    const [numberOfCredits, setNumberOfCredits] = useState('');
    const [searchTerm, setSearchTerm] = useState('');


    const getRandomId = () => {
        return Math.floor(Math.random() * 10) * Math.floor(Math.random() * 1000) * Math.floor(Math.random() * 100) * Math.floor(Math.random() * 999)
    }
    const [courses, setCourse] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    async function postCourses(data) {
        try {
            await fetch("https://groupbackend.onrender.com/courses",
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
        } catch (e) {
            console.log(e);
        }
    }
    if (isEnrolling) {
        useEffect(() => {
            const updatedCourses = courses.filter((course) => course.id !== courseToDelete.id)
            setCourse(updatedCourses);
            if (updatedCourses.length > 0) {
                try {
                    postCourses(updatedCourses)
                } catch (e) {
                    console.log(e);
                }
            }
        }, [courseToDelete]);

        useEffect(() => {
            async function fetchData() {
                try {
                    const res = await fetch("https://groupbackend.onrender.com/courses", {
                        method: "GET",
                        mode: "cors",
                        referrerPolicy: "no-referrer",
                    })

                    const remoteCourses = await res.json();
                    console.log(remoteCourses)
                    if (remoteCourses.length > 0) {
                        setCourse(JSON.parse(JSON.stringify(remoteCourses)))
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            try {
                fetchData()
            } catch (e) {
                console.log(e);
            }
            const user = JSON.parse(window.sessionStorage.getItem("currentUser"))
            if (user) {
                serUser(user)
            } else {
                window.location.replace("/")
            }
            const stored = JSON.parse(window.sessionStorage.getItem(user.username))
            if(stored) {
                setEnrolledCourses(stored)
            }
        }, [])
    } else{
        useEffect(() => {
            const current = JSON.parse(window.sessionStorage.getItem("currentUser"))
            const schedules = JSON.parse(window.sessionStorage.getItem(current.username))
            console.log(schedules)
            if (schedules) {
                setEnrolledCourses(schedules)
            }
            
        }, [])
    }



    const resetDefualts = () => {
        setCourseToEdit({})
        setCourseName("")
        setSubjectArea("")
        setDescription("")
        setNumberOfCredits("")
    }

    function CourseContent(course) {
        return <div className={isEditing && courseToEdit.id === course.id ? "align-left" : "left-text"}>
            {isEditing && courseToEdit.id === course.id ?
                <div className="align-left pad-start">
                    <label htmlFor="courseName"><b>Course</b>: </label>
                    <input className="form-control" type="text" id="courseName" name="courseName" value={courseName} onInput={(e) => {
                        setCourseName(e.target.value);
                    }} />
                </div> : <h1>{course.courseName}</h1>}
            {isEditing && courseToEdit.id === course.id ?
                <div className="align-left pad-start">
                    <label htmlFor="subjectArea"><b>Subject</b>: </label>
                    <input className="form-control" type="text" id="subjectArea" name="subjectArea" value={subjectArea} input={subjectArea} onInput={(e) => {
                        setSubjectArea(e.target.value);
                    }} />
                </div> : <p><b>Subject Area</b>: {course.subjectArea}</p>}

            {isEditing && courseToEdit.id === course.id ?
                <div className="align-left pad-start">
                    <label htmlFor="description"><b>Description</b>: </label>
                    <textarea className="form-control" type="text" id="description" name="description" value={description} input={description} onInput={(e) => {
                        setDescription(e.target.value);
                    }} rows={5} />
                </div> : <p><b>Description</b>: {course.description}</p>}
            {isEditing && courseToEdit.id === course.id ?
                <div className="align-left pad-start">
                    <label htmlFor="numberOfCredits"><b>Credits</b>: </label>
                    <input className="form-control" type="text" id="numberOfCredits" name="numberOfCredits" value={numberOfCredits} input={numberOfCredits} onInput={(e) => {
                        setNumberOfCredits(e.target.value);
                    }} />
                </div> : <p><b>Number of Credits</b>: {course.numberOfCredits}</p>}
        </div>;
    }

    const AddCourseBar = () => {
        return <ul>
            {!isEditing && user.account === 'teacher' ?
                <div className="course pad-bottom">
                    <div className="align-left pad-start">
                        <label htmlFor="courseName"><b>Course</b>: </label>
                        <input className="form-control" type="text" id="courseName" name="courseName" input={courseName} onInput={(e) => {
                            setCourseName(e.target.value)
                        }} />
                    </div>
                    <div className="align-left pad-start">
                        <label htmlFor="subjectArea"><b>Subject</b>: </label>
                        <input className="form-control" type="text" id="subjectArea" name="subjectArea" input={subjectArea} onInput={(e) => {
                            setSubjectArea(e.target.value)
                        }} />
                    </div>

                    <div className="align-left pad-start">
                        <label htmlFor="description"><b>Description</b>: </label>
                        <input className="form-control" type="text" id="description" name="description" input={description} onInput={(e) => {
                            setDescription(e.target.value)
                        }} />
                    </div>
                    <div className="align-left pad-start">
                        <label htmlFor="numberOfCredits"><b>Credits</b>: </label>
                        <input className="form-control" type="text" id="fnanumberOfCredits" name="numberOfCredits" input={numberOfCredits} onInput={(e) => {
                            setNumberOfCredits(e.target.value)
                        }} />
                    </div>
                    <button className="delete btn btn-secondary" onClick={() => {
                        const updatedCourses = [...courses, {
                            "id": getRandomId(),
                            "courseName": courseName,
                            "subjectArea": subjectArea,
                            "description": description,
                            "numberOfCredits": numberOfCredits,
                            "user": user.username
                        }]
                        setCourse(updatedCourses)
                        try {
                            postCourses(updatedCourses)
                        } catch (e) {
                            console.log(e);
                        }
                    }}>
                        <b>Submit</b>
                    </button>
                </div> : <div></div>
            }
        </ul>
    }

    return (
        <>
            <TopNavBar onSearch={(search) => {
                console.log('Searching...' + search)
                setSearchTerm(search)
            }} />
            {AddCourseBar()}
            <ul className='nobull'>
                {isEnrolling ?
                    courses.filter(c => { return c.courseName.includes(searchTerm) || courses.length < 0 }).map((course) => {
                        return <li className="course" key={course.id}>
                            <div className="align-column">
                                {CourseContent(course)}

                                {user.account === 'student' ? <div className="align-row">
                                    <button className="btn btn-dark" onClick={() => {
                                        const stored = JSON.parse(window.sessionStorage.getItem(user.username))
                                        let updated = []
                                        if(stored) {
                                            updated = [...enrolledCourses, ...stored, course] 
                                        }else {
                                            updated = [...enrolledCourses, course] 
                                        }
                                        setEnrolledCourses(updated.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i))
                                        window.sessionStorage.setItem(user.username, JSON.stringify(updated.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i)))
                                    }}>{enrolledCourses.filter(enrolled => enrolled.id === course.id).length > 0 ? "Enrolled" : "Enroll"}</button>
                                </div> : <div className="align-row">
                                    {(isEditing && courseToEdit.id === course.id ?
                                        <button onClick={() => {
                                            courses.forEach((course) => {
                                                if (course.id == courseToEdit.id) {
                                                    course.courseName = courseName
                                                    course.subjectArea = subjectArea
                                                    course.numberOfCredits = numberOfCredits
                                                    course.description = description
                                                }
                                            })
                                            setCourse(courses)
                                            if (courses.length > 0) {
                                                try {
                                                    postCourses(courses)
                                                } catch (e) {
                                                    console.log(e);
                                                }
                                            }
                                            setIsEditing(false)
                                            resetDefualts()
                                        }} className="btn btn-success pad-end"> Save </button> : <div></div>)
                                    }
                                    <button onClick={() => {
                                        setIsEditing(!isEditing)
                                        setCourseToEdit(course)
                                        setCourseName(course.courseName)
                                        setSubjectArea(course.subjectArea)
                                        setDescription(course.description)
                                        setNumberOfCredits(course.numberOfCredits)
                                        if (isEditing) {
                                            resetDefualts()
                                        }
                                    }} className="btn btn-primary pad-end"> Edit </button>
                                    <button onClick={() => {
                                        if (user.username === course.user) {
                                            setCourseToDelete(course)
                                        }
                                    }} className="btn btn-danger"> Delete </button>
                                </div>}

                            </div>
                        </li>
                    })
                    :
                    enrolledCourses.filter(c => { return c.courseName.includes(searchTerm) || courses.length < 0 }).map((course) => {
                        return <li className="course" key={course.id}>
                            <div className="align-column">
                                {CourseContent(course)}
                                <button className="btn btn-dark" onClick={() => {
                                    const updatedCourses = enrolledCourses.filter((enrolled) => enrolled.id !== course.id)
                                    setEnrolledCourses(updatedCourses)
                                    const current = JSON.parse(window.sessionStorage.getItem("currentUser"))
                                    window.sessionStorage.setItem(current.username, JSON.stringify(updatedCourses))
                                }}>Unenroll</button>
                            </div>
                        </li>
                    })
                }
            </ul>
        </>
    )
}