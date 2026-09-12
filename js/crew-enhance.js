(() => {
  const detailBody = document.getElementById("detailBody");
  if (!detailBody) return;

  const esc = (v = "") => String(v).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  const uniqByName = list => {
    const seen = new Set();
    return list.filter(item => {
      const key = `${item.name}|${item.job || item.character || ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  function movieIdFromLocation() {
    return new URL(location.href).searchParams.get("movie");
  }

  function personCard(person, role) {
    const image = person.profile_path
      ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
      : "/assets/images/poster-placeholder.svg";
    return `<article class="person-detail-card">
      <img src="${image}" alt="${esc(person.name)}" loading="lazy">
      <div><strong>${esc(person.name)}</strong><span>${esc(role || "")}</span></div>
    </article>`;
  }

  function crewLine(label, people) {
    const names = uniqByName(people).slice(0, 5).map(p => esc(p.name)).join(", ");
    if (!names) return "";
    return `<div class="crew-summary-row"><span>${label}</span><strong>${names}</strong></div>`;
  }

  async function enhance() {
    const id = movieIdFromLocation();
    if (!id || detailBody.querySelector("[data-crew-enhanced]")) return;

    try {
      const response = await fetch(`/api/tmdb?path=detail&id=${encodeURIComponent(id)}`);
      if (!response.ok) return;
      const movie = await response.json();
      const crew = movie.credits?.crew || [];
      const cast = movie.credits?.cast || [];

      const directors = crew.filter(p => p.job === "Director");
      const writers = crew.filter(p => ["Screenplay", "Writer", "Story"].includes(p.job));
      const producers = crew.filter(p => ["Producer", "Executive Producer"].includes(p.job));
      const keyCrew = uniqByName([...directors, ...writers, ...producers]).slice(0, 8);
      const mainCast = cast.slice(0, 10);

      const infoSection = detailBody.querySelector(".detail-info-section");
      const castSection = [...detailBody.querySelectorAll(".detail-section")].find(s => s.querySelector("h2")?.textContent?.includes("출연진"));
      const anchor = infoSection || castSection || detailBody.lastElementChild;

      const section = document.createElement("section");
      section.className = "detail-section crew-detail-section";
      section.dataset.crewEnhanced = "true";
      section.innerHTML = `
        <h2>🎬 주요 제작진</h2>
        <div class="crew-summary">
          ${crewLine("감독", directors)}
          ${crewLine("각본", writers)}
          ${crewLine("제작", producers)}
        </div>
        ${keyCrew.length ? `<div class="person-detail-grid crew-person-grid">${keyCrew.map(p => personCard(p, p.job)).join("")}</div>` : ""}
        <div class="cast-role-heading"><h3>주요 배우와 배역</h3><span>${mainCast.length ? `${mainCast.length}명` : "정보 없음"}</span></div>
        ${mainCast.length ? `<div class="person-detail-grid">${mainCast.map(p => personCard(p, p.character || "배역 정보 없음")).join("")}</div>` : '<p class="crew-empty">배우 정보가 없습니다.</p>'}
      `;

      if (anchor?.parentNode) anchor.parentNode.insertBefore(section, anchor.nextSibling);
      else detailBody.appendChild(section);
    } catch (error) {
      console.warn("제작진 정보 강화 실패", error);
    }
  }

  const observer = new MutationObserver(() => {
    if (!document.getElementById("movieDetail")?.classList.contains("hidden") && detailBody.querySelector("#detailTitle")) {
      enhance();
    }
  });
  observer.observe(detailBody, { childList: true, subtree: true });
  window.addEventListener("popstate", () => setTimeout(enhance, 100));
})();
