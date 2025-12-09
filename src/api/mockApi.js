import { MOCK_DATA } from '../data/mockData';
import { SORT_DIRECTION } from '../constants';

export const fetchData = ({ filter = {}, sort = null, search = '' }) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let filteredData = [...MOCK_DATA];

            // 1. Global Search
            if (search) {
                const query = search.toLowerCase();
                filteredData = filteredData.filter(item =>
                    Object.values(item).some(val =>
                        String(val).toLowerCase().includes(query)
                    )
                );
            }

            // 2. Column Filters
            Object.entries(filter).forEach(([key, selectedOptions]) => {
                if (selectedOptions && selectedOptions.length > 0) {
                    filteredData = filteredData.filter(item => selectedOptions.includes(item[key]));
                }
            });

            // 3. Sorting
            if (sort && sort.key) {
                filteredData.sort((a, b) => {
                    if (a[sort.key] < b[sort.key]) {
                        return sort.direction === SORT_DIRECTION.ASC ? -1 : 1;
                    }
                    if (a[sort.key] > b[sort.key]) {
                        return sort.direction === SORT_DIRECTION.ASC ? 1 : -1;
                    }
                    return 0;
                });
            }

            resolve(filteredData);
        }, 800); // Simulate network delay - increased for visible loading state
    });
};
