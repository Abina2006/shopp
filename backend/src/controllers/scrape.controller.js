import { spawn } from 'child_process';
import path from 'path';

export const scrapeProduct = (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  const hostname = new URL(url).hostname.replace('www.', '');
  let spiderFile;
  if (hostname.includes('amazon')) spiderFile = 'amazon_spider.py';
  else if (hostname.includes('flipkart')) spiderFile = 'flipkart_spider.py';
  else if (hostname.includes('meesho')) spiderFile = 'meesho_spider.py';
  else return res.status(400).json({ error: 'Unsupported site' });

  const spiderPath = path.resolve(
    __dirname,
    '../../scraper/shopwise_scraper/spiders',
    spiderFile
  );

  const proc = spawn('scrapy', ['runspider', spiderPath, '-a', `url=${url}`, '-o', '-'], {
    cwd: path.resolve(__dirname, '../../scraper'),
  });

  let output = '';
  proc.stdout.on('data', d => (output += d));
  proc.stderr.on('data', d => console.error(d.toString()));

  proc.on('close', code => {
    if (code !== 0) return res.status(500).json({ error: 'Scrape failed' });
    try {
      const result = JSON.parse(output);
      res.json({ success: true, data: result });
    } catch (e) {
      res.status(500).json({ success: false, error: 'Parse error' });
    }
  });
};
