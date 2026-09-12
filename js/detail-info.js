(()=>{
  const esc=value=>String(value??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  const formatDate=value=>{
    if(!value)return "정보 없음";
    const d=new Date(value);
    if(Number.isNaN(d.getTime()))return esc(value);
    return new Intl.DateTimeFormat("ko-KR",{year:"numeric",month:"long",day:"numeric"}).format(d);
  };
  const getCertification=movie=>{
    const groups=movie.release_dates?.results||[];
    const kr=groups.find(x=>x.iso_3166_1==="KR");
    const fallback=groups.find(x=>x.iso_3166_1==="US")||groups[0];
    const pick=group=>(group?.release_dates||[]).find(x=>String(x.certification||"").trim())?.certification||"";
    const cert=pick(kr)||pick(fallback);
    if(!cert)return "정보 없음";
    const map={"ALL":"전체 관람가","12":"12세 이상 관람가","15":"15세 이상 관람가","18":"청소년 관람불가","R":"R","PG":"PG","PG-13":"PG-13","G":"G","NC-17":"NC-17"};
    return map[cert]||cert;
  };
  const renderInfo=movie=>{
    const detail=document.querySelector("#detailBody");
    if(!detail||detail.querySelector(".extended-info"))return;
    const firstSection=detail.querySelector(".detail-section");
    if(!firstSection)return;
    const countries=(movie.production_countries||[]).map(x=>x.name).filter(Boolean);
    const companies=(movie.production_companies||[]).map(x=>x.name).filter(Boolean).slice(0,4);
    const originalTitle=movie.original_title&&movie.original_title!==movie.title?movie.original_title:"-";
    const statusMap={Released:"개봉",Post_Production:"후반 작업",In_Production:"제작 중",Planned:"기획",Canceled:"취소",Rumored:"검토 중"};
    const section=document.createElement("section");
    section.className="detail-section extended-info";
    section.innerHTML=`
      <h2>영화 정보</h2>
      <div class="movie-facts">
        <div class="movie-fact"><span>개봉일</span><strong>${formatDate(movie.release_date)}</strong></div>
        <div class="movie-fact"><span>관람등급</span><strong>${esc(getCertification(movie))}</strong></div>
        <div class="movie-fact"><span>제작 국가</span><strong>${esc(countries.join(", ")||"정보 없음")}</strong></div>
        <div class="movie-fact"><span>제작사</span><strong>${esc(companies.join(", ")||"정보 없음")}</strong></div>
        <div class="movie-fact"><span>원제</span><strong>${esc(originalTitle)}</strong></div>
        <div class="movie-fact"><span>상태</span><strong>${esc(statusMap[movie.status]||movie.status||"정보 없음")}</strong></div>
      </div>`;
    firstSection.before(section);
  };
  const originalFetch=window.fetch;
  window.fetch=async(...args)=>{
    const response=await originalFetch(...args);
    try{
      const url=String(args[0] instanceof Request?args[0].url:args[0]);
      if(url.includes("/api/tmdb?path=detail")){
        response.clone().json().then(data=>{
          if(data?.id)setTimeout(()=>renderInfo(data),0);
        }).catch(()=>{});
      }
    }catch{}
    return response;
  };
})();
