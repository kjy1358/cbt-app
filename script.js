let problems = [];
let userAnswers = [];

fetch('problems.json')
  .then(res => res.json())
  .then(data => {
    problems = data;
    renderQuiz();
  });

function renderQuiz() {
  const container = document.getElementById('quiz-container');
  container.innerHTML = '';

  problems.forEach((q, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';

    const title = document.createElement('p');
    title.innerText = `${index + 1}. ${q.question}`;
    questionDiv.appendChild(title);

    q.options.forEach((opt, optIndex) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `q${index}`;
      input.value = optIndex;
      label.appendChild(input);
      label.append(` ${opt}`);
      questionDiv.appendChild(label);
      questionDiv.appendChild(document.createElement('br'));
    });

    container.appendChild(questionDiv);
  });
}

document.getElementById('submit-btn').addEventListener('click', () => {
  let score = 0;
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '<h2>결과</h2>';

  problems.forEach((q, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    const userAns = selected ? parseInt(selected.value) : -1;
    userAnswers.push(userAns);

    const isCorrect = userAns === q.answer;
    if (isCorrect) score++;

    const feedback = document.createElement('div');
    feedback.innerHTML = `
      <p><strong>${index + 1}. ${q.question}</strong></p>
      <p>당신의 답: ${userAns >= 0 ? q.options[userAns] : '선택 안함'}</p>
      <p>정답: ${q.options[q.answer]}</p>
      <p>해설: ${q.explanation}</p>
      <p style="color:${isCorrect ? 'green' : 'red'}">${isCorrect ? '정답입니다!' : '틀렸습니다.'}</p>
      <hr/>
    `;
    resultDiv.appendChild(feedback);
  });

  resultDiv.innerHTML = `<h2>결과: ${score} / ${problems.length} 점</h2>` + resultDiv.innerHTML;
});
