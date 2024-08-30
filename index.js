function $(selector) {
  return document.querySelector(selector);
}

function createStructure() {
  $("body").innerHTML = `
  <header>
    <h1>Learn Spanish</h1>
  </header>
  <div id="container"></div>
  `;
}

function renderDivs(lessonNumber) {
  const container = $("#container");
  for (let i = 1; i <= lessonNumber; i++) {
    const lessonDiv = document.createElement("div");
    lessonDiv.id = `l${i}`;
    container.appendChild(lessonDiv);
  }
}

function generateLessonContent(lessons) {
  return lessons
    .map(
      ({
        ch,
        title,
        wS,
        wE,
        lessonContent,
        wSg,
        wSg1,
        wSg2,
        wPl,
        wPl1,
        wPl2,
        subCh1,
        subCh2,
        subSub1Ch2,
        subSub2Ch2,
        lessonContentSubCh2,
        subCh2WsS,
        subCh2WsE,
        subCh2WsExamples,
        subSub2Ch2WsS,
        subSub2Ch2WsE,
        subSub2Ch2WSg,
        subSub2Ch2WPl,
        subSub2Ch2SSp,
        subSub2Ch2SEn,
        subSub2Ch2SSp1,
        subSub2Ch2SEn1,
        subSub2Ch2SSp2,
        subSub2Ch2SEn2,
        subSub2Ch2SSp3,
        subSub2Ch2SEn3,
        subSub2Ch2SSp4,
        subSub2Ch2SEn4,
        subSub2Ch2SSp5,
        subSub2Ch2SEn5,
        exercises,
        lessonEx,
        placeholder,
        ex1,
        ex2,
        ex3,
        ex4,
        ex5,
        culturalBrief,
        bTitle,
        bContent,
        vocabulary,
        vocabularyE,
      }) => `
    <section id="sectionArea">
      <h2 class="h2Design">Chapter: ${ch}. ${title}</h2>
      <div class="displayLesson">
        <h3 class="subCh">${subCh1}</h3>
        <div class="wMapping">
          <p class="notes">${lessonContent[0]}</p>
          ${createWSection("Spanish", "English", wS, wE)}
          <p class="notes">${lessonContent[1]}</p>
          <p class="notes">${lessonContent[2]}</p>
          ${createWSection("", "", wSg, wPl)}
          <p class="notes">${lessonContent[3]}</p>
          ${createWSection("", "", wSg1, wPl1)}
          <p class="notes">${lessonContent[4]}</p>
          ${createWSection("", "", wSg2, wPl2)}
        </div>

        <h3 class="subCh">${subCh2}</h3>
        <p class="notes">${lessonContentSubCh2[0]}</p>
        <h4 class="subCh">${subSub1Ch2}</h4>
        ${createWSection("Form", "", subCh2WsS, subCh2WsE)}
        <p class="notes">${lessonContentSubCh2[1]}</p>
        ${subCh2WsExamples.map((item) => `<p class="ws">${item}</p>`).join("")}
        <h4 class="subCh">${subSub2Ch2}</h4>
        ${createWSection("", "", subSub2Ch2WsS, subSub2Ch2WsE)}
        <p class="notes">${lessonContentSubCh2[2]}</p>
        ${createWSection("Singular", "Plural", subSub2Ch2WSg, subSub2Ch2WPl)}
        <p class="notes">${lessonContentSubCh2[3]}</p>
        ${createWSection("Spanish", "English", subSub2Ch2SSp, subSub2Ch2SEn)}
        <p class="notes">${lessonContentSubCh2[4]}</p>
        ${createWSection("Spanish", "English", subSub2Ch2SSp1, subSub2Ch2SEn1)}
        <p class="notes">${lessonContentSubCh2[5]}</p>
        ${createWSection("Spanish", "English", subSub2Ch2SSp2, subSub2Ch2SEn2)}
        <p class="notes">${lessonContentSubCh2[6]}</p>
        ${createWSection("Spanish", "English", subSub2Ch2SSp3, subSub2Ch2SEn3)}
        <p class="notes">${lessonContentSubCh2[7]}</p>
        ${createWSection("Spanish", "English", subSub2Ch2SSp4, subSub2Ch2SEn4)}
        <p class="notes">${lessonContentSubCh2[8]}</p>
        ${createWSection("Spanish", "English", subSub2Ch2SSp5, subSub2Ch2SEn5)}

      </div>
    </section>
    <section class="exerciseArea">
      <h3 class="subCh">${exercises}</h3>
      <div>
        <p class="notes">${lessonEx[0]}</p>
        ${createExSection("ex1", placeholder, ex1)}
        <p class="notes">${lessonEx[1]}</p>
        ${createExSection("ex2", placeholder, ex2)}
        <p class="notes">${lessonEx[2]}</p>
        ${createExSection("ex3", placeholder, ex3)}
        <p class="notes">${lessonEx[3]}</p>
        ${createExSection1("ex4", placeholder, ex4)}
        <p class="notes">${lessonEx[4]}</p>
        ${createExSection1("ex5", placeholder, ex5)}

      </div>
    </section>

    <section class="culturalBrief">
    <h3 class="subCh">${culturalBrief}</h3>
    <h4 class="subCh">${bTitle[0]}</h4>
    <div>${bContent.map((a) => `<p  class="cultural">${a}</p>`).join("")}</div>
    </hr>
    <h4 class="subCh">${bTitle[1]}</h4>
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
  
    </section>
  `
    )
    .join("");
}

function createWSection(label1, label2, ws1, ws2) {
  return (
    `<p class="type">${label1} => ${label2}</p>` +
    (ws1 || [])
      .map(
        (item, index) =>
          `<p class="ws">${item} <span class="black"> => </span> <span class="wEnglish">${
            (ws2 || [])[index] || ""
          }</span></p>`
      )
      .join("")
  );
}

function createExSection(exIdPrefix, placeholder, ex) {
  return `
    <div class="ex-section">
      ${ex
        .map(
          (example, index) =>
            `<div>
          ${index + 1})  
          <input class="exerciseInput" id="${exIdPrefix}-${index}" placeholder="${placeholder}" />
          <span class="ws"> ${example} </span>
        </div>`
        )
        .join("\n")}
         </br>
      <button onclick="verifyAnswers('${exIdPrefix}')">Check Answers</button>
    </div>
  `;
}

function createExSection1(exIdPrefix, placeholder, ex) {
  return `
    <div class="ex-section">
      ${ex
        .map(
          (example, index) =>
            `<span style="display: inline; margin-right: 10px;text-align: justify;">
              <span class="ws" style="display: inline;">${example}</span> ${
              index + 1
            })
              <input class="exerciseInput" style="display: inline-block; margin-left: 5px;" id="${exIdPrefix}-${index}" placeholder="${placeholder}" />

            </span>`
        )
        .join("")}
        </br>
      <button style="display: inline-block; margin-left: 10px;" onclick="verifyAnswers('${exIdPrefix}')">Check Answers</button>
    </div>
  `;
}

function verifyAnswers(exIdPrefix) {
  const answersMap = {
    ex1: ex1A,
    ex2: ex2A,
    ex3: ex3A,
    ex4: ex4A,
    ex5: ex5A,
  };
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

function showLesson(lessonNumber, lessons) {
  const lessonDiv = $(`#l${lessonNumber}`);
  if (!lessonDiv) {
    console.error(`Lesson #l${lessonNumber} not found.`);
    return;
  }
  lessonDiv.innerHTML = generateLessonContent(lessons);
}

function loadLesson(lessonNumber) {
  fetch(`./data/${lessonNumber}.json`)
    .then((response) => response.json())
    .then((lessons) => {
      ex1A = lessons[0].ex1A || [];
      ex2A = lessons[0].ex2A || [];
      ex3A = lessons[0].ex3A || [];
      ex4A = lessons[0].ex4A || [];
      ex5A = lessons[0].ex5A || [];
      showLesson(lessonNumber, lessons);
    })
    .catch((error) => console.error("Error loading lesson:", error));
}

function initEvents() {
  createStructure();
  const numberOfLessons = 1;
  renderDivs(numberOfLessons);
  for (let i = 1; i <= numberOfLessons; i++) {
    loadLesson(i);
  }
}

initEvents();
