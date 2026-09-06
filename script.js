const API = "https://www.omdbapi.com/";
const KEY = "16920950";

const form = document.querySelector("#searchForm");
const input = document.querySelector("#movieInput");
const grid = document.querySelector("#grid");
const empty = document.querySelector("#empty");
const loader = document.querySelector("#loader");
const error = document.querySelector("#error");
const count = document.querySelector("#count");
const modal = document.querySelector("#modal");
const details = document.querySelector("#details");

async function searchMovies(title) {
    try {
        const url = `${API}?apikey=${KEY}&s=${encodeURIComponent(title)}`;
        const response = await fetch(url);

        const data = await response.json();

        if (data.Response === "False") {
            showError("No movies found.");
            return;
        }

        showMovies(data.Search);

    } catch (err) {
        showError(
            err.message === "NETWORK" ? "Unable to connect to OMDb." : "Check your API key and try again."
        );
    } finally {
        loading(false);
    }
}

function showMovies(movies) {
    empty.classList.add("hidden");
    error.classList.add("hidden");

    grid.innerHTML = movies.map(movie => `
        <article class="card">
            <img src="${movie.Poster !== "N/A" ? movie.Poster: "https://via.placeholder.com/300x450?text=No+Poster"}">

            <div class="card-info">
                <h3>${movie.Title}</h3>
                <p>${movie.Year} • ${movie.Type}</p>
                <button class="details"
                    onclick="getDetails('${movie.imdbID}')">
                    View Details
                </button>
            </div>
        </article>
    `).join("");
}

async function getDetails(id) {
    modal.classList.remove("hidden");
    details.innerHTML = `<div class="loader">Loading...</div>`;

    try {
        const response = await fetch(
            `${API}?apikey=${KEY}&i=${id}&plot=full`
        );

        const movie = await response.json();

        if (movie.Response === "False") {
            throw new Error();
        }

        details.innerHTML = `
            <div class="details-content">
                <img src="${movie.Poster}" alt="${movie.Title}">

                <div>
                    <small>MOVIE DETAILS</small>
                    <h2>${movie.Title}</h2>
                    <p>★ ${movie.imdbRating} • ${movie.Year}</p>
                    <p>${movie.Plot}</p>

                    <div class="info">
                        <p><b>Genre:</b> ${movie.Genre}</p>
                        <p><b>Director:</b> ${movie.Director}</p>
                        <p><b>Actors:</b> ${movie.Actors}</p>
                    </div>
                </div>
            </div>
        `;

    } catch {
        details.innerHTML =
            `<div class="error">Unable to load movie details.</div>`;
    }
}

function showError(message) {
    grid.innerHTML = "";
    empty.classList.add("hidden");
    error.textContent = message;
    error.classList.remove("hidden");
}

form.onsubmit = (e) => {
    e.preventDefault();
    searchMovies(input.value);
};

document.querySelectorAll(".suggest").forEach(button => {
    button.onclick = () => {
        input.value = button.textContent;
        searchMovies(button.textContent);
        $("#movies").scrollIntoView();
    };
});

document.querySelector("#close").onclick = () => {
    modal.classList.add("hidden");
};

document.querySelector("#clear").onclick = () => {
    input.value = "";
    grid.innerHTML = "";
};

modal.onclick = (e) => {
    if (e.target === modal) modal.classList.add("hidden");
};

document.onkeydown = (e) => {
    if (e.key === "Escape") modal.classList.add("hidden");
};