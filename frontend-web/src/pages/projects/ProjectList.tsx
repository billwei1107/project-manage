import { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Collapse, Stack, Grid } from '@mui/material';
import {
    Add as AddIcon,
} from '@mui/icons-material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FormatLineSpacingIcon from '@mui/icons-material/FormatLineSpacing';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { projectApi } from '../../api/projects';
import AddProjectModal from '../../components/projects/AddProjectModal';
import AddTaskModal from '../../components/projects/AddTaskModal';
import ProjectSidebar from '../../components/projects/ProjectSidebar';
import emptyTasksIllustration from '../../assets/empty_tasks.png';
import type { Task } from '../../types/project';
import { useProjectStore } from '../../stores/useProjectStore';

import {
    DndContext, closestCorners, KeyboardSensor, PointerSensor,
    useSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import DroppableKanbanColumn from '../../components/projects/DroppableKanbanColumn';
import TaskKanbanCard from '../../components/projects/TaskKanbanCard';
import TaskTimelineBoard from '../../components/projects/TaskTimelineBoard';
import TaskRowCard from '../../components/projects/TaskRowCard';
import TaskFilterDrawer from '../../components/projects/TaskFilterDrawer';

const KANBAN_COLUMNS = [
    { id: 'TODO', label: '待處理' },
    { id: 'DOING', label: '進行中' },
    { id: 'DONE', label: '已完成' }
];

export type TaskItem = Task & {
    spentTime?: string;
    priority?: 'low' | 'medium' | 'high';
    section?: 'active' | 'backlog';
    group?: string;
    startDay?: number;
    duration?: number;
};

export default function ProjectList() {
    const { projects, fetchProjects } = useProjectStore();
    const [activeProjectId, setActiveProjectId] = useState<string>('');
    
    // Modals & Drawers
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // View modes
    const [viewMode, setViewMode] = useState<'list' | 'board' | 'timeline'>('list');

    // Tasks State
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [collapsedGroups, setCollapsedGroups] = useState<string[]>(['Development']);
    
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {
        if (projects.length > 0 && !activeProjectId) {
            setActiveProjectId(projects[0].id);
        }
    }, [projects, activeProjectId]);

    useEffect(() => {
        if (activeProjectId) {
            projectApi.getTasks(activeProjectId)
                .then(tasksRes => {
                    setTasks(tasksRes.map(t => ({ ...t, section: 'active' } as TaskItem)));
                })
                .catch(err => console.error('Failed to fetch tasks:', err));
        } else {
            setTasks([]);
        }
    }, [activeProjectId]);

    const handleSaveProject = async (projectData: any) => {
        try {
            await projectApi.createProject(projectData);
            setIsProjectModalOpen(false);
            fetchProjects();
        } catch (err) {
            console.error('Failed to save project:', err);
            alert('儲存失敗 (Failed to save)');
        }
    };

    const handleSaveTask = async (taskData: any) => {
        try {
            if (!activeProjectId) return;
            await projectApi.createTask({
                title: taskData.taskName,
                status: 'TODO',
                projectId: activeProjectId
            });
            setIsAddTaskOpen(false);
            const tasksRes = await projectApi.getTasks(activeProjectId);
            setTasks(tasksRes.map(t => ({ ...t, section: 'active' } as TaskItem)));
        } catch (err) {
            console.error('Failed to create task:', err);
            alert('新增任務失敗');
        }
    };

    // Dnd-kit logic
    const findContainer = (itemId: string | null) => {
        if (!itemId) return null;
        if (itemId.includes('-')) {
            const [section, status] = itemId.split('-');
            if (['active', 'backlog'].includes(section) && KANBAN_COLUMNS.some(c => c.id === status)) {
                return itemId;
            }
        }
        const task = tasks.find(t => t.id === itemId);
        return task ? `${task.section}-${task.status}` : null;
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        const overId = over?.id;
        if (!overId || active.id === overId) return;

        const activeContainer = findContainer(active.id as string);
        const overContainer = findContainer(overId as string);

        if (!activeContainer || !overContainer || activeContainer === overContainer) return;

        const overSectionStr = overContainer.split('-')[0];
        const overStatusStr = overContainer.split('-')[1];

        setTasks((prev) => {
            const returnTasks = [...prev];
            const activeAbsIndex = returnTasks.findIndex(t => t.id === active.id);
            if (activeAbsIndex > -1) {
                returnTasks[activeAbsIndex] = {
                    ...returnTasks[activeAbsIndex],
                    section: overSectionStr as any,
                    status: overStatusStr as any
                };
            }
            return returnTasks;
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;

        const activeContainer = findContainer(active.id as string);
        const overContainer = findContainer(over.id as string);

        if (!activeContainer || !overContainer || activeContainer !== overContainer) return;

        const activeIndex = tasks.findIndex(t => t.id === active.id);
        const overIndex = tasks.findIndex(t => t.id === over.id);

        if (activeIndex !== overIndex) {
            setTasks((items) => arrayMove(items, activeIndex, overIndex));
        }

        const updatedTask = tasks.find(t => t.id === active.id);
        if (updatedTask && activeProjectId) {
            projectApi.updateTask(active.id as string, {
                status: overContainer.split('-')[1] as any
            }).catch(err => console.error('Failed to update task status API:', err));
        }
    };

    const renderListBoard = () => {
        const activeTasks = tasks.filter(t => t.section === 'active');
        const backlogTasks = tasks.filter(t => t.section === 'backlog');

        const toggleGroup = (groupName: string) => {
            setCollapsedGroups(prev => prev.includes(groupName) ? prev.filter(g => g !== groupName) : [...prev, groupName]);
        };

        const renderTaskGroup = (groupName: string, groupTasks: TaskItem[]) => {
            const isCollapsed = collapsedGroups.includes(groupName);
            return (
                <Box key={groupName} sx={{ mb: 4 }}>
                    <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer' }}
                        onClick={() => toggleGroup(groupName)}
                    >
                        {isCollapsed ? <KeyboardArrowDownIcon sx={{ color: '#3F8CFF', mr: 1 }} /> : <KeyboardArrowUpIcon sx={{ color: '#3F8CFF', mr: 1 }} />}
                        <Typography sx={{ color: '#3F8CFF', fontSize: 16, fontWeight: 600, fontFamily: 'Nunito Sans' }}>
                            {groupName} ({groupTasks.length} issues)
                        </Typography>
                    </Box>
                    <Collapse in={!isCollapsed}>
                        <Stack spacing={2}>
                            {groupTasks.map(t => <TaskRowCard key={t.id} task={t as any} />)}
                        </Stack>
                    </Collapse>
                </Box>
            );
        };

        const activeGroups: Record<string, TaskItem[]> = {};
        const activeUngrouped: TaskItem[] = [];
        activeTasks.forEach(t => {
            if (t.group) {
                if (!activeGroups[t.group]) activeGroups[t.group] = [];
                activeGroups[t.group].push(t);
            } else {
                activeUngrouped.push(t);
            }
        });

        const showHeaders = tasks.length > 1;

        return (
            <Box>
                {showHeaders && (
                    <Box sx={{ bgcolor: '#E6EDF5', borderRadius: '14px', py: 1, mb: 2 }}>
                        <Typography align="center" sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                            進行中的任務
                        </Typography>
                    </Box>
                )}

                {Object.entries(activeGroups).map(([groupName, groupTasks]) =>
                    renderTaskGroup(groupName, groupTasks)
                )}

                {activeUngrouped.length > 0 && (
                    <Stack spacing={2} sx={{ mb: 4 }}>
                        {activeUngrouped.map(t => (
                            <TaskRowCard key={t.id} task={{...t, assigneeAvatar: t.assignee?.avatar} as any} />
                        ))}
                    </Stack>
                )}

                {showHeaders && backlogTasks.length > 0 && (
                    <>
                        <Box sx={{ bgcolor: '#E6EDF5', borderRadius: '14px', py: 1, mb: 2 }}>
                            <Typography align="center" sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                                積壓任務 (Backlog)
                            </Typography>
                        </Box>
                        <Stack spacing={2}>
                            {backlogTasks.map(t => <TaskRowCard key={t.id} task={{...t, assigneeAvatar: t.assignee?.avatar} as any} />)}
                        </Stack>
                    </>
                )}
            </Box>
        );
    };

    const renderKanbanBoard = () => {
        const activeItem = activeId ? tasks.find(t => t.id === activeId) : null;
        return (
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                <Box>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        {KANBAN_COLUMNS.map(col => (
                            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={col.id}>
                                <Box sx={{ bgcolor: 'white', borderRadius: '24px', py: 0.5, px: 0.5, boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)' }}>
                                    <Box sx={{ bgcolor: '#F4F9FD', borderRadius: '24px', py: 1.5 }}>
                                        <Typography align="center" sx={{ color: '#0A1629', fontSize: 16, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                                            {col.label}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    <Grid container spacing={3} sx={{ mb: 4, alignItems: 'flex-start' }}>
                        {KANBAN_COLUMNS.map(col => {
                            const colTasks = tasks.filter(t => t.status === col.id && t.section === 'active');
                            return (
                                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={`active-${col.id}`}>
                                    <DroppableKanbanColumn id={`active-${col.id}`} tasks={colTasks as any} />
                                </Grid>
                            )
                        })}
                    </Grid>
                </Box>
                <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }) }}>
                    {activeItem ? <TaskKanbanCard task={activeItem as any} /> : null}
                </DragOverlay>
            </DndContext>
        );
    };

    return (
        <Box sx={{ 
            p: { xs: 2, md: 3 }, 
            minHeight: 'calc(100vh - 64px)',
            display: 'flex', 
            flexDirection: 'column', 
            bgcolor: '#F4F9FD'
        }}>
            
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography sx={{ color: '#0A1629', fontSize: { xs: 24, md: 36 }, fontWeight: 700, fontFamily: 'Nunito Sans' }}>
                    專案管理
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setIsProjectModalOpen(true)}
                        sx={{
                            bgcolor: '#3F8CFF',
                            color: '#fff',
                            borderRadius: '14px',
                            px: 3,
                            height: 48,
                            boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)',
                            fontWeight: 700,
                            fontFamily: 'Nunito Sans',
                            textTransform: 'none',
                            fontSize: 16,
                            '&:hover': { bgcolor: '#2e75e6' }
                        }}
                    >
                        新增專案
                    </Button>
                </Box>
            </Box>

            {/* Main Content Area */}
            <Box sx={{ display: 'flex', gap: 3, flex: 1, alignItems: 'flex-start' }}>
                
                {/* 側邊專案列表 */}
                <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'sticky', top: 24 }}>
                    <ProjectSidebar 
                        projects={projects} 
                        activeProjectId={activeProjectId} 
                        onSelectProject={setActiveProjectId} 
                    />
                </Box>

                {/* 任務看板或空狀態 */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {projects.length === 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, bgcolor: 'white', borderRadius: '24px', p: 4, boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)' }}>
                            <Box 
                                component="img" 
                                src={emptyTasksIllustration} 
                                alt="No Projects" 
                                sx={{ width: '100%', maxWidth: 300, height: 'auto', mb: 3 }} 
                            />
                            <Typography sx={{ color: '#0A1629', fontSize: 20, fontFamily: 'Nunito Sans', fontWeight: 800 }}>
                                尚未建立任何專案
                            </Typography>
                            <Typography sx={{ color: '#91929E', fontSize: 16, fontFamily: 'Nunito Sans', mt: 1 }}>
                                請點擊右上角的「新增專案」開始您的工作
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ 
                            display: 'flex', flexDirection: 'column', flex: 1,
                            ...(tasks.length === 0 && {
                                bgcolor: 'white', borderRadius: '24px', p: 4, boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)', alignItems: 'center', justifyContent: 'center'
                            })
                        }}>
                            
                            {/* Tasks Header Line with Add Task and Toggles */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: tasks.length === 0 ? 0 : 3, width: '100%' }}>
                                {tasks.length > 0 ? (
                                    <>
                                        <Typography sx={{ color: '#0A1629', fontSize: 22, fontFamily: 'Nunito Sans', fontWeight: 700 }}>
                                            任務列表
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                onClick={() => setIsAddTaskOpen(true)}
                                                sx={{
                                                    bgcolor: '#3F8CFF', color: 'white', borderRadius: '14px', textTransform: 'none', px: 2, py: 1,
                                                    fontSize: 14, fontWeight: 700, fontFamily: 'Nunito Sans', boxShadow: '0px 4px 12px rgba(63, 140, 255, 0.3)',
                                                    '&:hover': { bgcolor: '#3377E6' }
                                                }}
                                            >
                                                新增任務
                                            </Button>

                                            <IconButton onClick={() => setIsFilterOpen(true)} sx={{ bgcolor: 'white', borderRadius: '14px', width: 44, height: 44, boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)' }}>
                                                <FilterAltIcon sx={{ color: '#0A1629' }} />
                                            </IconButton>

                                            <Box sx={{ display: 'flex', bgcolor: 'white', p: 0.5, borderRadius: '14px', boxShadow: '0px 6px 58px rgba(195, 203, 214, 0.10)', gap: 0.5 }}>
                                                <IconButton onClick={() => setViewMode('list')} sx={{ borderRadius: '10px', bgcolor: viewMode === 'list' ? 'rgba(63, 140, 255, 0.10)' : 'transparent', color: viewMode === 'list' ? '#3F8CFF' : '#7D8592', width: 40, height: 40 }}>
                                                    <ViewListIcon />
                                                </IconButton>
                                                <IconButton onClick={() => setViewMode('board')} sx={{ borderRadius: '10px', bgcolor: viewMode === 'board' ? 'rgba(63, 140, 255, 0.10)' : 'transparent', color: viewMode === 'board' ? '#3F8CFF' : '#7D8592', width: 40, height: 40 }}>
                                                    <ViewColumnIcon />
                                                </IconButton>
                                                <IconButton onClick={() => setViewMode('timeline')} sx={{ borderRadius: '10px', bgcolor: viewMode === 'timeline' ? 'rgba(63, 140, 255, 0.10)' : 'transparent', color: viewMode === 'timeline' ? '#3F8CFF' : '#7D8592', width: 40, height: 40 }}>
                                                    <FormatLineSpacingIcon sx={{ transform: 'rotate(90deg)' }} />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </>
                                ) : (
                                    <Box sx={{ width: '100%' }}></Box>
                                )}
                            </Box>

                            {/* Kanban Board / List Content / Empty State */}
                            {tasks.length === 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                    <Box 
                                        component="img" 
                                        src={emptyTasksIllustration} 
                                        alt="No Tasks" 
                                        sx={{ width: '100%', maxWidth: 350, height: 'auto', mb: 3 }} 
                                    />
                                    <Typography sx={{ color: '#0A1629', fontSize: 20, fontFamily: 'Nunito Sans', fontWeight: 800, mb: 1, textAlign: 'center' }}>
                                        這個專案還沒有任何任務
                                    </Typography>
                                    <Typography sx={{ color: '#91929E', fontSize: 15, fontFamily: 'Nunito Sans', fontWeight: 600, mb: 4, textAlign: 'center' }}>
                                        （點擊下方按鈕新增任務）
                                    </Typography>
                                    <Button 
                                        variant="contained" 
                                        onClick={() => setIsAddTaskOpen(true)}
                                        startIcon={<AddIcon />} 
                                        sx={{ 
                                            bgcolor: '#3F8CFF', borderRadius: '14px', textTransform: 'none', fontWeight: 700, 
                                            fontFamily: 'Nunito Sans', fontSize: 16, px: 4, py: 1.5, 
                                            boxShadow: '0px 6px 12px rgba(63, 140, 255, 0.26)' 
                                        }}
                                    >
                                        新增任務
                                    </Button>
                                </Box>
                            ) : (
                                <>
                                    {viewMode === 'list' && renderListBoard()}
                                    {viewMode === 'board' && renderKanbanBoard()}
                                    {viewMode === 'timeline' && <TaskTimelineBoard tasks={tasks as any} />}
                                </>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Modals & Drawers */}
            <AddProjectModal
                open={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                onSubmit={handleSaveProject}
            />
            
            <AddTaskModal open={isAddTaskOpen} onClose={() => setIsAddTaskOpen(false)} onSubmit={handleSaveTask} />
            
            <TaskFilterDrawer open={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

        </Box>
    );
}
