function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if(email && password){
    alert('Login Successful!');
    showDashboard('User');
  } else {
    alert('Please enter email and password.');
  }
}

function createAccount() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  if(name && email && password){
    alert('Account Created Successfully!');
    showSignIn();
  } else { alert('Please fill all fields.'); }
}

function logout() {
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('mainPage').style.display = 'none';
  document.getElementById('userInfo').innerText = '';
}

function showSignIn() {
  document.getElementById("signinForm").style.display = "block";
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("signinBtn").classList.add("active");
  document.getElementById("signupBtn").classList.remove("active");
}
function showSignUp() {
  document.getElementById("signinForm").style.display = "none";
  document.getElementById("signupForm").style.display = "block";
  document.getElementById("signinBtn").classList.remove("active");
  document.getElementById("signupBtn").classList.add("active");
}

// ---------------- GOOGLE LOGIN ----------------
function handleCredentialResponse(response) {
  console.log("JWT token: ", response.credential);
  // Decode JWT for user info if needed
  showDashboard("Google User");
}

function showDashboard(username){
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('mainPage').style.display = 'block';
  document.getElementById('userInfo').innerText = 👤 ${username};
}

// ---------------- RECIPE APP ----------------
function searchRecipe() {
  const query = document.getElementById("searchInput").value.trim();
  const results = document.getElementById("results");
  if(!query){ results.innerHTML="<p>Please enter a recipe name.</p>"; return; }
  fetchRecipes(https://www.themealdb.com/api/json/v1/1/search.php?s=${query});
}

function loadCategory(category){
  fetchRecipes(https://www.themealdb.com/api/json/v1/1/filter.php?c=${category});
}

function loadCuisine(area){
  fetchRecipes(https://www.themealdb.com/api/json/v1/1/filter.php?a=${area});
}

function fetchRecipes(url){
  const results = document.getElementById("results");
  results.innerHTML="<p>Loading recipes...</p>";
  fetch(url)
  .then(res=>res.json())
  .then(data=>{
    results.innerHTML="";
    if(data.meals){
      data.meals.forEach(meal=>{
        const card=document.createElement("div");
        card.classList.add("card");
        card.innerHTML=<h3>${meal.strMeal}</h3><img src="${meal.strMealThumb}" alt="${meal.strMeal}"><button onclick="viewRecipe('${meal.idMeal}')">View Recipe</button>;
        results.appendChild(card);
      });
    } else { results.innerHTML="<p>No recipes found.</p>"; }
  }).catch(()=>{ results.innerHTML="<p>Error loading recipes.</p>"; });
}

function viewRecipe(id){
  fetch(https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id})
  .then(res=>res.json())
  .then(data=>{
    if(!data.meals) return;
    const meal=data.meals[0];
    let ingredients="";
    for(let i=1;i<=20;i++){
      const ing=meal[strIngredient${i}];
      const measure=meal[strMeasure${i}];
      if(ing && ing.trim()!==""){ ingredients+=<li>${ing} - ${measure}</li>; }
    }
    const modal=document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML=<div class="modal-content"><span class="close">&times;</span><h2>${meal.strMeal}</h2><img src="${meal.strMealThumb}" alt="${meal.strMeal}"><h3>Category: ${meal.strCategory}</h3><h3>Cuisine: ${meal.strArea}</h3><p><strong>Instructions:</strong> ${meal.strInstructions}</p><h3>Ingredients:</h3><ul>${ingredients}</ul>${meal.strYoutube?<p><a href="${meal.strYoutube}" target="_blank">📺 Watch on YouTube</a></p>:""}</div>;
    document.body.appendChild(modal);
    modal.querySelector(".close").addEventListener("click",()=>modal.remove());
    modal.addEventListener("click",e=>{ if(e.target===modal) modal.remove(); });
  }).catch(()=>alert("Error loading recipe details."));
}

// Trigger search on Enter
document.getElementById('searchInput').addEventListener('keypress',function(e){ if(e.key==='Enter') searchRecipe(); });
