import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/stores/auth-context';
import { getProjects, getProject } from 'api/zooprocess-api';
import { Button } from '@heroui/button';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Select,
  SelectItem,
} from '@heroui/react';
import { itemsFromProjects, type ProjectItem } from 'app/features/dashboard/items.ts';
import { ZooprocessIcon } from '../../../icons';
import { EyeIcon } from '@heroicons/react/24/outline';

const renderActionButton = (item: ProjectItem) => {
  const base = `/project/${item.project.id}/sample/${item.sample.id}/subsample/${item.subsample.id}`;
  const btns = [
    { icon: 'instrument' as const, label: 'Instrument' },
    { icon: 'process' as const, label: 'Process' },
    { icon: 'wave' as const, label: 'Wave' },
    { icon: 'upload' as const, label: 'Upload' },
  ];
  const activeIcon = btns.some(b => b.icon === item.icon)
    ? (item.icon as (typeof btns)[number]['icon'])
    : undefined;
  const activeIndex = activeIcon ? btns.findIndex(b => b.icon === activeIcon) : -1;
  return (
    <Link to={`${base}/Process`}>
      <Button
        size="sm"
        aria-label={item.buttonTitle ?? 'Process'}
        title={item.buttonTitle ?? 'Process'}
        className="flex items-center bg-gray-20"
      >
        <div className="flex items-center gap-0">
          {btns.map((b, i) => {
            const isActive = b.icon === activeIcon;
            const isBeforeActive = activeIndex >= 0 && i < activeIndex;
            const name = b.icon;
            const iconClass = isActive ? 'text-blue-700 opacity-80' : 'text-gray-500 opacity-50';
            const wrapClass = isActive
              ? 'p-0.5 bg-blue-300'
              : isBeforeActive
                ? 'p-0.5 bg-green-100'
                : 'p-0.5';
            return (
              <span key={b.icon} className={wrapClass}>
                <ZooprocessIcon name={name} size={32} className={iconClass} />
              </span>
            );
          })}
        </div>
      </Button>
    </Link>
  );
};

export const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { authState, logout } = useAuth();
  const [projectItems, setProjectItems] = useState<ProjectItem[]>([]);
  const [projectsIds, setProjectsIds] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URL query param sync
  const [searchParams, setSearchParams] = useSearchParams();
  const projectParam = searchParams.get('project');
  const [selectedProjectId, setSelectedProjectId] = useState<string | 'all'>(projectParam ?? 'all');

  type SelectOption = { id: string; name: string };
  const selectOptions: SelectOption[] = useMemo(
    () => [
      { id: 'all', name: 'All projects' },
      ...projectsIds.map(p => ({ id: p.id, name: p.name })),
    ],
    [projectsIds]
  );

  // Load shallow (id, name) list of projects for the selector
  useEffect(() => {
    const token = authState.accessToken!;
    getProjects(token, 1)
      .then(shallow => {
        setProjectsIds(shallow.map(p => ({ id: p.id, name: p.name })));
        // If URL contains an unknown project id, reset to 'all'
        if (projectParam && !shallow.find(p => p.id === projectParam)) {
          setSelectedProjectId('all');
        }
      })
      .catch(error => {
        setError(error.message);
      });
  }, [authState.accessToken]);

  // Load table items depending on selection
  useEffect(() => {
    const token = authState.accessToken!;
    setLoading(true);
    setError(null);
    const run = async () => {
      try {
        let items: ProjectItem[] = [];
        if (selectedProjectId === 'all') {
          const full = await getProjects(token);
          items = itemsFromProjects(full);
        } else if (selectedProjectId) {
          const proj = await getProject(token, selectedProjectId);
          items = itemsFromProjects([proj]);
        }
        // Sort items by subsample updatedAt in descending order (if available)
        items.sort((a, b) => {
          const dateA = a.subsample.updatedAt.getTime();
          const dateB = b.subsample.updatedAt.getTime();
          return dateB - dateA;
        });
        setProjectItems(items);
      } catch (error: any) {
        setProjectItems([]);
        setError(error.message ?? String(error));
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [authState.accessToken, selectedProjectId]);

  // Reflect local selection in URL whenever it changes
  useEffect(() => {
    if (selectedProjectId === 'all') {
      setSearchParams(params => {
        params.delete('project');
        return params;
      });
    } else if (selectedProjectId) {
      setSearchParams(params => {
        params.set('project', selectedProjectId);
        return params;
      });
    }
  }, [selectedProjectId, setSearchParams]);

  // Keep selection in sync if the user edits the URL manually
  useEffect(() => {
    const pid = searchParams.get('project');
    setSelectedProjectId(pid ?? 'all');
  }, [searchParams]);

  const handleLogout = () => {
    // Clear the auth state
    logout();
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button
            onPress={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {t('SettingsPage:Logout')}
          </Button>
        </div>

        {/* Project filter Select */}
        <div className="flex items-center gap-3">
          <Select
            label="Filter by project"
            selectedKeys={
              selectedProjectId === 'all' ? new Set(['all']) : new Set([selectedProjectId])
            }
            onSelectionChange={keys => {
              const key = Array.from(keys as Set<string>)[0];
              setSelectedProjectId(key || 'all');
            }}
            items={selectOptions}
            className="max-w-md"
          >
            {item => <SelectItem key={item.id}>{item.name}</SelectItem>}
          </Select>
        </div>
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
          <Table
            aria-label="Projects Table"
            isStriped
            isHeaderSticky
            classNames={{
              base: 'max-h-[90vh] overflow-y-auto',
              wrapper: 'p-0', // Default p-4 shows an ugly gap _above_ thead
            }}
          >
            <TableHeader>
              <TableColumn>Action</TableColumn>
              <TableColumn>State</TableColumn>
              <TableColumn>Subsample</TableColumn>
              <TableColumn>Sample</TableColumn>
              <TableColumn>Updated At</TableColumn>
              <TableColumn>{selectedProjectId ? '' : 'Project'}</TableColumn>
            </TableHeader>
            <TableBody emptyContent={!loading && 'No scan found'}>
              {projectItems.map((item, index) => (
                <TableRow
                  key={`${item.project.id}-${item.sample.id}-${item.subsample.id}-${index}`}
                >
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {item.viewable && (
                        <Link
                          to={`/project/${item.project.id}/sample/${item.sample.id}/subsample/${item.subsample.id}/View`}
                        >
                          <Button
                            isIconOnly
                            size="sm"
                            variant="solid"
                            color="primary"
                            radius="lg"
                            aria-label="View"
                            title="View"
                          >
                            <EyeIcon className="w-6 h-6" />
                          </Button>
                        </Link>
                      )}
                      {renderActionButton(item)}
                    </div>
                  </TableCell>
                  <TableCell>{item.stateLabel}</TableCell>
                  <TableCell>{item.subsample.name}</TableCell>
                  <TableCell>{item.sample.name}</TableCell>
                  <TableCell>
                    {item.subsample.updatedAt.toLocaleString(undefined, {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </TableCell>
                  <TableCell>{selectedProjectId ? '' : item.project.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
