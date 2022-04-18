import React from 'react';
import SuggestItem from './SuggestItem';
import styles from './header.module.css';

export default function SuggestList({ results = [] }) {
  return (
    <div
      className={`${styles.suggestList} z-10 bg-white shadow-lg w-full rounded-lg`}
    >
      {results.length ? (
        results.map((u, i) => <SuggestItem key={i} {...u} />)
      ) : (
        <div className='flex p-2 items-center justify-center'>No results</div>
      )}
    </div>
  );
}
