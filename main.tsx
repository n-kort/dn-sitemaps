import { serve } from "https://deno.land/std@0.120.0/http/server.ts";

const RM = '<?xml-stylesheet type="text/xsl" href="//dn-api.nsdoku.de/wp-content/plugins/wordpress-seo/css/main-sitemap.xsl"?>'
const FROM = '//dn-api.nsdoku.de'
const TO = '//departure-neuaubing.nsdoku.de'

async function handler(req: Request): Promise<Response> | Response {
  const { pathname } = new URL(req.url)

  if (!pathname || !pathname.includes('.xml')) {
    return new Response('Not Found', {
      status: 404
    })
  }
  
  const sitemap = await fetch('https://dn-api.nsdoku.de' + pathname)
    .then(res => res.text())

  const directTo = !sitemap.includes('.xml</loc')
  const mod = sitemap.replace(RM, '').replaceAll(FROM, TO + (!directTo ? '/xml' : ''))

  return new Response(mod, {
    status: 200,
    headers: {
      'Content-Type': 'text/xml; charset=UTF-8'
    }
  });
}

await serve(handler);
