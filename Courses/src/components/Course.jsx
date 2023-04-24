export default function Course({course, onDelete}) {
    return (
        <>
            <li className="course">
                <div className="align-row">

                
                <div className="align-left">
                    <h1>{course.courseName}</h1>
                    <p><b>Subject Area</b>: {course.subjectArea}</p>
                    <p><b>Description</b>: {course.description}</p>
                    <p><b>Number of Credits</b>: {course.numberOfCredits}</p>
                </div>
                <button onClick={onDelete(course)} className="btn btn-danger"> Delete </button>
                </div>
            </li>
        </>
    )
}
