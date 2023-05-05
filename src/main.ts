import { Actor } from 'apify';
import { CheerioCrawler } from 'crawlee';

await Actor.init();

const input  = await Actor.getInput();
const matchId = input.matchId;
const matchesUrl = 'https://www.hltv.org/matches/';
const startUrls = [matchesUrl];
const proxyConfiguration = await Actor.createProxyConfiguration();

const crawler = new CheerioCrawler({
    proxyConfiguration,
    async requestHandler({ $ }) {

    const pageContent = $('html').html();
    await Actor.pushData({
        input:input,
        inputDataType: typeof input,
        matchId: matchId,
        content:pageContent
    });
    
    }
});

await crawler.run(startUrls);
await Actor.exit();
