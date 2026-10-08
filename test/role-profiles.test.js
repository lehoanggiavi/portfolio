const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const roleProfiles = require("../role-profiles.js");
const localCvChecks = { skip: !fs.existsSync(path.join(__dirname, "..", "templates", "cv_follow_jd")) };

const expectedRoles = ["ai", "ds", "da", "de"];
const expectedProjects = [
  "fmcg-multi-country-sales",
  "fnb-supply-chain",
  "xom-bank",
  "smart-class",
  "clen",
  "dagpt",
  "cacao-shield",
  "fraud-detection",
  "parking-slot",
  "heart-disease",
  "vnstock-ai",
];

test("defines exactly the four supported application roles", () => {
  assert.deepEqual(Object.keys(roleProfiles).sort(), expectedRoles.sort());
});

test("every role has complete bilingual content and a distinct CV asset", () => {
  const cvLinks = new Set();

  Object.values(roleProfiles).forEach((profile) => {
    assert.match(profile.cvHref, /^assets\/Le_Hoang_Gia_Vi_CV_[A-Za-z_]+\.pdf$/);
    cvLinks.add(profile.cvHref);

    ["en", "vi"].forEach((language) => {
      const copy = profile.copy[language];
      assert.ok(copy.hero.titlePrimary.length > 10);
      assert.ok(copy.about.points.every((point) => Array.isArray(point) && point[0] && point[1]));
      assert.equal(copy.expertise.cards.length, 3);
      assert.ok(copy.projects.title.length > 10);
    });
  });

  assert.equal(cvLinks.size, expectedRoles.length);
});

test("each role ranks its selected projects exactly once", () => {
  Object.entries(roleProfiles).forEach(([role, profile]) => {
    const projects = role === "da"
      ? expectedProjects.filter((id) => id !== "dagpt").concat("insurance-ops")
      : expectedProjects;
    assert.deepEqual(Object.keys(profile.projectPriorities).sort(), [...projects].sort());
    assert.deepEqual(
      Object.values(profile.projectPriorities).sort((a, b) => a - b),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    );
  });
});

test("project priorities reflect each role's strongest evidence", () => {
  assert.equal(roleProfiles.ai.projectPriorities["vnstock-ai"], 1);
  assert.equal(roleProfiles.ai.projectPriorities.dagpt, 2);
  assert.equal(roleProfiles.ds.projectPriorities["fraud-detection"], 1);
  assert.equal(roleProfiles.da.projectPriorities["fmcg-multi-country-sales"], 1);
  assert.equal(roleProfiles.da.projectPriorities["fnb-supply-chain"], 2);
  assert.equal(roleProfiles.da.projectPriorities["xom-bank"], 3);
  assert.equal(roleProfiles.da.projectPriorities["insurance-ops"], 4);
  assert.equal(roleProfiles.de.projectPriorities["xom-bank"], 1);
  assert.equal(roleProfiles.de.projectPriorities["fmcg-multi-country-sales"], 2);
  assert.equal(roleProfiles.de.projectPriorities["fnb-supply-chain"], 3);
  assert.equal(roleProfiles.de.projectPriorities["fraud-detection"], 4);
});

test("role project descriptions match each role's positioning", () => {
  assert.match(roleProfiles.ai.copy.en.projects.descriptions["vnstock-ai"], /LLM\/RAG workflow/);
  assert.match(roleProfiles.ds.copy.en.projects.descriptions["fraud-detection"], /Modeled highly imbalanced/);
  assert.match(roleProfiles.da.copy.en.projects.descriptions["fmcg-multi-country-sales"], /planning priorities/);
  assert.match(roleProfiles.de.copy.en.projects.descriptions["xom-bank"], /SQL-to-Power BI data pipeline/);

  Object.values(roleProfiles).forEach((profile) => {
    ["en", "vi"].forEach((language) => {
      assert.ok(Object.keys(profile.copy[language].projects.descriptions).length >= 4);
    });
  });
});

test("project descriptions cache defaults before applying saved language", () => {
  const script = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");
  const savedLanguageRead = script.indexOf("savedLanguage = window.localStorage.getItem");
  const fallbackCache = script.indexOf("card.dataset.defaultDescriptionEn =");
  const savedLanguageApplied = script.indexOf("if (savedLanguage === \"vi\") setLanguage(\"vi\")");

  assert.ok(savedLanguageRead >= 0);
  assert.ok(fallbackCache > savedLanguageRead);
  assert.ok(savedLanguageApplied > fallbackCache);
});

test("the AI CV features VNStock first and excludes Xóm Bank", localCvChecks, () => {
  const tex = fs.readFileSync(
    path.join(__dirname, "..", "templates", "cv_follow_jd", "LeHoangGiaVi_CV_AI_Engineer.tex"),
    "utf8",
  );
  const vnstock = tex.indexOf("\\projectentry{VNSTOCK AI ANALYST}");
  const dagpt = tex.indexOf("\\projectentry{DAGPT}");
  const smartClass = tex.indexOf("\\projectentry{SMART CLASS");
  const fraud = tex.indexOf("\\projectentry{CREDIT CARD FRAUD DETECTION}");
  assert.ok(vnstock >= 0, "Missing VNStock project");
  assert.ok(vnstock < dagpt && dagpt < smartClass && smartClass < fraud);
  assert.doesNotMatch(tex, /X[ÓÃ]M BANK/);
});

test("the DA CV leads with FMCG business insight and excludes fraud detection", localCvChecks, () => {
  const tex = fs.readFileSync(
    path.join(__dirname, "..", "templates", "cv_follow_jd", "LeHoangGiaVi_CV_Data_Analyst.tex"),
    "utf8",
  );
  const fmcg = tex.indexOf("\\projectentry{FMCG MULTI-COUNTRY SALES ANALYTICS}");
  const fnb = tex.indexOf("\\projectentry{F\\&B SUPPLY CHAIN PERFORMANCE DASHBOARD}");

  assert.ok(fmcg >= 0 && fmcg < fnb, "FMCG must be the first DA project");
  assert.match(tex, /top 20\\% of SKUs generated 50\.04\\% of net sales/);
  assert.match(tex, /Recommended prioritizing availability of high-value SKUs/);
  assert.doesNotMatch(tex, /CREDIT CARD FRAUD DETECTION/);
  assert.doesNotMatch(tex, /DAGPT/);
  assert.match(tex, /INSURANCEOPS/);
  assert.match(tex, /13,846 insurance complaints/);
  assert.match(tex, /31\.42\\%/);
  assert.match(tex, /1,697 customers had no observed transactions in the dataset/);
  assert.match(tex, /holdout group/);
  assert.doesNotMatch(tex, /InsuranceOps_Project_Report|Report PDF/);
  assert.match(tex, /\\textbf\{\\href\{#4\}\{#1\}\}/);
  assert.doesNotMatch(tex, /GitHub:|https:\/\/github\.com\/lehoanggiavi\/(?:Banking|F-B-Supply-Chain|FMCGMultiCountrySalesDataset)/);
});

test("DA project titles link only to available deployed sites", () => {
  const links = roleProfiles.da.projectLinks;
  assert.deepEqual(Object.keys(links), ["fmcg-multi-country-sales", "fnb-supply-chain", "xom-bank"]);
  assert.equal(links["xom-bank"][0], "https://lehoanggiavi.github.io/Banking/");
  assert.equal(links["fnb-supply-chain"][0], "https://lehoanggiavi.github.io/F-B-Supply-Chain/");
  assert.equal(links["insurance-ops"], undefined);
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const insuranceCard = html.match(/<article aria-label="InsuranceOps"[\s\S]*?<\/article>/)[0];
  assert.doesNotMatch(insuranceCard, /<a\b/);
  assert.ok(fs.existsSync(path.join(__dirname, "..", "images/projects/insurance-ops-cover.png")));
  ["en", "vi"].forEach((language) => {
    assert.ok(roleProfiles.da.copy[language].projects.descriptions["insurance-ops"]);
    assert.equal(roleProfiles.da.copy[language].projects.descriptions.dagpt, undefined);
  });
});

test("the Data Engineer CV leads with banking data and AWS pipeline evidence", localCvChecks, () => {
  const tex = fs.readFileSync(
    path.join(__dirname, "..", "templates", "cv_follow_jd", "LeHoangGiaVi_CV_Data_Engineer.tex"),
    "utf8",
  );
  const xomBank = tex.indexOf("\\projectentry{XÓM BANK");
  const fmcg = tex.indexOf("\\projectentry{FMCG MULTI-COUNTRY SALES ANALYTICS}");
  const fnb = tex.indexOf("\\projectentry{F\\&B SUPPLY CHAIN PERFORMANCE DASHBOARD}");
  const fraud = tex.indexOf("\\projectentry{CREDIT CARD FRAUD DETECTION}");

  assert.ok(xomBank >= 0 && xomBank < fmcg && fmcg < fnb && fnb < fraud);
  assert.match(tex, /API Gateway, Lambda, Kinesis and SageMaker/);
  assert.match(tex, /Firehose-to-S3 prediction history/);
  assert.doesNotMatch(tex, /PL\/SQL|Spark|Hadoop|Kafka|Flink|Airflow|Talend|SSIS/);
});

test("the published page loads role data before its behavior and exposes all role controls", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const script = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");
  const profilesScript = html.indexOf('<script src="role-profiles.js"></script>');
  const behaviorScript = html.indexOf('<script src="script.js"></script>');

  assert.ok(profilesScript >= 0 && profilesScript < behaviorScript);
  expectedRoles.forEach((role) => {
    assert.match(html, new RegExp(`data-role="${role}"`));
  });
  expectedProjects.forEach((project) => {
    assert.match(html, new RegExp(`data-project-id="${project}"`));
  });
  assert.match(
    html,
    /<article aria-label="F&amp;B Supply Chain"[\s\S]*?src="images\/projects\/fnb-supply-chain-cover\.png"/,
  );
  const fnbCover = path.join(__dirname, "..", "images", "projects", "fnb-supply-chain-cover.png");
  assert.ok(fs.existsSync(fnbCover), "Missing F&B Supply Chain project cover");
  assert.ok(fs.statSync(fnbCover).size > 100_000, "F&B Supply Chain project cover is unexpectedly small");
  assert.match(
    html,
    /<article aria-label="FMCG Multi-Country Sales"[\s\S]*?src="images\/projects\/fmcg-multi-country-sales-cover\.png"/,
  );
  const fmcgCover = path.join(__dirname, "..", "images", "projects", "fmcg-multi-country-sales-cover.png");
  assert.ok(fs.existsSync(fmcgCover), "Missing FMCG Multi-Country Sales project cover");
  assert.ok(fs.statSync(fmcgCover).size > 100_000, "FMCG Multi-Country Sales project cover is unexpectedly small");
  assert.match(script, /\.role-switcher-options \[data-role\]/);
  assert.doesNotMatch(script, /\$\$\('\[data-role\]'\)/);
});

test("each CV deep-links its Portfolio hyperlink to the matching role", localCvChecks, () => {
  const templates = {
    ai: "LeHoangGiaVi_CV_AI_Engineer.tex",
    ds: "LeHoangGiaVi_CV_Data_Scientist.tex",
    da: "LeHoangGiaVi_CV_Data_Analyst.tex",
    de: "LeHoangGiaVi_CV_Data_Engineer.tex",
  };

  Object.entries(templates).forEach(([role, file]) => {
    const template = fs.readFileSync(
      path.join(__dirname, "..", "templates", "cv_follow_jd", file),
      "utf8",
    );
    assert.match(
      template,
      new RegExp(`https://lehoanggiavi\\.github\\.io/portfolio/\\?role=${role}`),
    );
  });
});

test("every role points to a published CV PDF", () => {
  Object.values(roleProfiles).forEach((profile) => {
    const assetPath = path.join(__dirname, "..", profile.cvHref);
    assert.ok(fs.existsSync(assetPath), `Missing CV asset: ${profile.cvHref}`);
    assert.ok(fs.statSync(assetPath).size > 10_000, `CV asset is unexpectedly small: ${profile.cvHref}`);
  });
});
