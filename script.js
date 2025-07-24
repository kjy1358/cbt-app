let problems = [];
let currentIndex = 0;
let userAnswers = [];

const container = document.getElementById('quiz-container');
const submitBtn = document.getElementById('submit-btn');
const prevBtn = document.getElementById('prev-btn');
const resultDiv = document.getElementById('result');

fetch('problems.json')
  .then(res => res.json())
  .then(data => {
    problems = data;
    showQuestion();
  });

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

    input.addEventListener('change', () => {
      resultDiv.innerHTML = '';
      submitBtn.innerText = '제출하기';
      submitBtn.disabled = false;
    });

    if (userAnswers[currentIndex] === optIndex) {
      input.checked = true;
    }

    label.appendChild(input);
    label.append(` ${opt}`);
    questionDiv.appendChild(label);
    questionDiv.appendChild(document.createElement('br'));
  });

  container.appendChild(questionDiv);

  submitBtn.innerText = '제출하기';
  submitBtn.disabled = false;
  submitBtn.style.display = 'inline-block';

  // 이전 버튼 활성화/비활성화
  prevBtn.disabled = currentIndex === 0;

  // 결과와 버튼 초기화
  resultDiv.innerHTML = '';
}

// 제출 / 숨기기 / 점수 보기 버튼 이벤트
submitBtn.addEventListener('click', () => {
  const q = problems[currentIndex];

  if (submitBtn.innerText === '제출하기') {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) {
      alert('답을 선택해주세요.');
      return;
    }

    const userAns = parseInt(selected.value);
    userAnswers[currentIndex] = userAns;

    const isCorrect = userAns === q.answer;

    resultDiv.innerHTML = `
      <p>당신의 답: ${q.options[userAns]}</p>
      <p>정답: ${q.options[q.answer]}</p>
      <p>해설: ${q.explanation}</p>
      <p style="color:${isCorrect ? 'green' : 'red'}">${isCorrect ? '정답입니다!' : '틀렸습니다.'}</p>
    `;

    submitBtn.innerText = currentIndex === problems.length - 1 ? '점수 보기' : '숨기기';
  } else if (submitBtn.innerText === '숨기기') {
    resultDiv.innerHTML = '';
    submitBtn.innerText = '제출하기';
  } else if (submitBtn.innerText === '점수 보기') {
    showScore();
  }
});

// 이전 문제 버튼 이벤트
prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion();
  }
});

function showScore() {
  container.innerHTML = '';
  resultDiv.innerHTML = '';
  submitBtn.style.display = 'none';
  prevBtn.style.display = 'none';

  let score = 0;
  problems.forEach((q, idx) => {
    if (userAnswers[idx] === q.answer) score++;
  });

  resultDiv.innerHTML = `<h2>최종 점수: ${score} / ${problems.length}</h2>`;
}
