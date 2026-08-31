import React from 'react';

interface DashboardHeaderProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle }) => {
  return (
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-6 sm:mb-10 tracking-tight text-center">
      {title}<br />
      <span className="text-zinc-400 text-lg sm:text-2xl mt-2 block">{subtitle}</span>
    </h1>
  );
};

export default DashboardHeader;
