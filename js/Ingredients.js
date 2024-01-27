let meals;
async function getMeals() {
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let res = await req.json();
  meals = res.meals;
  displayMeals();
}

getMeals();

function displayMeals() {
  let cartona = ``;
  for (let i = 0; i < meals.length; i++) {
    cartona += `<div class="col-md-3" id="${meals[i].strIngredient}">
          <div class="text-center">
          <i class="fa-solid fa-utensils fa-3x"></i>
            <div class="box-details my-3">
               <h3>${meals[i].strIngredient}</h3>
            </div>
          </div>
        </div>`;
  }
  $("#ingredients .row").html(cartona);

  // on click we get into ingredient selected

  let ingredient;
  for (let i = 0; i < meals.length; i++) {
    $(`#${meals[i].strIngredient}`).on("click", function () {
      ingredient = meals[i].strIngredient;
      fetchIngredientOptions(ingredient);
    });
  }
}

//fetching the selected category
let selectedIngredient;
async function fetchIngredientOptions(term) {
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${term}`
  );
  let res = await req.json();
  selectedIngredient = res.meals;
  displayIngredientOptions();
}

//displaying selected category
function displayIngredientOptions() {
  let secondCartona = ``;
  for (let i = 0; i < selectedIngredient.length; i++) {
    secondCartona += `<div class="col-md-3" id="${selectedIngredient[i].idMeal}">
          <div class="box rounded-2 position-relative">
            <img class="w-100" src="${selectedIngredient[i].strMealThumb}" alt="" />
            <div class="box-details">
              <p class="fw-semibold text-dark text-center">${selectedIngredient[i].strMeal}</p>
            </div>
          </div>
        </div>`;
  }
  $("#ingredients .row").html(secondCartona);
  //saving the meal id and passing it as an argument to fetch the selected option
  for (let i = 0; i < selectedIngredient.length; i++) {
    $(`#${selectedIngredient[i].idMeal}`).on("click", function () {
      const meal = selectedIngredient[i].idMeal;
      fetchIngredientDetails(meal);
    });
  }
}

//fetching with the passed id
let ingredientId;
async function fetchIngredientDetails(id) {
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  let res = await req.json();
  ingredientId = res.meals[0];
  displayIngredientDetails();
}

//displaying the meal details

function displayIngredientDetails() {
  //creating dynamic spans that is not empty or null
  let spans = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = ingredientId["strIngredient" + i];
    const measure = ingredientId["strMeasure" + i];

    if (ingredient != null && ingredient != "") {
      spans += `<span class="badge bg-secondary fs-4 m-2">${measure} ${ingredient}</span>`;
    }
  }
  //creating spans for tags using split and map and join methods
  let tags;
  if (ingredientId.strTags) {
    tags = ingredientId.strTags
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
      src="${ingredientId.strMealThumb}"
      alt=""
    />
  </div>
  <h3 class="text-center my-3">${ingredientId.strMeal}</h3>
</div>
<div class="col-md-8">
  <h3>Instructions</h3>
  <p>
    ${ingredientId.strInstructions}
  </p>
  <h4>Area : ${ingredientId.strArea}</h4>
  <h4 class="my-3">Category : ${ingredientId.strCategory}</h4>
  <h4>Recipe:</h4>
  <div class="spans"> ${spans}
  </div>
  <h4 class="mt-3">Tags:</h4>
  <div class="tags">
    ${tags}
  </div>
  <div class="sources mt-3">
    <a href="${ingredientId.strSource}"  target='_blank'
      ><span class="badge text-bg-success fs-4">Source</span></a
    >
    <a href="${ingredientId.strYoutube}"  target='_blank'
      ><span class="badge text-bg-danger fs-4">Youtube</span></a
    >
  </div>
</div>`;

  $("#ingredients .row").html(thirdCartona);
}
