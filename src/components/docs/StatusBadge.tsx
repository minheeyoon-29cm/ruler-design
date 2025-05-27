import '../styles/components/status-badge.css'; 

interface StatusBadgeProps {
    status: 'draft' | 'beta' | 'active' | 'deprecated';
  }
  
  const statusClassMap: Record<StatusBadgeProps['status'], string> = {
    draft: 'status-badge status-badge--draft',
    beta: 'status-badge status-badge--beta',
    active: 'status-badge status-badge--active',
    deprecated: 'status-badge status-badge--deprecated',
  };
  
  export const StatusBadge = ({ status }: StatusBadgeProps) => {
    return (
      <span className={statusClassMap[status]}>
        {status}
      </span>
    );
  };
  