'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const buttons = [
  {
    label: 'All cabins',
    value: 'all',
  },
  {
    label: '1 - 3 guests',
    value: 'small',
  },
  {
    label: '4 - 7 guests',
    value: 'medium',
  },
  {
    label: '8 - 12 guests',
    value: 'large',
  },
];

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function handleFilter(filter) {
    const params = new URLSearchParams(searchParams);
    params.set('capacity', filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const activeFilter = searchParams.get('capacity') ?? 'all';

  return (
    <div className="border border-primary-800 flex">
      {buttons.map((btn) => (
        <Button
          key={btn.value}
          btn={btn}
          handleFilter={handleFilter}
          activeFilter={activeFilter}
        />
      ))}
    </div>
  );
}

function Button({ btn, handleFilter, activeFilter }) {
  return (
    <button
      key={btn.value}
      className={`${
        btn.value === activeFilter ? 'bg-primary-700 text-primary-50' : ''
      } px-5 py-2 hover:bg-primary-700`}
      onClick={() => handleFilter(btn.value)}
    >
      {btn.label}
    </button>
  );
}

export default Filter;
