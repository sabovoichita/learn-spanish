// Utility function to select elements
function $(selector) {
  return document.querySelector(selector);
}

// Create basic page structure
function createStructure(chapters) {
  const body = $("body");
  // console.log("Body element:", body); // Check if body exists

  body.innerHTML = `
    <header class="fixed-header">
      <h1>Learn Spanish</h1>
      ${createNav(chapters)}
    </header>
    <div id="container"></div>
  `;

  // console.log("Structure created.");
}

// Function to create the navigation bar
function createNav(chapters) {
  const navItems = chapters
    .map(
      (chapter, index) =>
        `<li><a href="#" class="chapter-link" data-lesson="${
          index + 1
        }">Lesson ${index + 1}: ${chapter.title}</a></li>`
    )
    .join("");

  return `
    <nav class="nav-container">
      <div class="dropdown">
        <button class="dropdown-btn">Lessons</button>
        <ul class="dropdown-menu">
          ${navItems}
        </ul>
      </div>
    </nav>
  `;
}

// Render divs for lessons
function renderDivs() {
  const container = $("#container");
  container.innerHTML = ""; // Clear any existing content
  // You don't need multiple divs here. A single div will be used to show one lesson at a time.
  const lessonDiv = document.createElement("div");
  lessonDiv.id = "lesson-content"; // This is the main div where lesson content will be shown
  container.appendChild(lessonDiv);
}

// Generate lesson content
function generateLessonContent(lessons, lessonNumber) {
  return lessons
    .map(
      (lesson) => `
    <section id="sectionArea" class="displayContent">
      <!-- Collapsible Section for Introduction -->
      <div class="collapsible-section">
        <button class="collapsible-btn">Chapter: ${lesson.ch}. ${
        lesson.title
      }</button>
        <div class="collapsible-content">
          ${generateLessonSections(lesson)}
        </div>
      </div>

      

      <!-- Collapsible Section for Exercises -->
      <div class="collapsible-section">
        <button class="collapsible-btn"> ${lesson.exercises}</button>
        <div class="collapsible-content">
          ${generateExercises(lesson, lessonNumber)}
        </div>
      </div>

      <!-- Collapsible Section for Cultural Brief -->
      <div class="collapsible-section">
        <button class="collapsible-btn">Cultural Brief</button>
        <div class="collapsible-content">
          ${generateCulturalBrief(lesson)}
        </div>
      </div>
      

      <!-- Collapsible Section for Vocabulary -->
      <div class="collapsible-section">
        <button class="collapsible-btn">Vocabulary</button>
        <div class="collapsible-content">
          ${generateVocabularyTable(lesson.vocabulary, lesson.vocabularyE)}
        </div>
      </div>
      <hr>
    </section>
  `
    )
    .join("");
}

// Generate sections of the lesson
function generateLessonSections(lesson) {
  return `
  <div class="displayLesson">
    ${generateSubChapter(lesson.subCh1, lesson.lessonContent)}
    ${generateSubChapter(lesson.subCh2, lesson.lessonContentSubCh2)}
    ${generateSubChapter(lesson.subCh3, lesson.lessonContentSubCh3)}
  </div>
`;
}

// Generate individual subchapters
function generateSubChapter(title, content) {
  if (!content) return ""; // Handle missing content gracefully
  return `
    <h3 class="subchapter">${title}</h3>
    ${content
      .map((item) => {
        if (item.type === "paragraph") {
          return `<p class="text">${item.text}</p>`;
        } else if (item.type === "wordSection") {
          return createWSection(
            item.label1,
            item.label2,
            item.words1,
            item.words2
          );
        } else if (item.type === "subchapter") {
          return `<p class="subchapter">${item.text}</p>`;
        }
        return ""; // Handle unexpected types gracefully
      })
      .join("")}
  `;
}

function createExSection(lessonNumber, exIdPrefix, placeholder, ex, answers) {
  // Check if the exercise array exists and is valid
  if (!Array.isArray(ex)) {
    console.error(
      `Expected 'ex' to be an array for exercise ${exIdPrefix}, but got:`,
      ex
    );
    return ""; // Return an empty string to prevent errors
  }

  const uniqueExIdPrefix = `l${lessonNumber}-${exIdPrefix}`;

  const exerciseHtml = ex
    .map(
      (example, index) => `
        <span class="exercise-item">
          <span class="exercise-text">${example}</span> ${index + 1}
          <input class="exerciseInput" 
                 id="${uniqueExIdPrefix}-${index}" 
                 placeholder="${placeholder}" 
                 aria-label="Exercise input for ${example}" />
        </span>
      `
    )
    .join("");

  return `
    <div class="ex-section" data-prefix="${uniqueExIdPrefix}">
      ${exerciseHtml}
      <br>
      <button class="check-answers-btn" data-prefix="${uniqueExIdPrefix}">Check Answers</button>
    </div>
  `;
}

function generateExercises(lesson, lessonNumber) {
  return lesson.lessonEx
    .map((text, index) => {
      const exPrefix = `ex${index + 1}`; // Dynamically handles ex1 to ex7

      // Check if the exercise data exists for this prefix
      if (!lesson[exPrefix]) {
        console.warn(
          `Exercise ${exPrefix} is missing in lesson ${lessonNumber}`
        );
        return ""; // Return an empty string if exercise is missing
      }

      return `
        <p class="notes">${text}</p>
        ${createExSection(
          lessonNumber,
          exPrefix, // Automatically sets ex7
          lesson.placeholder,
          lesson[exPrefix], // Accesses ex7 properly
          lesson.answers
        )}
      `;
    })
    .join("");
}

// Generate cultural brief section
function generateCulturalBrief(lesson) {
  return lesson.bTitle
    .map(
      (title, index) => `
    <h4 class="subchapter">${title}</h4>
    ${
      index === 0
        ? `<div>${lesson.bContent
            .map((content) => `<p class="cultural">${content}</p>`)
            .join("")}</div>`
        : generateVocabularyTable(lesson.vocabulary, lesson.vocabularyE)
    }
  `
    )
    .join("");
}

// Create vocabulary table
function generateVocabularyTable(vocabulary, vocabularyE) {
  return `
    <table id="vocabularyTable">
      <thead>
        <tr>
          <th>Vocabulary (Spanish)</th>
          <th>Vocabulary (English)</th>
        </tr>
      </thead>
      <tbody>
        ${vocabulary
          .map(
            (term, index) => `
          <tr>
            <td>${term}</td>
            <td>${vocabularyE[index]}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

// Create word mapping section
function createWSection(label1, label2, ws1, ws2) {
  return ws1 && ws1.length
    ? `
    <p class="text">${label1} | ${label2}</p>
    ${ws1
      .map(
        (item, index) => `
      <p class="ws">${item} <span class="black"> | </span> <span class="wEnglish">${
          ws2 ? ws2[index] : ""
        }</span></p>
    `
      )
      .join("")}
  `
    : "";
}

function verifyAnswers(exIdPrefix, answers) {
  console.log(`Verifying answers for exercise ID prefix: ${exIdPrefix}`);

  if (!answers || typeof answers !== "object") {
    console.error(`Invalid answers object provided: ${answers}`);
    return;
  }

  // Split to get the specific exercise part
  const exercisePart = exIdPrefix.split("-")[1]; // e.g., 'ex2' from 'l1-ex2'
  const exerciseAnswers = answers[exercisePart];

  console.log(`Expected answers for ${exercisePart}:`, exerciseAnswers); // Check the expected answers

  if (!Array.isArray(exerciseAnswers) || !exerciseAnswers.length) {
    console.error(
      `No answers found or invalid answers for exercise ID: ${exIdPrefix}`
    );
    return;
  }

  exerciseAnswers.forEach((correctAnswer, index) => {
    const inputElement = document.getElementById(`${exIdPrefix}-${index}`);
    if (inputElement) {
      const userAnswer = inputElement.value.trim().toLowerCase();
      const expectedAnswer = correctAnswer.trim().toLowerCase();

      // console.log(
      //   `Answer ${index}: User input = "${userAnswer}", Expected = "${expectedAnswer}"`
      // );

      if (userAnswer === expectedAnswer) {
        inputElement.style.backgroundColor = "green";
        inputElement.style.color = "white";
      } else {
        inputElement.style.backgroundColor = "red";
        inputElement.style.color = "white";
      }
    } else {
      console.warn(`Input element with ID ${exIdPrefix}-${index} not found.`);
    }
  });
}

let globalLessons = {}; // Use an object for better key-based access

function loadLesson(lessonNumber) {
  // Check if the lesson is already loaded
  if (globalLessons[lessonNumber]) {
    showLesson(lessonNumber, globalLessons[lessonNumber]);
    return; // If it's already loaded, display it and return
  }

  // If the lesson is not loaded yet, fetch it
  fetch(`./data/lesson_${lessonNumber}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then((lessons) => {
      if (!Array.isArray(lessons)) {
        throw new Error("Expected JSON to be an array of lessons.");
      }

      // Validate the lesson data before using it
      lessons.forEach((lesson, index) => {
        if (!lesson.lessonEx || !lesson.answers) {
          console.error(
            `Lesson ${
              index + 1
            } in lesson ${lessonNumber} is missing exercises or answers.`
          );
        }
      });

      // Store the lessons in the global variable
      globalLessons[lessonNumber] = lessons;

      // Render the lesson content
      showLesson(lessonNumber, lessons);
    })
    .catch((error) => {
      console.error("Error loading lesson:", error.message, error);
    });
}

// Show the selected lesson in the same div, replacing any existing content
function showLesson(lessonNumber, lessons) {
  const container = $("#container"); // Use the container element
  if (!container) {
    console.error(`Container not found.`);
    return;
  }

  // Clear the existing lesson content
  container.innerHTML = "";

  // Create a new div for the selected lesson content
  const lessonDiv = document.createElement("div");
  lessonDiv.id = `l${lessonNumber}`;

  // Ensure that lesson content is generated with all exercises including ex7
  lessonDiv.innerHTML = generateLessonContent(lessons, lessonNumber);

  // Append the new lesson div to the container
  container.appendChild(lessonDiv);
}

function validateGlobalLessons() {
  for (const [lessonNumber, lessons] of Object.entries(globalLessons)) {
    if (!Array.isArray(lessons)) {
      console.error(
        `GlobalLessons entry for lesson ${lessonNumber} is not an array.`
      );
      continue;
    }

    lessons.forEach((lesson, index) => {
      if (!lesson.answers || !Array.isArray(lesson.lessonEx)) {
        console.error(
          `Lesson ${
            index + 1
          } in lesson ${lessonNumber} is missing required properties.`
        );
      } else {
        console.log(`Lesson ${index + 1} in lesson ${lessonNumber} is valid.`);
      }
    });
  }
}

// Improved getLessonData function to correctly identify the lesson by exercise prefix
function getLessonData(uniqueExIdPrefix) {
  const [lessonMatch, lessonNumber, exercisePrefix] =
    uniqueExIdPrefix.match(/l(\d+)-(ex\d+)/) || []; // Adjusted regex for clarity

  if (!lessonMatch) {
    console.error(`Invalid exercise ID prefix: ${uniqueExIdPrefix}`);
    return null;
  }

  // Find the corresponding lessons array using the lesson number
  const lessons = globalLessons[lessonNumber];
  if (!lessons) {
    console.error(`No lessons found for lesson number: ${lessonNumber}`);
    return null;
  }

  // Iterate through the lessons to find the correct exercise answers
  for (const lesson of lessons) {
    if (lesson.answers && lesson.answers[exercisePrefix]) {
      return lesson; // Return the full lesson object
    }
  }

  console.error(
    `No matching lesson found for exercise ID prefix: ${uniqueExIdPrefix}`
  );
  return null;
}

function setupDropdown() {
  const dropdownBtn = document.querySelector(".dropdown-btn");
  const dropdown = document.querySelector(".dropdown");

  if (dropdownBtn && dropdown) {
    // Toggle the dropdown menu when clicking the button
    dropdownBtn.addEventListener("click", () => {
      dropdown.classList.toggle("active");
    });

    // Close the dropdown when clicking outside of it
    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target) && event.target !== dropdownBtn) {
        dropdown.classList.remove("active"); // Close the dropdown
      }
    });

    // Listen for clicks on lesson links inside the dropdown
    const chapterLinks = document.querySelectorAll(".chapter-link");
    chapterLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const lessonNumber = event.target.getAttribute("data-lesson");
        console.log("Lesson clicked:", lessonNumber); // Check if link click is detected
        loadLesson(parseInt(lessonNumber, 10));

        // Close the dropdown after clicking a lesson
        dropdown.classList.remove("active");
      });
    });
  } else {
    console.error("Dropdown button or dropdown container not found.");
  }
}

// Function to enable collapsible sections
function setupCollapsibleSections() {
  document.body.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("collapsible-btn")) {
      event.target.classList.toggle("active");

      const content = event.target.nextElementSibling;

      // Toggle the max-height for smooth collapse/expand
      if (content.style.maxHeight) {
        content.style.maxHeight = null; // Collapse the content
      } else {
        content.style.maxHeight = content.scrollHeight + "px"; // Expand the content
      }
    }
  });
}

function initEvents() {
  const numberOfLessons = 8; // Define the number of lessons
  const chapters = []; // Array to hold chapter data

  // Fetch chapter titles dynamically
  const chapterPromises = [];
  for (let i = 1; i <= numberOfLessons; i++) {
    chapterPromises.push(
      fetch(`./data/lesson_${i}.json`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to load chapter ${i}: ${response.statusText}`
            );
          }
          return response.json();
        })
        .then((lessons) => {
          if (lessons.length > 0) {
            chapters.push({ title: lessons[0].title }); // Correct indexing for title
          }
        })
        .catch((error) => console.error("Error loading chapters:", error))
    );
  }

  // Wait for all chapters to be loaded before creating the structure
  Promise.all(chapterPromises).then(() => {
    createStructure(chapters);
    renderDivs();

    setupDropdown();
    setupCollapsibleSections();
  });
  // console.log("initEvents called");
}
initEvents();
