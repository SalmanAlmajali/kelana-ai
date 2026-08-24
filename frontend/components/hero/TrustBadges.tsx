import React from 'react';

const TrustBadges: React.FC = () => {
  const badges = [
    { name: "Amazon Bedrock" },
    { name: "AWS" },
    { name: "Next.js" },
  ];

  return (
    <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
      <p className="text-sm text-muted mb-4">Powered by</p>
      <div className="flex items-center justify-center gap-8 opacity-70">
        {badges.map((badge, index) => (
          <React.Fragment key={badge.name}>
            {index > 0 && <div className="w-px h-6 bg-border" />}
            <span className="text-foreground font-semibold text-lg">
              {badge.name}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TrustBadges;
