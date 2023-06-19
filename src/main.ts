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

const fullUrl = `https://www.hltv.org/matches/${matchId}/${urlTrail}`;

const crawler = new CheerioCrawler({
    proxyConfiguration,
    async requestHandler({ $ }) {
        const pageContent = $('html').html();
        await Actor.pushData({
            status: 200,
            data: [
                {
                    matchId: matchId,
                    rawPageContent: pageContent,
                    matchUrl: fullUrl,
                },
            ],
        });
    },
});

await crawler.run([fullUrl]);
await Actor.exit();
