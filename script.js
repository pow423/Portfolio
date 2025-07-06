// Theme Management
const themeToggle = document.getElementById("themeToggle")
const body = document.body

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem("theme") || "light"
body.setAttribute("data-theme", currentTheme)
updateThemeIcon(currentTheme)

themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  body.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
  updateThemeIcon(newTheme)

  // Add theme transition effect
  body.style.transition = "all 0.3s ease"
  setTimeout(() => {
    body.style.transition = ""
  }, 300)
})

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector("i")
  icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon"
}

// Navigation with smooth scrolling
const navButtons = document.querySelectorAll(".nav-btn[data-section]")
const sections = document.querySelectorAll(".section")

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetSection = button.getAttribute("data-section")

    // Update active nav button
    navButtons.forEach((btn) => btn.classList.remove("active"))
    button.classList.add("active")

    // Smooth scroll to section
    const section = document.getElementById(targetSection)
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }

    // Add click animation
    button.style.transform = "scale(0.95)"
    setTimeout(() => {
      button.style.transform = ""
    }, 150)

    // Trigger specific animations
    if (targetSection === "skills") {
      setTimeout(() => animateSkillBars(), 800)
    }
    if (targetSection === "about") {
      setTimeout(() => animateStats(), 800)
    }
  })
})

// Update active nav button on scroll
window.addEventListener("scroll", () => {
  let current = ""
  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id")
    }
  })

  navButtons.forEach((btn) => {
    btn.classList.remove("active")
    if (btn.getAttribute("data-section") === current) {
      btn.classList.add("active")
    }
  })
})

// Skill Bar Animation
function animateSkillBars() {
  const progressBars = document.querySelectorAll(".progress-fill")
  progressBars.forEach((bar, index) => {
    const width = bar.getAttribute("data-width")
    setTimeout(() => {
      bar.style.width = width + "%"
    }, index * 100)
  })
}

// Stats Animation
function animateStats() {
  const statNumbers = document.querySelectorAll(".stat-number")
  statNumbers.forEach((stat) => {
    const finalValue = stat.textContent
    const numericValue = Number.parseInt(finalValue.replace(/\D/g, ""))
    if (numericValue) {
      animateNumber(stat, 0, numericValue, finalValue.includes("+") ? "+" : "", 1000)
    }
  })
}

function animateNumber(element, start, end, suffix, duration) {
  const range = end - start
  const increment = range / (duration / 16)
  let current = start

  const timer = setInterval(() => {
    current += increment
    if (current >= end) {
      current = end
      clearInterval(timer)
    }
    element.textContent = Math.floor(current) + suffix
  }, 16)
}

// Mouse Parallax Effect
let mouseX = 0
let mouseY = 0
let isMouseMoving = false

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX
  mouseY = e.clientY
  isMouseMoving = true

  const shapes = document.querySelectorAll(".shape")
  shapes.forEach((shape, index) => {
    const speed = (index + 1) * 0.003
    const x = (mouseX - window.innerWidth / 2) * speed
    const y = (mouseY - window.innerHeight / 2) * speed

    shape.style.transform += ` translate(${x}px, ${y}px)`
  })

  // Reset mouse moving flag
  setTimeout(() => {
    isMouseMoving = false
  }, 100)
})

// Contact Form
const contactForm = document.getElementById("contactForm")
contactForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  // Form validation
  const formData = new FormData(contactForm)
  const name = formData.get("name").trim()
  const email = formData.get("email").trim()
  const subject = formData.get("subject").trim()
  const message = formData.get("message").trim()

  if (!name || !email || !subject || !message) {
    showNotification("Please fill in all required fields", "error")
    return
  }

  if (!isValidEmail(email)) {
    showNotification("Please enter a valid email address", "error")
    return
  }

  // Simulate form submission with enhanced feedback
  const submitBtn = contactForm.querySelector(".submit-btn")
  const originalText = submitBtn.innerHTML

  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
  submitBtn.disabled = true
  submitBtn.style.background = "var(--warning-color)"

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!'
    submitBtn.style.background = "var(--success-color)"

    showNotification("Thank you! Your message has been sent successfully.", "success")

    setTimeout(() => {
      submitBtn.innerHTML = originalText
      submitBtn.style.background = ""
      submitBtn.disabled = false
      contactForm.reset()
    }, 3000)
  } catch (error) {
    submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error'
    submitBtn.style.background = "#ef4444"
    showNotification("Sorry, there was an error sending your message. Please try again.", "error")

    setTimeout(() => {
      submitBtn.innerHTML = originalText
      submitBtn.style.background = ""
      submitBtn.disabled = false
    }, 3000)
  }
})

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function showNotification(message, type) {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
    <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i>
    <span>${message}</span>
  `

  // Add notification styles
  notification.style.cssText = `
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: ${type === "success" ? "var(--success-color)" : "#ef4444"};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: var(--shadow);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: slideInRight 0.3s ease forwards;
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease forwards"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 5000)
}

// AI Chat Assistant
const chatToggle = document.getElementById("chatToggle")
const chatContainer = document.getElementById("chatContainer")
const chatClose = document.getElementById("chatClose")
const chatForm = document.getElementById("chatForm")
const chatInput = document.getElementById("chatInput")
const chatMessages = document.getElementById("chatMessages")

const chatHistory = [
  {
    role: "assistant",
    content:
      "Hi! I'm Manikanta's AI assistant. I can help you learn more about his work, skills, and experience. What would you like to know?",
    timestamp: new Date(),
  },
]

chatToggle.addEventListener("click", () => {
  chatContainer.classList.add("active")
  chatToggle.style.display = "none"
  setTimeout(() => {
    chatInput.focus()
  }, 100)
})

chatClose.addEventListener("click", () => {
  chatContainer.classList.remove("active")
  setTimeout(() => {
    chatToggle.style.display = "flex"
  }, 300)
})

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  const message = chatInput.value.trim()
  if (!message) return

  // Add user message with animation
  addMessage("user", message)
  chatInput.value = ""

  // Show typing indicator
  showTypingIndicator()

  // Simulate AI response with more realistic delay
  const delay = Math.random() * 1000 + 1500
  setTimeout(() => {
    hideTypingIndicator()
    const response = generateAIResponse(message)
    addMessage("assistant", response)
  }, delay)
})

function addMessage(role, content) {
  const messageDiv = document.createElement("div")
  messageDiv.className = `message ${role}-message`
  messageDiv.style.opacity = "0"
  messageDiv.style.transform = "translateY(20px)"

  const avatarDiv = document.createElement("div")
  avatarDiv.className = "message-avatar"
  avatarDiv.innerHTML = role === "assistant" ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>'

  const contentDiv = document.createElement("div")
  contentDiv.className = "message-content"

  const textP = document.createElement("p")
  textP.textContent = content

  const timeSpan = document.createElement("span")
  timeSpan.className = "message-time"
  timeSpan.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  contentDiv.appendChild(textP)
  contentDiv.appendChild(timeSpan)

  messageDiv.appendChild(avatarDiv)
  messageDiv.appendChild(contentDiv)

  chatMessages.appendChild(messageDiv)

  // Animate message in
  setTimeout(() => {
    messageDiv.style.transition = "all 0.3s ease"
    messageDiv.style.opacity = "1"
    messageDiv.style.transform = "translateY(0)"
  }, 50)

  chatMessages.scrollTop = chatMessages.scrollHeight

  // Add to chat history
  chatHistory.push({
    role,
    content,
    timestamp: new Date(),
  })
}

function showTypingIndicator() {
  const typingDiv = document.createElement("div")
  typingDiv.className = "message assistant-message"
  typingDiv.id = "typing-indicator"
  typingDiv.style.opacity = "0"

  typingDiv.innerHTML = `
    <div class="message-avatar">
      <i class="fas fa-robot"></i>
    </div>
    <div class="typing-indicator">
      <div class="typing-dots">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
      <span style="font-size: 0.75rem; color: var(--text-secondary); margin-left: 0.5rem;">Thinking...</span>
    </div>
  `

  chatMessages.appendChild(typingDiv)

  setTimeout(() => {
    typingDiv.style.transition = "opacity 0.3s ease"
    typingDiv.style.opacity = "1"
  }, 50)

  chatMessages.scrollTop = chatMessages.scrollHeight
}

function hideTypingIndicator() {
  const typingIndicator = document.getElementById("typing-indicator")
  if (typingIndicator) {
    typingIndicator.style.opacity = "0"
    setTimeout(() => {
      if (typingIndicator.parentNode) {
        typingIndicator.parentNode.removeChild(typingIndicator)
      }
    }, 300)
  }
}

function generateAIResponse(userMessage) {
  const message = userMessage.toLowerCase()

  // Enhanced responses with more personality
  if (message.includes("skill") || message.includes("technology") || message.includes("tech")) {
    return "Pranai is a tech enthusiast with impressive skills! 🚀\n\n• React (95%) - His strongest skill, building dynamic UIs\n• Next.js (90%) - Full-stack React framework expertise\n• TypeScript (88%) - Type-safe JavaScript development\n• Node.js (85%) - Backend development and APIs\n• UI/UX Design (80%) - Creating beautiful user experiences\n• Mobile Dev (75%) - React Native and responsive design\n• Database (82%) - MongoDB, PostgreSQL management\n• DevOps (70%) - Deployment and infrastructure\n\nYou can see all his skills with interactive progress bars in the Skills section! 💪"
  }

  if (message.includes("project") || message.includes("work") || message.includes("portfolio")) {
    return "Pranai has built some amazing projects! Here are his featured works: 🎯\n\n🛒 **E-Commerce Platform**\nFull-stack solution with React, Node.js, MongoDB, and Stripe payments\n\n📋 **Task Management App**\nCollaborative tool with real-time updates using Next.js and Socket.io\n\n🌤️ **Weather Dashboard**\nBeautiful weather app with location-based forecasts and PWA features\n\n💼 **Portfolio Website**\nThis responsive portfolio with modern animations and dark mode!\n\nEach project showcases different aspects of his full-stack development skills. Check out the Projects section for more details! ✨"
  }

  if (
    message.includes("experience") ||
    message.includes("job") ||
    message.includes("work history") ||
    message.includes("career")
  ) {
    return "Pranai has an impressive 5+ year career journey! 📈\n\n🏢 **Senior Frontend Developer** at Tech Solutions Inc. (2022-Present)\n• Leading frontend development team\n• Architecting scalable React applications\n• Mentoring junior developers\n• Improved team productivity by 40%\n\n🏢 **Full Stack Developer** at Digital Agency Co. (2020-2022)\n• End-to-end web application development\n• Delivered 25+ client projects with 98% satisfaction\n• Collaborated with design teams\n\n🏢 **Frontend Developer** at Startup Hub (2019-2020)\n• Built responsive web applications\n• Implemented pixel-perfect designs\n• Contributed to first major product launch (10K+ users)\n\nHis experience spans team leadership, client relations, and technical excellence! 🌟"
  }

  if (
    message.includes("contact") ||
    message.includes("hire") ||
    message.includes("email") ||
    message.includes("reach")
  ) {
    return "Great! Pranai is available for new opportunities! 📞\n\n📧 **Email:** helloPranai.site\n📱 **Phone:** +1 (555) 123-4567\n📍 **Location:** San Francisco, CA (Available worldwide)\n\n🟢 **Currently Available** for:\n• Freelance projects\n• Full-time opportunities\n• Consulting work\n• Technical mentoring\n\nYou can also use the contact form in the Contact section - he typically responds within 24 hours! Feel free to reach out to discuss your project needs. 🚀"
  }

  if (
    message.includes("about") ||
    message.includes("who") ||
    message.includes("background") ||
    message.includes("story")
  ) {
    return "Let me tell you about Manikanta! 👨‍💻\n\nHe's a passionate full-stack developer with 5+ years of experience creating modern, responsive, and user-friendly applications. His journey started with curiosity about how websites work and evolved into a passion for crafting digital experiences that make a difference.\n\n🎯 **His Philosophy:**\n• Writing clean, maintainable code\n• Staying current with latest technologies\n• Creating engaging user experiences\n• Continuous learning and growth\n\n🌟 **Personal Traits:**\n• Problem Solver • Team Player • Quick Learner\n• Detail Oriented • Creative Thinker • Tech Enthusiast\n\nWhen he's not coding, he explores design trends, contributes to open-source projects, and shares knowledge with the developer community! 🌍"
  }

  if (message.includes("hello") || message.includes("hi") || message.includes("hey") || message.includes("greet")) {
    return "Hello there! 👋 Welcome to Manikanta's portfolio!\n\nI'm excited to help you learn more about his work and experience. Here's what I can tell you about:\n\n🔧 **Technical Skills** - His expertise in React, Next.js, Node.js, and more\n📁 **Projects** - Amazing applications he's built\n💼 **Experience** - His 5+ year professional journey\n📞 **Contact Info** - How to reach him for opportunities\n🎯 **Background** - His story and philosophy\n\nWhat would you like to explore first? I'm here to help! ✨"
  }

  if (message.includes("thank") || message.includes("thanks") || message.includes("appreciate")) {
    return "You're absolutely welcome! 😊\n\nI'm thrilled I could help you learn more about Manikanta! If you have any other questions about his:\n\n• Technical expertise and skills\n• Project portfolio and achievements\n• Professional experience and background\n• Availability for new opportunities\n\nJust ask away! Or feel free to contact him directly using the information in the Contact section. He'd love to hear from you! 🚀"
  }

  if (message.includes("price") || message.includes("cost") || message.includes("rate") || message.includes("budget")) {
    return "Great question about pricing! 💰\n\nManikanta offers flexible pricing based on project scope and requirements:\n\n📋 **Project Factors:**\n• Complexity and timeline\n• Technology stack required\n• Team collaboration needs\n• Ongoing support requirements\n\n💡 **Best Approach:**\nReach out with your project details for a personalized quote! He provides:\n• Free initial consultation\n• Detailed project breakdown\n• Transparent pricing structure\n• Flexible payment options\n\nContact him at hello@dmanikanta.site to discuss your specific needs and get an accurate estimate! 📞"
  }

  // Default responses with more personality
  const defaultResponses = [
    "That's an interesting question! 🤔 I'd love to help you learn more about Pranai. You can ask me about his technical skills, amazing projects, professional experience, or how to get in touch with him. What interests you most?",

    "I'm here to help you discover Pranai's expertise! 🌟 Whether you're curious about his React mastery, full-stack projects, 5+ years of experience, or want to discuss a potential collaboration - just let me know what you'd like to explore!",

    "Pranai is always excited about new opportunities and connecting with fellow developers! 🚀 Feel free to ask about his technical skills, project portfolio, work experience, or check out his impressive work in the Projects section above!",

    "That's a great topic! 💡 While I focus on pranai's professional background, I can share insights about his development skills, career journey, project achievements, or availability for new work. What specific area would you like to dive into?",

    "I love your curiosity! 🎯 pranai has such a rich background in web development. Whether you want to know about his React expertise, full-stack projects, leadership experience, or how to collaborate with him - I'm here to help guide you!",
  ]

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

// Download CV functionality
const downloadBtn = document.getElementById("downloadBtn")
const socialDownloadBtn = document.getElementById("socialDownloadBtn")

function downloadCV() {
  // Create enhanced CV content
  const cvContent = `
Pranai - Senior Full Stack Developer
======================================

CONTACT INFORMATION
-------------------
📧 Email: hello@dmanikanta.site
📱 Phone: +1 (555) 123-4567
📍 Location: San Francisco, CA
🌐 Portfolio: dmanikanta.site
💼 LinkedIn: linkedin.com/in
🐙 GitHub: github.com/dmanikanta

PROFESSIONAL SUMMARY
--------------------
Passionate and experienced full-stack developer with 5+ years of expertise in creating 
modern, responsive, and user-friendly web applications. Specializes in React ecosystem, 
Node.js backend development, and UI/UX design. Proven track record of leading development 
teams, delivering high-quality projects, and mentoring junior developers.

CORE COMPETENCIES
-----------------
• Frontend Development: React, Next.js, TypeScript, HTML5, CSS3, JavaScript (ES6+)
• Backend Development: Node.js, Express.js, RESTful APIs, GraphQL
• Database Management: MongoDB, PostgreSQL, Database Design & Optimization
• UI/UX Design: Figma, Adobe XD, Responsive Design, Design Systems
• Mobile Development: React Native, Progressive Web Apps (PWA)
• DevOps & Tools: Docker, AWS, Git, CI/CD, Webpack, Testing Frameworks
• Soft Skills: Team Leadership, Project Management, Client Communication, Mentoring

TECHNICAL SKILLS PROFICIENCY
----------------------------
• React: 95% - Expert level, 4+ years experience
• Next.js: 90% - Advanced full-stack development
• TypeScript: 88% - Type-safe application development
• Node.js: 85% - Backend APIs and server-side development
• UI/UX Design: 80% - User-centered design approach
• Database Management: 82% - Efficient data modeling and queries
• Mobile Development: 75% - Cross-platform mobile solutions
• DevOps: 70% - Deployment and infrastructure management

PROFESSIONAL EXPERIENCE
-----------------------

SENIOR FRONTEND DEVELOPER | Tech Solutions Inc. | 2022 - Present
• Lead a team of 6 frontend developers in building scalable React applications
• Architect and implement complex user interfaces using React, TypeScript, and Next.js
• Mentor junior developers and conduct code reviews to maintain high code quality
• Collaborate with product managers and designers to deliver user-centric solutions
• Improved team productivity by 40% through implementation of modern development practices
• Technologies: React, Next.js, TypeScript, Node.js, MongoDB, AWS

FULL STACK DEVELOPER | Digital Agency Co. | 2020 - 2022
• Developed end-to-end web applications for diverse clients across various industries
• Built responsive, mobile-first websites and web applications
• Collaborated closely with design teams to implement pixel-perfect UI/UX designs
• Delivered 25+ client projects with 98% client satisfaction rate
• Implemented modern development workflows and best practices
• Technologies: React, Node.js, Express, MongoDB, PostgreSQL, HTML/CSS, JavaScript

FRONTEND DEVELOPER | Startup Hub | 2019 - 2020
• Built responsive web applications using modern JavaScript frameworks
• Implemented pixel-perfect designs from Figma mockups
• Contributed to the company's first major product launch reaching 10,000+ users
• Optimized application performance and implemented SEO best practices
• Collaborated with cross-functional teams in an agile development environment
• Technologies: HTML5, CSS3, JavaScript, React, Responsive Design, Git

FEATURED PROJECTS
-----------------

E-COMMERCE PLATFORM
• Full-stack e-commerce solution with secure payment processing
• Technologies: React, Node.js, MongoDB, Stripe API, JWT Authentication
• Features: User authentication, product catalog, shopping cart, order management
• Achieved 99.9% uptime and handled 1000+ concurrent users

TASK MANAGEMENT APPLICATION
• Collaborative project management tool with real-time updates
• Technologies: Next.js, Socket.io, PostgreSQL, Redis, Tailwind CSS
• Features: Real-time collaboration, task tracking, team management, notifications
• Improved team productivity by 35% for client organizations

WEATHER DASHBOARD
• Beautiful weather application with location-based forecasts
• Technologies: React, Weather API, Chart.js, Progressive Web App
• Features: Location detection, 7-day forecasts, interactive charts, offline support
• Achieved 95+ Lighthouse performance score

PORTFOLIO WEBSITE
• Modern, responsive portfolio with advanced animations
• Technologies: Next.js, Framer Motion, Tailwind CSS, TypeScript
• Features: Dark/light mode, smooth animations, responsive design, SEO optimized
• Showcases modern web development best practices

EDUCATION & CERTIFICATIONS
--------------------------
• Bachelor of Science in Computer Science
• AWS Certified Developer - Associate
• Google Analytics Certified
• Responsive Web Design Certification - freeCodeCamp

ACHIEVEMENTS & RECOGNITION
-------------------------
• Led development team that won "Best Web Application" award at Tech Conference 2023
• Contributed to 15+ open-source projects with 500+ GitHub stars
• Speaker at 3 local developer meetups on React and modern web development
• Mentored 10+ junior developers who successfully advanced in their careers

AVAILABILITY
-----------
🟢 Currently available for:
• Freelance projects (part-time/full-time)
• Consulting and technical advisory roles
• Full-time employment opportunities
• Speaking engagements and workshops

LANGUAGES
---------
• English: Native/Fluent
• Spanish: Conversational
• Hindi: Native

---
Generated on ${new Date().toLocaleDateString()}
Portfolio: dmanikanta.site
  `

  // Create and download the enhanced CV
  const blob = new Blob([cvContent], { type: "text/plain;charset=utf-8" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "Manikanta_Senior_Developer_CV.txt"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)

  showNotification("CV downloaded successfully! 📄", "success")
}

downloadBtn.addEventListener("click", downloadCV)
socialDownloadBtn.addEventListener("click", (e) => {
  e.preventDefault()
  downloadCV()
})

// Social button navigation
document.querySelectorAll(".social-btn").forEach((btn) => {
  const icon = btn.querySelector("i")
  if (icon && icon.classList.contains("fa-envelope")) {
    btn.addEventListener("click", (e) => {
      e.preventDefault()
      document.getElementById("contact").scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }
})

// Page initialization
document.addEventListener("DOMContentLoaded", () => {
  // Trigger animations on page load
  setTimeout(() => animateSkillBars(), 2000)
  setTimeout(() => animateStats(), 1500)

  // Enhanced scroll parallax effect
  let ticking = false

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.pageYOffset
        const shapes = document.querySelectorAll(".shape")

        shapes.forEach((shape, index) => {
          const speed = (index + 1) * 0.3
          const yPos = -(scrolled * speed)
          shape.style.transform += ` translateY(${yPos}px)`
        })

        ticking = false
      })
      ticking = true
    }
  })

  // Enhanced Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"

        // Add staggered animation for multiple elements
        if (entry.target.classList.contains("skill-card")) {
          const cards = document.querySelectorAll(".skill-card")
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.style.opacity = "1"
              card.style.transform = "translateY(0)"
            }, index * 100)
          })
        }
      }
    })
  }, observerOptions)

  // Observe elements for animations
  const animatedElements = document.querySelectorAll(
    ".skill-card, .project-card, .experience-item, .stats-card, .contact-item",
  )

  animatedElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(50px)"
    el.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
    observer.observe(el)
  })

  // Add loading animation
  document.body.style.opacity = "0"
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease"
    document.body.style.opacity = "1"
  }, 100)
})

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  // Close chat with Escape
  if (e.key === "Escape" && chatContainer.classList.contains("active")) {
    chatContainer.classList.remove("active")
    setTimeout(() => {
      chatToggle.style.display = "flex"
    }, 300)
  }

  // Navigate sections with arrow keys
  if (e.altKey) {
    const currentSection = document.querySelector(".nav-btn.active")?.getAttribute("data-section")
    const sections = ["home", "about", "skills", "projects", "experience", "contact"]
    const currentIndex = sections.indexOf(currentSection)

    if (e.key === "ArrowRight" && currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1]
      document.querySelector(`[data-section="${nextSection}"]`).click()
    } else if (e.key === "ArrowLeft" && currentIndex > 0) {
      const prevSection = sections[currentIndex - 1]
      document.querySelector(`[data-section="${prevSection}"]`).click()
    }
  }
})

// Add CSS for notifications
const notificationStyles = document.createElement("style")
notificationStyles.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`
document.head.appendChild(notificationStyles)

// Performance optimization: Debounce resize events
let resizeTimeout
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    // Recalculate animations and layouts if needed
    animateSkillBars()
  }, 250)
})

function scrollContainer(id, amount) {
  const el = document.getElementById(id);
  el.scrollBy({ left: amount, behavior: "smooth" });
}

console.log("🚀 Portfolio loaded successfully! Welcome to Manikanta's digital space.")
