const courses = [
  { code: "WDD 130", name: "Web Fundamentals", credits: 3, completed: true },
  { code: "WDD 231", name: "Frontend Development I", credits: 3, completed: false },
  { code: "CSE 121b", name: "JavaScript Language", credits: 3, completed: true },
  // Add more as needed...
];

const coursesContainer = document.getElementById("courses");
const creditOutput = document.getElementById("totalCredits");

function renderCourses(filtered = courses) {
  coursesContainer.innerHTML = "";
  let totalCredits = 0;

  filtered.forEach(course => {
    const div = document.createElement("div");
    div.className = `course-card ${course.completed ? "completed" : "not-completed"}`;
    div.innerHTML = `<strong>${course.code}</strong>: ${course.name} - ${course.credits} credits`;
    coursesContainer.appendChild(div);
    totalCredits += course.credits;
  });

  creditOutput.textContent = totalCredits;
}

document.getElementById("all").onclick = () => renderCourses();
document.getElementById("wdd").onclick = () => renderCourses(courses.filter(c => c.code.startsWith("WDD")));
document.getElementById("cse").onclick = () => renderCourses(courses.filter(c => c.code.startsWith("CSE")));

renderCourses();
