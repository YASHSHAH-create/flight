import crypto from 'crypto';
import 'dotenv/config';
import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';

// PayU Credentials (use environment variables or defaults for testing)
// Test Credentials
const PAYU_KEY = process.env.PAYU_KEY || 'dXTuYW';
const PAYU_SALT = process.env.PAYU_SALT || 'tCPp5SB7oWjtAjozvCrr1Vl3DEzqBL3E';
const PAYU_URL = 'https://secure.payu.in/_payment'; // Use https://secure.payu.in/_payment for production

const generateHash = (data) => {
    const hashString = `${PAYU_KEY}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${PAYU_SALT}`;
    return crypto.createHash('sha512').update(hashString).digest('hex');
};

const initiatePayment = () => {
    const txnid = 'Txn' + new Date().getTime(); // Unique Transaction ID
    const amount = '1.00'; 
    const productinfo = 'Test Product';
    const firstname = 'PayU User';
    const email = 'test@example.com';
    const phone = '9876543210';
    const surl = 'https://www.google.com/success'; // Success URL
    const curl = 'https://www.google.com/failure'; // Failure URL

    const data = {
        key: PAYU_KEY,
        txnid: txnid,
        amount: amount,
        productinfo: productinfo,
        firstname: firstname,
        email: email,
        phone: phone,
        surl: surl,
        furl: curl
    };

    const hash = generateHash(data);
    data.hash = hash;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PayU Payment</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f0f2f5; margin: 0; }
        .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; max-width: 400px; width: 100%; }
        h2 { margin-top: 0; color: #333; }
        .amount { font-size: 2rem; font-weight: bold; color: #2d3748; margin: 1rem 0; }
        button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 24px; font-size: 1.1rem; border-radius: 8px; cursor: pointer; transition: transform 0.1s ease, box-shadow 0.2s ease; width: 100%; }
        button:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.15); }
        button:active { transform: translateY(0); }
    </style>
</head>
<body>
    <div class="card">
        <h2>Complete Payment</h2>
        <p>Product: ${data.productinfo}</p>
        <div class="amount">₹${data.amount}</div>
        <form action="${PAYU_URL}" method="post">
            <input type="hidden" name="key" value="${data.key}" />
            <input type="hidden" name="txnid" value="${data.txnid}" />
            <input type="hidden" name="productinfo" value="${data.productinfo}" />
            <input type="hidden" name="amount" value="${data.amount}" />
            <input type="hidden" name="email" value="${data.email}" />
            <input type="hidden" name="firstname" value="${data.firstname}" />
            <input type="hidden" name="phone" value="${data.phone}" />
            <input type="hidden" name="surl" value="${data.surl}" />
            <input type="hidden" name="furl" value="${data.furl}" />
            <input type="hidden" name="hash" value="${data.hash}" />
            <button type="submit">Pay Now</button>
        </form>
    </div>
</body>
</html>
    `;

    const filePath = path.join(process.cwd(), 'scraper', 'payment.html');
    fs.writeFileSync(filePath, htmlContent);
    console.log(`Payment file created at: ${filePath}`);

    // Open the file in the default browser
    console.log('Opening in browser...');
    exec(`open "${filePath}"`, (error) => {
        if (error) {
            console.error('Failed to open browser:', error);
        }
    });
};

initiatePayment();
