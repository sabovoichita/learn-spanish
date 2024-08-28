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

function showLesson(lessonNumber, lessons) {
  const spaceRender = document.getElementById(`l${lessonNumber}`);
  if (!spaceRender) {
    console.error(`Lesson #l${lessonNumber} not found.`);
    return;
  }

  const text = lessons
    .map(
      ({
        chapter,
        title,
        wordS,
        wordE,
        lessonContent,
        wordSingular,
        wordPlural,
        subChapter1,
        subChapter2,
        subSub1Chapter2,
        subSub2Chapter2,
        subChapter2WordsS,
        subChapter2WordsE,
        subChapter2WordsExamples,
        subSub2Chapter2WordsS,
        subSub2Chapter2WordsE,
        subSub2Chapter2WordSingular,
        subSub2Chapter2WordPlural,
      }) => `
    <section id="sectionArea">
      <h2 class="h2Design">Chapter: ${chapter}. ${title}</h2>
      <div class="displayLesson">
      <h3 class="subChapter">${subChapter1} </h3>
        <div class="lessonContent">
          ${lessonContent
            .map((item) => `<p class="notes">${item} </p>`)
            .join("")}
        </div>
        <div class="wordMapping">
        <p class="type">Spanish => English</p>
          ${wordS
            .map(
              (item, index) =>
                `<p class="words">${item} <span class="black"> => </span> <span class="wordEnglish">${wordE[index]}</span></p>`
            )
            .join("")}
            <p class="type">Singular => Plural</p>
            ${wordSingular
              .map(
                (item, index) =>
                  `<p class="words">${item} <span class="black"> => </span> <span class="wordEnglish">${wordPlural[index]}</span></p>`
              )
              .join("")}
            <h3 class="subChapter">${subChapter2} </h3>
            <h4 class="subChapter">${subSub1Chapter2} </h4>

            ${subChapter2WordsS
              .map(
                (item, index) =>
                  `<p class="words">${item} <span class="black"> => </span> <span class="wordEnglish">${subChapter2WordsE[index]}</span></p>`
              )
              .join("")}
              ${subChapter2WordsExamples
                .map((item) => `<p class="words">${item} </p>`)
                .join("")}
            <h4 class="subChapter">${subSub2Chapter2} </h4>
            ${subSub2Chapter2WordsS
              .map(
                (item, index) =>
                  `<p class="words">${item} <span class="black"> => </span> <span class="wordEnglish">${subSub2Chapter2WordsE[index]}</span></p>`
              )
              .join("")}
              <p class="type">Singular => Plural</p>
              ${subSub2Chapter2WordSingular
                .map(
                  (item, index) =>
                    `<p class="words">${item} <span class="black"> => </span> <span class="wordEnglish">${subSub2Chapter2WordPlural[index]}</span></p>`
                )
                .join("")}
        </div>
      </div>
    </section>
  `
    )
    .join("");

  spaceRender.innerHTML = text;
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

  const numberOfLessons = 2;
  renderDivs(numberOfLessons);

  // Load all lessons and insert chapters as needed
  for (let i = 1; i <= numberOfLessons; i++) {
    loadLesson(i);
  }
}
initEvents();
