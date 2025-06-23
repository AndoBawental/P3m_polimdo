// client/src/components/Dashboard/ProposalStatusCard.js
'use client';
import React from 'react';

// Pastikan prop `user` juga dikirim dari komponen parent
const ProposalStatusCard = ({ proposal, user }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      'DRAFT': {
        color: 'bg-gray-100 text-gray-800',
        text: 'Draft'
      },
      'SUBMITTED': {
        color: 'bg-yellow-100 text-yellow-800',
        text: 'Submitted'
      },
      'REVIEW': {
        color: 'bg-blue-100 text-blue-800',
        text: 'In Review'
      },
      'APPROVED': {
        color: 'bg-green-100 text-green-800',
        text: 'Approved'
      },
      'REJECTED': {
        color: 'bg-red-100 text-red-800',
        text: 'Rejected'
      },
      'REVISION': {
        color: 'bg-orange-100 text-orange-800',
        text: 'Revision'
      }
    };

    const config = statusConfig[status] || statusConfig['DRAFT'];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="font-medium text-gray-900">
            {proposal.judul || 'Untitled Proposal'}
          </h4>
          <p className="text-sm text-gray-500">
            {proposal.skema?.nama || 'No Schema'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {proposal.ketuaId === user?.id && (
            <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
              Ketua
            </span>
          )}
          {proposal.members?.some(m => m.userId === user?.id && m.peran === 'ANGGOTA') && (
            <span className="px-2 py-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full">
              Anggota
            </span>
          )}
          {getStatusBadge(proposal.status)}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Dibuat: {formatDate(proposal.createdAt)}</span>
        {proposal.updatedAt && proposal.updatedAt !== proposal.createdAt && (
          <span>Update: {formatDate(proposal.updatedAt)}</span>
        )}
      </div>

      {proposal.catatan && (
        <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
          <strong>Catatan:</strong> {proposal.catatan}
        </div>
      )}

      {proposal.members && proposal.members.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-1">Anggota:</p>
          <div className="flex flex-wrap gap-1">
            {proposal.members.map((member, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
              >
                {member.user?.nama || 'Tanpa Nama'}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalStatusCard;
