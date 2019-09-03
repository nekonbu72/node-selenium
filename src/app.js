// https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/
// https://www.npmjs.com/package/@types/selenium-webdriver
// geckodriver v0.17.0
// firefox 52.9.0

import Path from "path";
import { Builder, By, Key } from "selenium-webdriver";
import { Options, ServiceBuilder } from "selenium-webdriver/firefox";
import { config } from "./config";

(async () => {
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

  await driver.get(config.URL);

  await driver.findElement(By.name("sei_login")).sendKeys(config.SSO_ID);
  await driver.findElement(By.name("sei_passwd")).sendKeys(config.SSO_PASSWORD);
  // submit() はエラーになった
  await driver.findElement(By.name("login")).sendKeys(Key.RETURN);

  await driver.sleep(2000);

  let targetFrame = await driver.findElement(By.name("fr_menu"));
  await driver.switchTo().frame(targetFrame);
  await driver.findElement(By.linkText(config.SEARCH_MENU)).click();

  await driver.switchTo().defaultContent();
  targetFrame = await driver.findElement(By.name("fr_main"));
  await driver.switchTo().frame(targetFrame);

  await driver.sleep(2000);

  await driver.findElement(By.name("kensyu_nm")).sendKeys(config.SEARCH);
  await driver.findElement(By.name("btn_submit")).sendKeys(Key.RETURN);

  await driver.sleep(2000);

  await driver
    .findElement(By.id("pms_SeiResult2_link_vd_semdate_fne01_0"))
    .click();
  await driver.findElement(By.linkText(config.DETAIL)).click();

  const defaultWindow = await driver.getWindowHandle();
  const handles = await driver.getAllWindowHandles();
  for (let handle of handles) {
    await driver.switchTo().window(handle);
    const tmpTitle = await driver.getTitle();
    if (tmpTitle === config.WINDOW) {
      break;
    }
  }

  await driver.sleep(2000);

  await driver.findElement(By.linkText(config.LINK)).click();
  await driver.switchTo().window(defaultWindow);

  await driver.sleep(3000);

  await driver.quit();
})();
