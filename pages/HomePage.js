const { By, until } = require('selenium-webdriver');

/**
 * Represents the Home page of the Orangetheory website.
 */
class HomePage {
    /**
     * Constructor for the HomePage class.
     * @param {WebDriver} driver - The Selenium WebDriver instance.
     */
    constructor(driver) {
        this.driver = driver;
        this.locationsLink = By.xpath("(//a[text()='Locations'])[1]");
        this.cityNameTextField = By.xpath(`(//h3[text()='Enter your city name & click "search"']//parent::div//input)[1]`);
        this.cityNameLabelFromStudio = By.xpath(`(//div[@class='first:mt-0'])[1]//div[1]//h2`);
        this.addressCityStateZipFromStudioPage = By.xpath(`(//div[@class='first:mt-0'])[1]//div[1]//p`);
        this.phoneFromStudioPage = By.xpath(`(//div[@class='first:mt-0'])[1]//div[1]//button//span`);
        this.tryClassButton = By.xpath(`(//button[text()='Try A Class'])[1]`);
        this.hideStudioInfoBtn = By.xpath(`//div[text()='Hide Studio Information']//parent::div//img`);
        this.studioInfo = By.xpath(`//div[@aria-label='Studio Information']`);
        this.phoneInfo = By.xpath(`//div[@aria-label='Studio Information']//a`);
        this.nextBtn = By.xpath(`//button[@aria-label='Next']`);
        this.firstNameAlert = By.xpath(`//span[@id='firstName-error']`);
        this.lastNameAlert = By.xpath(`//span[@id='lastName-error']`);
        this.emailAlert = By.xpath(`//span[@id='email-error']`);
    }

    /**
     * Opens the Orangetheory website.
     */
    async open() {
        console.log('Opening the Orangetheory website...');
        await this.driver.get('https://www.sit.orangetheory.com/en-us');
        console.log('Orangetheory website opened successfully.');
    }

    /**
     * Clicks the Locations link.
     */
    async clickLocations() {
        // Wait until the element is located and visible
        const element = await this.driver.wait(
            until.elementLocated(this.locationsLink),
            10000, // Timeout in milliseconds
            'Locations link not found'
        );

        await this.driver.wait(
            until.elementIsVisible(element),
            10000,
            'Locations link is not visible'
        );

        // Now safe to click
        await element.click();
    }

    /**
     * Adds the city name to the input field.
     */
    async addCityName() {
        try {
            // Wait until the city name input field is located and visible
            const element = await this.driver.wait(
                until.elementLocated(this.cityNameTextField),
                50000,
                'City name field not found'
            );

            await this.driver.wait(
                until.elementIsVisible(element),
                10000,
                'City name field is not visible'
            );

            // Read city name from JSON file
            const fs = require('fs');
            const cityData = JSON.parse(fs.readFileSync('data/city.json', 'utf8'));
            const cityName = cityData['city name'];

            // Enter the city name
            await element.sendKeys(cityName);

            console.log('City name entered successfully.');
        } catch (error) {
            console.error('Error in addCityName():', error);
        }
    }

    /**
     * Gets the city name label text.
     * @returns {Promise<string>} The city name label text.
     */
    async getCityNameLabelText() {
        const element = await this.driver.wait(
            until.elementLocated(this.cityNameLabelFromStudio),
            10000,
            'City Name Label not found'
        );

        // Scroll the element into view using JS
        await this.driver.executeScript("arguments[0].scrollIntoView(true);", element);

        // Wait until the element is visible
        await this.driver.wait(
            until.elementIsVisible(element),
            10000,
            'City Name Label not visible'
        );

        // Return the text
        return await element.getText();
    }

    /**
     * Gets the address city state zip text.
     * @returns {Promise<string>} The address city state zip text.
     */
    async getAddressCityStateZipText() {
        const element = await this.driver.wait(
            until.elementLocated(this.addressCityStateZipFromStudioPage),
            10000,
            'Address City State Zip not found'
        );
        await this.driver.wait(until.elementIsVisible(element), 10000, 'Address City State Zip not visible');
        return await element.getText();
    }

    /**
     * Gets the phone number from the studio page.
     * @returns {Promise<string>} The phone number from the studio page.
     */
    async getPhoneFromStudioPageText() {
        const element = await this.driver.wait(
            until.elementLocated(this.phoneFromStudioPage),
            10000,
            'Phone element not found'
        );
        await this.driver.wait(until.elementIsVisible(element), 10000, 'Phone element not visible');
        return await element.getText();
    }

    /**
     * Clicks the Try A Class button.
     */
    async clickTryClassButton() {
        const element = await this.driver.wait(
            until.elementLocated(this.tryClassButton),
            10000,
            'Try Class button not found'
        );
        await this.driver.wait(until.elementIsVisible(element), 10000, 'Try Class button not visible');
        await element.click();
    }

    /**
     * Clicks the Hide Studio Info button.
     */
    async clickHideStudioInfoButton() {
        // Wait for the element to be located
        const element = await this.driver.wait(
            until.elementLocated(this.hideStudioInfoBtn),
            70000,
            'Hide Studio Info button not found'
        );
        await this.driver.wait(until.elementIsVisible(element), 10000, 'Hide Studio Info button not visible');
        await element.click();
    }

    /**
     * Gets the studio info text.
     * @returns {Promise<string>} The studio info text.
     */
    async getStudioInfoText() {
        this.driver.manage().setTimeouts({ implicit: 5000 });
        // Wait for the element to be located
        const element = await this.driver.wait(
            until.elementLocated(this.studioInfo),
            10000,
            'Studio Info not found'
        );
        await this.driver.wait(until.elementIsVisible(element), 10000, 'Studio Info not visible');
        return await element.getText();
    }

    /**
     * Gets the phone info text.
     * @returns {Promise<string>} The phone info text.
     */
    async getPhoneInfoText() {
        const element = await this.driver.wait(
            until.elementLocated(this.phoneInfo),
            10000,
            'Phone Info not found'
        );
        await this.driver.wait(until.elementIsVisible(element), 10000, 'Phone Info not visible');
        return await element.getText();
    }

    /**
     * Clicks the Next button.
     */
    async clickNextButton() {
        
        const element = await this.driver.wait(
            until.elementLocated(this.nextBtn),
            10000,
            'Next button not found'
        );
        await this.driver.wait(until.elementIsVisible(element), 10000, 'Next button not visible');
        
        console.log('Clicking the Next button using JavaScript.');
        await this.driver.executeScript("arguments[0].click();", element);
    }

    /**
     * Gets the first name alert text.
     * @returns {Promise<string>} The first name alert text.
     */
    async getFirstNameAlertText() {
        const element = await this.driver.wait(
            until.elementLocated(this.firstNameAlert),
            10000,
            'First Name Alert not found'
        );
        await this.driver.wait(until.elementIsVisible(element), 10000, 'First Name Alert not visible');
        return await element.getText();
    }

    /**
     * Gets the last name alert text.       
     * @returns {Promise<string>} The first name alert text.
     */ 

     async getLastNameAlertText() {
        const element = await this.driver.wait(
            until.elementLocated(this.lastNameAlert),
            10000,
            'Last Name Alert not found'
        );
        await this.driver.wait(until.elementIsVisible(element), 10000, 'Last Name Alert not visible');
        return await element.getText();
    }

    /**
     * Gets the email alert text.
     * @returns {Promise<string>} The email alert text.
     */
    async getEmailAlertText() {
        const element = await this.driver.wait(
            until.elementLocated(this.emailAlert),
            10000,
            'Email Alert not found'
        );
        await this.driver.wait(until.elementIsVisible(element), 10000, 'Email Alert not visible');
        return await element.getText();
    }
}

module.exports = HomePage;
