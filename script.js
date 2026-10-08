const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Role-specific portfolio views */
const profiles = window.roleProfiles || {};
const supportedRoles = Object.keys(profiles);
const roleDisplayNames = {
  ai: { en: "AI ENGINEER", vi: "KỸ SƯ AI" },
  ds: { en: "DATA SCIENTIST", vi: "NHÀ KHOA HỌC DỮ LIỆU" },
  da: { en: "DATA ANALYST", vi: "CHUYÊN VIÊN PHÂN TÍCH DỮ LIỆU" },
  de: { en: "DATA ENGINEER", vi: "KỸ SƯ DỮ LIỆU" },
};

function getInitialRole() {
  const requestedRole = new URLSearchParams(window.location.search).get("role");
  if (supportedRoles.includes(requestedRole)) return requestedRole;
  return "ai";
}

let currentRole = getInitialRole();
let roleContentReady = false;

/* English / Vietnamese language switch */
let currentLanguage = "en";
const languageToggle = $("#language-toggle");
const languagePairs = [
  ["AI ENGINEER", "KỸ SƯ AI"],
  ["AI Engineer", "Kỹ sư AI"],
  ["About", "Giới thiệu"],
  ["Expertise", "Chuyên môn"],
  ["Experience", "Kinh nghiệm"],
  ["Projects", "Dự án"],
  ["Research", "Nghiên cứu"],
  ["Contact", "Liên hệ"],
  ["Download CV", "Tải CV"],
  ["View CV", "Xem CV"],
  ["Explore AI Projects", "Khám phá dự án AI"],
  ["AI ENGINEERING · COMPUTER VISION · LLM SYSTEMS", "KỸ THUẬT AI · THỊ GIÁC MÁY TÍNH · HỆ THỐNG LLM"],
  ["Building practical AI systems", "Xây dựng các hệ thống AI thực tiễn"],
  ["from model to deployment.", "từ mô hình đến triển khai."],
  ["Le Hoang Gia Vi — Fresher AI Engineer", "Le Hoang Gia Vi — Kỹ sư AI Fresher"],
  ["Data Science graduate and AI Engineer Intern with hands-on work in", "Đã tốt nghiệp ngành Khoa học Dữ liệu, đồng thời là thực tập sinh Kỹ sư AI với kinh nghiệm thực tế về"],
  ["computer vision, machine learning, LLM/RAG and cloud AI", "thị giác máy tính, học máy, LLM/RAG và AI trên nền tảng đám mây"],
  ["I build clear, useful AI applications from models, data and tests.", "Tôi xây dựng ứng dụng AI rõ ràng và hữu ích từ mô hình, dữ liệu và kiểm thử."],
  ["Open to Fresher AI Engineer opportunities", "Sẵn sàng cho các vị trí Kỹ sư AI Fresher"],
  ["Machine Learning · Applied AI", "Học máy · AI ứng dụng"],
  ["Focused technologies", "Công nghệ trọng tâm"],
  ["ABOUT ME", "GIỚI THIỆU"],
  ["Research mindset. Practical delivery.", "Tư duy nghiên cứu. Triển khai thực tế."],
  ["ABOUT", "GIỚI THIỆU"],
  ["From AI experiments to", "Từ thử nghiệm AI đến"],
  ["useful systems.", "hệ thống hữu ích."],
  ["I am a Data Science graduate with hands-on experience", "Tôi đã tốt nghiệp ngành Khoa học Dữ liệu với kinh nghiệm thực hành"],
  ["in computer vision, machine learning, LLM-based applications and cloud AI deployment.", "về thị giác máy tính, học máy, ứng dụng dựa trên LLM và triển khai AI trên đám mây."],
  ["My work covers model training, evaluation, real-time inference, retrieval systems", "Công việc của tôi gồm huấn luyện, đánh giá mô hình, suy luận thời gian thực, hệ thống truy xuất"],
  ["and end-to-end AI pipelines.", "và các pipeline AI đầu-cuối."],
  ["I care about AI systems that are accurate in tests and also simple to reproduce,", "Tôi quan tâm đến các hệ thống AI chính xác khi kiểm thử và dễ tái lập,"],
  ["efficient to run and useful in real applications.", "chạy hiệu quả và hữu ích trong ứng dụng thực tế."],
  ["Machine learning & AI engineering", "Học máy & kỹ thuật AI"],
  ["Modeling, evaluation and delivery for reliable AI systems.", "Xây dựng, đánh giá và triển khai các hệ thống AI đáng tin cậy."],
  ["Computer vision & retrieval", "Thị giác máy tính & truy xuất"],
  ["YOLO, deep learning, RAG and LLM-based data applications.", "YOLO, học sâu, RAG và ứng dụng dữ liệu dựa trên LLM."],
  ["Cloud & data delivery", "Triển khai đám mây & dữ liệu"],
  ["AWS services, data pipelines and AI workflows ready for real use.", "Dịch vụ AWS, pipeline dữ liệu và quy trình AI sẵn sàng cho sử dụng thực tế."],
  ["AI & Cloud Internships", "Thực tập AI & Đám mây"],
  ["Accepted Papers", "Bài báo được chấp nhận"],
  ["CORE EXPERTISE", "NĂNG LỰC CỐT LÕI"],
  ["Skills for building", "Kỹ năng xây dựng"],
  ["practical AI systems.", "hệ thống AI thực tiễn."],
  ["I focus on model development, computer vision, retrieval-based applications", "Tôi tập trung vào phát triển mô hình, thị giác máy tính và ứng dụng dựa trên truy xuất"],
  ["and clean engineering work that turns experiments into usable systems.", "cùng cách làm kỹ thuật rõ ràng để chuyển thử nghiệm thành hệ thống hữu ích."],
  ["BUILDING MODE", "TƯ DUY XÂY DỰNG"],
  ["From raw data to useful products.", "Từ dữ liệu thô đến sản phẩm hữu ích."],
  ["Machine Learning & Deep Learning", "Học máy & Học sâu"],
  ["Train, evaluate and improve ML and deep learning models for classification,", "Huấn luyện, đánh giá và cải thiện mô hình ML/học sâu cho bài toán phân loại,"],
  ["forecasting and imbalanced data.", "dự báo và dữ liệu mất cân bằng."],
  ["Computer Vision", "Thị giác máy tính"],
  ["Build image and real-time vision pipelines for detection, recognition,", "Xây dựng pipeline thị giác từ ảnh và thời gian thực cho phát hiện, nhận diện,"],
  ["preprocessing and faster inference.", "tiền xử lý và suy luận nhanh hơn."],
  ["LLM & AI Applications", "LLM & Ứng dụng AI"],
  ["Build retrieval-based AI apps that connect data pipelines, embeddings,", "Xây dựng ứng dụng AI dựa trên truy xuất, kết nối pipeline dữ liệu, embedding,"],
  ["LLMs and easy-to-use interfaces.", "LLM và giao diện dễ dùng."],
  ["PERSONAL JOURNEY", "HÀNH TRÌNH"],
  ["Learning through projects, teamwork and research.", "Học hỏi qua dự án, làm việc nhóm và nghiên cứu."],
  ["EXPERIENCE & EDUCATION", "KINH NGHIỆM & HỌC VẤN"],
  ["Building, deploying and", "Xây dựng, triển khai và"],
  ["improving AI systems.", "cải tiến hệ thống AI."],
  ["My experience combines AI engineering internships, cloud work, academic learning", "Kinh nghiệm của tôi kết hợp thực tập kỹ thuật AI, công việc đám mây, học tập"],
  ["and research. Each step helped me bring models from data and tests to", "và nghiên cứu. Mỗi bước giúp tôi đưa mô hình từ dữ liệu và kiểm thử đến"],
  ["useful AI systems.", "hệ thống AI hữu ích."],
  ["Mar 2026 — Present", "03/2026 — Nay"],
  ["Nano Factory · AI Engineer Intern", "Nano Factory · Thực tập sinh Kỹ sư AI"],
  ["Fine-tuned YOLOX-tiny on 2,336 COCO images: AP50 85.0%, AP@[0.50:0.95] 61.8%, 5.91 ms/image; proposed an active-learning loop.", "Tinh chỉnh YOLOX-tiny trên 2.336 ảnh COCO: AP50 85,0%, AP@[0,50:0,95] 61,8%, 5,91 ms/ảnh; đề xuất vòng lặp học chủ động."],
  ["Mar 2026 — Jul 2026", "03/2026 — 07/2026"],
  ["AWS · Cloud Engineer Intern", "AWS · Thực tập sinh Kỹ sư Đám mây"],
  ["Built a fraud-detection flow using API Gateway, Lambda, Kinesis, SageMaker, SNS, Firehose and S3 for prediction history.", "Xây dựng luồng phát hiện gian lận dùng API Gateway, Lambda, Kinesis, SageMaker, SNS, Firehose và S3 để lưu lịch sử dự đoán."],
  ["Graduated", "Đã tốt nghiệp"],
  ["HUTECH · Engineering of Data Science", "HUTECH · Kỹ thuật Khoa học Dữ liệu"],
  ["Data Science graduate · GPA 3.38/4.00.", "Đã tốt nghiệp Khoa học Dữ liệu · GPA 3.38/4.00."],
  ["HUTECH IT Got Talent · Finalist", "HUTECH IT Got Talent · Chung kết"],
  ["Built an AI fall-detection solution using camera and CSI signals with real-time email alerts.", "Xây dựng giải pháp AI phát hiện té ngã từ camera và tín hiệu CSI, có cảnh báo email thời gian thực."],
  ["FEATURED AI SYSTEMS", "HỆ THỐNG AI TIÊU BIỂU"],
  ["Selected work showing how I", "Một số dự án cho thấy cách tôi"],
  ["build AI systems.", "xây dựng hệ thống AI."],
  ["The first three projects are the strongest examples from my CV. Use the arrows to explore more AI, data and research repositories.", "Ba dự án đầu là ví dụ nổi bật nhất từ CV của tôi. Dùng mũi tên để xem thêm các kho mã nguồn AI, dữ liệu và nghiên cứu."],
  ["of", "trên"],
  ["All", "Tất cả"],
  ["Data & BI", "Dữ liệu & BI"],
  ["Machine Learning", "Học máy"],
  ["All repositories", "Tất cả kho mã nguồn"],
  ["Built a Power BI supply-chain dashboard after EDA and data-quality checks; validated 11 KPIs including 2,200 orders, 34.40% gross margin and 92.55% OTIF.", "Xây dựng dashboard chuỗi cung ứng Power BI sau EDA và kiểm tra chất lượng dữ liệu; đối soát 11 KPI, gồm 2.200 đơn hàng, gross margin 34,40% và OTIF 92,55%."],
  ["Analyzed 1.05M FMCG sales records across six countries, connecting SKU concentration, channels and promotions with planning guardrails; the top 20% of SKUs generated 50.04% of net sales and XGBoost reached 26.97% test WAPE.", "Phân tích 1,05 triệu giao dịch FMCG tại sáu quốc gia, kết nối mức tập trung SKU, kênh bán và khuyến mãi với các ngưỡng kiểm soát lập kế hoạch; 20% SKU hàng đầu tạo ra 50,04% doanh thu thuần và XGBoost đạt WAPE kiểm thử 26,97%."],
  ["Built a banking analytics pipeline with SQL Server, Power BI and K-Means segmentation, using 157K+ transactions and 2K+ customer profiles.", "Xây dựng pipeline phân tích ngân hàng với SQL Server, Power BI và phân khúc K-Means, dùng hơn 157 nghìn giao dịch và 2 nghìn hồ sơ khách hàng."],
  ["Led a real-time classroom monitoring system with 90% emotion classification and 95% identity recognition accuracy; showed trends for early support.", "Dẫn dắt hệ thống giám sát lớp học thời gian thực với độ chính xác 90% cho phân loại cảm xúc và 95% cho nhận diện danh tính; hiển thị xu hướng để hỗ trợ sớm."],
  ["Lightweight CNN-Transformer pipeline for real-time facial emotion recognition across eight classes.", "Pipeline CNN-Transformer gọn nhẹ cho nhận diện cảm xúc khuôn mặt thời gian thực trên tám lớp."],
  ["Built a Streamlit LLM assistant that turns uploaded CSV files and plain-language questions into analysis and interactive charts.", "Xây dựng trợ lý LLM bằng Streamlit, chuyển tệp CSV tải lên và câu hỏi đơn giản thành phân tích cùng biểu đồ tương tác."],
  ["Transfer-learning system for recognizing diseases on cocoa pods from images.", "Hệ thống transfer learning nhận diện bệnh trên quả ca cao từ ảnh."],
  ["Built a fraud-detection pipeline for imbalanced data using Bi-LSTM and SMOTE-ENN, reaching AUC 0.990 and Recall 0.953.", "Xây dựng pipeline phát hiện gian lận cho dữ liệu mất cân bằng bằng Bi-LSTM và SMOTE-ENN, đạt AUC 0.990 và Recall 0.953."],
  ["Camera-based system for identifying available parking spaces in real time.", "Hệ thống dựa trên camera để nhận diện chỗ đỗ xe trống theo thời gian thực."],
  ["Classification workflow for analyzing patient indicators and predicting disease risk.", "Quy trình phân loại để phân tích chỉ số bệnh nhân và dự đoán nguy cơ bệnh."],
  ["FullRAG and agent-based system for VN30 stock analysis using financial data, news and reports.", "Hệ thống FullRAG và agent cho phân tích cổ phiếu VN30 bằng dữ liệu tài chính, tin tức và báo cáo."],
  ["View repository", "Xem mã nguồn"],
  ["Across 13,846 complaints, resolution averaged 12.85 days versus a 7-day median, highlighting long-running cases. Recommended reviewing priority cases and CRO intake, and improving status logging: only 31.42% of complaints had recorded status history.", "Trong 13.846 khiếu nại, thời gian xử lý trung bình 12,85 ngày so với trung vị 7 ngày cho thấy có các ca kéo dài. Đề xuất rà nhóm ưu tiên và nguồn CRO, cải thiện ghi nhận trạng thái vì chỉ 31,42% hồ sơ có lịch sử."],
  ["Analyzed 6,073 food-delivery orders; late delivery rose from 5.97% in March to 25.08% in August as volume grew 24.35%. Recommended reviewing evening operations and testing changes against delivery reliability and cancellations.", "Phân tích 6.073 đơn giao đồ ăn; tỷ lệ trễ tăng từ 5,97% tháng 3 lên 25,08% tháng 8 khi lượng đơn tăng 24,35%. Đề xuất rà vận hành ca Tối, thử thay đổi và đo độ tin cậy giao hàng cùng tỷ lệ hủy."],
  ["Face Recognition", "Nhận diện khuôn mặt"],
  ["Real-time", "Thời gian thực"],
  ["RESEARCH · 5 ACCEPTED PAPERS", "NGHIÊN CỨU · 5 BÀI BÁO ĐƯỢC CHẤP NHẬN"],
  ["Research that supports", "Nghiên cứu hỗ trợ"],
  ["reliable AI systems.", "các hệ thống AI đáng tin cậy."],
  ["Research experience helps me ask clear data questions, design better experiments,", "Kinh nghiệm nghiên cứu giúp tôi đặt câu hỏi dữ liệu rõ ràng, thiết kế thí nghiệm tốt hơn,"],
  ["evaluate models carefully and communicate technical findings clearly.", "đánh giá mô hình cẩn trọng và truyền đạt phát hiện kỹ thuật rõ ràng."],
  ["ACADEMIC WORK", "CÔNG TRÌNH HỌC THUẬT"],
  ["Test. Analyze. Explain.", "Kiểm thử. Phân tích. Giải thích."],
  ["REV-ECIT 2025 · Accepted · Jul–Oct 2025", "REV-ECIT 2025 · Được chấp nhận · 07–10/2025"],
  ["AI application to identify cocoa diseases from the Cacao Disease dataset.", "Ứng dụng AI nhận diện bệnh ca cao từ bộ dữ liệu Cacao Disease."],
  ["Distance Education 2025 · Accepted · Nov 2025", "Đào tạo từ xa 2025 · Được chấp nhận · 11/2025"],
  ["Extended UTAUT study on factors that affect acceptance of the Safe Exam", "Nghiên cứu Extended UTAUT về các yếu tố ảnh hưởng đến việc chấp nhận công cụ"],
  ["Browser tool in online exams.", "Safe Exam Browser trong thi trực tuyến."],
  ["AIFMA 2025 · Accepted · Dec 2025", "AIFMA 2025 · Được chấp nhận · 12/2025"],
  ["Hybrid approach combining Bi-LSTM and SMOTE-ENN for highly imbalanced", "Cách tiếp cận lai kết hợp Bi-LSTM và SMOTE-ENN cho dữ liệu"],
  ["financial transaction data.", "giao dịch tài chính mất cân bằng cao."],
  ["FJCAI 2026 · Accepted · Jan–Mar 2026", "FJCAI 2026 · Được chấp nhận · 01–03/2026"],
  ["Custom hybrid neural-network model for real-time facial emotion", "Mô hình mạng nơ-ron lai tùy chỉnh cho nhận diện cảm xúc khuôn mặt"],
  ["recognition across eight emotion classes.", "thời gian thực trên tám lớp cảm xúc."],
  ["ICEISD 2026 · Accepted · Feb–Apr 2026", "ICEISD 2026 · Được chấp nhận · 02–04/2026"],
  ["Hybrid GRU-Fourier Neural Operator study for flood-water-level forecasting", "Nghiên cứu Hybrid GRU-Fourier Neural Operator cho dự báo mực nước lũ"],
  ["with deep-learning comparison on time series.", "với so sánh học sâu trên chuỗi thời gian."],
  ["CONTACT", "LIÊN HỆ"],
  ["Let's build useful", "Hãy cùng xây dựng giải pháp AI"],
  ["AI solutions.", "hữu ích."],
  ["I am currently seeking an AI Engineer role where I can contribute to", "Tôi hiện tìm kiếm vị trí Kỹ sư AI, nơi tôi có thể đóng góp vào"],
  ["machine learning, computer vision, retrieval and cloud AI solutions.", "các giải pháp học máy, thị giác máy tính, truy xuất và AI đám mây."],
  ["Connect on LinkedIn", "Kết nối trên LinkedIn"],
  ["View my source code", "Xem mã nguồn của tôi"],
  ["Building practical AI systems with clear research and engineering thinking.", "Xây dựng hệ thống AI thực tiễn với tư duy nghiên cứu và kỹ thuật rõ ràng."],
  ["Portfolio", "Hồ sơ"],
  ["Publications", "Bài báo"],
  ["Connect", "Kết nối"],
  ["Available for AI Engineer opportunities", "Sẵn sàng cho các cơ hội Kỹ sư AI"]
];
const languageRules = {
  en: languagePairs
    .map(([en, vi]) => [vi, en])
    .sort(([a], [b]) => b.length - a.length),
  vi: [...languagePairs].sort(([a], [b]) => b.length - a.length)
};

function localizedText(en, vi) {
  return currentLanguage === "vi" ? vi : en;
}

function textPattern(text) {
  return text
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/ /g, "\\s+");
}

function translateTextNodes(language) {
  const translations = languageRules[language];
  const roots = [$("nav"), $("main"), $("footer")].filter(Boolean);

  roots.forEach((root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;

    while ((node = walker.nextNode())) nodes.push(node);

    nodes.forEach((textNode) => {
      const original = textNode.nodeValue;
      const translated = translations.reduce(
        (value, [source, target]) => value.replace(new RegExp(textPattern(source), "g"), target),
        original
      );

      if (translated !== original) textNode.nodeValue = translated;
    });
  });
}

function updateLanguageAttributes(language) {
  const isVietnamese = language === "vi";
  const roleCopy = profiles[currentRole]?.copy?.[language];
  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;
  document.title = roleCopy?.meta?.title || (isVietnamese
    ? "Le Hoang Gia Vi | Kỹ sư AI"
    : "Le Hoang Gia Vi | AI Engineer");

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.content = roleCopy?.meta?.description || (isVietnamese
      ? "Portfolio Kỹ sư AI của Le Hoang Gia Vi với các dự án học máy, thị giác máy tính, hệ thống dữ liệu và AI ứng dụng"
      : "Le Hoang Gia Vi — AI Engineer portfolio featuring machine learning, computer vision, data systems, and applied AI projects");
  }

  languageToggle?.setAttribute(
    "aria-label",
    isVietnamese ? "Chuyển sang tiếng Anh" : "Switch language to Vietnamese"
  );
  languageToggle?.setAttribute("aria-pressed", String(isVietnamese));
  const toggleLabel = $("span", languageToggle || document);
  if (toggleLabel) toggleLabel.textContent = isVietnamese ? "EN" : "VI";

  $(".desktop-nav")?.setAttribute("aria-label", isVietnamese ? "Điều hướng chính" : "Main navigation");
  $(".project-filters")?.setAttribute("aria-label", isVietnamese ? "Lọc kho mã nguồn" : "Filter repositories");
  $("#menu-toggle")?.setAttribute("aria-label", isVietnamese ? "Mở hoặc đóng điều hướng" : "Toggle navigation");
  $("#repoPrev")?.setAttribute("aria-label", isVietnamese ? "Hiển thị các kho mã nguồn trước" : "Show previous repositories");
  $("#repoNext")?.setAttribute("aria-label", isVietnamese ? "Hiển thị các kho mã nguồn tiếp theo" : "Show next repositories");

  const backgroundVideo = $("#site-video");
  const videoControl = $("#video-toggle");
  if (backgroundVideo && videoControl) {
    const videoLabel = backgroundVideo.paused
      ? localizedText("Play background video", "Phát video nền")
      : localizedText("Pause background video", "Tạm dừng video nền");
    videoControl.setAttribute("aria-label", videoLabel);
    videoControl.setAttribute("title", videoLabel);
  }

  $$("a.repo-card-media").forEach((link) => {
    const card = link.closest(".repo-card");
    const name = card.dataset.defaultTitle || $("h3", card)?.textContent?.trim();
    if (name) {
      link.setAttribute(
        "aria-label",
        isVietnamese ? `Mở kho mã nguồn ${name}` : `Open ${name} repository`
      );
    }
  });
}

function setText(selector, value, scope = document) {
  const element = $(selector, scope);
  if (element) element.textContent = value;
}

function setTrustedHtml(selector, value) {
  const element = $(selector);
  if (element) element.innerHTML = value;
}

function setButtonLabel(selector, value) {
  const element = $(selector);
  if (!element) return;

  const icon = $("iconify-icon", element);
  element.replaceChildren(document.createTextNode(`${value} `));
  if (icon) element.append(icon);
}

function setStatus(selector, value) {
  const element = $(selector);
  if (!element) return;

  const dot = $(".status-dot", element) || document.createElement("span");
  dot.className = "status-dot";
  element.replaceChildren(dot, document.createTextNode(` ${value}`));
}

function setSplitHeading(selector, [lead, emphasis]) {
  const element = $(selector);
  if (!element) return;

  const emphasisElement = document.createElement("em");
  emphasisElement.textContent = emphasis;
  element.replaceChildren(document.createTextNode(`${lead} `), emphasisElement);
}

function setTags(container, tags) {
  if (!container) return;
  container.replaceChildren(...tags.map((tag) => {
    const item = document.createElement("span");
    item.textContent = tag;
    return item;
  }));
}

function updateRoleProjectCards(copy) {
  if (!roleContentReady) return;

  repoCards.forEach((card) => {
    const title = $(".repo-card-body h3", card);
    const projectLink = profiles[currentRole].projectLinks?.[card.dataset.projectId];
    title.textContent = card.dataset.defaultTitle;
    if (projectLink) {
      const link = document.createElement("a");
      link.href = projectLink[0];
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = card.dataset.defaultTitle;
      const shortUrl = document.createElement("span");
      shortUrl.className = "repo-title-url";
      shortUrl.textContent = projectLink[1];
      link.append(shortUrl);
      title.replaceChildren(link);
    }
    const description = $(".repo-card-body p", card);
    if (!description) return;

    const defaultText = currentLanguage === "vi"
      ? card.dataset.defaultDescriptionVi
      : card.dataset.defaultDescriptionEn;
    description.textContent = copy.projects.descriptions?.[card.dataset.projectId] || defaultText || description.textContent;
  });
}

function updateRoleProjectOrder(profile) {
  if (!roleContentReady || !repoTrack) return;

  repoCards.forEach((card) => {
    const priority = profile.projectPriorities[card.dataset.projectId] ?? 99;
    card.dataset.priority = String(priority);
  });

  repoCards
    .sort((a, b) => Number(a.dataset.priority) - Number(b.dataset.priority))
    .forEach((card, index) => {
      repoTrack.append(card);
      const number = $(".repo-card-number", card);
      if (number) number.textContent = String(index + 1).padStart(2, "0");
    });

  repoCurrentIndex = 0;
  applyRepoFilter(repoActiveFilter);
}

function updateRoleButtons() {
  const labels = roleDisplayNames[currentRole];
  $$(".role-switcher-options [data-role]").forEach((button) => {
    const role = button.dataset.role;
    const active = role === currentRole;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
    button.textContent = roleDisplayNames[role]?.[currentLanguage] || button.textContent;
  });

  setText("#role-brand-title", labels?.[currentLanguage] || "AI ENGINEER");
  setText("#role-portrait-title", labels?.[currentLanguage] || "AI Engineer");
  setText(
    "#role-switcher-label",
    currentLanguage === "vi" ? "Khám phá portfolio theo vị trí" : "Explore portfolio by role",
  );
}

function applyRoleContent(role = currentRole) {
  const profile = profiles[role];
  const copy = profile?.copy?.[currentLanguage];
  if (!copy) return;

  document.body.dataset.activeRole = role;
  setText("#role-eyebrow", copy.hero.eyebrow);
  setText("#role-title-primary", copy.hero.titlePrimary);
  setText("#role-title-secondary", copy.hero.titleSecondary);
  setText("#role-hero-label", copy.hero.roleLabel);
  setTrustedHtml("#role-hero-description", copy.hero.description);
  setButtonLabel("#role-primary-action", copy.hero.primaryAction);
  setStatus("#role-hero-status", copy.hero.status);
  setText("#role-tech-label", currentLanguage === "vi" ? "Công nghệ trọng tâm" : "Focused technologies");

  const technologyList = $("#role-tech-list");
  if (technologyList) {
    technologyList.replaceChildren(...copy.hero.technologies.map(([icon, label]) => {
      const item = document.createElement("span");
      const iconElement = document.createElement("iconify-icon");
      iconElement.setAttribute("icon", icon);
      item.append(iconElement, document.createTextNode(label));
      return item;
    }));
  }

  setSplitHeading("#role-about-heading", copy.about.heading);
  setTrustedHtml("#role-about-first", copy.about.paragraphs[0]);
  setTrustedHtml("#role-about-second", copy.about.paragraphs[1]);
  $$("#role-about-points > div").forEach((point, index) => {
    const [title, description] = copy.about.points[index] || [];
    const copyContainer = $("span", point);
    if (!copyContainer) return;
    const strong = document.createElement("strong");
    strong.textContent = title || "";
    copyContainer.replaceChildren(strong, document.createTextNode(` ${description || ""}`));
  });

  setText("#role-expertise-kicker", copy.expertise.kicker);
  setSplitHeading("#role-expertise-heading", copy.expertise.heading);
  setText("#role-expertise-description", copy.expertise.description);
  $$(".expertise-card").forEach((card, index) => {
    const [title, description, tags] = copy.expertise.cards[index] || [];
    setText("h3", title, card);
    setText("p", description, card);
    setTags($(".tag-row", card), tags || []);
  });

  setText("#role-projects-kicker", copy.projects.kicker);
  setSplitHeading("#role-projects-heading", copy.projects.heading);
  setText("#role-projects-subtitle", copy.projects.subtitle);

  setSplitHeading("#role-contact-heading", copy.contact.heading);
  setText("#role-contact-description", copy.contact.description);
  setText("#role-footer-description", copy.footer.description);
  const footerStatus = $("#role-footer-status");
  if (footerStatus) {
    const indicator = document.createElement("i");
    footerStatus.replaceChildren(indicator, document.createTextNode(` ${copy.footer.status}`));
  }

  $$('[data-role-cv-link]').forEach((link) => {
    link.setAttribute("href", profile.cvHref);
  });

  updateRoleButtons();
  updateRoleProjectCards(copy);
  updateRoleProjectOrder(profile);
}

function updateRoleUrl() {
  const url = new URL(window.location.href);
  if (url.searchParams.get("role") === currentRole) return;
  url.searchParams.set("role", currentRole);
  window.history.pushState({ role: currentRole }, "", url);
}

function setRole(role, { updateUrl = true } = {}) {
  if (!supportedRoles.includes(role)) return;

  currentRole = role;
  if (roleContentReady) applyRoleContent(role);
  updateLanguageAttributes(currentLanguage);

  if (updateUrl) updateRoleUrl();
}

function setLanguage(language) {
  if (language === currentLanguage) return;

  translateTextNodes(language);
  currentLanguage = language;
  if (roleContentReady) applyRoleContent(currentRole);
  updateLanguageAttributes(language);

  try {
    window.localStorage.setItem("portfolio-language", language);
  } catch (error) {
    console.warn("Unable to save language preference:", error);
  }
}

let savedLanguage;
try {
  savedLanguage = window.localStorage.getItem("portfolio-language");
} catch (error) {
  console.warn("Unable to load language preference:", error);
}

updateLanguageAttributes(currentLanguage);
languageToggle?.addEventListener("click", () => {
  setLanguage(currentLanguage === "en" ? "vi" : "en");
});

$$('.role-switcher-options [data-role]').forEach((button) => {
  button.addEventListener("click", () => setRole(button.dataset.role));
});

window.addEventListener("popstate", () => {
  const requestedRole = new URLSearchParams(window.location.search).get("role");
  if (supportedRoles.includes(requestedRole)) setRole(requestedRole, { updateUrl: false });
});

/* Page ready */
window.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => document.body.classList.add("page-ready"));
});

/* Full-page background video */
const siteVideo = $("#site-video");
const videoToggle = $("#video-toggle");

if (siteVideo) {
  const markVideoReady = () => {
    siteVideo.classList.add("loaded");
    document.body.classList.add("video-ready");
  };

  const updateVideoButton = () => {
    if (!videoToggle) return;

    const paused = siteVideo.paused;
    const icon = videoToggle.querySelector("iconify-icon");

    icon?.setAttribute("icon", paused ? "lucide:play" : "lucide:pause");
    videoToggle.setAttribute(
      "aria-label",
      paused
        ? localizedText("Play background video", "Phát video nền")
        : localizedText("Pause background video", "Tạm dừng video nền")
    );
    videoToggle.setAttribute(
      "title",
      paused
        ? localizedText("Play background video", "Phát video nền")
        : localizedText("Pause background video", "Tạm dừng video nền")
    );
    videoToggle.classList.toggle("is-paused", paused);
  };

  const tryPlayVideo = async () => {
    try {
      siteVideo.muted = true;
      await siteVideo.play();
      markVideoReady();
      updateVideoButton();
    } catch (error) {
      console.warn("Background video autoplay was blocked:", error);
      updateVideoButton();
    }
  };

  if (siteVideo.readyState >= 2) {
    markVideoReady();
    tryPlayVideo();
  } else {
    siteVideo.addEventListener("loadeddata", markVideoReady, { once: true });
    siteVideo.addEventListener("canplay", tryPlayVideo, { once: true });
  }

  siteVideo.addEventListener("play", updateVideoButton);
  siteVideo.addEventListener("pause", updateVideoButton);

  siteVideo.addEventListener("error", () => {
    document.body.classList.add("video-fallback");
    videoToggle?.setAttribute("hidden", "");
    console.warn("Missing background video: videos/hero-video.mp4");
  });

  videoToggle?.addEventListener("click", async () => {
    if (siteVideo.paused) {
      document.body.classList.remove("video-user-paused");
      await tryPlayVideo();
    } else {
      document.body.classList.add("video-user-paused");
      siteVideo.pause();
    }
  });

  window.addEventListener("load", tryPlayVideo, { once: true });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !document.body.classList.contains("video-user-paused")) {
      tryPlayVideo();
    }
  });
}

/* Navigation */
const navbar = $("#navbar");
const menuButton = $("#menu-toggle");
const mobileNav = $("#mobile-nav");
const progressBar = $(".scroll-progress span");
const navLinks = $$(".desktop-nav a, .mobile-nav a");
const pageSections = $$("header[id], main section[id]");

function closeMenu() {
  mobileNav?.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuButton?.setAttribute("aria-expanded", "false");

  const icon = menuButton?.querySelector("iconify-icon");
  icon?.setAttribute("icon", "lucide:menu");
}

menuButton?.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("open");
  document.body.classList.toggle("menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));

  const icon = menuButton.querySelector("iconify-icon");
  icon.setAttribute("icon", open ? "lucide:x" : "lucide:menu");
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("click", (event) => {
  if (!navbar?.contains(event.target)) closeMenu();
});

function updateScrollUI() {
  const y = window.scrollY;
  navbar?.classList.toggle("scrolled", y > 45);

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  const videoShift = Math.min(28, y * 0.012);
  document.documentElement.style.setProperty(
    "--site-video-shift",
    `${videoShift}px`
  );

  if (progressBar) {
    progressBar.style.width = `${maxScroll > 0 ? (y / maxScroll) * 100 : 0}%`;
  }

  let current = "home";

  pageSections.forEach((section) => {
    if (y >= section.offsetTop - 190) current = section.id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

/* Reveal on scroll */
const revealElements = $$(".reveal");

if (reduceMotion) {
  revealElements.forEach((element) => element.classList.add("show"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -55px 0px",
    }
  );

  revealElements.forEach((element, index) => {
    if (!element.classList.contains("delay-1") &&
        !element.classList.contains("delay-2") &&
        !element.classList.contains("delay-3") &&
        !element.classList.contains("delay-4")) {
      element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    }

    revealObserver.observe(element);
  });
}

/* Count-up stats */
const counters = $$("[data-count]");

function animateCounter(element) {
  const target = Number(element.dataset.count);
  const decimals = Number(element.dataset.decimals || 0);
  const duration = 1200;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;

    element.textContent = decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toString();

    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

if (reduceMotion) {
  counters.forEach((counter) => {
    const decimals = Number(counter.dataset.decimals || 0);
    counter.textContent = Number(counter.dataset.count).toFixed(decimals);
  });
} else {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

/* Cursor glow */
const cursorGlow = $(".cursor-glow");

if (!reduceMotion && cursorGlow) {
  window.addEventListener(
    "pointermove",
    (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    },
    { passive: true }
  );
}

/* 3D tilt */
if (!reduceMotion) {
  $$("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 9;
      const rotateX = (0.5 - y) * 9;

      card.style.transform =
        `perspective(1300px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform =
        "perspective(1300px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  });
}

/* Parallax */
const parallaxItems = $$("[data-parallax]");

if (!reduceMotion && parallaxItems.length) {
  function updateParallax() {
    const viewportCenter = window.innerHeight / 2;

    parallaxItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const distance = itemCenter - viewportCenter;
      const speed = Number(item.dataset.parallax || 0.02);
      const offset = Math.max(-28, Math.min(28, -distance * speed));

      item.style.setProperty("--parallax-y", `${offset}px`);
    });
  }

  window.addEventListener("scroll", updateParallax, { passive: true });
  updateParallax();
}

/* Magnetic buttons */
if (!reduceMotion) {
  $$(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      button.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });

    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
}

/* Spotlight cards */
$$(".spotlight-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
  });
});

/* Journey timeline drawing */
const timeline = $("#journey-timeline");
const timelineProgress = $(".timeline-progress", timeline || document);
const timelineItems = $$(".timeline-item", timeline || document);

function updateTimeline() {
  if (!timeline || !timelineProgress) return;

  const rect = timeline.getBoundingClientRect();
  const viewportPoint = window.innerHeight * 0.72;
  const progress = Math.max(0, Math.min(1, (viewportPoint - rect.top) / rect.height));

  timelineProgress.style.height = `${progress * 100}%`;

  timelineItems.forEach((item) => {
    const itemRect = item.getBoundingClientRect();
    item.classList.toggle("active", itemRect.top < viewportPoint);
  });
}

window.addEventListener("scroll", updateTimeline, { passive: true });
updateTimeline();

/* Repository carousel: filtering + 3 cards per view */
const repoCards = $$(".repo-card");
const repoFilterButtons = $$(".project-filters button");
const repoCount = $("#repoCount");
const repoRange = $("#repoRange");
const repoTrack = $("#repoTrack");
const repoViewport = $("#repoViewport");
const repoPrev = $("#repoPrev");
const repoNext = $("#repoNext");

repoCards.forEach((card) => {
  card.dataset.defaultTitle = $(".repo-card-body h3", card).textContent;
  const description = $(".repo-card-body p", card);
  if (!description) return;
  card.dataset.defaultDescriptionEn = description.textContent.trim();
  card.dataset.defaultDescriptionVi = languagePairs.reduce(
    (value, [en, vi]) => value.replace(new RegExp(textPattern(en), "g"), vi),
    description.textContent.trim(),
  );
});

if (repoTrack) {
  repoCards
    .sort((a, b) => Number(a.dataset.priority) - Number(b.dataset.priority))
    .forEach((card, index) => {
      repoTrack.append(card);

      const number = $(".repo-card-number", card);
      if (number) number.textContent = String(index + 1).padStart(2, "0");
    });
}

let repoCurrentIndex = 0;
let repoActiveFilter = "all";

function getRepoCardsPerView() {
  if (window.innerWidth <= 720) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function getVisibleRepoCards() {
  return repoCards.filter((card) => !card.hidden);
}

function updateRepoCarousel({ animate = true } = {}) {
  if (!repoTrack || !repoViewport) return;

  const visibleCards = getVisibleRepoCards();
  const cardsPerView = getRepoCardsPerView();
  const maxIndex = Math.max(0, visibleCards.length - cardsPerView);
  repoCurrentIndex = Math.min(Math.max(repoCurrentIndex, 0), maxIndex);

  const targetCard = visibleCards[repoCurrentIndex];
  const offset = targetCard ? targetCard.offsetLeft : 0;

  repoTrack.style.transitionDuration = animate && !reduceMotion ? ".58s" : "0s";
  repoTrack.style.transform = `translate3d(${-offset}px, 0, 0)`;

  if (repoPrev) repoPrev.disabled = repoCurrentIndex <= 0;
  if (repoNext) repoNext.disabled = repoCurrentIndex >= maxIndex;

  if (repoCount) repoCount.textContent = String(visibleCards.length);

  if (repoRange) {
    if (!visibleCards.length) {
      repoRange.textContent = "0";
    } else {
      const start = repoCurrentIndex + 1;
      const end = Math.min(repoCurrentIndex + cardsPerView, visibleCards.length);
      repoRange.textContent = start === end ? String(start) : `${start}–${end}`;
    }
  }
}

function moveRepoCarousel(direction) {
  const visibleCards = getVisibleRepoCards();
  const cardsPerView = getRepoCardsPerView();
  const maxIndex = Math.max(0, visibleCards.length - cardsPerView);
  const nextIndex = repoCurrentIndex + direction * cardsPerView;

  repoCurrentIndex = Math.min(Math.max(nextIndex, 0), maxIndex);
  updateRepoCarousel();
}

function applyRepoFilter(filter) {
  repoActiveFilter = filter;
  repoCurrentIndex = 0;

  repoCards.forEach((card) => {
    const visible = filter === "all" || card.dataset.category === filter;
    card.hidden = !visible;
    card.classList.remove("is-active");
  });

  requestAnimationFrame(() => updateRepoCarousel({ animate: false }));
}

repoPrev?.addEventListener("click", () => moveRepoCarousel(-1));
repoNext?.addEventListener("click", () => moveRepoCarousel(1));

repoFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    repoFilterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });

    applyRepoFilter(button.dataset.filter || "all");
  });
});

repoCards.forEach((card) => {
  card.addEventListener("keydown", (event) => {
    if (event.target.closest("a")) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      card.classList.toggle("is-active");
    }
  });

  card.addEventListener("click", (event) => {
    if (!window.matchMedia("(hover: none)").matches) return;
    if (event.target.closest("a")) return;

    if (!card.classList.contains("is-active")) {
      event.preventDefault();
      repoCards.forEach((item) => item.classList.remove("is-active"));
      card.classList.add("is-active");
    }
  });
});

repoViewport?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") moveRepoCarousel(-1);
  if (event.key === "ArrowRight") moveRepoCarousel(1);
});

let repoResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(repoResizeTimer);
  repoResizeTimer = setTimeout(() => updateRepoCarousel({ animate: false }), 100);
});

window.addEventListener("load", () => updateRepoCarousel({ animate: false }), { once: true });
applyRepoFilter(repoActiveFilter);

roleContentReady = true;
if (savedLanguage === "vi") setLanguage("vi");
else applyRoleContent(currentRole);
updateLanguageAttributes(currentLanguage);

/* Neural network canvas */
const canvas = $("#network-canvas");
const context = canvas?.getContext("2d");

let width = 0;
let height = 0;
let ratio = 1;
let nodes = [];
let pointer = { x: -9999, y: -9999 };

function createNode() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    radius: 1 + Math.random() * 1.4,
  };
}

function resizeCanvas() {
  if (!canvas || !context) return;

  ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  const nodeCount = Math.max(24, Math.min(70, Math.floor(width / 24)));
  nodes = Array.from({ length: nodeCount }, createNode);
}

function drawNetwork() {
  if (!context || reduceMotion) return;

  context.clearRect(0, 0, width, height);

  nodes.forEach((node) => {
    node.x += node.vx;
    node.y += node.vy;

    if (node.x < -20) node.x = width + 20;
    if (node.x > width + 20) node.x = -20;
    if (node.y < -20) node.y = height + 20;
    if (node.y > height + 20) node.y = -20;

    const dx = node.x - pointer.x;
    const dy = node.y - pointer.y;
    const pointerDistance = Math.hypot(dx, dy);

    if (pointerDistance < 130 && pointerDistance > 0) {
      node.x += (dx / pointerDistance) * 0.18;
      node.y += (dy / pointerDistance) * 0.18;
    }
  });

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);

      if (distance < 125) {
        const alpha = (1 - distance / 125) * 0.13;

        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.strokeStyle = `rgba(197, 225, 151, ${alpha})`;
        context.lineWidth = 0.6;
        context.stroke();
      }
    }
  }

  nodes.forEach((node) => {
    context.beginPath();
    context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    context.fillStyle = "rgba(197, 225, 151, .25)";
    context.fill();
  });

  requestAnimationFrame(drawNetwork);
}

if (canvas && context && !reduceMotion) {
  resizeCanvas();

  window.addEventListener("resize", resizeCanvas, { passive: true });

  window.addEventListener(
    "pointermove",
    (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    },
    { passive: true }
  );

  window.addEventListener("pointerleave", () => {
    pointer.x = -9999;
    pointer.y = -9999;
  });

  drawNetwork();
}
