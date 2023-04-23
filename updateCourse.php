<?php
// Load the courses from the courses.json file
$courses = json_decode(file_get_contents('courses.json'), true);

// Read the updated course data from the HTTP POST request body
$updatedCourse = json_decode(file_get_contents('php://input'), true);

// Find the index of the course to update in the courses array
$courseIndex = array_search($updatedCourse['courseCode'], array_column($courses, 'courseCode'));

// If the course is found, update its details and save the updated courses to the courses.json file
if ($courseIndex !== false) {
  $courses[$courseIndex]['courseName'] = $updatedCourse['courseName'];
  $courses[$courseIndex]['subjectArea'] = $updatedCourse['subjectArea'];
  $courses[$courseIndex]['description'] = $updatedCourse['description'];
  $courses[$courseIndex]['numberOfCredits'] = $updatedCourse['numberOfCredits'];
  file_put_contents('courses.json', json_encode($courses, JSON_PRETTY_PRINT));
  echo 'Course updated successfully!';
} else {
  echo 'Course not found!';
}
?>
