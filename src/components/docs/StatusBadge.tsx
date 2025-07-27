import '../../styles/components/status-badge.css';

// ✅ 타입을 export하여 외부에서 재사용 가능하게 만듦
export type Status = 'draft' | 'review' | 'active' | 'deprecated';

interface StatusBadgeProps {
    status: Status; // ✅ 위에서 정의한 타입 사용
}

const statusClassMap: Record<Status, string> = {
    draft: 'status-badge status-badge--draft',
    review: 'status-badge status-badge--review', 
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
