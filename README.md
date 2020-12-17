# Wayonara front-end client

***Special note:*** *Every command in this document must be executed inside VM.*

Codename: swordfish  
Version: v0.20.5

## Setup

### Prerequisites

*   The official Wayonara development VM
*   [Node.js](https://nodejs.org) ([NVM](https://github.com/creationix/nvm) is highly suggested)
*   An editor / IDE with proper native support (or plugins you'll have to install yourself) for TSLint and EditorConfig (in order of preference: VS Code, Atom, WebStorm)

### First-time-only setup

Do this **if this is the first time ever** this repository reaches you development VM.

#### Set up the environment and clone the repository in place:

```sh
su -
cd /var/www/sites
mkdir -p wayonara-front/current
cd wayonara-front
chown nextop:nextop current
exit
cd ~/sites/wayonara-front
git clone git@github.com:nextop/wayonara-front.git current
cd current
git checkout 0.12 # change this with the current development branch
```

#### Activate the nginx Server Block (think *VirtualHost*) for [locally testing a distribution package](#locally-testing-a-distribution-package):

```sh
ln -s /var/www/sites/wayonara-front/current/wayonara.conf /var/www/sites/nginx_sites_enabled/sites-wayonara-front.conf
```

You may also need to restart the nginx service:

```sh
su -
/etc/init.d/nginx restart
```

### Final preparations

Do this **whenever you just took a fresh clone from the server**.

*   Install dependencies:  
```
npm install
```
**Special note for *Windows* users only:** Compiling versions 0.9.4 and above of `node-sass` on Windows machines requires Visual Studio 2013 WD. If you have multiple VS versions, use npm install with the --msvs_version=2013 flag also use this flag when rebuilding the module with node-gyp or nw-gyp.
*   Create `app/config/config-dev.json` with this content:  
```
{
    "apiServerBaseURL": "",
    "awsWayonaraBucket": "wayonara-myDeveloperName",
    "awsWayonaraCloudfront": "https://xxxxxxxx.cloudfront.net",
    "facebookAppId": "815526928595883",
    "hotjar": false,
    "hotjarId": 302739,
    "siteURL": "http://wayonara.local.nextop.co",
    "notificationServerURL": "http://wayonara.local.nextop.co:7365",
    "stripePublishableKey": "pk_test_PU7scFplad9indtnfewENIk4"
}
```
*   Customize the value of the `awsWayonaraBucket` property in `app/config/config-dev.json`, keeping the `wayonara-` prefix

* **NEVER EVER commit and push `config-dev.json` because it contains the publishable key for Stripe - even though it's just a test key**

* **Note about hotjar: to locally test hotjar behaviour, must set `"hotjar": true` instead of `"hotjar": false`**

## Usage

### Development

1.  Run `npm start` from the repository root.  
    If Bower asks for version resolution about Angular 1, choose the most recent 1.4.x available among the options
1.  Point your browser to <http://localhost:30300> or <http://127.0.0.1:30300>
1.  Happily hack away and the page will refresh itself whenever you change a source file

### Locally testing a distribution package

Before going online in staging or production, you may want to locally test a distribution package.  
A distribution package, or *dist*, is the static version of Wayonara we produce from the source code and deploy on the server.

1.  Run `npm run dist:dev` and wait for webpack to create the bundles
1.  Point your browser at <http://wayonara.local.nextop.co>. Nginx will serve the new bundle.

### Notable NPM scripts

A.k.a. NPM scripts a developer should know about (the rest are helper scripts, or very rarely used ones).

*   `start`: start Webpack devServer listening on <http://localhost:30300>
*   `start:fast`: same as `start`, but doesn't update dependencies first
*   `dist:dev`: create a **dev** distribution package
*   `dist:prod`: create a **prod** distribution package *(mostly used by CI)*
*   `dist:stag`: create a **stag** distribution package *(mostly used by CI)*
*   `version`: update version number and related files, commit, create new tag
*   `test`: single-run the unit tests (NG2 only) and save a coverate report into `doc/coverage`
*   `test:w`: run the unit tests and rerun on changes (no coverage report)
*   `test-e2e:dev`: run e2e tests for **dev** environment. They will executed in dev build url *(siteUrl variable in `config-dev.json`)*.
*   `test-e2e:stag`: run e2e tests for **stag** environment. They will executed in stag build url *(siteUrl variable in `config-stag.json`)*.
*   `test-e2e:prod`: run e2e tests for **prod** environment. They will executed in prod build url *(siteUrl variable in `config-prod.json`)*.

See [Versioning](#versioning) below for more info.

## More info

This section is a work in progress. It will be expanded over time.

### Environments

Important configuration variables are in JSON files for ease of editing.  
They are in `app/config`, one for each environment: `dev`, `prod`, `stag`.

This JSON files are automatically used by our NPM / Webpack based build system.

`config-dev.json` is the personal one. Each developer must have one. It mustn't be committed nor pushed.  
A sample `config-dev.json` is in the *Prerequisites* section of this file.

`config-prod.json` and `config-stag.json` are similar in shape and values.  
One notable change is the presence in the `prod` one of a property dedicated to Google Analytics, which commands its inclusion when preparing a package for the next deploy.

Sample `config-prod.json`:  
```json
{
    "apiServerBaseURL": "https://api.wayonara.com",
    "awsWayonaraBucket": "wayonara-prod",
    "awsWayonaraCloudfront": "https://xxxxxxxx.cloudfront.net",
    "facebookAppId": "518481204967125",
    "siteURL": "https://www.wayonara.com",
    "googleAnalyticsUA": "UA-60765092-1",
    "hotjar": true,
    "fbPixel": true,
    "notificationServerURL": "https://node.wayonara.com",
    "liveChatLicense": "8807229"
}
```

**Note that `config-prod.json` doesn't contain sensible data like the publishable key for Stripe**

### Testing

While the app is a NG1 - NG2 hybrid, we only test the NG2 code.

Our stack: Karma, Jasmine, Webpack.

For e2e testing we use Protractor that relies on Selenium webdriver configured to launch a Google Chrome headless instance.

**Note about e2e tests:** If it is needed to locally test a distribution package, it is needed to create preliminarily desired distribution package via `dist` command.
Before launching, every test found in `e2e/**/*` will be transpiled into `build/e2e-compiled` path

#### Continuous Integration

```sh
npm run test # just 'npm t' also works
```

Make your CI tool run the single-run `test` NPM script. Run it yourself for a quick check or whenever you want to refresh the coverage report.

The coverage report is generated in `doc\coverage`, which is ignored by git via `.gitignore`.

#### Testing sessions vs Implementing sessions

```sh
npm run test:w
```

Run the `test:w` NPM script to start a *testing session*.  
Karma + Webpack will watch over the files and re-run the test suite on file change.

Close the *testing session* and run the usual `start` script to go back to a normal *implementing session*.

Unfortunately Webpack doesn't seem to allow us to work on the code and also have the test suite running when we save our work.

### Linting

We use `tslint` with custom rules by [*Codelyzer*](https://www.npmjs.com/package/codelyzer) in order to adhere to the official Angular 2 Style Guide.

A set of *normal* tslint rules is configured in `tslint.json` and two NPM scripts take care of the actual linting:

  * `lint`: checks all the `.ts` files against the configured rules. It's used when you run `npm start`.
  * `lint:f`: same as `lint`, plus exits with error if needed. It's used when you run `npm run dist:{dev|stag|prod}`

### Versioning

This application follows [Semantic Versioning](http://semver.org/), with a twist:

*   Major and Minor version numbers follow along with the sprint numbers
*   Patch version number is for meaningful advancements in this front-end client app

> Example:  
> the first complete version of sprint `0.12` is `v0.12.0`.

Advancements in version number are made via `npm version <major|minor|patch>`.
Changes are made in `package.json` and `README.md`, committed, and the repository gets tagged.

> Example:  
> `npm version minor` bumps the version number from - say - `v0.13.0` to `v0.14.0`.

Running `npm run dist` doesn't automatically bump the version number.
