const ALLOWED_PATHS = new Set(["popular","search","genre","detail","now-playing","upcoming","top-rated","discover"]);
const ALLOWED_GENRES = new Set(["28","35","18","27","878","16","10749","53"]);
const ALLOWED_SORTS = new Set(["popularity.desc","vote_average.desc","primary_release_date.desc","primary_release_date.asc"]);

function buildTmdbRequest(endpoint, credential) {
  const value = String(credential || "").trim().replace(/^Bearer\s+/i, "");
  const looksLikeV3ApiKey = /^[a-f0-9]{32}$/i.test(value);

  if (looksLikeV3ApiKey) {
    const url = new URL(endpoint);
    url.searchParams.set("api_key", value);
    return {
      url: url.toString(),
      options: { headers: { accept: "application/json" } }
    };
  }

  return {
    url: endpoint,
    options: {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${value}`
      }
    }
  };
}

export default async function handler(req,res){
  if(req.method!=="GET"){
    res.setHeader("Allow","GET");
    return res.status(405).json({error:"Method not allowed."});
  }

  const credential=process.env.TMDB_ACCESS_TOKEN || process.env.TMDB_API_KEY;
  if(!credential){
    return res.status(500).json({error:"TMDB credential is not configured."});
  }

  const {path="popular",query="",genre="",id="",year="",rating="",sort="popularity.desc"}=req.query;
  const page=Math.min(Math.max(parseInt(req.query.page||"1",10)||1,1),500);

  if(!ALLOWED_PATHS.has(path)) return res.status(400).json({error:"Invalid path."});

  let endpoint="";
  const base="https://api.themoviedb.org/3";

  switch(path){
    case "search": {
      const q=String(query).trim().slice(0,100);
      if(!q) return res.status(400).json({error:"Search query is required."});
      endpoint=`${base}/search/movie?language=ko-KR&include_adult=false&page=${page}&query=${encodeURIComponent(q)}`;
      break;
    }
    case "genre": {
      const g=String(genre);
      if(!ALLOWED_GENRES.has(g)) return res.status(400).json({error:"Invalid genre."});
      endpoint=`${base}/discover/movie?language=ko-KR&include_adult=false&page=${page}&with_genres=${encodeURIComponent(g)}&sort_by=popularity.desc`;
      break;
    }
    case "detail": {
      const movieId=String(id);
      if(!/^\d+$/.test(movieId)) return res.status(400).json({error:"Invalid movie id."});
      endpoint=`${base}/movie/${movieId}?language=ko-KR&append_to_response=credits,videos,similar,recommendations,release_dates`;
      break;
    }
    case "now-playing":
      endpoint=`${base}/movie/now_playing?language=ko-KR&region=KR&page=${page}`;
      break;
    case "upcoming":
      endpoint=`${base}/movie/upcoming?language=ko-KR&region=KR&page=${page}`;
      break;
    case "top-rated":
      endpoint=`${base}/movie/top_rated?language=ko-KR&region=KR&page=${page}`;
      break;
    case "discover": {
      const params=new URLSearchParams({language:"ko-KR",include_adult:"false",include_video:"false",page:String(page),sort_by:ALLOWED_SORTS.has(String(sort))?String(sort):"popularity.desc"});
      if(genre){
        if(!ALLOWED_GENRES.has(String(genre))) return res.status(400).json({error:"Invalid genre."});
        params.set("with_genres",String(genre));
      }
      if(year){
        const y=parseInt(year,10);
        const max=new Date().getFullYear()+2;
        if(!Number.isInteger(y)||y<1900||y>max) return res.status(400).json({error:"Invalid year."});
        params.set("primary_release_year",String(y));
      }
      if(rating){
        const r=Number(rating);
        if(!Number.isFinite(r)||r<0||r>10) return res.status(400).json({error:"Invalid rating."});
        params.set("vote_average.gte",String(r));
        params.set("vote_count.gte","100");
      }
      endpoint=`${base}/discover/movie?${params.toString()}`;
      break;
    }
    case "popular":
    default:
      endpoint=`${base}/movie/popular?language=ko-KR&page=${page}`;
  }

  try{
    const request=buildTmdbRequest(endpoint, credential);
    const response=await fetch(request.url, request.options);
    const data=await response.json();

    if(!response.ok){
      console.error("TMDB API error", response.status, data?.status_message || data?.error || "Unknown error");
    }

    const cache=path==="detail"?"s-maxage=1800, stale-while-revalidate=3600":path==="top-rated"?"s-maxage=3600, stale-while-revalidate=7200":"s-maxage=300, stale-while-revalidate=900";
    res.setHeader("Cache-Control",cache);
    return res.status(response.status).json(data);
  }catch(error){
    console.error(error);
    return res.status(500).json({error:"TMDB request failed."});
  }
}
