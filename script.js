let problems = [];
let currentIndex = 0;
let userAnswers = [];

const container = document.getElementById('quiz-container');
const resultDiv = document.getElementById('result');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const showScoreBtn = document.getElementById('show-score-btn');
const backBtn = document.getElementById('back-to-last-btn');
const retryBtn = document.getElementById('retry-btn');

fetch('problems.json')
  .then(res => res.json())
  .then(data => {
    problems = data;
    showQuestion();
  });

// 문제 화면 표시 함수
function showQuestion() {
  container.innerHTML = '';
  resultDiv.innerHTML = '';

  const q = problems[currentIndex];
  const questionDiv = document.createElement('div');
  questionDiv.className = 'question';

  const title = document.createElement('p');
  title.innerText = `${currentIndex + 1}. ${q.question}`;
  questionDiv.appendChild(title);

  q.options.forEach((opt, idx) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'answer';
    input.value = idx;

    // 답 변경 시 정답/해설 숨기고 제출 버튼 초기화
    input.addEventListener('change', () => {
      resultDiv.innerHTML = '';
      submitBtn.innerText = '제출하기';
      submitBtn.disabled = false;
    });

    if (userAnswers[currentIndex] === idx) {
      input.checked = true;
    }

    label.appendChild(input);
    label.append(` ${opt}`);
    questionDiv.appendChild(label);
    questionDiv.appendChild(document.createElement('br'));
  });

  container.appendChild(questionDiv);

  // 버튼 상태 업데이트
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === problems.length - 1;
  submitBtn.style.display = 'inline-block';
  submitBtn.innerText = '제출하기';
  submitBtn.disabled = false;
  showScoreBtn.style.display = 'none';
}

// 제출 버튼 이벤트
submitBtn.addEventListener('click', () => {
  if (submitBtn.innerText === '제출하기') {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) {
      alert('답을 선택해주세요.');
      return;
    }
    const userAns = parseInt(selected.value);
    userAnswers[currentIndex] = userAns;

    const q = problems[currentIndex];
    const isCorrect = userAns === q.answer;

    resultDiv.innerHTML = `
      <p>당신의 답: ${q.options[userAns]}</p>
      <p>정답: ${q.options[q.answer]}</p>
      <p>해설: ${q.explanation}</p>
      <p style="color:${isCorrect ? 'green' : 'red'}">${isCorrect ? '정답입니다!' : '틀렸습니다.'}</p>
    `;

    submitBtn.innerText = '숨기기';

    // 마지막 문제면 다음버튼 비활성화, 점수 보기 버튼 활성화
    if (currentIndex === problems.length - 1) {
      nextBtn.disabled = true;
      showScoreBtn.style.display = 'inline-block';
    }
  } else if (submitBtn.innerText === '숨기기') {
    resultDiv.innerHTML = '';
    submitBtn.innerText = '제출하기';
  }
});

// 이전 버튼 이벤트
prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion();
  }
});

// 다음 버튼 이벤트
nextBtn.addEventListener('click', () => {
  if (currentIndex < problems.length - 1) {
    currentIndex++;
    showQuestion();
  }
});

// 점수 보기 버튼 이벤트
showScoreBtn.addEventListener('click', () => {
  container.innerHTML = '';
  resultDiv.innerHTML = '';

  submitBtn.style.display = 'none';
  prevBtn.style.display = 'none';
  nextBtn.style.display = 'none';
  showScoreBtn.style.display = 'none';

  let score = 0;
  problems.forEach((q, idx) => {
    if (userAnswers[idx] === q.answer) score++;
  });

  resultDiv.innerHTML = `<h2>최종 점수: ${score} / ${problems.length}</h2>`;
});

// 점수 보기 버튼 클릭 시
showScoreBtn.addEventListener('click', () => {
  container.innerHTML = '';
  resultDiv.innerHTML = '';

  submitBtn.style.display = 'none';
  prevBtn.style.display = 'none';
  nextBtn.style.display = 'none';
  showScoreBtn.style.display = 'none';

  let score = 0;
  problems.forEach((q, idx) => {
    if (userAnswers[idx] === q.answer) score++;
  });

  resultDiv.innerHTML = `<h2>최종 점수: ${score} / ${problems.length}</h2>`;

  // 👇 새로운 버튼 보이기
  backBtn.style.display = 'inline-block';
  retryBtn.style.display = 'inline-block';
});

// 🔙 마지막 문제로 돌아가기
backBtn.addEventListener('click', () => {
  currentIndex = problems.length - 1;
  showQuestion();

  // 다시 버튼 숨기고 기존 버튼 복원
  backBtn.style.display = 'none';
  retryBtn.style.display = 'none';
  prevBtn.style.display = 'inline-block';
  nextBtn.style.display = 'inline-block';
  submitBtn.style.display = 'inline-block';
});

// 🔁 다시 풀기
retryBtn.addEventListener('click', () => {
  currentIndex = 0;
  userAnswers = [];
  showQuestion();

  // 버튼 초기화
  backBtn.style.display = 'none';
  retryBtn.style.display = 'none';
  prevBtn.style.display = 'inline-block';
  nextBtn.style.display = 'inline-block';
  submitBtn.style.display = 'inline-block';
});

// 초기 화면 표시
showQuestion();
