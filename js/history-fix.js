(function(){
  const detail=document.querySelector('#movieDetail');
  if(!detail)return;

  function movieIdFromUrl(){
    return new URL(location.href).searchParams.get('movie');
  }

  function closeDetailWithoutHistory(){
    detail.classList.add('hidden');
    document.body.style.overflow='';
    document.title='MOVIEBOX - 영화 정보 서비스';
    const ogUrl=document.querySelector('#ogUrl');
    if(ogUrl)ogUrl.content=location.origin;
  }

  window.addEventListener('popstate',()=>{
    if(!movieIdFromUrl()&&!detail.classList.contains('hidden')){
      closeDetailWithoutHistory();
    }
  });

  document.addEventListener('click',event=>{
    if(!event.target.closest('#detailClose'))return;
    if(movieIdFromUrl()&&history.state?.movieId){
      event.preventDefault();
      event.stopImmediatePropagation();
      history.back();
    }
  },true);

  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape'||detail.classList.contains('hidden'))return;
    if(movieIdFromUrl()&&history.state?.movieId){
      event.preventDefault();
      event.stopImmediatePropagation();
      history.back();
    }
  },true);
})();
