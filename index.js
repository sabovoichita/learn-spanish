// Utility function to select elements
function $(selector) {
  return document.querySelector(selector);
}

// Create basic page structure
function createStructure() {
  $("body").innerHTML = `
    <header>
      <h1>Learn Spanish</h1>
    </header>
    <div id="container"></div>
  `;
}

// Render divs for lessons
function renderDivs(lessonNumber) {
  const container = $("#container");
  for (let i = 1; i <= lessonNumber; i++) {
    const lessonDiv = document.createElement("div");
    lessonDiv.id = `l${i}`;
    container.appendChild(lessonDiv);
  }
}

// Generate lesson content
function generateLessonContent(lessons, lessonNumber) {
  return lessons
    .map(
      (lesson) => `
    <section id="sectionArea" class="displayContent">
      <h2 class="h2Design">Chapter: ${lesson.ch}. ${lesson.title}</h2>
      ${generateLessonSections(lesson)}
    </section>
    <section class="exerciseArea displayContent">
      <h3 class="subchapter">${lesson.exercises}</h3>
      ${generateExercises(
        lesson,
        lessonNumber
      )}  <!-- Passing lessonNumber here -->
    </section>
    <section class="culturalBrief displayContent">
      ${generateCulturalBrief(lesson)}
    </section> 
    <hr>
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
  if (!Array.isArray(ex)) {
    console.error(
      `Expected 'ex' to be an array of exercise items for ${exIdPrefix}.`
    );
    return "";
  }

  const uniqueExIdPrefix = `l${lessonNumber}-${exIdPrefix}`;

  // Check if the answers object has the expected prefix
  const expectedAnswer = answers[exIdPrefix]; // Should work correctly for ex7
  if (!expectedAnswer) {
    console.warn(
      `Expected answers for prefix ${exIdPrefix} not found in answers object.`
    );
  }

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

// Show the selected lesson
function showLesson(lessonNumber, lessons) {
  const lessonDiv = $(`#l${lessonNumber}`);
  if (!lessonDiv) {
    console.error(`Lesson #l${lessonNumber} not found.`);
    return;
  }

  // Ensure that lesson content is generated with all exercises including ex7
  lessonDiv.innerHTML = generateLessonContent(lessons, lessonNumber);
}

let globalLessons = {}; // Use an object for better key-based access

function loadLesson(lessonNumber) {
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

      // Store lessons in the global variable
      globalLessons[lessonNumber] = lessons;

      // Debugging: Log the entire lessons array
      // console.log(`Lesson ${lessonNumber} loaded:`, lessons);

      // Populate answers and validate them
      lessons.forEach((lesson, index) => {
        // Populate the answers
        lesson.answers = {
          ex1: lesson.ex1A || [],
          ex2: lesson.ex2A || [],
          ex3: lesson.ex3A || [],
          ex4: lesson.ex4A || [],
          ex5: lesson.ex5A || [],
          ex6: lesson.ex6A || [],
          ex7: lesson.ex7A || [],
        };

        // Debugging: Log the answers object specifically
        // console.log(
        //   `Lesson ${lessonNumber} - Lesson ${index + 1} answers:`,
        //   lesson.answers
        // );

        // Cross-check the exercise prefixes
        // const expectedPrefixes = Object.keys(lesson.answers); // Expected: ['ex1', 'ex2', ...]
        // console.log(
        //   `Expected prefixes for lesson ${lessonNumber} - Lesson ${index + 1}:`,
        //   expectedPrefixes
        // );
      });

      // Render the lesson content
      showLesson(lessonNumber, lessons);
    })
    .catch((error) => {
      console.error("Error loading lesson:", error.message, error);
    });
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

function initEvents() {
  createStructure();
  const numberOfLessons = 7; // Define the number of lessons
  renderDivs(numberOfLessons); // Render the divs for all lessons

  for (let i = 1; i <= numberOfLessons; i++) {
    loadLesson(i); // Pass lesson number correctly
  }

  validateGlobalLessons(); // Validate after loading

  // Add event listeners for answer check buttons
  document.body.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("check-answers-btn")) {
      const exIdPrefix = event.target.getAttribute("data-prefix");
      console.log(
        `Check Answers button clicked for exercise ID prefix: ${exIdPrefix}`
      );

      // Extract lesson number from the exercise ID prefix
      const lessonNumberMatch = exIdPrefix.match(/^l(\d+)-ex/); // Adjust the regex to match the lesson number
      const lessonNumber = lessonNumberMatch
        ? parseInt(lessonNumberMatch[1], 10)
        : null;

      if (!lessonNumber) {
        console.error(
          `Invalid lesson number extracted from exercise ID prefix: ${exIdPrefix}`
        );
        return;
      }

      // Retrieve the lesson data using the extracted lesson number
      const lessonData = getLessonData(exIdPrefix, lessonNumber);
      if (lessonData) {
        verifyAnswers(exIdPrefix, lessonData.answers);
      } else {
        console.error(`No data found for exercise ID prefix: ${exIdPrefix}`);
      }
    }
  });
}

initEvents();
// ’
// ‘
