import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const LOCAL_API_URL = process.env.WISDOM_API_URL ?? "http://127.0.0.1:3000";
const HTTP_MCP_URL = process.env.MCP_HTTP_URL ?? `${LOCAL_API_URL.replace(/\/$/, "")}/api/mcp`;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
}

async function verifyClient(label, client) {
  const tools = await client.listTools();
  const prompts = await client.listPrompts();
  const resources = await client.listResources();

  console.log(`[${label}] tools: ${tools.tools.length}`);
  console.log(`[${label}] prompts: ${prompts.prompts.length}`);
  console.log(`[${label}] resources: ${resources.resources.length}`);

  const toolNames = tools.tools.map((tool) => tool.name);
  for (const required of [
    "search",
    "fetch",
    "about_wisdom",
    "search_works",
    "get_work",
    "get_agenda_overview",
    "get_methodology",
    "get_agenda_indicator",
    "get_country_profile",
    "get_future_indicator",
  ]) {
    assert(toolNames.includes(required), `[${label}] missing tool: ${required}`);
  }

  assert(prompts.prompts.some((prompt) => prompt.name === "wisdom-start-here"), `[${label}] missing prompt wisdom-start-here`);
  assert(resources.resources.some((resource) => resource.uri === "wisdom://about"), `[${label}] missing resource wisdom://about`);

  const about = await client.callTool({ name: "about_wisdom", arguments: {} });
  const aboutText = about.content?.[0]?.type === "text" ? about.content[0].text : "";
  assert(aboutText.includes("Wisdom"), `[${label}] about_wisdom returned unexpected content`);

  const search = await client.callTool({ name: "search_works", arguments: { query: "Achebe", limit: 3 } });
  const searchText = search.content?.[0]?.type === "text" ? search.content[0].text : "";
  assert(searchText.includes("Achebe"), `[${label}] search_works did not return Achebe results`);

  const compatibilitySearch = await client.callTool({ name: "search", arguments: { query: "Achebe", limit: 3 } });
  const compatibilitySearchText = compatibilitySearch.content?.[0]?.type === "text" ? compatibilitySearch.content[0].text : "";
  const compatibilitySearchJson = JSON.parse(compatibilitySearchText);
  const firstCompatibilityResult = compatibilitySearchJson.results?.[0];
  assert(firstCompatibilityResult?.id, `[${label}] search returned no fetchable results`);

  const compatibilityFetch = await client.callTool({ name: "fetch", arguments: { id: firstCompatibilityResult.id } });
  const compatibilityFetchText = compatibilityFetch.content?.[0]?.type === "text" ? compatibilityFetch.content[0].text : "";
  const compatibilityFetchJson = JSON.parse(compatibilityFetchText);
  assert(
    compatibilityFetchJson.id === firstCompatibilityResult.id &&
      compatibilityFetchJson.title &&
      compatibilityFetchJson.text &&
      compatibilityFetchJson.url,
    `[${label}] fetch returned malformed compatibility document`,
  );

  const searchApi = await fetchJson(`${LOCAL_API_URL.replace(/\/$/, "")}/api/search?q=Achebe&limit=1`);
  const firstResult = searchApi.results?.[0];
  assert(firstResult?.id, `[${label}] search API did not return a stable work ID for verification`);

  const work = await client.callTool({ name: "get_work", arguments: { id: firstResult.id } });
  const workText = work.content?.[0]?.type === "text" ? work.content[0].text : "";
  assert(
    workText.includes(firstResult.title) &&
      workText.includes(firstResult.author) &&
      workText.includes("Text in Wisdom"),
    `[${label}] get_work(${firstResult.id}) returned unexpected work`,
  );

  const agenda = await client.callTool({ name: "get_agenda_overview", arguments: {} });
  const agendaText = agenda.content?.[0]?.type === "text" ? agenda.content[0].text : "";
  assert(agendaText.includes("Agenda 2063"), `[${label}] get_agenda_overview returned unexpected content`);
  assert(agendaText.includes("Partial composite"), `[${label}] get_agenda_overview did not disclose partial coverage`);

  const methodology = await client.callTool({ name: "get_methodology", arguments: {} });
  const methodologyText = methodology.content?.[0]?.type === "text" ? methodology.content[0].text : "";
  assert(methodologyText.includes("linear interpolation"), `[${label}] get_methodology returned unexpected content`);

  const indicator = await client.callTool({ name: "get_agenda_indicator", arguments: { id: "life-expectancy" } });
  const indicatorText = indicator.content?.[0]?.type === "text" ? indicator.content[0].text : "";
  assert(indicatorText.toLowerCase().includes("life expectancy"), `[${label}] get_agenda_indicator failed for life-expectancy`);

  const country = await client.callTool({ name: "get_country_profile", arguments: { country: "Kenya" } });
  const countryText = country.content?.[0]?.type === "text" ? country.content[0].text : "";
  assert(countryText.includes("Kenya Agenda 2063 profile"), `[${label}] get_country_profile failed for Kenya`);

  const future = await client.callTool({ name: "get_future_indicator", arguments: { id: "gdp-per-capita" } });
  const futureText = future.content?.[0]?.type === "text" ? future.content[0].text : "";
  assert(futureText.includes("Current Path"), `[${label}] get_future_indicator failed for gdp-per-capita`);
}

async function verifyStdio() {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["dist/index.js"],
    cwd: new URL("../mcp/", import.meta.url).pathname,
    env: {
      ...process.env,
      WISDOM_API_URL: LOCAL_API_URL,
    },
    stderr: "pipe",
  });

  if (transport.stderr) {
    transport.stderr.on("data", (chunk) => {
      const text = String(chunk).trim();
      if (text) console.error(`[stdio stderr] ${text}`);
    });
  }

  const client = new Client({ name: "wisdom-verify-stdio", version: "1.0.0" }, { capabilities: {} });
  await client.connect(transport);
  try {
    await verifyClient("stdio", client);
  } finally {
    await client.close();
  }
}

async function verifyHttp() {
  const transport = new StreamableHTTPClientTransport(new URL(HTTP_MCP_URL));
  const client = new Client({ name: "wisdom-verify-http", version: "1.0.0" }, { capabilities: {} });
  await client.connect(transport);
  try {
    await verifyClient("http", client);
  } finally {
    await client.close();
  }
}

async function main() {
  await verifyStdio();
  await verifyHttp();
  console.log("Wisdom MCP verification passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
