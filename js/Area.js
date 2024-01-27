let areas;
async function getAreas() {
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let res = await req.json();
  areas = res.meals;
  displayAreas();
}

getAreas();

function displayAreas() {
  let cartona = ``;
  for (let i = 0; i < areas.length; i++) {
    cartona += `<div class="col-md-3" id="country-${i}">
          <div class="text-center">
          <i class="fa-solid fa-earth-americas fa-3x"></i>
            <div class="box-details">
              <p class="fw-semibold text-dark">${areas[i].strArea}</p>
            </div>
          </div>
        </div>`;
  }
  $("#area .row").html(cartona);

  let country;
  for (let i = 0; i < areas.length; i++) {
    $(`#country-${i}`).on("click", function () {
      country = areas[i].strArea;
      fetchCountry(country);
    });
  }
}

//fetching the selected country
let selectedCountry;
async function fetchCountry(term) {
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${term}`
  );
  let res = await req.json();
  selectedCountry = res.meals;
  displayAreaMeals();
}

function displayAreaMeals() {
  let secondCartona = ``;
  for (let i = 0; i < selectedCountry.length; i++) {
    secondCartona += `<div class="col-md-3" id="${selectedCountry[i].idMeal}">
          <div class="box rounded-2 position-relative">
            <img class="w-100" src="${selectedCountry[i].strMealThumb}" alt="" />
            <div class="box-details">
              <p class="fw-semibold text-dark text-center">${selectedCountry[i].strMeal}</p>
            </div>
          </div>
        </div>`;
  }
  $("#area .row").html(secondCartona);
  //saving the meal id and passing it as an argument to fetch the selected option
  for (let i = 0; i < selectedCountry.length; i++) {
    $(`#${selectedCountry[i].idMeal}`).on("click", function () {
      const meal = selectedCountry[i].idMeal;
      fetchMealDetailsInArea(meal);
    });
  }
}

//fetching with the passed id
let areaMealId;
async function fetchMealDetailsInArea(id) {
  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  let res = await req.json();
  areaMealId = res.meals[0];
  displayMealDetailsInArea();
}

//displaying the meal details

function displayMealDetailsInArea() {
  //creating dynamic spans that is not empty or null
  let spans = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = areaMealId["strIngredient" + i];
    const measure = areaMealId["strMeasure" + i];

    if (ingredient != null && ingredient != "") {
      spans += `<span class="badge bg-secondary fs-4 m-2">${measure} ${ingredient}</span>`;
    }
  }
  //creating spans for tags using split and map and join methods
  let tags;
  if (areaMealId.strTags) {
    tags = areaMealId.strTags
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
      src="${areaMealId.strMealThumb}"
      alt=""
    />
  </div>
  <h3 class="text-center my-3">${areaMealId.strMeal}</h3>
</div>
<div class="col-md-8">
  <h3>Instructions</h3>
  <p>
    ${areaMealId.strInstructions}
  </p>
  <h4>Area : ${areaMealId.strArea}</h4>
  <h4 class="my-3">Category : ${areaMealId.strCategory}</h4>
  <h4>Recipe:</h4>
  <div class="spans"> ${spans}
  </div>
  <h4 class="mt-3">Tags:</h4>
  <div class="tags">
    ${tags}
  </div>
  <div class="sources mt-3">
    <a href="${areaMealId.strSource}"  target='_blank'
      ><span class="badge text-bg-success fs-4">Source</span></a
    >
    <a href="${areaMealId.strYoutube}"  target='_blank'
      ><span class="badge text-bg-danger fs-4">Youtube</span></a
    >
  </div>
</div>`;

  $("#area .row").html(thirdCartona);
}
