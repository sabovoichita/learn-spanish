function $(selector) {
  return document.querySelector(selector);
}

function createStructure() {
  $("body").innerHTML = `
  <header>
    <h1>Learn Spanish<h1>
  </header>
    </br>
  <div id ="container"></div>
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
  // const spaceRender = document.getElementById(`l${lessonNumber}`);
  // if (!spaceRender) {
  //   console.error(`Lesson #l${lessonNumber} not found.`);
  //   return;
  // }

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
      }) => `
    <section id="sectionArea">
      <h2 class="h2Design">Chapter: ${ch}. ${title}</h2>
      <div class="displayLesson">
      <h3 class="subCh">${subCh1} </h3>
        <div class="wMapping">
          <p class="notes">${lessonContent[0]} </p>
            ${createWSection("Spanish", "English", wS, wE)}
          <p class="notes">${lessonContent[1]} </p>
          <p class="notes">${lessonContent[2]} </p>
            ${createWSection("", "", wSg, wPl)}
          <p class="notes">${lessonContent[3]} </p>
            ${createWSection("", "", wSg1, wPl1)}
          <p class="notes">${lessonContent[4]} </p>
            ${createWSection("", "", wSg2, wPl2)}
        </div>

        <h3 class="subCh">${subCh2} </h3>
         <p class="notes">${lessonContentSubCh2[0]} </p>
        <h4 class="subCh">${subSub1Ch2} </h4>
          ${createWSection("Form", "", subCh2WsS, subCh2WsE)}
         <p class="notes">${lessonContentSubCh2[1]} </p>
          ${subCh2WsExamples
            .map((item) => `<p class="ws">${item} </p>`)
            .join("")}
        <h4 class="subCh">${subSub2Ch2} </h4>
        ${createWSection("", "", subSub2Ch2WsS, subSub2Ch2WsE)}
        <p class="notes">${lessonContentSubCh2[2]} </p>
        ${createWSection("Singular", "Plural", subSub2Ch2WSg, subSub2Ch2WPl)}
       <p class="notes">${lessonContentSubCh2[3]} </p>
        ${createWSection("Spanish", "English", subSub2Ch2SSp, subSub2Ch2SEn)}
       <p class="notes">${lessonContentSubCh2[4]} </p>
       ${createWSection("Spanish", "English", subSub2Ch2SSp1, subSub2Ch2SEn1)}
       <p class="notes">${lessonContentSubCh2[5]} </p>
       ${createWSection("Spanish", "English", subSub2Ch2SSp2, subSub2Ch2SEn2)}
       <p class="notes">${lessonContentSubCh2[6]} </p>
       ${createWSection("Spanish", "English", subSub2Ch2SSp3, subSub2Ch2SEn3)}
       <p class="notes">${lessonContentSubCh2[7]} </p>
       ${createWSection("Spanish", "English", subSub2Ch2SSp4, subSub2Ch2SEn4)}
       <p class="notes">${lessonContentSubCh2[8]} </p>
       ${createWSection("Spanish", "English", subSub2Ch2SSp5, subSub2Ch2SEn5)}
        </div>
      <h3 class="subCh">${exercises} </h3>
      </div>
    </section>
  `
    )
    .join("");

  // spaceRender.innerHTML = text;
}

function createWSection(label1, label2, ws1, ws2) {
  return (
    `<p class="type">${label1} => ${label2}</p>` +
    ws1
      .map(
        (item, index) =>
          `<p class="ws">${item} <span class="black"> => </span> <span class="wEnglish">${ws2[index]}</span></p>`
      )
      .join("")
  );
}

// Function to display a lesson's content
function showLesson(lessonNumber, lessons) {
  const lessonDiv = $(`#l${lessonNumber}`);
  if (!lessonDiv) {
    console.error(`Lesson #l${lessonNumber} not found.`);
    return;
  }
  lessonDiv.innerHTML = generateLessonContent(lessons);
}

function loadLesson(lessonNumber) {
  fetch(`./data/${lessonNumber}.json`).then((r) => {
    r.json().then((lesson) => {
      // console.log(lesson);
      showLesson(lessonNumber, lesson);
    });
  });
}

function initEvents() {
  createStructure();

  const numberOfLessons = 1;
  renderDivs(numberOfLessons);

  // Load all lessons and insert Chs as needed
  for (let i = 1; i <= numberOfLessons; i++) {
    loadLesson(i);
  }
}
initEvents();
