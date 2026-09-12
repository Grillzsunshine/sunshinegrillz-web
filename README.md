# Sitio web de Sunshine Grillz

Landing page oficial de **Sunshine Grillz** (joyería dental, Medellín). Una sola página, pensada para convertir visitas en conversaciones de WhatsApp y para posicionar en Google.

- **Producción:** https://sunshinegrillz.com
- **Editor de contenido:** https://sunshinegrillz.com/admin/ (Sveltia CMS, inicio de sesión con GitHub)
- **Manual del dueño:** https://sunshinegrillz.com/manual/

## Cómo funciona

```
content/*.json  ──►  Eleventy (src/index.njk)  ──►  _site/  ──►  Netlify (publica)
      ▲
      └── /admin/ (Sveltia CMS) guarda los cambios directo en GitHub
```

1. El dueño edita textos y fotos en `/admin/`. Sveltia CMS escribe los JSON de `content/` y sube las fotos a `src/img/uploads/` (convertidas a WebP ≤1800 px en el navegador) haciendo un commit en `main`.
2. Netlify detecta el commit y ejecuta `npm run build` (ver `netlify.toml`).
3. Eleventy genera `_site/`: HTML estático + cada `<img>` convertida a AVIF/WebP/JPEG en 4 tamaños (`@11ty/eleventy-img`) + favicons a partir del logo + `sitemap.xml` + `robots.txt`.

No hay base de datos, ni servidor propio, ni dependencias externas en tiempo de ejecución (las fuentes están en `src/fonts/`).

## Estructura

| Ruta | Qué es |
|---|---|
| `content/negocio.json` | Nombre, WhatsApp, Instagram, ciudad, SEO, aviso/promo, pixel/analytics |
| `content/textos.json` | Portada, materiales, pasos, tarjetas destacadas, cierre |
| `content/galeria.json` | Galería de trabajos (lista de fotos) |
| `content/preguntas.json` | Preguntas frecuentes |
| `src/index.njk` | La plantilla de la página (única) |
| `src/_includes/site.css` / `site.js` | Estilos y el único script (barra fija de WhatsApp en móvil) |
| `src/admin/config.yml` | Qué campos ve el dueño en el editor (etiquetas en español) |
| `src/admin/sveltia-cms.js` | Sveltia CMS **0.211.1**, copiado al repo para no depender de un CDN |
| `src/img/uploads/` | Fotos subidas desde el editor |
| `src/manual/index.njk` | Manual del dueño (`/manual/`, noindex) |
| `src/_headers` | Cabeceras de Netlify (caché, seguridad, noindex en /admin y /manual) |
| `eleventy.config.js` | Configuración del generador |

## Desarrollo local

```bash
npm install
npm run dev      # http://localhost:8080 con recarga automática
npm run build    # genera _site/
```

Requiere Node 20+ (en Netlify se usa Node 22, ver `netlify.toml`).

## Entrega / cuentas

Todo vive en cuentas del dueño del negocio:

- **GitHub** — este repositorio.
- **Netlify** — hosting, dominio y DNS; además provee el login OAuth del editor (*Project configuration → Access & security → OAuth → GitHub*, con una OAuth App creada en el GitHub del dueño con callback `https://api.netlify.com/auth/done`).

Al cambiar de cuenta/repositorio hay que actualizar `backend.repo` en `src/admin/config.yml`.

## Actualizar el editor (opcional)

Sveltia CMS está en beta y evoluciona rápido; la versión fijada funciona sola. Para actualizarla:

```bash
curl -L https://unpkg.com/@sveltia/cms@latest/dist/sveltia-cms.js -o src/admin/sveltia-cms.js
```

y probar `/admin/` antes de hacer commit. Notas de versiones: https://github.com/sveltia/sveltia-cms/releases
