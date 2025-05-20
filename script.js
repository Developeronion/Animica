let animeData = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch("animeData.json")
    .then((response) => response.json())
    .then((data) => {
      animeData = data;
      populateFilters();
      renderAnimeList(animeData);
    });

  document.getElementById("genreFilter").addEventListener("change", applyFilters);
  document.getElementById("seasonFilter").addEventListener("change", applyFilters);
  document.getElementById("searchInput").addEventListener("input", applyFilters);
});

function populateFilters() {
  const genreSet = new Set();
  const seasonSet = new Set();

  animeData.forEach((anime) => {
    anime.genres.forEach((genre) => genreSet.add(genre));
    seasonSet.add(anime.season);
  });

  const genreFilter = document.getElementById("genreFilter");
  genreSet.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreFilter.appendChild(option);
  });

  const seasonFilter = document.getElementById("seasonFilter");
  seasonSet.forEach((season) => {
    const option = document.createElement("option");
    option.value = season;
    option.textContent = season;
    seasonFilter.appendChild(option);
  });
}

function applyFilters() {
  const genreFilter = document.getElementById("genreFilter");
  const selectedGenres = Array.from(genreFilter.selectedOptions).map((option) => option.value);

  const selectedSeason = document.getElementById("seasonFilter").value;
  const searchQuery = document.getElementById("searchInput").value.toLowerCase();

  const filteredAnime = animeData.filter((anime) => {
    const matchesGenres =
      selectedGenres.length === 0 || selectedGenres.every((genre) => anime.genres.includes(genre));
    const matchesSeason = selectedSeason === "all" || anime.season === selectedSeason;
    const matchesSearch = anime.title.toLowerCase().includes(searchQuery);
    return matchesGenres && matchesSeason && matchesSearch;
  });

  renderAnimeList(filteredAnime);
}

function renderAnimeList(animeList) {
  const animeListElement = document.getElementById("animeList");
  animeListElement.innerHTML = "";

  animeList.forEach((anime) => {
    const li = document.createElement("li");
    li.textContent = anime.title;
    li.dataset.id = anime.id;
    li.addEventListener("click", () => {
      document.querySelectorAll("#animeList li").forEach((item) => item.classList.remove("active"));
      li.classList.add("active");
      renderEpisodes(anime);
    });
    animeListElement.appendChild(li);
  });
}

function renderEpisodes(anime) {
  const episodeSection = document.getElementById("episodes");
  episodeSection.style.backgroundImage = `url('${anime.backgroundImage}')`;

  const episodeHeader = episodeSection.querySelector("h2");
  episodeHeader.textContent = `${anime.title} Episodes`;

  const episodeListDiv = document.getElementById("episodeList");
  episodeListDiv.innerHTML = "";

  for (let i = 1; i <= anime.episodes; i++) {
    const epNumber = anime.pad ? String(i).padStart(2, "0") : i;
    const epDiv = document.createElement("div");
    epDiv.classList.add("episode");
    epDiv.innerHTML = `<a href="${anime.linkPrefix}${epNumber}" target="_blank" download>Episode ${i} Download</a>`;
    episodeListDiv.appendChild(epDiv);
  }
}
