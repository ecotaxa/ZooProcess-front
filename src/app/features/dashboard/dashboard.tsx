import React, { useState, useEffect, type FC } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/stores/auth-context';
import { getProjects } from 'api/zooprocess-api';
import { Button } from '@heroui/button';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react';
import { itemsFromProjects, type ProjectItem } from 'app/features/dashboard/items.ts';

export const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { authState, logout } = useAuth();
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProjects(authState.accessToken!)
      .then(response => {
        const items = itemsFromProjects(response);
        // Sort items by subsample updatedAt in descending order (if available)
        items.sort((a, b) => {
          const dateA = a.subsample.updatedAt.getTime();
          const dateB = b.subsample.updatedAt.getTime();
          return dateB - dateA;
        });
        setProjectItems(items);
      })
      .catch(error => {
        setProjectItems([]);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authState.accessToken]); // Add authState.accessToken as a dependency

  const handleLogout = () => {
    // Clear the auth state
    logout();
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button
          onPress={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {t('SettingsPage:Logout')}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading projects...</p>
        </div>
      ) : null}
      {error ? (
        <div className="text-center py-4">
          <p className="text-red-500">{error}</p>
        </div>
      ) : null}
      {!error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table aria-label="Projects Table" isStriped={true}>
              <TableHeader>
                <TableColumn>Action</TableColumn>
                <TableColumn>State</TableColumn>
                <TableColumn>Subsample</TableColumn>
                <TableColumn>Sample</TableColumn>
                <TableColumn>Updated At</TableColumn>
                <TableColumn>Project</TableColumn>
              </TableHeader>
              <TableBody emptyContent={!loading && 'No projects found'}>
                {projectItems.map((item, index) => (
                  <TableRow
                    key={`${item.project.id}-${item.sample.id}-${item.subsample.id}-${index}`}
                  >
                    <TableCell>
                      <div className="flex space-x-2">
                        {item.actions.map((action: string) => (
                          <Link
                            key={action}
                            to={`/project/${item.project.id}/sample/${item.sample.id}/subsample/${item.subsample.id}/${action}`}
                          >
                            <Button
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded-md transition-colors"
                            >
                              {action}
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{item.state}</TableCell>
                    <TableCell>{item.subsample.name}</TableCell>
                    <TableCell>{item.sample.name}</TableCell>
                    <TableCell>{item.subsample.updatedAt.toLocaleDateString()}</TableCell>
                    <TableCell>{item.project.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
