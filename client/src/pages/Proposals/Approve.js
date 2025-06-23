// client/src/pages/Proposals/Approve.js
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import proposalService from '../../services/proposalService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const ApproveProposal = () => {
  const { proposalId, memberId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const approve = async () => {
      try {
        const result = await proposalService.approveMember(proposalId, memberId);
        if (result.success) {
          alert('Proposal berhasil disetujui!');
        } else {
          alert(result.error || 'Gagal menyetujui proposal');
        }
      } catch (error) {
        alert('Terjadi kesalahan: ' + error.message);
      } finally {
        navigate(`/proposals/${proposalId}`);
      }
    };

    approve();
  }, [proposalId, memberId, navigate]);

  return <LoadingSpinner text="Memproses persetujuan..." />;
};

export default ApproveProposal;