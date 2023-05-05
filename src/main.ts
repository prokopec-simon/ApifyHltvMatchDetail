import { Actor } from "apify";
import { CheerioCrawler } from "crawlee";

await Actor.init();

const input = await Actor.getInput();
const inputJson = JSON.stringify(input);
const inputObject = JSON.parse(inputJson);
const matchId = inputObject.matchId;
const matchesUrl = "https://www.hltv.org/matches/" + matchId + "/a";
const startUrls = [matchesUrl];
const proxyConfiguration = await Actor.createProxyConfiguration();

const crawler = new CheerioCrawler({
    proxyConfiguration,
    async requestHandler({ $ }) {
        const pageContent = $("html").html();
        await Actor.pushData({
            matchId: matchId,
            fullUrl: matchesUrl,
            pageContent: pageContent,
        });
    },
});

await crawler.run(startUrls);
await Actor.exit();
