import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FaGithub } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";

gsap.registerPlugin(useGSAP);

interface Project {
  id: string;
  name: string;
  category: string;
  tools: string;
  features: string;
  image: string;
  link: string;
  github?: string;
  demo?: string;
}

const projects: Project[] = [
  {
    id: "01",
    name: "Multi-Agent AI Research System",
    category: "Agentic AI",
    tools: "LangGraph, LangSmith, LLMs, Python",
    features: "Multi-agent orchestration, research automation, agentic workflows",
    image: "/images/research-mind.png",
    link: "#",
    github: "https://github.com/SHREEYANSHGIT/Multi-Agent-AI-Research-System",
    demo: "https://multi-agent-ai-research-system-by-shreeyansh.streamlit.app/",
  },
  {
    id: "02",
    name: "Medical RAG Chatbot",
    category: "Generative AI",
    tools: "FastAPI, RAG, ChromaDB, LLMs",
    features: "Medical document Q&A, context-aware responses, FastAPI deployment",
    image: "/images/medical-rag.png",
    link: "#",
    github: "https://github.com/SHREEYANSHGIT/Medical-rag-chatbot-fastapi",
    demo: "https://medical-assistant-bice.vercel.app/",
  },
  {
    id: "03",
    name: "Multi-Documents QnA Chatbot",
    category: "Generative AI",
    tools: "Python, RAG, Vector DB, LLMs",
    features: "Multi-document processing, semantic search, conversational AI",
    image: "/images/multi-docs-qna.png",
    link: "#",
    github: "https://github.com/SHREEYANSHGIT/MULTI-DOCUMENTS-QNA-CHATBOT-GENAI-PROJECT-",
    demo: "https://multi-documents-qna-chatbot-genai-project-shreeyansh.streamlit.app/",
  },
  {
    id: "04",
    name: "Bank Fraud Detection System",
    category: "Machine Learning",
    tools: "Scikit-learn, Pandas, ML",
    features: "Fraud pattern detection, classification model, high accuracy",
    image: "/images/fraud-detection.png",
    link: "#",
    github: "https://github.com/SHREEYANSHGIT/BANK-FRAUD-SYSTEM",
    demo: "https://bank-fraud-system-by-shreeyansh.streamlit.app/",
  },
  {
    id: "05",
    name: "Voice Language Detection",
    category: "Audio Processing",
    tools: "Jupyter Notebook, Python, Audio Processing",
    features: "Language identification from voice, feature extraction",
    image: "/images/voice-language.png",
    link: "#",
    github: "https://github.com/SHREEYANSHGIT/Voice-language-Detection--Deep_learning-",
    demo: "https://learnedge-voice-language-detection.streamlit.app/",
  },
  {
    id: "06",
    name: "ML & Deep Learning Projects",
    category: "Machine Learning",
    tools: "TensorFlow, Scikit-learn, Jupyter",
    features: "Collection of multiple ML/DL models and experiments",
    image: "/images/ml-dl-projects.jpg",
    link: "#",
    github: "https://github.com/SHREEYANSHGIT/ML-AND-DEEPLEARNING-PROJECTS-",
  },
];

const Work = () => {
  useGSAP(() => {
    let translateX: number = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      const rectLeft = document
        .querySelector(".work-container")!
        .getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
      let padding: number =
        parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
    }

    setTranslateX();

    const spacer = document.getElementById("work-pin-spacer");
    if (spacer) {
      spacer.style.height = `${translateX}px`;
    }

    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX}`,
        scrub: true,
        pin: true,
        pinSpacing: false,
        id: "work",
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project) => (
            <div className="work-box" key={project.id}>
              <div className="work-info">
                <div className="work-title">
                  <h3>{project.id}</h3>

                  <div>
                    <h4>{project.name}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.tools} — {project.features}</p>
                <div className="work-links">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="work-link-btn" data-cursor="disable">
                      <FaGithub /> GitHub
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="work-link-btn" data-cursor="disable">
                      <MdArrowOutward /> Live Demo
                    </a>
                  )}
                </div>
              </div>
              <WorkImage image={project.image} alt={project.name} link={project.link} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
