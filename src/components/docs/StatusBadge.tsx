import '../../styles/components/status-badge.css'; 

interface StatusBadgeProps {
    status: 'draft' | 'review' | 'active' | 'deprecated' | 'hold'; 
}

const statusClassMap: Record<StatusBadgeProps['status'], string> = {
    draft: 'status-badge status-badge--draft',
    review: 'status-badge status-badge--review', 
    active: 'status-badge status-badge--active',
    deprecated: 'status-badge status-badge--deprecated',
    hold: 'status-badge status-badge--hold', 
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    return (
        <span className={statusClassMap[status]}>
            {status}
        </span>
    );
};