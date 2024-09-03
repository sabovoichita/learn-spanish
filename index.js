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
function generateLessonContent(lessons) {
  return lessons
    .map(
      (lesson) => `
    <section id="sectionArea" class="displayContent">
      <h2 class="h2Design">Chapter: ${lesson.ch}. ${lesson.title}</h2>
      ${generateLessonSections(lesson)}
    </section>
    <section class="exerciseArea displayContent">
      <h3 class="subchapter">${lesson.exercises}</h3>
      ${generateExercises(lesson)}
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

// Generate exercise sections, passing the lesson for answers
function generateExercises(lesson) {
  return lesson.lessonEx
    .map(
      (text, index) => `
      <p class="notes">${text}</p>
      ${createExSection(
        `ex${index + 1}`,
        lesson.placeholder,
        lesson[`ex${index + 1}`],
        lesson.answers
      )}
    `
    )
    .join("");
}

function createExSection(exIdPrefix, placeholder, ex, answers) {
  // Create exercise input fields with a common class and unique IDs
  const exerciseHtml = ex
    .map(
      (example, index) => `
      <span style="display: inline; margin-right: 10px; text-align: justify;">
        <span class="ws" style="display: inline;">${example}</span> ${index + 1}
        <input class="exerciseInput" style="display: inline-block; margin-left: 5px;" 
        id="${exIdPrefix}-${index}" placeholder="${placeholder}" />
      </span>
    `
    )
    .join("");

  // Return exercise HTML with a button
  return `
    <div class="ex-section" data-prefix="${exIdPrefix}">
      ${exerciseHtml}
      <br>
      <button class="check-answers-btn" data-prefix="${exIdPrefix}">Check Answers</button>
    </div>
  `;
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
    <p class="text">${label1} => ${label2}</p>
    ${ws1
      .map(
        (item, index) => `
      <p class="ws">${item} <span class="black"> => </span> <span class="wEnglish">${
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

  const exerciseAnswers = answers[exIdPrefix];
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

      console.log(
        `Answer ${index}: User input = "${userAnswer}", Expected = "${expectedAnswer}"`
      );

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
  lessonDiv.innerHTML = generateLessonContent(lessons);
}

let globalLessons = []; // Declare a global variable for lessons

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

      // Store lessons in global variable
      globalLessons[lessonNumber] = lessons;

      // Update lesson objects with answers
      lessons.forEach((lesson, index) => {
        lesson.answers = {
          ex1: lesson.ex1A || [],
          ex2: lesson.ex2A || [],
          ex3: lesson.ex3A || [],
          ex4: lesson.ex4A || [],
          ex5: lesson.ex5A || [],
        };

        // Debugging
        console.log(`Lesson ${index + 1} answers: `, lesson.answers);
      });

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

// Call this function after loading lessons
function initEvents() {
  createStructure();
  const numberOfLessons = 2;
  renderDivs(numberOfLessons);
  for (let i = 1; i <= numberOfLessons; i++) {
    loadLesson(i);
  }
  validateGlobalLessons(); // Validate after loading
}

function getLessonData(exIdPrefix) {
  // Extract lesson number from the exercise ID prefix
  const lessonNumberMatch = exIdPrefix.match(/\d+/);
  if (!lessonNumberMatch) {
    console.error(`Invalid exercise ID prefix: ${exIdPrefix}`);
    return null;
  }
  const lessonNumber = parseInt(lessonNumberMatch[0], 10);

  // Check if lesson data is available for this number
  if (globalLessons[lessonNumber]) {
    const lessons = globalLessons[lessonNumber];
    for (const lesson of lessons) {
      if (lesson.answers && lesson.answers[exIdPrefix]) {
        return lesson;
      }
    }
  }
  return null;
}

// Initialize events and load lessons
function initEvents() {
  createStructure();
  const numberOfLessons = 2;
  renderDivs(numberOfLessons);
  for (let i = 1; i <= numberOfLessons; i++) {
    loadLesson(i);
  }
  validateGlobalLessons(); // Validate after loading
}

// Add event listeners for answer check buttons
document.body.addEventListener("click", function (event) {
  if (event.target && event.target.classList.contains("check-answers-btn")) {
    const exIdPrefix = event.target.getAttribute("data-prefix");
    console.log(
      `Check Answers button clicked for exercise ID prefix: ${exIdPrefix}`
    );

    // Retrieve the lesson data from the button's data-prefix
    const lessonData = getLessonData(exIdPrefix); // Function to retrieve lesson data
    if (lessonData) {
      verifyAnswers(exIdPrefix, lessonData.answers);
    } else {
      console.error(`No data found for exercise ID prefix: ${exIdPrefix}`);
    }
  }
});

initEvents();
