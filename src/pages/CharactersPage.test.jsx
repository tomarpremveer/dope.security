import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CharactersPage } from '../pages/CharactersPage';
import * as mockApi from '../api/mockApi';

vi.mock('../api/mockApi');

describe('CharactersPage - Table Functionality', () => {
    const mockData = [
        { id: 1, name: 'Character 1', location: 'Location A', health: 'Healthy', power: 100 },
        { id: 2, name: 'Character 2', location: 'Location B', health: 'Injured', power: 200 },
        { id: 3, name: 'Character 3', location: 'Location C', health: 'Critical', power: 150 },
        { id: 4, name: 'Test Character', location: 'Location D', health: 'Healthy', power: 300 },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        mockApi.fetchData.mockResolvedValue(mockData);
    });

    describe('Search Functionality', () => {
        it('should filter data when typing in search input', async () => {
            render(<CharactersPage />);

            await waitFor(() => {
                expect(screen.getByText('Character 1')).toBeInTheDocument();
            });
            const searchInput = screen.getByPlaceholderText('Search Characters...');
            await userEvent.type(searchInput, 'Test');

            await waitFor(() => {
                expect(mockApi.fetchData).toHaveBeenCalledWith(
                    expect.objectContaining({
                        search: 'Test'
                    })
                );
            });
        });

        it('should update row count when search is applied', async () => {
            mockApi.fetchData.mockResolvedValueOnce(mockData).mockResolvedValueOnce([mockData[3]]);

            render(<CharactersPage />);

            await waitFor(() => {
                expect(screen.getByText('4 rows found')).toBeInTheDocument();
            });

            const searchInput = screen.getByPlaceholderText('Search Characters...');
            await userEvent.type(searchInput, 'Test');

            await waitFor(() => {
                expect(screen.getByText('1 rows found')).toBeInTheDocument();
            });
        });
    });

    describe('Sorting Functionality', () => {
        it('should sort data when clicking Power column header', async () => {
            render(<CharactersPage />);

            await waitFor(() => {
                expect(screen.getByText('Character 1')).toBeInTheDocument();
            });

            const powerSortButton = screen.getByLabelText(/Sort by Power/i);
            await userEvent.click(powerSortButton);

            await waitFor(() => {
                expect(mockApi.fetchData).toHaveBeenCalledWith(
                    expect.objectContaining({
                        sort: expect.objectContaining({
                            key: 'power',
                            direction: 'asc'
                        })
                    })
                );
            });
        });

        it('should toggle sort direction on second click', async () => {
            render(<CharactersPage />);

            await waitFor(() => {
                expect(screen.getByText('Character 1')).toBeInTheDocument();
            });

            const powerSortButton = screen.getByLabelText(/Sort by Power/i);

            await userEvent.click(powerSortButton);

            await waitFor(() => {
                expect(mockApi.fetchData).toHaveBeenCalledWith(
                    expect.objectContaining({
                        sort: expect.objectContaining({ direction: 'asc' })
                    })
                );
            });

            await userEvent.click(powerSortButton);

            await waitFor(() => {
                expect(mockApi.fetchData).toHaveBeenCalledWith(
                    expect.objectContaining({
                        sort: expect.objectContaining({ direction: 'desc' })
                    })
                );
            });
        });
    });

    describe('Filter Functionality', () => {
        it('should open filter dropdown when clicking filter icon', async () => {
            render(<CharactersPage />);

            await waitFor(() => {
                expect(screen.getByText('Character 1')).toBeInTheDocument();
            });

            const filterButton = screen.getByLabelText('Filter Health');
            await userEvent.click(filterButton);

            await waitFor(() => {
                expect(screen.getByText('Healthy')).toBeInTheDocument();
                expect(screen.getByText('Injured')).toBeInTheDocument();
                expect(screen.getByText('Critical')).toBeInTheDocument();
            });
        });

        it('should filter data when selecting filter option', async () => {
            render(<CharactersPage />);

            await waitFor(() => {
                expect(screen.getByText('Character 1')).toBeInTheDocument();
            });

            const filterButton = screen.getByLabelText('Filter Health');
            await userEvent.click(filterButton);

            const healthyCheckbox = screen.getByRole('checkbox', { name: /Healthy/i });
            await userEvent.click(healthyCheckbox);

            await waitFor(() => {
                expect(mockApi.fetchData).toHaveBeenCalledWith(
                    expect.objectContaining({
                        filter: expect.objectContaining({
                            health: expect.arrayContaining(['Healthy'])
                        })
                    })
                );
            });
        });
    });

    describe('Row Selection', () => {
        it('should select individual rows when clicking checkboxes', async () => {
            render(<CharactersPage />);

            await waitFor(() => {
                expect(screen.getByText('Character 1')).toBeInTheDocument();
            });

            const checkboxes = screen.getAllByRole('checkbox');
            const firstRowCheckbox = checkboxes[1];

            await userEvent.click(firstRowCheckbox);

            expect(screen.getByText(/Mark as Viewed \(1\)/i)).toBeInTheDocument();
            expect(screen.getByText(/Mark as Viewed \(1\)/i)).toBeInTheDocument();
        });

        it('should select all rows when clicking select all checkbox', async () => {
            render(<CharactersPage />);

            await waitFor(() => {
                expect(screen.getByText('Character 1')).toBeInTheDocument();
            });

            const selectAllCheckbox = screen.getByLabelText('Select all rows');
            await userEvent.click(selectAllCheckbox);

            await waitFor(() => {
                expect(screen.getByText(/Mark as Viewed \(4\)/i)).toBeInTheDocument();
            });
        });
    });

    describe('Viewed/Unviewed Functionality', () => {
        it('should console log selected IDs when marking as viewed', async () => {
            const consoleSpy = vi.spyOn(console, 'log');

            render(<CharactersPage />);

            await waitFor(() => {
                expect(screen.getByText('Character 1')).toBeInTheDocument();
            });

            const checkboxes = screen.getAllByRole('checkbox');
            await userEvent.click(checkboxes[1]);

            const markViewedButton = screen.getByRole('button', { name: /Mark selected rows as viewed/i });
            await userEvent.click(markViewedButton);

            expect(consoleSpy).toHaveBeenCalledWith('Marking as viewed - Selected IDs:', expect.arrayContaining([1]));

            consoleSpy.mockRestore();
        });

        it('should console log selected IDs when marking as unviewed', async () => {
            const consoleSpy = vi.spyOn(console, 'log');

            render(<CharactersPage />);

            await waitFor(() => {
                expect(screen.getByText('Character 1')).toBeInTheDocument();
            });

            const checkboxes = screen.getAllByRole('checkbox');
            await userEvent.click(checkboxes[1]);

            const markUnviewedButton = screen.getByRole('button', { name: /Mark selected rows as unviewed/i });
            await userEvent.click(markUnviewedButton);

            expect(consoleSpy).toHaveBeenCalledWith('Marking as unviewed - Selected IDs:', expect.arrayContaining([1]));

            consoleSpy.mockRestore();
        });

        it('should work correctly with filters applied', async () => {
            const consoleSpy = vi.spyOn(console, 'log');

            const filteredData = [mockData[0], mockData[3]];
            mockApi.fetchData.mockResolvedValueOnce(mockData).mockResolvedValueOnce(filteredData);

            render(<CharactersPage />);

            await waitFor(() => {
                expect(screen.getByText('Character 1')).toBeInTheDocument();
            });

            const filterButton = screen.getByLabelText('Filter Health');
            await userEvent.click(filterButton);
            const healthyCheckbox = screen.getByRole('checkbox', { name: /Healthy/i });
            await userEvent.click(healthyCheckbox);

            await waitFor(() => {
                expect(screen.getByText('2 rows found')).toBeInTheDocument();
            });

            const checkboxes = screen.getAllByRole('checkbox');
            await userEvent.click(checkboxes[1]);
            const markViewedButton = screen.getByRole('button', { name: /Mark selected rows as viewed/i });
            await userEvent.click(markViewedButton);
            expect(consoleSpy).toHaveBeenCalledWith('Marking as viewed - Selected IDs:', expect.any(Array));

            consoleSpy.mockRestore();
        });

        it('should show warning when no rows are selected', async () => {
            const consoleWarnSpy = vi.spyOn(console, 'warn');

            render(<CharactersPage />);

            await waitFor(() => {
                expect(screen.getByText('Character 1')).toBeInTheDocument();
            });

            const markViewedButton = screen.getByRole('button', { name: /Mark selected rows as viewed/i });
            await userEvent.click(markViewedButton);

            expect(consoleWarnSpy).toHaveBeenCalledWith('No rows selected');

            consoleWarnSpy.mockRestore();
        });
    });

    describe('Loading State', () => {
        it('should show loading spinner while fetching data', async () => {
            // Make the API call take longer
            mockApi.fetchData.mockImplementation(() =>
                new Promise(resolve => setTimeout(() => resolve(mockData), 100))
            );

            render(<CharactersPage />);

            expect(screen.getByText('Loading data...')).toBeInTheDocument();

            await waitFor(() => {
                expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
            });
        });
    });
});
