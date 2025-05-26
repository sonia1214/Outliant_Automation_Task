const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');
const HomePage = require('../pages/HomePage');
const chromedriver = require('chromedriver');
const { until } = require('selenium-webdriver');
const { switchToIframe } = require('../utilis/iframeUtils');
const { switchToBookClassIframe } = require('../utilis/iframeUtils');
const cityData = require('../data/city.json');

/**
 * Test suite for Verifying Studio Information Consistency on Free Class Booking Page
 */
describe('Verify Studio Information Consistency on Free Class Booking Page', function () {
    let driver;
    let homePage;
    this.timeout(120000); // Extend timeout for webdriver interactions

    /**
     * Setup function to launch the browser and open the homepage before running the tests.
     */
    before(async function () {
        console.log('Launching browser...');
        try {
            console.log('Building driver...');
            chromedriver.path = 'node_modules/chromedriver/lib/chromedriver/chromedriver.exe';
            driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options()).build();
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
        // Set implicit wait
        // await driver.manage().setTimeouts({ implicit: 40000 });
    });

    /**
     * Teardown function to close the browser after running the tests.
     */
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

    it('Navigate to the Free Class Booking page, extract studio details (city, state, ZIP, phone) from the studio page, and verify they match the booking form information.', async function () {
        console.log('Opening OrangeTheory homepage...');
        // Open the OrangeTheory homepage
        await homePage.open();

        console.log('Clicking Locations link...');
        // Click the Locations link
        await homePage.clickLocations();


        console.log('Switching to iframe...');
        // Switch to the iframe where the location information is displayed
        await switchToIframe(driver);

        console.log('Entering city...');
        // Enter the city name to search for studios
        await homePage.addCityName();

        // Get the displayed city name
        const cityNameText = await homePage.getCityNameLabelText();
        // Log the city name
        console.log('City Name:', cityNameText);

        // Get the full address of the studio
        const fullAddress = await homePage.getAddressCityStateZipText();
        // Split the address into lines
        const lines = fullAddress.split('\n');
        // Extract the address line
        const addressLine = lines[0] || 'N/A';
        // Extract the city, state, and zip line
        const cityStateZipLine = lines[1] || 'N/A';

        // Initialize variables for city, state, and zip
        let city = 'N/A', state = 'N/A', zip = 'N/A';
        // Use regex to extract city, state, and zip from the cityStateZipLine
        const match = cityStateZipLine.match(/^(.+?),\s*([A-Z]{2})\s+(\d{5})$/);
        // If the regex matches, extract the values
        if (match) {
            city = match[1].trim();
            state = match[2];
            zip = match[3];
        }

        // Get the phone number from the studio page
        const phone = await homePage.getPhoneFromStudioPageText();

        // Create a new Map to store the studio information
        const studioInfo = new Map();
        // Store the extracted information in the Map
        studioInfo.set('Address', addressLine);
        studioInfo.set('City', city);
        studioInfo.set('State', state);
        studioInfo.set('Zip', zip);
        studioInfo.set('Phone', phone);

        // Log the studio information stored in the Map
        console.log('\n Studio Info (stored in Map):');
        // Iterate over the Map and log each key-value pair
        for (const [key, value] of studioInfo.entries()) {
            console.log(`${key}: ${value}`);
        }

        // Click the Try Class button
        await homePage.clickTryClassButton();
        // Log message indicating the click on the Try Class button
        console.log('Clicking Try Class button...');

        // Switch back to the default content
        await driver.switchTo().defaultContent();
        // Log message indicating switching back to the default content
        console.log('Switching back to default content...');

        // Click the Hide Studio Info button
        await homePage.clickHideStudioInfoButton();
        // Log message indicating the click on the Hide Studio Info button
        console.log('Clicking Hide Studio Info button...');

        // Get the studio information text from the homepage
        const studioInfoText = await homePage.getStudioInfoText();
        // Split the studio information text into lines
        const studioInfoLines = studioInfoText.split('\n');
        // Extract the studio city line
        const studioCityLine = studioInfoLines[1] || 'N/A';

        // Initialize variables for studio city and state
        let studioCity = 'N/A';
        let studioState = 'N/A';

        // If the studioCityLine is not 'N/A', extract the city and state
        if (studioCityLine !== 'N/A') {
            // Use regex to extract the city and state
            const cityStateMatch = studioCityLine.match(/^(.+?)\s*-\s*(.+?),\s*([A-Z]{2})$/);
            // If the regex matches, extract the values
            if (cityStateMatch) {
                studioCity = cityStateMatch[1].trim();
                studioState = cityStateMatch[3];
            }
        }

        // Log the studio city
        console.log('Studio City:', studioCity);
        // Log the studio state
        console.log('Studio State:', studioState);

        // Get the phone number from the studio page
        const phoneFromStudioPage = await homePage.getPhoneInfoText();
        // Log the studio phone number
        console.log('Studio Phone:', phoneFromStudioPage);

        // Add assertions to verify the extracted information
        expect(studioInfo.get('City')).to.equal(studioCity);
        expect(studioInfo.get('State')).to.equal(studioState);
        expect(studioInfo.get('Phone')).to.equal(phoneFromStudioPage);
        console.log('Assertions passed: City, State, and Phone match the expected values.');
    });

    it("Verify error message on empty form submission for first name and last name text field", async function () {
       
        await switchToBookClassIframe(driver);

        console.log('Clicking Next button...');
        // Click the Next button
        await homePage.clickNextButton();

        console.log('Getting first name alert text...');
        // Get the text of the first name alert message
        const alertText = await homePage.getFirstNameAlertText();
        console.log('Asserting first name alert text...');
        // Assert that the alert text matches the expected message
        expect(alertText).to.equal(cityData.firstNameAlert);

        console.log('Getting last name alert text...');
        // Get the text of the last name alert message
        const lastNameAlertText = await homePage.getLastNameAlertText();
        console.log('Asserting last name alert text...');
        // Assert that the alert text matches the expected message
        expect(lastNameAlertText).to.equal(cityData.lastNameAlert);

        console.log('Assertions passed: First name and last name alert texts match the expected values.');

        const emailAlertText = await homePage.getEmailAlertText();
        console.log('Asserting email alert text...');
        // Assert that the email alert text matches the expected message
        expect(emailAlertText).to.equal(cityData.emailAlert);   
        console.log('Assertions passed: Email alert text matches the expected value.');
        console.log('Test completed successfully: Error messages verified for empty form submission.');
        

    });

    
});
