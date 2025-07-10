let step = 0;
let lang = "";
const chatbox = document.getElementById("chatbox");
const title = document.getElementById("title");

const ui = {
  hi: {
    greeting: "👋 नमस्ते! कृपया भाषा चुनें:",
    yes: "हाँ", no: "नहीं",
    restart: "🔁 दोबारा शुरू करें",
    thanks: "आपकी रुचि के लिए धन्यवाद!",
    ineligible: "B.Sc Nursing में admission के लिए Biology आवश्यक है।",
    ended: "आप बाद में कभी भी दोबारा पूछ सकते हैं। धन्यवाद!",
    title: "🎓 नर्सिंग बॉट",
    tooltipRestart: "नई बातचीत",
    tooltipTheme: "थीम बदलें"
  },
  en: {
    greeting: "👋 Hello! Please select your language:",
    yes: "Yes", no: "No",
    restart: "🔁 Restart",
    thanks: "Thank you for your interest!",
    ineligible: "Biology is mandatory for B.Sc Nursing admission.",
    ended: "You can always come back later. Thank you!",
    title: "🎓 Nursing Bot",
    tooltipRestart: "New Chat",
    tooltipTheme: "Toggle Theme"
  }
};

const responses = {
  hi: [
    "क्या आप Nursing College में admission लेना चाहते हैं?",
    "क्या आपने 12वीं में Biology पढ़ा है?",
    "यह एक full-time B.Sc Nursing course है। क्या आप अधिक जानकारी चाहते हैं?",
    "फीस संरचना: Tuition ₹60,000 + Bus ₹10,000 = कुल ₹70,000।\nInstallments: ₹30k, ₹20k, ₹20k।",
    "Hostel: 24x7 बिजली/पानी, CCTV, Warden। Training: असली patients के साथ काम।",
    "कॉलेज Delhi में स्थित है। क्या आप location के बारे में और जानना चाहते हैं?",
    "कॉलेज को Indian Nursing Council (Delhi) से मान्यता प्राप्त है।",
    "Clinical Training Locations:\n- District Hospital (Backundpur)\n- CHCs\n- Regional Hospital (Chartha)\n- Ranchi Neuro",
    "Scholarships:\n- Govt: ₹18k–₹23k\n- Labour Ministry: ₹40k–₹48k (लोगों के लिए जिनके पास लेबर रजिस्ट्रेशन है)",
    "कुल 60 सीटें उपलब्ध हैं।",
    "Admission Eligibility:\n- 12वीं में Biology\n- PNT Exam पास\n- आयु: 17–35 वर्ष"
  ],
  en: [
    "Are you interested in taking admission in the Nursing College?",
    "Did you study Biology in 12th grade?",
    "It’s a full-time B.Sc Nursing course. Would you like to know more?",
    "Fee Structure:\nTuition ₹60,000 + Bus ₹10,000 = ₹70,000\nInstallments: ₹30k, ₹20k, ₹20k",
    "Hostel: 24x7 electricity/water, CCTV, Warden.\nTraining: Real patient work included.",
    "The college is located in Delhi. Want to know more about the location?",
    "The college is recognized by the Indian Nursing Council (Delhi).",
    "Clinical Training Locations:\n- District Hospital (Backundpur)\n- CHCs\n- Regional Hospital (Chartha)\n- Ranchi Neurosurgery",
    "Scholarships:\n- Govt: ₹18k–₹23k\n- Labour Ministry: ₹40k–₹48k (requires Labour Registration)",
    "There are a total of 60 seats available.",
    "Eligibility:\n- Biology in 12th\n- Passed PNT Exam\n- Age: 17–35 years"
  ]
};

function appendMessage(sender, msg) {
  const div = document.createElement("div");
  div.className = "message " + (sender === "Bot" ? "bot" : "user");
  div.textContent = msg;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
  return div;
}

function typeResponse(msg, showBtns = false) {
  const div = appendMessage("Bot", "Typing...");
  let i = 0;
  const interval = setInterval(() => {
    div.textContent = msg.slice(0, ++i);
    if (i === msg.length) {
      clearInterval(interval);
      if (showBtns) showButtons(div);
    }
  }, 25);
}

function showButtons(container) {
  const wrap = document.createElement("div");
  wrap.className = "btn-wrap";
  [ui[lang].yes, ui[lang].no].forEach(text => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = text;
    btn.onclick = () => {
      appendMessage("You", text);
      wrap.remove();
      handleReply(text.toLowerCase());
    };
    wrap.appendChild(btn);
  });
  container.appendChild(wrap);
}

function handleReply(reply) {
  const isYes = reply === ui[lang].yes.toLowerCase();
  const isNo = reply === ui[lang].no.toLowerCase();

  // Step 1 — If says no initially
  if (step === 0 && isNo) return politeEnd();

  // Step 2 — Biology check
  if (step === 1 && isNo) return ineligibleEnd();

  if (isNo) return politeEnd();

  step++;
  if (step < responses[lang].length) {
    typeResponse(responses[lang][step], true);
  } else {
    endChat();
  }
}

function politeEnd() {
  appendMessage("Bot", ui[lang].ended);
  restartButton();
}

function ineligibleEnd() {
  appendMessage("Bot", ui[lang].ineligible);
  restartButton();
}

function endChat() {
  appendMessage("Bot", ui[lang].thanks);
  restartButton();
}

function restartButton() {
  const wrap = document.createElement("div");
  wrap.className = "btn-wrap";
  const btn = document.createElement("button");
  btn.className = "option-btn";
  btn.textContent = ui[lang].restart;
  btn.onclick = resetChat;
  wrap.appendChild(btn);
  chatbox.appendChild(wrap);
}

function resetChat() {
  chatbox.innerHTML = "";
  step = 0;
  lang = "";
  appendMessage("Bot", ui.en.greeting);

  const wrap = document.createElement("div");
  wrap.className = "btn-wrap";
  ["Hindi", "English"].forEach(l => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = l;
    btn.onclick = () => {
      appendMessage("You", l);
      lang = l === "Hindi" ? "hi" : "en";
      step = 0;
      wrap.remove();
      updateUI();
      typeResponse(responses[lang][step], true);
    };
    wrap.appendChild(btn);
  });
  setTimeout(() => chatbox.appendChild(wrap), 400);
}

function updateUI() {
  if (!lang) return;
  title.textContent = ui[lang].title;
  document.querySelectorAll(".actions button")[0].title = ui[lang].tooltipRestart;
  document.querySelectorAll(".actions button")[1].title = ui[lang].tooltipTheme;
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

window.onload = resetChat;
