<script>
  const animeListData = [
    {
      id: 1,
      title: "Ameku M.D. Doctor Detective S01 720p",
      genres: ["Detective", "Drama"],
      backgroundImage: "ameku_md_doctor_detective.jpg",
      episodes: Array.from({ length: 12 }, (_, i) => ({
        ep: i + 1,
        link: `https://cuty.io/AMDDDS01E${String(i + 1).padStart(2, '0')}`
      }))
    },
    {
      id: 2,
      title: "Sword Art Online Season 1",
      genres: ["Action", "Adventure", "Fantasy"],
      backgroundImage: "sword_art_online.jpg",
      episodes: Array.from({ length: 12 }, (_, i) => ({
        ep: i + 1,
        link: `https://cuty.io/SWORDAOS1E${String(i + 1).padStart(2, '0')}`
      }))
    },
    {
      id: 3,
      title: "A Condition Called Love Season 1",
      genres: ["Romance", "School"],
      backgroundImage: "a_condition_called_love_s1.jpg",
      episodes: Array.from({ length: 12 }, (_, i) => ({
        ep: i + 1,
        link: `https://cuty.io/ACCLS1E${i + 1}`
      }))
    }
  ];

  const searchInput = document.getElementById("searchInput");
  const genreSelect = document.getElementById("genreSelect");
  const animeListEl = document.getElementById("animeList");
  const episodeListDiv = document.getElementById("episodeList");
  const episodeSection = document.getElementById("episodes");
  const episodeHeader = episodeSection.querySelector("h2");

  let filteredAnime = [...animeListData];
  let activeAnimeId = filteredAnime[0]?.id || null;

  function getAllGenres() {
    const genresSet = new Set();
    animeListData.forEach(anime => {
      anime.genres.forEach(g => genresSet.add(g));
    });
    return Array.from(genresSet).sort();
  }

  function populateGenres() {
    const genres = getAllGenres();
    genres.forEach(genre => {
      const option = document.createElement("option");
      option.value = genre;
      option.textContent = genre;
      genreSelect.appendChild(option);
    });
  }

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

  function renderEpisodes(anime) {
    episodeSection.style.backgroundImage = `url('${anime.backgroundImage}')`;
    episodeHeader.textContent = `${anime.title} Episodes`;
    episodeListDiv.innerHTML = "";
    anime.episodes.forEach(ep => {
      const epDiv = document.createElement("div");
      epDiv.classList.add("episode");
      epDiv.innerHTML = `<a href="${ep.link}" target="_blank" download>Episode ${ep.ep} Download</a>`;
      episodeListDiv.appendChild(epDiv);
    });
  }

  function filterAnime() {
    const searchText = searchInput.value.trim().toLowerCase();
    const selectedGenres = Array.from(genreSelect.selectedOptions).map(opt => opt.value);

    filteredAnime = animeListData.filter(anime => {
      const matchesSearch = anime.title.toLowerCase().includes(searchText);
      const matchesGenre = selectedGenres.length === 0 || selectedGenres.every(g => anime.genres.includes(g));
      return matchesSearch && matchesGenre;
    });

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
</script>
