// Load courses from the JSON file
let courses = [];
fetch('courses.json')
  .then(response => response.json())
  .then(data => {
    courses = data;
    renderCourses();
  })
  .catch(error => console.error(error));

function renderCourses() {
  // Get the course list container
  const courseList = document.getElementById('course-list');
  courseList.innerHTML = '';

  // Loop through each course and create a new element for it
  courses.forEach((course, index) => {
    // Create a new div for the course
    const courseDiv = document.createElement('div');
    courseDiv.classList.add('course');

    // Add the course information to the div
    courseDiv.innerHTML = `
      <h2>${course.courseName}</h2>
      <p>Subject Area: ${course.subjectArea}</p>
      <p>Description: ${course.description}</p>
      <p>Number of Credits: ${course.numberOfCredits}</p>
    `;

    // Add a button to remove the course
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove Course';
    removeButton.addEventListener('click', () => {
      courses.splice(index, 1);
      saveCourses();
      renderCourses();
    });
    courseDiv.appendChild(removeButton);

    // Add an event listener to the course div to display more information on click
    courseDiv.addEventListener('click', () => {
      // Create a new page to display more information about the course
      const courseDetailsPage = document.createElement('div');
      courseDetailsPage.classList.add('course-details');
    
      // Add the course information to the page
      const courseName = document.createElement('h2');
      courseName.textContent = course.courseName;
      courseDetailsPage.appendChild(courseName);
    
      const subjectArea = document.createElement('p');
      subjectArea.textContent = `Subject Area: ${course.subjectArea}`;
      courseDetailsPage.appendChild(subjectArea);
    
      const description = document.createElement('p');
      description.textContent = `Description: ${course.description}`;
      courseDetailsPage.appendChild(description);
    
      const numberOfCredits = document.createElement('p');
      numberOfCredits.textContent = `Number of Credits: ${course.numberOfCredits}`;
      courseDetailsPage.appendChild(numberOfCredits);
    
      // Add an "Edit" button to allow the user to modify the course details
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => {
        // Replace the course information with input fields for editing
        courseName.innerHTML = `<input type="text" value="${course.courseName}" />`;
        subjectArea.innerHTML = `<input type="text" value="${course.subjectArea}" />`;
        description.innerHTML = `<input type="text" value="${course.description}" />`;
        numberOfCredits.innerHTML = `<input type="text" value="${course.numberOfCredits}" />`;
      });
      courseDetailsPage.appendChild(editButton);
    
      // Add a "Save" button to allow the user to save the edited course details
      const saveButton = document.createElement('button');
      saveButton.textContent = 'Save';
      saveButton.addEventListener('click', () => {
        // Update the course details with the values from the input fields
        course.courseName = courseName.querySelector('input').value;
        course.subjectArea = subjectArea.querySelector('input').value;
        course.description = description.querySelector('input').value;
        course.numberOfCredits = numberOfCredits.querySelector('input').value;
      
        // Re-display the course details with the updated values
        courseName.innerHTML = course.courseName;
        subjectArea.innerHTML = `Subject Area: ${course.subjectArea}`;
        description.innerHTML = `Description: ${course.description}`;
        numberOfCredits.innerHTML = `Number of Credits: ${course.numberOfCredits}`;
      
        // Send an HTTP POST request to the server-side script with the updated course data
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'updateCourse.php', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log(xhr.responseText);
          }
        };
        xhr.send(JSON.stringify(course));
      });
      
      courseDetailsPage.appendChild(saveButton);
    
      // Add a button to close the course details page
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.addEventListener('click', () => {
        courseDetailsPage.remove();
      });
      courseDetailsPage.appendChild(closeButton);
    
      // Add the course details page to the body of the document
      document.body.appendChild(courseDetailsPage);
    });
    

    // Add the course div to the course list container
    courseList.appendChild(courseDiv);
  });
}

function saveCourses() {
  // Save courses to the JSON file
  fetch('courses.json', {
    method: 'PUT',
    body: JSON.stringify(courses),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

// Add a new course to the courses array
function addCourse() {
  const newCourse = {
    courseName: 'New Course',
    subjectArea: 'New Subject',
    description: 'New Description',
    numberOfCredits: 0
  };
  courses.push(newCourse);
  saveCourses();
  renderCourses();
}

// Add an event listener to the add course button
const addCourseButton = document.getElementById('add-course');
addCourseButton.addEventListener('click', addCourse);

// Remove a course from the courses array
function removeCourse() {
  const lastIndex = courses.length - 1;
  courses.splice(lastIndex, 1);
  saveCourses();
  renderCourses();
}

// Add an event listener to the remove course button
const removeCourseButton = document.getElementById('remove-course');
removeCourseButton.addEventListener('click', removeCourse);
