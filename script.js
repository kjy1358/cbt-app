let problems = [];
let currentIndex = 0;
let userAnswers = [];

fetch('problems.json')
  .then(res => res.json())
  .then(data => {
    problems = data;
    showQuestion();
  });

function showQuestion() {
  const container = document.getElementById('quiz-container');
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

  const nextBtn = document.getElementById('submit-btn');
  nextBtn.innerText = currentIndex === problems.length - 1 ? '결과 보기' : '다음 문제';
}

document.getElementById('submit-btn').addEventListener('click', () => {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) {
    alert('답을 선택해주세요.');
    return;
  }

  userAnswers[currentIndex] = parseInt(selected.value);

  if (currentIndex < problems.length - 1) {
    currentIndex++;
    showQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  const container = document.getElementById('quiz-container');
  const resultDiv = document.getElementById('result');
  const btn = document.getElementById('submit-btn');
  
  container.innerHTML = '';
  btn.style.display = 'none';
  resultDiv.innerHTML = '';

  let score = 0;

  problems.forEach((q, index) => {
    const userAns = userAnswers[index];
    const isCorrect = userAns === q.answer;
    if (isCorrect) score++;

    const result = document.createElement('div');
    result.innerHTML = `
      <p><strong>${index + 1}. ${q.question}</strong></p>
      <p>당신의 답: ${userAns >= 0 ? q.options[userAns] : '선택 안함'}</p>
      <p>정답: ${q.options[q.answer]}</p>
      <p>해설: ${q.explanation}</p>
      <p style="color:${isCorrect ? 'green' : 'red'}">${isCorrect ? '정답입니다!' : '틀렸습니다.'}</p>
      <hr/>
    `;
    resultDiv.appendChild(result);
  });

  resultDiv.innerHTML = `<h2>결과: ${score} / ${problems.length} 점</h2>` + resultDiv.innerHTML;
}
