const fs = require("fs");
const files = [
  "src/components/BlogGrid.tsx",
  "src/components/DocumentariesAndNewspaper.tsx",
  "src/components/NewsGrid.tsx",
  "src/components/Hero.tsx",
  "src/components/SearchOverlay.tsx",
  "src/app/contact/page.tsx",
  "src/app/blog/[slug]/page.tsx",
  "src/app/about/page.tsx",
  "src/app/newspaper/page.tsx",
  "src/app/documentaries/page.tsx",
  "src/app/documentaries/[slug]/page.tsx",
  "src/app/news/[slug]/page.tsx"
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, "utf8");
  
  // Replace single quotes surrounding the interpolated string
  content = content.replace(/'\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "\/_\/backend\/api"\}(.*?)'/g, "`\${process.env.NEXT_PUBLIC_API_URL || \"http://localhost:5000/api\"}$1`");
  
  // Fix constant strings where it was assigned to a variable, e.g. API_BASE_URL
  content = content.replace(/const API_BASE_URL = `\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "\/_\/backend\/api"\}`/g, "const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || \"http://localhost:5000/api\"");
  
  // also single quotes issue without closing
  content = content.replace(/'\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "\/_\/backend\/api"\}'/g, "process.env.NEXT_PUBLIC_API_URL || \"http://localhost:5000/api\"");
  
  // Also fix if it's already using the fixed version but with the old fallback
  content = content.replace(/\|\| "\/_\/backend\/api"/g, '|| "http://localhost:5000/api"');

  fs.writeFileSync(f, content);
});
console.log("Fixed files");
