import { useState, useEffect } from "react"

export default function CoursesPage(props) {
    const [isEditing, setIsEditing] = useState(false);
    const [courseToEdit, setCourseToEdit] = useState({});
    const [courseToDelete, setCourseToDelete] = useState({});
    const [courseName, setCourseName] = useState('');
    const [subjectArea, setSubjectArea] = useState('');
    const [description, setDescription] = useState('');
    const [numberOfCredits, setNumberOfCredits] = useState('');
    const [courses, setCourse] = useState([
        {
            "id": 0,
            "courseName": "Introduction to Computer Science",
            "subjectArea": "Computer Science",
            "description": "An introduction to the basic concepts of computer programming and computer science.",
            "numberOfCredits": 3
        },
        {
            "id": 1,
            "courseName": "Calculus I",
            "subjectArea": "Mathematics",
            "description": "A first course in calculus including limits, continuity, derivatives, and integrals.",
            "numberOfCredits": 4
        },
        {
            "id": 2,
            "courseName": "Introduction to Psychology",
            "subjectArea": "Psychology",
            "description": "An introduction to the scientific study of behavior and mental processes.",
            "numberOfCredits": 3
        }
    ]);
    useEffect(() => {
        setCourse(courses.filter((course) => course.id !== courseToDelete.id));
    }, [courseToDelete]
    );
    const resetDefualts = () => {
        setCourseToEdit({})
        setCourseName("")
        setSubjectArea("")
        setDescription("")
        setNumberOfCredits("")
    }
    return (
        <>
            <h1>Courses</h1>
            <ul>
                {!isEditing ?
                    <div className="course">
                        <div className="align-left pad-start">
                            <label htmlFor="courseName">Course: </label>
                            <input type="text" id="courseName" name="courseName" input={courseName} onInput={(e) => {
                                setCourseName(e.target.value)
                            }} />
                        </div>
                        <div className="align-left pad-start">
                            <label htmlFor="subjectArea">Subject: </label>
                            <input type="text" id="subjectArea" name="subjectArea" input={subjectArea} onInput={(e) => {
                                setSubjectArea(e.target.value)
                            }} />
                        </div>

                        <div className="align-left pad-start">
                            <label htmlFor="description">Description: </label>
                            <input type="text" id="description" name="description" input={description} onInput={(e) => {
                                setDescription(e.target.value)
                            }} />
                        </div>
                        <div className="align-left pad-start">
                            <label htmlFor="numberOfCredits">Credits: </label>
                            <input type="text" id="fnanumberOfCredits" name="numberOfCredits" input={numberOfCredits} onInput={(e) => {
                                setNumberOfCredits(e.target.value)
                            }} />
                        </div>
                        <button className="delete btn btn-primary" onClick={() => {
                            setCourse((courses) => [...courses, {
                                "id": courses[courses.length - 1].id + 1,
                                "courseName": courseName,
                                "subjectArea": subjectArea,
                                "description": description,
                                "numberOfCredits": numberOfCredits
                            }])
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


                            <div className="align-left">
                                {isEditing && courseToEdit.id === course.id ?
                                    <div className="align-left pad-start">
                                        <label htmlFor="courseName">Course: </label>
                                        <input type="text" id="courseName" name="courseName" value={courseName} onInput={(e) => {
                                            setCourseName(e.target.value)
                                        }} />
                                    </div> : <h1>{course.courseName}</h1>
                                }
                                {isEditing && courseToEdit.id === course.id ?
                                    <div className="align-left pad-start">
                                        <label htmlFor="subjectArea">Subject: </label>
                                        <input type="text" id="subjectArea" name="subjectArea"  value={subjectArea} input={subjectArea} onInput={(e) => {
                                            setSubjectArea(e.target.value)
                                        }} />
                                    </div> : <p><b>Subject Area</b>: {course.subjectArea}</p>
                                }

                                {isEditing && courseToEdit.id === course.id ?
                                    <div className="align-left pad-start">
                                        <label htmlFor="description">Description: </label>
                                        <input type="text" id="description" name="description" value={description} input={description} onInput={(e) => {
                                            setDescription(e.target.value)
                                        }} />
                                    </div> : <p><b>Description</b>: {course.description}</p>
                                }
                                {isEditing && courseToEdit.id === course.id ?
                                    <div className="align-left pad-start">
                                        <label htmlFor="numberOfCredits">Credits: </label>
                                        <input type="text" id="numberOfCredits" name="numberOfCredits" value={numberOfCredits} input={numberOfCredits} onInput={(e) => {
                                            setNumberOfCredits(e.target.value)
                                        }} />
                                    </div> : <p><b>Number of Credits</b>: {course.numberOfCredits}</p>
                                }
                            </div>
                            <div className="align-row">
                                {(isEditing ?
                                    <button onClick={() => {
                                        courses.forEach((course) => {
                                            if (course.id == courseToEdit.id)  {
                                                course.courseName = courseName
                                                course.subjectArea = subjectArea
                                                course.numberOfCredits = numberOfCredits
                                                course.description = description
                                            }
                                        })
                                        setCourse(courses) 
                                        setIsEditing(false)
                                        resetDefualts()
                                    }} className="btn btn-primary pad-end"> Save </button> : <div></div>)
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
                            </div>
                        </div>
                    </li>
                })}
            </ul>
        </>
    )
}