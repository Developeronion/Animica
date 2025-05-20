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
  const selectedGenres = Array.from(document.getElementById("genreFilter").selectedOptions).map(o => o.value);
  const selectedSeason = document.getElementById("seasonFilter").value;
  const searchQuery = document.getElementById("searchInput").value.toLowerCase();

  const filtered = animeData.filter(anime => {
    const matchesGenres = selectedGenres.length === 0 || selectedGenres.every(g => anime.genres.includes(g));
    const matchesSeason = selectedSeason === "all" || anime.season === selectedSeason;
    const matchesSearch = anime.title.toLowerCase().includes(searchQuery);
    return matchesGenres && matchesSeason && matchesSearch;
  });

  renderAnimeList(filtered);
}

function renderAnimeList(list) {
  const container = document.getElementById("animeList");
  container.innerHTML = "";

  list.forEach(anime => {
    const li = document.createElement("li");
    li.textContent = anime.title;
    li.dataset.id = anime.id;
    li.onclick = () => {
      document.querySelectorAll("#animeList li").forEach(el => el.classList.remove("active"));
      li.classList.add("active");
      renderEpisodes(anime);
    };
    container.appendChild(li);
  });
}

function renderEpisodes(anime) {
  const section = document.getElementById("episodes");
  section.style.backgroundImage = `url('${anime.backgroundImage}')`;

  section.querySelector("h2").textContent = `${anime.title} Episodes`;
  const list = document.getElementById("episodeList");
  list.innerHTML = "";

  for (let i = 1; i <= anime.episodes; i++) {
    const epNum = anime.pad ? String(i).padStart(2, "0") : i;
    const div = document.createElement("div");
    div.className = "episode";
    div.innerHTML = `<a href="${anime.linkPrefix}${epNum}" target="_blank" download>Episode ${i}</a>`;
    list.appendChild(div);
  }
}
