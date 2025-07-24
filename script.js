let problems = [];
let currentIndex = 0;
let userAnswers = [];

fetch('problems.json')
  .then(res => res.json())
  .then(data => {
    problems = data;
    showQuestion();
  });

const container = document.getElementById('quiz-container');
const submitBtn = document.getElementById('submit-btn');
const resultDiv = document.getElementById('result');

function showQuestion() {
  resultDiv.innerHTML = '';
  container.innerHTML = '';

  const q = problems[currentIndex];

  const questionDiv = document.createElement('div');
  questionDiv.className = 'question';

  const title = document.createElement('p');
  title.innerText = `${currentIndex + 1}. ${q.question}`;
  questionDiv.appendChild(title);

  q.options.forEach((opt, optIndex) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'answer';
    input.value = optIndex;
    label.appendChild(input);
    label.append(` ${opt}`);
    questionDiv.appendChild(label);
    questionDiv.appendChild(document.createElement('br'));
  });

  container.appendChild(questionDiv);

  submitBtn.innerText = '제출하기';
  submitBtn.disabled = false;
}

submitBtn.addEventListener('click', () => {
  if (submitBtn.innerText === '제출하기') {
    // 답 체크 후 정답/해설 보여주기 or 그냥 넘어가기
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) {
      alert('답을 선택해주세요.');
      return;
    }

    const userAns = parseInt(selected.value);
    userAnswers[currentIndex] = userAns;

    const q = problems[currentIndex];
    const isCorrect = userAns === q.answer;

    // 정답 및 해설 보여주기
    resultDiv.innerHTML = `
      <p>당신의 답: ${q.options[userAns]}</p>
      <p>정답: ${q.options[q.answer]}</p>
      <p>해설: ${q.explanation}</p>
      <p style="color:${isCorrect ? 'green' : 'red'}">${isCorrect ? '정답입니다!' : '틀렸습니다.'}</p>
    `;

    submitBtn.innerText = currentIndex === problems.length - 1 ? '점수 보기' : '다음 문제';
  } else if (submitBtn.innerText === '다음 문제') {
    // 다음 문제로 이동
    currentIndex++;
    showQuestion();
  } else if (submitBtn.innerText === '점수 보기') {
    // 최종 점수 보여주기
    showScore();
  }
});

function showScore() {
  container.innerHTML = '';
  resultDiv.innerHTML = '';
  submitBtn.style.display = 'none';

  let score = 0;
  problems.forEach((q, idx) => {
    if (userAnswers[idx] === q.answer) score++;
  });

  resultDiv.innerHTML = `<h2>최종 점수: ${score} / ${problems.length}</h2>`;
}
