const puppeteer = require('puppeteer');


const URL_TEST_1 =
    "https://www.microsoft.com/en-us/p/xbox-wireless-controller/8t2d538wc7mn?cid=msft_web_collection&activetab=pivot%3aoverviewtab";
  const URL_TEST_2 =
    "https://www.microsoft.com/en-us/p/turtle-beach-stealth-700-gen-2-premium-wireless-gaming-headset-for-xbox-one-and-xbox-series-x-s/8wh200q1jg76?cid=msft_web_collection&activetab=pivot%3aoverviewtab";
  const URL_TEST_3 =
    "https://www.microsoft.com/en-us/p/devialet-phantom-reactor-legs/8qxx6mmhl194?cid=msft_web_collection&activetab=pivot%3aoverviewtab";



(async () => {
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();

    const results = []; // collects all results

    let paused = false;
    let pausedRequests = [];

    const nextRequest = () => { // continue the next request or "unpause"
        if (pausedRequests.length === 0) {
            paused = false;
        } else {
            // continue first request in "queue"
            (pausedRequests.shift())(); // calls the request.continue function
        }
    };

    await page.setRequestInterception(true);
    page.on('request', request => {
        if (paused) {
            pausedRequests.push(() => request.continue());
        } else {
            paused = true; // pause, as we are processing a request now
            request.continue();
        }
    });

    page.on('requestfinished', async (request) => {
        const response = await request.response();

        const responseHeaders = response.headers();
        let responseBody;
        if (request.redirectChain().length === 0) {
            // body can only be access for non-redirect responses
            responseBody = await response.buffer();
        }

        const information = {
            url: request.url(),
            requestHeaders: request.headers(),
            requestPostData: request.postData(),
            responseHeaders: responseHeaders,
            responseSize: responseHeaders['content-length'],
            responseBody,
        };
        results.push(information);

        nextRequest(); // continue with next request
    });
    page.on('requestfailed', (request) => {
        // handle failed request
        nextRequest();
    });

    await page.goto(URL_TEST_1, { waitUntil: 'networkidle0' });
    console.log(results);

    await browser.close();
})();