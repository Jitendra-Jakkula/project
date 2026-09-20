const ProblemCardSkeleton = () => {
  return (
    <div className="problem-card skeleton-card">
      <div className="skeleton-main">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-subtitle"></div>

        <div className="skeleton-tags">
          <div className="skeleton skeleton-tag"></div>
          <div className="skeleton skeleton-tag"></div>
        </div>
      </div>

      <div className="skeleton-side">
        <div className="skeleton skeleton-difficulty"></div>
        <div className="skeleton skeleton-status"></div>
        <div className="skeleton skeleton-button"></div>
      </div>
    </div>
  );
};

export default ProblemCardSkeleton;