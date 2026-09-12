(()=>{
  const STORAGE_KEY="movieRecentSearches";
  const input=document.querySelector("#searchInput");
  const button=document.querySelector("#searchButton");
  const panel=document.querySelector("#searchSuggestions");
  if(!input||!button||!panel)return;

  function getRecent(){
    try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||[]}catch{return[]}
  }
  function saveRecent(query){
    const q=String(query||"").trim();
    if(!q)return;
    const next=[q,...getRecent().filter(x=>x!==q)].slice(0,6);
    localStorage.setItem(STORAGE_KEY,JSON.stringify(next));
  }
  function removeRecent(query){
    localStorage.setItem(STORAGE_KEY,JSON.stringify(getRecent().filter(x=>x!==query)));
    showRecent();
  }
  function clearRecent(){
    localStorage.removeItem(STORAGE_KEY);
    showRecent();
  }
  function runRecentSearch(query){
    input.value=query;
    saveRecent(query);
    panel.classList.add("hidden");
    input.setAttribute("aria-expanded","false");
    button.click();
  }
  function showRecent(){
    if(input.value.trim())return;
    const recent=getRecent();
    if(!recent.length){panel.classList.add("hidden");input.setAttribute("aria-expanded","false");return;}
    panel.innerHTML=`<div class="recent-search-head"><strong>최근 검색어</strong><button type="button" class="recent-clear">전체 삭제</button></div><div class="recent-search-list">${recent.map(q=>`<div class="recent-search-item"><button type="button" class="recent-query" data-query="${escapeHTML(q)}"><span>🕘</span><span>${escapeHTML(q)}</span></button><button type="button" class="recent-remove" data-remove="${escapeHTML(q)}" aria-label="${escapeHTML(q)} 삭제">×</button></div>`).join("")}</div>`;
    panel.classList.remove("hidden");
    input.setAttribute("aria-expanded","true");
  }
  function escapeHTML(v=""){
    return String(v).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  }

  button.addEventListener("click",()=>saveRecent(input.value));
  input.addEventListener("keydown",e=>{if(e.key==="Enter")saveRecent(input.value)});
  input.addEventListener("focus",()=>{if(!input.value.trim())showRecent()});
  input.addEventListener("input",()=>{if(!input.value.trim())setTimeout(showRecent,0)});

  panel.addEventListener("click",e=>{
    const recentBtn=e.target.closest(".recent-query");
    if(recentBtn){e.preventDefault();e.stopPropagation();runRecentSearch(recentBtn.dataset.query);return;}
    const removeBtn=e.target.closest(".recent-remove");
    if(removeBtn){e.preventDefault();e.stopPropagation();removeRecent(removeBtn.dataset.remove);return;}
    if(e.target.closest(".recent-clear")){e.preventDefault();e.stopPropagation();clearRecent();}
  });

  const results=document.querySelector("#browseMovies");
  const title=document.querySelector("#browseTitle");
  if(results&&title){
    const observer=new MutationObserver(()=>{
      if(!title.textContent.includes("검색 결과"))return;
      const count=results.querySelectorAll(".movie-card").length;
      const desc=document.querySelector("#browseDescription");
      if(desc&&count)desc.textContent=`검색 결과 ${count}개를 먼저 보여드리고 있습니다.`;
    });
    observer.observe(results,{childList:true});
  }
})();
