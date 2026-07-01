# Cloudflare quick tunnel testing

Use this when you want other people to open your local Digimium site from their phone or computer.

For normal local-only work, use:

```bash
npm run dev
```

That behaves like the regular Vite dev server.

## 1. Stop old dev servers

If a Vite terminal is already running, press `control + c`.

The tunnel command uses a fixed port: `5173`. If another Vite server is still running, the tunnel server will stop instead of silently moving to `5174`.

## 2. Start the website

Terminal 1:

```bash
npm run dev:tunnel
```

You should see:

```text
Local:   http://localhost:5173/
Network: http://...
```

## 3. Start Cloudflare

Terminal 2:

```bash
npm run tunnel
```

Cloudflare will print a public URL ending with:

```text
.trycloudflare.com
```

Share that URL with testers.

## If Cloudflare says connection refused

Check these first:

1. `npm run dev:tunnel` is still running.
2. The Vite URL is exactly `http://localhost:5173/`.
3. You did not start plain `npm run dev` after the tunnel server.
4. Stop both terminals with `control + c`, then start again from step 2.
