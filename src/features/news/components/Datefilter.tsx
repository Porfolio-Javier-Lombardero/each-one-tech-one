import { DateFilterType } from '@/domain/Article';

interface ButtonProps {
    label: string;
    filter: DateFilterType;
    active: boolean;
    disabled?: boolean;
    onClick: (f: DateFilterType) => void;
}

const DateFilterButton = ({ label, filter, active, disabled = false, onClick }: ButtonProps) => (
    <>
        <button
            className={`btn btn-outline-primary d-none d-sm-inline ms-2${active ? ' active text-secondary' : ''}`}
            onClick={() => onClick(filter)}
            disabled={disabled}
        >
            {label}
        </button>
        <button
            className={`btn btn-outline-primary btn-sm d-inline d-sm-none ms-2${active ? ' active text-secondary' : ''}`}
            onClick={() => onClick(filter)}
            disabled={disabled}
        >
            {label}
        </button>
    </>
);

export type DateFilterMode = 'standard' | 'smartphones';

interface Props {
    setDateFilter: (date: DateFilterType) => void;
    dateFilter: DateFilterType;
    mode?: DateFilterMode;
}

export const Datefilter = ({ setDateFilter, dateFilter, mode = 'standard' }: Props) => (
    <div className="col-12 d-flex ps-2 pt-3 pb-0 mb-0">
        {mode === 'smartphones' ? (
            <>
                <DateFilterButton label="Last 14 days" filter="all"       active={dateFilter === 'all'}       onClick={setDateFilter} />
                <DateFilterButton label="Yesterday"    filter="yesterday" active={false}                      onClick={setDateFilter} disabled />
                <DateFilterButton label="Older"        filter="lastWeek"  active={false}                      onClick={setDateFilter} disabled />
            </>
        ) : (
            <>
                <DateFilterButton label="Today"     filter="today"     active={dateFilter === 'today'}     onClick={setDateFilter} />
                <DateFilterButton label="Yesterday" filter="yesterday" active={dateFilter === 'yesterday'} onClick={setDateFilter} />
                <DateFilterButton label="Older"     filter="lastWeek"  active={dateFilter === 'lastWeek'}  onClick={setDateFilter} />
            </>
        )}
    </div>
);
