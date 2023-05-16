import { useState, useEffect } from "react"
import TopNavBar from '@/components/Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function CoursesPage({ isDisplayingSchedule }) {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [courseToEdit, setCourseToEdit] = useState({});
    const [currentCourse, setCurrentCourse] = useState({});
    const [courseToDelete, setCourseToDelete] = useState({});
    const [courseName, setCourseName] = useState('');
    const [subjectArea, setSubjectArea] = useState('');
    const [description, setDescription] = useState('');
    const [numberOfCredits, setNumberOfCredits] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setModalShow] = useState(false);
    const [courses, setCourse] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [numberOfEnrolledStudents, setNumberOfEnrolledStudents] = useState(0);

    const handleCloseModal = () => setModalShow(false);
    const handleShowModal = () => setModalShow(true);

    const handleCourseDrop = (course) => {
        const updatedCourses = enrolledCourses.filter((enrolled) => enrolled.id !== course.id)
        setEnrolledCourses(updatedCourses)
        const current = JSON.parse(window.sessionStorage.getItem("currentUser"))
        postCoursesForUser(current.username, updatedCourses)
    }

    const handleCourseEnroll = (course) => {
        const stored = JSON.parse(window.sessionStorage.getItem(user.username))
        let updated = []
        if (stored) {
            updated = [...enrolledCourses, ...stored, course]
        } else {
            updated = [...enrolledCourses, course]
        }
        setEnrolledCourses(updated.filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i))
        postCoursesForUser(user.username, updated.filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i))
    }



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
    async function fetchAllCourses() {
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

    async function fetchNumberOfStudentsEnrolledForCOurse(cousrseId) {
        try {
            const res = await fetch(`https://groupbackend.onrender.com/students-enrolled/course/${cousrseId}`, {
                method: "GET",
                mode: "cors",
                referrerPolicy: "no-referrer",
            })

            const enrolledStudents = await res.json();
            console.log(enrolledStudents)
            if (enrolledStudents) {
                setNumberOfEnrolledStudents(JSON.parse(JSON.stringify(enrolledStudents.numberOfEnrolledStudents)))
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function fetchCoursesForUser(username) {
        try {
            const res = await fetch(`https://groupbackend.onrender.com/courses/user/${username}`, {
                method: "GET",
                mode: "cors",
                referrerPolicy: "no-referrer",
            })

            const remoteCourses = await res.json();
            console.log(remoteCourses)
            if (remoteCourses.length > 0) {
                setEnrolledCourses(JSON.parse(JSON.stringify(remoteCourses)))
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function postCoursesForUser(username, data) {
        try {
            await fetch(`https://groupbackend.onrender.com/courses/user/${username}`,
                {
                    method: "POST",
                    mode: "cors",
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

    if (isDisplayingSchedule) {
        useEffect(() => {
            const current = JSON.parse(window.sessionStorage.getItem("currentUser"))
            fetchCoursesForUser(current.username)
        }, [])
    } else {
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
            try {
                fetchAllCourses()
            } catch (e) {
                console.log(e);
            }
            const user = JSON.parse(window.sessionStorage.getItem("currentUser"))
            if (user) {
                setUser(user)
            } else {
                window.location.replace("/")
            }
            fetchCoursesForUser(user.username)
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
            {isEditing ? <p className={courseToEdit.id === course.id ? "align-left pad-start" : ""}><b>Course ID</b>: {course.id}</p> : <></>}
            {isEditing && courseToEdit.id === course.id ?
                <div className="align-left pad-start">
                    <label htmlFor="courseName"><b>Course</b>: </label>
                    <input className="form-control" type="text" id="courseName" name="courseName" value={courseName} onInput={(e) => {
                        setCourseName(e.target.value);
                    }} />
                </div> : <h1>{course.courseName}</h1>}


            {!isEditing ? <p><b>Course ID</b>: {course.id}</p> : <></>}
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
                            "id": (Math.floor(Math.random() * 10) * Math.floor(Math.random() * 1000) * Math.floor(Math.random() * 100) * Math.floor(Math.random() * 999)),
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
                {isDisplayingSchedule ? enrolledCourses.filter(c => {
                    return c.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        `${c.id}`.includes(searchTerm) ||
                        c.subjectArea.toLowerCase().includes(searchTerm.toLowerCase())
                }).map((course) => {
                    return <li className="course" key={course.id}>
                        <div className="align-column">
                            {CourseContent(course)}
                            <div className="align-row">

                                <button className="btn btn-dark" onClick={() => {
                                    handleCourseDrop(course)
                                }}>Unenroll</button>
                                <button className="btn btn-secondary mar-start" onClick={() => {
                                    handleShowModal()
                                    setCurrentCourse(course)
                                    fetchNumberOfStudentsEnrolledForCOurse(course.id)
                                }}>
                                    View
                                </button>
                            </div>
                        </div>
                    </li>
                }) : courses.filter(c => {
                    return c.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        `${c.id}`.includes(searchTerm) ||
                        c.subjectArea.toLowerCase().includes(searchTerm.toLowerCase())
                }).map((course) => {
                    return <li className="course" key={course.id}>
                        <div className="align-column">
                            {CourseContent(course)}
                            {user.account === 'student' ? <div className="align-row">
                                <button className="btn btn-dark" onClick={() => {
                                    handleCourseEnroll(course)
                                }}>{enrolledCourses.filter(enrolled => enrolled.id === course.id).length > 0 ? "Enrolled" : "Enroll"}</button>
                                <button className="btn btn-secondary mar-start" onClick={() => {
                                    handleShowModal()
                                    setCurrentCourse(course)
                                    fetchNumberOfStudentsEnrolledForCOurse(course.id)
                                }}>
                                    View
                                </button>
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
                                    }} className="btn btn-success pad-end"> Save </button>
                                    : <button className="btn btn-secondary pad-end" onClick={() => {
                                        handleShowModal()
                                        setCurrentCourse(course)
                                    }}>View</button>)
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
                }
            </ul>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentCourse.courseName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <p><b>Course ID</b>: {currentCourse.id}</p>
                        <p><b>Subject Area</b>: {currentCourse.subjectArea}</p>
                        <p><b>Description</b>: {currentCourse.description}</p>
                        <p><b>Number of Credits</b>: {currentCourse.numberOfCredits}</p>
                        <p><b>Teacher</b>: {currentCourse.user ? currentCourse.user : "Admin"}</p>
                        <p><b>Number Of Students</b>: {numberOfEnrolledStudents}</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    {enrolledCourses.filter(enrolled => enrolled.id === currentCourse.id).length > 0 ?
                        <Button variant="danger" onClick={() => {
                            handleCourseDrop(currentCourse)
                            setNumberOfEnrolledStudents(numberOfEnrolledStudents - 1)
                        }}>Drop</Button> : user.account === "student"  ? <Button variant="primary" onClick={() => {
                            handleCourseEnroll(currentCourse)
                            setNumberOfEnrolledStudents(numberOfEnrolledStudents + 1)
                        }}>Enroll</Button> : <></>}
                </Modal.Footer>
            </Modal>
        </>
    )
}