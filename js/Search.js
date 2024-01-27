let searchWithNameResult;
let firstInput = $("#search input")[0];
let secondInput = $("#search input")[1];
$("#loading").hide();

async function searchWithName(term) {
  $("#loading").show();

  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  let res = await req.json();
  searchWithNameResult = res.meals;
  console.log(searchWithNameResult);
  $("#loading").hide();

  displayResults();
}

async function searchWithFirstLetter(term) {
  $("#loading").show();

  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  let res = await req.json();
  searchWithNameResult = res.meals;
  console.log(searchWithNameResult);
  $("#loading").hide();
  displayResults();
}

$(firstInput).on("keyup", function (e) {
  searchWithName(e.target.value);
});

$(secondInput).on("keyup", function (e) {
  searchWithFirstLetter(e.target.value);
});

function displayResults() {
  let cartona = ``;
  for (let i = 0; i < searchWithNameResult.length; i++) {
    cartona += `<div class="col-md-3" id="${searchWithNameResult[i].idMeal}">
          <div class="box rounded-2 position-relative">
            <img class="w-100" src="${searchWithNameResult[i].strMealThumb}" alt="" />
            <div class="box-details">
              <p class="fw-semibold text-dark">${searchWithNameResult[i].strMeal}</p>
            </div>
          </div>
        </div>`;
  }
  $("#search .search-row").html(cartona);

  for (let i = 0; i < searchWithNameResult.length; i++) {
    $(`#${searchWithNameResult[i].idMeal}`).on("click", function () {
      const meal = searchWithNameResult[i].idMeal;
      fetchMealDetailsInSearch(meal);
      console.log(meal);
    });
  }
}

let searchMealId;
async function fetchMealDetailsInSearch(id) {
  $("#loading").show();

  let req = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  let res = await req.json();
  searchMealId = res.meals[0];
  console.log(searchMealId);
  $("#loading").hide();

  displayMealDetailsInSearch();
}

function displayMealDetailsInSearch() {
  //creating dynamic spans that is not empty or null
  let spans = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = searchMealId["strIngredient" + i];
    const measure = searchMealId["strMeasure" + i];

    if (ingredient != null && ingredient != "") {
      spans += `<span class="badge bg-secondary fs-4 m-2">${measure} ${ingredient}</span>`;
    }
  }
  //creating spans for tags using split and map and join methods
  let tags;
  if (searchMealId.strTags) {
    tags = searchMealId.strTags
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
      src="${searchMealId.strMealThumb}"
      alt=""
    />
  </div>
  <h3 class="text-center my-3">${searchMealId.strMeal}</h3>
</div>
<div class="col-md-8">
  <h3>Instructions</h3>
  <p>
    ${searchMealId.strInstructions}
  </p>
  <h4>Area : ${searchMealId.strArea}</h4>
  <h4 class="my-3">Category : ${searchMealId.strCategory}</h4>
  <h4>Recipe:</h4>
  <div class="spans"> ${spans}
  </div>
  <h4 class="mt-3">Tags:</h4>
  <div class="tags">
    ${tags}
  </div>
  <div class="sources mt-3">
    <a href="${searchMealId.strSource}"  target='_blank'
      ><span class="badge text-bg-success fs-4">Source</span></a
    >
    <a href="${searchMealId.strYoutube}"  target='_blank'
      ><span class="badge text-bg-danger fs-4">Youtube</span></a
    >
  </div>
</div>`;

  $("#search .search-row").html(thirdCartona);
}
