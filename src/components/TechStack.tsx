import "./styles/TechStack.css";

const techStackData = [
  {
    category: "Languages",
    items: ["Python", "SQL"],
  },
  {
    category: "ML / DL",
    items: ["TensorFlow", "Scikit-learn", "Pandas", "NumPy"],
  },
  {
    category: "Generative AI",
    items: [
      "LangChain",
      "LangGraph",
      "LangSmith",
      "RAG",
      "ChromaDB",
      "LLMs",
      "Agentic Workflows",
    ],
  },
  {
    category: "Backend / Deployment",
    items: ["FastAPI", "Streamlit", "Docker"],
  },
  {
    category: "Databases",
    items: ["MySQL", "Firebase", "ChromaDB"],
  },
  {
    category: "Tools",
    items: ["Git", "GitHub"],
  },
];

const TechStack = () => {
  return (
    <div className="techstack" id="techstack">
      <h2 className="techstack-title">My Tech Stack</h2>
      <div className="techstack-grid">
        {techStackData.map((group) => (
          <div className="techstack-category" key={group.category}>
            <h3 className="techstack-category-title">{group.category}</h3>
            <div className="techstack-badges">
              {group.items.map((item) => (
                <span className="techstack-badge" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
