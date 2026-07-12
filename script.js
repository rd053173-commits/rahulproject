const protocolEl = document.getElementById('protocol');
const connectionEl = document.getElementById('connection');
const browserEl = document.getElementById('browser');
const scoreEl = document.getElementById('score');
const reasonsEl = document.getElementById('reasons');
const historyEl = document.getElementById('history');

let score = 50;
let reasons = [];

function runScan(){
  if(location.protocol === 'https:'){
    protocolEl.textContent = 'HTTPS';
    score += 30;
    reasons.push('Secure HTTPS connection detected.');
  }else{
    protocolEl.textContent = 'HTTP';
    reasons.push('Connection is not encrypted.');
  }

  const ua = navigator.userAgent;
  if(ua.includes('Chrome')) browserEl.textContent = 'Google Chrome';
  else if(ua.includes('Firefox')) browserEl.textContent = 'Mozilla Firefox';
  else browserEl.textContent = 'Other Browser';

  if(navigator.onLine){
    connectionEl.textContent = 'Online';
    score += 10;
    reasons.push('Internet connection active.');
  }else{
    connectionEl.textContent = 'Offline';
    reasons.push('Device appears offline.');
  }

  if(score > 100) score = 100;

  scoreEl.textContent = score;
  reasonsEl.innerHTML = '';
  reasons.forEach(r=>{
    const li = document.createElement('li');
    li.textContent = r;
    reasonsEl.appendChild(li);
  });

  saveHistory();
  loadHistory();
}

function saveHistory(){
  const history = JSON.parse(localStorage.getItem('history') || '[]');
  history.unshift({
    date: new Date().toLocaleString(),
    score: score
  });
  localStorage.setItem('history', JSON.stringify(history.slice(0,10)));
}

function loadHistory(){
  const history = JSON.parse(localStorage.getItem('history') || '[]');
  historyEl.innerHTML = '';
  if(history.length === 0){
    historyEl.innerHTML = '<li>No history yet</li>';
    return;
  }
  history.forEach(item=>{
    const li = document.createElement('li');
    li.textContent = `${item.date} - Score ${item.score}`;
    historyEl.appendChild(li);
  });
}

runScan();

document.getElementById('checkBtn').addEventListener('click', ()=>{
  const password = document.getElementById('passwordInput').value;
  const fill = document.getElementById('strengthFill');
  const text = document.getElementById('strengthText');

  let strength = 0;
  if(password.length >= 8) strength += 25;
  if(/[A-Z]/.test(password)) strength += 25;
  if(/[0-9]/.test(password)) strength += 25;
  if(/[^A-Za-z0-9]/.test(password)) strength += 25;

  fill.style.width = strength + '%';

  if(strength <= 25){
    fill.style.background = 'red';
    text.textContent = 'Weak password';
  }else if(strength <= 50){
    fill.style.background = 'orange';
    text.textContent = 'Moderate password';
  }else if(strength <= 75){
    fill.style.background = 'gold';
    text.textContent = 'Good password';
  }else{
    fill.style.background = 'limegreen';
    text.textContent = 'Strong password';
  }
});

document.getElementById('exportBtn').addEventListener('click', ()=>{
  const report = `WiFi Security Auditor Report\n\nDate: ${new Date().toLocaleString()}\nScore: ${score}\n\nFindings:\n- ${reasons.join('\n- ')}`;
  const blob = new Blob([report], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'security-report.txt';
  a.click();
  URL.revokeObjectURL(url);
});
