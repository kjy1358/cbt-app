// 문제 데이터, 현재 인덱스, 사용자 답안 저장 변수
let problems = [];
let currentIndex = 0;
let userAnswers = [];

// DOM 요소 참조
const container = document.getElementById('quiz-container');
const resultDiv = document.getElementById('result');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const showScoreBtn = document.getElementById('show-score-btn');
const backBtn = document.getElementById('back-to-last-btn');
const retryBtn = document.getElementById('retry-btn');

// 배열 비교 함수 (복수정답 비교용)
function arraysEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

// 배열 셔플 함수 (Fisher-Yates)
function shuffleArray(array) {
  for(let i = array.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 문제 JSON 파일 로딩
fetch('problems.json')
  .then(res => res.json())
  .then(data => {
    problems = shuffleArray(data);  // 문제 배열 셔플
    currentIndex = 0;  // 인덱스 초기화
    userAnswers = [];  // 답안 초기화
    showQuestion();
  })
  .catch(err => {
    container.innerHTML = '<p style="color:red;">문제 파일을 불러올 수 없습니다.</p>';
    console.error(err);
  });

// 문제 출력 함수
function showQuestion() {
  const q = problems[currentIndex]; // 현재 문제
  const isMultiple = Array.isArray(q.answer); // 복수 정답 여부
  const inputType = isMultiple ? 'checkbox' : 'radio';

  // 초기화
  container.innerHTML = '';
  resultDiv.innerHTML = '';

  // 문제 텍스트
  const questionDiv = document.createElement('div');
  questionDiv.className = 'question';
  const title = document.createElement('p');
  title.innerText = `${currentIndex + 1}. ${q.question}`;
  questionDiv.appendChild(title);

  // 선택지 렌더링
  q.options.forEach((opt, idx) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = inputType;
    input.name = 'answer';
    input.value = idx;

    // 이전 선택 복원
    const ua = userAnswers[currentIndex];
    if (!isMultiple && ua === idx) input.checked = true;
    if (isMultiple && Array.isArray(ua) && ua.includes(idx)) input.checked = true;

    // 선택 변경 시 정답 숨기기
    input.addEventListener('change', () => {
      resultDiv.innerHTML = '';
      submitBtn.innerText = '정답확인';
    });

    label.appendChild(input);
    label.append(` ${opt}`);
    questionDiv.appendChild(label);
  });

  container.appendChild(questionDiv);

  // 버튼 상태 설정
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === problems.length - 1;
  submitBtn.style.display = 'inline-block';
  submitBtn.innerText = '정답확인';
  submitBtn.disabled = false;
  showScoreBtn.style.display = 'none';
}

// 제출 버튼 클릭 이벤트
submitBtn.addEventListener('click', () => {
  const q = problems[currentIndex];
  const isMultiple = Array.isArray(q.answer);

  if (submitBtn.innerText === '정답확인') {
    let selected;

    // 사용자 선택값 수집
    if (isMultiple) {
      selected = Array.from(document.querySelectorAll('input[name="answer"]:checked'))
        .map(el => parseInt(el.value));
      if (selected.length === 0) {
        alert('하나 이상 선택하세요.');
        return;
      }
    } else {
      const sel = document.querySelector('input[name="answer"]:checked');
      if (!sel) {
        alert('답을 선택하세요.');
        return;
      }
      selected = parseInt(sel.value);
    }

    userAnswers[currentIndex] = selected; // 답 저장

    // 정답 확인
    const isCorrect = isMultiple
      ? arraysEqual(selected, q.answer)
      : selected === q.answer;

    // 보기 텍스트 출력용
    const userAnsText = isMultiple
      ? selected.map(i => q.options[i]).join(', ')
      : q.options[selected];

    const correctAnsText = isMultiple
      ? q.answer.map(i => q.options[i]).join(', ')
      : q.options[q.answer];

    // 해설/정답 표시
    resultDiv.innerHTML = `
      <p>당신의 답: ${userAnsText}</p>
      <p>정답: ${correctAnsText}</p>
      <p>해설: ${q.explanation}</p>
      <p style="color:${isCorrect ? 'green' : 'red'}">
        ${isCorrect ? '정답입니다!' : '틀렸습니다.'}
      </p>
    `;

    submitBtn.innerText = '숨기기';

    // 마지막 문제인 경우 점수 보기 버튼 활성화
    if (currentIndex === problems.length - 1) {
      showScoreBtn.style.display = 'inline-block';
    }

  } else {
    // 정답 숨기기
    resultDiv.innerHTML = '';
    submitBtn.innerText = '정답확인';
  }
});

// 이전 문제 버튼
prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion();
  }
});

// 다음 문제 버튼
nextBtn.addEventListener('click', () => {
  if (currentIndex < problems.length - 1) {
    currentIndex++;
    showQuestion();
  }
});

// 점수 보기 버튼 클릭
showScoreBtn.addEventListener('click', () => {
  container.innerHTML = '';
  resultDiv.innerHTML = '';
  submitBtn.style.display = 'none';
  prevBtn.style.display = 'none';
  nextBtn.style.display = 'none';
  showScoreBtn.style.display = 'none';

  // 채점
  let score = 0;
  problems.forEach((q, idx) => {
    const ans = userAnswers[idx];
    if (Array.isArray(q.answer)) {
      if (arraysEqual(ans, q.answer)) score++;
    } else {
      if (ans === q.answer) score++;
    }
  });

  // 점수 출력
  resultDiv.innerHTML = `<h2>최종 점수: ${score} / ${problems.length}</h2>`;
  backBtn.style.display = 'inline-block';
  retryBtn.style.display = 'inline-block';
});

// 마지막 문제로 돌아가기
backBtn.addEventListener('click', () => {
  currentIndex = problems.length - 1;
  showQuestion();
  backBtn.style.display = 'none';
  retryBtn.style.display = 'none';
  prevBtn.style.display = 'inline-block';
  nextBtn.style.display = 'inline-block';
  submitBtn.style.display = 'inline-block';
});

// 다시 풀기
retryBtn.addEventListener('click', () => {
  currentIndex = 0;
  userAnswers = [];
  showQuestion();
  backBtn.style.display = 'none';
  retryBtn.style.display = 'none';
  prevBtn.style.display = 'inline-block';
  nextBtn.style.display = 'inline-block';
  submitBtn.style.display = 'inline-block';
});
