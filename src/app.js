import { Builder, By, Key } from "selenium-webdriver";
import { Options } from "selenium-webdriver/firefox";
import { config } from "./config";
import Path from "path";

(async () => {
  const BINARY_PATH = "C:/Program Files/Mozilla Firefox/firefox.exe";
  const dir = Path.join(Path.resolve(), config.DOWNLOAD_DIR);

  const options = new Options()
    .setBinary(BINARY_PATH)
    // @types/selenium-webdriver@4.0.2 が不完全なため any になってしまう
    .setPreference("browser.download.folderList", 2)
    .setPreference("browser.download.manager.showWhenStarting", false)
    .setPreference("browser.download.dir", dir)
    .setPreference("browser.helperApps.neverAsk.saveToDisk", config.MIMETYPE);

  // geckodriver v0.18.0
  // firefox 52.9.0
  const driver = new Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(options)
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
