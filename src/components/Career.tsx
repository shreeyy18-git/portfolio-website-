import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Core ML Team Member</h4>
                <h5>Asper Technical Club</h5>
              </div>
              <h3>Jan 2026 - Present</h3>
            </div>
            <p>
              End-to-end ML pipelines on real-world datasets. Model optimization
              & hyperparameter tuning. Scalable, deployable ML solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
