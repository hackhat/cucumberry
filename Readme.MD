# selenium-sync

An easy and intuitive way to manage selenium tests with node.js.
Intuitive because has simple methods and names you already know and not
scriptic names like `getWindowHandles`.



## Install

    npm install selenium-sync --save-dev


## API

Check the **[full API here](https://rawgit.com/hackhat/selenium-sync/v0.0.3/docs/jsduck/index.html)**.

## Why this?

While is not yet complete, is more intuitive than every other selenium
library for node.js. You have real sync code that can be ran and also
a beautiful and intuitive API.



## Features

 - Sync and non blocking using fibers (you can spin your own server from the test);
 - Browser/window/element concepts (easy to understand where you are apply a certain change);
 - Easy multi window management;
 - Easy css selector out of the box;
 - Very friendly [API](https://rawgit.com/hackhat/selenium-sync/v0.0.3/docs/jsduck/index.html) docs with types; 
 - Uses the [selenium for JavaScript](http://selenium.googlecode.com/git/docs/api/javascript/index.html);


### Code features

 - Send special keys easily:

    ```javascript
    el.type('selenium-sync', 'ENTER');
    ```

 - Open a new window:

    ```javascript
    browser.openANewWindow('http://hackhat.com');
    ```

 - Find an element on a window:

    ```javascript
    var el = someWindow.findEl('#search > input:first-child');
    ```

 - Advanced execute scripts:

    ```javascript
    window.executeScript(function(data){
        alert(data.test);
    }, {
        test: 5
    });
    // Will alert the value 5 in the browser
    ```

 - Get current window:

    ```javascript
    var w = browser.getCurrentWindow();
    ```

 - Switch to window by title:

    ```javascript
    browser.switchToWindowByTitle('Facebook');
    ```

 - Wait until a window is closed:

    ```javascript
    var previousWindow = browser.openANewWindow('some url');
    // The previous window will open the Facebook login popup
    // which can be easily grabbed like this:
    var facebookWindow = browser.getWindowByTitle('Facebook');
    // Now do your login and
    browser.waitWindowToBeClosed(facebookWindow);
    // Now you know that the Facebook popup window has been closed.
    ```



## Fiber sync vs promise sync vs blocking sync

There are 3 different ways of using selenium and here are explained:

 - [**Promise sync**](https://code.google.com/p/selenium/wiki/WebDriverJs) (the official way to use selenium) is actually fake, it just queue up a lot of instructions to be ran. The downside is that you need to use callback if your next step requires data from a previous step. 
 - [**Blocking sync**](https://github.com/jsdevel/webdriver-sync) is actually not that bad, but is blocking your node.js thread, therefore one of the first limitation is that you cannot run your server on the same thread. Is also using a wrapper over the Java selenium implementation instead of the JavaScript code provided by selenium.
 - [**Fiber sync**](https://github.com/hackhat/selenium-sync) (this library) allows you to run non-blocking code while having a real sync environment. Best of both worlds. Uses the [JavaScript implementation provided by selenium](https://code.google.com/p/selenium/wiki/WebDriverJs) and [fibers](https://github.com/laverdet/node-fibers) to make it sync.



## Sugar code

 - First install deps: `npm install --save-dev selenium-sync fibers`;

 - Then create a file [`test.js`](./examples/readme/test.js) with those contents:


    ```javascript
    var Future  = require('fibers/future');
    var Browser = require('../../src/index').Browser;

    // Everything in there is sync with fibers.
    Future.task(function(){
        var browser = new Browser();

        // Search on reddit.
        var redditW = browser.getCurrentWindow();
        redditW.goTo('http://www.reddit.com/r/webdev');
        var searchBox = redditW.findEl('#search > input:first-child');
        searchBox.click(); browser.sleep(500);
        redditW.click('#searchexpando > label > input');
        searchBox.sendKeys('hack_hat'); browser.sleep(500);
        redditW.click('#search > input:nth-child(2)'); browser.sleep(500);
        redditW.click('a.author[href="http://www.reddit.com/user/hack_hat"]');
        browser.sleep(2000);

        // Gihub search
        var githubW = browser.openANewWindow('https://github.com/'); browser.sleep(500);
        var searchBox2 = githubW.findEl('.js-site-search-form > input'); browser.sleep(100);
        searchBox2.type('selenium-sync', 'ENTER'); browser.sleep(500);
        githubW.click('a[href="/hackhat/selenium-sync"]'); browser.sleep(500);
        githubW.scrollTo('a[href="#api"]'); browser.sleep(500);
        browser.sleep(2000);

        // Website visit
        var hackhatW = browser.openANewWindow('http://hackhat.com');

        browser.sleep(200000);
    }).detach();
    ```


 - Then run it with `node test.js`;

 - Watch it do the work for you;



## You should also know

 - WindowId: this is provided by the webdriver;
 - The browser updates every x ms to reflect the reality;


### EJSON

In order to make EJSON work you need to require it and provide it on the client side
on the test global variable like this:

    window.test = {EJSON: require('EJSON')};

This is needed to transmit data properly from test to the client browser. If no EJSON is provided it will fall back on JSON.

# Selenium docs

 - [Selenium docs](http://selenium.googlecode.com/git/docs/api/javascript/index.html);
 - [Selenium webdriver](http://selenium.googlecode.com/git/docs/api/javascript/class_webdriver_WebDriver.html)
 - [Java docs](http://selenium.googlecode.com/git/docs/api/java/org/openqa/selenium/package-summary.html);
 - [Until](http://selenium.googlecode.com/git/docs/api/javascript/source/lib/webdriver/until.js.src.html);
 - [Python](http://selenium-python.readthedocs.org/api.html#selenium.webdriver.remote.webdriver.WebDriver.current_window_handle);
 - [ChromeDriver - WebDriver for Chrome](https://sites.google.com/a/chromium.org/chromedriver/);


### The bad part

 - Is not yet complete;
