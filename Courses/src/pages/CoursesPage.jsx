import { useState, useEffect } from "react"
import TopNavBar from '@/components/Navbar';

export default function CoursesPage() {
    const [user, serUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [courseToEdit, setCourseToEdit] = useState({});
    const [courseToDelete, setCourseToDelete] = useState({});
    const [courseName, setCourseName] = useState('');
    const [subjectArea, setSubjectArea] = useState('');
    const [description, setDescription] = useState('');
    const [numberOfCredits, setNumberOfCredits] = useState('');
    const getRandomId = () => {
        return Math.floor(Math.random() * 10) * Math.floor(Math.random() * 1000) * Math.floor(Math.random() * 100) * Math.floor(Math.random() * 999)
    }
    const [courses, setCourse] = useState([]);

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
        serUser(JSON.parse(window.sessionStorage.getItem("currentUser")))
    }, [])

    const resetDefualts = () => {
        setCourseToEdit({})
        setCourseName("")
        setSubjectArea("")
        setDescription("")
        setNumberOfCredits("")
    }
    return (
        <>
            <TopNavBar />
            <ul>
                {!isEditing  && user.account === 'teacher'?
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
                                "numberOfCredits": numberOfCredits
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
            <ul className='nobull'>
                {courses.map((course) => {
                    return <li className="course" key={course.id}>
                        <div className="align-column">


                            <div className={isEditing && courseToEdit.id === course.id ? "align-left" : "left-text"} >
                                {isEditing && courseToEdit.id === course.id ?
                                    <div className="align-left pad-start">
                                        <label htmlFor="courseName"><b>Course</b>: </label>
                                        <input className="form-control" type="text" id="courseName" name="courseName" value={courseName} onInput={(e) => {
                                            setCourseName(e.target.value)
                                        }} />
                                    </div> : <h1>{course.courseName}</h1>
                                }
                                {isEditing && courseToEdit.id === course.id ?
                                    <div className="align-left pad-start">
                                        <label htmlFor="subjectArea"><b>Subject</b>: </label>
                                        <input className="form-control" type="text" id="subjectArea" name="subjectArea" value={subjectArea} input={subjectArea} onInput={(e) => {
                                            setSubjectArea(e.target.value)
                                        }} />
                                    </div> : <p><b>Subject Area</b>: {course.subjectArea}</p>
                                }

                                {isEditing && courseToEdit.id === course.id ?
                                    <div className="align-left pad-start">
                                        <label htmlFor="description"><b>Description</b>: </label>
                                        <textarea className="form-control" type="text" id="description" name="description" value={description} input={description} onInput={(e) => {
                                            setDescription(e.target.value)
                                        }} rows={5} />
                                    </div> : <p><b>Description</b>: {course.description}</p>
                                }
                                {isEditing && courseToEdit.id === course.id ?
                                    <div className="align-left pad-start">
                                        <label htmlFor="numberOfCredits"><b>Credits</b>: </label>
                                        <input className="form-control" type="text" id="numberOfCredits" name="numberOfCredits" value={numberOfCredits} input={numberOfCredits} onInput={(e) => {
                                            setNumberOfCredits(e.target.value)
                                        }} />
                                    </div> : <p><b>Number of Credits</b>: {course.numberOfCredits}</p>
                                }
                            </div>
                            {user.account === 'student' ? <div className="align-row"> 
                                <button className="btn btn-dark">Enroll</button> 
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
                                <button onClick={() => setCourseToDelete(course)} className="btn btn-danger"> Delete </button>
                            </div>}
                            
                        </div>
                    </li>
                })}
            </ul>
        </>
    )
}