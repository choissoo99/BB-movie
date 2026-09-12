(()=>{
  const STORAGE_KEY="movieFavorites";
  const detailBody=document.querySelector("#detailBody");
  if(!detailBody)return;

  function getFavorites(){
    try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||[]}catch{return[]}
  }

  function saveFavorites(list){
    localStorage.setItem(STORAGE_KEY,JSON.stringify(list));
  }

  function getMovieId(){
    const id=new URL(location.href).searchParams.get("movie");
    return /^\d+$/.test(id||"")?Number(id):null;
  }

  function isFavorite(id){
    return getFavorites().some(movie=>Number(movie.id)===Number(id));
  }

  function syncCardButtons(id){
    const active=isFavorite(id);
    document.querySelectorAll(`.favorite-btn[data-id="${id}"]`).forEach(button=>{
      button.classList.toggle("active",active);
      button.textContent=active?"♥":"♡";
      button.setAttribute("aria-pressed",String(active));
      button.setAttribute("aria-label",active?"즐겨찾기에서 제거":"즐겨찾기에 추가");
    });
  }

  function updateDetailButton(button,id){
    const active=isFavorite(id);
    button.classList.toggle("active",active);
    button.setAttribute("aria-pressed",String(active));
    button.innerHTML=active?"<span>♥</span> 즐겨찾기 저장됨":"<span>♡</span> 즐겨찾기 추가";
  }

  async function toggleDetailFavorite(button,id){
    button.disabled=true;
    try{
      let list=getFavorites();
      if(isFavorite(id)){
        list=list.filter(movie=>Number(movie.id)!==Number(id));
      }else{
        const response=await fetch(`/api/tmdb?path=detail&id=${id}`);
        if(!response.ok)throw new Error("영화 정보를 불러오지 못했습니다.");
        const movie=await response.json();
        list.unshift({
          id:movie.id,
          title:movie.title,
          poster_path:movie.poster_path,
          release_date:movie.release_date,
          vote_average:movie.vote_average
        });
      }
      saveFavorites(list);
      updateDetailButton(button,id);
      syncCardButtons(id);
    }catch(error){
      console.error(error);
      button.textContent="다시 시도해주세요";
      setTimeout(()=>updateDetailButton(button,id),1200);
    }finally{
      button.disabled=false;
    }
  }

  function enhanceDetail(){
    const id=getMovieId();
    const shareButton=detailBody.querySelector("#shareMovieButton");
    if(!id||!shareButton||detailBody.querySelector("#detailFavoriteButton"))return;

    let actions=shareButton.closest(".detail-actions");
    if(!actions){
      actions=document.createElement("div");
      actions.className="detail-actions";
      shareButton.parentNode.insertBefore(actions,shareButton);
      actions.appendChild(shareButton);
    }

    const button=document.createElement("button");
    button.id="detailFavoriteButton";
    button.className="detail-favorite-button";
    button.type="button";
    button.dataset.id=String(id);
    updateDetailButton(button,id);
    button.addEventListener("click",()=>toggleDetailFavorite(button,id));
    actions.insertBefore(button,shareButton);
  }

  new MutationObserver(enhanceDetail).observe(detailBody,{childList:true,subtree:true});
  window.addEventListener("popstate",()=>setTimeout(enhanceDetail,0));
  enhanceDetail();
})();
