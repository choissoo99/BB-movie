(function(){
  const detailBody=document.querySelector('#detailBody');
  if(!detailBody)return;

  const observer=new MutationObserver(()=>{
    const similar=document.querySelector('#similarMovies');
    if(!similar || document.querySelector('#recommendedMovies'))return;

    const movieId=new URL(location.href).searchParams.get('movie');
    if(!movieId)return;

    fetch(`/api/tmdb?path=detail&id=${encodeURIComponent(movieId)}`)
      .then(r=>r.ok?r.json():Promise.reject())
      .then(data=>{
        const list=(data.recommendations?.results||[]).filter(m=>m.poster_path).slice(0,20);
        if(!list.length)return;

        const section=document.createElement('section');
        section.className='detail-section recommendation-section';
        section.innerHTML='<div class="recommendation-heading"><div><span class="recommendation-kicker">MOVIEBOX PICK</span><h2>이 영화 다음엔?</h2><p>TMDB 추천 데이터를 바탕으로 이어서 보기 좋은 작품입니다.</p></div></div><div class="movie-row" id="recommendedMovies"></div>';
        similar.closest('.detail-section')?.after(section);

        if(typeof window.renderMovieSection==='function'){
          window.renderMovieSection('recommendedMovies',list);
        }else{
          const row=section.querySelector('#recommendedMovies');
          list.forEach(m=>{
            const card=document.createElement('button');
            card.className='recommendation-card';
            card.type='button';
            card.dataset.id=m.id;
            card.innerHTML=`<img src="https://image.tmdb.org/t/p/w500${m.poster_path}" alt="${(m.title||'영화').replace(/"/g,'&quot;')} 포스터"><span>${m.title||'제목 없음'}</span>`;
            row.append(card);
          });
        }
      })
      .catch(()=>{});
  });

  observer.observe(detailBody,{childList:true,subtree:true});

  document.addEventListener('click',e=>{
    const card=e.target.closest('.recommendation-card');
    if(!card)return;
    if(typeof window.getMovieDetail==='function')window.getMovieDetail(card.dataset.id);
  });
})();
