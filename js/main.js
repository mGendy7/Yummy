let data;
// Active list and section
let lis = document.querySelectorAll("#nav-list li");
let lisArr = Array.from(lis);
let sections = document.querySelectorAll("section");
let sectionsArr = Array.from(sections);
console.log(sectionsArr);

sectionsArr.forEach((section) => {
  section.style.display = "none";
});

$("#categories").css("display", "block");

lisArr.forEach((e) => {
  e.addEventListener("click", function (e) {
    lisArr.forEach((e) => {
      e.classList.remove("active");
    });
    e.currentTarget.classList.add("active");
    sectionsArr.forEach((section) => {
      section.style.display = "none";
      fetchMainMeals();
      getAreas();
      getMeals();
    });

    document.querySelector(e.currentTarget.dataset.set).style.display = "block";
  });
});

$("#loading").hide();

// sidebar control

function toggleSidebar() {
  if ($("nav").hasClass("open")) {
    $("nav").removeClass("open");
    $("nav").addClass("close");
    $("#nav-list").css("transform", "translateX(-220px)");
    $("#openSidebar").removeClass("fa-solid fa-xmark fa-2x");
    $("#openSidebar").addClass("fa-solid fa-bars fa-2x");
  } else {
    $("nav").removeClass("close");
    $("nav").addClass("open");
    $("#nav-list").css("transform", "translateX(0)");
    $("#openSidebar").removeClass("fa-solid fa-bars fa-2x");
    $("#openSidebar").addClass("fa-solid fa-xmark fa-2x");
  }
}

$(".toggle-btn").on("click", toggleSidebar);

document.addEventListener("click", function (e) {
  var nav = document.querySelector("nav");
  if (!nav.contains(e.target) && nav.classList.contains("open")) {
    toggleSidebar();
  }
});

//intiating category (main section)
fetchMainMeals();

//fetching all categories
async function fetchMainMeals() {
  $("#loading").show();
  let req = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  let res = await req.json();
  data = res.categories;
  $("#loading").hide();

  displayCategories();
}

//displaying all categories
function displayCategories() {
  let cartona = ``;
  for (let i = 0; i < data.length; i++) {
    cartona += `<div class="col-md-3" id="category-${i}">
        <div class="box rounded-2 position-relative">
          <img class="w-100" src="${data[i].strCategoryThumb}" alt="" />
          <div class="box-details">
            <p class="fw-semibold text-dark">${data[i].strCategory}</p>
          </div>
        </div>
      </div>`;
  }
  $("#categories .row").html(cartona);
  // on click we get into category selected
  let category;
  for (let i = 0; i < data.length; i++) {
    $(`#category-${i}`).on("click", function () {
      category = data[i].strCategory;
      console.log(category);
      fetchCategoryOptions(category);
    });
  }
}

//fetching the selected category
let selectedCategory;
async function fetchCategoryOptions(term) {
  $("#loading").show();
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${term}`
  );
  let res = await req.json();
  selectedCategory = res.meals;
  $("#loading").hide();
  displayOptions();
}

//displaying selected category
function displayOptions() {
  let secondCartona = ``;
  for (let i = 0; i < selectedCategory.length; i++) {
    secondCartona += `<div class="col-md-3" id="${selectedCategory[i].idMeal}">
          <div class="box rounded-2 position-relative">
            <img class="w-100" src="${selectedCategory[i].strMealThumb}" alt="" />
            <div class="box-details">
              <p class="fw-semibold text-dark text-center">${selectedCategory[i].strMeal}</p>
            </div>
          </div>
        </div>`;
  }
  $("#categories .row").html(secondCartona);
  //saving the meal id and passing it as an argument to fetch the selected option
  for (let i = 0; i < selectedCategory.length; i++) {
    $(`#${selectedCategory[i].idMeal}`).on("click", function () {
      const meal = selectedCategory[i].idMeal;
      fetchMealDetails(meal);
    });
  }
}

//fetching with the passed id
let mealId;
async function fetchMealDetails(id) {
  $("#loading").show();
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  let res = await req.json();
  mealId = res.meals[0];
  $("#loading").hide();
  displayMealDetails();
}

//displaying the meal details

function displayMealDetails() {
  //creating dynamic spans that is not empty or null
  let spans = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = mealId["strIngredient" + i];
    const measure = mealId["strMeasure" + i];

    if (ingredient != null && ingredient != "") {
      spans += `<span class="badge bg-secondary fs-4 m-2">${measure} ${ingredient}</span>`;
    }
  }
  //creating spans for tags using split and map and join methods
  let tags;
  if (mealId.strTags) {
    tags = mealId.strTags
      .split(",")
      .map((e) => {
        return `<span class="badge text-bg-info fs-4 mx-2">${e}</span>`;
      })
      .join("");
  } else {
    tags = `<span class="badge text-bg-info fs-4 mx-2">No Tags To Show</span>`;
  }

  let thirdCartona = `<div class="col-md-4">
  <div class="rounded-4 border-2 overflow-hidden">
    <img
      class="w-100"
      src="${mealId.strMealThumb}"
      alt=""
    />
  </div>
  <h3 class="text-center my-3">${mealId.strMeal}</h3>
</div>
<div class="col-md-8">
  <h3>Instructions</h3>
  <p>
    ${mealId.strInstructions}
  </p>
  <h4>Area : ${mealId.strArea}</h4>
  <h4 class="my-3">Category : ${mealId.strCategory}</h4>
  <h4>Recipe:</h4>
  <div class="spans"> ${spans}
  </div>
  <h4 class="mt-3">Tags:</h4>
  <div class="tags">
    ${tags}
  </div>
  <div class="sources mt-3">
    <a href="${mealId.strSource}"  target='_blank'
      ><span class="badge fs-4 text-bg-success">Source</span></a
    >
    <a href="${mealId.strYoutube}"  target='_blank'
      ><span class="badge fs-4 text-bg-danger">Youtube</span></a
    >
  </div>
</div>`;

  $("#categories .row").html(thirdCartona);
}
