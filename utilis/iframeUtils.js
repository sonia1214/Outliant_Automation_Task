const { By, until } = require('selenium-webdriver');

async function switchToIframe(driver) {
    console.log('Switching to iframe...');
    try {
        const iframe = await driver.wait(until.elementLocated(By.id('locations-iframe')), 20000, 'iframe not found after 20 seconds');
        await driver.switchTo().frame(iframe);
        console.log('Switched to iframe successfully');
    } catch (error) {
        console.error('Error switching to iframe after waiting 20 seconds:', error);
        throw error; // Re-throw the error to prevent silent failures
    }
}

async function switchToBookClassIframe(driver) {
    console.log('Switching to book-class-1-frame iframe...');
    try {
        const iframe = await driver.wait(until.elementLocated(By.id('book-class-1-frame')), 20000, 'book-class-1-frame not found after 20 seconds');
        await driver.switchTo().frame(iframe);
        console.log('Switched to book-class-1-frame iframe successfully');
    } catch (error) {
        console.error('Error switching to book-class-1-frame iframe after waiting 20 seconds:', error);
        throw error; // Re-throw the error to prevent silent failures
    }
}

module.exports = { switchToIframe, switchToBookClassIframe };
