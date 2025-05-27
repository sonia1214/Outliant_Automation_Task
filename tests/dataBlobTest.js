const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');
const HomePage = require('../pages/HomePage');
const chromedriver = require('chromedriver');
const { until } = require('selenium-webdriver');
const { generateDataBlob } = require('../utilis/generateDatablob.js').generateDataBlob;
const apiData = require('../data/apiData.json');

describe('Data Blob Test', function () {
    let driver;
    let homePage;
    this.timeout(120000); // Extend timeout for webdriver interactions

    before(async function () {
        console.log('Launching browser...');
        try {
            console.log('Building driver...');
            chromedriver.path = 'node_modules/chromedriver/lib/chromedriver/chromedriver.exe';
            const chromeOptions = new chrome.Options();
            chromeOptions.addArguments('--ignore-certificate-errors');
            driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
            console.log('Driver built successfully');
            await driver.manage().window().maximize();
        } catch (err) {
            console.error('Error launching browser:', err);
            throw err;
        }
        homePage = new HomePage(driver);
        console.log('Opening homepage...');
        await homePage.open();
        console.log('Homepage opened successfully');
    });

    after(async function () {
        if (driver) {
            try {
                console.log('Closing browser...');
                await driver.quit();
                console.log('Browser closed.');
            } catch (error) {
                console.error('Error closing browser:', error);
            }
        }
    });

    it('Verify data blob encoding and navigation', async function () {
        console.log('Starting data blob encoding and navigation test...');
        const jsonData = JSON.stringify(apiData.testData);
        const base64Encoded = Buffer.from(jsonData).toString('base64');
        console.log('Data blob generated successfully.');
        const dataBlob = base64Encoded;

        const testLink = `${apiData.membership_agreement_url}${dataBlob}`;
        console.log('Test link generated successfully.');

    });

    it('Verify data blob encoding and navigation with different data', async function () {
        // 1. anotherTestData payload (same as what you'll encode in the URL)
        const payloadString = JSON.stringify(apiData.anotherTestData);
        const base64Payload = Buffer.from(payloadString).toString('base64');
        const encodedData = encodeURIComponent(base64Payload);

        const testUrl = `${apiData.membership_agreement_url}${encodedData}`;
        console.log('Test URL generated successfully.');
        
        // 2. Make a direct POST request to the /validate endpoint using node-fetch
        const fetch = require('node-fetch').default; // Import node-fetch

        try {
            const response = await fetch(testUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(apiData.anotherTestData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            console.log("\n--- /validate Payload Received ---");
            console.log(data);

            // Check some key fields for confirmation
            if (
                (data.member_email === apiData.anotherTestData.member_email) &&
                data.member_first_name === apiData.anotherTestData.member_first_name &&
                data.member_street_address === apiData.anotherTestData.member_street_address
            ) {
                console.log("Payload validated successfully.");
            } else {
                console.error("Payload does NOT match expected values.");
            }
        } catch (error) {
        }
    });

    it('Verify data blob encoding and navigation with blank email', async function () {
        // 1. Expected payload (same as what you'll encode in the URL)

        const expectedPayload = apiData.blankEmailTestData;

        if (expectedPayload.member_email === '') {
            delete expectedPayload.member_email;
        }

        const payloadString = JSON.stringify(expectedPayload);
        const base64Payload = Buffer.from(payloadString).toString('base64');
        const encodedData = encodeURIComponent(base64Payload);

        const testUrl = `${apiData.membership_agreement_url}${encodedData}`;
        console.log('Test URL generated successfully.');
        
        // 2. Make a direct POST request to the /validate endpoint using node-fetch
        const fetch = require('node-fetch').default; // Import node-fetch

        try {
            const response = await fetch(testUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(expectedPayload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            console.log("\n--- /validate Payload Received ---");
            console.log(data);

            // Check some key fields for confirmation
            if (
                (!expectedPayload.member_email || data.member_email === expectedPayload.member_email) &&
                data.member_first_name === expectedPayload.member_first_name &&
                data.member_street_address === expectedPayload.member_street_address
            ) {
                console.log("Payload validated successfully.");
            } else {
                console.error("Payload does NOT match expected values.");
            }
        } catch (error) {
        }
    });
});
