import fs from 'fs';
import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- CONFIGURATION ---
const URL_TO_AUDIT = 'https://www.ixigo.com/'; 
const GEMINI_API_KEY = "AIzaSyDRq1vtdesyVoejO7VhP3gnT7uTFEeYre4"; // Yahan apni key dalo
// ---------------------

async function runAudit() {
    console.log(`🚀 Starting Comprehensive SEO Audit for: ${URL_TO_AUDIT}`);
    console.log(`... Analyzing Technical SEO (Lighthouse) & Competitor Benchmarking ...`);

    // 1. Launch Chrome for Lighthouse
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = { logLevel: 'info', output: 'json', onlyCategories: ['seo', 'performance', 'accessibility', 'best-practices'], port: chrome.port };
    
    // Run Lighthouse
    const runnerResult = await lighthouse(URL_TO_AUDIT, options);
    const lhData = JSON.parse(runnerResult.report);
    const scores = {
        seo: lhData.categories.seo.score * 100,
        performance: lhData.categories.performance.score * 100,
        accessibility: lhData.categories.accessibility.score * 100,
        bestPractices: lhData.categories['best-practices'].score * 100,
    };
    
    await chrome.kill();
    console.log(`✅ Technical Scores: SEO: ${scores.seo}, Speed: ${scores.performance}`);

    // 2. Scrape Content for Context (Keywords, Structure)
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(URL_TO_AUDIT, { waitUntil: 'networkidle2' });

    const contentData = await page.evaluate(() => {
        return {
            title: document.title,
            metaDescription: document.querySelector('meta[name="description"]')?.content || "No Description",
            h1: Array.from(document.querySelectorAll('h1')).map(h => h.innerText),
            h2: Array.from(document.querySelectorAll('h2')).map(h => h.innerText).slice(0, 5), // Top 5 H2
            linksCount: document.querySelectorAll('a').length,
            mainTextSnippet: document.body.innerText.slice(0, 1000).replace(/\s+/g, ' ') // First 1000 chars
        };
    });
    await browser.close();

    // 3. Send to Gemini for Competitor Analysis
    console.log(`🧠 Sending data to Gemini for Ixigo/Goibibo comparison...`);
    
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

    const prompt = `
    Act as a World-Class SEO Strategist & Developer. I am building a flight booking app called "paymm".
    
    Here is the live data from my website (${URL_TO_AUDIT}):
    
    **Technical Scores (0-100):**
    - SEO Score: ${scores.seo}
    - Performance (Speed): ${scores.performance}
    - Accessibility: ${scores.accessibility}
    
    **On-Page Content Data:**
    - Title: ${contentData.title}
    - Meta Description: ${contentData.metaDescription}
    - H1 Tags: ${JSON.stringify(contentData.h1)}
    - First 1000 chars of content: "${contentData.mainTextSnippet}"
    
    **YOUR TASK:**
    Compare this data against industry giants **Ixigo** and **Goibibo** (use your internal knowledge base about their structure and performance standards).
    
    Provide a detailed JSON response with the following fields:
    1. "verdict": Is this site currently good enough to rank? (Yes/No/Needs Work).
    2. "competitor_gap_analysis": specific bullet points on what Ixigo/Goibibo have that I am missing (e.g., Schema markup, specific keywords, speed metrics).
    3. "estimated_time_to_rank": A realistic estimate (in months) to reach page 1 if I work hard, considering domain age is new.
    4. "action_plan": 5 high-priority technical or content fixes.
    
    Output strictly in clean text or Markdown format.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("\n------------------ GEMINI AI SEO REPORT ------------------\n");
    console.log(text);
    console.log("\n----------------------------------------------------------\n");
    
    // Save report to file
    fs.writeFileSync('seo_strategy_report.md', text);
    console.log("📄 Full report saved to 'seo_strategy_report.md'");
}

runAudit().catch(console.error);