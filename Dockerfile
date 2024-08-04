FROM denoland/deno:1.45.5

EXPOSE 8000

WORKDIR /app

ADD . .
RUN deno task build
ENV NODE_ENV=production

CMD ["run", "--allow-all", "--unstable-kv", "main.ts"]