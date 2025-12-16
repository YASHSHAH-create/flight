import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
    console.log('🚀 Scraping start kar raha hu...');

    // Browser launch karein
    const browser = await puppeteer.launch({
        headless: "new", // Headless mode me chalega (background me)
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Server environments ke liye safe
    });

    const page = await browser.newPage();

    try {
        // Target URL
        const url = 'https://paymm.in';

        // Page par jaaye aur network idle hone ka wait kare (taaki saare JS links load ho jaye)
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Page evaluate karke saare <a> tags nikalein
        const allLinks = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('a'));

            return anchors.map(anchor => {
                // Check visibility (agar offsetParent null hai toh element hidden hai)
                const isHidden = (anchor.offsetParent === null);

                return {
                    text: anchor.innerText.trim() || '[No Text]', // Link ka text
                    href: anchor.href, // Link URL
                    isHidden: isHidden, // True agar hidden hai
                    html: anchor.outerHTML // Pura HTML tag reference ke liye
                };
            });
        });

        // Sirf valid links filter karein (empty hrefs hata dein)
        const validLinks = allLinks.filter(link => link.href && link.href !== '');

        // JSON file me save karein
        fs.writeFileSync('paymm_links.json', JSON.stringify(validLinks, null, 2));

        console.log(`✅ Success! Total ${validLinks.length} links mile.`);
        console.log('📁 Data "paymm_links.json" file me save ho gaya hai.');

    } catch (error) {
        console.error('❌ Error aaya:', error);
    } finally {
        await browser.close();
    }
})();