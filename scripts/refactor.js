const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace synchronous getAuthUser usages
code = code.replace(/const user = getAuthUser\(req\);/g, 'const user = await getAuthUser(req);');

// Add async to all server route handlers that now contain await getAuthUser
code = code.replace(/(server\.(get|post|delete|put)\([^,]+,\s*)\(req: Request, res: Response\)\s*=>\s*\{/g, (match, prefix) => {
  return prefix + 'async (req: Request, res: Response) => {';
});

// Write it back
fs.writeFileSync('server.ts', code, 'utf8');
console.log('Refactored getAuthUser successfully!');
