
import { useState } from "react";
import "./App.css";

const questions = [
  { icon: "✦", text: "Why should we hire you?" },
  { icon: "⚡", text: "What are your technical skills?" },
  { icon: "⌘", text: "Tell me about your projects." },
  { icon: "🏆", text: "What are your greatest strengths?" },
];

function App() {
  const [activeQuestion, setActiveQuestion] = useState(
    "Why should we hire you?"
  );

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I am Khizar's AI Portfolio Assistant. Ask me anything about the candidate's resume, skills, projects, or education.",
    },
  ]);

  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);

  async function askQuestion(question) {
    const cleanQuestion = question.trim();

    if (!cleanQuestion || loading) return;

    setActiveQuestion(cleanQuestion);
    setInput("");

    setMessages((previous) => [
      ...previous,
      { role: "user", text: cleanQuestion },
    ]);

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: cleanQuestion,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: data.answer || "The AI returned an empty answer.",
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: "Sorry, I couldn't connect to the AI server. Please check that your backend is running and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!loading) {
      askQuestion(input);
    }
  }

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <header className="navbar">
        <a className="brand" href="#home">
          <div className="brand-logo">KH</div>

          <div>
            <h2>Khizar Hafeez</h2>
            <p>AI Portfolio • Interview Assistant</p>
          </div>
        </a>

        <nav className="nav-links">
          <a className="nav-active" href="#home">
            ⌂ Home
          </a>
          <a href="#about">♙ About</a>
          <a href="#skills">⚙ Skills</a>
          <a href="#projects">▣ Projects</a>
          <a href="#experience">▤ Experience</a>
          <a href="#chat">▢ Chat with AI</a>
        </nav>

        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle theme"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">
              <span className="status-dot"></span>
              PERSONAL PORTFOLIO • AI POWERED
            </span>

            <h1>
              Welcome to My
              <span> AI-Powered Portfolio</span>
            </h1>

            <p className="hero-description">
              Explore my skills, projects, and experience.
              Have a question? My AI interview assistant is
              here to help you learn more about me.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#projects">
                ↗ Explore My Work <span>→</span>
              </a>

              <a className="secondary-button" href="#chat">
                Chat with AI <span>✦</span>
              </a>

              <a className="secondary-button"
                href="http://127.0.0.1:8000/download-resume"
                download="Khizar_Hafeez_Resume.pdf"
              >
                ↓ Download Resume
              </a>

              
            </div>

            
          </div>

          {/* AI Illustration */}
          <div className="hero-visual">
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>

            <div className="floating-card floating-top">
              <span className="floating-icon">✦</span>

              <div>
                <strong>Smart Assistant</strong>
                <span>Resume-based answers</span>
              </div>
            </div>

            <div className="ai-illustration">
              <div className="ai-glow"></div>

              <div className="ai-window">
                <div className="window-dots">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>

                <div className="ai-symbol">AI</div>
                <div className="ai-line"></div>
                <div className="ai-line short"></div>

                <div className="mini-chip">
                  ✦ Intelligent Assistant
                </div>
              </div>

              <div className="platform"></div>

              <div className="spark spark-one">✦</div>
              <div className="spark spark-two">✧</div>
            </div>

            <div className="floating-card floating-bottom">
              <span className="floating-icon">⌘</span>

              <div>
                <strong>Built with AI</strong>
                <span>FastAPI + Groq</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sample HR Questions */}
        <section className="sample-section" id="about">
          <div className="sample-intro">
            <span className="sample-star">✦</span>

            <div>
              <h3>Sample Questions</h3>
              <p>Click any question to start</p>
            </div>
          </div>

          <div className="question-pills">
            {questions.map((question) => (
              <button
                key={question.text}
                className={
                  activeQuestion === question.text
                    ? "question-pill selected"
                    : "question-pill"
                }
                onClick={() => askQuestion(question.text)}
                disabled={loading}
              >
                <span>{question.icon}</span>
                {question.text}
              </button>
            ))}
          </div>
        </section>

        {/* Portfolio Information and AI Chat */}
        <section className="content-grid">
          <div className="info-column">
            {/* Skills */}
            <article className="info-card" id="skills">
              <div className="section-label">
                01 / WHAT I KNOW
              </div>

              <h2>Technical Skills</h2>

              <p className="muted">
                Technologies I am exploring through learning
                and projects.
              </p>

              <div className="skill-list">
                <span>Python</span>
                <span>FastAPI</span>
                <span>REST APIs</span>
                <span>AI / LLMs</span>
                <span>PDF Processing</span>
                <span>JavaScript</span>
              </div>
            </article>

            {/* Project */}
            <article className="info-card" id="projects">
              <div className="section-label">
                02 / WHAT I BUILD
              </div>

              <h2>Featured Project</h2>

              <div className="project-icon">✧</div>

              <h3>AI Personal Portfolio</h3>

              <p className="muted">
                An AI interview assistant that reads a resume
                and answers questions about the candidate.
              </p>

              <div className="project-footer">
                <span>Python · FastAPI · Groq</span>

                <span className="project-status">
                  <i></i> In Progress
                </span>
              </div>
            </article>

            {/* Education */}
            <article className="info-card" id="experience">
              <div className="section-label">
                03 / MY JOURNEY
              </div>

              <h2>Education & Growth</h2>

              <p className="muted">
                Computer science student focused on software
                development, AI integration, and practical
                project experience.
              </p>
            </article>
          </div>

          {/* Real AI Chat */}
          <section className="chat-panel" id="chat">
            <div className="chat-header">
              <div className="bot-avatar">✦</div>

              <div className="chat-title">
                <h2>AI Interview Assistant</h2>

                <p>
                  <span className="status-dot"></span>
                  {loading
                    ? "Reading resume and thinking..."
                    : "Ready to answer your questions"}
                </p>
              </div>

              <span className="preview-badge">
                {loading ? "THINKING" : "LIVE AI"}
              </span>
            </div>

            <div className="chat-welcome">
              <span className="welcome-icon">✧</span>

              <div>
                <h3>Hello, recruiter!</h3>

                <p>
                  Ask me about Khizar's skills, projects,
                  education, or professional goals.
                </p>
              </div>
            </div>

            <div className="messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message-row ${message.role}`}
                >
                  {message.role === "assistant" && (
                    <div className="message-avatar">✦</div>
                  )}

                  <div className="message-content">
                    <span className="message-name">
                      {message.role === "assistant"
                        ? "Portfolio AI"
                        : "Recruiter"}
                    </span>

                    <div className="message-bubble">
                      {message.text}
                    </div>
                  </div>

                  {message.role === "user" && (
                    <div className="user-avatar">HR</div>
                  )}
                </div>
              ))}

              {/* Loading Indicator */}
              {loading && (
                <div className="loading-message">
                  <div className="message-avatar">✦</div>

                  <div className="message-bubble">
                    Reading resume and generating answer...
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Questions */}
            <div className="chat-suggestions">
              <span>TRY ASKING</span>

              {[
                "Tell me about your projects.",
                "What are your technical skills?",
              ].map((question) => (
                <button
                  key={question}
                  onClick={() => askQuestion(question)}
                  disabled={loading}
                >
                  {question} ↗
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <form
              className="chat-input-area"
              onSubmit={handleSubmit}
            >
              <span className="input-icon">✧</span>

              <input
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                placeholder="Ask me anything about the candidate..."
                aria-label="Ask the AI assistant a question"
                disabled={loading}
              />

              <button
                className="send-button"
                type="submit"
                disabled={loading || !input.trim()}
              >
                {loading ? "..." : "↗"}

                <span>
                  {loading ? "Thinking" : "Send"}
                </span>
              </button>
            </form>

            <p className="chat-disclaimer">
              AI-generated answers can be inaccurate.
              Verify important details.
            </p>
          </section>
        </section>

        {/* Footer */}
        <footer className="footer">
          <a className="footer-brand" href="#home">
            KH.
          </a>

          <p>
            Designed with purpose. Powered by curiosity.
          </p>

          <a href="#home">Back to top ↑</a>
        </footer>
      </main>
    </div>
  );
}

export default App;
