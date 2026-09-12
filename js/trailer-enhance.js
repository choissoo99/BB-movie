(()=>{
  const detailBody=document.querySelector('#detailBody');
  if(!detailBody)return;

  function enhanceTrailer(){
    const iframe=detailBody.querySelector('.trailer-wrap iframe');
    const copy=detailBody.querySelector('.detail-copy');
    if(!copy)return;

    const oldButton=copy.querySelector('#detailTrailerButton');
    if(!iframe){
      oldButton?.remove();
      return;
    }

    const trailerSection=iframe.closest('.detail-section');
    if(trailerSection&&!trailerSection.id)trailerSection.id='movieTrailerSection';

    if(!copy.querySelector('#detailTrailerButton')){
      const actions=copy.querySelector('.detail-actions')||copy;
      const button=document.createElement('button');
      button.id='detailTrailerButton';
      button.className='detail-trailer-button';
      button.type='button';
      button.innerHTML='<span aria-hidden="true">▶</span> 예고편 보기';
      button.addEventListener('click',()=>{
        trailerSection?.scrollIntoView({behavior:'smooth',block:'start'});
        setTimeout(()=>iframe.focus({preventScroll:true}),450);
      });
      actions.appendChild(button);
    }

    const src=iframe.getAttribute('src')||'';
    if(src&&!src.includes('rel=0')){
      const separator=src.includes('?')?'&':'?';
      iframe.setAttribute('src',`${src}${separator}rel=0&modestbranding=1`);
    }
    iframe.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
  }

  const observer=new MutationObserver(()=>enhanceTrailer());
  observer.observe(detailBody,{childList:true,subtree:true});
  enhanceTrailer();
})();
