import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from '@/assets/icons/SearchIcon';

export const NewsSearchForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get('query') as string;

    const term = query?.trim();
    if (!term) return;

    event.currentTarget.reset();
    navigate(`/topic/${encodeURIComponent(term)}`);
  };

  return (
    <form
      className="d-flex bg-secondartransp w-75 w-md-50 w-lg-25 mt-3 ms-0 ms-lg-2 mt-lg-3 p-2 py-md-3 shadow-sm rounded-pill"
      role="search"
      onSubmit={handleSubmit}
    >
      <button className="btn btn-sm m-0 text-primary" type="submit">
        <SearchIcon />
      </button>
      <input
        style={{ fontSize: '1.1rem' }}
        className="form-control bg-transparent p-0"
        type="search"
        placeholder="search today's news by terms"
        aria-label="Search"
        name="query"
      />
    </form>
  );
};
