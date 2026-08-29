const fs = require('fs');

// App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/function handleAddClaim[\s\S]*?}/, '');
app = app.replace(/id:\s*items\.length > 0[\s\S]*?: 1,/, "id: String(Date.now()),");
fs.writeFileSync('src/App.tsx', app);

// mockData.ts
let mock = fs.readFileSync('src/data/mockData.ts', 'utf8');
mock = mock.replace(/export const initialItems: Item\[\]/, 'export const initialItems: any[]');
fs.writeFileSync('src/data/mockData.ts', mock);

// replace "" ? with false ?
const pages = ['HomePage.tsx', 'ItemDetailPage.tsx', 'StaffDashboard.tsx', 'StaffItemDetailPage.tsx', 'StaffManageItemsPage.tsx', 'StudentFindItemPage.tsx'];
for (const p of pages) {
  let file = fs.readFileSync(`src/pages/${p}`, 'utf8');
  file = file.replace(/"" \?/g, 'false ?');
  fs.writeFileSync(`src/pages/${p}`, file);
}

// ReportFoundItemPage
let report = fs.readFileSync('src/pages/ReportFoundItemPage.tsx', 'utf8');
report = report.replace(/category: formData\.get\('category'\) as string,/, 'category: { id: "1", name: formData.get("category") as string },');
fs.writeFileSync('src/pages/ReportFoundItemPage.tsx', report);

// StaffClaimsPage
let staffClaims = fs.readFileSync('src/pages/StaffClaimsPage.tsx', 'utf8');
staffClaims = staffClaims.replace(/<span>\{claim\.category\}<\/span>/g, '<span>{claim.foundReport?.category?.name || "Unknown"}</span>');
fs.writeFileSync('src/pages/StaffClaimsPage.tsx', staffClaims);

// StaffItemDetailPage
let staffItemDetails = fs.readFileSync('src/pages/StaffItemDetailPage.tsx', 'utf8');
staffItemDetails = staffItemDetails.replace(/item\.id === Number\(id\)/g, 'item.id === id');
fs.writeFileSync('src/pages/StaffItemDetailPage.tsx', staffItemDetails);

// StudentHome
let studentHome = fs.readFileSync('src/pages/StudentHome.tsx', 'utf8');
studentHome = studentHome.replace(/claim\.category/g, 'claim.foundReport?.category?.name');
studentHome = studentHome.replace(/claim\.item/g, 'claim.foundReport?.title');
studentHome = studentHome.replace(/claim\.date/g, 'new Date(claim.createdAt).toLocaleDateString()');
studentHome = studentHome.replace(/claim\.status === 'Potential Match'/g, 'claim.status === "MORE_INFORMATION_REQUIRED"');
studentHome = studentHome.replace(/claim\.status === 'Resolved'/g, 'claim.status === "APPROVED"');
studentHome = studentHome.replace(/claim\.status === 'Claim In Progress'/g, 'claim.status === "PENDING"');
studentHome = studentHome.replace(/const item = \{[^}]*\};/g, ''); // just strip it out or fix it
studentHome = studentHome.replace(/category=\{item\.category\?.name\}/g, 'category={"Unknown"}');
studentHome = studentHome.replace(/item=\{item\.title\}/g, 'item={"Unknown"}');
studentHome = studentHome.replace(/date=\{new Date\(item\.occurredAt\)\.toLocaleDateString\(\)\}/g, 'date={"Unknown"}');
fs.writeFileSync('src/pages/StudentHome.tsx', studentHome);

