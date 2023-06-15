import { Actor } from 'apify';
import { CheerioCrawler, Dictionary } from 'crawlee';

await Actor.init();

const input: Dictionary | null = await Actor.getInput();
if (input === null) {
    throw new Error('Input is not defined.');
}
const { urlTrail, matchId } = input;

const proxyConfiguration = await Actor.createProxyConfiguration({
    groups: ['RESIDENTIAL'],
    countryCode: 'CZ',
});

const crawler = new CheerioCrawler({
    proxyConfiguration,
    async requestHandler({ $ }) {
        const pageContent = $('html').html();
        await Actor.pushData({
            status: 200,
            data: [{ matchId: matchId, rawPageContent: pageContent }],
        });
    },
});

await crawler.run([`https://www.hltv.org/matches/${matchId}/${urlTrail}`]);
await Actor.exit();
