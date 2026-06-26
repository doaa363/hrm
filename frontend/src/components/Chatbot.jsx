import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

// ─────────────────────────────────────────────
//  Smart built-in HR knowledge engine
//  No API key or backend needed — works offline
// ─────────────────────────────────────────────
const hrKnowledge = [
  {
    keywords: ['leave', 'leaves', 'vacation', 'annual', 'pto', 'day off', 'time off'],
    response: `📅 **Leave Policy**\n\nEmployees are entitled to:\n• 21 days Annual Leave per year\n• 14 days Sick Leave (with medical certificate)\n• 3 days Emergency/Compassionate Leave\n• Maternity: 90 days | Paternity: 7 days\n\nTo request leave, go to the **Leaves** section in the sidebar and submit a new request. Your manager will receive an automatic notification for approval.`,
  },
  {
    keywords: ['attendance', 'check in', 'check-in', 'clock in', 'present', 'absent', 'late'],
    response: `🕐 **Attendance Tracking**\n\nAttendance is tracked daily. Work hours are:\n• Shift Start: 9:00 AM\n• Shift End: 5:00 PM\n• Grace Period: 15 minutes\n\nLate arrivals after 9:15 AM are marked as "Late". 3 consecutive absences without notice triggers an automatic HR alert.\n\nView your attendance history under the **Attendance** page in the sidebar.`,
  },
  {
    keywords: ['salary', 'payroll', 'pay', 'wage', 'payment', 'compensation', 'money'],
    response: `💰 **Payroll Information**\n\nSalaries are processed on the **last working day** of each month. Payslips are emailed automatically.\n\nDeductions include:\n• Tax (based on income bracket)\n• Social Insurance: 11% employee share\n• Any approved loan installments\n\nFor payslip disputes or corrections, contact HR at **hr@company.com** within 5 business days of payment.`,
  },
  {
    keywords: ['password', 'reset', 'forgot', 'login', 'access', 'locked', 'account'],
    response: `🔐 **Account & Password Help**\n\nTo reset your password:\n1. Click "Forgot Password" on the login page\n2. Enter your company email\n3. Check your inbox for the reset link (valid for 30 mins)\n\nIf your account is locked after failed attempts, contact your **System Admin** or email **it-support@company.com**.`,
  },
  {
    keywords: ['profile', 'update', 'photo', 'picture', 'personal', 'information', 'details'],
    response: `👤 **Updating Your Profile**\n\nYou can update your personal details by:\n1. Clicking your avatar in the top-right corner\n2. Going to **Profile** settings\n3. Editing your name, phone, department, or profile photo\n\nNote: Changes to your Job Title or Department require manager approval.`,
  },
  {
    keywords: ['report', 'reports', 'analytics', 'export', 'download', 'summary'],
    response: `📊 **Reports & Analytics**\n\nThe **Reports** page gives you access to:\n• Monthly Attendance Summary\n• Leave Utilization Report\n• Department Headcount\n• Employee Performance Overview\n\nReports can be exported as **PDF** or **Excel**. Only HR Managers and Admins can access full-company reports.`,
  },
  {
    keywords: ['employee', 'employees', 'hire', 'onboard', 'new staff', 'add employee'],
    response: `👥 **Employee Management**\n\nTo add a new employee:\n1. Go to the **Employees** page\n2. Click **"Add Employee"**\n3. Fill in personal info, department, role, and start date\n4. System sends an auto-welcome email with login credentials\n\nOnly HR Managers and Admins can add or deactivate employees.`,
  },
  {
    keywords: ['role', 'roles', 'permission', 'permissions', 'admin', 'manager', 'access level'],
    response: `🛡️ **User Roles & Permissions**\n\nThe system has 3 roles:\n\n• **Admin** — Full access: manage employees, settings, all reports\n• **HR Manager** — Manage leaves, attendance, employees, reports\n• **Employee** — View own profile, attendance, submit leave requests\n\nRole assignments are managed by the Admin under **Settings**.`,
  },
  {
    keywords: ['sick', 'medical', 'illness', 'doctor', 'hospital', 'health'],
    response: `🏥 **Sick Leave Policy**\n\nEmployees are entitled to **14 sick days** per year.\n\n• 1-2 days: Self-declaration is accepted\n• 3+ days: Medical certificate required\n• Uncertified sick leave beyond 2 days is marked as "Unpaid Leave"\n\nSubmit sick leave through the **Leaves** section. Upload your medical certificate in the request form.`,
  },
  {
    keywords: ['audit', 'audit log', 'logs', 'history', 'activity', 'track'],
    response: `📋 **Audit Logs**\n\nThe **Audit Logs** page tracks all important system activities:\n• Login/logout events\n• Employee data changes\n• Leave approvals/rejections\n• Settings modifications\n\nAudit logs are read-only and retained for **12 months**. Only Admins and HR Managers can view them.`,
  },
  {
    keywords: ['settings', 'setting', 'configure', 'company', 'setup'],
    response: `⚙️ **System Settings**\n\nAdmins can configure:\n• Company name, logo, and working hours\n• Email notification preferences\n• Leave policy limits per role\n• Department and position management\n\nAccess settings via the **Settings** page in the sidebar.`,
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'greetings', 'howdy'],
    response: `👋 Hello! I'm your **HR AI Assistant**.\n\nI can help you with:\n• 📅 Leave requests & policies\n• 🕐 Attendance tracking\n• 💰 Payroll & salary info\n• 👥 Employee management\n• 🛡️ Roles & permissions\n• 📊 Reports & analytics\n\nWhat would you like to know?`,
  },
  {
    keywords: ['thank', 'thanks', 'thank you', 'great', 'helpful', 'awesome', 'perfect'],
    response: `😊 You're welcome! I'm always here to help.\n\nIs there anything else you'd like to know about the HR system?`,
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'later', 'exit', 'close'],
    response: `👋 Goodbye! Have a productive day!\n\nFeel free to chat again anytime you need HR assistance.`,
  },
  {
    keywords: ['overtime', 'extra hours', 'work late', 'weekend work'],
    response: `⏰ **Overtime Policy**\n\nOvertime pay is calculated at:\n• Weekdays: 1.5× hourly rate\n• Weekends: 2× hourly rate\n• Public Holidays: 2.5× hourly rate\n\nOvertime must be pre-approved by your direct manager. Submit overtime requests at least 24 hours in advance through HR.`,
  },
  {
    keywords: ['holiday', 'public holiday', 'national holiday', 'off day'],
    response: `🎉 **Public Holidays**\n\nThe company follows the official government public holiday calendar. Employees are entitled to all declared public holidays as paid days off.\n\nIf work is required on a public holiday, double-time compensation applies (2.5× rate). A full holiday schedule is shared at the beginning of each year.`,
  },
  {
    keywords: ['probation', 'probationary', 'new employee', 'trial period'],
    response: `📝 **Probation Period**\n\nNew employees undergo a **3-month probationary period**. During this time:\n• Performance is reviewed at 30, 60, and 90 days\n• Annual leave accrual begins from day 1\n• Either party may terminate with 2 weeks notice\n\nSuccessful completion leads to full employment confirmation.`,
  },
  {
    keywords: ['resign', 'resignation', 'notice', 'quit', 'termination', 'exit'],
    response: `📤 **Resignation Process**\n\n1. Submit a formal resignation letter to your manager\n2. Notice period: **30 days** (standard)\n3. HR will schedule an **exit interview**\n4. Final payslip includes any unused leave payout\n5. Return company assets (laptop, badge, etc.) on last day\n\nFor immediate resignation, contact HR directly.`,
  },
];

const DEFAULT_RESPONSE = `🤔 I'm not sure I understood that fully.\n\nHere are topics I can help with:\n• Leave & vacation policies\n• Attendance & working hours\n• Payroll & salary\n• Employee management\n• Roles & permissions\n• Reports & audit logs\n• Account & password help\n\nTry asking something like: *"How do I request leave?"* or *"What is the overtime policy?"*`;

function getSmartResponse(userInput) {
  const text = userInput.toLowerCase();
  for (const entry of hrKnowledge) {
    if (entry.keywords.some((kw) => text.includes(kw))) {
      return entry.response;
    }
  }
  return DEFAULT_RESPONSE;
}

// ─────────────────────────────────────────────
//  Chatbot Component
// ─────────────────────────────────────────────
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: "Hello! I'm your HR AI Assistant 👋\nI can help with attendance, leave requests, payroll, and much more.\n\nWhat can I help you with today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newUserMessage = { role: 'user', text: trimmed };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      // Try real Gemini AI first
      const history = updatedMessages.slice(0, -1);
      const { data } = await axios.post('http://localhost:5000/api/ai/chat', {
        message: trimmed,
        history,
      });
      setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
    } catch (err) {
      // Handle quota limit gracefully
      if (err.response?.status === 429) {
        setMessages((prev) => [...prev, {
          role: 'model',
          text: '⏳ The AI is temporarily at capacity. Answering from the built-in HR knowledge base instead:\n\n' + getSmartResponse(trimmed),
        }]);
      } else {
        // General fallback to built-in HR knowledge base
        const fallback = getSmartResponse(trimmed);
        setMessages((prev) => [...prev, { role: 'model', text: fallback }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'model',
        text: "Hello! I'm your HR AI Assistant 👋\nI can help with attendance, leave requests, payroll, and much more.\n\nWhat can I help you with today?",
      },
    ]);
  };

  // Suggested quick questions
  const quickQuestions = [
    '📅 How do I request leave?',
    '🕐 What are work hours?',
    '💰 When is payday?',
    '🛡️ What roles exist?',
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        style={styles.floatBtn}
        title="HR AI Assistant"
        id="chatbot-toggle-btn"
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={styles.window} id="chatbot-window">
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.avatarDot}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </div>
              <div>
                <p style={styles.headerTitle}>HR AI Assistant</p>
                <p style={styles.headerSub}>● Always Online</p>
              </div>
            </div>
            <button onClick={clearChat} style={styles.clearBtn} title="Clear chat">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-3" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div style={styles.messages} id="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
                {msg.role === 'model' && <span style={styles.avatarEmoji}>🤖</span>}
                <div style={msg.role === 'user' ? styles.userBubble : styles.botBubble}>
                  {msg.text.split('\n').map((line, j) => (
                    <span key={j}>
                      {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                      {j < msg.text.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
                {msg.role === 'user' && <span style={styles.avatarEmoji}>👤</span>}
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={styles.avatarEmoji}>🤖</span>
                <div style={styles.botBubble}>
                  <div style={styles.typingDots}>
                    <span style={{ ...styles.dot, animationDelay: '0s' }} />
                    <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
                    <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions (only show when first message) */}
          {messages.length === 1 && (
            <div style={styles.quickWrap}>
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  style={styles.quickBtn}
                  onClick={() => {
                    setInput(q.replace(/^[^\s]+\s/, '')); // strip emoji
                    setTimeout(() => {
                      const clean = q.replace(/^[^\s]+\s/, '');
                      const delay = 600 + Math.random() * 600;
                      setMessages((prev) => [...prev, { role: 'user', text: clean }]);
                      setLoading(true);
                      axios.post('http://localhost:5000/api/ai/chat', { message: clean, history: [] })
                        .then(({ data }) => setMessages((prev) => [...prev, { role: 'model', text: data.reply }]))
                        .catch(() => setMessages((prev) => [...prev, { role: 'model', text: getSmartResponse(clean) }]))
                        .finally(() => setLoading(false));
                      setInput('');
                    }, 50);
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={styles.inputArea}>
            <textarea
              id="chatbot-input"
              rows={1}
              style={styles.textarea}
              placeholder="Ask your HR assistant..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              id="chatbot-send-btn"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                ...styles.sendBtn,
                opacity: loading || !input.trim() ? 0.5 : 1,
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p style={styles.footer}>Powered by Google Gemini AI ✨</p>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.5); }
          70%  { box-shadow: 0 0 0 12px rgba(99,102,241,0); }
          100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }
        #chatbot-quick button:hover {
          background: rgba(99,102,241,0.25) !important;
          border-color: rgba(99,102,241,0.5) !important;
        }
      `}</style>
    </>
  );
};

const styles = {
  floatBtn: {
    position: 'fixed',
    bottom: 64,
    left: 'calc(280px + 16in)',
    width: 58,
    height: 58,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(99,102,241,0.5)',
    zIndex: 9999,
    animation: 'pulse-ring 2.5s infinite',
    transition: 'transform 0.2s',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    background: '#22c55e',
    color: 'white',
    fontSize: 9,
    fontWeight: 800,
    borderRadius: 20,
    padding: '1px 5px',
    letterSpacing: 0.5,
  },
  window: {
    position: 'fixed',
    bottom: 136,
    left: 'calc(280px + 16in)',
    right: 'auto',
    width: 360,
    maxHeight: 580,
    background: '#0f172a',
    borderRadius: 20,
    boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 9998,
    overflow: 'hidden',
    animation: 'slideUp 0.25s ease',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  header: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  avatarDot: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 700,
    fontSize: 14,
    margin: 0,
  },
  headerSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    margin: 0,
  },
  clearBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    borderRadius: 8,
    color: 'white',
    cursor: 'pointer',
    padding: '6px 8px',
    display: 'flex',
    alignItems: 'center',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    maxHeight: 320,
    scrollbarWidth: 'thin',
    scrollbarColor: '#334155 transparent',
  },
  avatarEmoji: {
    fontSize: 20,
    alignSelf: 'flex-end',
    margin: '0 6px',
    flexShrink: 0,
  },
  botBubble: {
    background: '#1e293b',
    color: '#e2e8f0',
    borderRadius: '16px 16px 16px 4px',
    padding: '10px 14px',
    fontSize: 13,
    lineHeight: 1.65,
    maxWidth: 260,
    border: '1px solid rgba(255,255,255,0.06)',
    wordBreak: 'break-word',
  },
  userBubble: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    borderRadius: '16px 16px 4px 16px',
    padding: '10px 14px',
    fontSize: 13,
    lineHeight: 1.65,
    maxWidth: 260,
    wordBreak: 'break-word',
  },
  typingDots: {
    display: 'flex',
    gap: 4,
    alignItems: 'center',
    height: 16,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#6366f1',
    display: 'inline-block',
    animation: 'bounce 1.2s infinite',
  },
  quickWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    padding: '6px 12px 10px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    flexShrink: 0,
  },
  quickBtn: {
    background: 'rgba(99,102,241,0.12)',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: 20,
    color: '#a5b4fc',
    fontSize: 11,
    padding: '5px 10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  inputArea: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 8,
    padding: '10px 12px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    background: '#0f172a',
    flexShrink: 0,
  },
  textarea: {
    flex: 1,
    background: '#1e293b',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: '#e2e8f0',
    fontSize: 13,
    padding: '10px 12px',
    resize: 'none',
    outline: 'none',
    lineHeight: 1.5,
    fontFamily: 'inherit',
    maxHeight: 80,
    overflowY: 'auto',
  },
  sendBtn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    borderRadius: 12,
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'opacity 0.2s',
  },
  footer: {
    textAlign: 'center',
    fontSize: 10,
    color: '#475569',
    padding: '4px 0 8px',
    margin: 0,
    background: '#0f172a',
    flexShrink: 0,
  },
};

export default Chatbot;
