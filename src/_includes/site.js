// Barra fija de WhatsApp (solo móvil): aparece después de la portada y se esconde cuando el botón final está en pantalla.
(function(){
  var sticky = document.querySelector(".sticky-cta");
  if (!sticky || !("IntersectionObserver" in window)) return;
  var watch = [document.querySelector(".hero"), document.querySelector(".final .btn")].filter(Boolean);
  var visible = new Set();
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ e.isIntersecting ? visible.add(e.target) : visible.delete(e.target); });
    sticky.classList.toggle("show", visible.size === 0);
  }, { threshold: 0.05 });
  watch.forEach(function(el){ io.observe(el); });
})();
