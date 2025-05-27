# Instructions to run tests

To run the tests, execute the following command:

```
npm test
```

This command will run the tests located in the `tests/studio-booking-flow.js` and `tests/dataBlobTest.js` files using Mocha, with a timeout of 120000ms and the allure-mocha reporter.

To generate the allure report, execute the following commands:

```
npx allure generate allure-results -o allure-report --clean
npx allure open allure-report
```

The first command generates the allure report from the allure-results directory, and the second command opens the allure report in the browser.
