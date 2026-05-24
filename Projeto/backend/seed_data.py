from models import Course

COURSES: list[Course] = [
    Course(
        id="1",
        title="Front-end Development Bootcamp - Alura",
        platform="Alura",
        category="Technology",
        schedule="Evening",
        type="Online",
        duration="12 weeks",
        summary="Learn HTML, CSS, JavaScript and React from scratch. Build real projects and get certified.",
        description=(
            "Complete bootcamp covering everything you need to become a front-end developer. "
            "Start with HTML and CSS basics, progress to JavaScript fundamentals, and master "
            "React for building modern web applications."
        ),
        syllabus=[
            "HTML5 & CSS3 Fundamentals",
            "Responsive Design & Flexbox/Grid",
            "JavaScript ES6+",
            "React & Component Architecture",
            "State Management & Hooks",
            "Final Project & Portfolio",
        ],
        startDate="2026-04-05",
        requirements="Computer with internet access. No prior experience required.",
        image=(
            "https://images.unsplash.com/photo-1675495277087-10598bf7bcd1"
            "?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        ),
    ),
    Course(
        id="2",
        title="Excel Básico ao Avançado - SESI",
        platform="SESI",
        category="Business",
        schedule="Morning",
        type="In-Person",
        duration="6 weeks",
        summary="Master Excel from basic formulas to advanced data analysis. Perfect for administrative work.",
        description=(
            "Comprehensive Excel course designed for professionals who need to manage data, "
            "create reports, and automate tasks. Learn formulas, pivot tables, charts, and macros."
        ),
        syllabus=[
            "Excel Interface & Basic Formulas",
            "Data Organization & Formatting",
            "Functions (VLOOKUP, IF, SUMIF)",
            "Pivot Tables & Charts",
            "Data Analysis Tools",
            "Introduction to Macros",
        ],
        startDate="2026-03-31",
        requirements="Computer provided on-site. Notebook recommended for practice.",
        image=(
            "https://images.unsplash.com/photo-1758518732175-5d608ba3abdf"
            "?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        ),
    ),
    Course(
        id="3",
        title="Digital Marketing Fundamentals - Google Ateliê",
        platform="Google Ateliê",
        category="Business",
        schedule="Asynchronous",
        type="Online",
        duration="8 weeks",
        summary="Learn digital marketing strategies, SEO, social media, and analytics at your own pace.",
        description=(
            "Self-paced course covering all aspects of digital marketing. Perfect for entrepreneurs "
            "and professionals looking to promote their business or advance their careers."
        ),
        syllabus=[
            "Digital Marketing Overview",
            "SEO & Content Strategy",
            "Social Media Marketing",
            "Email Marketing",
            "Google Ads Basics",
            "Analytics & Measurement",
        ],
        startDate="2026-04-01",
        requirements="Smartphone or computer with internet. Flexible schedule.",
        image=(
            "https://images.unsplash.com/photo-1762330918491-f4288a62adb8"
            "?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        ),
    ),
    Course(
        id="4",
        title="Python Programming for Beginners - Fundação Bradesco",
        platform="Fundação Bradesco",
        category="Technology",
        schedule="Evening",
        type="Online",
        duration="10 weeks",
        summary="Introduction to programming with Python. Learn to automate tasks and analyze data.",
        description=(
            "Beginner-friendly Python course covering programming fundamentals, data structures, "
            "and practical applications for automation and data analysis."
        ),
        syllabus=[
            "Python Basics & Syntax",
            "Variables, Data Types & Operators",
            "Control Flow & Loops",
            "Functions & Modules",
            "File Handling & Data Processing",
            "Introduction to Data Analysis",
        ],
        startDate="2026-04-10",
        requirements="Computer with internet. No programming experience needed.",
        image=(
            "https://images.unsplash.com/photo-1675495277087-10598bf7bcd1"
            "?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        ),
    ),
    Course(
        id="5",
        title="Logística e Gestão de Estoques - SENAI",
        platform="SENAI",
        category="Logistics",
        schedule="Morning",
        type="Hybrid",
        duration="8 weeks",
        summary="Learn logistics principles, inventory management, and supply chain basics.",
        description=(
            "Professional logistics course combining online theory with practical in-person workshops. "
            "Ideal for warehouse workers and logistics assistants."
        ),
        syllabus=[
            "Logistics Fundamentals",
            "Inventory Control Methods",
            "Warehouse Organization",
            "Supply Chain Basics",
            "Transport & Distribution",
            "Practical Workshop",
        ],
        startDate="2026-04-07",
        requirements="In-person sessions require attendance at SENAI unit.",
        image=(
            "https://images.unsplash.com/photo-1758518732175-5d608ba3abdf"
            "?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        ),
    ),
    Course(
        id="6",
        title="Inglês para Iniciantes - Cultura Inglesa (Gratuito)",
        platform="Cultura Inglesa",
        category="Languages",
        schedule="Evening",
        type="Online",
        duration="16 weeks",
        summary="Basic English course focusing on conversation and practical vocabulary.",
        description=(
            "Free beginner English course with live online classes twice a week. "
            "Focus on practical conversation skills for work and daily life."
        ),
        syllabus=[
            "Basic Greetings & Introductions",
            "Numbers, Dates & Time",
            "Common Verbs & Daily Activities",
            "Work & Professional Vocabulary",
            "Shopping & Services",
            "Conversation Practice",
        ],
        startDate="2026-04-08",
        requirements="Smartphone or computer. Microphone recommended for practice.",
        image=(
            "https://images.unsplash.com/photo-1762330918491-f4288a62adb8"
            "?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        ),
    ),
]

# Lookup map for fast access
COURSES_BY_ID: dict[str, Course] = {c.id: c for c in COURSES}