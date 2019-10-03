// https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/
// https://www.npmjs.com/package/@types/selenium-webdriver
// geckodriver v0.17.0
// firefox 52.9.0

import Path from "path";
import { Builder, By, Key } from "selenium-webdriver";
import { Options, ServiceBuilder } from "selenium-webdriver/firefox";
import { config } from "./config";

const downloadDir = Path.join(Path.resolve(), config.DOWNLOAD_DIR);

const options = new Options()
  .setBinary(config.FIREFOX)
  // @types/selenium-webdriver@4.0.2 が不完全なため any になってしまう
  .setPreference("browser.download.folderList", 2)
  .setPreference("browser.download.manager.showWhenStarting", false)
  .setPreference("browser.download.dir", downloadDir)
  .setPreference("browser.helperApps.neverAsk.saveToDisk", config.MIMETYPE);

const service = new ServiceBuilder(config.GECKODRIVER);

const driver = new Builder()
  .forBrowser("firefox")
  .setFirefoxOptions(options)
  // @types/selenium-webdriver@4.0.2 が不完全なため any になってしまう
  .setFirefoxService(service)
  .build();
