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
    <section id="sectionArea">
      <h2 class="h2Design">Chapter: ${lesson.ch}. ${lesson.title}</h2>
      ${generateLessonSections(lesson)}
    </section>
    <section class="exerciseArea">
      <h3 class="subCh">${lesson.exercises}</h3>
      ${generateExercises(lesson)}
    </section>
    <section class="culturalBrief">
      ${generateCulturalBrief(lesson)}
    </section>
  `
    )
    .join("");
}

// Generate sections of the lesson
function generateLessonSections(lesson) {
  return `
    <div class="displayLesson">
      ${generateSubChapter(
        lesson.subCh1,
        lesson.lessonContent,
        lesson.wS,
        lesson.wE,
        [lesson.wSg, lesson.wPl],
        [lesson.wSg1, lesson.wPl1],
        [lesson.wSg2, lesson.wPl2]
      )}
      ${generateSubChapter(
        lesson.subCh2,
        lesson.lessonContentSubCh2,
        lesson.subCh2WsS,
        lesson.subCh2WsE,
        [lesson.subSub2Ch2WSg, lesson.subSub2Ch2WPl]
      )}
    </div>
  `;
}

// Generate individual subchapters
function generateSubChapter(title, content, ws1, ws2, ...sections) {
  return `
    <h3 class="subCh">${title}</h3>
    ${content
      .map(
        (text, index) => `
      <p class="notes">${text}</p>
      ${
        sections[index]
          ? createWSection("", "", sections[index][0], sections[index][1])
          : ""
      }
    `
      )
      .join("")}
    ${createWSection("Spanish", "English", ws1, ws2)}
  `;
}

// Generate exercise sections
function generateExercises(lesson) {
  return lesson.lessonEx
    .map(
      (text, index) => `
    <p class="notes">${text}</p>
    ${createExSection(
      `ex${index + 1}`,
      lesson.placeholder,
      lesson[`ex${index + 1}`]
    )}
  `
    )
    .join("");
}

// Create exercise sections
function createExSection(exIdPrefix, placeholder, ex) {
  return `
    <div class="ex-section">
      ${ex
        .map(
          (example, index) => `
        <span style="display: inline; margin-right: 10px;text-align: justify;">
          <span class="ws" style="display: inline;">${example}</span> ${
            index + 1
          })
          <input class="exerciseInput" style="display: inline-block; margin-left: 5px;" id="${exIdPrefix}-${index}" placeholder="${placeholder}" />
        </span>
      `
        )
        .join("")}
      <br>
      <button style="display: inline-block; margin-left: 10px;" onclick="verifyAnswers('${exIdPrefix}')">Check Answers</button>
    </div>
  `;
}

// Generate cultural brief section
function generateCulturalBrief(lesson) {
  return lesson.bTitle
    .map(
      (title, index) => `
    <h4 class="subCh">${title}</h4>
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
  return ws1
    ? `
    <p class="type">${label1} => ${label2}</p>
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

// Verify answers
function verifyAnswers(exIdPrefix) {
  const answersMap = { ex1: ex1A, ex2: ex2A, ex3: ex3A, ex4: ex4A, ex5: ex5A };
  const exerciseAnswers = answersMap[exIdPrefix] || [];

  exerciseAnswers.forEach((correctAnswer, index) => {
    const inputElement = document.getElementById(`${exIdPrefix}-${index}`);
    if (inputElement) {
      const userAnswer = inputElement.value.trim();
      inputElement.style.background =
        userAnswer.toLowerCase() === correctAnswer.toLowerCase()
          ? "green"
          : "red";
      inputElement.style.color = "white";
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

// Load the lesson data
function loadLesson(lessonNumber) {
  fetch(`./data/${lessonNumber}.json`)
    .then((response) => response.json())
    .then((lessons) => {
      [ex1A, ex2A, ex3A, ex4A, ex5A] = [
        lessons[0].ex1A,
        lessons[0].ex2A,
        lessons[0].ex3A,
        lessons[0].ex4A,
        lessons[0].ex5A,
      ].map((arr) => arr || []);
      showLesson(lessonNumber, lessons);
    })
    .catch((error) => console.error("Error loading lesson:", error));
}

// Initialize events and load lessons
function initEvents() {
  createStructure();
  const numberOfLessons = 1;
  renderDivs(numberOfLessons);
  for (let i = 1; i <= numberOfLessons; i++) {
    loadLesson(i);
  }
}

initEvents();
