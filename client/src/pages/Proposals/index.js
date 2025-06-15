// client/src/pages/Proposals/index.js
import React from 'react';
import ProposalList from '../../components/Proposals/ProposalList';

const ProposalsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <ProposalList />
      </div>
    </div>
  );
};

export default ProposalsPage;