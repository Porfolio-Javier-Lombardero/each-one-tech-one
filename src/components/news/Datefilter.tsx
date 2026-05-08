import { DateFilterType } from '@/services/news/interfaces/d.news.types';


interface Props {
    setDateFilter: (date:DateFilterType)=> void;
    dateFilter:DateFilterType;
    value?: string|number
}

export const Datefilter = ({setDateFilter, dateFilter, value}: Props) => {

   
  return (
    <div>
           {value === "Smartphones" ? (
            <div className="col-12 d-flex ps-2 pt-3 pb-0  mb-0">
              <button
                className={`btn btn-outline-primary d-none d-sm-inline ms-2 active text-secondary`}
                onClick={() => setDateFilter('all')}
              >
                Last 14 days
              </button>
              <button
                className={`btn btn-outline-primary d-none d-sm-inline ms-2`}
                onClick={() => setDateFilter('yesterday')}
                disabled
              >
                Yesterday
              </button>
              <button
                className={`btn btn-outline-primary d-none d-sm-inline ms-2 `}
                onClick={() => setDateFilter('lastWeek')}
                disabled
              >
                Older
              </button>
              <button
                className={`btn btn-outline-primary btn-sm d-inline d-sm-none ms-2 ${dateFilter === 'today' ? 'active text-secondary' : ''}`}
                onClick={() => setDateFilter('all')}
              >
                Last 14 days
              </button>
              <button
                className={`btn btn-outline-primary btn-sm d-inline d-sm-none ms-2`}
                onClick={() => setDateFilter('yesterday')}
                disabled
              >
                Yesterday
              </button>
              <button
                className={`btn btn-outline-primary btn-sm d-inline d-sm-none ms-2 `}
                onClick={() => setDateFilter('lastWeek')}
                disabled
              >
                Older
              </button>
            </div>)
            :
            (<div className="col-12 d-flex ps-2 pt-3 pb-0  mb-0">
              <button
                className={`btn btn-outline-primary d-none d-sm-inline ms-2 ${dateFilter === 'today' ? 'active text-secondary' : ''}`}
                onClick={() => setDateFilter('today')}
              >
                Today
              </button>
              <button
                className={`btn btn-outline-primary d-none d-sm-inline ms-2 ${dateFilter === 'yesterday' ? 'active text-secondary' : ''}`}
                onClick={() => setDateFilter('yesterday')}
              >
                Yesterday
              </button>
              <button
                className={`btn btn-outline-primary d-none d-sm-inline ms-2 ${dateFilter === 'lastWeek' ? 'active text-secondary' : ''}`}
                onClick={() => setDateFilter('lastWeek')}
              >
                Older
              </button>
              <button
                className={`btn btn-outline-primary btn-sm d-inline d-sm-none ms-2 ${dateFilter === 'today' ? 'active text-secondary' : ''}`}
                onClick={() => setDateFilter('today')}
              >
                Today
              </button>
              <button
                className={`btn btn-outline-primary btn-sm d-inline d-sm-none ms-2 ${dateFilter === 'yesterday' ? 'active text-secondary' : ''}`}
                onClick={() => setDateFilter('yesterday')}
              >
                Yesterday
              </button>
              <button
                className={`btn btn-outline-primary btn-sm d-inline d-sm-none ms-2 ${dateFilter === 'lastWeek' ? 'active text-secondary' : ''}`}
                onClick={() => setDateFilter('lastWeek')}
              >
                Older
              </button>
            </div>)

          }
    </div>
  )
}
