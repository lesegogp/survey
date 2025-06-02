const surveySection = document.getElementById('surveySection');
const resultsSection = document.getElementById('resultsSection');
const showFormBtn = document.getElementById('showFormBtn');
const showResultsBtn = document.getElementById('showResultsBtn');

surveySection.classList.remove("hidden");
resultsSection.classList.add("hidden");

showFormBtn.addEventListener('click', () => {
  resultsSection.classList.add("hidden");
  surveySection.classList.remove("hidden");
  surveySection.classList.add("animate__fadeIn");
});

showResultsBtn.addEventListener('click', () => {
  surveySection.classList.add("hidden");
  resultsSection.classList.remove("hidden");
  resultsSection.classList.add("animate__slideInUp");
  renderResults();
});

const form = document.getElementById('surveyForm');
const message = document.getElementById('message');
let surveys = JSON.parse(localStorage.getItem("surveys")) || [];

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const age = parseInt(document.getElementById('age').value);
  const date = document.getElementById('date').value;
  const foodChoices = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
  const eatOutRating = document.querySelector('input[name="eatout"]:checked');
  const q1 = document.querySelector('input[name="q1"]:checked');
  const q2 = document.querySelector('input[name="q2"]:checked');
  const q3 = document.querySelector('input[name="q3"]:checked');
  const q4 = document.querySelector('input[name="q4"]:checked');
  const q5 = document.querySelector('input[name="q5"]:checked');

  if (!name || isNaN(age) || age < 5 || age > 120 || !date || foodChoices.length === 0 ||
      !eatOutRating || !q1 || !q2 || !q3 || !q4 || !q5) {
    message.style.color = 'red';
    message.innerText = "Please complete all fields including all rating questions.";
    return;
  }

  const survey = {
    name,
    age,
    date,
    favourite_foods: foodChoices,
    eat_out_rating: parseInt(eatOutRating.value),
    lifestyle_ratings: {
      q1: parseInt(q1.value),
      q2: parseInt(q2.value),
      q3: parseInt(q3.value),
      q4: parseInt(q4.value),
      q5: parseInt(q5.value)
    }
  };

  surveys.push(survey);
  localStorage.setItem("surveys", JSON.stringify(surveys));

  message.style.color = 'green';
  message.innerText = "Survey submitted successfully!";
  form.reset();
});

function renderResults() {
  const resultsDiv = document.getElementById('results');
  const surveys = JSON.parse(localStorage.getItem("surveys")) || [];

  if (!resultsDiv || surveys.length === 0) {
    resultsDiv.innerHTML = "<p>No Surveys Available.</p>";
    return;
  }

  const total = surveys.length;
  const ages = surveys.map(s => s.age);
  const avgAge = (ages.reduce((a, b) => a + b, 0) / total).toFixed(1);
  const oldest = Math.max(...ages);
  const youngest = Math.min(...ages);
  const pizzaLovers = surveys.filter(s => s.favourite_foods.includes("Pizza")).length;
  const pizzaPercent = ((pizzaLovers / total) * 100).toFixed(1);
  const avgEatOut = (surveys.reduce((sum, s) => sum + s.eat_out_rating, 0) / total).toFixed(1);

  const lifestyleSums = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };
  surveys.forEach(s => {
    if (s.lifestyle_ratings) {
      lifestyleSums.q1 += s.lifestyle_ratings.q1;
      lifestyleSums.q2 += s.lifestyle_ratings.q2;
      lifestyleSums.q3 += s.lifestyle_ratings.q3;
      lifestyleSums.q4 += s.lifestyle_ratings.q4;
      lifestyleSums.q5 += s.lifestyle_ratings.q5;
    }
  });

  const avgQ = key => (lifestyleSums[key] / total).toFixed(1);

  resultsDiv.innerHTML = `
    <p><strong>Total Surveys:</strong> ${total}</p>
    <p><strong>Average Age:</strong> ${avgAge}</p>
    <p><strong>Oldest Age:</strong> ${oldest}</p>
    <p><strong>Youngest Age:</strong> ${youngest}</p>
    <p><strong>Pizza Lovers:</strong> ${pizzaPercent}%</p>
    <p><strong>Average Eat Out Rating:</strong> ${avgEatOut}</p>
    <hr />
    <p><strong>Avg 'Watch Movies':</strong> ${avgQ("q1")}</p>
    <p><strong>Avg 'Outdoor Activities':</strong> ${avgQ("q2")}</p>
    <p><strong>Avg 'Read Books':</strong> ${avgQ("q3")}</p>
    <p><strong>Avg 'Sleep Early':</strong> ${avgQ("q4")}</p>
    <p><strong>Avg 'Healthy Diet':</strong> ${avgQ("q5")}</p>
  `;
}
