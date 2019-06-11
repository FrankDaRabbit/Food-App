import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import Recipe from './models/Recipe';
import { elements, renderLoader, clearLoader } from './views/base';



// ****** Global state of the app  ********
/*-Search object
/--Current resipe object
/--Shopping list object
/-- Liked recipes
*/
const state = {

};

//**
//          SEARCH CONTROLLER
//*/
const controlSearch = async () => {
    // 1) get query from view
    const query = searchView.getInput();
    console.log(query);
    if (query) {
        // 2) new search object and update to state
        state.search = new Search(query);
        // 3) prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try {
            // 4) search for recipes
            await state.search.getResults();

            // 5) render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch (error) {
            alert('something went wrong');
            clearLoader();
        }

    }

}
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});



elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest(".btn-inline");
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
})

//**
//          RECIPE CONTROLLER
//*/
const controlRecipe = async () => {

    // Get it from url with hash

    const id = window.location.hash.replace('#', '');
    console.log(id);
    if (id) {
        //prepare UI for changes

        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightedSelected(id);

        //Create new recipe obj

        state.recipe = new Recipe(id);




        try {
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //Calc time and servings
            state.recipe.calcTime();
            state.recipe.calcServings();
            //Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (error) {
            alert('Error processing recipe recipe controller');
        }



    }

}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // decrease button is clicked
        state.recipe.updateServings('dec');
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // decrease button is clicked
        state.recipe.updateServings('inc');
    }
    console.log(state.recipe)
})