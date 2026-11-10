import { Hono } from "hono"

const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Session sharing has been discontinued | opencode</title>
    <style>
      :root {
        --text: hsl(224, 10%, 10%);
        --text-secondary: hsl(224, 7%, 46%);
        --border: hsl(224, 6%, 77%);
        --background: #ffffff;
        --logo-a: #211e1e;
        --logo-b: #656363;
        --logo-c: #cfcecd;
        --padding: 3rem;
        --vertical-padding: 1.5rem;
        --heading: 1.375rem;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --text: hsl(0, 0%, 100%);
          --text-secondary: hsl(224, 6%, 66%);
          --border: hsl(224, 6%, 36%);
          --background: #0c0c0e;
          --logo-a: #f1ecec;
          --logo-b: #b7b1b1;
          --logo-c: #4b4646;
        }
      }
      @media (max-width: 30rem) {
        :root {
          --padding: 1rem;
          --vertical-padding: 0.75rem;
          --heading: 1rem;
        }
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: calc(var(--padding) + 1rem);
        background: var(--background);
        color: var(--text);
        font-family: "Berkeley Mono", "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          "Liberation Mono", "Courier New", monospace;
        -webkit-font-smoothing: antialiased;
      }
      main {
        max-width: 40rem;
        width: 100%;
        border: 1px solid var(--border);
      }
      header {
        padding: var(--padding);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--vertical-padding);
        text-align: center;
      }
      svg {
        width: clamp(200px, 85vw, 400px);
        height: auto;
      }
      .a {
        fill: var(--logo-a);
      }
      .b {
        fill: var(--logo-b);
      }
      .c {
        fill: var(--logo-c);
      }
      h1 {
        margin: 0;
        font-size: var(--heading);
        font-weight: 500;
        line-height: 1.25;
        text-transform: uppercase;
      }
      p {
        margin: 0;
        max-width: 28rem;
        line-height: 1.6;
        color: var(--text-secondary);
      }
      nav {
        display: flex;
        border-top: 1px solid var(--border);
      }
      nav a {
        flex: 1;
        padding: var(--vertical-padding) 1rem;
        text-align: center;
        text-transform: uppercase;
        line-height: 1.4;
        color: var(--text);
        text-decoration: underline;
        text-underline-offset: 0.1875rem;
        text-decoration-thickness: 1px;
      }
      nav a + a {
        border-left: 1px solid var(--border);
      }
      @media (max-width: 40rem) {
        nav {
          flex-direction: column;
        }
        nav a + a {
          border-left: none;
          border-top: 1px solid var(--border);
        }
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <a href="https://opencode.ai" aria-label="OfeCode">
          <svg viewBox="0 0 204 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="c" d="M18 30H6V18H18V30Z" />
          <path class="b" d="M18 12H6V30H18V12ZM24 36H0V6H24V36Z" />
          <path class="b" d="M30 36V0H54V6H36V18H54V24H36V36Z" />
          <path class="c" d="M84 24V30H66V24H84Z" />
          <path class="b" d="M84 24H66V30H84V36H60V6H84V24ZM66 18H78V12H66V18Z" />
          <path class="c" d="M114 30H96V18H114V30Z" />
          <path class="a" d="M114 12H96V30H114V36H90V6H114V12Z" />
          <path class="c" d="M138 30H126V18H138V30Z" />
          <path class="a" d="M138 12H126V30H138V12ZM144 36H120V6H144V36Z" />
          <path class="c" d="M168 30H156V18H168V30Z" />
          <path class="a" d="M168 12H156V30H168V12ZM174 36H150V6H168V0H174V36Z" />
          <path class="c" d="M204 24V30H186V24H204Z" />
          <path class="a" d="M186 12V18H198V12H186ZM204 24H186V30H204V36H180V6H204V24Z" />
          </svg>
        </a>
        <h1>Session sharing has been discontinued</h1>
        <p>OfeCode no longer hosts shared sessions. This link and its content are no longer available.</p>
      </header>
      <nav>
        <a href="https://opencode.ai">Home</a>
        <a href="https://opencode.ai/docs">Docs</a>
        <a href="https://github.com/anomalyco/opencode">GitHub</a>
        <a href="https://opencode.ai/discord">Discord</a>
      </nav>
    </main>
  </body>
</html>`

// V1 clients still create, sync, and remove shares on this host, and the V1 GitHub Action fails its run when share
// creation fails. Accept those requests without storing anything so existing clients keep working.
export default new Hono()
  .post("/api/share", async (c) => {
    const body = await c.req.json<{ sessionID: string }>()
    const id = body.sessionID.slice(-8)
    return c.json({ id, secret: "discontinued", url: new URL(`/share/${id}`, c.req.url).toString() })
  })
  .post("/api/share/:shareID/sync", (c) => c.json({}))
  .delete("/api/share/:shareID", (c) => c.json({}))
  .all("*", (c) => c.html(page, 410))
