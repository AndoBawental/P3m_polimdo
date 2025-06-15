// client/src/components/Common/StatusBadge.js
import {
  FileText,
  Clock,
  UserCheck,
  CheckCircle,
  X,
  RefreshCw,
  Star
} from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const statusConfig = {
    DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    SUBMITTED: { label: 'Terkirim', color: 'bg-blue-100 text-blue-800' },
    REVIEW: { label: 'Sedang Direview', color: 'bg-yellow-100 text-yellow-800' },
    APPROVED: { label: 'Disetujui', color: 'bg-green-100 text-green-800' },
    REJECTED: { label: 'Ditolak', color: 'bg-red-100 text-red-800' },
    REVISION: { label: 'Perlu Revisi', color: 'bg-orange-100 text-orange-800' },
    COMPLETED: { label: 'Selesai', color: 'bg-purple-100 text-purple-800' },
    LAYAK: { label: 'Layak', color: 'bg-green-100 text-green-800' },
    TIDAK_LAYAK: { label: 'Tidak Layak', color: 'bg-red-100 text-red-800' },
    REVISI: { label: 'Perlu Revisi', color: 'bg-yellow-100 text-yellow-800' },
    PENDING_REVIEW: { label: 'Menunggu Review', color: 'bg-gray-100 text-gray-800' }
  };

  const config = statusConfig[status] || statusConfig.DRAFT;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

export const EnhancedStatusBadge = ({ status, size = 'md', showIcon = false }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  const iconMap = {
    DRAFT: <FileText className="h-3 w-3 mr-1" />,
    SUBMITTED: <Clock className="h-3 w-3 mr-1" />,
    REVIEW: <UserCheck className="h-3 w-3 mr-1" />,
    APPROVED: <CheckCircle className="h-3 w-3 mr-1" />,
    REJECTED: <X className="h-3 w-3 mr-1" />,
    REVISION: <RefreshCw className="h-3 w-3 mr-1" />,
    COMPLETED: <Star className="h-3 w-3 mr-1" />,
    LAYAK: <CheckCircle className="h-3 w-3 mr-1" />,
    TIDAK_LAYAK: <X className="h-3 w-3 mr-1" />,
    REVISI: <RefreshCw className="h-3 w-3 mr-1" />,
    PENDING_REVIEW: <Clock className="h-3 w-3 mr-1" />
  };

  const statusConfig = {
    DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    SUBMITTED: { label: 'Terkirim', color: 'bg-blue-100 text-blue-800' },
    REVIEW: { label: 'Sedang Direview', color: 'bg-yellow-100 text-yellow-800' },
    APPROVED: { label: 'Disetujui', color: 'bg-green-100 text-green-800' },
    REJECTED: { label: 'Ditolak', color: 'bg-red-100 text-red-800' },
    REVISION: { label: 'Perlu Revisi', color: 'bg-orange-100 text-orange-800' },
    COMPLETED: { label: 'Selesai', color: 'bg-purple-100 text-purple-800' },
    LAYAK: { label: 'Layak', color: 'bg-green-100 text-green-800' },
    TIDAK_LAYAK: { label: 'Tidak Layak', color: 'bg-red-100 text-red-800' },
    REVISI: { label: 'Perlu Revisi', color: 'bg-yellow-100 text-yellow-800' },
    PENDING_REVIEW: { label: 'Menunggu Review', color: 'bg-gray-100 text-gray-800' }
  };

  const config = statusConfig[status] || statusConfig.DRAFT;
  const icon = showIcon ? (iconMap[status] || iconMap.DRAFT) : null;

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${config.color}`}>
      {icon}
      {config.label}
    </span>
  );
};

export default StatusBadge;
