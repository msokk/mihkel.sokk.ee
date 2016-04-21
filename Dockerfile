FROM abiosoft/caddy

COPY Caddyfile /etc/Caddyfile

ENV HOOK_SECRET **Change Me**
