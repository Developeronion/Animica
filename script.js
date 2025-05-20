const searchInput = document.getElementById("searchInput");
const genreSelect = document.getElementById("genreSelect");
const animeListEl = document.getElementById("animeList");
const episodeListDiv = document.getElementById("episodeList");
const episodeSection = document.getElementById("episodes");
const episodeHeader = episodeSection.querySelector("h2");

let filteredAnime = [...animeListData];
let activeAnimeId = filteredAnime[0]?.id || null;

// Extract all unique genres from animeListData
function getAllGenres() {
  const genresSet = new Set();
  animeListData.forEach(anime => {
    anime.genres.forEach(g => genresSet.add(g));
  });
  return Array.from(genresSet).sort();
}

// Populate genre multi-select options
function populateGenres() {
  const genres = getAllGenres();
  genres.forEach(genre => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreSelect.appendChild(option);
  });
}

// Render anime list based on current filteredAnime and activeAnimeId
function renderAnimeList() {
  animeListEl.innerHTML = "";
  if (filteredAnime.length === 0) {
    const noRes = document.createElement("li");
    noRes.textContent = "No anime found";
    noRes.style.cursor = "default";
    noRes.style.color = "#999";
    animeListEl.appendChild(noRes);
    return;
  }
  filteredAnime.forEach(anime => {
    const li = document.createElement("li");
    li.textContent = anime.title;
    li.dataset.id = anime.id;
    li.classList.toggle("active", anime.id === activeAnimeId);
    li.addEventListener("click", () => {
      activeAnimeId = anime.id;
      renderEpisodes(anime);
      renderAnimeList();
    });
    animeListEl.appendChild(li);
  });
}

// Render episodes and background for selected anime
function renderEpisodes(anime) {
  episodeSection.style.backgroundImage = `url('${anime.backgroundImage}')`;
  episodeHeader.textContent = `${anime.title} Episodes`;
  episodeListDiv.innerHTML = "";
  for (let i = 1; i <= anime.episodes; i++) {
    const epDiv = document.createElement("div");
    epDiv.classList.add("episode");
    let epNum = anime.pad ? String(i).padStart(2, "0") : i;
    epDiv.innerHTML = `<a href="${anime.linkPrefix}${epNum}" target="_blank" download>Episode ${i} Download</a>`;
    episodeListDiv.appendChild(epDiv);
  }
}

// Filter anime based on search text and selected genres
function filterAnime() {
  const searchText = searchInput.value.trim().toLowerCase();
  const selectedGenres = Array.from(genreSelect.selectedOptions).map(opt => opt.value);

  filteredAnime = animeListData.filter(anime => {
    const matchesSearch = anime.title.toLowerCase().includes(searchText);
    const matchesGenre = selectedGenres.length === 0 || selectedGenres.every(g => anime.genres.includes(g));
    return matchesSearch && matchesGenre;
  });

  // If active anime not in filtered list, reset to first
  if (!filteredAnime.find(a => a.id === activeAnimeId)) {
    activeAnimeId = filteredAnime[0]?.id || null;
    if (activeAnimeId) {
      const activeAnime = animeListData.find(a => a.id === activeAnimeId);
      renderEpisodes(activeAnime);
    } else {
      episodeSection.style.backgroundImage = '';
      episodeHeader.textContent = 'No anime selected';
      episodeListDiv.innerHTML = '';
    }
  }

  renderAnimeList();
}

// Init
populateGenres();
renderEpisodes(animeListData[0]);
renderAnimeList();

// Event Listeners
searchInput.addEventListener("input", filterAnime);
genreSelect.addEventListener("change", filterAnime);
